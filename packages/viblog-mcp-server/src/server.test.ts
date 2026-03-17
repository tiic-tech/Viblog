/**
 * Tests for MCP Server Setup
 *
 * Tests server creation and request handlers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the SDK before importing server
vi.mock('@modelcontextprotocol/sdk/server/index.js', () => {
  const MockServer = vi.fn().mockImplementation(() => ({
    setRequestHandler: vi.fn(),
  }))
  return { Server: MockServer }
})

vi.mock('@modelcontextprotocol/sdk/types.js', () => ({
  ListToolsRequestSchema: 'list-tools-schema',
  CallToolRequestSchema: 'call-tool-schema',
}))

// Mock dependencies
vi.mock('./types.js', () => ({
  getServerConfig: vi.fn(() => ({
    apiUrl: 'https://test.viblog.app',
    apiKey: 'test-key',
  })),
}))

vi.mock('./api/client.js', () => ({
  ViblogApiClient: vi.fn(),
}))

vi.mock('./tools/handlers.js', () => ({
  ToolHandler: vi.fn().mockImplementation(() => ({
    handleToolCall: vi.fn().mockResolvedValue({
      content: [{ type: 'text', text: '{"success":true}' }],
    }),
  })),
}))

vi.mock('./tools/index.js', () => ({
  VIBLOG_MCP_TOOLS: [
    { name: 'test_tool', description: 'Test tool', inputSchema: { type: 'object' } },
  ],
}))

describe('server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createServer', () => {
    it('should create server instance', async () => {
      const { createServer } = await import('./server.js')
      const server = createServer()

      expect(server).toBeDefined()
      expect(server.setRequestHandler).toBeDefined()
    })

    it('should register handlers for tools/list and tools/call', async () => {
      const { createServer } = await import('./server.js')
      const server = createServer()

      expect(server.setRequestHandler).toHaveBeenCalledTimes(2)
    })
  })
})