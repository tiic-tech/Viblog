/**
 * Custom Error Classes for MCP Server
 *
 * Provides structured error handling with error codes,
 * context, and proper serialization for the MCP protocol.
 */

/**
 * Base error class for all MCP Server errors
 */
export abstract class McpServerError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: unknown
  public readonly cause?: Error

  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: unknown,
    cause?: Error
  ) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.cause = cause

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Serialize error for MCP protocol response
   */
  toJSON(): Record<string, unknown> {
    return {
      error: true,
      code: this.code,
      message: this.message,
      details: this.details,
    }
  }

  /**
   * Create a user-friendly error message
   */
  toUserMessage(): string {
    let message = this.message
    if (this.details) {
      message += ` Details: ${JSON.stringify(this.details)}`
    }
    if (this.cause) {
      message += ` Cause: ${this.cause.message}`
    }
    return message
  }
}

/**
 * Configuration Error - Missing or invalid configuration
 */
export class ConfigurationError extends McpServerError {
  constructor(message: string, details?: unknown, cause?: Error) {
    super(message, 'CONFIGURATION_ERROR', 500, details, cause)
  }
}

/**
 * Validation Error - Invalid input parameters
 */
export class ValidationError extends McpServerError {
  constructor(message: string, details?: unknown, cause?: Error) {
    super(message, 'VALIDATION_ERROR', 400, details, cause)
  }
}

/**
 * API Error - Error from the Viblog API
 */
export class ApiError extends McpServerError {
  public readonly httpStatus: number

  constructor(
    message: string,
    httpStatus: number,
    details?: unknown,
    cause?: Error
  ) {
    super(message, 'API_ERROR', httpStatus, details, cause)
    this.httpStatus = httpStatus
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.httpStatus === 429 || this.httpStatus >= 500
  }

  /**
   * Get suggested action for this error
   */
  getSuggestedAction(): string {
    switch (this.httpStatus) {
      case 401:
        return 'Check that your API key is valid and not expired.'
      case 403:
        return 'Check that you have permission to access this resource.'
      case 404:
        return 'Verify that the resource exists and the ID is correct.'
      case 429:
        return 'Wait a moment and try again. Rate limit exceeded.'
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Wait a moment and try again.'
      default:
        return 'Check your request and try again.'
    }
  }

  toUserMessage(): string {
    let message = `${this.message} (HTTP ${this.httpStatus})`
    if (this.details) {
      message += ` Details: ${JSON.stringify(this.details)}`
    }
    message += ` Suggested action: ${this.getSuggestedAction()}`
    return message
  }
}

/**
 * Rate Limit Error - Request rate limit exceeded
 */
export class RateLimitError extends McpServerError {
  public readonly retryAfter?: number

  constructor(message: string, retryAfter?: number, details?: unknown) {
    super(message, 'RATE_LIMIT_ERROR', 429, details)
    this.retryAfter = retryAfter
  }

  toUserMessage(): string {
    let message = this.message
    if (this.retryAfter) {
      message += ` Retry after ${this.retryAfter} seconds.`
    }
    return message
  }
}

/**
 * Network Error - Connection or network failure
 */
export class NetworkError extends McpServerError {
  constructor(message: string, cause?: Error) {
    super(message, 'NETWORK_ERROR', 503, undefined, cause)
  }

  toUserMessage(): string {
    return `Network error: ${this.message}. Check your internet connection and try again.`
  }
}

/**
 * Unknown Error - Fallback for unexpected errors
 */
export class UnknownError extends McpServerError {
  constructor(message: string, cause?: Error) {
    super(message, 'UNKNOWN_ERROR', 500, undefined, cause)
  }
}

/**
 * Helper function to convert any error to McpServerError
 */
export function toMcpError(err: unknown): McpServerError {
  if (err instanceof McpServerError) {
    return err
  }

  if (err instanceof Error) {
    // Check for specific error types
    if (err.message.includes('fetch') || err.message.includes('network')) {
      return new NetworkError(err.message, err)
    }
    return new UnknownError(err.message, err)
  }

  return new UnknownError(String(err))
}

/**
 * Type guard for McpServerError
 */
export function isMcpError(err: unknown): err is McpServerError {
  return err instanceof McpServerError
}