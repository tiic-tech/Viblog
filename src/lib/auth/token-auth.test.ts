import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateToken } from './token-auth'

// Mock the Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'

// Mock crypto.subtle for Node.js environment
const mockDigest = vi.fn()
const mockSubtle = {
  digest: mockDigest,
}

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: mockSubtle,
  },
})

// Helper to mock buffer to hex conversion
function mockHashToken(token: string): string {
  // Simple mock hash - in real code it's SHA-256
  return `hash_${token}`
}

describe('validateToken', () => {
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabase = {
      from: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>
    )

    // Mock crypto.subtle.digest to return predictable hash
    mockDigest.mockImplementation(async (algorithm, data) => {
      const text = new TextDecoder().decode(data)
      const hash = mockHashToken(text)
      return new TextEncoder().encode(hash)
    })
  })

  describe('Token Format Validation', () => {
    it('should reject null/undefined authorization header', async () => {
      const result = await validateToken(null)

      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject empty authorization header', async () => {
      const result = await validateToken('')

      expect(result.valid).toBe(false)
    })

    it('should reject non-Bearer token format', async () => {
      const result = await validateToken('Basic abc123')

      expect(result.valid).toBe(false)
    })

    it('should reject token without vb_ prefix', async () => {
      const result = await validateToken('Bearer invalid_prefix_token')

      expect(result.valid).toBe(false)
    })

    it('should accept valid vb_ prefixed token format', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'token-123',
                user_id: 'user-456',
                name: 'Test Token',
                authorized_sources: {
                  user_insights: false,
                  external_links: false,
                  vibe_sessions: true,
                  knowledge_graph: false,
                },
                privacy_level: 1,
                is_active: true,
              },
              error: null,
            }),
          }),
        }),
      })

      // Mock update() for last_used_at tracking (fire-and-forget)
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn((cb) => cb()),
        }),
      })

      mockSupabase.from.mockReturnValue({ select: mockSelect, update: mockUpdate })

      const result = await validateToken('Bearer vb_test_token_123')

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.userId).toBe('user-456')
        expect(result.tokenType).toBe('mcp_api')
        expect(result.authorizedSources?.vibe_sessions).toBe(true)
      }
    })
  })

  describe('Database Token Lookup', () => {
    it('should query authorization_tokens table with correct parameters', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'token-123',
          user_id: 'user-789',
          name: 'Test Token',
          authorized_sources: {
            user_insights: false,
            external_links: false,
            vibe_sessions: true,
            knowledge_graph: true,
          },
          privacy_level: 2,
          is_active: true,
        },
        error: null,
      })

      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })

      // Mock update() for last_used_at tracking
      const mockUpdateEq = vi.fn().mockReturnValue({
        then: vi.fn((cb) => cb()),
      })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      mockSupabase.from.mockReturnValue({ select: mockSelect, update: mockUpdate })

      await validateToken('Bearer vb_my_token')

      expect(mockSupabase.from).toHaveBeenCalledWith('authorization_tokens')
      expect(mockSelect).toHaveBeenCalledWith(
        'id, user_id, name, authorized_sources, privacy_level, is_active'
      )
    })

    it('should reject when token not found in database', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      })

      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })

      mockSupabase.from.mockReturnValue({ select: mockSelect })

      const result = await validateToken('Bearer vb_nonexistent_token')

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toContain('Invalid')
      }
    })

    it('should reject when token is inactive', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'token-123',
          user_id: 'user-789',
          name: 'Revoked Token',
          authorized_sources: {
            user_insights: false,
            external_links: false,
            vibe_sessions: false,
            knowledge_graph: false,
          },
          privacy_level: 1,
          is_active: false,
        },
        error: null,
      })

      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })

      mockSupabase.from.mockReturnValue({ select: mockSelect })

      const result = await validateToken('Bearer vb_revoked_token')

      // Note: This depends on implementation checking is_active
      // If not checked in token-auth.ts, this test should be adjusted
      expect(result.valid).toBe(false)
    })

    it('should handle database errors gracefully', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'CONNECTION_ERROR', message: 'Database connection failed' },
      })

      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })

      mockSupabase.from.mockReturnValue({ select: mockSelect })

      const result = await validateToken('Bearer vb_test_token')

      expect(result.valid).toBe(false)
    })
  })

  describe('Token Hash Verification', () => {
    it('should hash the token before database lookup', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'token-123',
          user_id: 'user-789',
          authorized_sources: {
            user_insights: false,
            external_links: false,
            vibe_sessions: false,
            knowledge_graph: false,
          },
          privacy_level: 1,
          is_active: true,
        },
        error: null,
      })

      const mockEq2 = vi.fn().mockReturnValue({ single: mockSingle })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 })

      // Mock update() for last_used_at tracking
      const mockUpdateEq = vi.fn().mockReturnValue({
        then: vi.fn((cb) => cb()),
      })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      mockSupabase.from.mockReturnValue({ select: mockSelect, update: mockUpdate })

      await validateToken('Bearer vb_secret_token')

      // Verify that crypto.subtle.digest was called (hashing occurred)
      expect(mockDigest).toHaveBeenCalled()
    })
  })
})
