/**
 * Rate Limiter for API Client
 *
 * Implements token bucket algorithm for request throttling
 * with exponential backoff retry for transient errors.
 */

export interface RateLimiterConfig {
  /** Maximum requests allowed per window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Maximum retries for failed requests */
  maxRetries: number
  /** Base delay for exponential backoff (ms) */
  baseDelayMs: number
  /** Maximum delay for exponential backoff (ms) */
  maxDelayMs: number
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  maxRetries: 3,
  baseDelayMs: 1000, // 1 second
  maxDelayMs: 30000, // 30 seconds
}

/**
 * Token bucket rate limiter with exponential backoff
 */
export class RateLimiter {
  private config: RateLimiterConfig
  private tokens: number
  private lastRefill: number

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.tokens = this.config.maxRequests
    this.lastRefill = Date.now()
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    const tokensToAdd = Math.floor(
      (elapsed / this.config.windowMs) * this.config.maxRequests
    )

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.config.maxRequests, this.tokens + tokensToAdd)
      this.lastRefill = now
    }
  }

  /**
   * Check if a request can be made immediately
   */
  canRequest(): boolean {
    this.refill()
    return this.tokens > 0
  }

  /**
   * Consume a token for a request
   * @returns true if token was consumed, false if rate limited
   */
  consumeToken(): boolean {
    this.refill()
    if (this.tokens > 0) {
      this.tokens--
      return true
    }
    return false
  }

  /**
   * Get time until next token is available (in ms)
   */
  getTimeUntilNextToken(): number {
    this.refill()
    if (this.tokens > 0) {
      return 0
    }
    // Time for one token to be refilled
    return Math.ceil(this.config.windowMs / this.config.maxRequests)
  }

  /**
   * Wait for a token to be available
   */
  async waitForToken(): Promise<void> {
    while (!this.consumeToken()) {
      const waitTime = this.getTimeUntilNextToken()
      await this.sleep(waitTime)
    }
  }

  /**
   * Calculate delay for exponential backoff
   */
  getBackoffDelay(attempt: number): number {
    const delay = Math.min(
      this.config.baseDelayMs * Math.pow(2, attempt),
      this.config.maxDelayMs
    )
    // Add jitter (±25%) to prevent thundering herd
    const jitter = delay * 0.25 * (Math.random() * 2 - 1)
    return Math.floor(delay + jitter)
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(status: number): boolean {
    // 429: Too Many Requests
    // 500: Internal Server Error
    // 502: Bad Gateway
    // 503: Service Unavailable
    // 504: Gateway Timeout
    return status === 429 || status >= 500
  }

  /**
   * Execute a function with rate limiting and retry
   */
  async executeWithRetry<T>(
    fn: () => Promise<{ status: number; data: unknown }>
  ): Promise<{ status: number; data: unknown; attempts: number }> {
    let lastError: { status: number; data: unknown } | null = null

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      // Wait for rate limit token
      await this.waitForToken()

      try {
        const result = await fn()

        // Success
        if (result.status >= 200 && result.status < 300) {
          return { ...result, attempts: attempt + 1 }
        }

        // Check if we should retry
        if (this.isRetryableError(result.status) && attempt < this.config.maxRetries) {
          lastError = result
          const delay = this.getBackoffDelay(attempt)

          // Check for Retry-After header (not available in our mock, but would be in real impl)
          // const retryAfter = result.headers?.get('Retry-After')

          await this.sleep(delay)
          continue
        }

        // Non-retryable error or max retries
        return { ...result, attempts: attempt + 1 }
      } catch (err) {
        // Network errors should be retried
        if (attempt < this.config.maxRetries) {
          const delay = this.getBackoffDelay(attempt)
          await this.sleep(delay)
          continue
        }
        throw err
      }
    }

    // Should not reach here, but TypeScript needs it
    return {
      status: lastError?.status ?? 500,
      data: lastError?.data ?? { error: 'Max retries exceeded' },
      attempts: this.config.maxRetries + 1,
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

/**
 * Global rate limiter instance
 * Can be configured via environment variables
 */
export function createRateLimiter(): RateLimiter {
  return new RateLimiter({
    maxRequests: parseInt(process.env.VIBLOG_RATE_LIMIT_MAX ?? '100', 10),
    windowMs: parseInt(process.env.VIBLOG_RATE_LIMIT_WINDOW_MS ?? '60000', 10),
    maxRetries: parseInt(process.env.VIBLOG_RATE_LIMIT_RETRIES ?? '3', 10),
  })
}