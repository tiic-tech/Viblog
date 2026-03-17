/**
 * Time Series Analytics Endpoint
 *
 * GET /api/v1/ai/timeseries/{metric}
 *
 * Returns aggregated time series data for behavioral analytics.
 * Supports article_views, user_engagement, and session_activity metrics.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateTokenAndGetUser } from '@/lib/auth/token-auth'
import {
  TimeSeriesMetricSchema,
  TimeSeriesQuerySchema,
  type TimeSeriesResponse,
  type TimeSeriesDataPoint,
  type TrendDirection,
} from '@/lib/validations/ai-data-access'

/**
 * Calculate trend from data points
 */
function calculateTrend(data: TimeSeriesDataPoint[]): TrendDirection {
  if (data.length < 2) return 'stable'

  const values = data.map((d) => d.value)
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  if (avg === 0) return 'stable'

  const first = values.slice(0, Math.ceil(values.length / 3))
  const last = values.slice(-Math.ceil(values.length / 3))

  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length
  const lastAvg = last.reduce((a, b) => a + b, 0) / last.length

  const change = (lastAvg - firstAvg) / avg

  if (change > 0.1) return 'increasing'
  if (change < -0.1) return 'decreasing'
  return 'stable'
}

/**
 * Get PostgreSQL date trunc function based on granularity
 */
function getDateTrunc(granularity: string): string {
  switch (granularity) {
    case 'hour':
      return "date_trunc('hour', created_at)"
    case 'day':
      return "date_trunc('day', created_at)"
    case 'week':
      return "date_trunc('week', created_at)"
    case 'month':
      return "date_trunc('month', created_at)"
    default:
      return "date_trunc('day', created_at)"
  }
}

