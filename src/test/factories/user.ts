import { vi } from 'vitest'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export function createMockProfile(overrides?: Partial<Profile>): Profile {
  return {
    id: 'test-user-id',
    username: 'testuser',
    display_name: 'Test User',
    bio: null,
    avatar_url: null,
    github_username: null,
    twitter_username: null,
    website_url: null,
    created_at: '2026-03-14T00:00:00Z',
    updated_at: '2026-03-14T00:00:00Z',
    ...overrides,
  }
}

export function createMockUser() {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: '2026-03-14T00:00:00Z',
    aud: 'authenticated',
    role: 'authenticated',
    updated_at: '2026-03-14T00:00:00Z',
  }
}

export function createMockAuthResponse(options?: {
  user?: ReturnType<typeof createMockUser>
  error?: Error | null
}) {
  return {
    data: {
      user: options?.user ?? createMockUser(),
      session: null,
    },
    error: options?.error ?? null,
  }
}

export function createMockSignInResponse(options?: {
  user?: ReturnType<typeof createMockUser>
  error?: Error | null
}) {
  return {
    data: {
      user: options?.user ?? createMockUser(),
      session: options?.error ? null : { access_token: 'mock-token' },
    },
    error: options?.error ?? null,
  }
}

// Mock Supabase auth methods
export function createMockSupabaseAuth() {
  return {
    getUser: vi.fn().mockResolvedValue(createMockAuthResponse()),
    signInWithPassword: vi.fn().mockResolvedValue(createMockSignInResponse()),
    signUp: vi.fn().mockResolvedValue(createMockAuthResponse()),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  }
}