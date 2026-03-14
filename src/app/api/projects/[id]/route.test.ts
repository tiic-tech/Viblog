import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT, DELETE } from './route'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('/api/projects/[id]', () => {
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

      const request = new Request('http://localhost/api/projects/project-id')
      const params = Promise.resolve({ id: 'project-id' })
      const response = await GET(request, { params } as Parameters<typeof GET>[1])

      expect(response.status).toBe(401)
    })

    it('should return project by id', async () => {
      const mockProject = {
        id: 'project-id',
        name: 'Test Project',
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
                  data: mockProject,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/projects/project-id')
      const params = Promise.resolve({ id: 'project-id' })
      const response = await GET(request, { params } as Parameters<typeof GET>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.project).toEqual(mockProject)
    })

    it('should return 404 for non-existent project', async () => {
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
                  data: null,
                  error: { message: 'Not found' },
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/projects/non-existent')
      const params = Promise.resolve({ id: 'non-existent' })
      const response = await GET(request, { params } as Parameters<typeof GET>[1])
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBeDefined()
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

      const request = new Request('http://localhost/api/projects/project-id', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
      })
      const params = Promise.resolve({ id: 'project-id' })
      const response = await PUT(request, { params } as Parameters<typeof PUT>[1])

      expect(response.status).toBe(401)
    })

    it('should update project', async () => {
      const updatedProject = {
        id: 'project-id',
        name: 'Updated Name',
        slug: 'updated-name',
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
                    data: updatedProject,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/projects/project-id', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name' }),
      })
      const params = Promise.resolve({ id: 'project-id' })
      const response = await PUT(request, { params } as Parameters<typeof PUT>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.project).toEqual(updatedProject)
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

      const request = new Request('http://localhost/api/projects/project-id', { method: 'DELETE' })
      const params = Promise.resolve({ id: 'project-id' })
      const response = await DELETE(request, { params } as Parameters<typeof DELETE>[1])

      expect(response.status).toBe(401)
    })

    it('should delete project', async () => {
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

      const request = new Request('http://localhost/api/projects/project-id', { method: 'DELETE' })
      const params = Promise.resolve({ id: 'project-id' })
      const response = await DELETE(request, { params } as Parameters<typeof DELETE>[1])
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 500 on delete error', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/projects/project-id', { method: 'DELETE' })
      const params = Promise.resolve({ id: 'project-id' })
      const response = await DELETE(request, { params } as Parameters<typeof DELETE>[1])
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Delete failed')
    })
  })
})
