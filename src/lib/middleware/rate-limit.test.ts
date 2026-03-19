/**
 * Tests for Rate Limiting Middleware
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, addRateLimitHeaders, isApiRoute } from './rate-limit'
import { clearRateLimitStore } from '../rate-limit'

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

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    clearRateLimitStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('applyRateLimit', () => {
    it('returns null for non-API routes', () => {
      const request = createMockRequest({ pathname: '/dashboard' })
      const result = applyRateLimit(request)
      expect(result).toBeNull()
    })

    it('returns null for skipped paths', () => {
      const request = createMockRequest({ pathname: '/api/health' })
      const result = applyRateLimit(request)
      expect(result).toBeNull()
    })

    it('returns null when within rate limit', () => {
      const request = createMockRequest({ pathname: '/api/vibe-sessions' })
      const result = applyRateLimit(request)
      expect(result).toBeNull()
    })

    it('returns 429 response when rate limit exceeded', () => {
      // Use a consistent IP to ensure all requests are tracked together
      const request = createMockRequest({
        pathname: '/api/auth',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      })
      // Auth endpoint has limit of 10, so make 10 requests to exhaust it
      for (let i = 0; i < 10; i++) {
        applyRateLimit(request)
      }

      // Next request should be rate limited
      const result = applyRateLimit(request)
      expect(result).not.toBeNull()
      expect(result?.status).toBe(429)
    })

    it('tracks different IPs separately', () => {
      const request1 = createMockRequest({
        pathname: '/api/vibe-sessions',
        headers: { 'x-forwarded-for': '192.168.1.1' },
      })
      const request2 = createMockRequest({
        pathname: '/api/vibe-sessions',
        headers: { 'x-forwarded-for': '192.168.1.2' },
      })

      // Use up limit for IP1
      for (let i = 0; i < 110; i++) {
        applyRateLimit(request1)
      }

      // IP2 should still be allowed
      const result = applyRateLimit(request2)
      expect(result).toBeNull()
    })
  })

  describe('addRateLimitHeaders', () => {
    it('adds rate limit headers to response', () => {
      const request = createMockRequest({ pathname: '/api/vibe-sessions' })
      const response = NextResponse.next()

      const modifiedResponse = addRateLimitHeaders(response, request)

      expect(modifiedResponse.headers.get('X-RateLimit-Limit')).toBe('100')
      expect(modifiedResponse.headers.get('X-RateLimit-Remaining')).not.toBeNull()
      expect(modifiedResponse.headers.get('X-RateLimit-Reset')).not.toBeNull()
    })

    it('does not add headers for non-API routes', () => {
      const request = createMockRequest({ pathname: '/dashboard' })
      const response = NextResponse.next()

      const modifiedResponse = addRateLimitHeaders(response, request)

      expect(modifiedResponse.headers.get('X-RateLimit-Limit')).toBeNull()
    })

    it('decrements remaining count', () => {
      const request = createMockRequest({ pathname: '/api/vibe-sessions' })
      const response1 = NextResponse.next()
      const response2 = NextResponse.next()

      addRateLimitHeaders(response1, request)
      const modifiedResponse2 = addRateLimitHeaders(response2, request)

      const remaining1 = parseInt(response1.headers.get('X-RateLimit-Remaining') || '100')
      const remaining2 = parseInt(modifiedResponse2.headers.get('X-RateLimit-Remaining') || '100')

      expect(remaining2).toBe(remaining1 - 1)
    })
  })

  describe('isApiRoute', () => {
    it('returns true for API routes', () => {
      expect(isApiRoute('/api/vibe-sessions')).toBe(true)
      expect(isApiRoute('/api/auth/callback')).toBe(true)
      expect(isApiRoute('/api/v1/ai/schema')).toBe(true)
    })

    it('returns false for non-API routes', () => {
      expect(isApiRoute('/dashboard')).toBe(false)
      expect(isApiRoute('/login')).toBe(false)
      expect(isApiRoute('/')).toBe(false)
    })
  })
})
