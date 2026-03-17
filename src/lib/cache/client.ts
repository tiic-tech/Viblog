/**
 * Redis Cache Client
 *
 * Provides a singleton Redis client using Upstash Redis for serverless environments.
 * Falls back to in-memory cache when Redis is not configured.
 */

import { Redis } from '@upstash/redis'

let redisClient: Redis | null = null

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

/**
 * Get Redis client singleton
 * Returns null if Redis is not configured
 */
export function getRedisClient(): Redis | null {
  if (!isRedisConfigured()) {
    return null
  }

  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }

  return redisClient
}

/**
 * Reset Redis client (for testing)
 */
export function resetRedisClient(): void {
  redisClient = null
}