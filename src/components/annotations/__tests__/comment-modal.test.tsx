import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { AnnotationColor, AnnotationVisibility } from '@/types/annotation'

import { CommentModal } from '../comment-modal'

describe('CommentModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    selectedText: 'This is the selected text from the article',
    onSave: mockOnSave,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<CommentModal {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Add Annotation')).toBeInTheDocument()
    })

    it('should not render when isOpen is false', () => {
      render(<CommentModal {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display selected text preview in italic muted style', () => {
      render(<CommentModal {...defaultProps} />)

      const textPreview = screen.getByText(/This is the selected text/)
      expect(textPreview).toBeInTheDocument()
      // Check that it's styled as italic (via className)
      expect(textPreview.className).toMatch(/italic/)
    })
  })

  describe('Comment Input', () => {
    it('should have a textarea for comment input', () => {
      render(<CommentModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Write your comment/)
      expect(textarea).toBeInTheDocument()
    })

    it('should update comment value when typing', () => {
      render(<CommentModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Write your comment/)
      fireEvent.change(textarea, { target: { value: 'My insightful comment' } })

      expect(textarea).toHaveValue('My insightful comment')
    })
  })

  describe('Color Picker', () => {
    it('should show 5 color options', () => {
      render(<CommentModal {...defaultProps} />)

      const colorOptions = screen.getAllByRole('button', { name: /color/i })
      expect(colorOptions).toHaveLength(5)
    })

    it('should have yellow, green, blue, pink, and default color options', () => {
      render(<CommentModal {...defaultProps} />)

      const colors: AnnotationColor[] = ['default', 'yellow', 'green', 'blue', 'pink']
      colors.forEach((color) => {
        expect(screen.getByRole('button', { name: new RegExp(color, 'i') })).toBeInTheDocument()
      })
    })

    it('should select a color when clicked', () => {
      render(<CommentModal {...defaultProps} />)

      const blueButton = screen.getByRole('button', { name: /blue/i })
      fireEvent.click(blueButton)

      // Check that the button has selected state (aria-pressed or visual indicator)
      expect(blueButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Visibility Selector', () => {
    it('should have 3 visibility options', () => {
      render(<CommentModal {...defaultProps} />)

      const visibilityOptions = screen.getAllByRole('radio')
      expect(visibilityOptions).toHaveLength(3)
    })

    it('should have public, private, and followers options', () => {
      render(<CommentModal {...defaultProps} />)

      const visibilities: AnnotationVisibility[] = ['public', 'private', 'followers']
      visibilities.forEach((visibility) => {
        expect(screen.getByLabelText(new RegExp(visibility, 'i'))).toBeInTheDocument()
      })
    })

    it('should default to public visibility', () => {
      render(<CommentModal {...defaultProps} />)

      const publicRadio = screen.getByLabelText(/public/i)
      expect(publicRadio).toBeChecked()
    })
  })

  describe('Actions', () => {
    it('should call onSave with correct data when Save button clicked', () => {
      render(<CommentModal {...defaultProps} />)

      const textarea = screen.getByPlaceholderText(/Write your comment/)
      fireEvent.change(textarea, { target: { value: 'My test comment' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      expect(mockOnSave).toHaveBeenCalledWith({
        content: 'My test comment',
        color: 'default',
        visibility: 'public',
      })
    })

    it('should call onClose when Cancel button clicked', () => {
      render(<CommentModal {...defaultProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when clicking outside the modal', () => {
      render(<CommentModal {...defaultProps} />)

      const overlay = screen.getByRole('dialog').parentElement
      if (overlay) {
        fireEvent.click(overlay)
      }

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should not call onSave if comment is empty', () => {
      render(<CommentModal {...defaultProps} />)

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      expect(mockOnSave).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-labels', () => {
      render(<CommentModal {...defaultProps} />)

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby')
    })

    it('should trap focus within the modal', () => {
      render(<CommentModal {...defaultProps} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      // Focus should be on the textarea initially
      const textarea = screen.getByPlaceholderText(/Write your comment/)
      expect(textarea).toHaveFocus()
    })

    it('should close on Escape key press', () => {
      render(<CommentModal {...defaultProps} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})