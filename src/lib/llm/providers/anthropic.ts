/**
 * Anthropic Provider Adapter
 *
 * Supports Claude models with streaming and vision.
 *
 * API Reference: https://docs.anthropic.com/claude/reference
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
 * Anthropic API response types
 */
interface AnthropicChatResponse {
  id: string
  type: string
  role: string
  content: Array<{
    type: string
    text?: string
  }>
  model: string
  stop_reason: string | null
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * Anthropic provider adapter implementation
 */
export class AnthropicAdapter extends BaseProviderAdapter {
  readonly providerId = 'anthropic'
  readonly capabilities: LLMProviderCapabilities = {
    streaming: true,
    structured_output: true,
    vision: true,
    reasoning: true, // Extended Thinking support
  }

  /**
   * Perform a chat completion request
   */
  async chat(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): Promise<ChatResponse> {
    const url = this.buildUrl(context.baseUrl || 'https://api.anthropic.com/v1', '/messages')
    const model = context.model

    const { system, messages } = this.extractSystemPrompt(options.messages)

    const body = {
      model: options.model || model.modelId,
      max_tokens: options.maxTokens || model.maxOutputTokens,
      system: system || undefined,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      ...this.mergeAnthropicOptions(options),
    }

    const response = await this.makeRequest<AnthropicChatResponse>(
      url,
      {
        method: 'POST',
        headers: this.buildHeaders(context.apiKey),
        body: JSON.stringify(body),
      },
      context
    )

    const textContent = response.content
      .filter((c) => c.type === 'text')
      .map((c) => c.text)
      .join('')

    return {
      content: textContent,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
      finishReason: this.mapStopReason(response.stop_reason),
    }
  }

  /**
   * Perform a streaming chat completion request
   */
  async *chatStream(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): AsyncIterable<StreamChunk> {
    const url = this.buildUrl(context.baseUrl || 'https://api.anthropic.com/v1', '/messages')
    const model = context.model

    const { system, messages } = this.extractSystemPrompt(options.messages)

    const body = {
      model: options.model || model.modelId,
      max_tokens: options.maxTokens || model.maxOutputTokens,
      system: system || undefined,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      ...this.mergeAnthropicOptions(options),
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
            const event = JSON.parse(jsonStr)

            if (event.type === 'content_block_delta' && event.delta?.text) {
              yield {
                delta: event.delta.text,
              }
            }

            if (event.type === 'message_delta' && event.usage) {
              yield {
                delta: '',
                usage: {
                  inputTokens: event.usage.input_tokens || 0,
                  outputTokens: event.usage.output_tokens || 0,
                },
              }
            }

            if (event.type === 'message_stop') {
              yield {
                delta: '',
                finishReason: 'stop',
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
    // Anthropic uses tool use for structured output
    const url = this.buildUrl(context.baseUrl || 'https://api.anthropic.com/v1', '/messages')
    const model = context.model

    const { system, messages } = this.extractSystemPrompt(options.messages)

    const body = {
      model: options.model || model.modelId,
      max_tokens: options.maxTokens || model.maxOutputTokens,
      system: system || undefined,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      tools: [
        {
          name: options.schemaName || 'structured_output',
          description: 'Output structured data',
          input_schema: options.schema,
        },
      ],
      tool_choice: { type: 'tool', name: options.schemaName || 'structured_output' },
    }

    const response = await this.makeRequest<AnthropicChatResponse>(
      url,
      {
        method: 'POST',
        headers: this.buildHeaders(context.apiKey),
        body: JSON.stringify(body),
      },
      context
    )

    // Extract tool use content
    const toolContent = response.content.find((c) => c.type === 'tool_use')

    if (!toolContent || !('input' in toolContent)) {
      throw this.createError('No structured output in response', 'PROVIDER_ERROR')
    }

    return toolContent.input as T
  }

  /**
   * Validate API key by making a minimal request
   */
  async validateApiKey(
    apiKey: string,
    context: Omit<ProviderAdapterContext, 'model'>
  ): Promise<boolean> {
    try {
      const url = this.buildUrl(context.baseUrl || 'https://api.anthropic.com/v1', '/messages')
      await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(apiKey),
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'hi' }],
        }),
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Get available models (static list)
   */
  async getModels(_context: Omit<ProviderAdapterContext, 'model'>): Promise<LLMModel[]> {
    return [
      {
        id: 'claude-opus-4-6',
        providerId: this.providerId,
        modelId: 'claude-opus-4-6',
        displayName: 'Claude Opus 4.6',
        capabilities: this.capabilities,
        contextWindow: 1048576,
        maxOutputTokens: 131072,
        inputPricePer1k: 0.005,
        outputPricePer1k: 0.025,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
      {
        id: 'claude-sonnet-4-6',
        providerId: this.providerId,
        modelId: 'claude-sonnet-4-6',
        displayName: 'Claude Sonnet 4.6',
        capabilities: this.capabilities,
        contextWindow: 1048576,
        maxOutputTokens: 65536,
        inputPricePer1k: 0.003,
        outputPricePer1k: 0.015,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
      {
        id: 'claude-haiku-4-5-20251001',
        providerId: this.providerId,
        modelId: 'claude-haiku-4-5-20251001',
        displayName: 'Claude Haiku 4.5',
        capabilities: this.capabilities,
        contextWindow: 200000,
        maxOutputTokens: 65536,
        inputPricePer1k: 0.001,
        outputPricePer1k: 0.005,
        supportedParams: ['temperature', 'max_tokens', 'top_p'],
      },
    ]
  }

  /**
   * Build headers for Anthropic requests
   */
  protected buildHeaders(apiKey: string): Record<string, string> {
    return {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    }
  }

  /**
   * Extract system prompt from messages
   */
  private extractSystemPrompt(messages: ChatMessage[]): {
    system: string | null
    messages: ChatMessage[]
  } {
    const systemMessage = messages.find((m) => m.role === 'system')
    const otherMessages = messages.filter((m) => m.role !== 'system')

    return {
      system: systemMessage?.content || null,
      messages: otherMessages,
    }
  }

  /**
   * Merge options with Anthropic-specific handling
   */
  private mergeAnthropicOptions(options: ChatCompletionOptions): Record<string, unknown> {
    const merged: Record<string, unknown> = {}

    if (options.temperature !== undefined) merged.temperature = options.temperature
    if (options.topP !== undefined) merged.top_p = options.topP
    if (options.stop !== undefined)
      merged.stop_sequences = Array.isArray(options.stop) ? options.stop : [options.stop]

    return merged
  }

  /**
   * Map Anthropic stop reasons
   */
  private mapStopReason(reason: string | null): ChatResponse['finishReason'] {
    switch (reason) {
      case 'end_turn':
        return 'stop'
      case 'max_tokens':
        return 'length'
      case 'stop_sequence':
        return 'stop'
      default:
        return 'stop'
    }
  }
}
