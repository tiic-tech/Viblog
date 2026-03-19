import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ArticleCardSkeleton, FeedSkeleton } from '@/components/public/feed-skeleton'

describe('ArticleCardSkeleton', () => {
  it('should render skeleton card structure', () => {
    const { container } = render(<ArticleCardSkeleton />)

    // Should have card element with bg-bg-card class
    expect(container.querySelector('[class*="bg-bg-card"]')).toBeInTheDocument()
  })

  it('should render tag placeholders', () => {
    const { container } = render(<ArticleCardSkeleton />)

    // Shimmer variant uses animate-shimmer class
    const skeletons = container.querySelectorAll('.animate-shimmer')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('FeedSkeleton', () => {
  it('should render 6 article card skeletons by default', () => {
    const { container } = render(<FeedSkeleton />)

    // Each card has bg-bg-card class - count those to get accurate card count
    const cards = container.querySelectorAll('[class*="bg-bg-card"]')
    expect(cards).toHaveLength(6)
  })
})
