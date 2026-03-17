import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton', () => {
  describe('pulse variant (default)', () => {
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

  describe('shimmer variant', () => {
    it('should render shimmer variant with correct structure', () => {
      const { container } = render(<Skeleton variant="shimmer" />)
      const skeleton = container.firstChild as HTMLElement

      expect(skeleton).toHaveClass('relative')
      expect(skeleton).toHaveClass('overflow-hidden')
      expect(skeleton).toHaveClass('bg-bg-elevated')
    })

    it('should have shimmer animation element', () => {
      const { container } = render(<Skeleton variant="shimmer" />)
      const skeleton = container.firstChild as HTMLElement
      const shimmerElement = skeleton.querySelector('.animate-shimmer')

      expect(shimmerElement).toBeInTheDocument()
    })

    it('should accept custom className with shimmer', () => {
      const { container } = render(<Skeleton variant="shimmer" className="h-20 w-full" />)
      const skeleton = container.firstChild

      expect(skeleton).toHaveClass('h-20')
      expect(skeleton).toHaveClass('w-full')
    })
  })
})
