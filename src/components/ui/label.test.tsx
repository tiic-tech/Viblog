import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from './label'

describe('Label', () => {
  it('should render label with text', () => {
    render(<Label>Username</Label>)

    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should apply htmlFor attribute', () => {
    render(<Label htmlFor="username">Username</Label>)

    const label = screen.getByText('Username')
    expect(label).toHaveAttribute('for', 'username')
  })

  it('should apply custom className', () => {
    render(<Label className="custom-label">Custom</Label>)

    const label = screen.getByText('Custom')
    expect(label.className).toContain('custom-label')
  })
})