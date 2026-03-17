/**
 * MCP Server Setup
 *
 * Configures and initializes the MCP server with all tools and capabilities.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { VIBLOG_MCP_TOOLS } from './tools/index.js'
import { ToolHandler } from './tools/handlers.js'
import { ViblogApiClient } from './api/client.js'
import { getServerConfig } from './types.js'

const SERVER_NAME = 'viblog-mcp-server'
const SERVER_VERSION = '1.0.0'

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