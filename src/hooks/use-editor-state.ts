'use client'

import { useState, useCallback } from 'react'
import type { Editor } from '@tiptap/react'

interface UseEditorStateOptions {
  editor: Editor | null
  initialPreviewVisible?: boolean
  initialTocVisible?: boolean
}

interface UseEditorStateReturn {
  // Editor instance
  editor: Editor | null

  // Preview state
  isPreviewVisible: boolean
  togglePreview: () => void
  setPreviewVisible: (visible: boolean) => void

  // TOC state
  isTocVisible: boolean
  toggleToc: () => void
  setTocVisible: (visible: boolean) => void

  // Content getter/setter
  getContent: (format?: 'html' | 'json') => string | object | null
  setContent: (content: string) => void
}

/**
 * Editor State Hook - Managing the Editor's State
 *
 * This hook provides a clean interface for managing editor state,
 * including preview visibility, TOC visibility, and content operations.
 *
 * Soul Mission: Make writing feel like thinking out loud - fluid, supported,
 * inspiring. The editor disappears; only thought remains.
 */
export function useEditorState({
  editor,
  initialPreviewVisible = false,
  initialTocVisible = false,
}: UseEditorStateOptions): UseEditorStateReturn {
  // Preview visibility state
  const [isPreviewVisible, setIsPreviewVisible] = useState(initialPreviewVisible)

  // TOC visibility state
  const [isTocVisible, setIsTocVisible] = useState(initialTocVisible)

  // Toggle preview visibility
  const togglePreview = useCallback(() => {
    setIsPreviewVisible((prev) => !prev)
  }, [])

  // Set preview visibility explicitly
  const setPreviewVisible = useCallback((visible: boolean) => {
    setIsPreviewVisible(visible)
  }, [])

  // Toggle TOC visibility
  const toggleToc = useCallback(() => {
    setIsTocVisible((prev) => !prev)
  }, [])

  // Set TOC visibility explicitly
  const setTocVisible = useCallback((visible: boolean) => {
    setIsTocVisible(visible)
  }, [])

  // Get content from editor
  const getContent = useCallback(
    (format: 'html' | 'json' = 'html'): string | object | null => {
      if (!editor) return null

      if (format === 'json') {
        return editor.getJSON()
      }

      return editor.getHTML()
    },
    [editor]
  )

  // Set content to editor
  const setContent = useCallback(
    (content: string) => {
      if (!editor) return

      editor.commands.setContent(content)
    },
    [editor]
  )

  return {
    // Editor instance
    editor,

    // Preview state
    isPreviewVisible,
    togglePreview,
    setPreviewVisible,

    // TOC state
    isTocVisible,
    toggleToc,
    setTocVisible,

    // Content getter/setter
    getContent,
    setContent,
  }
}