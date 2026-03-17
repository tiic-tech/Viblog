import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createVibeSessionSchema, updateVibeSessionSchema, listVibeSessionsSchema } from '@/lib/validations/vibe-session'

/**
 * GET /api/vibe-sessions
 * List all vibe sessions for the current user
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = {
      status: searchParams.get('status') ?? undefined,
      platform: searchParams.get('platform') ?? undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    }

    const validated = listVibeSessionsSchema.safeParse(params)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { status, platform, limit, offset } = validated.data

    let query = supabase
      .from('vibe_sessions')
      .select('id, title, platform, model, status, start_time, end_time, created_at, updated_at, metadata')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }
    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data: sessions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('vibe_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    if (platform) {
      countQuery = countQuery.eq('platform', platform)
    }

    const { count } = await countQuery

    return NextResponse.json({
      sessions,
      pagination: {
        total: count ?? 0,
        limit,
        offset,
        has_more: (count ?? 0) > offset + limit,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch vibe sessions' }, { status: 500 })
  }
}

/**
 * POST /api/vibe-sessions
 * Create a new vibe session
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = createVibeSessionSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { title, platform, model, metadata } = validated.data

    const { data: session, error } = await supabase
      .from('vibe_sessions')
      .insert({
        user_id: user.id,
        title: title ?? null,
        platform: platform ?? null,
        model: model ?? null,
        metadata: metadata ?? null,
        status: 'active',
        start_time: new Date().toISOString(),
      })
      .select('id, title, platform, model, status, start_time, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      session,
      session_id: session.id,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create vibe session' }, { status: 500 })
  }
}

/**
 * PATCH /api/vibe-sessions
 * Update a vibe session
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = updateVibeSessionSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { id, title, status, end_time, raw_context, metadata } = validated.data

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (status !== undefined) updateData.status = status
    if (end_time !== undefined) updateData.end_time = end_time
    if (raw_context !== undefined) updateData.raw_context = raw_context
    if (metadata !== undefined) updateData.metadata = metadata

    const { error } = await supabase
      .from('vibe_sessions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update vibe session' }, { status: 500 })
  }
}

/**
 * DELETE /api/vibe-sessions
 * Delete a vibe session (cascade to fragments)
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // First delete fragments (cascade should handle this, but being explicit)
    await supabase
      .from('session_fragments')
      .delete()
      .eq('session_id', id)

    // Then delete the session
    const { error } = await supabase
      .from('vibe_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete vibe session' }, { status: 500 })
  }
}