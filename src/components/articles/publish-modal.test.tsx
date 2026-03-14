import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PublishModal } from './publish-modal'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe('PublishModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render modal with article title', () => {
    render(
      <PublishModal
        articleId="article-id"
        articleTitle="Test Article"
      />
    )

    expect(screen.getByText(/publish article/i)).toBeInTheDocument()
    expect(screen.getByText('Test Article')).toBeInTheDocument()
  })

  it('should have visibility options', () => {
    render(
      <PublishModal
        articleId="article-id"
        articleTitle="Test Article"
      />
    )

    expect(screen.getByText(/public/i)).toBeInTheDocument()
    expect(screen.getByText(/private/i)).toBeInTheDocument()
    expect(screen.getByText(/unlisted/i)).toBeInTheDocument()
  })

  it('should have publish button', () => {
    render(
      <PublishModal
        articleId="article-id"
        articleTitle="Test Article"
      />
    )

    expect(screen.getByRole('button', { name: /^publish$/i })).toBeInTheDocument()
  })

  it('should have price input for premium content', () => {
    render(
      <PublishModal
        articleId="article-id"
        articleTitle="Test Article"
      />
    )

    expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
  })

  it('should have visibility descriptions', () => {
    render(
      <PublishModal
        articleId="article-id"
        articleTitle="Test Article"
      />
    )

    expect(screen.getByText(/visible to everyone/i)).toBeInTheDocument()
    expect(screen.getByText(/only visible to you/i)).toBeInTheDocument()
    expect(screen.getByText(/accessible via link only/i)).toBeInTheDocument()
  })
})