import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock TipTap editor
const mockEditor = {
  getHTML: vi.fn(() => '<p>Test content</p>'),
  getJSON: vi.fn(() => ({ type: 'doc', content: [] })),
  setContent: vi.fn(),
  commands: {
    setContent: vi.fn(),
  },
  chain: vi.fn(() => ({
    focus: vi.fn(() => ({
      run: vi.fn(),
    })),
    run: vi.fn(),
  })),
  on: vi.fn(() => ({
    off: vi.fn(),
  })),
  off: vi.fn(),
  isEditable: true,
  isActive: vi.fn(() => false),
  can: vi.fn(() => ({
    undo: vi.fn(() => true),
    redo: vi.fn(() => true),
  })),
}

// Import after mocks
import { useEditorState } from '../use-editor-state'

describe('useEditorState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Editor Instance', () => {
    it('should return editor instance', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      expect(result.current.editor).toBe(mockEditor)
    })

    it('should handle null editor gracefully', () => {
      const { result } = renderHook(() => useEditorState({ editor: null }))

      expect(result.current.editor).toBeNull()
    })
  })

  describe('Preview Toggle', () => {
    it('should toggle preview state', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      // Initially preview should be hidden
      expect(result.current.isPreviewVisible).toBe(false)

      // Toggle preview on
      act(() => {
        result.current.togglePreview()
      })
      expect(result.current.isPreviewVisible).toBe(true)

      // Toggle preview off
      act(() => {
        result.current.togglePreview()
      })
      expect(result.current.isPreviewVisible).toBe(false)
    })

    it('should set preview state explicitly', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      act(() => {
        result.current.setPreviewVisible(true)
      })
      expect(result.current.isPreviewVisible).toBe(true)

      act(() => {
        result.current.setPreviewVisible(false)
      })
      expect(result.current.isPreviewVisible).toBe(false)
    })
  })

  describe('TOC Toggle', () => {
    it('should toggle TOC state', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      // Initially TOC should be hidden
      expect(result.current.isTocVisible).toBe(false)

      // Toggle TOC on
      act(() => {
        result.current.toggleToc()
      })
      expect(result.current.isTocVisible).toBe(true)

      // Toggle TOC off
      act(() => {
        result.current.toggleToc()
      })
      expect(result.current.isTocVisible).toBe(false)
    })

    it('should set TOC state explicitly', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      act(() => {
        result.current.setTocVisible(true)
      })
      expect(result.current.isTocVisible).toBe(true)

      act(() => {
        result.current.setTocVisible(false)
      })
      expect(result.current.isTocVisible).toBe(false)
    })
  })

  describe('Content Getter/Setter', () => {
    it('should get content as HTML', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      const content = result.current.getContent()
      expect(mockEditor.getHTML).toHaveBeenCalled()
      expect(content).toBe('<p>Test content</p>')
    })

    it('should get content as JSON', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      const content = result.current.getContent('json')
      expect(mockEditor.getJSON).toHaveBeenCalled()
    })

    it('should set content from string', () => {
      const { result } = renderHook(() => useEditorState({ editor: mockEditor as any }))

      act(() => {
        result.current.setContent('<p>New content</p>')
      })

      expect(mockEditor.commands.setContent).toHaveBeenCalledWith('<p>New content</p>')
    })

    it('should return null when getting content with no editor', () => {
      const { result } = renderHook(() => useEditorState({ editor: null }))

      const content = result.current.getContent()
      expect(content).toBeNull()
    })

    it('should not set content when no editor', () => {
      const { result } = renderHook(() => useEditorState({ editor: null }))

      // Should not throw
      act(() => {
        result.current.setContent('<p>New content</p>')
      })
    })
  })

  describe('Initial State', () => {
    it('should accept initial preview state', () => {
      const { result } = renderHook(() =>
        useEditorState({ editor: mockEditor as any, initialPreviewVisible: true })
      )

      expect(result.current.isPreviewVisible).toBe(true)
    })

    it('should accept initial TOC state', () => {
      const { result } = renderHook(() =>
        useEditorState({ editor: mockEditor as any, initialTocVisible: true })
      )

      expect(result.current.isTocVisible).toBe(true)
    })
  })
})