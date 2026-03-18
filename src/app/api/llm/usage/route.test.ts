import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('/api/llm/usage', () => {
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

      const request = new Request('http://localhost/api/llm/usage')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return usage statistics for authenticated user', async () => {
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
          created_at: '2026-03-18T10:00:00Z',
          llm_providers: { id: 'openai', display_name: 'OpenAI' },
        },
        {
          id: '2',
          provider_id: 'openai',
          model_id: 'gpt-4',
          request_type: 'chat',
          input_tokens: 200,
          output_tokens: 100,
          estimated_cost_usd: 0.01,
          latency_ms: 600,
          status: 'success',
          created_at: '2026-03-18T11:00:00Z',
          llm_providers: { id: 'openai', display_name: 'OpenAI' },
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

      const request = new Request('http://localhost/api/llm/usage?period=month')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.period).toBe('month')
      expect(data.summary.totalRequests).toBe(2)
      expect(data.summary.totalInputTokens).toBe(300)
      expect(data.summary.totalOutputTokens).toBe(150)
      expect(data.summary.totalTokens).toBe(450)
      expect(data.byProvider).toHaveLength(1)
      expect(data.byModel).toHaveLength(1)
    })

    it('should handle custom date range', async () => {
      const mockLogs: unknown[] = []

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
        'http://localhost/api/llm/usage?start_date=2026-01-01&end_date=2026-01-31'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.summary.totalRequests).toBe(0)
    })

    it('should handle different period types', async () => {
      const periods = ['day', 'week', 'month', 'year', 'all']

      for (const period of periods) {
        vi.clearAllMocks()

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
                      data: [],
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          }),
        } as unknown as Awaited<ReturnType<typeof createClient>>)

        const request = new Request(`http://localhost/api/llm/usage?period=${period}`)
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.period).toBe(period)
      }
    })

    it('should calculate by-provider breakdown correctly', async () => {
      const mockLogs = [
        {
          id: '1',
          provider_id: 'openai',
          model_id: 'gpt-4',
          input_tokens: 100,
          output_tokens: 50,
          estimated_cost_usd: 0.005,
          created_at: '2026-03-18T10:00:00Z',
          llm_providers: { id: 'openai', display_name: 'OpenAI' },
        },
        {
          id: '2',
          provider_id: 'anthropic',
          model_id: 'claude-3',
          input_tokens: 200,
          output_tokens: 100,
          estimated_cost_usd: 0.01,
          created_at: '2026-03-18T11:00:00Z',
          llm_providers: { id: 'anthropic', display_name: 'Anthropic' },
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

      const request = new Request('http://localhost/api/llm/usage?period=month')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.byProvider).toHaveLength(2)
      expect(data.byProvider[0].providerName).toBe('Anthropic') // Higher cost first
      expect(data.byProvider[1].providerName).toBe('OpenAI')
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

      const request = new Request('http://localhost/api/llm/usage')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch usage logs')
    })
  })
})
