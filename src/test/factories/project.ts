import { vi } from 'vitest'
import { Database } from '@/types/database'

type Project = Database['public']['Tables']['projects']['Row']

export function createMockProject(overrides?: Partial<Project>): Project {
  return {
    id: 'test-project-id',
    user_id: 'test-user-id',
    name: 'Test Project',
    slug: 'test-project',
    description: 'A test project description',
    color: '#6366f1',
    icon: null,
    is_public: false,
    created_at: '2026-03-14T00:00:00Z',
    updated_at: '2026-03-14T00:00:00Z',
    ...overrides,
  }
}

export function createMockProjects(count: number): Project[] {
  return Array.from({ length: count }, (_, i) =>
    createMockProject({
      id: `project-${i + 1}`,
      name: `Project ${i + 1}`,
      slug: `project-${i + 1}`,
    })
  )
}

// Mock Supabase query chain for projects
export function createMockProjectQuery(options?: {
  projects?: Project[]
  error?: Error | null
}) {
  const mockData = options?.projects ?? [createMockProject()]
  const mockError = options?.error ?? null

  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: mockData[0], error: mockError }),
    maybeSingle: vi.fn().mockResolvedValue({ data: mockData[0], error: mockError }),
  }
}

// Mock successful project GET response
export function mockProjectsGetSuccess(projects?: Project[]) {
  return {
    data: projects ?? [createMockProject()],
    error: null,
  }
}

// Mock successful project POST response
export function mockProjectsPostSuccess(project?: Project) {
  return {
    data: [project ?? createMockProject()],
    error: null,
  }
}

// Mock project error response
export function mockProjectsError(message = 'Database error') {
  return {
    data: null,
    error: { message },
  }
}