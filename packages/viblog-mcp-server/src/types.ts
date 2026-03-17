/**
 * MCP Server Types
 *
 * Shared types for the Viblog MCP Server
 */

// ============================================
// Configuration
// ============================================

export interface McpServerConfig {
  apiUrl: string
  apiKey: string
}

export function getServerConfig(): McpServerConfig {
  const apiUrl = process.env.VIBLOG_API_URL
  const apiKey = process.env.VIBLOG_API_KEY

  if (!apiUrl) {
    throw new Error('VIBLOG_API_URL environment variable is required')
  }
  if (!apiKey) {
    throw new Error('VIBLOG_API_KEY environment variable is required')
  }

  return { apiUrl, apiKey }
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success?: boolean
  error?: string
  details?: unknown
  data?: T
}

// Session Types
export interface VibeSession {
  id: string
  title: string | null
  platform: string | null
  model: string | null
  status: 'active' | 'completed' | 'archived'
  start_time: string
  end_time: string | null
  created_at: string
  updated_at: string
  metadata: Record<string, unknown> | null
}

export interface CreateSessionInput {
  title?: string
  platform?: string
  model?: string
  metadata?: Record<string, unknown>
}

export interface CreateSessionResponse {
  success: boolean
  session: VibeSession
  session_id: string
}

// Fragment Types
export interface SessionFragment {
  id: string
  fragment_type: string
  content: string
  sequence_number: number
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface AppendFragmentInput {
  fragment_type: 'conversation' | 'code_snippet' | 'file_change' | 'command' | 'document'
  content: string
  metadata?: Record<string, unknown>
  sequence_number?: number
}

export interface AppendFragmentResponse {
  success: boolean
  fragment: SessionFragment
}

export interface UploadFragmentsInput {
  fragments: Array<{
    fragment_type: string
    content: string
    sequence_number: number
    metadata?: Record<string, unknown>
  }>
}

export interface UploadFragmentsResponse {
  success: boolean
  count: number
  fragments: SessionFragment[]
}

// Structured Context Types
export interface StructuredVibeContext {
  session_id: string
  project_info: {
    name: string
    tech_stack?: string[]
    description?: string
  }
  problem: {
    description: string
    context: string
    attempted_solutions?: string[]
  }
  solution: {
    approach: string
    key_steps: string[]
    code_snippets?: Array<{
      language: string
      code: string
      description: string
    }>
  }
  learnings: string[]
  decisions: Array<{
    decision: string
    rationale: string
    alternatives?: string[]
  }>
  next_steps?: string[]
}

export interface GenerateStructuredContextInput {
  session_id: string
  format?: 'standard' | 'detailed' | 'compact'
  focus_areas?: string[]
  custom_prompt?: string
}

// Article Draft Types
export interface ArticleDraft {
  title: string
  summary: string
  content: string
  sections: Array<{
    title: string
    content: string
  }>
  tags: string[]
  reading_time_minutes: number
}

export interface GenerateArticleDraftInput {
  session_id: string
  article_style?: 'tutorial' | 'case_study' | 'tips' | 'deep_dive' | 'quick_note'
  target_audience?: 'beginner' | 'intermediate' | 'advanced'
  include_sections?: string[]
  tone?: 'casual' | 'professional' | 'educational'
  custom_instructions?: string
}

export interface GenerateArticleDraftResponse {
  success: boolean
  article_draft: ArticleDraft
}

// List Sessions Types
export interface ListSessionsInput {
  status?: 'active' | 'completed' | 'archived'
  platform?: string
  limit?: number
  offset?: number
}

export interface ListSessionsResponse {
  sessions: VibeSession[]
  pagination: {
    total: number
    limit: number
    offset: number
    has_more: boolean
  }
}

// ============================================
// MCP Tool Types
// ============================================

// Re-export CallToolResult from SDK for type-safe handler returns
export type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export interface McpTool {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}