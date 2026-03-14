import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RegisterForm } from './register-form'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render register form with all fields', () => {
    render(<RegisterForm />)

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should have username input with correct type', () => {
    render(<RegisterForm />)

    const usernameInput = screen.getByLabelText(/username/i)
    expect(usernameInput).toHaveAttribute('type', 'text')
  })

  it('should have email input with correct type', () => {
    render(<RegisterForm />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('should have password inputs with correct type', () => {
    render(<RegisterForm />)

    const passwordInput = screen.getByLabelText(/^password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })

  it('should have submit button', () => {
    render(<RegisterForm />)

    const submitButton = screen.getByRole('button', { name: /create account/i })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })
})