/**
 * GET /api/v1/ai/timeseries/[metric]
 *
 * Query params:
 * - from: ISO date string (required)
 * - to: ISO date string (required)
 * - granularity: hour | day | week | month (default: day)
 * - aggregation: count | sum | avg | min | max (default: count)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ metric: string }> }
) {
  try {
    const { metric } = await params

    // Validate metric name
    const metricResult = TimeSeriesMetricSchema.safeParse(metric)
    if (!metricResult.success) {
      return NextResponse.json(
        { error: `Invalid metric: ${metric}. Valid metrics: article_views, user_engagement, session_activity` },
        { status: 400 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const queryResult = TimeSeriesQuerySchema.safeParse({
      from: searchParams.get('from'),
      to: searchParams.get('to'),
      granularity: searchParams.get('granularity') || 'day',
      aggregation: searchParams.get('aggregation') || 'count',
    })

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.issues },
        { status: 400 }
      )
    }

    const query = queryResult.data

    // Check authorization
    const authHeader = request.headers.get('authorization')
    const authResult = await validateTokenAndGetUser(authHeader)

    // Time series data requires user context
    let userId: string | null = null
    if ('context' in authResult) {
      userId = authResult.context.userId
    }

    const supabase = await createClient()
    const data: TimeSeriesDataPoint[] = []

    const dateTrunc = getDateTrunc(query.granularity)

    switch (metricResult.data) {
      case 'article_views': {
        // Query article views from user_interactions
        const fromDate = new Date(query.from)
        const toDate = new Date(query.to)

        // Build the query based on whether we have a user context
        let dbQuery = supabase
          .from('user_interactions')
          .select('created_at, interaction_type, article_id')
          .eq('interaction_type', 'view')
          .gte('created_at', fromDate.toISOString())
          .lte('created_at', toDate.toISOString())
          .order('created_at', { ascending: true })

        if (userId) {
          // User's own article views
          dbQuery = dbQuery.eq('user_id', userId)
        }

        const { data: interactions, error } = await dbQuery.limit(10000)

        if (error) {
          console.error('Article views query error:', error)
          return NextResponse.json(
            { error: 'Failed to query article views' },
            { status: 500 }
          )
        }

        // Aggregate by time period
        const aggregated = new Map<string, { count: number; articles: Set<string> }>()

        for (const interaction of interactions || []) {
          const time = new Date(interaction.created_at)
          let key: string

          switch (query.granularity) {
            case 'hour':
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours()).toISOString()
              break
            case 'day':
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toISOString()
              break
            case 'week':
              const weekStart = new Date(time)
              weekStart.setDate(time.getDate() - time.getDay())
              key = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).toISOString()
              break
            case 'month':
              key = new Date(time.getFullYear(), time.getMonth(), 1).toISOString()
              break
            default:
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toISOString()
          }

          const existing = aggregated.get(key) || { count: 0, articles: new Set<string>() }
          existing.count += 1
          if (interaction.article_id) {
            existing.articles.add(interaction.article_id)
          }
          aggregated.set(key, existing)
        }

        // Convert to data points
        for (const [time, stats] of aggregated.entries()) {
          data.push({
            time,
            value: stats.count,
            breakdown: {
              unique_articles: stats.articles.size,
            },
          })
        }

        // Sort by time
        data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        break
      }

      case 'user_engagement': {
        // Query user engagement metrics
        if (!userId) {
          return NextResponse.json(
            { error: 'Authentication required for user_engagement metric' },
            { status: 401 }
          )
        }

        const fromDate = new Date(query.from)
        const toDate = new Date(query.to)

        const { data: interactions, error } = await supabase
          .from('user_interactions')
          .select('created_at, interaction_type, duration_seconds')
          .eq('user_id', userId)
          .gte('created_at', fromDate.toISOString())
          .lte('created_at', toDate.toISOString())
          .order('created_at', { ascending: true })
          .limit(10000)

        if (error) {
          console.error('User engagement query error:', error)
          return NextResponse.json(
            { error: 'Failed to query user engagement' },
            { status: 500 }
          )
        }

        // Aggregate by time period
        const aggregated = new Map<string, { count: number; duration: number; types: Map<string, number> }>()

        for (const interaction of interactions || []) {
          const time = new Date(interaction.created_at)
          let key: string

          switch (query.granularity) {
            case 'hour':
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours()).toISOString()
              break
            case 'day':
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toISOString()
              break
            case 'week':
              const weekStart = new Date(time)
              weekStart.setDate(time.getDate() - time.getDay())
              key = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).toISOString()
              break
            case 'month':
              key = new Date(time.getFullYear(), time.getMonth(), 1).toISOString()
              break
            default:
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toISOString()
          }

          const existing = aggregated.get(key) || { count: 0, duration: 0, types: new Map<string, number>() }
          existing.count += 1
          existing.duration += interaction.duration_seconds || 0
          const typeCount = existing.types.get(interaction.interaction_type) || 0
          existing.types.set(interaction.interaction_type, typeCount + 1)
          aggregated.set(key, existing)
        }

        // Convert to data points
        for (const [time, stats] of aggregated.entries()) {
          const breakdown: Record<string, number> = {
            avg_duration: stats.count > 0 ? Math.round(stats.duration / stats.count) : 0,
          }
          for (const [type, count] of stats.types.entries()) {
            breakdown[type] = count
          }

          data.push({
            time,
            value: stats.count,
            breakdown,
          })
        }

        // Sort by time
        data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        break
      }

      case 'session_activity': {
        // Query vibe session activity
        if (!userId) {
          return NextResponse.json(
            { error: 'Authentication required for session_activity metric' },
            { status: 401 }
          )
        }

        const fromDate = new Date(query.from)
        const toDate = new Date(query.to)

        const { data: sessions, error } = await supabase
          .from('vibe_sessions')
          .select('created_at, status, platform, model')
          .eq('user_id', userId)
          .gte('created_at', fromDate.toISOString())
          .lte('created_at', toDate.toISOString())
          .order('created_at', { ascending: true })
          .limit(1000)

        if (error) {
          console.error('Session activity query error:', error)
          return NextResponse.json(
            { error: 'Failed to query session activity' },
            { status: 500 }
          )
        }

        // Aggregate by time period
        const aggregated = new Map<string, { count: number; platforms: Map<string, number> }>()

        for (const session of sessions || []) {
          const time = new Date(session.created_at)
          let key: string

          switch (query.granularity) {
            case 'hour':
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours()).toISOString()
              break
            case 'day':
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toISOString()
              break
            case 'week':
              const weekStart = new Date(time)
              weekStart.setDate(time.getDate() - time.getDay())
              key = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).toISOString()
              break
            case 'month':
              key = new Date(time.getFullYear(), time.getMonth(), 1).toISOString()
              break
            default:
              key = new Date(time.getFullYear(), time.getMonth(), time.getDate()).toISOString()
          }

          const existing = aggregated.get(key) || { count: 0, platforms: new Map<string, number>() }
          existing.count += 1
          if (session.platform) {
            const platformCount = existing.platforms.get(session.platform) || 0
            existing.platforms.set(session.platform, platformCount + 1)
          }
          aggregated.set(key, existing)
        }

        // Convert to data points
        for (const [time, stats] of aggregated.entries()) {
          const breakdown: Record<string, number> = {}
          for (const [platform, count] of stats.platforms.entries()) {
            breakdown[platform] = count
          }

          data.push({
            time,
            value: stats.count,
            breakdown,
          })
        }

        // Sort by time
        data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        break
      }
    }

    // Calculate stats
    const values = data.map((d) => d.value)
    const total = values.reduce((a, b) => a + b, 0)
    const average = values.length > 0 ? total / values.length : 0
    const min = values.length > 0 ? Math.min(...values) : 0
    const max = values.length > 0 ? Math.max(...values) : 0

    const response: TimeSeriesResponse = {
      metric: metricResult.data,
      granularity: query.granularity,
      data,
      stats: {
        total,
        average: Math.round(average * 100) / 100,
        min,
        max,
        trend: calculateTrend(data),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Time series query error:', error)
    return NextResponse.json(
      { error: 'Time series query failed' },
      { status: 500 }
    )
  }
}