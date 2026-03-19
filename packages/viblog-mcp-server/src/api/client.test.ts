/**
 * Tests for ViblogApiClient
 *
 * Tests all API methods with mocked fetch responses.
 * Covers success cases, error handling, and edge cases.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ViblogApiClient } from './client.js'
import { RateLimiter } from './rate-limiter.js'
import type {
  CreateSessionResponse,
  AppendFragmentResponse,
  UploadFragmentsResponse,
  VibeSession,
  SessionFragment,
} from '../types.js'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Create a mock rate limiter that doesn't delay for testing
function createMockRateLimiter(): RateLimiter {
  return {
    canRequest: () => true,
    consumeToken: () => true,
    getTimeUntilNextToken: () => 0,
    waitForToken: async () => {},
    getBackoffDelay: () => 0,
    isRetryableError: (status: number) => status === 429 || status >= 500,
    executeWithRetry: async <T>(fn: () => Promise<T>) => {
      const result = await fn()
      return { ...result, attempts: 1 }
    },
  } as unknown as RateLimiter
}

describe('ViblogApiClient', () => {
  let client: ViblogApiClient

  beforeEach(() => {
    client = new ViblogApiClient({
      apiUrl: 'https://test.viblog.app',
      apiKey: 'test-api-key',
    }, createMockRateLimiter())
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ============================================
  // Constructor and Configuration
  // ============================================

  describe('constructor', () => {
    it('should create client with config', () => {
      expect(client).toBeDefined()
    })

    it('should store apiUrl and apiKey', () => {
      // Indirectly tested through request headers
      expect(client).toBeInstanceOf(ViblogApiClient)
    })
  })

  // ============================================
  // createSession
  // ============================================

  describe('createSession', () => {
    it('should create a session successfully', async () => {
      const mockResponse: CreateSessionResponse = {
        success: true,
        session_id: 'test-session-id',
        session: {
          id: 'test-session-id',
          title: 'Test Session',
          platform: 'claude',
          model: 'claude-3',
          status: 'active',
          start_time: '2024-01-01T00:00:00Z',
          end_time: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          metadata: null,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await client.createSession({
        title: 'Test Session',
        platform: 'claude',
        model: 'claude-3',
      })

      expect(result.success).toBe(true)
      expect(result.data?.session_id).toBe('test-session-id')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.viblog.app/api/vibe-sessions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key',
          }),
        })
      )
    })

    it('should handle create session error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      })

      const result = await client.createSession({ title: 'Test' })

      expect(result.success).toBeUndefined()
      expect(result.error).toBe('Unauthorized')
    })

    it('should handle missing error in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      })

      const result = await client.createSession({ title: 'Test' })

      expect(result.error).toBe('HTTP 500')
    })
  })

  // ============================================
  // listSessions
  // ============================================

  describe('listSessions', () => {
    it('should list sessions without parameters', async () => {
      const mockResponse = {
        sessions: [],
        pagination: {
          total: 0,
          limit: 10,
          offset: 0,
          has_more: false,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await client.listSessions()

      expect(result.success).toBe(true)
      expect(result.data?.sessions).toEqual([])
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test.viblog.app/api/vibe-sessions',
        expect.any(Object)
      )
    })

    it('should list sessions with query parameters', async () => {
      const mockSession: VibeSession = {
        id: 'session-1',
        title: 'Active Session',
        platform: 'claude',
        model: null,
        status: 'active',
        start_time: '2024-01-01T00:00:00Z',
        end_time: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        metadata: null,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          sessions: [mockSession],
          pagination: { total: 1, limit: 10, offset: 0, has_more: false },
        }),
      })

      const result = await client.listSessions({
        status: 'active',
        platform: 'claude',
        limit: 10,
        offset: 0,
      })

      expect(result.success).toBe(true)
      expect(result.data?.sessions).toHaveLength(1)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('status=active'),
        expect.any(Object)
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('platform=claude'),
        expect.any(Object)
      )
    })

    it('should handle list sessions error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: 'Forbidden' }),
      })

      const result = await client.listSessions()

      expect(result.error).toBe('Forbidden')
    })
  })

  // ============================================
  // getSession
  // ============================================

  describe('getSession', () => {
    it('should get a session by id', async () => {
      const mockSession: VibeSession = {
        id: 'session-1',
        title: 'Test Session',
        platform: null,
        model: null,
        status: 'active',
        start_time: '2024-01-01T00:00:00Z',
        end_time: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        metadata: null,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ session: mockSession }),
      })

      const result = await client.getSession('session-1')

      expect(result.success).toBe(true)
      expect(result.data?.session.id).toBe('session-1')
    })

    it('should handle session not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Session not found' }),
      })

      const result = await client.getSession('non-existent')

      expect(result.error).toBe('Session not found')
    })
  })

  // ============================================
  // appendFragment
  // ============================================

  describe('appendFragment', () => {
    it('should append a fragment successfully', async () => {
      const mockFragment: SessionFragment = {
        id: 'fragment-1',
        fragment_type: 'user_prompt',
        content: 'Test content',
        sequence_number: 1,
        metadata: null,
        created_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          fragment: mockFragment,
        } as AppendFragmentResponse),
      })

      const result = await client.appendFragment('session-1', {
        fragment_type: 'user_prompt',
        content: 'Test content',
      })

      expect(result.success).toBe(true)
      expect(result.data?.fragment.id).toBe('fragment-1')
    })

    it('should handle append fragment error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid fragment type' }),
      })

      const result = await client.appendFragment('session-1', {
        fragment_type: 'user_prompt',
        content: 'Test',
      })

      expect(result.error).toBe('Invalid fragment type')
    })
  })

  // ============================================
  // uploadFragments
  // ============================================

  describe('uploadFragments', () => {
    it('should upload multiple fragments', async () => {
      const mockResponse: UploadFragmentsResponse = {
        success: true,
        count: 2,
        fragments: [
          {
            id: 'fragment-1',
            fragment_type: 'user_prompt',
            content: 'Content 1',
            sequence_number: 1,
            metadata: null,
            created_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'fragment-2',
            fragment_type: 'code_block',
            content: 'Content 2',
            sequence_number: 2,
            metadata: null,
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await client.uploadFragments('session-1', {
        fragments: [
          { fragment_type: 'user_prompt', content: 'Content 1', sequence_number: 1 },
          { fragment_type: 'code_block', content: 'Content 2', sequence_number: 2 },
        ],
      })

      expect(result.success).toBe(true)
      expect(result.data?.count).toBe(2)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/fragments'),
        expect.objectContaining({
          method: 'PUT',
        })
      )
    })

    it('should handle upload error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: () => Promise.resolve({ error: 'Payload too large' }),
      })

      const result = await client.uploadFragments('session-1', {
        fragments: [],
      })

      expect(result.error).toBe('Payload too large')
    })
  })

  // ============================================
  // listFragments
  // ============================================

  describe('listFragments', () => {
    it('should list fragments for a session', async () => {
      const mockFragments: SessionFragment[] = [
        {
          id: 'fragment-1',
          fragment_type: 'user_prompt',
          content: 'Content',
          sequence_number: 1,
          metadata: null,
          created_at: '2024-01-01T00:00:00Z',
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ fragments: mockFragments }),
      })

      const result = await client.listFragments('session-1')

      expect(result.success).toBe(true)
      expect(result.data?.fragments).toHaveLength(1)
    })
  })

  // ============================================
  // generateStructuredContext
  // ============================================

  describe('generateStructuredContext', () => {
    it('should generate structured context', async () => {
      const mockResponse = {
        success: true,
        structured_context: {
          session_id: 'session-1',
          project_info: {
            name: 'Test Project',
            tech_stack: ['TypeScript'],
            description: 'A test project',
          },
          problem: {
            description: 'Test problem',
            context: 'Test context',
          },
          solution: {
            approach: 'Test approach',
            key_steps: ['Step 1'],
          },
          learnings: ['Learning 1'],
          decisions: [],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await client.generateStructuredContext({
        session_id: 'session-1',
        format: 'standard',
      })

      expect(result.success).toBe(true)
      expect(result.data?.structured_context.session_id).toBe('session-1')
    })

    it('should handle generation error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ error: 'Session has no fragments' }),
      })

      const result = await client.generateStructuredContext({
        session_id: 'empty-session',
      })

      expect(result.error).toBe('Session has no fragments')
    })
  })

  // ============================================
  // generateArticleDraft
  // ============================================

  describe('generateArticleDraft', () => {
    it('should generate article draft', async () => {
      const mockResponse = {
        success: true,
        article_draft: {
          title: 'Test Article',
          summary: 'Test summary',
          content: '# Test Article\n\nContent here.',
          sections: [{ title: 'Introduction', content: 'Intro content' }],
          tags: ['test'],
          reading_time_minutes: 5,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })

      const result = await client.generateArticleDraft({
        session_id: 'session-1',
        article_style: 'tutorial',
        target_audience: 'beginner',
      })

      expect(result.success).toBe(true)
      expect(result.data?.article_draft.title).toBe('Test Article')
    })

    it('should handle generation error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid session_id' }),
      })

      const result = await client.generateArticleDraft({
        session_id: 'invalid',
      })

      expect(result.error).toBe('Invalid session_id')
    })
  })

  // ============================================
  // Network Error Handling
  // ============================================

  describe('network errors', () => {
    it('should handle network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await client.createSession({ title: 'Test' })

      expect(result.error).toBe('Network error')
    })

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error string')

      const result = await client.createSession({ title: 'Test' })

      expect(result.error).toBe('Unknown error')
    })

    it('should handle JSON parse errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      const result = await client.createSession({ title: 'Test' })

      expect(result.error).toBe('Invalid JSON')
    })
  })

  // ============================================
  // Response with details
  // ============================================

  describe('response with details', () => {
    it('should include details in error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: 'Validation failed',
          details: { field: 'title', reason: 'required' },
        }),
      })

      const result = await client.createSession({})

      expect(result.error).toBe('Validation failed')
      expect(result.details).toEqual({ field: 'title', reason: 'required' })
    })
  })
})