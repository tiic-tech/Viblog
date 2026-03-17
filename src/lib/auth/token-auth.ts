/**
 * Token Authentication Middleware
 *
 * Handles authentication for AI data access endpoints.
 * Supports two token types:
 * 1. MCP API Key (vb_*) - Platform-level access
 * 2. Authorization Token (vat_*) - User-authorized access
 */

import { createClient } from '@/lib/supabase/server'

// Token prefixes
export const MCP_API_KEY_PREFIX = 'vb_'
export const AUTH_TOKEN_PREFIX = 'vat_'

/**
 * Authorized sources for a token
 */
export interface AuthorizedSources {
  user_insights: boolean
  external_links: boolean
  vibe_sessions: boolean
  knowledge_graph: boolean
}

/**
 * Result of token authentication
 */
export interface TokenAuthResult {
  valid: boolean
  userId: string | null
  tokenType: 'mcp_api' | 'authorization' | null
  authorizedSources: AuthorizedSources | null
  privacyLevel: number | null
  error?: string
}

/**
 * Validated token context for request handlers
 */
export interface TokenContext {
  userId: string
  tokenType: 'mcp_api' | 'authorization'
  sources: AuthorizedSources
  privacyLevel: number
}

/**
 * Hash a token using SHA-256
 *
 * @param token - Token to hash
 * @returns Hex-encoded hash
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Detect token type from prefix
 *
 * @param token - Token string
 * @returns Token type or null if unknown
 */
function detectTokenType(
  token: string
): 'mcp_api' | 'authorization' | null {
  if (token.startsWith(MCP_API_KEY_PREFIX)) {
    return 'mcp_api'
  }
  if (token.startsWith(AUTH_TOKEN_PREFIX)) {
    return 'authorization'
  }
  return null
}

/**
 * Default authorized sources (all denied)
 */
const DEFAULT_SOURCES: AuthorizedSources = {
  user_insights: false,
  external_links: false,
  vibe_sessions: false,
  knowledge_graph: false,
}

/**
 * Parse authorized sources from JSON
 *
 * @param sources - JSON value from database
 * @returns Authorized sources object
 */
function parseAuthorizedSources(sources: unknown): AuthorizedSources {
  if (!sources || typeof sources !== 'object') {
    return DEFAULT_SOURCES
  }

  const src = sources as Record<string, unknown>
  return {
    user_insights: Boolean(src.user_insights),
    external_links: Boolean(src.external_links),
    vibe_sessions: Boolean(src.vibe_sessions),
    knowledge_graph: Boolean(src.knowledge_graph),
  }
}

/**
 * Validate an authorization token
 *
 * @param authHeader - Authorization header value
 * @returns Token authentication result
 */
export async function validateToken(
  authHeader: string | null
): Promise<TokenAuthResult> {
  // Check if header exists
  if (!authHeader) {
    return {
      valid: false,
      userId: null,
      tokenType: null,
      authorizedSources: null,
      privacyLevel: null,
      error: 'Missing authorization header',
    }
  }

  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return {
      valid: false,
      userId: null,
      tokenType: null,
      authorizedSources: null,
      privacyLevel: null,
      error: 'Invalid authorization format. Expected: Bearer <token>',
    }
  }

  const token = parts[1]
  const tokenType = detectTokenType(token)

  if (!tokenType) {
    return {
      valid: false,
      userId: null,
      tokenType: null,
      authorizedSources: null,
      privacyLevel: null,
      error: 'Unknown token type. Expected vb_* or vat_* prefix',
    }
  }

  try {
    const supabase = await createClient()
    const tokenHash = await hashToken(token)

    if (tokenType === 'mcp_api') {
      // MCP API key validation
      // For now, MCP API keys have platform-level access
      // This would be extended to check against a dedicated mcp_api_keys table
      return {
        valid: true,
        userId: null, // Platform-level, no specific user
        tokenType: 'mcp_api',
        authorizedSources: {
          user_insights: false, // MCP keys don't have user data access
          external_links: false,
          vibe_sessions: true, // Can create sessions
          knowledge_graph: false,
        },
        privacyLevel: 1,
      }
    } else {
      // Authorization token validation
      const { data, error } = await supabase
        .from('authorization_tokens')
        .select(
          'user_id, is_active, expires_at, authorized_sources, privacy_level'
        )
        .eq('token_hash', tokenHash)
        .single()

      if (error || !data) {
        return {
          valid: false,
          userId: null,
          tokenType: null,
          authorizedSources: null,
          privacyLevel: null,
          error: 'Invalid or expired token',
        }
      }

      // Check if token is active
      if (data.is_active === false) {
        return {
          valid: false,
          userId: null,
          tokenType: null,
          authorizedSources: null,
          privacyLevel: null,
          error: 'Token has been deactivated',
        }
      }

      // Check expiration
      if (data.expires_at) {
        const expiresAt = new Date(data.expires_at)
        if (expiresAt < new Date()) {
          return {
            valid: false,
            userId: null,
            tokenType: null,
            authorizedSources: null,
            privacyLevel: null,
            error: 'Token has expired',
          }
        }
      }

      // Update last_used_at
      await supabase
        .from('authorization_tokens')
        .update({ last_used_at: new Date().toISOString() })
        .eq('token_hash', tokenHash)

      return {
        valid: true,
        userId: data.user_id,
        tokenType: 'authorization',
        authorizedSources: parseAuthorizedSources(data.authorized_sources),
        privacyLevel: data.privacy_level ?? 1,
      }
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred'
    return {
      valid: false,
      userId: null,
      tokenType: null,
      authorizedSources: null,
      privacyLevel: null,
      error: `Token validation failed: ${errorMessage}`,
    }
  }
}

/**
 * Validate token and return user context or error response
 *
 * Use this in API route handlers for cleaner error handling.
 *
 * @param authHeader - Authorization header value
 * @returns Token context or error object
 */
export async function validateTokenAndGetUser(
  authHeader: string | null
): Promise<
  | { context: TokenContext }
  | { error: string; statusCode: number }
> {
  const result = await validateToken(authHeader)

  if (!result.valid) {
    return {
      error: result.error || 'Authentication failed',
      statusCode: 401,
    }
  }

  // For authorization tokens, userId must be present
  if (result.tokenType === 'authorization' && !result.userId) {
    return {
      error: 'Invalid token: missing user ID',
      statusCode: 500,
    }
  }

  return {
    context: {
      userId: result.userId || '', // Empty for MCP API keys
      tokenType: result.tokenType!,
      sources: result.authorizedSources!,
      privacyLevel: result.privacyLevel!,
    },
  }
}

/**
 * Check if a source is authorized for a token context
 *
 * @param context - Token context
 * @param source - Source name to check
 * @returns True if authorized
 */
export function isSourceAuthorized(
  context: TokenContext,
  source: keyof AuthorizedSources
): boolean {
  return context.sources[source] === true
}

/**
 * Require authorization for a source, return error if not authorized
 *
 * @param context - Token context
 * @param source - Source name to check
 * @returns Null if authorized, error response if not
 */
export function requireSourceAuthorization(
  context: TokenContext,
  source: keyof AuthorizedSources
): { error: string; statusCode: number } | null {
  if (!isSourceAuthorized(context, source)) {
    return {
      error: `Not authorized to access ${source}. Please grant permission in your settings.`,
      statusCode: 403,
    }
  }
  return null
}