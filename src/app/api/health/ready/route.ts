import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCacheStats } from '@/lib/cache'
import { logger, generateRequestId } from '@/lib/logger'

/**
 * Readiness probe response
 * Simpler than full health check - just confirms app can serve traffic
 */
interface ReadinessResponse {
  ready: boolean
  timestamp: string
  checks: {
    database: boolean
    cache: boolean
  }
}

/**
 * GET /api/health/ready
 * Kubernetes readiness probe endpoint
 *
 * Returns 200 if the app is ready to receive traffic
 * Returns 503 if any critical dependency is unavailable
 *
 * Used by Kubernetes to determine if a pod should receive traffic
 */
export async function GET(): Promise<NextResponse<ReadinessResponse>> {
  const requestId = generateRequestId()
  logger.setRequestId(requestId)

  try {
    // Check database connectivity
    let databaseReady = false
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('authorization_tokens')
        .select('id')
        .limit(1)

      databaseReady = !error
    } catch {
      databaseReady = false
    }

    // Check cache (always "ready" since we have memory fallback)
    const cacheStats = getCacheStats()
    const cacheReady = true // Memory cache always available

    const ready = databaseReady && cacheReady

    const response: ReadinessResponse = {
      ready,
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseReady,
        cache: cacheReady,
      },
    }

    if (!ready) {
      logger.warn('Readiness check failed', {
        databaseReady,
        cacheReady,
        cacheMode: cacheStats.isRedisEnabled ? 'redis' : 'memory',
      })
    }

    return NextResponse.json(response, { status: ready ? 200 : 503 })
  } catch (error) {
    logger.error('Readiness check error', error)

    return NextResponse.json(
      {
        ready: false,
        timestamp: new Date().toISOString(),
        checks: {
          database: false,
          cache: false,
        },
      },
      { status: 503 }
    )
  } finally {
    logger.clearRequestId()
  }
}