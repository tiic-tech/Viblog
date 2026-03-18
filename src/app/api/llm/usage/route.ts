import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Period type for usage queries
 */
type Period = 'day' | 'week' | 'month' | 'year' | 'all'

/**
 * GET /api/llm/usage
 * Get usage statistics for the current user
 *
 * Query params:
 * - period: 'day' | 'week' | 'month' | 'year' | 'all' (default: 'month')
 * - start_date: ISO date string (optional, overrides period)
 * - end_date: ISO date string (optional, overrides period)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') as Period) || 'month'
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Calculate date range
    const { start, end } = getDateRange(period, startDate, endDate)

    // Fetch usage logs
    const { data: logs, error } = await supabase
      .from('llm_usage_logs')
      .select(
        `
        id,
        provider_id,
        model_id,
        request_type,
        input_tokens,
        output_tokens,
        estimated_cost_usd,
        latency_ms,
        status,
        created_at,
        llm_providers!inner (
          id,
          display_name
        )
      `
      )
      .eq('user_id', user.id)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to fetch usage logs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch usage logs' },
        { status: 500 }
      )
    }

    // Calculate summary
    const summary = calculateSummary(logs || [])

    // Calculate by provider
    const byProvider = calculateByProvider(logs || [])

    // Calculate by model
    const byModel = calculateByModel(logs || [])

    // Calculate daily breakdown
    const daily = calculateDaily(logs || [], start, end)

    return NextResponse.json({
      period,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      summary,
      byProvider,
      byModel,
      daily,
    })
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Calculate date range based on period
 */
function getDateRange(
  period: Period,
  customStart?: string | null,
  customEnd?: string | null
): { start: Date; end: Date } {
  const now = new Date()
  const end = customEnd ? new Date(customEnd) : now
  let start: Date

  if (customStart) {
    start = new Date(customStart)
  } else {
    switch (period) {
      case 'day':
        start = new Date(now)
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start = new Date(now)
        start.setDate(start.getDate() - 7)
        start.setHours(0, 0, 0, 0)
        break
      case 'month':
        start = new Date(now)
        start.setMonth(start.getMonth() - 1)
        start.setHours(0, 0, 0, 0)
        break
      case 'year':
        start = new Date(now)
        start.setFullYear(start.getFullYear() - 1)
        start.setHours(0, 0, 0, 0)
        break
      case 'all':
      default:
        start = new Date(0) // Unix epoch
        break
    }
  }

  return { start, end }
}

/**
 * Calculate summary statistics
 */
function calculateSummary(
  logs: Array<{
    input_tokens: number
    output_tokens: number
    estimated_cost_usd: number
    status: string
  }>
) {
  const totalRequests = logs.length
  const successfulRequests = logs.filter((l) => l.status === 'success').length
  const totalInputTokens = logs.reduce((sum, l) => sum + (l.input_tokens || 0), 0)
  const totalOutputTokens = logs.reduce((sum, l) => sum + (l.output_tokens || 0), 0)
  const totalCostUsd = logs.reduce((sum, l) => sum + Number(l.estimated_cost_usd || 0), 0)
  const avgLatencyMs = totalRequests > 0
    ? logs.reduce((sum, l) => sum + (l.latency_ms || 0), 0) / totalRequests
    : 0

  return {
    totalRequests,
    successfulRequests,
    failedRequests: totalRequests - successfulRequests,
    totalInputTokens,
    totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
    totalCostUsd: Number(totalCostUsd.toFixed(6)),
    avgLatencyMs: Math.round(avgLatencyMs),
  }
}

/**
 * Calculate breakdown by provider
 */
function calculateByProvider(
  logs: Array<{
    provider_id: string
    input_tokens: number
    output_tokens: number
    estimated_cost_usd: number
    llm_providers: { id: string; display_name: string }
  }>
) {
  const providerMap = new Map<
    string,
    {
      providerId: string
      providerName: string
      requests: number
      inputTokens: number
      outputTokens: number
      costUsd: number
    }
  >()

  for (const log of logs) {
    const providerId = log.provider_id
    const providerName = log.llm_providers?.display_name || providerId

    const existing = providerMap.get(providerId) || {
      providerId,
      providerName,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
    }

    existing.requests++
    existing.inputTokens += log.input_tokens || 0
    existing.outputTokens += log.output_tokens || 0
    existing.costUsd += Number(log.estimated_cost_usd || 0)

    providerMap.set(providerId, existing)
  }

  return Array.from(providerMap.values())
    .map((p) => ({
      ...p,
      tokens: p.inputTokens + p.outputTokens,
      costUsd: Number(p.costUsd.toFixed(6)),
    }))
    .sort((a, b) => b.costUsd - a.costUsd)
}

/**
 * Calculate breakdown by model
 */
function calculateByModel(
  logs: Array<{
    provider_id: string
    model_id: string
    input_tokens: number
    output_tokens: number
    estimated_cost_usd: number
  }>
) {
  const modelMap = new Map<
    string,
    {
      modelId: string
      modelName: string
      providerId: string
      requests: number
      inputTokens: number
      outputTokens: number
      costUsd: number
    }
  >()

  for (const log of logs) {
    const key = `${log.provider_id}:${log.model_id}`

    const existing = modelMap.get(key) || {
      modelId: log.model_id,
      modelName: log.model_id,
      providerId: log.provider_id,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
    }

    existing.requests++
    existing.inputTokens += log.input_tokens || 0
    existing.outputTokens += log.output_tokens || 0
    existing.costUsd += Number(log.estimated_cost_usd || 0)

    modelMap.set(key, existing)
  }

  return Array.from(modelMap.values())
    .map((m) => ({
      ...m,
      tokens: m.inputTokens + m.outputTokens,
      costUsd: Number(m.costUsd.toFixed(6)),
    }))
    .sort((a, b) => b.costUsd - a.costUsd)
}

/**
 * Calculate daily breakdown
 */
function calculateDaily(
  logs: Array<{
    created_at: string
    input_tokens: number
    output_tokens: number
    estimated_cost_usd: number
  }>,
  startDate: Date,
  endDate: Date
) {
  const dailyMap = new Map<
    string,
    {
      date: string
      requests: number
      inputTokens: number
      outputTokens: number
      costUsd: number
    }
  >()

  // Initialize all dates in range
  const current = new Date(startDate)
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0]
    dailyMap.set(dateStr, {
      date: dateStr,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
    })
    current.setDate(current.getDate() + 1)
  }

  // Fill in actual data
  for (const log of logs) {
    const dateStr = log.created_at.split('T')[0]
    const existing = dailyMap.get(dateStr)

    if (existing) {
      existing.requests++
      existing.inputTokens += log.input_tokens || 0
      existing.outputTokens += log.output_tokens || 0
      existing.costUsd += Number(log.estimated_cost_usd || 0)
    }
  }

  return Array.from(dailyMap.values())
    .map((d) => ({
      ...d,
      tokens: d.inputTokens + d.outputTokens,
      costUsd: Number(d.costUsd.toFixed(6)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}