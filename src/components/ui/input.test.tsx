import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />)

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('should apply type attribute', () => {
    render(<Input type="email" />)

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" />)

    const input = screen.getByRole('textbox')
    expect(input.className).toContain('custom-input')
  })
})