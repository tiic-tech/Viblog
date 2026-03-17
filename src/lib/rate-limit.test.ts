/**
 * Tests for Rate Limiter Utility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  checkRateLimit,
  getRateLimitConfig,
  getClientIdentifier,
  createRateLimitHeaders,
  createRateLimitResponse,
  shouldSkipRateLimit,
  clearRateLimitStore,
  getStoreSize,
  startCleanupInterval,
  stopCleanupInterval,
  getRateLimitStats,
  clearStats,
  isProduction,
  DEFAULT_RATE_LIMITS,
  type RateLimitConfig,
} from './rate-limit'
import { NextRequest, NextResponse } from 'next/server'

// Mock NextRequest
function createMockRequest(
  options: {
    pathname?: string
    headers?: Record<string, string>
  } = {}
): NextRequest {
  const url = `http://localhost:3000${options.pathname || '/api/test'}`
  const headers = new Headers(options.headers || {})

  return new NextRequest(url, { headers })
}

describe('Rate Limiter', () => {
  beforeEach(() => {
    clearRateLimitStore()
    clearStats()
  })

  afterEach(() => {
    stopCleanupInterval()
  })

  describe('getRateLimitConfig', () => {
    it('returns correct config for vibe-sessions/generate endpoints', () => {
      const config = getRateLimitConfig('/api/vibe-sessions/generate-structured-context')
      expect(config.keyPrefix).toBe('vsg')
      expect(config.limit).toBe(20)
    })

    it('returns correct config for vibe-sessions/fragments endpoints', () => {
      const config = getRateLimitConfig('/api/vibe-sessions/abc123/fragments')
      expect(config.keyPrefix).toBe('vsf')
      expect(config.limit).toBe(500)
    })

    it('returns correct config for vibe-sessions base endpoints', () => {
      const config = getRateLimitConfig('/api/vibe-sessions')
      expect(config.keyPrefix).toBe('vs')
      expect(config.limit).toBe(100)
    })

    it('returns correct config for AI endpoints', () => {
      const config = getRateLimitConfig('/api/v1/ai/schema')
      expect(config.keyPrefix).toBe('ai')
      expect(config.limit).toBe(50)
    })

    it('returns correct config for auth endpoints', () => {
      const config = getRateLimitConfig('/api/auth/callback')
      expect(config.keyPrefix).toBe('auth')
      expect(config.limit).toBe(10)
    })

    it('returns correct config for public endpoints', () => {
      const config = getRateLimitConfig('/api/public/articles')
      expect(config.keyPrefix).toBe('pub')
      expect(config.limit).toBe(100)
    })

    it('returns correct config for user endpoints', () => {
      const config = getRateLimitConfig('/api/user/api-keys')
      expect(config.keyPrefix).toBe('user')
      expect(config.limit).toBe(50)
    })

    it('returns default config for unknown endpoints', () => {
      const config = getRateLimitConfig('/api/unknown/endpoint')
      expect(config.keyPrefix).toBe('default')
      expect(config.limit).toBe(60)
    })

    it('handles paths without leading slash', () => {
      const config = getRateLimitConfig('api/vibe-sessions')
      expect(config.keyPrefix).toBe('vs')
    })
  })

  describe('checkRateLimit', () => {
    const config: RateLimitConfig = {
      limit: 5,
      windowSeconds: 60,
      keyPrefix: 'test',
    }

    it('allows requests within limit', () => {
      const result = checkRateLimit('test-ip', config, '/api/test')
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(5)
      expect(result.remaining).toBe(4)
    })

    it('decrements remaining on each request', () => {
      for (let i = 0; i < 4; i++) {
        checkRateLimit('test-ip', config, '/api/test')
      }
      const result = checkRateLimit('test-ip', config, '/api/test')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(0)
    })

    it('blocks requests when limit exceeded', () => {
      // Use up all requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit('test-ip', config, '/api/test')
      }

      // Next request should be blocked
      const result = checkRateLimit('test-ip', config, '/api/test')
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeDefined()
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('tracks different identifiers separately', () => {
      // Use up requests for ip1
      for (let i = 0; i < 5; i++) {
        checkRateLimit('ip1', config, '/api/test')
      }

      // ip2 should still have full limit
      const result = checkRateLimit('ip2', config, '/api/test')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('tracks different paths separately', () => {
      // Use up requests for path1
      for (let i = 0; i < 5; i++) {
        checkRateLimit('test-ip', config, '/api/path1')
      }

      // path2 should still have full limit
      const result = checkRateLimit('test-ip', config, '/api/path2')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('resets after window expires', async () => {
      const shortConfig: RateLimitConfig = {
        limit: 2,
        windowSeconds: 1, // 1 second window
        keyPrefix: 'short',
      }

      // Use up requests
      checkRateLimit('test-ip', shortConfig, '/api/test')
      checkRateLimit('test-ip', shortConfig, '/api/test')

      // Should be blocked
      let result = checkRateLimit('test-ip', shortConfig, '/api/test')
      expect(result.allowed).toBe(false)

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 1100))

      // Should be allowed again
      result = checkRateLimit('test-ip', shortConfig, '/api/test')
      expect(result.allowed).toBe(true)
    })
  })

  describe('getClientIdentifier', () => {
    it('extracts user ID from Bearer token', () => {
      const request = createMockRequest({
        headers: {
          authorization: 'Bearer test-token-12345678',
        },
      })
      const identifier = getClientIdentifier(request)
      // slice(0, 16) takes first 16 chars: "test-token-12345"
      expect(identifier).toBe('user:test-token-12345')
    })

    it('extracts MCP API key identifier', () => {
      const request = createMockRequest({
        headers: {
          'x-mcp-api-key': 'mcp-key-123456789012',
        },
      })
      const identifier = getClientIdentifier(request)
      // slice(0, 16) takes first 16 chars: "mcp-key-12345678"
      expect(identifier).toBe('mcp:mcp-key-12345678')
    })

    it('extracts IP from x-forwarded-for header', () => {
      const request = createMockRequest({
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      })
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:192.168.1.1')
    })

    it('extracts IP from x-real-ip header', () => {
      const request = createMockRequest({
        headers: {
          'x-real-ip': '192.168.1.2',
        },
      })
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:192.168.1.2')
    })

    it('prefers x-forwarded-for over x-real-ip', () => {
      const request = createMockRequest({
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '192.168.1.2',
        },
      })
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:192.168.1.1')
    })

    it('generates fallback identifier when no headers present', () => {
      const request = createMockRequest()
      const identifier = getClientIdentifier(request)
      expect(identifier).toMatch(/^ip:unknown-/)
    })

    it('prefers user ID over IP headers', () => {
      const request = createMockRequest({
        headers: {
          authorization: 'Bearer user-token-12345678',
          'x-forwarded-for': '192.168.1.1',
        },
      })
      const identifier = getClientIdentifier(request)
      // slice(0, 16) takes first 16 chars: "user-token-12345"
      expect(identifier).toBe('user:user-token-12345')
    })
  })

  describe('createRateLimitHeaders', () => {
    it('creates correct headers for allowed request', () => {
      const result = {
        allowed: true,
        limit: 100,
        remaining: 99,
        resetTime: Date.now() + 60000,
      }
      const headers = createRateLimitHeaders(result)

      expect(headers.get('X-RateLimit-Limit')).toBe('100')
      expect(headers.get('X-RateLimit-Remaining')).toBe('99')
      expect(headers.get('X-RateLimit-Reset')).toBe(result.resetTime.toString())
      expect(headers.get('Retry-After')).toBeNull()
    })

    it('creates correct headers for rate limited request', () => {
      const result = {
        allowed: false,
        limit: 100,
        remaining: 0,
        resetTime: Date.now() + 60000,
        retryAfter: 30,
      }
      const headers = createRateLimitHeaders(result)

      expect(headers.get('X-RateLimit-Limit')).toBe('100')
      expect(headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(headers.get('Retry-After')).toBe('30')
    })
  })

  describe('createRateLimitResponse', () => {
    it('creates 429 response with correct body', () => {
      const result = {
        allowed: false,
        limit: 100,
        remaining: 0,
        resetTime: Date.now() + 60000,
        retryAfter: 30,
      }
      const response = createRateLimitResponse(result)

      expect(response.status).toBe(429)
    })

    it('includes rate limit headers in response', () => {
      const result = {
        allowed: false,
        limit: 100,
        remaining: 0,
        resetTime: Date.now() + 60000,
        retryAfter: 30,
      }
      const response = createRateLimitResponse(result)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('100')
      expect(response.headers.get('Retry-After')).toBe('30')
    })
  })

  describe('shouldSkipRateLimit', () => {
    it('skips health check endpoints', () => {
      expect(shouldSkipRateLimit('/api/health')).toBe(true)
    })

    it('skips webhook endpoints', () => {
      expect(shouldSkipRateLimit('/api/webhook')).toBe(true)
    })

    it('skips Next.js internal paths', () => {
      expect(shouldSkipRateLimit('/_next/static/chunk.js')).toBe(true)
    })

    it('skips favicon', () => {
      expect(shouldSkipRateLimit('/favicon.ico')).toBe(true)
    })

    it('does not skip API endpoints', () => {
      expect(shouldSkipRateLimit('/api/vibe-sessions')).toBe(false)
    })
  })

  describe('getStoreSize and clearRateLimitStore', () => {
    it('tracks store size correctly', () => {
      expect(getStoreSize()).toBe(0)

      const config: RateLimitConfig = {
        limit: 10,
        windowSeconds: 60,
        keyPrefix: 'test',
      }

      checkRateLimit('ip1', config, '/api/test')
      expect(getStoreSize()).toBe(1)

      checkRateLimit('ip2', config, '/api/test')
      expect(getStoreSize()).toBe(2)
    })

    it('clears store correctly', () => {
      const config: RateLimitConfig = {
        limit: 10,
        windowSeconds: 60,
        keyPrefix: 'test',
      }

      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip2', config, '/api/test')
      expect(getStoreSize()).toBe(2)

      clearRateLimitStore()
      expect(getStoreSize()).toBe(0)
    })
  })

  describe('cleanup interval', () => {
    it('starts and stops cleanup interval', () => {
      startCleanupInterval()
      // No error should be thrown

      stopCleanupInterval()
      // No error should be thrown
    })

    it('does not start multiple intervals', () => {
      startCleanupInterval()
      startCleanupInterval()
      // Should only have one interval

      stopCleanupInterval()
    })
  })

  describe('DEFAULT_RATE_LIMITS', () => {
    it('has all expected rate limit configurations', () => {
      expect(DEFAULT_RATE_LIMITS['api/vibe-sessions']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/vibe-sessions/fragments']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/vibe-sessions/generate']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/v1/ai']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/auth']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/public']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/user']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/articles']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['api/projects']).toBeDefined()
      expect(DEFAULT_RATE_LIMITS['default']).toBeDefined()
    })

    it('has stricter limits for auth endpoints', () => {
      const authConfig = DEFAULT_RATE_LIMITS['api/auth']
      const defaultConfig = DEFAULT_RATE_LIMITS['default']
      expect(authConfig.limit).toBeLessThan(defaultConfig.limit)
    })

    it('has stricter limits for LLM endpoints', () => {
      const llmConfig = DEFAULT_RATE_LIMITS['api/vibe-sessions/generate']
      const defaultConfig = DEFAULT_RATE_LIMITS['default']
      expect(llmConfig.limit).toBeLessThan(defaultConfig.limit)
    })

    it('has higher limits for fragments endpoints', () => {
      const fragmentsConfig = DEFAULT_RATE_LIMITS['api/vibe-sessions/fragments']
      const defaultConfig = DEFAULT_RATE_LIMITS['default']
      expect(fragmentsConfig.limit).toBeGreaterThan(defaultConfig.limit)
    })
  })

  describe('Environment-based Configuration', () => {
    it('isProduction returns false in test environment', () => {
      // NODE_ENV is 'test' when running vitest
      expect(isProduction()).toBe(false)
    })

    it('returns development limits in test environment', () => {
      const config = getRateLimitConfig('/api/vibe-sessions')
      // In development/test, should return full limit (100)
      expect(config.limit).toBe(100)
    })

    it('returns correct limits for all endpoints in development', () => {
      // Verify all endpoints return expected development limits
      const testCases = [
        { path: '/api/vibe-sessions', expectedLimit: 100 },
        { path: '/api/vibe-sessions/abc123/fragments', expectedLimit: 500 },
        { path: '/api/vibe-sessions/generate-structured-context', expectedLimit: 20 },
        { path: '/api/v1/ai/schema', expectedLimit: 50 },
        { path: '/api/auth/callback', expectedLimit: 10 },
        { path: '/api/public/articles', expectedLimit: 100 },
        { path: '/api/user/api-keys', expectedLimit: 50 },
        { path: '/api/unknown', expectedLimit: 60 },
      ]

      testCases.forEach(({ path, expectedLimit }) => {
        const config = getRateLimitConfig(path)
        expect(config.limit).toBe(expectedLimit)
      })
    })
  })

  describe('Rate Limit Statistics', () => {
    const config: RateLimitConfig = {
      limit: 3,
      windowSeconds: 60,
      keyPrefix: 'stats-test',
    }

    it('tracks total requests', () => {
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip2', config, '/api/test')

      const stats = getRateLimitStats()
      expect(stats.totalRequests).toBe(3)
    })

    it('tracks blocked requests', () => {
      // Use up limit
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')

      // This should be blocked
      checkRateLimit('ip1', config, '/api/test')

      const stats = getRateLimitStats()
      expect(stats.blockedRequests).toBe(1)
    })

    it('calculates block rate correctly', () => {
      // 3 allowed, 2 blocked
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test') // blocked
      checkRateLimit('ip1', config, '/api/test') // blocked

      const stats = getRateLimitStats()
      expect(stats.totalRequests).toBe(5)
      expect(stats.blockedRequests).toBe(2)
      expect(stats.blockRate).toBe(40) // 2/5 = 40%
    })

    it('tracks last blocked timestamp', () => {
      // Use up limit
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')

      const beforeBlock = getRateLimitStats()
      expect(beforeBlock.lastBlockedAt).toBeNull()

      // This should be blocked
      checkRateLimit('ip1', config, '/api/test')

      const afterBlock = getRateLimitStats()
      expect(afterBlock.lastBlockedAt).not.toBeNull()
      expect(afterBlock.lastBlockedAt).toBeGreaterThan(0)
    })

    it('tracks top blocked paths', () => {
      const config2: RateLimitConfig = { limit: 2, windowSeconds: 60, keyPrefix: 'test2' }

      // Block path1 twice
      checkRateLimit('ip1', config2, '/api/path1')
      checkRateLimit('ip1', config2, '/api/path1')
      checkRateLimit('ip1', config2, '/api/path1') // blocked

      // Block path2 once
      checkRateLimit('ip2', config2, '/api/path2')
      checkRateLimit('ip2', config2, '/api/path2')
      checkRateLimit('ip2', config2, '/api/path2') // blocked

      const stats = getRateLimitStats()
      expect(stats.topBlockedPaths).toHaveLength(2)
      expect(stats.topBlockedPaths[0].path).toBe('/api/path1')
      expect(stats.topBlockedPaths[0].count).toBe(1)
    })

    it('clearStats resets all statistics', () => {
      // Generate some stats
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test')
      checkRateLimit('ip1', config, '/api/test') // blocked

      const beforeClear = getRateLimitStats()
      expect(beforeClear.totalRequests).toBe(4)
      expect(beforeClear.blockedRequests).toBe(1)

      clearStats()

      const afterClear = getRateLimitStats()
      expect(afterClear.totalRequests).toBe(0)
      expect(afterClear.blockedRequests).toBe(0)
      expect(afterClear.lastBlockedAt).toBeNull()
      expect(afterClear.topBlockedPaths).toHaveLength(0)
    })
  })
})
