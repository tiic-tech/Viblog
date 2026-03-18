/**
 * LLM Platform - Core Type Definitions
 *
 * Type definitions for the multi-provider LLM configuration system.
 * Supports 9 providers: OpenAI, Anthropic, Gemini, DeepSeek, Moonshot, Qwen, Zhipu AI, MiniMax, OpenRouter
 */

/**
 * Provider capabilities flags
 */
export interface LLMProviderCapabilities {
  streaming: boolean
  structured_output: boolean
  vision: boolean
}

/**
 * Model definition from the database
 */
export interface LLMModel {
  id: string
  providerId: string
  modelId: string
  displayName: string
  capabilities: LLMProviderCapabilities
  contextWindow: number
  maxOutputTokens: number
  inputPricePer1k: number
  outputPricePer1k: number
  supportedParams: string[]
}

/**
 * Provider definition from the database
 */
export interface LLMProvider {
  id: string
  name: string
  baseUrl: string
  capabilities: LLMProviderCapabilities
  authHeader: string
  authPrefix: string
  apiKeyEnv: string | null
  isActive: boolean
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Options for chat completion requests
 */
export interface ChatCompletionOptions {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  stream?: boolean
  stop?: string | string[]
  frequencyPenalty?: number
  presencePenalty?: number
}

/**
 * Streaming chunk from chat completion
 */
export interface StreamChunk {
  delta: string
  finishReason?: 'stop' | 'length' | 'content_filter' | 'error' | null
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

/**
 * Options for structured output requests
 */
export interface StructuredOutputOptions<T> extends ChatCompletionOptions {
  schema: Record<string, unknown>
  schemaName?: string
}

/**
 * Response from chat completion
 */
export interface ChatResponse {
  content: string
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
  finishReason: 'stop' | 'length' | 'content_filter' | 'error'
}

/**
 * Context for provider adapter operations
 */
export interface ProviderAdapterContext {
  apiKey: string
  baseUrl?: string
  model: LLMModel
}

/**
 * Provider adapter interface (Strategy Pattern)
 *
 * Each LLM provider implements this interface to handle:
 * - Chat completions (streaming and non-streaming)
 * - Structured output
 * - API key validation
 * - Model listing
 * - Cost estimation
 */
export interface ILLMProviderAdapter {
  readonly providerId: string
  readonly capabilities: LLMProviderCapabilities

  /**
   * Perform a chat completion request
   */
  chat(options: ChatCompletionOptions, context: ProviderAdapterContext): Promise<ChatResponse>

  /**
   * Perform a streaming chat completion request
   */
  chatStream(
    options: ChatCompletionOptions,
    context: ProviderAdapterContext
  ): AsyncIterable<StreamChunk>

  /**
   * Perform a structured output request
   */
  structuredOutput<T>(
    options: StructuredOutputOptions<T>,
    context: ProviderAdapterContext
  ): Promise<T>

  /**
   * Validate an API key by making a test request
   */
  validateApiKey(apiKey: string, context: Omit<ProviderAdapterContext, 'model'>): Promise<boolean>

  /**
   * Get available models for this provider
   */
  getModels(context: Omit<ProviderAdapterContext, 'model'>): Promise<LLMModel[]>

  /**
   * Estimate cost for a request
   */
  estimateCost(inputTokens: number, outputTokens: number, model: LLMModel): number
}

/**
 * User LLM configuration from database
 */
export interface UserLLMConfig {
  id: string
  userId: string
  providerId: string
  apiKeyEncrypted: string | null
  defaultModelId: string | null
  customParams: Record<string, unknown>
  customPrompts: {
    systemPrompt?: string
    userPromptTemplate?: string
  }
  isPrimary: boolean
  lastValidatedAt: Date | null
}

/**
 * Usage log entry
 */
export interface LLMUsageLog {
  id: string
  userId: string
  configId: string | null
  providerId: string
  modelId: string
  requestType: 'chat' | 'structured' | 'embedding' | 'other'
  inputTokens: number
  outputTokens: number
  estimatedCostUsd: number
  latencyMs: number | null
  status: 'success' | 'error' | 'timeout' | 'rate_limited'
  errorMessage: string | null
  createdAt: Date
}

/**
 * Error types for LLM operations
 */
export type LLMErrorCode =
  | 'INVALID_API_KEY'
  | 'RATE_LIMITED'
  | 'MODEL_NOT_FOUND'
  | 'CONTEXT_TOO_LONG'
  | 'CONTENT_FILTERED'
  | 'PROVIDER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'

/**
 * Custom error class for LLM operations
 */
export class LLMError extends Error {
  constructor(
    message: string,
    public readonly code: LLMErrorCode,
    public readonly providerId: string,
    public readonly originalError?: Error
  ) {
    super(message)
    this.name = 'LLMError'
  }
}
