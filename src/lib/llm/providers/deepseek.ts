/**
 * DeepSeek Provider Adapter
 *
 * Chinese LLM provider with competitive pricing.
 * Supports: streaming, structured_output
 *
 * API Reference: https://platform.deepseek.com/api-docs/
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
 * DeepSeek API response types (OpenAI-compatible)
 */
interface DeepSeekChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string | null
      reasoning_content?: string
    }
    finish_reason: string | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    prompt_cache_hit_tokens?: number
    prompt_cache_miss_tokens?: number
  }
}

/**
 * DeepSeek provider adapter implementation
 * Uses OpenAI-compatible API format
 */
export class DeepSeekAdapter extends BaseProviderAdapter {
  readonly providerId = 'deepseek'
  readonly capabilities: LLMProviderCapabilities = {
    streaming: true,
    structured_output: true,
    vision: false,
  }

  /**
   * Perform a chat completion request
   */
  async chat(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): Promise<ChatResponse> {
    const url = this.buildUrl(context.baseUrl || 'https://api.deepseek.com/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      stream: false,
    }

    const response = await this.makeRequest<DeepSeekChatResponse>(
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
    const url = this.buildUrl(context.baseUrl || 'https://api.deepseek.com/v1', '/chat/completions')
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

            if (chunk.usage) {
              yield {
                delta: '',
                usage: {
                  inputTokens: chunk.usage.prompt_tokens,
                  outputTokens: chunk.usage.completion_tokens,
                },
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
    // DeepSeek supports JSON mode
    const url = this.buildUrl(context.baseUrl || 'https://api.deepseek.com/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      response_format: { type: 'json_object' },
      stream: false,
    }

    const response = await this.makeRequest<DeepSeekChatResponse>(
      url,
      {
        method: 'POST',
        headers: this.buildHeaders(context.apiKey),
        body: JSON.stringify(body),
      },
      context
    )

    const content = response.choices[0].message.content
    if (!content) {
      throw this.createError('Empty response', 'PROVIDER_ERROR')
    }

    try {
      return JSON.parse(content) as T
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
      const url = this.buildUrl(context.baseUrl || 'https://api.deepseek.com/v1', '/models')
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
    _context: Omit<ProviderAdapterContext, 'model'>
  ): Promise<LLMModel[]> {
    return [
      {
        id: 'deepseek-chat',
        providerId: this.providerId,
        modelId: 'deepseek-chat',
        displayName: 'DeepSeek Chat',
        capabilities: this.capabilities,
        contextWindow: 64000,
        maxOutputTokens: 4096,
        inputPricePer1k: 0.00014,
        outputPricePer1k: 0.00028,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
      {
        id: 'deepseek-reasoner',
        providerId: this.providerId,
        modelId: 'deepseek-reasoner',
        displayName: 'DeepSeek Reasoner (R1)',
        capabilities: this.capabilities,
        contextWindow: 64000,
        maxOutputTokens: 8192,
        inputPricePer1k: 0.00055,
        outputPricePer1k: 0.00219,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
    ]
  }

  /**
   * Build headers for DeepSeek requests
   */
  protected buildHeaders(apiKey: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
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