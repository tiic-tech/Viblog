/**
 * Rate Limiting Middleware
 *
 * Integrates rate limiting with Next.js middleware for API routes.
 * Provides sliding window rate limiting with per-IP and per-user limits.
 */

import { NextResponse, type NextRequest } from 'next/server'
import {
  checkRateLimit,
  getRateLimitConfig,
  getClientIdentifier,
  createRateLimitResponse,
  shouldSkipRateLimit,
  startCleanupInterval,
} from '../rate-limit'

// Start cleanup interval when server starts
if (typeof window === 'undefined') {
  startCleanupInterval()
}

/**
 * Apply rate limiting to API requests
 *
 * @param request - Next.js request object
 * @returns Response if rate limited, null otherwise
 */
export function applyRateLimit(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname

  // Skip rate limiting for non-API routes and special paths
  if (!pathname.startsWith('/api') || shouldSkipRateLimit(pathname)) {
    return null
  }

  // Get rate limit configuration for this endpoint
  const config = getRateLimitConfig(pathname)

  // Get client identifier (IP or user ID)
  const identifier = getClientIdentifier(request)

  // Check rate limit
  const result = checkRateLimit(identifier, config, pathname)

  // Return rate limit response if blocked
  if (!result.allowed) {
    return createRateLimitResponse(result)
  }

  // Add rate limit headers to response via middleware
  // Note: Headers will be added in the response chain
  return null
}

/**
 * Create a response with rate limit headers
 */
export function addRateLimitHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname

  // Skip for non-API routes
  if (!pathname.startsWith('/api') || shouldSkipRateLimit(pathname)) {
    return response
  }

  const config = getRateLimitConfig(pathname)
  const identifier = getClientIdentifier(request)
  const result = checkRateLimit(identifier, config, pathname)

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString())

  return response
}

/**
 * Check if request is an API route
 */
export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api')
}
