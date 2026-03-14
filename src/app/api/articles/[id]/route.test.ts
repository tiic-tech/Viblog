import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('/api/articles/[id]', () => {
  let mockFrom: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockFrom = vi.fn()
  })

  describe('GET', () => {
    it('should return 401 for unauthenticated user', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id')
      const params = Promise.resolve({ id: 'article-id' })
      const response = await GET(request, { params } as Parameters<typeof GET>[1])

      expect(response.status).toBe(401)
    })

    it('should return article by id', async () => {
      const mockArticle = {
        id: 'article-id',
        title: 'Test Article',
        user_id: 'user-id',
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockArticle,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id')
      const params = Promise.resolve({ id: 'article-id' })
      const response = await GET(request, { params } as Parameters<typeof GET>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.article).toEqual(mockArticle)
    })
  })

  describe('PUT', () => {
    it('should return 401 for unauthenticated user', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
      })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await PUT(request, { params } as Parameters<typeof PUT>[1])

      expect(response.status).toBe(401)
    })

    it('should update article', async () => {
      const updatedArticle = {
        id: 'article-id',
        title: 'Updated Title',
        user_id: 'user-id',
      }

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
                    data: updatedArticle,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' }),
      })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await PUT(request, { params } as Parameters<typeof PUT>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.article).toEqual(updatedArticle)
    })
  })

  describe('DELETE', () => {
    it('should return 401 for unauthenticated user', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id', { method: 'DELETE' })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await DELETE(request, { params } as Parameters<typeof DELETE>[1])

      expect(response.status).toBe(401)
    })

    it('should delete article', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles/article-id', { method: 'DELETE' })
      const params = Promise.resolve({ id: 'article-id' })
      const response = await DELETE(request, { params } as Parameters<typeof DELETE>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})