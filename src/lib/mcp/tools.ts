/**
 * MCP Tools Definition
 *
 * Defines all Viblog MCP tools with their input schemas.
 * @see https://spec.modelcontextprotocol.io/specification/basic/tools/
 */

import type { McpTool } from './types'

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
      project_name: {
        type: 'string',
        description: 'Name of the project you are working on',
      },
      session_type: {
        type: 'string',
        enum: ['coding', 'debugging', 'learning', 'exploration'],
        description: 'Type of the session (default: coding)',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional tags to categorize the session',
      },
      auto_capture: {
        type: 'boolean',
        description: 'Whether to auto-capture subsequent operations',
      },
    },
    required: ['project_name'],
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
        format: 'uuid',
        description: 'ID of the session to append to',
      },
      context_type: {
        type: 'string',
        enum: ['conversation', 'code_snippet', 'file_change', 'command', 'document'],
        description: 'Type of context being appended',
      },
      content: {
        type: 'object',
        properties: {
          // conversation
          role: { type: 'string', enum: ['user', 'assistant'] },
          message: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          // code_snippet
          language: { type: 'string' },
          code: { type: 'string' },
          file_path: { type: 'string' },
          description: { type: 'string' },
          // file_change
          action: { type: 'string', enum: ['create', 'modify', 'delete'] },
          diff: { type: 'string' },
          // command
          command: { type: 'string' },
          output: { type: 'string' },
          exit_code: { type: 'number' },
          // document
          document_type: { type: 'string', enum: ['markdown', 'json', 'yaml'] },
          purpose: { type: 'string' },
        },
        description: 'Content of the context item',
      },
      metadata: {
        type: 'object',
        properties: {
          importance: {
            type: 'string',
            enum: ['critical', 'high', 'medium', 'low'],
          },
          auto_generated: { type: 'boolean' },
        },
        description: 'Optional metadata for the context item',
      },
    },
    required: ['session_id', 'context_type', 'content'],
  },
}

export const UPLOAD_SESSION_CONTEXT_TOOL: McpTool = {
  name: 'upload_session_context',
  description:
    'Batch upload complete raw context to a session. Use this at the end of a session to upload all data at once.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the session',
      },
      raw_context: {
        type: 'object',
        properties: {
          project_info: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              tech_stack: { type: 'array', items: { type: 'string' } },
              description: { type: 'string' },
            },
            required: ['name'],
          },
          conversation: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['user', 'assistant'] },
                content: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                attachments: { type: 'array', items: { type: 'string' } },
              },
              required: ['role', 'content'],
            },
          },
          code_changes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                file_path: { type: 'string' },
                action: { type: 'string', enum: ['create', 'modify', 'delete'] },
                diff: { type: 'string' },
                final_content: { type: 'string' },
              },
              required: ['file_path', 'action'],
            },
          },
          commands_run: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                command: { type: 'string' },
                output: { type: 'string' },
                success: { type: 'boolean' },
                timestamp: { type: 'string', format: 'date-time' },
              },
              required: ['command', 'success'],
            },
          },
          documents_referenced: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'string' },
                type: { type: 'string' },
                relevance: { type: 'string' },
              },
            },
          },
        },
        description: 'Complete raw context for the session',
      },
      metadata: {
        type: 'object',
        properties: {
          duration_minutes: { type: 'number' },
          outcome: { type: 'string', enum: ['success', 'partial', 'failed'] },
          key_learnings: { type: 'array', items: { type: 'string' } },
        },
        description: 'Optional session metadata',
      },
    },
    required: ['session_id', 'raw_context'],
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
        format: 'uuid',
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

export const UPDATE_STRUCTURED_CONTEXT_TOOL: McpTool = {
  name: 'update_structured_context',
  description:
    'Manually update or supplement the structured context data for a session.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the session to update',
      },
      structured_data: {
        type: 'object',
        description: 'Partial structured data to update',
      },
      merge_mode: {
        type: 'string',
        enum: ['replace', 'append', 'merge'],
        description: 'How to merge the data (default: merge)',
      },
    },
    required: ['session_id', 'structured_data'],
  },
}

// ============================================
// Layer 3: Content Generation Tools
// ============================================

