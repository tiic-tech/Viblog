/**
 * LLM Provider Factory
 *
 * Factory for creating provider adapter instances.
 * Uses the Strategy Pattern - each provider is a strategy.
 */

import type { ILLMProviderAdapter } from './types'
import { OpenAIAdapter } from './providers/openai'
import { AnthropicAdapter } from './providers/anthropic'
import { GeminiAdapter } from './providers/gemini'
import { DeepSeekAdapter } from './providers/deepseek'
import { MoonshotAdapter } from './providers/moonshot'
import { QwenAdapter } from './providers/qwen'
import { ZhipuAdapter } from './providers/zhipu'
import { MiniMaxAdapter } from './providers/minimax'
import { OpenRouterAdapter } from './providers/openrouter'

/**
 * Provider ID type
 */
export type ProviderId =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'deepseek'
  | 'moonshot'
  | 'qwen'
  | 'zhipu'
  | 'minimax'
  | 'openrouter'

/**
 * All available provider adapters
 */
const adapters: Record<ProviderId, ILLMProviderAdapter> = {
  openai: new OpenAIAdapter(),
  anthropic: new AnthropicAdapter(),
  google: new GeminiAdapter(),
  deepseek: new DeepSeekAdapter(),
  moonshot: new MoonshotAdapter(),
  qwen: new QwenAdapter(),
  zhipu: new ZhipuAdapter(),
  minimax: new MiniMaxAdapter(),
  openrouter: new OpenRouterAdapter(),
}

/**
 * Get a provider adapter by ID
 */
export function getProviderAdapter(providerId: ProviderId): ILLMProviderAdapter {
  const adapter = adapters[providerId]
  if (!adapter) {
    throw new Error(`Unknown provider: ${providerId}`)
  }
  return adapter
}

/**
 * Get all available provider adapters
 */
export function getAllProviders(): ILLMProviderAdapter[] {
  return Object.values(adapters)
}

/**
 * Get provider IDs
 */
export function getProviderIds(): ProviderId[] {
  return Object.keys(adapters) as ProviderId[]
}

/**
 * Check if a provider is supported
 */
export function isProviderSupported(providerId: string): providerId is ProviderId {
  return providerId in adapters
}

/**
 * Get provider capabilities
 */
export function getProviderCapabilities(providerId: ProviderId) {
  return getProviderAdapter(providerId).capabilities
}

export {
  adapters,
  OpenAIAdapter,
  AnthropicAdapter,
  GeminiAdapter,
  DeepSeekAdapter,
  MoonshotAdapter,
  QwenAdapter,
  ZhipuAdapter,
  MiniMaxAdapter,
  OpenRouterAdapter,
}