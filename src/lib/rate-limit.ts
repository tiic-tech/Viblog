/**
 * Rate Limiter Utility
 *
 * Implements a sliding window rate limiting algorithm with in-memory storage.
 * Can be extended to use Redis for distributed rate limiting in production.
 *
 * Features:
 * - Sliding window algorithm for precise rate limiting
 * - Per-IP and per-user rate limiting
 * - Configurable thresholds per endpoint pattern
 * - Rate limit headers in responses
 * - Environment-based configuration (stricter in production)
 * - Rate limit violation monitoring/logging
 */

import { NextResponse, type NextRequest } from 'next/server'

/**
 * Rate limit configuration for an endpoint pattern
 */
export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
  /** Optional: Key prefix for identification */
  keyPrefix?: string
}

/**
 * Rate limit result returned by the limiter
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Maximum requests allowed */
  limit: number
  /** Remaining requests in current window */
  remaining: number
  /** Unix timestamp when the window resets */
  resetTime: number
  /** Retry-after seconds (only set when rate limited) */
  retryAfter?: number
}

/**
 * Internal entry for tracking requests
 */
interface RateLimitEntry {
  timestamps: number[]
  lastCleanup: number
}

/**
 * Statistics for monitoring
 */
interface RateLimitStats {
  totalRequests: number
  blockedRequests: number
  lastBlockedAt: number | null
  topBlockedPaths: Map<string, number>
}

/**
 * In-memory store for rate limit entries
 * Key format: `${keyPrefix}:${identifier}:${path}`
 */
const memoryStore = new Map<string, RateLimitEntry>()

/**
 * Statistics for monitoring
 */
const stats: RateLimitStats = {
  totalRequests: 0,
  blockedRequests: 0,
  lastBlockedAt: null,
  topBlockedPaths: new Map(),
}

/**
 * Get current environment
 */
function getEnvironment(): 'development' | 'test' | 'production' {
  return (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development'
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production'
}

/**
 * Rate limit multiplier for production (reduces limits)
 * Production limits are 50% of development limits
 */
const PRODUCTION_MULTIPLIER = 0.5

/**
 * Cleanup interval in milliseconds (5 minutes)
 */
const CLEANUP_INTERVAL = 5 * 60 * 1000

/**
 * Maximum age for entries before cleanup (10 minutes)
 */
const MAX_ENTRY_AGE = 10 * 60 * 1000

/**
 * Default rate limit configurations per endpoint pattern (development values)
 * Production values are automatically reduced by PRODUCTION_MULTIPLIER
 */
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // MCP API endpoints - higher limits for legitimate use
  'api/vibe-sessions': { limit: 100, windowSeconds: 60, keyPrefix: 'vs' },
  'api/vibe-sessions/fragments': { limit: 500, windowSeconds: 60, keyPrefix: 'vsf' },

  // LLM-powered endpoints - lower limits (cost control)
  'api/vibe-sessions/generate': { limit: 20, windowSeconds: 60, keyPrefix: 'vsg' },

  // AI data access endpoints
  'api/v1/ai': { limit: 50, windowSeconds: 60, keyPrefix: 'ai' },

  // Auth endpoints - strict limits
  'api/auth': { limit: 10, windowSeconds: 60, keyPrefix: 'auth' },

  // Public endpoints - moderate limits
  'api/public': { limit: 100, windowSeconds: 60, keyPrefix: 'pub' },

  // User endpoints
  'api/user': { limit: 50, windowSeconds: 60, keyPrefix: 'user' },

  // Articles endpoints
  'api/articles': { limit: 50, windowSeconds: 60, keyPrefix: 'art' },

  // Projects endpoints
  'api/projects': { limit: 50, windowSeconds: 60, keyPrefix: 'proj' },

  // Default fallback
  default: { limit: 60, windowSeconds: 60, keyPrefix: 'default' },
}

/**
 * Apply environment-based multiplier to rate limit config
 * Production environments have stricter limits (50% of development)
 */
