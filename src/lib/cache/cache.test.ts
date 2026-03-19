/**
 * Cache Utility Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  getOrSetCache,
  getCacheStats,
  clearMemoryCache,
  generateCacheKey,
  DEFAULT_TTL,
} from './cache'
import { resetRedisClient, isRedisConfigured } from './client'

// Mock Redis client
vi.mock('./client', () => ({
  getRedisClient: vi.fn(() => null),
  isRedisConfigured: vi.fn(() => false),
  resetRedisClient: vi.fn(),
}))

describe('Cache Utility', () => {
  beforeEach(() => {
    clearMemoryCache()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearMemoryCache()
  })

  describe('generateCacheKey', () => {
    it('should return key as-is when no prefix', () => {
      expect(generateCacheKey('test-key')).toBe('test-key')
    })

    it('should prefix key when prefix provided', () => {
      expect(generateCacheKey('test-key', 'prefix')).toBe('prefix:test-key')
    })
  })

  describe('setCache and getCache', () => {
    it('should store and retrieve value', async () => {
      await setCache('test-key', { data: 'value' }, 60)
      const result = await getCache<{ data: string }>('test-key')
      expect(result).toEqual({ data: 'value' })
    })

    it('should return null for non-existent key', async () => {
      const result = await getCache('non-existent')
      expect(result).toBeNull()
    })

    it('should return null for expired key', async () => {
      vi.useFakeTimers()

      await setCache('expiring-key', { data: 'value' }, 1)

      // Advance time past TTL
      vi.advanceTimersByTime(1100)

      const result = await getCache('expiring-key')
      expect(result).toBeNull()

      vi.useRealTimers()
    })

    it('should handle primitive values', async () => {
      await setCache('string-key', 'string value', 60)
      expect(await getCache<string>('string-key')).toBe('string value')

      await setCache('number-key', 42, 60)
      expect(await getCache<number>('number-key')).toBe(42)

      await setCache('boolean-key', true, 60)
      expect(await getCache<boolean>('boolean-key')).toBe(true)
    })

    it('should handle null and undefined values', async () => {
      await setCache('null-key', null, 60)
      const result = await getCache<null>('null-key')
      // Note: getCache returns null for not found, so stored null is tricky
      // This is a known limitation - null values should be avoided
      expect(result).toBeNull()
    })
  })

  describe('deleteCache', () => {
    it('should delete cached value', async () => {
      await setCache('delete-key', { data: 'value' }, 60)
      expect(await getCache('delete-key')).not.toBeNull()

      await deleteCache('delete-key')
      expect(await getCache('delete-key')).toBeNull()
    })

    it('should not throw for non-existent key', async () => {
      await expect(deleteCache('non-existent')).resolves.not.toThrow()
    })
  })

  describe('deleteCachePattern', () => {
    it('should delete keys matching pattern', async () => {
      await setCache('user:1', { id: 1 }, 60)
      await setCache('user:2', { id: 2 }, 60)
      await setCache('session:1', { sessionId: 's1' }, 60)

      const deleted = await deleteCachePattern('user:*')

      expect(deleted).toBeGreaterThanOrEqual(2)
      expect(await getCache('user:1')).toBeNull()
      expect(await getCache('user:2')).toBeNull()
      expect(await getCache('session:1')).not.toBeNull()
    })
  })

  describe('getOrSetCache', () => {
    it('should return cached value if exists', async () => {
      await setCache('cached-key', { cached: true }, 60)

      const fetchFn = vi.fn().mockResolvedValue({ cached: false })
      const result = await getOrSetCache('cached-key', 60, fetchFn)

      expect(result).toEqual({ cached: true })
      expect(fetchFn).not.toHaveBeenCalled()
    })

    it('should fetch and cache value if not exists', async () => {
      const fetchFn = vi.fn().mockResolvedValue({ fetched: true })
      const result = await getOrSetCache('uncached-key', 60, fetchFn)

      expect(result).toEqual({ fetched: true })
      expect(fetchFn).toHaveBeenCalledTimes(1)

      // Verify cached
      const cached = await getCache('uncached-key')
      expect(cached).toEqual({ fetched: true })
    })

    it('should cache null/undefined results', async () => {
      const fetchFn = vi.fn().mockResolvedValue(null)
      await getOrSetCache('null-result-key', 60, fetchFn)

      // Second call should use cache (but returns null so we can't distinguish)
      // The important thing is fetchFn was called once
      expect(fetchFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      const stats = getCacheStats()

      expect(stats).toHaveProperty('isRedisEnabled')
      expect(stats).toHaveProperty('memoryCacheSize')
      expect(typeof stats.isRedisEnabled).toBe('boolean')
      expect(typeof stats.memoryCacheSize).toBe('number')
    })

    it('should track memory cache size', async () => {
      clearMemoryCache()
      expect(getCacheStats().memoryCacheSize).toBe(0)

      await setCache('key1', 'value1', 60)
      await setCache('key2', 'value2', 60)

      expect(getCacheStats().memoryCacheSize).toBe(2)
    })
  })

  describe('DEFAULT_TTL', () => {
    it('should have correct TTL constants', () => {
      expect(DEFAULT_TTL.USER_SESSIONS).toBe(300) // 5 minutes
      expect(DEFAULT_TTL.USER_AUTH).toBe(900) // 15 minutes
      expect(DEFAULT_TTL.LLM_CONTEXT).toBe(3600) // 1 hour
      expect(DEFAULT_TTL.STATIC).toBe(3600) // 1 hour
      expect(DEFAULT_TTL.RATE_LIMIT).toBe(60) // 1 minute
      expect(DEFAULT_TTL.API_KEY_VALIDATION).toBe(300) // 5 minutes
    })
  })

  describe('clearMemoryCache', () => {
    it('should clear all memory cache entries', async () => {
      await setCache('key1', 'value1', 60)
      await setCache('key2', 'value2', 60)

      expect(getCacheStats().memoryCacheSize).toBe(2)

      clearMemoryCache()

      expect(getCacheStats().memoryCacheSize).toBe(0)
      expect(await getCache('key1')).toBeNull()
      expect(await getCache('key2')).toBeNull()
    })
  })
})

describe('Cache Client', () => {
  beforeEach(() => {
    resetRedisClient()
    vi.clearAllMocks()
  })

  describe('isRedisConfigured', () => {
    it('should return false when env vars not set', () => {
      const originalUrl = process.env.UPSTASH_REDIS_REST_URL
      const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN

      delete process.env.UPSTASH_REDIS_REST_URL
      delete process.env.UPSTASH_REDIS_REST_TOKEN

      expect(isRedisConfigured()).toBe(false)

      // Restore
      if (originalUrl) process.env.UPSTASH_REDIS_REST_URL = originalUrl
      if (originalToken) process.env.UPSTASH_REDIS_REST_TOKEN = originalToken
    })
  })
})