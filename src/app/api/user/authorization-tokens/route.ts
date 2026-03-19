import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateAuthorizationToken } from '@/lib/token-generator'
import { invalidateApiKeyValidation } from '@/lib/cache/invalidation'

/**
 * GET /api/user/authorization-tokens
 * List all authorization tokens for the current user
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: tokens, error } = await supabase
      .from('authorization_tokens')
      .select(
        'id, name, description, token_prefix, authorized_sources, privacy_level, is_active, last_used_at, created_at, expires_at'
      )
      .eq('user_id', user.id)
      .eq('token_type', 'authorization')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tokens })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch authorization tokens' }, { status: 500 })
  }
}

/**
 * POST /api/user/authorization-tokens
 * Create a new authorization token
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, authorized_sources, privacy_level } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Validate authorized_sources
    const defaultSources = {
      user_insights: false,
      external_links: false,
      vibe_sessions: false,
      knowledge_graph: false,
    }

    const sources = { ...defaultSources, ...authorized_sources }

    // Generate new token
    const { token, tokenHash, tokenPrefix } = generateAuthorizationToken()

    // Check for collision
    const { data: existing } = await supabase
      .from('authorization_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .single()

    if (existing) {
      return POST(request) // Regenerate on collision
    }

    // Store token
    const { error } = await supabase.from('authorization_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      token_prefix: tokenPrefix,
      token_type: 'authorization',
      name: name.trim(),
      description: description?.trim() || null,
      authorized_sources: sources,
      privacy_level: privacy_level || 1,
      is_active: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      token: {
        token, // Shown only once!
        tokenPrefix,
        name: name.trim(),
        authorized_sources: sources,
        privacy_level: privacy_level || 1,
      },
      warning: 'Store this token securely. It will not be shown again.',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create authorization token' }, { status: 500 })
  }
}

/**
 * DELETE /api/user/authorization-tokens
 * Revoke an authorization token
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tokenId = searchParams.get('id')

    if (!tokenId) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 })
    }

    // Get token hash before deletion for cache invalidation
    const { data: tokenData } = await supabase
      .from('authorization_tokens')
      .select('token_hash')
      .eq('id', tokenId)
      .eq('user_id', user.id)
      .eq('token_type', 'authorization')
      .single()

    const { error } = await supabase
      .from('authorization_tokens')
      .delete()
      .eq('id', tokenId)
      .eq('user_id', user.id)
      .eq('token_type', 'authorization')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Invalidate cache if we had the token hash
    if (tokenData?.token_hash) {
      await invalidateApiKeyValidation(tokenData.token_hash)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete authorization token' }, { status: 500 })
  }
}

/**
 * PATCH /api/user/authorization-tokens
 * Update authorization token settings
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, authorized_sources, privacy_level, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 })
    }

    // Get token hash before update for cache invalidation
    const { data: tokenData } = await supabase
      .from('authorization_tokens')
      .select('token_hash')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('token_type', 'authorization')
      .single()

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (authorized_sources !== undefined) updateData.authorized_sources = authorized_sources
    if (privacy_level !== undefined) updateData.privacy_level = privacy_level
    if (is_active !== undefined) updateData.is_active = is_active

    const { error } = await supabase
      .from('authorization_tokens')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('token_type', 'authorization')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Invalidate cache if token was found and updated
    if (tokenData?.token_hash) {
      await invalidateApiKeyValidation(tokenData.token_hash)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update authorization token' }, { status: 500 })
  }
}
