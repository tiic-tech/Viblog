/**
 * Tests for ToolHandler
 *
 * Tests all 6 MCP tool handlers with mocked API client.
 * Covers success cases, error handling, and edge cases.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ToolHandler } from './handlers.js'
import { ViblogApiClient } from '../api/client.js'
import type {
  CreateSessionResponse,
  AppendFragmentResponse,
  UploadFragmentsResponse,
  VibeSession,
} from '../types.js'

// Mock the ViblogApiClient
vi.mock('../api/client.js', () => {
  return {
    ViblogApiClient: vi.fn(),
  }
})

describe('ToolHandler', () => {
  let handler: ToolHandler
  let mockClient: { [K in keyof ViblogApiClient]?: vi.Mock }

  beforeEach(() => {
    vi.clearAllMocks()

    // Create mock client with all methods
    mockClient = {
      createSession: vi.fn(),
      listSessions: vi.fn(),
      getSession: vi.fn(),
      appendFragment: vi.fn(),
      uploadFragments: vi.fn(),
      listFragments: vi.fn(),
      generateStructuredContext: vi.fn(),
      generateArticleDraft: vi.fn(),
    }

    // Mock constructor
    ;(ViblogApiClient as unknown as vi.Mock).mockImplementation(() => mockClient)

    handler = new ToolHandler(mockClient as unknown as ViblogApiClient)
  })

  // ============================================
  // handleToolCall - Routing
  // ============================================

  describe('handleToolCall routing', () => {
    it('should route to create_vibe_session', async () => {
      mockClient.createSession!.mockResolvedValueOnce({
        success: true,
        data: {
          success: true,
          session_id: 'session-1',
          session: {} as VibeSession,
        } as CreateSessionResponse,
      })

      await handler.handleToolCall('create_vibe_session', { title: 'Test' })

      expect(mockClient.createSession).toHaveBeenCalledWith({ title: 'Test' })
    })

    it('should return error for unknown tool', async () => {
      const result = await handler.handleToolCall('unknown_tool', {})

      expect(result.isError).toBe(true)
      expect(result.content[0]).toEqual({
        type: 'text',
        text: 'Unknown tool: unknown_tool',
      })
    })
  })

  // ============================================
  // create_vibe_session
  // ============================================

  describe('create_vibe_session', () => {
    it('should create session successfully', async () => {
      const mockResponse: CreateSessionResponse = {
        success: true,
        session_id: 'session-123',
        session: {
          id: 'session-123',
          title: 'My Session',
          platform: 'claude',
          model: 'claude-3-opus',
          status: 'active',
          start_time: '2024-01-01T00:00:00Z',
          end_time: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          metadata: null,
        },
      }

      mockClient.createSession!.mockResolvedValueOnce({
        success: true,
        data: mockResponse,
      })

      const result = await handler.handleToolCall('create_vibe_session', {
        title: 'My Session',
        platform: 'claude',
        model: 'claude-3-opus',
      })

      expect(result.isError).toBeUndefined()
      const parsed = JSON.parse(result.content[0].text as string)
      expect(parsed.success).toBe(true)
      expect(parsed.session_id).toBe('session-123')
      expect(parsed.message).toContain('session-123')
    })

    it('should handle create session error', async () => {
      mockClient.createSession!.mockResolvedValueOnce({
        error: 'Unauthorized',
      })

      const result = await handler.handleToolCall('create_vibe_session', {
        title: 'Test',
      })

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Failed to create session')
      expect(result.content[0].text).toContain('Unauthorized')
    })

    it('should pass optional metadata', async () => {
      mockClient.createSession!.mockResolvedValueOnce({
        success: true,
        data: {
          success: true,
          session_id: 's1',
          session: {} as VibeSession,
        },
      })

      await handler.handleToolCall('create_vibe_session', {
        title: 'Test',
        metadata: { key: 'value' },
      })

      expect(mockClient.createSession).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: { key: 'value' },
        })
      )
    })
  })

  // ============================================
  // append_session_context
  // ============================================

  describe('append_session_context', () => {
    it('should append context successfully', async () => {
      mockClient.appendFragment!.mockResolvedValueOnce({
        success: true,
        data: {
          success: true,
          fragment: {
            id: 'fragment-1',
            fragment_type: 'conversation',
            content: 'Test content',
            sequence_number: 1,
            metadata: null,
            created_at: '2024-01-01T00:00:00Z',
          },
        } as AppendFragmentResponse,
      })

      const result = await handler.handleToolCall('append_session_context', {
        session_id: 'session-1',
        fragment_type: 'conversation',
        content: 'Test content',
      })

      expect(result.isError).toBeUndefined()
      const parsed = JSON.parse(result.content[0].text as string)
      expect(parsed.success).toBe(true)
      expect(parsed.fragment_id).toBe('fragment-1')
      expect(parsed.sequence_number).toBe(1)
    })

    it('should handle append error', async () => {
      mockClient.appendFragment!.mockResolvedValueOnce({
        error: 'Session not found',
      })

      const result = await handler.handleToolCall('append_session_context', {
        session_id: 'non-existent',
        fragment_type: 'conversation',
        content: 'Test',
      })

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Failed to append context')
    })

    it('should pass optional sequence_number and metadata', async () => {
      mockClient.appendFragment!.mockResolvedValueOnce({
        success: true,
        data: {
          success: true,
          fragment: {
            id: 'f1',
            fragment_type: 'code_snippet',
            content: '',
            sequence_number: 5,
            metadata: null,
            created_at: '',
          },
        },
      })

      await handler.handleToolCall('append_session_context', {
        session_id: 's1',
        fragment_type: 'code_snippet',
        content: 'code',
        sequence_number: 5,
        metadata: { language: 'typescript' },
      })

      expect(mockClient.appendFragment).toHaveBeenCalledWith(
        's1',
        expect.objectContaining({
          sequence_number: 5,
          metadata: { language: 'typescript' },
        })
      )
    })
  })

  // ============================================
  // upload_session_context
  // ============================================

  describe('upload_session_context', () => {
    it('should upload fragments successfully', async () => {
      mockClient.uploadFragments!.mockResolvedValueOnce({
        success: true,
        data: {
          success: true,
          count: 3,
          fragments: [],
        } as UploadFragmentsResponse,
      })

      const result = await handler.handleToolCall('upload_session_context', {
        session_id: 'session-1',
        fragments: [
          { fragment_type: 'conversation', content: 'C1', sequence_number: 1 },
          { fragment_type: 'code_snippet', content: 'C2', sequence_number: 2 },
          { fragment_type: 'file_change', content: 'C3', sequence_number: 3 },
        ],
      })

      expect(result.isError).toBeUndefined()
      const parsed = JSON.parse(result.content[0].text as string)
      expect(parsed.success).toBe(true)
      expect(parsed.count).toBe(3)
    })

    it('should handle upload error', async () => {
      mockClient.uploadFragments!.mockResolvedValueOnce({
        error: 'Invalid session',
      })

      const result = await handler.handleToolCall('upload_session_context', {
        session_id: 'invalid',
        fragments: [{ fragment_type: 'conversation', content: 'Test', sequence_number: 1 }],
      })

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Failed to upload context')
    })
  })

  // ============================================
  // generate_structured_context
  // ============================================

  describe('generate_structured_context', () => {
    it('should generate structured context', async () => {
      const mockStructuredContext = {
        session_id: 'session-1',
        project_info: {
          name: 'Test Project',
          tech_stack: ['TypeScript'],
          description: 'Test',
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
      }

      mockClient.generateStructuredContext!.mockResolvedValueOnce({
        success: true,
        data: {
          success: true,
          structured_context: mockStructuredContext,
        },
      })

      const result = await handler.handleToolCall('generate_structured_context', {
        session_id: 'session-1',
        format: 'standard',
      })

      expect(result.isError).toBeUndefined()
      const parsed = JSON.parse(result.content[0].text as string)
      expect(parsed.success).toBe(true)
      expect(parsed.structured_context.session_id).toBe('session-1')
    })

    it('should handle generation error', async () => {
      mockClient.generateStructuredContext!.mockResolvedValueOnce({
        error: 'No fragments in session',
      })

      const result = await handler.handleToolCall('generate_structured_context', {
        session_id: 'empty-session',
      })

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Failed to generate structured context')
    })

    it('should pass optional parameters', async () => {
      mockClient.generateStructuredContext!.mockResolvedValueOnce({
        success: true,
        data: { success: true, structured_context: { session_id: 's1' } },
      })

      await handler.handleToolCall('generate_structured_context', {
        session_id: 's1',
        format: 'detailed',
        focus_areas: ['code', 'decisions'],
        custom_prompt: 'Focus on architecture',
      })

      expect(mockClient.generateStructuredContext).toHaveBeenCalledWith({
        session_id: 's1',
        format: 'detailed',
        focus_areas: ['code', 'decisions'],
        custom_prompt: 'Focus on architecture',
      })
    })
  })

  // ============================================
  // generate_article_draft
  // ============================================

  describe('generate_article_draft', () => {
    it('should generate article draft', async () => {
      const mockArticleDraft = {
        title: 'How to Build a Test',
        summary: 'A tutorial on testing',
        content: '# How to Build a Test\n\nContent...',
        sections: [
          { title: 'Introduction', content: 'Intro' },
          { title: 'Setup', content: 'Setup content' },
        ],
        tags: ['testing', 'tutorial'],
        reading_time_minutes: 5,
      }

      mockClient.generateArticleDraft!.mockResolvedValueOnce({
        success: true,
        data: {
          success: true,
          article_draft: mockArticleDraft,
        },
      })

      const result = await handler.handleToolCall('generate_article_draft', {
        session_id: 'session-1',
        article_style: 'tutorial',
        target_audience: 'beginner',
      })

      expect(result.isError).toBeUndefined()
      const parsed = JSON.parse(result.content[0].text as string)
      expect(parsed.success).toBe(true)
      expect(parsed.article_draft.title).toBe('How to Build a Test')
      expect(parsed.message).toContain('Preview and edit')
    })

    it('should handle generation error', async () => {
      mockClient.generateArticleDraft!.mockResolvedValueOnce({
        error: 'LLM service unavailable',
      })

      const result = await handler.handleToolCall('generate_article_draft', {
        session_id: 'session-1',
      })

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Failed to generate article draft')
    })

    it('should pass all optional parameters', async () => {
      mockClient.generateArticleDraft!.mockResolvedValueOnce({
        success: true,
        data: { success: true, article_draft: { title: 'Test' } },
      })

      await handler.handleToolCall('generate_article_draft', {
        session_id: 's1',
        article_style: 'case_study',
        target_audience: 'advanced',
        include_sections: ['problem', 'solution', 'results'],
        tone: 'professional',
        custom_instructions: 'Include code examples',
      })

      expect(mockClient.generateArticleDraft).toHaveBeenCalledWith({
        session_id: 's1',
        article_style: 'case_study',
        target_audience: 'advanced',
        include_sections: ['problem', 'solution', 'results'],
        tone: 'professional',
        custom_instructions: 'Include code examples',
      })
    })
  })

  // ============================================
  // list_user_sessions
  // ============================================

  describe('list_user_sessions', () => {
    it('should list sessions successfully', async () => {
      const mockSessions: VibeSession[] = [
        {
          id: 'session-1',
          title: 'Session 1',
          platform: 'claude',
          model: null,
          status: 'active',
          start_time: '2024-01-01T00:00:00Z',
          end_time: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          metadata: null,
        },
        {
          id: 'session-2',
          title: 'Session 2',
          platform: 'cursor',
          model: null,
          status: 'completed',
          start_time: '2024-01-02T00:00:00Z',
          end_time: '2024-01-02T01:00:00Z',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T01:00:00Z',
          metadata: null,
        },
      ]

      mockClient.listSessions!.mockResolvedValueOnce({
        success: true,
        data: {
          sessions: mockSessions,
          pagination: {
            total: 2,
            limit: 10,
            offset: 0,
            has_more: false,
          },
        },
      })

      const result = await handler.handleToolCall('list_user_sessions', {})

      expect(result.isError).toBeUndefined()
      const parsed = JSON.parse(result.content[0].text as string)
      expect(parsed.success).toBe(true)
      expect(parsed.sessions).toHaveLength(2)
      expect(parsed.pagination.total).toBe(2)
    })

    it('should filter by status', async () => {
      mockClient.listSessions!.mockResolvedValueOnce({
        success: true,
        data: {
          sessions: [],
          pagination: { total: 0, limit: 10, offset: 0, has_more: false },
        },
      })

      await handler.handleToolCall('list_user_sessions', {
        status: 'active',
      })

      expect(mockClient.listSessions).toHaveBeenCalledWith({
        status: 'active',
      })
    })

    it('should handle list error', async () => {
      mockClient.listSessions!.mockResolvedValueOnce({
        error: 'Rate limit exceeded',
      })

      const result = await handler.handleToolCall('list_user_sessions', {})

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Failed to list sessions')
    })
  })

  // ============================================
  // Error Handling
  // ============================================

  describe('error handling', () => {
    it('should handle unexpected errors', async () => {
      mockClient.createSession!.mockRejectedValueOnce(new Error('Unexpected error'))

      const result = await handler.handleToolCall('create_vibe_session', {})

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Unexpected error')
    })

    it('should handle non-Error exceptions', async () => {
      mockClient.createSession!.mockRejectedValueOnce('String error')

      const result = await handler.handleToolCall('create_vibe_session', {})

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('String error')
    })

    it('should catch errors in tool routing', async () => {
      // Test that the try-catch in handleToolCall catches all errors
      mockClient.listSessions!.mockImplementationOnce(() => {
        throw new Error('Sync error')
      })

      const result = await handler.handleToolCall('list_user_sessions', {})

      expect(result.isError).toBe(true)
      expect(result.content[0].text).toContain('Sync error')
    })
  })
})