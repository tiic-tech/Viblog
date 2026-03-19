import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Annotation } from '@/types/annotation'

import { AnnotationSidebar } from '../annotation-sidebar'

// Mock scrollIntoView
const mockScrollIntoView = vi.fn()
HTMLElement.prototype.scrollIntoView = mockScrollIntoView

describe('AnnotationSidebar', () => {
  const mockAnnotations: Annotation[] = [
    {
      id: 'ann_1',
      articleId: 'article-123',
      userId: 'user-456',
      text: 'First selected text',
      containerXPath: '/article/p[1]',
      startOffset: 0,
      endOffset: 10,
      content: 'My first comment',
      color: 'yellow',
      visibility: 'public',
      createdAt: '2026-03-18T00:00:00Z',
    },
    {
      id: 'ann_2',
      articleId: 'article-123',
      userId: 'user-789',
      text: 'Second selected text',
      containerXPath: '/article/p[2]',
      startOffset: 5,
      endOffset: 15,
      content: 'Another comment',
      color: 'blue',
      visibility: 'private',
      createdAt: '2026-03-18T01:00:00Z',
    },
    {
      id: 'ann_3',
      articleId: 'article-123',
      userId: 'user-456',
      text: 'Third selected text',
      containerXPath: '/article/p[3]',
      startOffset: 0,
      endOffset: 5,
      content: 'Public thought',
      color: 'green',
      visibility: 'public',
      createdAt: '2026-03-18T02:00:00Z',
      discussion: [
        {
          id: 'disc_1',
          userId: 'user-789',
          content: 'Reply to thought',
          createdAt: '2026-03-18T03:00:00Z',
        },
      ],
    },
  ]

  const mockOnAnnotationClick = vi.fn()

  const defaultProps = {
    annotations: mockAnnotations,
    currentUserId: 'user-456',
    onAnnotationClick: mockOnAnnotationClick,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with correct width class (w-80)', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const sidebar = screen.getByRole('complementary')
      expect(sidebar).toHaveClass('w-80')
    })

    it('should render all annotations in the list', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      expect(screen.getByText('My first comment')).toBeInTheDocument()
      expect(screen.getByText('Another comment')).toBeInTheDocument()
      expect(screen.getByText('Public thought')).toBeInTheDocument()
    })

    it('should display selected text preview for each annotation', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      expect(screen.getByText(/First selected text/)).toBeInTheDocument()
      expect(screen.getByText(/Second selected text/)).toBeInTheDocument()
      expect(screen.getByText(/Third selected text/)).toBeInTheDocument()
    })

    it('should show discussion count when annotation has replies', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      // The third annotation has 1 discussion item
      const discussionBadge = screen.getByText('1')
      expect(discussionBadge).toBeInTheDocument()
    })
  })

  describe('Color Indicators', () => {
    it('should display color indicator for each annotation', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      // Check that color indicators are present
      const colorIndicators = screen.getAllByTestId(/color-indicator/)
      expect(colorIndicators).toHaveLength(3)
    })
  })

  describe('Click Navigation', () => {
    it('should call onAnnotationClick when clicking an annotation', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const firstAnnotation = screen.getByText('My first comment').closest('button')
      if (firstAnnotation) {
        fireEvent.click(firstAnnotation)
      }

      expect(mockOnAnnotationClick).toHaveBeenCalledWith(mockAnnotations[0])
    })
  })

  describe('Filter by User', () => {
    it('should have a user filter dropdown', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const userFilter = screen.getByLabelText(/filter by user/i)
      expect(userFilter).toBeInTheDocument()
    })

    it('should filter annotations by selected user', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const userFilter = screen.getByLabelText(/filter by user/i)
      fireEvent.change(userFilter, { target: { value: 'user-456' } })

      // Should show only user-456's annotations (2 of them)
      expect(screen.getByText('My first comment')).toBeInTheDocument()
      expect(screen.getByText('Public thought')).toBeInTheDocument()
      expect(screen.queryByText('Another comment')).not.toBeInTheDocument()
    })

    it('should show all annotations when "All users" selected', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const userFilter = screen.getByLabelText(/filter by user/i)
      fireEvent.change(userFilter, { target: { value: 'all' } })

      expect(screen.getByText('My first comment')).toBeInTheDocument()
      expect(screen.getByText('Another comment')).toBeInTheDocument()
      expect(screen.getByText('Public thought')).toBeInTheDocument()
    })
  })

  describe('Filter by Visibility', () => {
    it('should have a visibility filter dropdown', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const visibilityFilter = screen.getByLabelText(/filter by visibility/i)
      expect(visibilityFilter).toBeInTheDocument()
    })

    it('should filter annotations by visibility', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const visibilityFilter = screen.getByLabelText(/filter by visibility/i)
      fireEvent.change(visibilityFilter, { target: { value: 'public' } })

      // Should show only public annotations (2 of them)
      expect(screen.getByText('My first comment')).toBeInTheDocument()
      expect(screen.getByText('Public thought')).toBeInTheDocument()
      expect(screen.queryByText('Another comment')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should display empty state when no annotations', () => {
      render(<AnnotationSidebar {...defaultProps} annotations={[]} />)

      expect(screen.getByText(/No annotations yet/)).toBeInTheDocument()
      expect(
        screen.getByText(/Select text in the article to add your first annotation/)
      ).toBeInTheDocument()
    })

    it('should display empty state when filters result in no matches', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const visibilityFilter = screen.getByLabelText(/filter by visibility/i)
      fireEvent.change(visibilityFilter, { target: { value: 'followers' } })

      expect(screen.getByText(/No annotations match your filters/)).toBeInTheDocument()
    })
  })

  describe('Visibility Indicators', () => {
    it('should show visibility icon for each annotation', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      // Public icon should be visible
      const publicIcons = screen.getAllByTitle(/public/i)
      expect(publicIcons.length).toBeGreaterThan(0)
    })

    it('should show private indicator for private annotations', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      const privateIcons = screen.getAllByTitle(/private/i)
      expect(privateIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Ownership Indicators', () => {
    it('should indicate which annotations belong to current user', () => {
      render(<AnnotationSidebar {...defaultProps} />)

      // user-456 has 2 annotations, should be marked as "yours"
      const yoursLabels = screen.getAllByText(/Yours/)
      expect(yoursLabels).toHaveLength(2)
    })
  })
})
