/**
 * Structured Logging Utility
 *
 * Provides JSON-formatted logging with:
 * - Request ID tracking for distributed tracing
 * - Performance timing logs
 * - Structured context for easier debugging
 * - Vercel Analytics integration
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  requestId?: string
  duration?: number
  environment: string
  service: string
  context?: LogContext
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Format log entry as JSON string
 */
function formatLogEntry(entry: LogEntry): string {
  return JSON.stringify(entry)
}

/**
 * Get current ISO timestamp
 */
function getTimestamp(): string {
  return new Date().toISOString()
}

/**
 * Get environment name
 */
function getEnvironment(): string {
  return process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
}

/**
 * Service identifier
 */
const SERVICE_NAME = 'viblog-api'

/**
 * Logger class with structured logging capabilities
 */
class Logger {
  private requestId: string | undefined

  /**
   * Set request ID for current context
   */
  setRequestId(requestId: string): void {
    this.requestId = requestId
  }

  /**
   * Get current request ID
   */
  getRequestId(): string | undefined {
    return this.requestId
  }

  /**
   * Clear request ID
   */
  clearRequestId(): void {
    this.requestId = undefined
  }

  /**
   * Create a log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    duration?: number
  ): LogEntry {
    return {
      timestamp: getTimestamp(),
      level,
      message,
      requestId: this.requestId,
      duration,
      environment: getEnvironment(),
      service: SERVICE_NAME,
      context,
    }
  }

  /**
   * Output log to appropriate stream
   */
  private output(entry: LogEntry): void {
    const formatted = formatLogEntry(entry)

    // In production, always use stdout for JSON logs
    // This works with Vercel's log ingestion
    if (entry.level === 'error') {
      console.error(formatted)
    } else if (entry.level === 'warn') {
      console.warn(formatted)
    } else {
      console.log(formatted)
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    if (getEnvironment() === 'development') {
      const entry = this.createEntry('debug', message, context)
      this.output(entry)
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    const entry = this.createEntry('info', message, context)
    this.output(entry)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    const entry = this.createEntry('warn', message, context)
    this.output(entry)
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context }

    if (error instanceof Error) {
      errorContext.errorName = error.name
      errorContext.errorMessage = error.message
      errorContext.errorStack = error.stack
    } else if (error !== undefined) {
      errorContext.error = String(error)
    }

    const entry = this.createEntry('error', message, errorContext)
    this.output(entry)
  }

  /**
   * Time a function or operation
   */
  time<T>(label: string, fn: () => T): T
  time<T>(label: string, fn: () => Promise<T>): Promise<T>
  time<T>(label: string, fn: () => T | Promise<T>): T | Promise<T> {
    const start = Date.now()

    const logDuration = () => {
      const duration = Date.now() - start
      const entry = this.createEntry('info', label, undefined, duration)
      this.output(entry)
    }

    try {
      const result = fn()

      if (result instanceof Promise) {
        return result
          .then((value) => {
            logDuration()
            return value
          })
          .catch((error) => {
            const duration = Date.now() - start
            this.error(`${label} failed`, error, { duration })
            throw error
          })
      }

      logDuration()
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.error(`${label} failed`, error, { duration })
      throw error
    }
  }

  /**
   * Create a timer that returns duration on stop
   */
  startTimer(): () => number {
    const start = Date.now()
    return () => Date.now() - start
  }

  /**
   * Log API request
   */
  apiRequest(
    method: string,
    path: string,
    context?: LogContext
  ): () => void {
    const timer = this.startTimer()

    this.info(`API Request: ${method} ${path}`, {
      ...context,
      method,
      path,
    })

    return () => {
      const duration = timer()
      this.info(`API Response: ${method} ${path}`, {
        ...context,
        method,
        path,
        duration,
      })
    }
  }

  /**
   * Log database operation
   */
  dbOperation(operation: string, table: string, context?: LogContext): void {
    this.debug(`DB Operation: ${operation} on ${table}`, {
      ...context,
      operation,
      table,
      type: 'database',
    })
  }

  /**
   * Log cache operation
   */
  cacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string): void {
    this.debug(`Cache ${operation}`, {
      operation,
      key,
      type: 'cache',
    })
  }

  /**
   * Log authentication event
   */
  authEvent(event: string, success: boolean, context?: LogContext): void {
    this.info(`Auth: ${event}`, {
      ...context,
      event,
      success,
      type: 'auth',
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export class for testing
export { Logger }

/**
 * Utility function to log with context in a scoped manner
 */
export function withLogging<T>(
  requestId: string,
  fn: (log: Logger) => T
): T {
  logger.setRequestId(requestId)
  try {
    return fn(logger)
  } finally {
    logger.clearRequestId()
  }
}

/**
 * Async version of withLogging
 */
export async function withLoggingAsync<T>(
  requestId: string,
  fn: (log: Logger) => Promise<T>
): Promise<T> {
  logger.setRequestId(requestId)
  try {
    return await fn(logger)
  } finally {
    logger.clearRequestId()
  }
}