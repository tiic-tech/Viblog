import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  EmptyState,
  NoArticlesEmpty,
  NoProjectsEmpty,
  NoSearchResultsEmpty,
  NoActivityEmpty,
} from '@/components/ui/empty-state'
import { FileText, FolderKanban, Search, Inbox } from 'lucide-react'

describe('EmptyState', () => {
  it('should render with icon, title, and description', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No articles"
        description="Write your first article"
      />
    )

    expect(screen.getByText('No articles')).toBeInTheDocument()
    expect(screen.getByText('Write your first article')).toBeInTheDocument()
  })

  it('should render action button with href', () => {
    render(
      <EmptyState
        icon={FileText}
        title="No articles"
        description="Write your first article"
        action={{ label: 'Write Article', href: '/articles/new' }}
      />
    )

    const link = screen.getByRole('link', { name: 'Write Article' })
    expect(link).toHaveAttribute('href', '/articles/new')
  })

  it('should render action button with onClick', () => {
    const handleClick = vi.fn()
    render(
      <EmptyState
        icon={FileText}
        title="No articles"
        description="Write your first article"
        action={{ label: 'Refresh', onClick: handleClick }}
      />
    )

    const button = screen.getByRole('button', { name: 'Refresh' })
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe('Pre-built Empty States', () => {
  it('should render NoArticlesEmpty', () => {
    render(<NoArticlesEmpty />)
    expect(screen.getByText('No articles yet')).toBeInTheDocument()
  })

  it('should render NoProjectsEmpty', () => {
    render(<NoProjectsEmpty />)
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })

  it('should render NoSearchResultsEmpty with query', () => {
    render(<NoSearchResultsEmpty query="test" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText(/test/)).toBeInTheDocument()
  })

  it('should render NoActivityEmpty', () => {
    render(<NoActivityEmpty />)
    expect(screen.getByText('No activity yet')).toBeInTheDocument()
  })
})