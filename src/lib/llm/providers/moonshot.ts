/**
 * Moonshot AI Provider Adapter
 *
 * Chinese LLM provider known for long context.
 * Supports: streaming, structured_output
 *
 * API Reference: https://platform.moonshot.cn/docs/
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
 * Moonshot API response types (OpenAI-compatible)
 */
interface MoonshotChatResponse {
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
 * Moonshot provider adapter implementation
 */
export class MoonshotAdapter extends BaseProviderAdapter {
  readonly providerId = 'moonshot'
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
    const url = this.buildUrl(context.baseUrl || 'https://api.moonshot.cn/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      stream: false,
    }

    const response = await this.makeRequest<MoonshotChatResponse>(
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
    const url = this.buildUrl(context.baseUrl || 'https://api.moonshot.cn/v1', '/chat/completions')
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
      await this.chat(
        { messages: [{ role: 'user', content: 'hi' }], maxTokens: 1 },
        { ...context, apiKey, model: { modelId: 'moonshot-v1-8k' } as LLMModel }
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
        id: 'moonshot-v1-8k',
        providerId: this.providerId,
        modelId: 'moonshot-v1-8k',
        displayName: 'Moonshot V1 8K',
        capabilities: this.capabilities,
        contextWindow: 8192,
        maxOutputTokens: 4096,
        inputPricePer1k: 0.0015,
        outputPricePer1k: 0.0015,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
      {
        id: 'moonshot-v1-32k',
        providerId: this.providerId,
        modelId: 'moonshot-v1-32k',
        displayName: 'Moonshot V1 32K',
        capabilities: this.capabilities,
        contextWindow: 32768,
        maxOutputTokens: 4096,
        inputPricePer1k: 0.003,
        outputPricePer1k: 0.003,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
      {
        id: 'moonshot-v1-128k',
        providerId: this.providerId,
        modelId: 'moonshot-v1-128k',
        displayName: 'Moonshot V1 128K',
        capabilities: this.capabilities,
        contextWindow: 131072,
        maxOutputTokens: 4096,
        inputPricePer1k: 0.006,
        outputPricePer1k: 0.006,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
    ]
  }

  /**
   * Build headers for Moonshot requests
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