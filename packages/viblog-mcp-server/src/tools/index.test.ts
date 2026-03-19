/**
 * Tests for MCP Tool Definitions
 *
 * Tests tool definitions and registry.
 */

import { describe, it, expect } from 'vitest'
import {
  CREATE_VIBE_SESSION_TOOL,
  APPEND_SESSION_CONTEXT_TOOL,
  UPLOAD_SESSION_CONTEXT_TOOL,
  GENERATE_STRUCTURED_CONTEXT_TOOL,
  GENERATE_ARTICLE_DRAFT_TOOL,
  LIST_USER_SESSIONS_TOOL,
  VIBLOG_MCP_TOOLS,
  TOOL_REGISTRY,
} from './index.js'

describe('MCP Tool Definitions', () => {
  describe('Individual Tool Definitions', () => {
    it('should define create_vibe_session tool', () => {
      expect(CREATE_VIBE_SESSION_TOOL.name).toBe('create_vibe_session')
      expect(CREATE_VIBE_SESSION_TOOL.description).toBeTruthy()
      expect(CREATE_VIBE_SESSION_TOOL.inputSchema.type).toBe('object')
      expect(CREATE_VIBE_SESSION_TOOL.inputSchema.properties.title).toBeDefined()
      expect(CREATE_VIBE_SESSION_TOOL.inputSchema.properties.platform).toBeDefined()
      expect(CREATE_VIBE_SESSION_TOOL.inputSchema.properties.model).toBeDefined()
      expect(CREATE_VIBE_SESSION_TOOL.inputSchema.required).toEqual([])
    })

    it('should define append_session_context tool', () => {
      expect(APPEND_SESSION_CONTEXT_TOOL.name).toBe('append_session_context')
      expect(APPEND_SESSION_CONTEXT_TOOL.inputSchema.required).toContain('session_id')
      expect(APPEND_SESSION_CONTEXT_TOOL.inputSchema.required).toContain('fragment_type')
      expect(APPEND_SESSION_CONTEXT_TOOL.inputSchema.required).toContain('content')
    })

    it('should define upload_session_context tool', () => {
      expect(UPLOAD_SESSION_CONTEXT_TOOL.name).toBe('upload_session_context')
      expect(UPLOAD_SESSION_CONTEXT_TOOL.inputSchema.required).toContain('session_id')
      expect(UPLOAD_SESSION_CONTEXT_TOOL.inputSchema.required).toContain('fragments')
    })

    it('should define generate_structured_context tool', () => {
      expect(GENERATE_STRUCTURED_CONTEXT_TOOL.name).toBe('generate_structured_context')
      expect(GENERATE_STRUCTURED_CONTEXT_TOOL.inputSchema.required).toContain('session_id')
      expect(GENERATE_STRUCTURED_CONTEXT_TOOL.inputSchema.properties.format).toBeDefined()
      expect(GENERATE_STRUCTURED_CONTEXT_TOOL.inputSchema.properties.focus_areas).toBeDefined()
    })

    it('should define generate_article_draft tool', () => {
      expect(GENERATE_ARTICLE_DRAFT_TOOL.name).toBe('generate_article_draft')
      expect(GENERATE_ARTICLE_DRAFT_TOOL.inputSchema.required).toContain('session_id')
      expect(GENERATE_ARTICLE_DRAFT_TOOL.inputSchema.properties.article_style).toBeDefined()
      expect(GENERATE_ARTICLE_DRAFT_TOOL.inputSchema.properties.target_audience).toBeDefined()
      expect(GENERATE_ARTICLE_DRAFT_TOOL.inputSchema.properties.tone).toBeDefined()
    })

    it('should define list_user_sessions tool', () => {
      expect(LIST_USER_SESSIONS_TOOL.name).toBe('list_user_sessions')
      expect(LIST_USER_SESSIONS_TOOL.inputSchema.required).toEqual([])
      expect(LIST_USER_SESSIONS_TOOL.inputSchema.properties.status).toBeDefined()
      expect(LIST_USER_SESSIONS_TOOL.inputSchema.properties.limit).toBeDefined()
      expect(LIST_USER_SESSIONS_TOOL.inputSchema.properties.offset).toBeDefined()
    })
  })

  describe('VIBLOG_MCP_TOOLS Array', () => {
    it('should contain all 6 tools', () => {
      expect(VIBLOG_MCP_TOOLS).toHaveLength(6)
    })

    it('should have unique tool names', () => {
      const names = VIBLOG_MCP_TOOLS.map((t) => t.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })

    it('should include all expected tools', () => {
      const names = VIBLOG_MCP_TOOLS.map((t) => t.name)
      expect(names).toContain('create_vibe_session')
      expect(names).toContain('append_session_context')
      expect(names).toContain('upload_session_context')
      expect(names).toContain('generate_structured_context')
      expect(names).toContain('generate_article_draft')
      expect(names).toContain('list_user_sessions')
    })

    it('should have valid inputSchema for all tools', () => {
      for (const tool of VIBLOG_MCP_TOOLS) {
        expect(tool.inputSchema.type).toBe('object')
        expect(tool.inputSchema.properties).toBeDefined()
        expect(typeof tool.description).toBe('string')
        expect(tool.description.length).toBeGreaterThan(0)
      }
    })
  })

  describe('TOOL_REGISTRY', () => {
    it('should map all tools by name', () => {
      expect(TOOL_REGISTRY['create_vibe_session']).toBe(CREATE_VIBE_SESSION_TOOL)
      expect(TOOL_REGISTRY['append_session_context']).toBe(APPEND_SESSION_CONTEXT_TOOL)
      expect(TOOL_REGISTRY['upload_session_context']).toBe(UPLOAD_SESSION_CONTEXT_TOOL)
      expect(TOOL_REGISTRY['generate_structured_context']).toBe(GENERATE_STRUCTURED_CONTEXT_TOOL)
      expect(TOOL_REGISTRY['generate_article_draft']).toBe(GENERATE_ARTICLE_DRAFT_TOOL)
      expect(TOOL_REGISTRY['list_user_sessions']).toBe(LIST_USER_SESSIONS_TOOL)
    })

    it('should have 6 entries', () => {
      expect(Object.keys(TOOL_REGISTRY)).toHaveLength(6)
    })

    it('should return undefined for unknown tools', () => {
      expect(TOOL_REGISTRY['unknown_tool']).toBeUndefined()
    })
  })

  describe('Tool Schema Validation', () => {
    it('should have enum values for fragment_type in append_session_context', () => {
      const fragmentType = APPEND_SESSION_CONTEXT_TOOL.inputSchema.properties.fragment_type
      expect(fragmentType.enum).toBeDefined()
      expect(fragmentType.enum).toContain('conversation')
      expect(fragmentType.enum).toContain('code_snippet')
      expect(fragmentType.enum).toContain('file_change')
      expect(fragmentType.enum).toContain('command')
      expect(fragmentType.enum).toContain('document')
    })

    it('should have enum values for article_style in generate_article_draft', () => {
      const articleStyle = GENERATE_ARTICLE_DRAFT_TOOL.inputSchema.properties.article_style
      expect(articleStyle.enum).toBeDefined()
      expect(articleStyle.enum).toContain('tutorial')
      expect(articleStyle.enum).toContain('case_study')
      expect(articleStyle.enum).toContain('tips')
      expect(articleStyle.enum).toContain('deep_dive')
      expect(articleStyle.enum).toContain('quick_note')
    })

    it('should have enum values for target_audience in generate_article_draft', () => {
      const targetAudience = GENERATE_ARTICLE_DRAFT_TOOL.inputSchema.properties.target_audience
      expect(targetAudience.enum).toBeDefined()
      expect(targetAudience.enum).toContain('beginner')
      expect(targetAudience.enum).toContain('intermediate')
      expect(targetAudience.enum).toContain('advanced')
    })

    it('should have enum values for tone in generate_article_draft', () => {
      const tone = GENERATE_ARTICLE_DRAFT_TOOL.inputSchema.properties.tone
      expect(tone.enum).toBeDefined()
      expect(tone.enum).toContain('casual')
      expect(tone.enum).toContain('professional')
      expect(tone.enum).toContain('educational')
    })
  })
})