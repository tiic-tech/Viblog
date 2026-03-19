/**
 * OpenRouter Provider Adapter
 *
 * Gateway to 100+ LLM models from various providers.
 * Supports: streaming (structured output varies by underlying model)
 *
 * API Reference: https://openrouter.ai/docs
 */

import type {
  ChatCompletionOptions,
  ChatMessage,
  ChatResponse,
  LLMModel,
  LLMProviderCapabilities,
  ProviderAdapterContext,
  StreamChunk,
  StructuredOutputOptions,
} from '../types'
import { BaseProviderAdapter } from '../adapter-base'

/**
 * OpenRouter API response types (OpenAI-compatible)
 */
interface OpenRouterChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string | null
    }
    finish_reason: string | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * OpenRouter provider adapter implementation
 */
export class OpenRouterAdapter extends BaseProviderAdapter {
  readonly providerId = 'openrouter'
  readonly capabilities: LLMProviderCapabilities = {
    streaming: true,
    structured_output: false, // Varies by underlying model
    vision: true,
  }

  /**
   * Perform a chat completion request
   */
  async chat(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): Promise<ChatResponse> {
    const url = this.buildUrl(context.baseUrl || 'https://openrouter.ai/api/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      stream: false,
    }

    const response = await this.makeRequest<OpenRouterChatResponse>(
      url,
      {
        method: 'POST',
        headers: this.buildHeaders(context.apiKey),
        body: JSON.stringify(body),
      },
      context
    )

    const choice = response.choices[0]
    return {
      content: choice.message.content || '',
      model: response.model,
      usage: {
        inputTokens: response.usage.prompt_tokens,
        outputTokens: response.usage.completion_tokens,
      },
      finishReason: this.mapFinishReason(choice.finish_reason),
    }
  }

  /**
   * Perform a streaming chat completion request
   */
  async *chatStream(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): AsyncIterable<StreamChunk> {
    const url = this.buildUrl(context.baseUrl || 'https://openrouter.ai/api/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      stream: true,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders(context.apiKey),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw this.handleHttpError(response.status, errorBody)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw this.createError('No response body', 'NETWORK_ERROR')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === 'data: [DONE]') continue
          if (!trimmed.startsWith('data: ')) continue

          const jsonStr = trimmed.slice(6)
          try {
            const chunk = JSON.parse(jsonStr)
            const choice = chunk.choices[0]

            if (choice?.delta?.content) {
              yield {
                delta: choice.delta.content,
                finishReason: choice.finish_reason
                  ? this.mapFinishReason(choice.finish_reason)
                  : undefined,
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * Perform a structured output request
   */
  async structuredOutput<T>(
    options: StructuredOutputOptions<T>,
    context: ProviderAdapterContext
  ): Promise<T> {
    // OpenRouter doesn't guarantee structured output
    // Use JSON mode hint and parse
    const response = await this.chat(options, context)

    try {
      return JSON.parse(response.content) as T
    } catch {
      throw this.createError('Failed to parse structured output', 'PROVIDER_ERROR')
    }
  }

  /**
   * Validate API key
   */
  async validateApiKey(
    apiKey: string,
    context: Omit<ProviderAdapterContext, 'model'>
  ): Promise<boolean> {
    try {
      const url = this.buildUrl(context.baseUrl || 'https://openrouter.ai/api/v1', '/models')
      await this.makeRequest<{ data: unknown[] }>(
        url,
        {
          method: 'GET',
          headers: this.buildHeaders(apiKey),
        },
        { ...context, apiKey, model: {} as LLMModel }
      )
      return true
    } catch {
      return false
    }
  }

  /**
   * Get available models
   */
  async getModels(
    context: Omit<ProviderAdapterContext, 'model'>
  ): Promise<LLMModel[]> {
    const url = this.buildUrl(context.baseUrl || 'https://openrouter.ai/api/v1', '/models')
    const response = await this.makeRequest<{
      data: Array<{
        id: string
        name: string
        context_length: number
        pricing: {
          prompt: string
          completion: string
        }
      }>
    }>(
      url,
      {
        method: 'GET',
        headers: this.buildHeaders(context.apiKey),
      },
      { ...context, apiKey: context.apiKey, model: {} as LLMModel }
    )

    // Return popular models
    const popularModels = [
      'openai/gpt-4o',
      'anthropic/claude-sonnet-4',
      'google/gemini-2.0-flash-001',
      'deepseek/deepseek-chat',
    ]

    return response.data
      .filter((m) => popularModels.includes(m.id))
      .map((m) => ({
        id: m.id,
        providerId: this.providerId,
        modelId: m.id,
        displayName: m.name,
        capabilities: this.capabilities,
        contextWindow: m.context_length,
        maxOutputTokens: 4096,
        inputPricePer1k: parseFloat(m.pricing.prompt) * 1000,
        outputPricePer1k: parseFloat(m.pricing.completion) * 1000,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      }))
  }

  /**
   * Build headers for OpenRouter requests
   */
  protected buildHeaders(apiKey: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://viblog.app',
      'X-Title': 'Viblog',
    }
  }

  /**
   * Format messages for API
   */
  private formatMessages(messages: ChatMessage[]): Array<{ role: string; content: string }> {
    return messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))
  }

  /**
   * Map finish reasons
   */
  private mapFinishReason(reason: string | null): ChatResponse['finishReason'] {
    switch (reason) {
      case 'stop':
        return 'stop'
      case 'length':
        return 'length'
      default:
        return 'stop'
    }
  }
}