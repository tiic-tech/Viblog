/**
 * OpenAI Provider Adapter
 *
 * Reference implementation of the LLM provider adapter.
 * Supports: streaming, structured_output, vision
 *
 * API Reference: https://platform.openai.com/docs/api-reference
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
 * OpenAI API response types
 */
interface OpenAIChatResponse {
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

interface OpenAIStreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
  }
}

interface OpenAIModel {
  id: string
  object: string
  created: number
  owned_by: string
}

/**
 * OpenAI provider adapter implementation
 */
export class OpenAIAdapter extends BaseProviderAdapter {
  readonly providerId = 'openai'
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
    const url = this.buildUrl(context.baseUrl || 'https://api.openai.com/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      stream: false,
    }

    const response = await this.makeRequest<OpenAIChatResponse>(
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
    const url = this.buildUrl(context.baseUrl || 'https://api.openai.com/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      stream: true,
      stream_options: { include_usage: true },
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
            const chunk: OpenAIStreamChunk = JSON.parse(jsonStr)
            const choice = chunk.choices[0]

            if (choice?.delta?.content) {
              yield {
                delta: choice.delta.content,
                finishReason: choice.finish_reason
                  ? this.mapFinishReason(choice.finish_reason)
                  : undefined,
              }
            }

            // Final chunk with usage
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
    const url = this.buildUrl(context.baseUrl || 'https://api.openai.com/v1', '/chat/completions')
    const model = context.model

    const body = {
      model: options.model || model.modelId,
      messages: this.formatMessages(options.messages),
      ...this.mergeOptions(options, model),
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: options.schemaName || 'response',
          strict: true,
          schema: options.schema,
        },
      },
      stream: false,
    }

    const response = await this.makeRequest<OpenAIChatResponse>(
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
   * Validate API key by listing models
   */
  async validateApiKey(
    apiKey: string,
    context: Omit<ProviderAdapterContext, 'model'>
  ): Promise<boolean> {
    try {
      const url = this.buildUrl(context.baseUrl || 'https://api.openai.com/v1', '/models')
      await this.makeRequest<{ data: OpenAIModel[] }>(
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
    const url = this.buildUrl(context.baseUrl || 'https://api.openai.com/v1', '/models')
    const response = await this.makeRequest<{ data: OpenAIModel[] }>(
      url,
      {
        method: 'GET',
        headers: this.buildHeaders(context.apiKey),
      },
      { ...context, apiKey: context.apiKey, model: {} as LLMModel }
    )

    // Filter to known models (OpenAI has many, including fine-tuned)
    const knownModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo', 'o1']

    return response.data
      .filter((m) => knownModels.some((km) => m.id.startsWith(km)))
      .map((m) => ({
        id: m.id,
        providerId: this.providerId,
        modelId: m.id,
        displayName: m.id,
        capabilities: this.capabilities,
        contextWindow: 128000,
        maxOutputTokens: 4096,
        inputPricePer1k: 0,
        outputPricePer1k: 0,
        supportedParams: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty'],
      }))
  }

  /**
   * Build headers for OpenAI requests
   */
  protected buildHeaders(apiKey: string): Record<string, string> {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Format messages for OpenAI API
   */
  private formatMessages(messages: ChatMessage[]): Array<{ role: string; content: string }> {
    return messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))
  }

  /**
   * Map OpenAI finish reasons to our standard format
   */
  private mapFinishReason(reason: string | null): ChatResponse['finishReason'] {
    switch (reason) {
      case 'stop':
        return 'stop'
      case 'length':
        return 'length'
      case 'content_filter':
        return 'content_filter'
      default:
        return 'stop'
    }
  }
}