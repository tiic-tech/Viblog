/**
 * Google Gemini Provider Adapter
 *
 * Google's LLM with large context windows and vision.
 * Supports: streaming, structured_output, vision
 *
 * API Reference: https://ai.google.dev/tutorials/rest_quickstart
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
 * Gemini API response types
 */
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text?: string }>
      role: string
    }
    finishReason: string
  }>
  usageMetadata: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

/**
 * Gemini provider adapter implementation
 */
export class GeminiAdapter extends BaseProviderAdapter {
  readonly providerId = 'google'
  readonly capabilities: LLMProviderCapabilities = {
    streaming: true,
    structured_output: true,
    vision: true,
  }

  /**
   * Perform a chat completion request
   */
  async chat(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): Promise<ChatResponse> {
    const model = context.model
    const modelId = options.model || model.modelId
    const url = `${context.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${modelId}:generateContent?key=${context.apiKey}`

    const body = {
      contents: this.formatMessages(options.messages),
      generationConfig: this.buildGenerationConfig(options, model),
    }

    const response = await this.makeRequest<GeminiResponse>(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      context
    )

    const candidate = response.candidates[0]
    const text = candidate.content.parts
      .map((p) => p.text || '')
      .join('')

    return {
      content: text,
      model: modelId,
      usage: {
        inputTokens: response.usageMetadata.promptTokenCount,
        outputTokens: response.usageMetadata.candidatesTokenCount,
      },
      finishReason: this.mapFinishReason(candidate.finishReason),
    }
  }

  /**
   * Perform a streaming chat completion request
   */
  async *chatStream(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): AsyncIterable<StreamChunk> {
    const model = context.model
    const modelId = options.model || model.modelId
    const url = `${context.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${modelId}:streamGenerateContent?key=${context.apiKey}&alt=sse`

    const body = {
      contents: this.formatMessages(options.messages),
      generationConfig: this.buildGenerationConfig(options, model),
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
            const chunk: GeminiResponse = JSON.parse(jsonStr)
            const candidate = chunk.candidates[0]
            const text = candidate?.content?.parts
              ?.map((p) => p.text || '')
              .join('') || ''

            if (text) {
              yield {
                delta: text,
                finishReason: candidate?.finishReason
                  ? this.mapFinishReason(candidate.finishReason)
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
    const model = context.model
    const modelId = options.model || model.modelId
    const url = `${context.baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${modelId}:generateContent?key=${context.apiKey}`

    const body = {
      contents: this.formatMessages(options.messages),
      generationConfig: {
        ...this.buildGenerationConfig(options, model),
        responseSchema: options.schema,
        responseMimeType: 'application/json',
      },
    }

    const response = await this.makeRequest<GeminiResponse>(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
      context
    )

    const text = response.candidates[0].content.parts
      .map((p) => p.text || '')
      .join('')

    try {
      return JSON.parse(text) as T
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
        { ...context, apiKey, model: { modelId: 'gemini-1.5-flash' } as LLMModel }
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
        id: 'gemini-2.0-flash',
        providerId: this.providerId,
        modelId: 'gemini-2.0-flash',
        displayName: 'Gemini 2.0 Flash',
        capabilities: this.capabilities,
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        inputPricePer1k: 0.0001,
        outputPricePer1k: 0.0004,
        supportedParams: ['temperature', 'max_tokens', 'top_p', 'top_k'],
      },
      {
        id: 'gemini-1.5-pro',
        providerId: this.providerId,
        modelId: 'gemini-1.5-pro',
        displayName: 'Gemini 1.5 Pro',
        capabilities: this.capabilities,
        contextWindow: 2097152,
        maxOutputTokens: 8192,
        inputPricePer1k: 0.00125,
        outputPricePer1k: 0.005,
        supportedParams: ['temperature', 'max_tokens', 'top_p', 'top_k'],
      },
    ]
  }

  /**
   * Build headers (Gemini uses query param for auth)
   */
  protected buildHeaders(_apiKey: string): Record<string, string> {
    return { 'Content-Type': 'application/json' }
  }

  /**
   * Format messages for Gemini API
   */
  private formatMessages(messages: ChatMessage[]): Array<{ role: string; parts: Array<{ text: string }> }> {
    return messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
  }

  /**
   * Build generation config
   */
  private buildGenerationConfig(
    options: ChatCompletionOptions,
    model: LLMModel
  ): Record<string, unknown> {
    const config: Record<string, unknown> = {}

    if (options.temperature !== undefined) config.temperature = options.temperature
    if (options.maxTokens !== undefined) config.maxOutputTokens = options.maxTokens
    if (options.topP !== undefined) config.topP = options.topP

    return config
  }

  /**
   * Map finish reasons
   */
  private mapFinishReason(reason: string): ChatResponse['finishReason'] {
    switch (reason) {
      case 'STOP':
        return 'stop'
      case 'MAX_TOKENS':
        return 'length'
      case 'SAFETY':
        return 'content_filter'
      default:
        return 'stop'
    }
  }
}