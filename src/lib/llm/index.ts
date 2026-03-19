/**
 * LLM Platform Library
 *
 * Multi-provider LLM configuration system for Viblog.
 * Supports 9 providers: OpenAI, Anthropic, Google Gemini, DeepSeek,
 * Moonshot, Qwen, Zhipu AI, MiniMax, OpenRouter.
 */

// Core types
export type {
  LLMProviderCapabilities,
  LLMModel,
  LLMProvider,
  ChatMessage,
  ChatCompletionOptions,
  StreamChunk,
  StructuredOutputOptions,
  ChatResponse,
  ProviderAdapterContext,
  ILLMProviderAdapter,
  UserLLMConfig,
  LLMUsageLog,
  LLMErrorCode,
} from './types'

export { LLMError } from './types'

// Provider adapters
export {
  getProviderAdapter,
  getAllProviders,
  getProviderIds,
  isProviderSupported,
  getProviderCapabilities,
  type ProviderId,
} from './provider-factory'

// Individual adapters (for direct use)
export {
  OpenAIAdapter,
  AnthropicAdapter,
  GeminiAdapter,
  DeepSeekAdapter,
  MoonshotAdapter,
  QwenAdapter,
  ZhipuAdapter,
  MiniMaxAdapter,
  OpenRouterAdapter,
} from './provider-factory'

// Base class (for extending)
export { BaseProviderAdapter } from './adapter-base'