/**
 * MCP Tool Handlers
 *
 * Implements the execution logic for each MCP tool with
 * structured validation and error handling.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { ViblogApiClient } from '../api/client.js'
import { ValidationError, ApiError, toMcpError, isMcpError } from '../errors.js'
import {
  validateCreateSessionInput,
  validateAppendSessionContextInput,
  validateUploadSessionContextInput,
  validateGenerateStructuredContextInput,
  validateGenerateArticleDraftInput,
  validateListUserSessionsInput,
} from '../validation.js'

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
          return this.createErrorResponse(`Unknown tool: ${name}`)
      }
    } catch (err) {
      return this.handleError(err)
    }
  }

  // ============================================
  // Error Response Helpers
  // ============================================

  private handleError(err: unknown): CallToolResult {
    const mcpError = toMcpError(err)
    return this.createErrorResponse(mcpError.toUserMessage(), mcpError.toJSON())
  }

  private createErrorResponse(message: string, details?: unknown): CallToolResult {
    return {
      content: [{ type: 'text', text: message }],
      isError: true,
      _meta: details,
    }
  }

  private createSuccessResponse(data: unknown): CallToolResult {
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    }
  }

  // ============================================
  // Tool Implementations
  // ============================================

  private async createVibeSession(args: Record<string, unknown>): Promise<CallToolResult> {
    const validation = validateCreateSessionInput(args)
    if (!validation.success) {
      throw new ValidationError(validation.error, validation.details)
    }

    const response = await this.client.createSession(validation.data)

    if (response.error) {
      throw new ApiError(
        `Failed to create session: ${response.error}`,
        response.details ? 400 : 500,
        response.details
      )
    }

    const data = response.data!
    return this.createSuccessResponse({
      success: true,
      session_id: data.session_id,
      session: data.session,
      message: `Session created successfully. Use session_id "${data.session_id}" for subsequent operations.`,
    })
  }

  private async appendSessionContext(args: Record<string, unknown>): Promise<CallToolResult> {
    const validation = validateAppendSessionContextInput(args)
    if (!validation.success) {
      throw new ValidationError(validation.error, validation.details)
    }

    const { session_id, ...fragmentData } = validation.data
    const response = await this.client.appendFragment(session_id, fragmentData)

    if (response.error) {
      throw new ApiError(
        `Failed to append context: ${response.error}`,
        response.details ? 400 : 500,
        response.details
      )
    }

    const data = response.data!
    return this.createSuccessResponse({
      success: true,
      fragment_id: data.fragment.id,
      sequence_number: data.fragment.sequence_number,
      message: `Fragment #${data.fragment.sequence_number} appended successfully.`,
    })
  }

  private async uploadSessionContext(args: Record<string, unknown>): Promise<CallToolResult> {
    const validation = validateUploadSessionContextInput(args)
    if (!validation.success) {
      throw new ValidationError(validation.error, validation.details)
    }

    const { session_id, fragments } = validation.data
    const response = await this.client.uploadFragments(session_id, { fragments })

    if (response.error) {
      throw new ApiError(
        `Failed to upload context: ${response.error}`,
        response.details ? 400 : 500,
        response.details
      )
    }

    const data = response.data!
    return this.createSuccessResponse({
      success: true,
      count: data.count,
      message: `${data.count} fragments uploaded successfully.`,
    })
  }

  private async generateStructuredContext(
    args: Record<string, unknown>
  ): Promise<CallToolResult> {
    const validation = validateGenerateStructuredContextInput(args)
    if (!validation.success) {
      throw new ValidationError(validation.error, validation.details)
    }

    const response = await this.client.generateStructuredContext(validation.data)

    if (response.error) {
      throw new ApiError(
        `Failed to generate structured context: ${response.error}`,
        response.details ? 400 : 500,
        response.details
      )
    }

    const data = response.data!
    return this.createSuccessResponse({
      success: true,
      structured_context: data.structured_context,
      message: 'Structured context generated successfully.',
    })
  }

  private async generateArticleDraft(args: Record<string, unknown>): Promise<CallToolResult> {
    const validation = validateGenerateArticleDraftInput(args)
    if (!validation.success) {
      throw new ValidationError(validation.error, validation.details)
    }

    const response = await this.client.generateArticleDraft(validation.data)

    if (response.error) {
      throw new ApiError(
        `Failed to generate article draft: ${response.error}`,
        response.details ? 400 : 500,
        response.details
      )
    }

    const data = response.data!
    return this.createSuccessResponse({
      success: true,
      article_draft: data.article_draft,
      message: 'Article draft generated successfully. Preview and edit in the Viblog Web UI.',
    })
  }

  private async listUserSessions(args: Record<string, unknown>): Promise<CallToolResult> {
    const validation = validateListUserSessionsInput(args)
    if (!validation.success) {
      throw new ValidationError(validation.error, validation.details)
    }

    const response = await this.client.listSessions(validation.data)

    if (response.error) {
      throw new ApiError(
        `Failed to list sessions: ${response.error}`,
        response.details ? 400 : 500,
        response.details
      )
    }

    const data = response.data!
    return this.createSuccessResponse({
      success: true,
      sessions: data.sessions,
      pagination: data.pagination,
    })
  }
}