/**
 * MCP Tool Definitions
 *
 * Defines all Viblog MCP tools with their input schemas.
 * @see https://spec.modelcontextprotocol.io/specification/basic/tools/
 */

import type { McpTool } from '../types.js'

// ============================================
// Layer 1: Data Collection Tools
// ============================================

export const CREATE_VIBE_SESSION_TOOL: McpTool = {
  name: 'create_vibe_session',
  description:
    'Create a new Vibe Coding Session to record your coding experience. Use this when starting a new coding session that you want to capture and potentially transform into a blog article.',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title for the session (optional, will be auto-generated if not provided)',
      },
      platform: {
        type: 'string',
        description: 'Platform used (e.g., "claude-code", "cursor", "windsurf")',
      },
      model: {
        type: 'string',
        description: 'AI model used (e.g., "claude-sonnet-4", "gpt-4")',
      },
      metadata: {
        type: 'object',
        description: 'Additional metadata for the session',
      },
    },
    required: [],
  },
}

export const APPEND_SESSION_CONTEXT_TOOL: McpTool = {
  name: 'append_session_context',
  description:
    'Incrementally append context data to an existing session. Use this during a session to add conversation, code snippets, file changes, or commands.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        description: 'ID of the session to append to',
      },
      fragment_type: {
        type: 'string',
        enum: ['user_prompt', 'ai_response', 'code_block', 'file_content', 'command_output', 'error_log', 'system_message', 'external_link'],
        description: 'Type of context being appended',
      },
      content: {
        type: 'string',
        description: 'The content of the fragment',
      },
      metadata: {
        type: 'object',
        description: 'Optional metadata for the fragment',
      },
      sequence_number: {
        type: 'number',
        description: 'Optional sequence number (auto-assigned if not provided)',
      },
    },
    required: ['session_id', 'fragment_type', 'content'],
  },
}

export const UPLOAD_SESSION_CONTEXT_TOOL: McpTool = {
  name: 'upload_session_context',
  description:
    'Batch upload multiple fragments to a session. Use this at the end of a session to upload all data at once.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        description: 'ID of the session',
      },
      fragments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fragment_type: {
              type: 'string',
              enum: ['user_prompt', 'ai_response', 'code_block', 'file_content', 'command_output', 'error_log', 'system_message', 'external_link'],
            },
            content: { type: 'string' },
            sequence_number: { type: 'number' },
            metadata: { type: 'object' },
          },
          required: ['fragment_type', 'content', 'sequence_number'],
        },
        description: 'Array of fragments to upload',
      },
    },
    required: ['session_id', 'fragments'],
  },
}

// ============================================
// Layer 2: Structured Processing Tools
// ============================================

export const GENERATE_STRUCTURED_CONTEXT_TOOL: McpTool = {
  name: 'generate_structured_context',
  description:
    'Generate structured JSON from raw session data using AI analysis. This extracts problems, solutions, code, learnings, and decisions from your session.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        description: 'ID of the session to process',
      },
      format: {
        type: 'string',
        enum: ['standard', 'detailed', 'compact'],
        description: 'Output format (default: standard)',
      },
      focus_areas: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['problem', 'solution', 'code', 'learnings', 'decisions'],
        },
        description: 'Areas to focus on during extraction',
      },
      custom_prompt: {
        type: 'string',
        description: 'Custom instructions for the AI processing',
      },
    },
    required: ['session_id'],
  },
}

// ============================================
// Layer 3: Content Generation Tools
// ============================================

export const GENERATE_ARTICLE_DRAFT_TOOL: McpTool = {
  name: 'generate_article_draft',
  description:
    'Generate an article draft from session data. Transforms your coding session into a readable blog article.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        description: 'ID of the session to generate from',
      },
      article_style: {
        type: 'string',
        enum: ['tutorial', 'case_study', 'tips', 'deep_dive', 'quick_note'],
        description: 'Style of the article (default: tutorial)',
      },
      target_audience: {
        type: 'string',
        enum: ['beginner', 'intermediate', 'advanced'],
        description: 'Target audience level (default: intermediate)',
      },
      include_sections: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['problem', 'solution', 'code', 'learnings', 'next_steps'],
        },
        description: 'Sections to include in the article',
      },
      tone: {
        type: 'string',
        enum: ['casual', 'professional', 'educational'],
        description: 'Tone of the article (default: educational)',
      },
      custom_instructions: {
        type: 'string',
        description: 'Custom instructions for article generation',
      },
    },
    required: ['session_id'],
  },
}

// ============================================
// Layer 4: Session Management Tools
// ============================================

export const LIST_USER_SESSIONS_TOOL: McpTool = {
  name: 'list_user_sessions',
  description: 'List all sessions for the authenticated user.',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['active', 'completed', 'archived'],
        description: 'Filter by session status',
      },
      platform: {
        type: 'string',
        description: 'Filter by platform',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of sessions to return (default: 20)',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination (default: 0)',
      },
    },
    required: [],
  },
}

// ============================================
// Layer 4: Publish Article Tool
// ============================================

export const PUBLISH_ARTICLE_TOOL: McpTool = {
  name: 'publish_article',
  description:
    'Publish an article from session data to Viblog. Creates an article with the specified visibility and returns the published article URL.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        description: 'ID of the session to publish from',
      },
      title: {
        type: 'string',
        description: 'Article title',
      },
      content: {
        type: 'string',
        description: 'Article content in Markdown or HTML format',
      },
      excerpt: {
        type: 'string',
        description: 'Short excerpt for article preview',
      },
      visibility: {
        type: 'string',
        enum: ['public', 'private', 'unlisted'],
        description: 'Article visibility (default: private)',
      },
      cover_image: {
        type: 'string',
        description: 'URL for cover image',
      },
      project_id: {
        type: 'string',
        description: 'Project ID to associate with the article',
      },
    },
    required: ['session_id', 'title', 'content'],
  },
}

// ============================================
// All MCP Tools
// ============================================

export const VIBLOG_MCP_TOOLS: McpTool[] = [
  // Layer 1: Data Collection
  CREATE_VIBE_SESSION_TOOL,
  APPEND_SESSION_CONTEXT_TOOL,
  UPLOAD_SESSION_CONTEXT_TOOL,
  // Layer 2: Structured Processing
  GENERATE_STRUCTURED_CONTEXT_TOOL,
  // Layer 3: Content Generation
  GENERATE_ARTICLE_DRAFT_TOOL,
  // Layer 4: Session Management & Publishing
  LIST_USER_SESSIONS_TOOL,
  PUBLISH_ARTICLE_TOOL,
]

// ============================================
// Tool Registry for Lookup
// ============================================

export const TOOL_REGISTRY: Record<string, McpTool> = Object.fromEntries(
  VIBLOG_MCP_TOOLS.map((tool) => [tool.name, tool])
)