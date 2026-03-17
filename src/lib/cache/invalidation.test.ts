/**
 * Cache Invalidation Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  invalidateUserSessions,
  invalidateSession,
  invalidateUserAuth,
  invalidateLLMContext,
  invalidateApiKeyValidation,
  invalidateBatch,
  clearAllCache,
  CACHE_PREFIXES,
} from './invalidation'
import { setCache, getCache, clearMemoryCache } from './cache'

// Mock Redis client
vi.mock('./client', () => ({
  getRedisClient: vi.fn(() => null),
  isRedisConfigured: vi.fn(() => false),
}))

describe('Cache Invalidation', () => {
  beforeEach(() => {
    clearMemoryCache()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearMemoryCache()
  })

  describe('CACHE_PREFIXES', () => {
    it('should have all expected prefixes', () => {
      expect(CACHE_PREFIXES.USER_SESSIONS).toBe('user_sessions')
      expect(CACHE_PREFIXES.USER_AUTH).toBe('user_auth')
      expect(CACHE_PREFIXES.LLM_CONTEXT).toBe('llm_context')
      expect(CACHE_PREFIXES.API_KEY_VALIDATION).toBe('api_key_valid')
    })
  })

  describe('invalidateUserSessions', () => {
    it('should invalidate all sessions for a user', async () => {
      const userId = 'user-123'

      // Create multiple session cache entries with format: user_sessions:{userId}:{sessionId}
      await setCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId}:session-1`, { data: 1 }, 60)
      await setCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId}:session-2`, { data: 2 }, 60)

      await invalidateUserSessions(userId)

      // Sessions should be invalidated
      expect(await getCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId}:session-1`)).toBeNull()
      expect(await getCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId}:session-2`)).toBeNull()
    })

    it('should not affect other users sessions', async () => {
      const userId1 = 'user-123'
      const userId2 = 'user-456'

      await setCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId1}:session-1`, { data: 1 }, 60)
      await setCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId2}:session-1`, { data: 2 }, 60)

      await invalidateUserSessions(userId1)

      expect(await getCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId1}:session-1`)).toBeNull()
      expect(await getCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId2}:session-1`)).not.toBeNull()
    })
  })

  describe('invalidateSession', () => {
    it('should invalidate a specific session', async () => {
      const userId = 'user-123'
      const sessionId = 'session-456'

      await setCache(
        `${CACHE_PREFIXES.USER_SESSIONS}:${userId}:${sessionId}`,
        { data: 'session-data' },
        60
      )

      await invalidateSession(userId, sessionId)

      expect(await getCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId}:${sessionId}`)).toBeNull()
    })
  })

  describe('invalidateUserAuth', () => {
    it('should invalidate user auth cache', async () => {
      const userId = 'user-123'

      await setCache(`${CACHE_PREFIXES.USER_AUTH}:${userId}`, { authenticated: true }, 60)

      await invalidateUserAuth(userId)

      expect(await getCache(`${CACHE_PREFIXES.USER_AUTH}:${userId}`)).toBeNull()
    })
  })

  describe('invalidateLLMContext', () => {
    it('should invalidate LLM context cache', async () => {
      const sessionId = 'session-456'

      await setCache(`${CACHE_PREFIXES.LLM_CONTEXT}:${sessionId}`, { context: 'llm-context' }, 60)

      await invalidateLLMContext(sessionId)

      expect(await getCache(`${CACHE_PREFIXES.LLM_CONTEXT}:${sessionId}`)).toBeNull()
    })
  })

  describe('invalidateApiKeyValidation', () => {
    it('should invalidate API key validation cache', async () => {
      const apiKeyId = 'apikey-789'

      await setCache(`${CACHE_PREFIXES.API_KEY_VALIDATION}:${apiKeyId}`, { valid: true }, 60)

      await invalidateApiKeyValidation(apiKeyId)

      expect(await getCache(`${CACHE_PREFIXES.API_KEY_VALIDATION}:${apiKeyId}`)).toBeNull()
    })
  })

  describe('invalidateBatch', () => {
    it('should invalidate multiple cache entries', async () => {
      const userId = 'user-123'
      const sessionId = 'session-456'

      // Set up multiple cache entries
      await setCache(`${CACHE_PREFIXES.USER_AUTH}:${userId}`, { auth: true }, 60)
      await setCache(`${CACHE_PREFIXES.LLM_CONTEXT}:${sessionId}`, { context: 'data' }, 60)

      // Invalidate both
      await invalidateBatch([
        { type: 'USER_AUTH', id: userId },
        { type: 'LLM_CONTEXT', id: sessionId },
      ])

      // Both should be cleared
      expect(await getCache(`${CACHE_PREFIXES.USER_AUTH}:${userId}`)).toBeNull()
      expect(await getCache(`${CACHE_PREFIXES.LLM_CONTEXT}:${sessionId}`)).toBeNull()
    })

    it('should handle user sessions with secondary id', async () => {
      const userId = 'user-123'
      const sessionId = 'session-456'

      await setCache(
        `${CACHE_PREFIXES.USER_SESSIONS}:${userId}:${sessionId}`,
        { data: 'session' },
        60
      )

      await invalidateBatch([{ type: 'USER_SESSIONS', id: userId, secondaryId: sessionId }])

      expect(await getCache(`${CACHE_PREFIXES.USER_SESSIONS}:${userId}:${sessionId}`)).toBeNull()
    })

    it('should handle empty batch', async () => {
      await expect(invalidateBatch([])).resolves.not.toThrow()
    })
  })

  describe('clearAllCache', () => {
    it('should clear all cache with our prefixes', async () => {
      // Set up cache entries with different prefixes
      await setCache(`${CACHE_PREFIXES.USER_AUTH}:user-1`, { auth: true }, 60)
      await setCache(`${CACHE_PREFIXES.LLM_CONTEXT}:session-1`, { context: true }, 60)
      await setCache(`${CACHE_PREFIXES.API_KEY_VALIDATION}:apikey-1`, { valid: true }, 60)

      await clearAllCache()

      // All should be cleared
      expect(await getCache(`${CACHE_PREFIXES.USER_AUTH}:user-1`)).toBeNull()
      expect(await getCache(`${CACHE_PREFIXES.LLM_CONTEXT}:session-1`)).toBeNull()
      expect(await getCache(`${CACHE_PREFIXES.API_KEY_VALIDATION}:apikey-1`)).toBeNull()
    })
  })
})
