import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { dualAuthenticate } from '@/lib/auth/dual-auth'
import {
  appendSessionContextSchema,
  uploadSessionContextSchema,
} from '@/lib/validations/vibe-session'

/**
 * Get the appropriate Supabase client based on authentication method.
 * Uses service role client for MCP API Key auth (bypasses RLS).
 * Uses regular client for session auth (respects RLS with user context).
 */
function getSupabaseClient(authMethod: 'session' | 'mcp_api') {
  if (authMethod === 'mcp_api') {
    return createServiceRoleClient()
  }
  return createClient()
}

/**
 * GET /api/vibe-sessions/[id]/fragments
 * List all fragments for a session
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await dualAuthenticate(request)
    if (!authResult.success) {
      return authResult.error
    }
    const { userId, authMethod } = authResult.data

    const supabase = await getSupabaseClient(authMethod)
    const { id } = await params

    // Verify session ownership
    const { data: session, error: sessionError } = await supabase
      .from('vibe_sessions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const { data: fragments, error } = await supabase
      .from('session_fragments')
      .select('id, fragment_type, content, sequence_number, metadata, created_at')
      .eq('session_id', id)
      .order('sequence_number', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ fragments })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch fragments' }, { status: 500 })
  }
}

/**
 * POST /api/vibe-sessions/[id]/fragments
 * Append a single fragment to a session (for incremental updates)
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await dualAuthenticate(request)
    if (!authResult.success) {
      return authResult.error
    }
    const { userId, authMethod } = authResult.data

    const supabase = await getSupabaseClient(authMethod)
    const { id } = await params
    const body = await request.json()

    // Add session_id from path
    const input = { ...body, session_id: id }
    const validated = appendSessionContextSchema.safeParse(input)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { fragment_type, content, metadata, sequence_number } = validated.data

    // Verify session ownership
    const { data: session, error: sessionError } = await supabase
      .from('vibe_sessions')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.status !== 'active') {
      return NextResponse.json({ error: 'Cannot append to inactive session' }, { status: 400 })
    }

    // Auto-assign sequence_number if not provided
    let finalSequenceNumber = sequence_number
    if (!finalSequenceNumber) {
      const { data: lastFragment } = await supabase
        .from('session_fragments')
        .select('sequence_number')
        .eq('session_id', id)
        .order('sequence_number', { ascending: false })
        .limit(1)
        .single()

      finalSequenceNumber = (lastFragment?.sequence_number ?? 0) + 1
    }

    const { data: fragment, error } = await supabase
      .from('session_fragments')
      .insert({
        session_id: id,
        fragment_type,
        content,
        metadata: metadata ?? null,
        sequence_number: finalSequenceNumber,
      })
      .select('id, fragment_type, sequence_number, created_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      fragment,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to append fragment' }, { status: 500 })
  }
}

/**
 * PUT /api/vibe-sessions/[id]/fragments
 * Batch upload multiple fragments (for complete session context)
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await dualAuthenticate(request)
    if (!authResult.success) {
      return authResult.error
    }
    const { userId, authMethod } = authResult.data

    const supabase = await getSupabaseClient(authMethod)
    const { id } = await params
    const body = await request.json()

    // Add session_id from path
    const input = { session_id: id, fragments: body.fragments }
    const validated = uploadSessionContextSchema.safeParse(input)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }

    const { fragments } = validated.data

    // Verify session ownership
    const { data: session, error: sessionError } = await supabase
      .from('vibe_sessions')
      .select('id, status')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.status !== 'active') {
      return NextResponse.json({ error: 'Cannot upload to inactive session' }, { status: 400 })
    }

    // Prepare batch insert
    const fragmentsToInsert = fragments.map((f) => ({
      session_id: id,
      fragment_type: f.fragment_type,
      content: f.content,
      metadata: f.metadata ?? null,
      sequence_number: f.sequence_number,
    }))

    const { data: insertedFragments, error } = await supabase
      .from('session_fragments')
      .insert(fragmentsToInsert)
      .select('id, fragment_type, sequence_number, created_at')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: insertedFragments?.length ?? 0,
      fragments: insertedFragments,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to upload fragments' }, { status: 500 })
  }
}

/**
 * DELETE /api/vibe-sessions/[id]/fragments
 * Delete all fragments for a session (reset context)
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await dualAuthenticate(request)
    if (!authResult.success) {
      return authResult.error
    }
    const { userId, authMethod } = authResult.data

    const supabase = await getSupabaseClient(authMethod)
    const { id } = await params

    // Verify session ownership
    const { data: session, error: sessionError } = await supabase
      .from('vibe_sessions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const { error } = await supabase.from('session_fragments').delete().eq('session_id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete fragments' }, { status: 500 })
  }
}
