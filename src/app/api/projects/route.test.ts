import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('/api/projects', () => {
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

    it('should return projects for authenticated user', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', user_id: 'user-id' },
        { id: '2', name: 'Project 2', user_id: 'user-id' },
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
                data: mockProjects,
                error: null,
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.projects).toEqual(mockProjects)
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

      const request = new Request('http://localhost/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should create a new project', async () => {
      const newProject = {
        id: 'new-id',
        name: 'New Project',
        slug: 'new-project',
        user_id: 'user-id',
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
                data: newProject,
                error: null,
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Project',
          description: 'Description',
          color: '#6366f1',
        }),
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.project).toEqual(newProject)
    })
  })
})