/**
 * REST API Client for Viblog Backend
 *
 * Handles all HTTP communication between MCP Server and Viblog APIs
 */

import type {
  McpServerConfig,
  ApiResponse,
  CreateSessionInput,
  CreateSessionResponse,
  AppendFragmentInput,
  AppendFragmentResponse,
  UploadFragmentsInput,
  UploadFragmentsResponse,
  GenerateStructuredContextInput,
  StructuredVibeContext,
  GenerateArticleDraftInput,
  GenerateArticleDraftResponse,
  ListSessionsInput,
  ListSessionsResponse,
  VibeSession,
  SessionFragment,
} from '../types.js'

export class ViblogApiClient {
  private config: McpServerConfig

  constructor(config: McpServerConfig) {
    this.config = config
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.apiUrl}${path}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    }

    const options: RequestInit = {
      method,
      headers,
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (!response.ok) {
        return {
          error: (data as { error?: string }).error || `HTTP ${response.status}`,
          details: (data as { details?: unknown }).details,
        }
      }

      return { success: true, data: data as T }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return { error: errorMessage }
    }
  }

  // ============================================
  // Session Management
  // ============================================

  async createSession(input: CreateSessionInput): Promise<ApiResponse<CreateSessionResponse>> {
    return this.request<CreateSessionResponse>('POST', '/api/vibe-sessions', input)
  }

  async listSessions(input: ListSessionsInput = {}): Promise<ApiResponse<ListSessionsResponse>> {
    const params = new URLSearchParams()
    if (input.status) params.set('status', input.status)
    if (input.platform) params.set('platform', input.platform)
    if (input.limit) params.set('limit', input.limit.toString())
    if (input.offset) params.set('offset', input.offset.toString())

    const query = params.toString()
    return this.request<ListSessionsResponse>('GET', `/api/vibe-sessions${query ? `?${query}` : ''}`)
  }

  async getSession(sessionId: string): Promise<ApiResponse<{ session: VibeSession }>> {
    // Note: This endpoint may need to be added to the backend
    return this.request<{ session: VibeSession }>('GET', `/api/vibe-sessions/${sessionId}`)
  }

  // ============================================
  // Fragment Management
  // ============================================

  async appendFragment(
    sessionId: string,
    input: AppendFragmentInput
  ): Promise<ApiResponse<AppendFragmentResponse>> {
    return this.request<AppendFragmentResponse>(
      'POST',
      `/api/vibe-sessions/${sessionId}/fragments`,
      input
    )
  }

  async uploadFragments(
    sessionId: string,
    input: UploadFragmentsInput
  ): Promise<ApiResponse<UploadFragmentsResponse>> {
    return this.request<UploadFragmentsResponse>(
      'PUT',
      `/api/vibe-sessions/${sessionId}/fragments`,
      input
    )
  }

  async listFragments(sessionId: string): Promise<ApiResponse<{ fragments: SessionFragment[] }>> {
    return this.request<{ fragments: SessionFragment[] }>(
      'GET',
      `/api/vibe-sessions/${sessionId}/fragments`
    )
  }

  // ============================================
  // Structured Context Generation
  // ============================================

  async generateStructuredContext(
    input: GenerateStructuredContextInput
  ): Promise<ApiResponse<{ success: boolean; structured_context: StructuredVibeContext }>> {
    return this.request<{ success: boolean; structured_context: StructuredVibeContext }>(
      'POST',
      '/api/vibe-sessions/generate-structured-context',
      input
    )
  }

  // ============================================
  // Article Draft Generation
  // ============================================

  async generateArticleDraft(
    input: GenerateArticleDraftInput
  ): Promise<ApiResponse<GenerateArticleDraftResponse>> {
    return this.request<GenerateArticleDraftResponse>(
      'POST',
      '/api/vibe-sessions/generate-article-draft',
      input
    )
  }
}