import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectForm } from './project-form'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    })),
  })),
}))

describe('ProjectForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render create project form', () => {
    render(<ProjectForm />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('should render edit project form with existing data', () => {
    const project = {
      id: 'project-id',
      name: 'Test Project',
      description: 'Test description',
      color: '#FF5733',
    }

    render(<ProjectForm project={project} />)

    expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
  })

  it('should show update button for edit mode', () => {
    const project = {
      id: 'project-id',
      name: 'Test Project',
      description: null,
      color: null,
    }

    render(<ProjectForm project={project} />)

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
  })

  it('should have cancel button', () => {
    render(<ProjectForm />)

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('should have color input', () => {
    render(<ProjectForm />)

    const colorInputs = screen.getAllByLabelText(/color/i)
    expect(colorInputs.length).toBeGreaterThan(0)
  })
})