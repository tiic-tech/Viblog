/**
 * MiniMax Provider Adapter
 *
 * Chinese LLM provider with large context windows.
 * Supports: streaming, structured_output
 *
 * API Reference: https://www.minimaxi.com/document/
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
 * MiniMax API response types
 */
interface MiniMaxChatResponse {
  id: string
  choices: Array<{
    index: number
    text: string
    finish_reason: string
  }>
  usage: {
    total_tokens: number
  }
}

/**
 * MiniMax provider adapter implementation
 */
export class MiniMaxAdapter extends BaseProviderAdapter {
  readonly providerId = 'minimax'
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
    const url = this.buildUrl(context.baseUrl || 'https://api.minimax.chat/v1', '/text/chatcompletion_v2')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      stream: false,
    }

    const response = await this.makeRequest<MiniMaxChatResponse>(
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
      content: choice.text,
      model: model.modelId,
      usage: {
        inputTokens: 0,
        outputTokens: response.usage.total_tokens,
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
    const url = this.buildUrl(context.baseUrl || 'https://api.minimax.chat/v1', '/text/chatcompletion_v2')
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
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const jsonStr = trimmed.slice(6)
          try {
            const chunk = JSON.parse(jsonStr)
            if (chunk.choices?.[0]?.delta?.content) {
              yield {
                delta: chunk.choices[0].delta.content,
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
        { ...context, apiKey, model: { modelId: 'abab5.5s-chat' } as LLMModel }
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
        id: 'abab6.5s-chat',
        providerId: this.providerId,
        modelId: 'abab6.5s-chat',
        displayName: 'ABAB 6.5s Chat',
        capabilities: this.capabilities,
        contextWindow: 245000,
        maxOutputTokens: 16384,
        inputPricePer1k: 0.001,
        outputPricePer1k: 0.001,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
      {
        id: 'abab5.5s-chat',
        providerId: this.providerId,
        modelId: 'abab5.5s-chat',
        displayName: 'ABAB 5.5s Chat',
        capabilities: this.capabilities,
        contextWindow: 8192,
        maxOutputTokens: 4096,
        inputPricePer1k: 0.0005,
        outputPricePer1k: 0.0005,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
    ]
  }

  /**
   * Build headers for MiniMax requests
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
  private mapFinishReason(reason: string): ChatResponse['finishReason'] {
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