import { createClient } from '@/lib/supabase/server'
import { hashToken, isValidTokenFormat } from './token-generator'

export interface VerifiedToken {
  id: string
  user_id: string
  name: string
  token_type: 'mcp_api' | 'authorization'
  authorized_sources: Record<string, boolean>
  privacy_level: number
}

/**
 * Verify an MCP API key from Authorization header
 * Returns token info if valid, null if invalid
 */
export async function verifyMcpApiKey(authHeader: string | null): Promise<VerifiedToken | null> {
  if (!authHeader) return null

  // Extract token from "Bearer <token>" format
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  if (!match) return null

  const token = match[1].trim()

  // Validate format
  if (!isValidTokenFormat(token, 'mcp_api')) return null

  // Hash and lookup
  const tokenHash = hashToken(token)

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('authorization_tokens')
      .select('id, user_id, name, token_type, authorized_sources, privacy_level, is_active')
      .eq('token_hash', tokenHash)
      .eq('token_type', 'mcp_api')
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    // Update last_used_at asynchronously (don't await)
    supabase
      .from('authorization_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
      .then(() => {}) // Ignore errors

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      token_type: data.token_type as 'mcp_api' | 'authorization',
      authorized_sources: (data.authorized_sources as Record<string, boolean>) || {},
      privacy_level: data.privacy_level || 1,
    }
  } catch {
    return null
  }
}

/**
 * Verify an authorization token
 * Returns token info with authorization scope if valid
 */
export async function verifyAuthorizationToken(
  authHeader: string | null
): Promise<VerifiedToken | null> {
  if (!authHeader) return null

  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  if (!match) return null

  const token = match[1].trim()

  if (!isValidTokenFormat(token, 'authorization')) return null

  const tokenHash = hashToken(token)

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('authorization_tokens')
      .select('id, user_id, name, token_type, authorized_sources, privacy_level, is_active, expires_at')
      .eq('token_hash', tokenHash)
      .eq('token_type', 'authorization')
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null
    }

    // Update last_used_at
    supabase
      .from('authorization_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
      .then(() => {})

    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      token_type: data.token_type as 'mcp_api' | 'authorization',
      authorized_sources: (data.authorized_sources as Record<string, boolean>) || {},
      privacy_level: data.privacy_level || 1,
    }
  } catch {
    return null
  }
}

/**
 * Check if a data source is authorized for a token
 */
export function isSourceAuthorized(
  token: VerifiedToken,
  source: 'user_insights' | 'external_links' | 'vibe_sessions' | 'knowledge_graph'
): boolean {
  return token.authorized_sources[source] === true
}