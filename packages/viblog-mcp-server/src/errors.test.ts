/**
 * Tests for Custom Error Classes
 *
 * Tests all error types, serialization, and helper functions.
 */

import { describe, it, expect } from 'vitest'
import {
  McpServerError,
  ConfigurationError,
  ValidationError,
  ApiError,
  RateLimitError,
  NetworkError,
  UnknownError,
  toMcpError,
  isMcpError,
} from './errors.js'

// ============================================
// McpServerError (Base Class)
// ============================================

describe('McpServerError', () => {
  it('should create error with all properties', () => {
    const cause = new Error('Original error')
    // Use named class instead of anonymous to get correct name property
    class TestMcpError extends McpServerError {
      constructor() {
        super('Test error', 'TEST_ERROR', 400, { field: 'value' }, cause)
      }
    }
    const error = new TestMcpError()

    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_ERROR')
    expect(error.statusCode).toBe(400)
    expect(error.details).toEqual({ field: 'value' })
    expect(error.cause).toBe(cause)
    expect(error.name).toBe('TestMcpError')
  })

  it('should serialize to JSON correctly', () => {
    class TestMcpError extends McpServerError {
      constructor() {
        super('Test error', 'TEST_ERROR', 400, { key: 'value' })
      }
    }
    const error = new TestMcpError()

    const json = error.toJSON()

    expect(json).toEqual({
      error: true,
      code: 'TEST_ERROR',
      message: 'Test error',
      details: { key: 'value' },
    })
  })

  it('should create user message with details', () => {
    class TestMcpError extends McpServerError {
      constructor() {
        super('Test error', 'TEST_ERROR', 400, { field: 'test' })
      }
    }
    const error = new TestMcpError()

    const message = error.toUserMessage()

    expect(message).toBe('Test error Details: {"field":"test"}')
  })

  it('should create user message with cause', () => {
    const cause = new Error('Cause message')
    class TestMcpError extends McpServerError {
      constructor() {
        super('Test error', 'TEST_ERROR', 400, undefined, cause)
      }
    }
    const error = new TestMcpError()

    const message = error.toUserMessage()

    expect(message).toBe('Test error Cause: Cause message')
  })

  it('should create user message with details and cause', () => {
    const cause = new Error('Cause message')
    class TestMcpError extends McpServerError {
      constructor() {
        super('Test error', 'TEST_ERROR', 400, { key: 'value' }, cause)
      }
    }
    const error = new TestMcpError()

    const message = error.toUserMessage()

    expect(message).toBe('Test error Details: {"key":"value"} Cause: Cause message')
  })
})

// ============================================
// ConfigurationError
// ============================================

describe('ConfigurationError', () => {
  it('should create error with correct properties', () => {
    const error = new ConfigurationError('Missing API key')

    expect(error.message).toBe('Missing API key')
    expect(error.code).toBe('CONFIGURATION_ERROR')
    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('ConfigurationError')
  })

  it('should create error with details', () => {
    const error = new ConfigurationError('Invalid config', { envVar: 'API_URL' })

    expect(error.details).toEqual({ envVar: 'API_URL' })
  })

  it('should create error with cause', () => {
    const cause = new Error('File not found')
    const error = new ConfigurationError('Config load failed', undefined, cause)

    expect(error.cause).toBe(cause)
  })
})

// ============================================
// ValidationError
// ============================================

describe('ValidationError', () => {
  it('should create error with correct properties', () => {
    const error = new ValidationError('Invalid input')

    expect(error.message).toBe('Invalid input')
    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('ValidationError')
  })

  it('should create error with validation details', () => {
    const details = {
      issues: [
        { path: ['title'], message: 'Required' },
        { path: ['content'], message: 'Too short' },
      ],
    }
    const error = new ValidationError('Validation failed', details)

    expect(error.details).toEqual(details)
  })
})

// ============================================
// ApiError
// ============================================

