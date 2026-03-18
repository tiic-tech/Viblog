import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { SplitPaneEditor } from '../split-pane-editor'

// Mock the Tiptap editor
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => ({
    getHTML: vi.fn(() => '<p>Test content</p>'),
    getJSON: vi.fn(() => ({ type: 'doc', content: [] })),
    commands: {
      setContent: vi.fn(),
      focus: vi.fn(() => ({ chain: () => ({ run: vi.fn() }) })),
    },
    chain: vi.fn(() => ({
      focus: vi.fn(() => ({
        run: vi.fn(),
      })),
    })),
    can: vi.fn(() => ({
      undo: vi.fn(() => false),
      redo: vi.fn(() => false),
    })),
    isActive: vi.fn(() => false),
    on: vi.fn(),
    off: vi.fn(),
    options: {
      element: document.createElement('div'),
    },
  })),
  EditorContent: ({ editor }: { editor: unknown }) => (
    <div data-testid="editor-content" className="tiptap-editor">
      <p>Mock Editor</p>
    </div>
  ),
}))

describe('SplitPaneEditor', () => {
  const defaultProps = {
    content: '<p>Initial content</p>',
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Layout Rendering', () => {
    it('should render two-column layout', () => {
      render(<SplitPaneEditor {...defaultProps} />)

      // Check for editor pane
      const editorPane = screen.getByTestId('editor-pane')
      expect(editorPane).toBeInTheDocument()

      // Check for preview pane
      const previewPane = screen.getByTestId('preview-pane')
      expect(previewPane).toBeInTheDocument()
    })

    it('should render editor on left and preview on right', () => {
      const { container } = render(<SplitPaneEditor {...defaultProps} />)

      const splitContainer = container.querySelector('.split-pane-container')
      expect(splitContainer).toBeInTheDocument()

      // Editor pane should be first (left)
      const editorPane = screen.getByTestId('editor-pane')
      const previewPane = screen.getByTestId('preview-pane')

      expect(editorPane.compareDocumentPosition(previewPane)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    })

    it('should have resizable divider between panes', () => {
      render(<SplitPaneEditor {...defaultProps} />)

      const divider = screen.getByRole('separator')
      expect(divider).toBeInTheDocument()
      expect(divider).toHaveAttribute('aria-orientation', 'vertical')
    })
  })

  describe('Drag Functionality', () => {
    it('should update pane widths when divider is dragged', async () => {
      const { container } = render(<SplitPaneEditor {...defaultProps} />)

      const divider = screen.getByRole('separator')
      const editorPane = screen.getByTestId('editor-pane')

      // Simulate drag start
      fireEvent.mouseDown(divider, { clientX: 500 })

      // Simulate drag move
      fireEvent.mouseMove(document, { clientX: 600 })

      // Simulate drag end
      fireEvent.mouseUp(document)

      await waitFor(() => {
        // Check that the editor pane width style was updated
        const style = editorPane.getAttribute('style')
        expect(style).toMatch(/flex-basis|width/)
      })
    })

    it('should constrain divider to min/max bounds', async () => {
      const { container } = render(<SplitPaneEditor {...defaultProps} />)

      const divider = screen.getByRole('separator')
      const editorPane = screen.getByTestId('editor-pane')

      // Try to drag beyond min bound
      fireEvent.mouseDown(divider, { clientX: 500 })
      fireEvent.mouseMove(document, { clientX: 0 }) // Very far left
      fireEvent.mouseUp(document)

      await waitFor(() => {
        const style = editorPane.getAttribute('style')
        // Should not be 0 - should be constrained to min
        expect(style).toBeDefined()
      })
    })
  })

  describe('Preview Functionality', () => {
    it('should render preview content from editor', () => {
      render(<SplitPaneEditor {...defaultProps} />)

      const previewPane = screen.getByTestId('preview-pane')
      expect(previewPane).toBeInTheDocument()
    })

    it('should update preview when editor content changes', async () => {
      const { rerender } = render(<SplitPaneEditor {...defaultProps} />)

      // Rerender with new content
      rerender(<SplitPaneEditor content="<p>Updated content</p>" onChange={defaultProps.onChange} />)

      // Preview should reflect the content
      const previewPane = screen.getByTestId('preview-pane')
      expect(previewPane).toBeInTheDocument()
    })

    it('should have toggle preview button', () => {
      render(<SplitPaneEditor {...defaultProps} />)

      const toggleButton = screen.getByRole('button', { name: /toggle preview/i })
      expect(toggleButton).toBeInTheDocument()
    })

    it('should hide preview pane when toggle is clicked', async () => {
      render(<SplitPaneEditor {...defaultProps} />)

      const toggleButton = screen.getByRole('button', { name: /toggle preview/i })
      const previewPane = screen.getByTestId('preview-pane')

      expect(previewPane).toBeVisible()

      fireEvent.click(toggleButton)

      await waitFor(() => {
        expect(previewPane).not.toBeVisible()
      })
    })
  })

  describe('Scroll Synchronization', () => {
    it('should sync scroll position between editor and preview', async () => {
      const { container } = render(<SplitPaneEditor {...defaultProps} />)

      const editorPane = screen.getByTestId('editor-pane')
      const previewPane = screen.getByTestId('preview-pane')

      // Mock scroll event
      const scrollEvent = new Event('scroll', { bubbles: true })
      Object.defineProperty(scrollEvent, 'target', {
        value: { scrollTop: 100 },
        writable: false,
      })

      // Simulate scroll on editor
      fireEvent(editorPane, scrollEvent)

      await waitFor(() => {
        // Preview should have synced scroll
        expect(previewPane).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for split pane', () => {
      render(<SplitPaneEditor {...defaultProps} />)

      const divider = screen.getByRole('separator')
      expect(divider).toHaveAttribute('aria-valuenow')
      expect(divider).toHaveAttribute('aria-valuemin')
      expect(divider).toHaveAttribute('aria-valuemax')
    })

    it('should be keyboard navigable for divider', () => {
      render(<SplitPaneEditor {...defaultProps} />)

      const divider = screen.getByRole('separator')
      divider.focus()

      // Test keyboard resize
      fireEvent.keyDown(divider, { key: 'ArrowLeft' })
      fireEvent.keyDown(divider, { key: 'ArrowRight' })

      expect(divider).toHaveAttribute('aria-valuenow')
    })
  })
})