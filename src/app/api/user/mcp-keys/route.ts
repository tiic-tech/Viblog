import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateMcpApiKey, maskToken } from '@/lib/token-generator'
import { invalidateApiKeyValidation } from '@/lib/cache/invalidation'

/**
 * GET /api/user/mcp-keys
 * List all MCP API keys for the current user (masked)
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
        'id, name, description, token_prefix, token_type, is_active, last_used_at, created_at, expires_at'
      )
      .eq('user_id', user.id)
      .eq('token_type', 'mcp_api')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ keys: tokens })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch MCP keys' }, { status: 500 })
  }
}

/**
 * POST /api/user/mcp-keys
 * Create a new MCP API key
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
    const { name, description } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate new token
    const { token, tokenHash, tokenPrefix } = generateMcpApiKey()

    // Check for existing token hash (collision detection)
    const { data: existing } = await supabase
      .from('authorization_tokens')
      .select('id')
      .eq('token_hash', tokenHash)
      .single()

    if (existing) {
      // Regenerate on collision (extremely rare)
      return POST(request)
    }

    // Store token hash
    const { error } = await supabase.from('authorization_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      token_prefix: tokenPrefix,
      token_type: 'mcp_api',
      name: name.trim(),
      description: description?.trim() || null,
      is_active: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the actual token ONLY on creation (never again)
    return NextResponse.json({
      success: true,
      key: {
        token, // Full token - shown only once!
        tokenPrefix,
        name: name.trim(),
        description: description?.trim() || null,
      },
      warning: 'Store this token securely. It will not be shown again.',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create MCP key' }, { status: 500 })
  }
}

/**
 * DELETE /api/user/mcp-keys
 * Revoke an MCP API key
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
      .eq('token_type', 'mcp_api')
      .single()

    // Delete the token
    const { error } = await supabase
      .from('authorization_tokens')
      .delete()
      .eq('id', tokenId)
      .eq('user_id', user.id)
      .eq('token_type', 'mcp_api')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Invalidate cache if we had the token hash
    if (tokenData?.token_hash) {
      await invalidateApiKeyValidation(tokenData.token_hash)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete MCP key' }, { status: 500 })
  }
}

/**
 * PATCH /api/user/mcp-keys
 * Update MCP API key status or metadata
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
    const { id, name, description, is_active } = body

    if (!id) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 })
    }

    // Get token hash before update for cache invalidation
    const { data: tokenData } = await supabase
      .from('authorization_tokens')
      .select('token_hash')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('token_type', 'mcp_api')
      .single()

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (is_active !== undefined) updateData.is_active = is_active

    const { error } = await supabase
      .from('authorization_tokens')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('token_type', 'mcp_api')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Invalidate cache if token was found and updated
    if (tokenData?.token_hash) {
      await invalidateApiKeyValidation(tokenData.token_hash)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update MCP key' }, { status: 500 })
  }
}
