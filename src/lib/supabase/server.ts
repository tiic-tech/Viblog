import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for server-side operations.
 * Returns a mock client if Supabase credentials are not configured.
 */
export async function createClient() {
  const cookieStore = await cookies()

  // Gracefully handle missing Supabase credentials for local development
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that mimics Supabase query chain
    const createMockQuery = () => ({
      select: (columns?: string, options?: { count?: string; head?: boolean }) => {
        const baseQuery = {
          eq: () => createMockQuery(),
          gte: () => createMockQuery(),
          not: () => createMockQuery(),
          order: () => createMockQuery(),
          range: async (start: number, end: number) => ({ data: [], error: null }),
          single: async () => ({ data: null, error: null }),
        }

        // Handle count query (head: true)
        if (options?.head) {
          return {
            eq: () => ({
              eq: async () => ({ count: 0, error: null }),
            }),
          }
        }

        return baseQuery
      },
    })

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: (table: string) => createMockQuery(),
    } as any
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  })
}
