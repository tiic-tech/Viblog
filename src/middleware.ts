import { updateSession } from '@/lib/supabase/middleware'
import { applyRateLimit, addRateLimitHeaders, isApiRoute } from '@/lib/middleware/rate-limit'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Apply rate limiting for API routes
  if (isApiRoute(pathname)) {
    const rateLimitResponse = applyRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Continue to API route handler with rate limit tracking
    const response = NextResponse.next()
    return addRateLimitHeaders(response, request)
  }

  // For non-API routes, use existing session management
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files in public folder
     *
     * Now includes API routes for rate limiting
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}