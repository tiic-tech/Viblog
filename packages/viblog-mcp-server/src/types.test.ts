/**
 * Tests for Types module
 *
 * Tests configuration and type utilities.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getServerConfig } from './types.js'

describe('types module', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getServerConfig', () => {
    it('should return config when both env vars are set', () => {
      process.env.VIBLOG_API_URL = 'https://api.viblog.app'
      process.env.VIBLOG_API_KEY = 'test-api-key'

      const config = getServerConfig()

      expect(config.apiUrl).toBe('https://api.viblog.app')
      expect(config.apiKey).toBe('test-api-key')
    })

    it('should throw error when VIBLOG_API_URL is missing', () => {
      delete process.env.VIBLOG_API_URL
      process.env.VIBLOG_API_KEY = 'test-key'

      expect(() => getServerConfig()).toThrow('VIBLOG_API_URL environment variable is required')
    })

    it('should throw error when VIBLOG_API_KEY is missing', () => {
      process.env.VIBLOG_API_URL = 'https://api.viblog.app'
      delete process.env.VIBLOG_API_KEY

      expect(() => getServerConfig()).toThrow('VIBLOG_API_KEY environment variable is required')
    })

    it('should throw error when both env vars are missing', () => {
      delete process.env.VIBLOG_API_URL
      delete process.env.VIBLOG_API_KEY

      expect(() => getServerConfig()).toThrow()
    })
  })
})