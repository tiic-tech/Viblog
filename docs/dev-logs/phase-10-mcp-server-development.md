# Phase 10 MCP Server Integration: Building the Bridge Between Claude Code and Viblog

**Development Log** - March 17, 2026

## Overview

This article documents the development of Viblog's MCP (Model Context Protocol) Server integration - a critical infrastructure that enables Claude Code to write and publish directly to Viblog. The implementation represents a paradigm shift from indirect, Playwright-based publishing to a direct, protocol-compliant API integration.

## What We Built

### MCP Server npm Package

The centerpiece of Phase 10.4 is `@viblog/mcp-server`, a standalone npm package implementing the MCP protocol with stdio transport. This package serves as the bridge between Claude Code's tool system and Viblog's backend APIs.

```
Claude Code
    |
    | stdio (JSON-RPC 2.0)
    v
viblog-mcp-server (npm package)
    |
    | HTTP REST
    v
Viblog Backend APIs
|-- POST /api/vibe-sessions
|-- POST /api/vibe-sessions/[id]/fragments
|-- POST /api/vibe-sessions/generate-structured-context
|-- POST /api/vibe-sessions/generate-article-draft
```

### Dual Authentication System

A critical architectural decision was implementing dual authentication to support both web UI sessions and MCP API clients:

1. **Supabase Auth** - Browser sessions via cookies (existing)
2. **MCP API Key** - Token-based auth with `vb_*` prefix tokens (new)

### Six MCP Tools Across Four Layers

The MCP server exposes six tools organized into functional layers:

| Layer | Tool | Purpose |
|-------|------|---------|
| Data Collection | `create_vibe_session` | Start recording coding sessions |
| Data Collection | `append_session_context` | Incrementally add context during sessions |
| Data Collection | `upload_session_context` | Batch upload complete session data |
| Structured Processing | `generate_structured_context` | AI-powered extraction of problems, solutions, learnings |
| Content Generation | `generate_article_draft` | Transform sessions into blog articles |
| Session Management | `list_user_sessions` | View and manage sessions |

## Technical Architecture

### Entry Point with stdio Transport

The MCP server uses stdio transport for communication with Claude Code. This is the standard transport mechanism for MCP servers, providing simplicity and reliability.

```typescript
// packages/viblog-mcp-server/src/index.ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './server.js'

async function main() {
  const server = createServer()
  const transport = new StdioServerTransport()

  await server.connect(transport)

  // Log to stderr (stdout is used for MCP communication)
  console.error('Viblog MCP Server started successfully')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
```

The key insight here is that stdout is reserved for MCP protocol messages (JSON-RPC 2.0), so all logging must go to stderr.

### Server Setup with Request Handlers

The server setup defines two request handlers: one for listing available tools and one for executing tool calls.

```typescript
// packages/viblog-mcp-server/src/server.ts
export function createServer(): Server {
  const config = getServerConfig()
  const client = new ViblogApiClient(config)
  const handler = new ToolHandler(client)

  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: {
        tools: {},
      },
    }
  )

  // Handle tools/list request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: VIBLOG_MCP_TOOLS.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    }
  })

  // Handle tools/call request
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    return handler.handleToolCall(name, args || {})
  })

  return server
}
```

### REST API Client

The API client handles all HTTP communication with the Viblog backend. It uses the native `fetch` API and includes proper error handling.

```typescript
// packages/viblog-mcp-server/src/api/client.ts
export class ViblogApiClient {
  private config: McpServerConfig

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

    const options: RequestInit = { method, headers }

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
}
```

## Dual Authentication System

The dual authentication system allows the same API endpoints to work with both web UI sessions and MCP API keys.

### Token Authentication Middleware

Token validation uses SHA-256 hashing for secure storage. The system supports two token types:

- `vb_*` - MCP API keys (platform-level access)
- `vat_*` - Authorization tokens (user-authorized access)

```typescript
// src/lib/auth/token-auth.ts
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function validateToken(authHeader: string | null): Promise<TokenAuthResult> {
  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(' ')
  const token = parts[1]
  const tokenType = detectTokenType(token)

  const supabase = await createClient()
  const tokenHash = await hashToken(token)

  // Query authorization_tokens table
  const { data, error } = await supabase
    .from('authorization_tokens')
    .select('id, user_id, name, authorized_sources, privacy_level, is_active')
    .eq('token_hash', tokenHash)
    .eq('token_type', 'mcp_api')
    .single()

  // Validate and return context
  // ...
}
```

### Dual Auth Helper

The `dualAuthenticate` function provides a unified authentication interface for API routes.

