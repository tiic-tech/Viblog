/**
 * MCP Tool Handlers
 *
 * Implements the execution logic for each MCP tool.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { ViblogApiClient } from '../api/client.js'

export class ToolHandler {
  private client: ViblogApiClient

  constructor(client: ViblogApiClient) {
    this.client = client
  }

  async handleToolCall(name: string, args: Record<string, unknown>): Promise<CallToolResult> {
    try {
      switch (name) {
        case 'create_vibe_session':
          return await this.createVibeSession(args)

        case 'append_session_context':
          return await this.appendSessionContext(args)

        case 'upload_session_context':
          return await this.uploadSessionContext(args)

        case 'generate_structured_context':
          return await this.generateStructuredContext(args)

        case 'generate_article_draft':
          return await this.generateArticleDraft(args)

        case 'list_user_sessions':
          return await this.listUserSessions(args)

        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return {
        content: [{ type: 'text', text: `Error: ${errorMessage}` }],
        isError: true,
      }
    }
  }

  // ============================================
  // Tool Implementations
  // ============================================

  private async createVibeSession(args: Record<string, unknown>): Promise<CallToolResult> {
    const response = await this.client.createSession({
      title: args.title as string | undefined,
      platform: args.platform as string | undefined,
      model: args.model as string | undefined,
      metadata: args.metadata as Record<string, unknown> | undefined,
    })

    if (response.error) {
      return {
        content: [{ type: 'text', text: `Failed to create session: ${response.error}` }],
        isError: true,
      }
    }

    const data = response.data!
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              session_id: data.session_id,
              session: data.session,
              message: `Session created successfully. Use session_id "${data.session_id}" for subsequent operations.`,
            },
            null,
            2
          ),
        },
      ],
    }
  }

  private async appendSessionContext(args: Record<string, unknown>): Promise<CallToolResult> {
    const sessionId = args.session_id as string
    const response = await this.client.appendFragment(sessionId, {
      fragment_type: args.fragment_type as 'conversation' | 'code_snippet' | 'file_change' | 'command' | 'document',
      content: args.content as string,
      metadata: args.metadata as Record<string, unknown> | undefined,
      sequence_number: args.sequence_number as number | undefined,
    })

    if (response.error) {
      return {
        content: [{ type: 'text', text: `Failed to append context: ${response.error}` }],
        isError: true,
      }
    }

    const data = response.data!
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              fragment_id: data.fragment.id,
              sequence_number: data.fragment.sequence_number,
              message: `Fragment #${data.fragment.sequence_number} appended successfully.`,
            },
            null,
            2
          ),
        },
      ],
    }
  }

  private async uploadSessionContext(args: Record<string, unknown>): Promise<CallToolResult> {
    const sessionId = args.session_id as string
    const fragments = args.fragments as Array<{
      fragment_type: string
      content: string
      sequence_number: number
      metadata?: Record<string, unknown>
    }>

    const response = await this.client.uploadFragments(sessionId, { fragments })

    if (response.error) {
      return {
        content: [{ type: 'text', text: `Failed to upload context: ${response.error}` }],
        isError: true,
      }
    }

    const data = response.data!
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              count: data.count,
              message: `${data.count} fragments uploaded successfully.`,
            },
            null,
            2
          ),
        },
      ],
    }
  }

  private async generateStructuredContext(
    args: Record<string, unknown>
  ): Promise<CallToolResult> {
    const response = await this.client.generateStructuredContext({
      session_id: args.session_id as string,
      format: args.format as 'standard' | 'detailed' | 'compact' | undefined,
      focus_areas: args.focus_areas as string[] | undefined,
      custom_prompt: args.custom_prompt as string | undefined,
    })

    if (response.error) {
      return {
        content: [{ type: 'text', text: `Failed to generate structured context: ${response.error}` }],
        isError: true,
      }
    }

    const data = response.data!
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              structured_context: data.structured_context,
              message: 'Structured context generated successfully.',
            },
            null,
            2
          ),
        },
      ],
    }
  }

  private async generateArticleDraft(args: Record<string, unknown>): Promise<CallToolResult> {
    const response = await this.client.generateArticleDraft({
      session_id: args.session_id as string,
      article_style: args.article_style as
        | 'tutorial'
        | 'case_study'
        | 'tips'
        | 'deep_dive'
        | 'quick_note'
        | undefined,
      target_audience: args.target_audience as 'beginner' | 'intermediate' | 'advanced' | undefined,
      include_sections: args.include_sections as string[] | undefined,
      tone: args.tone as 'casual' | 'professional' | 'educational' | undefined,
      custom_instructions: args.custom_instructions as string | undefined,
    })

    if (response.error) {
      return {
        content: [{ type: 'text', text: `Failed to generate article draft: ${response.error}` }],
        isError: true,
      }
    }

    const data = response.data!
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              article_draft: data.article_draft,
              message: 'Article draft generated successfully. Preview and edit in the Viblog Web UI.',
            },
            null,
            2
          ),
        },
      ],
    }
  }

  private async listUserSessions(args: Record<string, unknown>): Promise<CallToolResult> {
    const response = await this.client.listSessions({
      status: args.status as 'active' | 'completed' | 'archived' | undefined,
      platform: args.platform as string | undefined,
      limit: args.limit as number | undefined,
      offset: args.offset as number | undefined,
    })

    if (response.error) {
      return {
        content: [{ type: 'text', text: `Failed to list sessions: ${response.error}` }],
        isError: true,
      }
    }

    const data = response.data!
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: true,
              sessions: data.sessions,
              pagination: data.pagination,
            },
            null,
            2
          ),
        },
      ],
    }
  }
}