import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollProgressIndicator } from '@/components/ui/scroll-progress-indicator'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ className, style, children }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div className={className} style={style} data-testid="motion-div">
        {children}
      </div>
    ),
  },
  useScroll: () => ({
    scrollYProgress: { get: () => 0, on: () => undefined },
  }),
  useSpring: () => ({ get: () => 0, on: () => undefined }),
}))

describe('ScrollProgressIndicator', () => {
  it('should render with default classes', () => {
    const { container } = render(<ScrollProgressIndicator />)
    const indicator = container.firstChild

    expect(indicator).toHaveClass('fixed')
    expect(indicator).toHaveClass('top-0')
    expect(indicator).toHaveClass('left-0')
    expect(indicator).toHaveClass('right-0')
    expect(indicator).toHaveClass('z-50')
    expect(indicator).toHaveClass('h-1')
    expect(indicator).toHaveClass('bg-accent-primary')
  })

  it('should accept custom color class', () => {
    const { container } = render(<ScrollProgressIndicator color="bg-blue-500" />)
    const indicator = container.firstChild

    expect(indicator).toHaveClass('bg-blue-500')
    expect(indicator).not.toHaveClass('bg-accent-primary')
  })

  it('should accept custom height class', () => {
    const { container } = render(<ScrollProgressIndicator height="h-2" />)
    const indicator = container.firstChild

    expect(indicator).toHaveClass('h-2')
    expect(indicator).not.toHaveClass('h-1')
  })

  it('should accept custom className', () => {
    const { container } = render(<ScrollProgressIndicator className="opacity-80" />)
    const indicator = container.firstChild

    expect(indicator).toHaveClass('opacity-80')
  })

  it('should have origin-left for correct scale animation', () => {
    const { container } = render(<ScrollProgressIndicator />)
    const indicator = container.firstChild

    expect(indicator).toHaveClass('origin-left')
  })
})