function applyEnvironmentMultiplier(config: RateLimitConfig): RateLimitConfig {
  if (!isProduction()) {
    return config
  }

  return {
    ...config,
    limit: Math.max(1, Math.floor(config.limit * PRODUCTION_MULTIPLIER)),
  }
}

/**
 * Get the rate limit config for a given path
 * Applies environment-based multiplier for production
 */
export function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Normalize pathname
  const normalizedPath = pathname.startsWith('/') ? pathname.slice(1) : pathname

  // Get base config based on pattern matching
  let config: RateLimitConfig

  // Check patterns in order of specificity
  // First check for specific patterns
  if (normalizedPath.includes('vibe-sessions/generate')) {
    config = DEFAULT_RATE_LIMITS['api/vibe-sessions/generate']
  }
  // Check fragments BEFORE base vibe-sessions (more specific pattern first)
  else if (normalizedPath.match(/vibe-sessions\/[^/]+\/fragments/)) {
    config = DEFAULT_RATE_LIMITS['api/vibe-sessions/fragments']
  } else if (normalizedPath.startsWith('api/vibe-sessions')) {
    config = DEFAULT_RATE_LIMITS['api/vibe-sessions']
  } else if (normalizedPath.startsWith('api/v1/ai')) {
    config = DEFAULT_RATE_LIMITS['api/v1/ai']
  } else if (normalizedPath.startsWith('api/auth')) {
    config = DEFAULT_RATE_LIMITS['api/auth']
  } else if (normalizedPath.startsWith('api/public')) {
    config = DEFAULT_RATE_LIMITS['api/public']
  } else if (normalizedPath.startsWith('api/user')) {
    config = DEFAULT_RATE_LIMITS['api/user']
  } else if (normalizedPath.startsWith('api/articles')) {
    config = DEFAULT_RATE_LIMITS['api/articles']
  } else if (normalizedPath.startsWith('api/projects')) {
    config = DEFAULT_RATE_LIMITS['api/projects']
  } else {
    config = DEFAULT_RATE_LIMITS['default']
  }

  // Apply environment multiplier for production
  return applyEnvironmentMultiplier(config)
}

/**
 * Clean up old entries from the memory store
 */
function cleanupOldEntries(): void {
  const now = Date.now()
  const cutoff = now - MAX_ENTRY_AGE

  for (const [key, entry] of memoryStore.entries()) {
    if (entry.lastCleanup < cutoff) {
      memoryStore.delete(key)
    }
  }
}

// Run cleanup periodically
let cleanupInterval: NodeJS.Timeout | null = null

/**
 * Start the cleanup interval (call once at server start)
 */
export function startCleanupInterval(): void {
  if (!cleanupInterval) {
    cleanupInterval = setInterval(cleanupOldEntries, CLEANUP_INTERVAL)
  }
}

/**
 * Stop the cleanup interval (for testing)
 */
export function stopCleanupInterval(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
    cleanupInterval = null
  }
}

/**
 * Check rate limit for a request
 *
 * @param identifier - Unique identifier (IP address or user ID)
 * @param config - Rate limit configuration
 * @param pathname - Request path for key generation
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
  pathname: string
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - config.windowSeconds * 1000

  // Generate unique key for this rate limit bucket
  const key = `${config.keyPrefix}:${identifier}:${pathname}`

  // Get or create entry
  let entry = memoryStore.get(key)
  if (!entry) {
    entry = { timestamps: [], lastCleanup: now }
    memoryStore.set(key, entry)
  }

  // Filter timestamps within the current window (sliding window)
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart)
  entry.lastCleanup = now

  const currentCount = entry.timestamps.length
  const remaining = Math.max(0, config.limit - currentCount)
  const resetTime = now + config.windowSeconds * 1000

  // Track total requests
  stats.totalRequests++

  // Check if rate limited
  if (currentCount >= config.limit) {
    // Find the oldest timestamp to calculate retry-after
    const oldestTimestamp = Math.min(...entry.timestamps)
    const retryAfter = Math.ceil((oldestTimestamp - windowStart) / 1000)

    // Track blocked requests
    stats.blockedRequests++
    stats.lastBlockedAt = now

    // Track blocked paths
    const currentCountForPath = stats.topBlockedPaths.get(pathname) || 0
    stats.topBlockedPaths.set(pathname, currentCountForPath + 1)

    // Log rate limit violation (in production, this would go to monitoring service)
    logRateLimitViolation(identifier, pathname, config, currentCount)

    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetTime,
      retryAfter: Math.max(1, retryAfter),
    }
  }

  // Add current request timestamp
  entry.timestamps.push(now)

  return {
    allowed: true,
    limit: config.limit,
    remaining: remaining - 1, // Account for current request
    resetTime,
  }
}

/**
 * Log a rate limit violation
 * In production, this would send to a monitoring service (e.g., Sentry, Datadog)
 */
