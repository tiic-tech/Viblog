#!/usr/bin/env node
/**
 * Viblog MCP Server Entry Point
 *
 * Starts the MCP server using stdio transport for Claude Code integration.
 *
 * Configuration:
 * Set the following environment variables:
 * - VIBLOG_API_URL: The base URL of the Viblog API (e.g., https://viblog.tiic.tech)
 * - VIBLOG_API_KEY: Your API key from the Viblog Web UI
 *
 * Usage in Claude Code settings.json:
 * {
 *   "mcpServers": {
 *     "viblog": {
 *       "command": "npx",
 *       "args": ["@viblog/mcp-server"],
 *       "env": {
 *         "VIBLOG_API_URL": "https://viblog.tiic.tech",
 *         "VIBLOG_API_KEY": "vb_xxxxxxxx"
 *       }
 *     }
 *   }
 * }
 */

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