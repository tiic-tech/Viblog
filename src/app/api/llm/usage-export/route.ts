import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/llm/usage/export
 * Export usage data as CSV
 *
 * Query params:
 * - start_date: ISO date string (required)
 * - end_date: ISO date string (required)
 * - format: 'csv' | 'json' (default: 'csv')
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
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const format = searchParams.get('format') || 'csv'

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Fetch usage logs with provider and model details
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
        error_message,
        created_at,
        llm_providers (
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

    // Return JSON if requested
    if (format === 'json') {
      return NextResponse.json({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        exportDate: new Date().toISOString(),
        records: logs?.length || 0,
        data: logs,
      })
    }

    // Generate CSV
    const csv = generateCsv(logs || [])

    // Return as downloadable file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="llm-usage-${startDate}-to-${endDate}.csv"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Usage export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Generate CSV from usage logs
 */
function generateCsv(
  logs: Array<{
    id: string
    provider_id: string
    model_id: string
    request_type: string
    input_tokens: number
    output_tokens: number
    estimated_cost_usd: number
    latency_ms: number
    status: string
    error_message: string | null
    created_at: string
    llm_providers: { display_name: string } | null
  }>
): string {
  // CSV headers
  const headers = [
    'Date',
    'Time',
    'Provider',
    'Model',
    'Request Type',
    'Input Tokens',
    'Output Tokens',
    'Total Tokens',
    'Cost (USD)',
    'Latency (ms)',
    'Status',
    'Error',
  ]

  // CSV rows
  const rows = logs.map((log) => {
    const date = new Date(log.created_at)
    const totalTokens = (log.input_tokens || 0) + (log.output_tokens || 0)

    return [
      formatDate(date),
      formatTime(date),
      escapeCsvField(log.llm_providers?.display_name || log.provider_id),
      escapeCsvField(log.model_id),
      escapeCsvField(log.request_type),
      log.input_tokens || 0,
      log.output_tokens || 0,
      totalTokens,
      Number(log.estimated_cost_usd || 0).toFixed(6),
      log.latency_ms || 0,
      escapeCsvField(log.status),
      escapeCsvField(log.error_message || ''),
    ]
  })

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

  return csvContent
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Format time as HH:MM:SS
 */
function formatTime(date: Date): string {
  return date.toTimeString().split(' ')[0]
}

/**
 * Escape CSV field value
 */
function escapeCsvField(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    // Escape existing quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}