function logRateLimitViolation(
  identifier: string,
  pathname: string,
  config: RateLimitConfig,
  requestCount: number
): void {
  // Only log in production to avoid noise in development
  if (isProduction()) {
    // Structured log for production monitoring
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        event: 'rate_limit_violation',
        identifier,
        pathname,
        limit: config.limit,
        windowSeconds: config.windowSeconds,
        requestCount,
        environment: 'production',
      })
    )
  }
}

/**
 * Extract client identifier from request
 * Uses user ID if authenticated, falls back to IP address
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    // Use a hash of the token to identify the user
    const token = authHeader.slice(7)
    // Simple hash for identification (not cryptographic)
    return `user:${token.slice(0, 16)}`
  }

  // Try MCP API Key
  const mcpApiKey = request.headers.get('x-mcp-api-key')
  if (mcpApiKey) {
    return `mcp:${mcpApiKey.slice(0, 16)}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    // x-forwarded-for may contain multiple IPs, use the first one
    return `ip:${forwarded.split(',')[0].trim()}`
  }

  if (realIp) {
    return `ip:${realIp}`
  }

  // Last resort: use a hash of available headers
  return `ip:unknown-${Date.now().toString(36)}`
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Headers {
  const headers = new Headers()
  headers.set('X-RateLimit-Limit', result.limit.toString())
  headers.set('X-RateLimit-Remaining', result.remaining.toString())
  headers.set('X-RateLimit-Reset', result.resetTime.toString())

  if (result.retryAfter) {
    headers.set('Retry-After', result.retryAfter.toString())
  }

  return headers
}

/**
 * Create a rate limit exceeded response
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
        retryAfter: result.retryAfter,
      },
    },
    { status: 429 }
  )

  // Add rate limit headers
  const headers = createRateLimitHeaders(result)
  headers.forEach((value, key) => response.headers.set(key, value))

  return response
}

/**
 * Check if rate limiting should be skipped
 * Useful for health checks and internal endpoints
 */
export function shouldSkipRateLimit(pathname: string): boolean {
  const skipPatterns = ['/api/health', '/api/webhook', '/_next/', '/favicon.ico']

  return skipPatterns.some((pattern) => pathname.startsWith(pattern))
}

/**
 * Clear all rate limit entries (for testing)
 */
export function clearRateLimitStore(): void {
  memoryStore.clear()
}

/**
 * Get current store size (for testing/debugging)
 */
export function getStoreSize(): number {
  return memoryStore.size
}

/**
 * Get rate limit statistics (for monitoring)
 */
export function getRateLimitStats(): {
  totalRequests: number
  blockedRequests: number
  blockRate: number
  lastBlockedAt: number | null
  topBlockedPaths: Array<{ path: string; count: number }>
} {
  // Sort blocked paths by count
  const topBlockedPaths = Array.from(stats.topBlockedPaths.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10

  return {
    totalRequests: stats.totalRequests,
    blockedRequests: stats.blockedRequests,
    blockRate: stats.totalRequests > 0 ? (stats.blockedRequests / stats.totalRequests) * 100 : 0,
    lastBlockedAt: stats.lastBlockedAt,
    topBlockedPaths,
  }
}

/**
 * Clear statistics (for testing)
 */
export function clearStats(): void {
  stats.totalRequests = 0
  stats.blockedRequests = 0
  stats.lastBlockedAt = null
  stats.topBlockedPaths.clear()
}
