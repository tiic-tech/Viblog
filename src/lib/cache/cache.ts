/**
 * Cache Utility
 *
 * Implements a cache-aside pattern with TTL support.
 * Falls back to in-memory cache when Redis is not configured.
 */

import { getRedisClient, isRedisConfigured } from './client'

/**
 * Cache options
 */
export interface CacheOptions {
  /** Time to live in seconds */
  ttl: number
  /** Optional prefix for cache keys */
  prefix?: string
}

/**
 * Cache entry for in-memory fallback
 */
interface CacheEntry<T> {
  value: T
  expiresAt: number
}

/**
 * In-memory cache store for fallback
 */
const memoryCache = new Map<string, CacheEntry<unknown>>()

/**
 * Default TTL values for different data types (in seconds)
 */
export const DEFAULT_TTL = {
  /** User sessions list - 5 minutes */
  USER_SESSIONS: 300,
  /** User authentication - 15 minutes */
  USER_AUTH: 900,
  /** LLM-generated structured context - 1 hour */
  LLM_CONTEXT: 3600,
  /** Static responses - 1 hour */
  STATIC: 3600,
  /** Rate limit counters - 1 minute */
  RATE_LIMIT: 60,
  /** API key validation - 5 minutes */
  API_KEY_VALIDATION: 300,
} as const

/**
 * Generate a cache key with optional prefix
 */
export function generateCacheKey(key: string, prefix?: string): string {
  if (prefix) {
    return `${prefix}:${key}`
  }
  return key
}

/**
 * Clean up expired entries from memory cache
 */
function cleanupMemoryCache(): void {
  const now = Date.now()
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt < now) {
      memoryCache.delete(key)
    }
  }
}

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const fullKey = key

  // Try Redis first
  const redis = getRedisClient()
  if (redis) {
    try {
      const value = await redis.get<T>(fullKey)
      return value
    } catch (error) {
      console.error('Redis get error:', error)
      // Fall through to memory cache
    }
  }

  // Fall back to memory cache
  const entry = memoryCache.get(fullKey) as CacheEntry<T> | undefined
  if (entry) {
    if (entry.expiresAt > Date.now()) {
      return entry.value
    }
    // Entry expired, remove it
    memoryCache.delete(fullKey)
  }

  return null
}

/**
 * Set value in cache with TTL
 */
export async function setCache<T>(key: string, value: T, ttl: number): Promise<void> {
  const fullKey = key

  // Try Redis first
  const redis = getRedisClient()
  if (redis) {
    try {
      await redis.set(fullKey, value, { ex: ttl })
      return
    } catch (error) {
      console.error('Redis set error:', error)
      // Fall through to memory cache
    }
  }

  // Fall back to memory cache
  memoryCache.set(fullKey, {
    value,
    expiresAt: Date.now() + ttl * 1000,
  })

  // Periodically clean up expired entries
  if (memoryCache.size > 1000) {
    cleanupMemoryCache()
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<void> {
  const fullKey = key

  // Try Redis first
  const redis = getRedisClient()
  if (redis) {
    try {
      await redis.del(fullKey)
    } catch (error) {
      console.error('Redis delete error:', error)
    }
  }

  // Also remove from memory cache
  memoryCache.delete(fullKey)
}

/**
 * Convert glob pattern to regex for memory cache matching
 */
function globToRegex(pattern: string): RegExp {
  // Escape special regex characters except *
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`)
}

/**
 * Delete multiple keys matching a pattern
 * Note: For Redis, this uses SCAN which is more efficient than KEYS
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  let deletedCount = 0

  // Delete from memory cache using regex matching
  const regex = globToRegex(pattern)
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key)
      deletedCount++
    }
  }

  // Delete from Redis
  const redis = getRedisClient()
  if (redis) {
    try {
      // Upstash Redis supports pattern deletion
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
        deletedCount += keys.length
      }
    } catch (error) {
      console.error('Redis pattern delete error:', error)
    }
  }

  return deletedCount
}

/**
 * Get or set cache value (cache-aside pattern)
 * If the value is not in cache, fetches it using the provided function
 */
export async function getOrSetCache<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh value
  const value = await fetchFn()

  // Store in cache
  await setCache(key, value, ttl)

  return value
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  isRedisEnabled: boolean
  memoryCacheSize: number
} {
  return {
    isRedisEnabled: isRedisConfigured(),
    memoryCacheSize: memoryCache.size,
  }
}

/**
 * Clear memory cache (for testing)
 */
export function clearMemoryCache(): void {
  memoryCache.clear()
}
