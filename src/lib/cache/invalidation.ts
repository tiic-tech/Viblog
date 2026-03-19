/**
 * Cache Invalidation Hooks
 *
 * Provides functions to invalidate cache when data changes.
 * These should be called after database mutations.
 *
 * Key structure: `{prefix}:{identifier}` or `{prefix}:{userId}:{sessionId}`
 */

import { deleteCache, deleteCachePattern, generateCacheKey } from './cache'

/**
 * Cache key prefixes for different data types
 */
export const CACHE_PREFIXES = {
  /** User session data - key format: user_sessions:{userId}:{sessionId} */
  USER_SESSIONS: 'user_sessions',
  /** User authentication data - key format: user_auth:{userId} */
  USER_AUTH: 'user_auth',
  /** LLM-generated context - key format: llm_context:{sessionId} */
  LLM_CONTEXT: 'llm_context',
  /** API key validation cache - key format: api_key_valid:{apiKeyId} */
  API_KEY_VALIDATION: 'api_key_valid',
} as const

/**
 * Invalidate all cached sessions for a user
 * Call this when a user creates, updates, or deletes a session
 */
export async function invalidateUserSessions(userId: string): Promise<void> {
  // Match keys like: user_sessions:{userId}:*
  const pattern = `${CACHE_PREFIXES.USER_SESSIONS}:${userId}:*`
  await deleteCachePattern(pattern)
}

/**
 * Invalidate a specific session cache
 * Call this when a specific session is updated or deleted
 */
export async function invalidateSession(userId: string, sessionId: string): Promise<void> {
  // Key format: user_sessions:{userId}:{sessionId}
  const key = `${CACHE_PREFIXES.USER_SESSIONS}:${userId}:${sessionId}`
  await deleteCache(key)
}

/**
 * Invalidate user authentication cache
 * Call this when user auth state changes (login, logout, token refresh)
 */
export async function invalidateUserAuth(userId: string): Promise<void> {
  const key = `${CACHE_PREFIXES.USER_AUTH}:${userId}`
  await deleteCache(key)
}

/**
 * Invalidate LLM-generated context cache
 * Call this when session context is regenerated or updated
 */
export async function invalidateLLMContext(sessionId: string): Promise<void> {
  const key = `${CACHE_PREFIXES.LLM_CONTEXT}:${sessionId}`
  await deleteCache(key)
}

/**
 * Invalidate API key validation cache
 * Call this when an API key is rotated or revoked
 */
export async function invalidateApiKeyValidation(apiKeyId: string): Promise<void> {
  const key = `${CACHE_PREFIXES.API_KEY_VALIDATION}:${apiKeyId}`
  await deleteCache(key)
}

/**
 * Batch invalidate multiple cache entries
 * Useful for bulk operations
 */
export async function invalidateBatch(
  invalidations: Array<{ type: keyof typeof CACHE_PREFIXES; id: string; secondaryId?: string }>
): Promise<void> {
  await Promise.all(
    invalidations.map(({ type, id, secondaryId }) => {
      switch (type) {
        case 'USER_SESSIONS':
          if (secondaryId) {
            return invalidateSession(id, secondaryId)
          }
          return invalidateUserSessions(id)
        case 'USER_AUTH':
          return invalidateUserAuth(id)
        case 'LLM_CONTEXT':
          return invalidateLLMContext(id)
        case 'API_KEY_VALIDATION':
          return invalidateApiKeyValidation(id)
        default:
          return Promise.resolve()
      }
    })
  )
}

/**
 * Clear all cache (use with caution - mainly for testing)
 */
export async function clearAllCache(): Promise<void> {
  // Delete all keys matching any of our prefixes
  await Promise.all(
    Object.values(CACHE_PREFIXES).map((prefix) => deleteCachePattern(`${prefix}:*`))
  )
}
