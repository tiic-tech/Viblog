/**
 * Tests for Health Check Endpoints
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/cache', () => ({
  getCacheStats: vi.fn(),
}))

// Import after mocking
import { GET as healthGET } from '@/app/api/health/route'
import { GET as readyGET } from '@/app/api/health/ready/route'
import { GET as liveGET } from '@/app/api/health/live/route'

const mockCreateClient = vi.mocked(await import('@/lib/supabase/server')).createClient
const mockGetCacheStats = vi.mocked(await import('@/lib/cache')).getCacheStats

describe('Health Check Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default healthy cache state
    mockGetCacheStats.mockReturnValue({
      isRedisEnabled: false,
      memoryCacheSize: 0,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET /api/health', () => {
    it('should return degraded status with memory cache (no Redis)', async () => {
      // Mock healthy database
      mockCreateClient.mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

      const response = await healthGET()
      const data = await response.json()

      // With memory cache fallback, status is degraded
      expect(response.status).toBe(200)
      expect(data.status).toBe('degraded')
      expect(data.components.database.status).toBe('healthy')
      expect(data.components.cache.status).toBe('degraded') // Memory fallback
      expect(data.timestamp).toBeDefined()
      expect(data.requestId).toBeDefined()
      expect(data.version).toBeDefined()
      expect(data.uptime).toBeGreaterThanOrEqual(0)
    })

    it('should return unhealthy status when database fails', async () => {
      // Mock database error
      mockCreateClient.mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ error: new Error('Connection failed') }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('unhealthy')
      expect(data.components.database.status).toBe('unhealthy')
    })

    it('should return degraded status with Redis enabled', async () => {
      mockGetCacheStats.mockReturnValue({
        isRedisEnabled: true,
        memoryCacheSize: 10,
      })

      mockCreateClient.mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.components.cache.status).toBe('healthy')
      expect(data.components.cache.details?.mode).toBe('redis')
    })

    it('should handle database connection errors', async () => {
      mockCreateClient.mockRejectedValue(new Error('Database connection failed'))

      const response = await healthGET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.status).toBe('unhealthy')
      expect(data.components.database.status).toBe('unhealthy')
    })

    it('should include latency information', async () => {
      mockCreateClient.mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

      const response = await healthGET()
      const data = await response.json()

      expect(data.components.database.latency).toBeGreaterThanOrEqual(0)
      expect(data.components.cache.latency).toBeGreaterThanOrEqual(0)
    })
  })

  describe('GET /api/health/ready', () => {
    it('should return ready when database is connected', async () => {
      mockCreateClient.mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

      const response = await readyGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ready).toBe(true)
      expect(data.checks.database).toBe(true)
      expect(data.checks.cache).toBe(true)
    })

    it('should return not ready when database fails', async () => {
      mockCreateClient.mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ error: new Error('Failed') }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

      const response = await readyGET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.ready).toBe(false)
      expect(data.checks.database).toBe(false)
    })

    it('should handle database connection errors', async () => {
      mockCreateClient.mockRejectedValue(new Error('Connection refused'))

      const response = await readyGET()
      const data = await response.json()

      expect(response.status).toBe(503)
      expect(data.ready).toBe(false)
      expect(data.checks.database).toBe(false)
    })

    it('should always show cache as ready (memory fallback)', async () => {
      mockCreateClient.mockResolvedValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

      const response = await readyGET()
      const data = await response.json()

      expect(data.checks.cache).toBe(true)
    })
  })

  describe('GET /api/health/live', () => {
    it('should always return alive', async () => {
      const response = await liveGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.alive).toBe(true)
      expect(data.timestamp).toBeDefined()
      expect(data.uptime).toBeGreaterThanOrEqual(0)
    })

    it('should track uptime correctly', async () => {
      const response1 = await liveGET()
      const data1 = await response1.json()

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100))

      const response2 = await liveGET()
      const data2 = await response2.json()

      expect(data2.uptime).toBeGreaterThanOrEqual(data1.uptime)
    })

    it('should not depend on external services', async () => {
      // Even if database and cache fail, liveness should work
      mockCreateClient.mockRejectedValue(new Error('Database down'))
      mockGetCacheStats.mockImplementation(() => {
        throw new Error('Cache error')
      })

      const response = await liveGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.alive).toBe(true)
    })
  })
})
