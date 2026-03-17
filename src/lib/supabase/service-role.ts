import { createServerClient } from '@supabase/ssr'

/**
 * Create a Supabase client with service role privileges.
 * This client bypasses RLS policies and should ONLY be used
 * when the user has been authenticated via MCP API Key.
 *
 * SECURITY: Never expose this client to client-side code.
 * Always validate the user_id before performing operations.
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase URL or Service Role Key')
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // No-op for service role client
      },
    },
  })
}