describe('ApiError', () => {
  it('should create error with correct properties', () => {
    const error = new ApiError('Request failed', 404)

    expect(error.message).toBe('Request failed')
    expect(error.code).toBe('API_ERROR')
    expect(error.statusCode).toBe(404)
    expect(error.httpStatus).toBe(404)
    expect(error.name).toBe('ApiError')
  })

  it('should create error with details', () => {
    const error = new ApiError('Bad request', 400, { field: 'title' })

    expect(error.details).toEqual({ field: 'title' })
  })

  describe('isRetryable', () => {
    it('should return true for 429', () => {
      const error = new ApiError('Rate limited', 429)
      expect(error.isRetryable()).toBe(true)
    })

    it('should return true for 5xx errors', () => {
      expect(new ApiError('Server error', 500).isRetryable()).toBe(true)
      expect(new ApiError('Bad gateway', 502).isRetryable()).toBe(true)
      expect(new ApiError('Service unavailable', 503).isRetryable()).toBe(true)
      expect(new ApiError('Gateway timeout', 504).isRetryable()).toBe(true)
    })

    it('should return false for 4xx errors (except 429)', () => {
      expect(new ApiError('Bad request', 400).isRetryable()).toBe(false)
      expect(new ApiError('Unauthorized', 401).isRetryable()).toBe(false)
      expect(new ApiError('Forbidden', 403).isRetryable()).toBe(false)
      expect(new ApiError('Not found', 404).isRetryable()).toBe(false)
    })
  })

  describe('getSuggestedAction', () => {
    it('should return correct action for 401', () => {
      const error = new ApiError('Unauthorized', 401)
      expect(error.getSuggestedAction()).toBe('Check that your API key is valid and not expired.')
    })

    it('should return correct action for 403', () => {
      const error = new ApiError('Forbidden', 403)
      expect(error.getSuggestedAction()).toBe('Check that you have permission to access this resource.')
    })

    it('should return correct action for 404', () => {
      const error = new ApiError('Not found', 404)
      expect(error.getSuggestedAction()).toBe('Verify that the resource exists and the ID is correct.')
    })

    it('should return correct action for 429', () => {
      const error = new ApiError('Rate limited', 429)
      expect(error.getSuggestedAction()).toBe('Wait a moment and try again. Rate limit exceeded.')
    })

    it('should return correct action for 500', () => {
      const error = new ApiError('Server error', 500)
      expect(error.getSuggestedAction()).toBe('Server error. Wait a moment and try again.')
    })

    it('should return default action for unknown status', () => {
      const error = new ApiError('Unknown', 418) // I'm a teapot
      expect(error.getSuggestedAction()).toBe('Check your request and try again.')
    })
  })

  describe('toUserMessage', () => {
    it('should include HTTP status and suggested action', () => {
      const error = new ApiError('Not found', 404)

      const message = error.toUserMessage()

      expect(message).toContain('HTTP 404')
      expect(message).toContain('Verify that the resource exists')
    })

    it('should include details when present', () => {
      const error = new ApiError('Bad request', 400, { field: 'title' })

      const message = error.toUserMessage()

      expect(message).toContain('{"field":"title"}')
    })
  })
})

// ============================================
// RateLimitError
// ============================================

describe('RateLimitError', () => {
  it('should create error with correct properties', () => {
    const error = new RateLimitError('Too many requests', 60)

    expect(error.message).toBe('Too many requests')
    expect(error.code).toBe('RATE_LIMIT_ERROR')
    expect(error.statusCode).toBe(429)
    expect(error.retryAfter).toBe(60)
    expect(error.name).toBe('RateLimitError')
  })

  it('should create error without retryAfter', () => {
    const error = new RateLimitError('Rate limit exceeded')

    expect(error.retryAfter).toBeUndefined()
  })

  describe('toUserMessage', () => {
    it('should include retryAfter when present', () => {
      const error = new RateLimitError('Too many requests', 30)

      const message = error.toUserMessage()

      expect(message).toBe('Too many requests Retry after 30 seconds.')
    })

    it('should not include retryAfter when absent', () => {
      const error = new RateLimitError('Rate limit exceeded')

      const message = error.toUserMessage()

      expect(message).toBe('Rate limit exceeded')
    })
  })
})

// ============================================
// NetworkError
// ============================================

describe('NetworkError', () => {
  it('should create error with correct properties', () => {
    const error = new NetworkError('Connection refused')

    expect(error.message).toBe('Connection refused')
    expect(error.code).toBe('NETWORK_ERROR')
    expect(error.statusCode).toBe(503)
    expect(error.name).toBe('NetworkError')
  })

  it('should create error with cause', () => {
    const cause = new Error('ECONNREFUSED')
    const error = new NetworkError('Connection failed', cause)

    expect(error.cause).toBe(cause)
  })

  it('should provide helpful user message', () => {
    const error = new NetworkError('Connection timeout')

    const message = error.toUserMessage()

    expect(message).toBe('Network error: Connection timeout. Check your internet connection and try again.')
  })
})

// ============================================
// UnknownError
// ============================================

