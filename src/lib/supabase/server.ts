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
    // Use a proper chainable query builder pattern
    type MockQuery = {
      select: (columns?: string, options?: { count?: string; head?: boolean }) => MockQuery
      eq: (column: string, value: unknown) => MockQuery
      neq: (column: string, value: unknown) => MockQuery
      gte: (column: string, value: unknown) => MockQuery
      not: (filter: string, column: string, value?: unknown) => MockQuery
      order: (column: string, options?: { ascending?: boolean }) => MockQuery
      limit: (count: number) => MockQuery
      update: (data: Record<string, unknown>) => MockQuery
      range: (start: number, end: number) => Promise<{ data: unknown[]; error: null }>
      single: () => Promise<{ data: null; error: null }>
    }

    const createMockQuery = (): MockQuery => {
      const query: MockQuery = {
        select: () => query,
        eq: () => query,
        neq: () => query,
        gte: () => query,
        not: () => query,
        order: () => query,
        limit: () => query,
        update: () => query,
        range: async () => ({ data: [], error: null }),
        single: async () => ({ data: null, error: null }),
      }
      return query
    }

    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => createMockQuery(),
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