export const GENERATE_ARTICLE_DRAFT_TOOL: McpTool = {
  name: 'generate_article_draft',
  description:
    'Generate an article draft from structured session data. Transforms your coding session into a readable blog article.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        format: 'uuid',
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

export const UPDATE_ARTICLE_DRAFT_TOOL: McpTool = {
  name: 'update_article_draft',
  description: 'Update an existing article draft with new content.',
  inputSchema: {
    type: 'object',
    properties: {
      draft_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the draft to update',
      },
      content: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          markdown: { type: 'string' },
          json_content: { type: 'object' },
        },
        description: 'Content to update',
      },
      preserve_version: {
        type: 'boolean',
        description: 'Whether to preserve the previous version',
      },
    },
    required: ['draft_id', 'content'],
  },
}

export const MERGE_SESSIONS_TO_ARTICLE_TOOL: McpTool = {
  name: 'merge_sessions_to_article',
  description:
    'Merge multiple sessions into a single comprehensive article. Use for cross-session articles.',
  inputSchema: {
    type: 'object',
    properties: {
      session_ids: {
        type: 'array',
        items: { type: 'string', format: 'uuid' },
        description: 'IDs of sessions to merge',
      },
      merge_strategy: {
        type: 'string',
        enum: ['chronological', 'thematic', 'problem_solution'],
        description: 'Strategy for merging sessions',
      },
      article_focus: {
        type: 'string',
        description: 'Main focus or theme for the merged article',
      },
    },
    required: ['session_ids', 'merge_strategy'],
  },
}

// ============================================
// Layer 4: Publish Management Tools
// ============================================

export const PUBLISH_ARTICLE_TOOL: McpTool = {
  name: 'publish_article',
  description:
    'Publish an article draft to Viblog. Makes your article publicly visible.',
  inputSchema: {
    type: 'object',
    properties: {
      draft_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the draft to publish',
      },
      publish_options: {
        type: 'object',
        properties: {
          visibility: {
            type: 'string',
            enum: ['public', 'private', 'unlisted'],
            description: 'Visibility of the published article',
          },
          publish_as_dual_format: {
            type: 'boolean',
            description: 'Publish as both Markdown and JSON',
          },
          generate_social_snippets: {
            type: 'boolean',
            description: 'Generate social media snippets',
          },
          notify_subscribers: {
            type: 'boolean',
            description: 'Notify subscribers of new article',
          },
        },
        required: ['visibility'],
      },
    },
    required: ['draft_id', 'publish_options'],
  },
}

export const GET_SESSION_STATUS_TOOL: McpTool = {
  name: 'get_session_status',
  description:
    'Get the current status and trace information for a session.',
  inputSchema: {
    type: 'object',
    properties: {
      session_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID of the session to check',
      },
      include_trace: {
        type: 'boolean',
        description: 'Include detailed trace information',
      },
    },
    required: ['session_id'],
  },
}

export const LIST_USER_SESSIONS_TOOL: McpTool = {
  name: 'list_user_sessions',
  description: 'List all sessions for the authenticated user.',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['raw', 'structured', 'draft', 'published'],
        description: 'Filter by session status',
      },
      date_range: {
        type: 'object',
        properties: {
          from: { type: 'string', format: 'date-time' },
          to: { type: 'string', format: 'date-time' },
        },
        description: 'Date range filter',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of sessions to return (default: 20)',
      },
    },
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
  UPDATE_STRUCTURED_CONTEXT_TOOL,
  // Layer 3: Content Generation
  GENERATE_ARTICLE_DRAFT_TOOL,
  UPDATE_ARTICLE_DRAFT_TOOL,
  MERGE_SESSIONS_TO_ARTICLE_TOOL,
  // Layer 4: Publish Management
  PUBLISH_ARTICLE_TOOL,
  GET_SESSION_STATUS_TOOL,
  LIST_USER_SESSIONS_TOOL,
]

// ============================================
// Tool Registry for Lookup
// ============================================

export const TOOL_REGISTRY: Record<string, McpTool> = Object.fromEntries(
  VIBLOG_MCP_TOOLS.map((tool) => [tool.name, tool])
)