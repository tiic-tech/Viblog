/**
 * Tests for Rate Limiter
 *
 * Tests token bucket algorithm, exponential backoff, and retry logic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RateLimiter, createRateLimiter } from './rate-limiter.js'

describe('RateLimiter', () => {
  describe('Token Bucket', () => {
    it('should initialize with full tokens', () => {
      const limiter = new RateLimiter({ maxRequests: 10, windowMs: 1000 })
      expect(limiter.canRequest()).toBe(true)
    })

    it('should consume tokens', () => {
      const limiter = new RateLimiter({ maxRequests: 2, windowMs: 1000 })

      expect(limiter.consumeToken()).toBe(true)
      expect(limiter.consumeToken()).toBe(true)
      expect(limiter.consumeToken()).toBe(false) // No tokens left
    })

    it('should report time until next token', () => {
      const limiter = new RateLimiter({ maxRequests: 2, windowMs: 1000 })

      limiter.consumeToken()
      limiter.consumeToken()

      const waitTime = limiter.getTimeUntilNextToken()
      expect(waitTime).toBeGreaterThan(0)
      expect(waitTime).toBeLessThanOrEqual(500) // 1000ms / 2 tokens = 500ms per token
    })

    it('should return 0 when tokens available', () => {
      const limiter = new RateLimiter({ maxRequests: 10, windowMs: 1000 })
      expect(limiter.getTimeUntilNextToken()).toBe(0)
    })
  })

  describe('Exponential Backoff', () => {
    it('should calculate backoff delay with exponential growth', () => {
      const limiter = new RateLimiter({ baseDelayMs: 1000, maxDelayMs: 30000 })

      const delay0 = limiter.getBackoffDelay(0)
      const delay1 = limiter.getBackoffDelay(1)
      const delay2 = limiter.getBackoffDelay(2)

      // Exponential growth with jitter (±25%)
      // delay0: 1000 * 2^0 = 1000, range: 750-1250
      expect(delay0).toBeGreaterThanOrEqual(750)
      expect(delay0).toBeLessThanOrEqual(1250)

      // delay1: 1000 * 2^1 = 2000, range: 1500-2500
      expect(delay1).toBeGreaterThanOrEqual(1500)
      expect(delay1).toBeLessThanOrEqual(2500)

      // delay2: 1000 * 2^2 = 4000, range: 3000-5000
      expect(delay2).toBeGreaterThanOrEqual(3000)
      expect(delay2).toBeLessThanOrEqual(5000)
    })

    it('should cap delay at maxDelayMs', () => {
      const limiter = new RateLimiter({ baseDelayMs: 1000, maxDelayMs: 5000 })

      // Attempt 10 would be 1000 * 2^10 = 1024000, but should cap at 5000
      const delay = limiter.getBackoffDelay(10)
      expect(delay).toBeLessThanOrEqual(5000 * 1.25) // With jitter
    })

    it('should include jitter to prevent thundering herd', () => {
      const limiter = new RateLimiter({ baseDelayMs: 1000, maxDelayMs: 30000 })

      // Run multiple times to verify jitter variation
      const delays = new Set<number>()
      for (let i = 0; i < 100; i++) {
        delays.add(limiter.getBackoffDelay(0))
      }

      // Should have multiple different values due to jitter
      expect(delays.size).toBeGreaterThan(1)
    })
  })

  describe('Retryable Errors', () => {
    it('should identify retryable status codes', () => {
      const limiter = new RateLimiter()

      // 429 Too Many Requests
      expect(limiter.isRetryableError(429)).toBe(true)

      // 5xx Server Errors
      expect(limiter.isRetryableError(500)).toBe(true)
      expect(limiter.isRetryableError(502)).toBe(true)
      expect(limiter.isRetryableError(503)).toBe(true)
      expect(limiter.isRetryableError(504)).toBe(true)
    })

    it('should identify non-retryable status codes', () => {
      const limiter = new RateLimiter()

      // 4xx Client Errors (except 429)
      expect(limiter.isRetryableError(400)).toBe(false)
      expect(limiter.isRetryableError(401)).toBe(false)
      expect(limiter.isRetryableError(403)).toBe(false)
      expect(limiter.isRetryableError(404)).toBe(false)

      // 2xx Success
      expect(limiter.isRetryableError(200)).toBe(false)
      expect(limiter.isRetryableError(201)).toBe(false)
    })
  })

  describe('executeWithRetry', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should succeed on first try', async () => {
      const limiter = new RateLimiter({ maxRequests: 10, windowMs: 1000 })

      const fn = vi.fn().mockResolvedValue({
        status: 200,
        data: { success: true },
      })

      const result = limiter.executeWithRetry(fn)
      await vi.runAllTimersAsync()
      const awaited = await result

      expect(awaited.status).toBe(200)
      expect(awaited.attempts).toBe(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry on 429', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 2,
        baseDelayMs: 100,
      })

      const fn = vi.fn()
        .mockResolvedValueOnce({ status: 429, data: { error: 'Rate limited' } })
        .mockResolvedValueOnce({ status: 200, data: { success: true } })

      const resultPromise = limiter.executeWithRetry(fn)

      // Let the first call complete
      await vi.runAllTimersAsync()

      const result = await resultPromise
      expect(result.status).toBe(200)
      expect(result.attempts).toBe(2)
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should retry on 5xx errors', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 2,
        baseDelayMs: 100,
      })

      const fn = vi.fn()
        .mockResolvedValueOnce({ status: 500, data: { error: 'Internal error' } })
        .mockResolvedValueOnce({ status: 503, data: { error: 'Service unavailable' } })
        .mockResolvedValueOnce({ status: 200, data: { success: true } })

      const resultPromise = limiter.executeWithRetry(fn)
      await vi.runAllTimersAsync()
      const result = await resultPromise

      expect(result.status).toBe(200)
      expect(result.attempts).toBe(3)
    })

    it('should not retry on 4xx errors (except 429)', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 3,
      })

      const fn = vi.fn().mockResolvedValue({
        status: 401,
        data: { error: 'Unauthorized' },
      })

      const resultPromise = limiter.executeWithRetry(fn)
      await vi.runAllTimersAsync()
      const result = await resultPromise

      expect(result.status).toBe(401)
      expect(result.attempts).toBe(1)
      expect(fn).toHaveBeenCalledTimes(1) // No retry
    })

    it('should fail after max retries', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 2,
        baseDelayMs: 100,
      })

      const fn = vi.fn().mockResolvedValue({
        status: 503,
        data: { error: 'Service unavailable' },
      })

      const resultPromise = limiter.executeWithRetry(fn)
      await vi.runAllTimersAsync()
      const result = await resultPromise

      expect(result.status).toBe(503)
      expect(result.attempts).toBe(3) // Initial + 2 retries
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should retry on network errors', async () => {
      const limiter = new RateLimiter({
        maxRequests: 10,
        windowMs: 1000,
        maxRetries: 2,
        baseDelayMs: 100,
      })

      const networkError = new Error('Network error')
      const fn = vi.fn()
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ status: 200, data: { success: true } })

      const resultPromise = limiter.executeWithRetry(fn)
      await vi.runAllTimersAsync()
      const result = await resultPromise

      expect(result.status).toBe(200)
      expect(result.attempts).toBe(2)
    })

    it('should wait for rate limit token', async () => {
      const limiter = new RateLimiter({
        maxRequests: 1,
        windowMs: 1000,
        maxRetries: 0,
      })

      const fn = vi.fn().mockResolvedValue({
        status: 200,
        data: { success: true },
      })

      // First request consumes the only token
      const first = limiter.executeWithRetry(fn)
      await vi.runAllTimersAsync()
      await first

      // Second request should wait for token refill
      const secondPromise = limiter.executeWithRetry(fn)

      // Should not have called yet (waiting for token)
      expect(fn).toHaveBeenCalledTimes(1)

      // Advance time to allow token refill
      await vi.advanceTimersByTimeAsync(1001)

      const second = await secondPromise
      expect(second.status).toBe(200)
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})

describe('createRateLimiter', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should create limiter with defaults', () => {
    const limiter = createRateLimiter()
    expect(limiter).toBeInstanceOf(RateLimiter)
    expect(limiter.canRequest()).toBe(true)
  })

  it('should use environment variables for config', () => {
    process.env.VIBLOG_RATE_LIMIT_MAX = '50'
    process.env.VIBLOG_RATE_LIMIT_WINDOW_MS = '30000'
    process.env.VIBLOG_RATE_LIMIT_RETRIES = '5'

    const limiter = createRateLimiter()
    expect(limiter).toBeInstanceOf(RateLimiter)

    // Consume 50 tokens
    for (let i = 0; i < 50; i++) {
      expect(limiter.consumeToken()).toBe(true)
    }

    // 51st should fail
    expect(limiter.consumeToken()).toBe(false)
  })
})