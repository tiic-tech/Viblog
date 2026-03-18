import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Logger, logger, generateRequestId, withLogging, withLoggingAsync } from './logger'

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>
  let testLogger: Logger

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    testLogger = new Logger()
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  describe('generateRequestId', () => {
    it('should generate unique request IDs', () => {
      const id1 = generateRequestId()
      const id2 = generateRequestId()

      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })

  describe('setRequestId / getRequestId / clearRequestId', () => {
    it('should set and get request ID', () => {
      testLogger.setRequestId('test-request-id')
      expect(testLogger.getRequestId()).toBe('test-request-id')
    })

    it('should clear request ID', () => {
      testLogger.setRequestId('test-request-id')
      testLogger.clearRequestId()
      expect(testLogger.getRequestId()).toBeUndefined()
    })
  })

  describe('info', () => {
    it('should log info message as JSON', () => {
      testLogger.info('Test message')

      expect(consoleLogSpy).toHaveBeenCalled()
      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.level).toBe('info')
      expect(parsed.message).toBe('Test message')
      expect(parsed.service).toBe('viblog-api')
      expect(parsed.timestamp).toBeDefined()
    })

    it('should include context in log entry', () => {
      testLogger.info('Test message', { userId: '123', action: 'login' })

      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.context).toEqual({ userId: '123', action: 'login' })
    })

    it('should include request ID when set', () => {
      testLogger.setRequestId('req-123')
      testLogger.info('Test message')

      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.requestId).toBe('req-123')
    })
  })

  describe('warn', () => {
    it('should log warning message as JSON', () => {
      testLogger.warn('Warning message')

      expect(consoleWarnSpy).toHaveBeenCalled()
      const loggedArg = consoleWarnSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.level).toBe('warn')
      expect(parsed.message).toBe('Warning message')
    })
  })

  describe('error', () => {
    it('should log error message as JSON', () => {
      testLogger.error('Error message')

      expect(consoleErrorSpy).toHaveBeenCalled()
      const loggedArg = consoleErrorSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.level).toBe('error')
      expect(parsed.message).toBe('Error message')
    })

    it('should include error details when Error object provided', () => {
      const error = new Error('Test error')
      testLogger.error('Operation failed', error)

      const loggedArg = consoleErrorSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.context.errorName).toBe('Error')
      expect(parsed.context.errorMessage).toBe('Test error')
      expect(parsed.context.errorStack).toBeDefined()
    })

    it('should include stringified error for non-Error objects', () => {
      testLogger.error('Operation failed', 'string error')

      const loggedArg = consoleErrorSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.context.error).toBe('string error')
    })
  })

  describe('debug', () => {
    it('should log debug in development environment', () => {
      vi.stubEnv('NODE_ENV', 'development')

      testLogger.debug('Debug message')

      expect(consoleLogSpy).toHaveBeenCalled()
      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.level).toBe('debug')
      expect(parsed.message).toBe('Debug message')

      vi.unstubAllEnvs()
    })
  })

  describe('time', () => {
    it('should time synchronous function and log duration', () => {
      const result = testLogger.time('operation', () => {
        return 'success'
      })

      expect(result).toBe('success')
      expect(consoleLogSpy).toHaveBeenCalled()

      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.message).toBe('operation')
      expect(parsed.duration).toBeDefined()
      expect(typeof parsed.duration).toBe('number')
    })

    it('should time async function and log duration', async () => {
      const result = await testLogger.time('async-operation', async () => {
        return 'async-success'
      })

      expect(result).toBe('async-success')
      expect(consoleLogSpy).toHaveBeenCalled()

      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.message).toBe('async-operation')
      expect(parsed.duration).toBeDefined()
    })

    it('should log error when function throws', () => {
      expect(() => {
        testLogger.time('failing-operation', () => {
          throw new Error('Operation failed')
        })
      }).toThrow('Operation failed')

      expect(consoleErrorSpy).toHaveBeenCalled()
      const loggedArg = consoleErrorSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.message).toBe('failing-operation failed')
      expect(parsed.context.duration).toBeDefined()
    })
  })

  describe('startTimer', () => {
    it('should return a function that gives elapsed time', () => {
      const stopTimer = testLogger.startTimer()

      // Simulate some work
      const start = Date.now()
      while (Date.now() - start < 5) {
        // Wait at least 5ms
      }

      const duration = stopTimer()
      expect(duration).toBeGreaterThanOrEqual(5)
    })
  })

  describe('apiRequest', () => {
    it('should log request and response with duration', () => {
      const endRequest = testLogger.apiRequest('GET', '/api/users')

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      let loggedArg = consoleLogSpy.mock.calls[0][0]
      let parsed = JSON.parse(loggedArg)
      expect(parsed.message).toBe('API Request: GET /api/users')
      expect(parsed.context.method).toBe('GET')
      expect(parsed.context.path).toBe('/api/users')

      endRequest()

      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
      loggedArg = consoleLogSpy.mock.calls[1][0]
      parsed = JSON.parse(loggedArg)
      expect(parsed.message).toBe('API Response: GET /api/users')
      expect(parsed.context.duration).toBeDefined()
    })
  })

  describe('dbOperation', () => {
    it('should log database operation', () => {
      vi.stubEnv('NODE_ENV', 'development')

      testLogger.dbOperation('SELECT', 'users')

      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.message).toBe('DB Operation: SELECT on users')
      expect(parsed.context.operation).toBe('SELECT')
      expect(parsed.context.table).toBe('users')
      expect(parsed.context.type).toBe('database')

      vi.unstubAllEnvs()
    })
  })

  describe('cacheOperation', () => {
    it('should log cache hit', () => {
      vi.stubEnv('NODE_ENV', 'development')

      testLogger.cacheOperation('hit', 'api_key:abc123')

      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.message).toBe('Cache hit')
      expect(parsed.context.key).toBe('api_key:abc123')
      expect(parsed.context.type).toBe('cache')

      vi.unstubAllEnvs()
    })
  })

  describe('authEvent', () => {
    it('should log authentication event', () => {
      testLogger.authEvent('login', true, { userId: '123' })

      const loggedArg = consoleLogSpy.mock.calls[0][0]
      const parsed = JSON.parse(loggedArg)

      expect(parsed.message).toBe('Auth: login')
      expect(parsed.context.event).toBe('login')
      expect(parsed.context.success).toBe(true)
      expect(parsed.context.type).toBe('auth')
      expect(parsed.context.userId).toBe('123')
    })
  })
})

describe('withLogging', () => {
  it('should set request ID for the duration of the function', () => {
    const result = withLogging('req-456', (log) => {
      expect(log.getRequestId()).toBe('req-456')
      return 'result'
    })

    expect(result).toBe('result')
    expect(logger.getRequestId()).toBeUndefined()
  })
})

describe('withLoggingAsync', () => {
  it('should set request ID for the duration of async function', async () => {
    const result = await withLoggingAsync('req-789', async (log) => {
      expect(log.getRequestId()).toBe('req-789')
      return 'async-result'
    })

    expect(result).toBe('async-result')
    expect(logger.getRequestId()).toBeUndefined()
  })

  it('should clear request ID even if function throws', async () => {
    await expect(
      withLoggingAsync('req-error', async () => {
        throw new Error('Test error')
      })
    ).rejects.toThrow('Test error')

    expect(logger.getRequestId()).toBeUndefined()
  })
})
