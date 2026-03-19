/**
 * Cache Module
 *
 * Provides a cache-aside pattern with Redis support and in-memory fallback.
 */

export {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  getOrSetCache,
  getCacheStats,
  clearMemoryCache,
  generateCacheKey,
  DEFAULT_TTL,
  type CacheOptions,
} from './cache'

export {
  getRedisClient,
  isRedisConfigured,
  resetRedisClient,
} from './client'

export {
  invalidateUserSessions,
  invalidateSession,
  invalidateUserAuth,
  invalidateLLMContext,
  invalidateApiKeyValidation,
  invalidateBatch,
  clearAllCache,
  CACHE_PREFIXES,
} from './invalidation'