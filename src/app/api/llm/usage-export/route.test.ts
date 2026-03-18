import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('/api/llm/usage-export', () => {
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

      const request = new Request(
        'http://localhost/api/llm/usage/export?start_date=2026-01-01&end_date=2026-01-31'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 when start_date is missing', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/llm/usage/export?end_date=2026-01-31')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('start_date and end_date are required')
    })

    it('should return 400 when end_date is missing', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request('http://localhost/api/llm/usage/export?start_date=2026-01-01')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('start_date and end_date are required')
    })

    it('should return 400 for invalid date format', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request(
        'http://localhost/api/llm/usage/export?start_date=invalid&end_date=2026-01-31'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid date format. Use ISO format (YYYY-MM-DD)')
    })

    it('should return CSV format by default', async () => {
      const mockLogs = [
        {
          id: '1',
          provider_id: 'openai',
          model_id: 'gpt-4',
          request_type: 'chat',
          input_tokens: 100,
          output_tokens: 50,
          estimated_cost_usd: 0.005,
          latency_ms: 500,
          status: 'success',
          error_message: null,
          created_at: '2026-03-18T10:00:00Z',
          llm_providers: { display_name: 'OpenAI' },
        },
      ]

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockLogs,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request(
        'http://localhost/api/llm/usage/export?start_date=2026-01-01&end_date=2026-01-31'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/csv; charset=utf-8')
      expect(response.headers.get('Content-Disposition')).toContain(
        'attachment; filename="llm-usage-2026-01-01-to-2026-01-31.csv"'
      )

      const text = await response.text()
      expect(text).toContain('Date,Time,Provider,Model')
      expect(text).toContain('OpenAI')
      expect(text).toContain('gpt-4')
    })

    it('should return JSON format when requested', async () => {
      const mockLogs = [
        {
          id: '1',
          provider_id: 'openai',
          model_id: 'gpt-4',
          request_type: 'chat',
          input_tokens: 100,
          output_tokens: 50,
          estimated_cost_usd: 0.005,
          latency_ms: 500,
          status: 'success',
          error_message: null,
          created_at: '2026-03-18T10:00:00Z',
          llm_providers: { display_name: 'OpenAI' },
        },
      ]

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockLogs,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request(
        'http://localhost/api/llm/usage/export?start_date=2026-01-01&end_date=2026-01-31&format=json'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.records).toBe(1)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].model_id).toBe('gpt-4')
    })

    it('should escape CSV fields with special characters', async () => {
      const mockLogs = [
        {
          id: '1',
          provider_id: 'openai',
          model_id: 'gpt-4',
          request_type: 'chat',
          input_tokens: 100,
          output_tokens: 50,
          estimated_cost_usd: 0.005,
          latency_ms: 500,
          status: 'success',
          error_message: 'Error: "test, with commas"',
          created_at: '2026-03-18T10:00:00Z',
          llm_providers: { display_name: 'OpenAI' },
        },
      ]

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: mockLogs,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request(
        'http://localhost/api/llm/usage/export?start_date=2026-01-01&end_date=2026-01-31'
      )
      const response = await GET(request)
      const text = await response.text()

      // The error message contains comma and quotes, should be escaped
      expect(text).toContain('"Error: ""test, with commas"""')
    })

    it('should return 500 on database error', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }),
        },
        from: mockFrom.mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockReturnValue({
                lte: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error' },
                  }),
                }),
              }),
            }),
          }),
        }),
      } as unknown as Awaited<ReturnType<typeof createClient>>)

      const request = new Request(
        'http://localhost/api/llm/usage/export?start_date=2026-01-01&end_date=2026-01-31'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch usage logs')
    })
  })
})