describe('UnknownError', () => {
  it('should create error with correct properties', () => {
    const error = new UnknownError('Something went wrong')

    expect(error.message).toBe('Something went wrong')
    expect(error.code).toBe('UNKNOWN_ERROR')
    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('UnknownError')
  })

  it('should create error with cause', () => {
    const cause = new Error('Mystery error')
    const error = new UnknownError('Unknown failure', cause)

    expect(error.cause).toBe(cause)
  })
})

// ============================================
// toMcpError Helper
// ============================================

describe('toMcpError', () => {
  it('should return McpServerError as-is', () => {
    const original = new ValidationError('Test error')
    const result = toMcpError(original)

    expect(result).toBe(original)
  })

  it('should convert Error to UnknownError', () => {
    const error = new Error('Generic error')
    const result = toMcpError(error)

    expect(result).toBeInstanceOf(UnknownError)
    expect(result.message).toBe('Generic error')
    expect(result.cause).toBe(error)
  })

  it('should convert fetch/network errors to NetworkError', () => {
    const fetchError = new Error('fetch failed')
    const result = toMcpError(fetchError)

    expect(result).toBeInstanceOf(NetworkError)
    expect(result.message).toBe('fetch failed')

    const networkError = new Error('network timeout')
    const result2 = toMcpError(networkError)

    expect(result2).toBeInstanceOf(NetworkError)
  })

  it('should convert string to UnknownError', () => {
    const result = toMcpError('Something broke')

    expect(result).toBeInstanceOf(UnknownError)
    expect(result.message).toBe('Something broke')
  })

  it('should convert number to UnknownError', () => {
    const result = toMcpError(42)

    expect(result).toBeInstanceOf(UnknownError)
    expect(result.message).toBe('42')
  })

  it('should convert null to UnknownError', () => {
    const result = toMcpError(null)

    expect(result).toBeInstanceOf(UnknownError)
    expect(result.message).toBe('null')
  })

  it('should convert undefined to UnknownError', () => {
    const result = toMcpError(undefined)

    expect(result).toBeInstanceOf(UnknownError)
    expect(result.message).toBe('undefined')
  })

  it('should convert object to UnknownError', () => {
    const result = toMcpError({ code: 500 })

    expect(result).toBeInstanceOf(UnknownError)
    expect(result.message).toBe('[object Object]')
  })
})

// ============================================
// isMcpError Type Guard
// ============================================

describe('isMcpError', () => {
  it('should return true for McpServerError instances', () => {
    expect(isMcpError(new ConfigurationError('Test'))).toBe(true)
    expect(isMcpError(new ValidationError('Test'))).toBe(true)
    expect(isMcpError(new ApiError('Test', 404))).toBe(true)
    expect(isMcpError(new RateLimitError('Test'))).toBe(true)
    expect(isMcpError(new NetworkError('Test'))).toBe(true)
    expect(isMcpError(new UnknownError('Test'))).toBe(true)
  })

  it('should return false for regular Error', () => {
    expect(isMcpError(new Error('Test'))).toBe(false)
  })

  it('should return false for non-errors', () => {
    expect(isMcpError('error')).toBe(false)
    expect(isMcpError(404)).toBe(false)
    expect(isMcpError(null)).toBe(false)
    expect(isMcpError(undefined)).toBe(false)
    expect(isMcpError({})).toBe(false)
  })
})

// ============================================
// Error Inheritance
// ============================================

describe('Error Inheritance', () => {
  it('all custom errors should be instances of Error', () => {
    expect(new ConfigurationError('Test')).toBeInstanceOf(Error)
    expect(new ValidationError('Test')).toBeInstanceOf(Error)
    expect(new ApiError('Test', 404)).toBeInstanceOf(Error)
    expect(new RateLimitError('Test')).toBeInstanceOf(Error)
    expect(new NetworkError('Test')).toBeInstanceOf(Error)
    expect(new UnknownError('Test')).toBeInstanceOf(Error)
  })

  it('all custom errors should be instances of McpServerError', () => {
    expect(new ConfigurationError('Test')).toBeInstanceOf(McpServerError)
    expect(new ValidationError('Test')).toBeInstanceOf(McpServerError)
    expect(new ApiError('Test', 404)).toBeInstanceOf(McpServerError)
    expect(new RateLimitError('Test')).toBeInstanceOf(McpServerError)
    expect(new NetworkError('Test')).toBeInstanceOf(McpServerError)
    expect(new UnknownError('Test')).toBeInstanceOf(McpServerError)
  })

  it('should have proper stack traces', () => {
    const error = new ValidationError('Test error')

    expect(error.stack).toBeDefined()
    expect(error.stack).toContain('ValidationError')
  })
})