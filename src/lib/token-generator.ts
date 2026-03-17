import crypto from 'crypto'

/**
 * Token Generator Utility
 * Provides secure generation and hashing for MCP API keys and Authorization tokens
 */

// Token prefixes
export const TOKEN_PREFIXES = {
  MCP_API: 'vb_',
  AUTHORIZATION: 'vat_',
} as const

// Token lengths (excluding prefix)
const TOKEN_LENGTH = 32

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const bytes = crypto.randomBytes(length)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length]
  }
  return result
}

/**
 * Generate SHA-256 hash of a token
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Generate MCP API Key
 * Format: vb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (35 characters total)
 */
export function generateMcpApiKey(): { token: string; tokenHash: string; tokenPrefix: string } {
  const randomPart = generateRandomString(TOKEN_LENGTH)
  const token = `${TOKEN_PREFIXES.MCP_API}${randomPart}`
  const tokenHash = hashToken(token)
  const tokenPrefix = token.substring(0, 8) // e.g., "vb_abc12"

  return { token, tokenHash, tokenPrefix }
}

/**
 * Generate Authorization Token
 * Format: vat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (36 characters total)
 */
export function generateAuthorizationToken(): { token: string; tokenHash: string; tokenPrefix: string } {
  const randomPart = generateRandomString(TOKEN_LENGTH)
  const token = `${TOKEN_PREFIXES.AUTHORIZATION}${randomPart}`
  const tokenHash = hashToken(token)
  const tokenPrefix = token.substring(0, 8) // e.g., "vat_abc1"

  return { token, tokenHash, tokenPrefix }
}

/**
 * Mask a token for display
 * Shows first 8 characters and last 4 characters
 */
export function maskToken(token: string): string {
  if (token.length <= 12) return '*'.repeat(token.length)
  const start = token.substring(0, 8)
  const end = token.substring(token.length - 4)
  return `${start}${'*'.repeat(12)}${end}`
}

/**
 * Validate token format
 */
export function isValidTokenFormat(token: string, type: 'mcp_api' | 'authorization'): boolean {
  const prefix = type === 'mcp_api' ? TOKEN_PREFIXES.MCP_API : TOKEN_PREFIXES.AUTHORIZATION
  const expectedLength = type === 'mcp_api' ? 35 : 36

  return (
    token.startsWith(prefix) &&
    token.length === expectedLength &&
    /^[a-zA-Z0-9_]+$/.test(token)
  )
}

/**
 * Extract token prefix for identification
 */
export function extractTokenPrefix(token: string): string {
  return token.substring(0, 8)
}

/**
 * Token generation result type
 */
export interface TokenGenerationResult {
  token: string
  tokenHash: string
  tokenPrefix: string
}