import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('/api/articles/[id]/publish', () => {
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockFrom = vi.fn()
  })

  describe('POST', () => {
    it('should return 401 for unauthenticated user', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id/publish', {
        method: 'POST',
        body: JSON.stringify({ visibility: 'public' }),
      })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await POST(request, { params } as Parameters<typeof POST>[1])
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should publish article as public', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'article-id', status: 'published', visibility: 'public' },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id/publish', {
        method: 'POST',
        body: JSON.stringify({ visibility: 'public' }),
      })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await POST(request, { params } as Parameters<typeof POST>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.article).toBeDefined()
    })

    it('should publish article as private', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'article-id', status: 'published', visibility: 'private' },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id/publish', {
        method: 'POST',
        body: JSON.stringify({ visibility: 'private' }),
      })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await POST(request, { params } as Parameters<typeof POST>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.article.visibility).toBe('private')
    })

    it('should return 500 on database error', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Update failed' },
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id/publish', {
        method: 'POST',
        body: JSON.stringify({ visibility: 'public' }),
      })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await POST(request, { params } as Parameters<typeof POST>[1])
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Update failed')
    })
  })
})