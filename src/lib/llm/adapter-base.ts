/**
 * LLM Provider Adapter Base Class
 *
 * Abstract base class implementing common functionality for all LLM providers.
 * Specific providers extend this class and implement abstract methods.
 */

import type {
  ChatCompletionOptions,
  ChatResponse,
  LLMError as LLMErrorType,
  LLMModel,
  LLMProviderCapabilities,
  ProviderAdapterContext,
  StreamChunk,
  StructuredOutputOptions,
} from './types'
import { LLMError } from './types'

/**
 * Abstract base class for LLM provider adapters
 *
 * Implements Strategy Pattern - each provider is a concrete strategy.
 * Provides common utilities:
 * - Cost estimation
 * - Error handling
 * - HTTP request helpers
 */
export abstract class BaseProviderAdapter {
  abstract readonly providerId: string
  abstract readonly capabilities: LLMProviderCapabilities

  /**
   * Perform a chat completion request
   */
  abstract chat(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): Promise<ChatResponse>

  /**
   * Perform a streaming chat completion request
   */
  abstract chatStream(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): AsyncIterable<StreamChunk>

  /**
   * Perform a structured output request
   */
  abstract structuredOutput<T>(
    options: StructuredOutputOptions<T>,
    context: ProviderAdapterContext
  ): Promise<T>

  /**
   * Validate an API key by making a test request
   */
  abstract validateApiKey(
    apiKey: string,
    context: Omit<ProviderAdapterContext, 'model'>
  ): Promise<boolean>

  /**
   * Get available models for this provider
   */
  abstract getModels(
    context: Omit<ProviderAdapterContext, 'model'>
  ): Promise<LLMModel[]>

  /**
   * Estimate cost for a request
   * Standard implementation based on token pricing
   */
  estimateCost(
    inputTokens: number,
    outputTokens: number,
    model: LLMModel
  ): number {
    const inputCost = (inputTokens / 1000) * model.inputPricePer1k
    const outputCost = (outputTokens / 1000) * model.outputPricePer1k
    return Number((inputCost + outputCost).toFixed(6))
  }

  /**
   * Create a standardized LLM error
   */
  protected createError(
    message: string,
    code: LLMErrorType['code'],
    originalError?: Error
  ): LLMError {
    return new LLMError(message, code, this.providerId, originalError)
  }

  /**
   * Make an HTTP request with error handling
   */
  protected async makeRequest<T>(
    url: string,
    options: RequestInit,
    context: ProviderAdapterContext
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw this.handleHttpError(response.status, errorBody)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof LLMError) {
        throw error
      }
      throw this.createError(
        `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NETWORK_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  /**
   * Handle HTTP error responses
   */
  protected handleHttpError(status: number, body: string): LLMError {
    switch (status) {
      case 401:
        return this.createError('Invalid API key', 'INVALID_API_KEY')
      case 429:
        return this.createError('Rate limit exceeded', 'RATE_LIMITED')
      case 404:
        return this.createError('Model not found', 'MODEL_NOT_FOUND')
      case 400:
        // Could be context too long or content filtered
        if (body.includes('context') || body.includes('token')) {
          return this.createError('Context too long', 'CONTEXT_TOO_LONG')
        }
        if (body.includes('content') || body.includes('filter')) {
          return this.createError('Content filtered', 'CONTENT_FILTERED')
        }
        return this.createError(`Bad request: ${body}`, 'PROVIDER_ERROR')
      default:
        return this.createError(
          `Provider error (${status}): ${body}`,
          'PROVIDER_ERROR'
        )
    }
  }

  /**
   * Build headers for the request
   */
  protected abstract buildHeaders(
    apiKey: string,
    customHeaders?: Record<string, string>
  ): Record<string, string>

  /**
   * Build the request URL
   */
  protected buildUrl(
    baseUrl: string,
    endpoint: string
  ): string {
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${base}${ep}`
  }

  /**
   * Count tokens (approximate - actual counting varies by provider)
   * Uses a simple heuristic: ~4 characters per token
   */
  protected estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  /**
   * Merge options with defaults
   */
  protected mergeOptions(
    options: ChatCompletionOptions,
    model: LLMModel
  ): Record<string, unknown> {
    const merged: Record<string, unknown> = {}

    // Apply model defaults
    for (const param of model.supportedParams) {
      if (param === 'temperature') merged.temperature = 0.7
      if (param === 'max_tokens') merged.max_tokens = model.maxOutputTokens
      if (param === 'top_p') merged.top_p = 1
    }

    // Override with user options
    if (options.temperature !== undefined) merged.temperature = options.temperature
    if (options.maxTokens !== undefined) merged.max_tokens = options.maxTokens
    if (options.topP !== undefined) merged.top_p = options.topP
    if (options.stop !== undefined) merged.stop = options.stop
    if (options.frequencyPenalty !== undefined) merged.frequency_penalty = options.frequencyPenalty
    if (options.presencePenalty !== undefined) merged.presence_penalty = options.presencePenalty

    return merged
  }
}