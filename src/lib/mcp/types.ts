/**
 * MCP Protocol Types
 *
 * JSON-RPC 2.0 types for Model Context Protocol
 * @see https://spec.modelcontextprotocol.io/specification/basic/
 */

// ============================================
// JSON-RPC 2.0 Base Types
// ============================================

export interface JsonRpcRequest {
  jsonrpc: '2.0'
  id: string | number
  method: string
  params?: Record<string, unknown>
}

export interface JsonRpcResponse {
  jsonrpc: '2.0'
  id: string | number
  result?: unknown
  error?: JsonRpcError
}

export interface JsonRpcError {
  code: number
  message: string
  data?: unknown
}

// ============================================
// MCP Error Codes
// ============================================

export const MCP_ERROR_CODES = {
  // JSON-RPC standard errors
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,

  // MCP-specific errors
  SERVER_NOT_INITIALIZED: -32002,
  UNKNOWN_ERROR: -32001,
  CONTENT_TYPE_NOT_SUPPORTED: -32000,
} as const

// ============================================
// MCP Protocol Types
// ============================================

export interface McpServerInfo {
  name: string
  version: string
}

export interface McpCapabilities {
  tools?: {
    listChanged?: boolean
  }
  resources?: {
    subscribe?: boolean
    listChanged?: boolean
  }
  prompts?: {
    listChanged?: boolean
  }
}

export interface McpTool {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export interface McpToolCallResult {
  content: Array<{
    type: 'text'
    text: string
  }>
  isError?: boolean
}

// ============================================
// MCP Request/Response Types
// ============================================

// Initialize
export interface InitializeParams {
  protocolVersion: string
  capabilities: McpCapabilities
  clientInfo: McpServerInfo
}

export interface InitializeResult {
  protocolVersion: string
  capabilities: McpCapabilities
  serverInfo: McpServerInfo
}

// List Tools
export interface ListToolsResult {
  tools: McpTool[]
}

// Call Tool
export interface CallToolParams {
  name: string
  arguments?: Record<string, unknown>
}

// List Resources
export interface ListResourcesResult {
  resources: Array<{
    uri: string
    name: string
    description?: string
    mimeType?: string
  }>
}

// Read Resource
export interface ReadResourceParams {
  uri: string
}

export interface ReadResourceResult {
  contents: Array<{
    uri: string
    mimeType?: string
    text?: string
    blob?: string
  }>
}

// ============================================
// MCP Server Configuration
// ============================================

export const MCP_SERVER_INFO: McpServerInfo = {
  name: 'viblog-mcp-server',
  version: '1.0.0',
}

export const MCP_CAPABILITIES: McpCapabilities = {
  tools: {
    listChanged: false,
  },
  resources: {
    subscribe: false,
    listChanged: false,
  },
  prompts: {
    listChanged: false,
  },
}

export const MCP_PROTOCOL_VERSION = '2024-11-05'