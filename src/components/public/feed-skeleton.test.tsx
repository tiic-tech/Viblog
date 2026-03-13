import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ArticleCardSkeleton, FeedSkeleton } from '@/components/public/feed-skeleton'

describe('ArticleCardSkeleton', () => {
  it('should render skeleton card structure', () => {
    const { container } = render(<ArticleCardSkeleton />)

    // Should have card element
    expect(container.querySelector('[class*="overflow-hidden"]')).toBeInTheDocument()
  })

  it('should render tag placeholders', () => {
    const { container } = render(<ArticleCardSkeleton />)

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('FeedSkeleton', () => {
  it('should render 6 article card skeletons by default', () => {
    const { container } = render(<FeedSkeleton />)

    // Should render 6 skeleton cards
    const cards = container.querySelectorAll('[class*="overflow-hidden"]')
    expect(cards).toHaveLength(6)
  })
})