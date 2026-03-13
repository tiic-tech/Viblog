import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton', () => {
  it('should render with default classes', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild

    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('rounded-md')
    expect(skeleton).toHaveClass('bg-primary/10')
  })

  it('should accept custom className', () => {
    const { container } = render(<Skeleton className="h-10 w-10" />)
    const skeleton = container.firstChild

    expect(skeleton).toHaveClass('h-10')
    expect(skeleton).toHaveClass('w-10')
  })

  it('should pass through additional props', () => {
    render(<Skeleton data-testid="custom-skeleton" />)
    expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument()
  })
})