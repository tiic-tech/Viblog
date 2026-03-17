import { NextResponse } from 'next/server'

/**
 * Liveness probe response
 */
interface LivenessResponse {
  alive: boolean
  timestamp: string
  uptime: number
}

/**
 * Track server start time for uptime calculation
 */
const serverStartTime = Date.now()

/**
 * GET /api/health/live
 * Kubernetes liveness probe endpoint
 *
 * Returns 200 if the app process is alive and responding
 * If this endpoint fails, Kubernetes will restart the pod
 *
 * This is intentionally simple - just check if we can respond
 * Complex checks belong in the readiness probe
 */
export async function GET(): Promise<NextResponse<LivenessResponse>> {
  return NextResponse.json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - serverStartTime) / 1000),
  })
}