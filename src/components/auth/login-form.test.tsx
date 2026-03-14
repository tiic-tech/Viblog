import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoginForm } from './login-form'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}))

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form with email and password fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should have email input with correct type', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('should have password input with correct type', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should render forgot password link', () => {
    render(<LoginForm />)

    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument()
  })

  it('should have submit button', () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })
})