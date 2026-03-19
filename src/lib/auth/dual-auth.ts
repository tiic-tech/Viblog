/**
 * Dual Authentication Helper
 *
 * Provides unified authentication for API routes that support both:
 * 1. Supabase Auth (browser sessions via cookies)
 * 2. MCP API Key (Authorization: Bearer vb_*)
 *
 * Use this for API endpoints that need to work with both web UI and MCP clients.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateToken, type TokenContext } from './token-auth'

/**
 * Result of dual authentication
 */
export interface DualAuthResult {
  userId: string
  authMethod: 'session' | 'mcp_api'
  tokenContext?: TokenContext
}

/**
 * Authenticate a request using either Supabase session or MCP API Key.
 *
 * Priority:
 * 1. Check Supabase session (browser cookies)
 * 2. If no session, check Authorization header for MCP API Key
 *
 * @param request - The incoming request
 * @returns User ID and auth method, or error response
 */
export async function dualAuthenticate(
  request: Request
): Promise<{ success: true; data: DualAuthResult } | { success: false; error: NextResponse }> {
  const supabase = await createClient()

  // 1. Try Supabase Auth (session cookie)
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return {
      success: true,
      data: {
        userId: user.id,
        authMethod: 'session',
      },
    }
  }

  // 2. Try MCP API Key (Authorization header)
  const authHeader = request.headers.get('Authorization')
  const tokenResult = await validateToken(authHeader)

  if (tokenResult.valid && tokenResult.userId) {
    return {
      success: true,
      data: {
        userId: tokenResult.userId,
        authMethod: 'mcp_api',
        tokenContext: {
          userId: tokenResult.userId,
          tokenType: tokenResult.tokenType!,
          sources: tokenResult.authorizedSources!,
          privacyLevel: tokenResult.privacyLevel!,
        },
      },
    }
  }

  // Neither authentication method succeeded
  return {
    success: false,
    error: NextResponse.json(
      { error: 'Unauthorized. Please sign in or provide a valid MCP API key.' },
      { status: 401 }
    ),
  }
}

/**
 * Higher-order function to wrap API handlers with dual authentication.
 *
 * Usage:
 * ```typescript
 * export const POST = withDualAuth(async (request, { userId, authMethod }) => {
 *   // Your handler code here
 *   return NextResponse.json({ success: true, userId })
 * })
 * ```
 *
 * @param handler - The API handler function
 * @returns Wrapped handler with authentication
 */
export function withDualAuth<T extends unknown[]>(
  handler: (
    request: Request,
    auth: DualAuthResult,
    ...args: T
  ) => Promise<NextResponse>
): (request: Request, ...args: T) => Promise<NextResponse> {
  return async (request: Request, ...args: T) => {
    const result = await dualAuthenticate(request)

    if (!result.success) {
      return result.error
    }

    return handler(request, result.data, ...args)
  }
}