import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('/api/articles', () => {
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

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return articles for authenticated user', async () => {
      const mockArticles = [
        { id: '1', title: 'Article 1', user_id: 'user-id' },
        { id: '2', title: 'Article 2', user_id: 'user-id' },
      ]

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockArticles,
                error: null,
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.articles).toEqual(mockArticles)
    })
  })

  describe('POST', () => {
    it('should return 401 for unauthenticated user', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should create a new article', async () => {
      const newArticle = {
        id: 'new-id',
        title: 'New Article',
        slug: 'new-article',
        user_id: 'user-id',
        status: 'draft',
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: newArticle,
                error: null,
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Article',
          content: '<p>Content</p>',
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.article).toEqual(newArticle)
    })

    it('should return 500 on database error', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Insert failed' },
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/articles', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Insert failed')
    })
  })
})