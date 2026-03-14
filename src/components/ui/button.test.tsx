import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('destructive')
  })

  it('should apply size classes', () => {
    render(<Button size="sm">Small</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toMatch(/h-\d+/)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )

    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)

    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })
})