```typescript
// src/lib/auth/dual-auth.ts
export async function dualAuthenticate(
  request: Request
): Promise<{ success: true; data: DualAuthResult } | { success: false; error: NextResponse }> {
  const supabase = await createClient()

  // 1. Try Supabase Auth (session cookie)
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return {
      success: true,
      data: {
        userId: user.id,
        authMethod: 'session',
      },
    }
  }

  // 2. Try MCP API Key (Authorization header)
  const authHeader = request.headers.get('Authorization')
  const tokenResult = await validateToken(authHeader)

  if (tokenResult.valid && tokenResult.userId) {
    return {
      success: true,
      data: {
        userId: tokenResult.userId,
        authMethod: 'mcp_api',
        tokenContext: {
          userId: tokenResult.userId,
          tokenType: tokenResult.tokenType!,
          sources: tokenResult.authorizedSources!,
          privacyLevel: tokenResult.privacyLevel!,
        },
      },
    }
  }

  // Neither authentication method succeeded
  return {
    success: false,
    error: NextResponse.json(
      { error: 'Unauthorized. Please sign in or provide a valid MCP API key.' },
      { status: 401 }
    ),
  }
}
```

## Tool Definitions

Each MCP tool is defined with a JSON Schema input schema that Claude Code uses for validation and type inference.

```typescript
// packages/viblog-mcp-server/src/tools/index.ts
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
```

## Challenges and Solutions

### Challenge 1: TypeScript Mock Type Errors

**Problem:** CI failed with TypeScript errors in `dual-auth.test.ts`. The mock `TokenAuthResult` objects were missing required `null` properties.

**Root Cause:** The `TokenAuthResult` interface requires all properties to be present, but the test mocks only included the properties being tested.

**Solution:** Added missing `null` properties to all mock objects:

```typescript
// Before (incomplete mock)
const mockTokenResult = {
  valid: true,
  userId: 'user-123',
}

// After (complete mock)
const mockTokenResult: TokenAuthResult = {
  valid: true,
  userId: 'user-123',
  tokenType: 'mcp_api',
  authorizedSources: null,
  privacyLevel: null,
}
```

### Challenge 2: Root TypeScript Config Including Package Files

**Problem:** The root `tsconfig.json` was including files from `packages/viblog-mcp-server/`, but the MCP server's dependencies (like `@modelcontextprotocol/sdk`) were not installed in the root.

**Root Cause:** The root tsconfig had `include: ["**/*.ts"]` which picked up all TypeScript files recursively.

**Solution:** Excluded the packages directory from the root TypeScript config:

```json
{
  "exclude": [
    "node_modules",
    "packages"
  ]
}
```

This ensures the MCP server is compiled independently with its own `tsconfig.json`.

### Challenge 3: Fire-and-Forget last_used_at Tracking

**Design Decision:** We implemented fire-and-forget updates for the `last_used_at` field on tokens.

```typescript
// Update last_used_at asynchronously (fire-and-forget)
supabase
  .from('authorization_tokens')
  .update({ last_used_at: new Date().toISOString() })
  .eq('id', data.id)
  .then(() => {}) // Ignore errors
```

This ensures token usage tracking doesn't block the main request flow, improving response times for API calls.

## Test Results

All 166 tests passed in CI:

- Type check: PASSED
- Build: PASSED
- Tests: 166 passed

The comprehensive test suite covers:
- Token authentication validation
- Dual authentication flow
- API client error handling
- Tool handler responses

## Key Files Changed

| File | Purpose |
|------|---------|
| `packages/viblog-mcp-server/src/index.ts` | Entry point with stdio transport |
| `packages/viblog-mcp-server/src/server.ts` | MCP server setup and handlers |
| `packages/viblog-mcp-server/src/tools/index.ts` | 6 MCP tool definitions |
| `packages/viblog-mcp-server/src/tools/handlers.ts` | Tool execution logic |
| `packages/viblog-mcp-server/src/api/client.ts` | REST API client |
| `packages/viblog-mcp-server/src/types.ts` | Shared TypeScript types |
| `src/lib/auth/token-auth.ts` | Token validation middleware |
| `src/lib/auth/dual-auth.ts` | Dual authentication helper |
| `src/lib/auth/__tests__/dual-auth.test.ts` | Unit tests for dual auth |
| `src/lib/auth/__tests__/token-auth.test.ts` | Unit tests for token auth |

## Next Steps

1. **Configure Claude Code with local package** - Test the integration locally before publishing
2. **Verify create_vibe_session works** - End-to-end test of session creation
3. **Verify session exists in database** - Confirm data persistence
4. **Verify generate_article_draft works** - Test the full content generation pipeline
5. **Publish to npm registry** - Make the package publicly available

## Conclusion

Phase 10.4 successfully established the MCP Server foundation for Viblog. The stdio-based npm package approach provides a clean, standards-compliant integration with Claude Code's tool system. The dual authentication system ensures backward compatibility with the web UI while enabling secure API access for MCP clients.

The implementation follows best practices:
- Clean separation of concerns (server, tools, handlers, client)
- Type-safe TypeScript throughout
- Comprehensive error handling
- Fire-and-forget patterns for non-critical operations
- Proper test coverage

This infrastructure enables the core mission: allowing Claude Code to write and publish directly to Viblog without indirect mechanisms.

---

**PR:** https://github.com/tiic-tech/Viblog/pull/9
**Status:** CI PASSED - Ready for merge
**Branch:** feature/phase10-backend