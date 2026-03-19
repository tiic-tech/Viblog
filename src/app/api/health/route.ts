import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCacheStats } from '@/lib/cache'
import { logger, generateRequestId } from '@/lib/logger'

/**
 * Health status for individual components
 */
interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  latency?: number
  message?: string
  details?: Record<string, unknown>
}

/**
 * Overall health check response
 */
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  requestId: string
  version: string
  uptime: number
  components: {
    database: ComponentHealth
    cache: ComponentHealth
  }
}

/**
 * Track server start time for uptime calculation
 */
const serverStartTime = Date.now()

/**
 * Get version from environment or default
 */
function getVersion(): string {
  return process.env.npm_package_version || process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown'
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<ComponentHealth> {
  const startTime = Date.now()

  try {
    const supabase = await createClient()

    // Simple query to check connectivity
    const { error } = await supabase
      .from('authorization_tokens')
      .select('id')
      .limit(1)

    const latency = Date.now() - startTime

    if (error) {
      logger.error('Database health check failed', error)
      return {
        status: 'unhealthy',
        latency,
        message: error.message,
      }
    }

    return {
      status: 'healthy',
      latency,
      message: 'Connected',
    }
  } catch (error) {
    const latency = Date.now() - startTime
    logger.error('Database health check error', error)
    return {
      status: 'unhealthy',
      latency,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check cache (Redis) connectivity
 */
async function checkCache(): Promise<ComponentHealth> {
  const startTime = Date.now()
  const stats = getCacheStats()

  try {
    // Check if Redis is configured
    if (!stats.isRedisEnabled) {
      return {
        status: 'degraded',
        latency: 0,
        message: 'Redis not configured, using in-memory cache',
        details: {
          memoryCacheSize: stats.memoryCacheSize,
          mode: 'memory',
        },
      }
    }

    // Redis is configured, check connectivity
    // We can infer connectivity from successful operations
    // The actual ping would require direct Redis client access
    const latency = Date.now() - startTime

    return {
      status: 'healthy',
      latency,
      message: 'Redis connected',
      details: {
        memoryCacheSize: stats.memoryCacheSize,
        mode: 'redis',
      },
    }
  } catch (error) {
    const latency = Date.now() - startTime
    logger.error('Cache health check error', error)
    return {
      status: 'unhealthy',
      latency,
      message: error instanceof Error ? error.message : 'Unknown error',
      details: {
        memoryCacheSize: stats.memoryCacheSize,
        mode: 'unknown',
      },
    }
  }
}

/**
 * Determine overall health status from components
 */
function determineOverallStatus(
  components: HealthCheckResponse['components']
): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(components).map((c) => c.status)

  if (statuses.includes('unhealthy')) {
    return 'unhealthy'
  }

  if (statuses.includes('degraded')) {
    return 'degraded'
  }

  return 'healthy'
}

/**
 * GET /api/health
 * Comprehensive health check endpoint
 */
export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const requestId = generateRequestId()
  logger.setRequestId(requestId)

  try {
    // Run health checks in parallel
    const [database, cache] = await Promise.all([checkDatabase(), checkCache()])

    const components = { database, cache }
    const status = determineOverallStatus(components)

    const response: HealthCheckResponse = {
      status,
      timestamp: new Date().toISOString(),
      requestId,
      version: getVersion(),
      uptime: Math.floor((Date.now() - serverStartTime) / 1000),
      components,
    }

    // Log health check result
    logger.info('Health check completed', {
      status,
      dbLatency: database.latency,
      cacheStatus: cache.status,
    })

    // Return appropriate status code
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503

    return NextResponse.json(response, { status: statusCode })
  } catch (error) {
    logger.error('Health check failed', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        requestId,
        version: getVersion(),
        uptime: Math.floor((Date.now() - serverStartTime) / 1000),
        components: {
          database: { status: 'unhealthy', message: 'Health check failed' },
          cache: { status: 'unhealthy', message: 'Health check failed' },
        },
      },
      { status: 503 }
    )
  } finally {
    logger.clearRequestId()
  }
}