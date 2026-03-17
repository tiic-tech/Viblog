import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { dualAuthenticate } from './dual-auth'

// Mock the Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock the token-auth module
vi.mock('./token-auth', () => ({
  validateToken: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { validateToken } from './token-auth'

describe('dualAuthenticate', () => {
  let mockSupabase: {
    auth: { getUser: ReturnType<typeof vi.fn> }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
    }

    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>
    )
  })

  describe('Supabase Session Authentication', () => {
    it('should return userId when Supabase session is valid', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const request = new NextRequest('http://localhost/api/test')
      const result = await dualAuthenticate(request)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.userId).toBe('user-123')
        expect(result.data.authMethod).toBe('session')
      }
    })

    it('should prioritize Supabase session over MCP API key', async () => {
      const mockUser = { id: 'user-456', email: 'test@example.com' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const request = new NextRequest('http://localhost/api/test', {
        headers: { Authorization: 'Bearer vb_test_token' },
      })
      const result = await dualAuthenticate(request)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.userId).toBe('user-456')
        expect(result.data.authMethod).toBe('session')
      }

      // Should NOT have called validateToken since session was valid
      expect(validateToken).not.toHaveBeenCalled()
    })
  })

  describe('MCP API Key Authentication', () => {
    it('should return userId when MCP API key is valid', async () => {
      // No Supabase session
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      // Valid MCP API key
      vi.mocked(validateToken).mockResolvedValue({
        valid: true,
        userId: 'user-789',
        tokenType: 'mcp_api',
        authorizedSources: {
          user_insights: true,
          external_links: false,
          vibe_sessions: true,
          knowledge_graph: false,
        },
        privacyLevel: 1,
      })

      const request = new NextRequest('http://localhost/api/test', {
        headers: { Authorization: 'Bearer vb_valid_token' },
      })
      const result = await dualAuthenticate(request)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.userId).toBe('user-789')
        expect(result.data.authMethod).toBe('mcp_api')
        expect(result.data.tokenContext).toBeDefined()
        expect(result.data.tokenContext?.sources.vibe_sessions).toBe(true)
      }
    })

    it('should pass Authorization header to validateToken', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      vi.mocked(validateToken).mockResolvedValue({
        valid: true,
        userId: 'user-999',
        tokenType: 'mcp_api',
        authorizedSources: {
          user_insights: false,
          external_links: false,
          vibe_sessions: false,
          knowledge_graph: false,
        },
        privacyLevel: 1,
      })

      const request = new NextRequest('http://localhost/api/test', {
        headers: { Authorization: 'Bearer vb_test_key' },
      })
      await dualAuthenticate(request)

      expect(validateToken).toHaveBeenCalledWith('Bearer vb_test_key')
    })
  })

  describe('Authentication Failure', () => {
    it('should return 401 when neither session nor API key is valid', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      vi.mocked(validateToken).mockResolvedValue({
        valid: false,
        error: 'Invalid token',
      })

      const request = new NextRequest('http://localhost/api/test')
      const result = await dualAuthenticate(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.status).toBe(401)
        const json = await result.error.json()
        expect(json.error).toContain('Unauthorized')
      }
    })

    it('should return 401 when session is missing and no API key provided', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      vi.mocked(validateToken).mockResolvedValue({
        valid: false,
        error: 'No authorization header',
      })

      const request = new NextRequest('http://localhost/api/test')
      const result = await dualAuthenticate(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.status).toBe(401)
      }
    })

    it('should return 401 when API key is invalid', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      vi.mocked(validateToken).mockResolvedValue({
        valid: false,
        error: 'Token not found or expired',
      })

      const request = new NextRequest('http://localhost/api/test', {
        headers: { Authorization: 'Bearer vb_invalid_token' },
      })
      const result = await dualAuthenticate(request)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.status).toBe(401)
      }
    })

    it('should return 401 when API key is valid but has no userId', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      // Token valid but no userId (shouldn't happen but edge case)
      vi.mocked(validateToken).mockResolvedValue({
        valid: true,
        userId: undefined,
        tokenType: undefined,
        authorizedSources: undefined,
        privacyLevel: undefined,
      })

      const request = new NextRequest('http://localhost/api/test', {
        headers: { Authorization: 'Bearer vb_orphan_token' },
      })
      const result = await dualAuthenticate(request)

      expect(result.success).toBe(false)
    })
  })
})
