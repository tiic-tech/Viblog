import { vi } from 'vitest'
import { createMockSupabaseAuth } from '../factories/user'
import { createMockProjectQuery, mockProjectsGetSuccess } from '../factories/project'
import { createMockArticleQuery, mockArticlesGetSuccess } from '../factories/article'

// Create a mock Supabase client with all methods
export function createMockSupabaseClient(options?: {
  user?: { id: string; email: string }
  projects?: unknown[]
  articles?: unknown[]
  authError?: Error | null
}) {
  const mockUser = options?.user ?? { id: 'test-user-id', email: 'test@example.com' }
  const mockAuth = createMockSupabaseAuth()

  // Override getUser if user is provided
  if (options?.user) {
    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  }

  // Override with auth error if provided
  if (options?.authError) {
    mockAuth.getUser.mockResolvedValue({
      data: { user: null },
      error: options.authError,
    })
  }

  return {
    auth: mockAuth,
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'projects') {
        return createMockProjectQuery({ projects: options?.projects as never[] })
      }
      if (table === 'articles') {
        return createMockArticleQuery({ articles: options?.articles as never[] })
      }
      // Default mock for other tables
      return {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  }
}

// Mock for server-side Supabase client
export function createMockServerClient(options?: Parameters<typeof createMockSupabaseClient>[0]) {
  return createMockSupabaseClient(options)
}

// Mock for client-side Supabase client
export function createMockBrowserClient(options?: Parameters<typeof createMockSupabaseClient>[0]) {
  return createMockSupabaseClient(options)
}

// Reset all mocks
export function resetAllMocks() {
  vi.clearAllMocks()
}