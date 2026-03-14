import { vi } from 'vitest'
import { Database } from '@/types/database'

type Article = Database['public']['Tables']['articles']['Row']

export function createMockArticle(overrides?: Partial<Article>): Article {
  return {
    id: 'test-article-id',
    user_id: 'test-user-id',
    project_id: null,
    title: 'Test Article',
    slug: 'test-article',
    content: '<p>Test content</p>',
    excerpt: 'Test excerpt',
    cover_image: null,
    status: 'draft',
    visibility: 'private',
    is_premium: false,
    price: null,
    published_at: null,
    stars_count: 0,
    views_count: 0,
    vibe_platform: null,
    vibe_model: null,
    vibe_prompt: null,
    vibe_ai_response: null,
    vibe_duration_minutes: null,
    created_at: '2026-03-14T00:00:00Z',
    updated_at: '2026-03-14T00:00:00Z',
    ...overrides,
  }
}

export function createMockArticles(count: number): Article[] {
  return Array.from({ length: count }, (_, i) =>
    createMockArticle({
      id: `article-${i + 1}`,
      title: `Article ${i + 1}`,
      slug: `article-${i + 1}`,
    })
  )
}

// Create a published article
export function createMockPublishedArticle(overrides?: Partial<Article>): Article {
  return createMockArticle({
    status: 'published',
    visibility: 'public',
    published_at: '2026-03-14T00:00:00Z',
    ...overrides,
  })
}

// Mock Supabase query chain for articles
export function createMockArticleQuery(options?: {
  articles?: Article[]
  error?: Error | null
}) {
  const mockData = options?.articles ?? [createMockArticle()]
  const mockError = options?.error ?? null

  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: mockData[0], error: mockError }),
    maybeSingle: vi.fn().mockResolvedValue({ data: mockData[0], error: mockError }),
  }
}

// Mock successful article GET response
export function mockArticlesGetSuccess(articles?: Article[]) {
  return {
    data: articles ?? [createMockArticle()],
    error: null,
  }
}

// Mock successful article POST response
export function mockArticlesPostSuccess(article?: Article) {
  return {
    data: [article ?? createMockArticle()],
    error: null,
  }
}

// Mock article error response
export function mockArticlesError(message = 'Database error') {
  return {
    data: null,
    error: { message },
  }
}