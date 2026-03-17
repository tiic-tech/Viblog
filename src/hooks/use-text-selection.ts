'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Text selection information
 */
export interface TextSelection {
  text: string
  range: Range
  rect: DOMRect
  startOffset: number
  endOffset: number
  containerXPath: string | null
}

/**
 * Hook state
 */
interface UseTextSelectionState {
  selection: TextSelection | null
  isSelecting: boolean
}

/**
 * Hook return type
 */
interface UseTextSelectionReturn extends UseTextSelectionState {
  clearSelection: () => void
  restoreSelection: (savedSelection: TextSelection) => boolean
}

/**
 * Generate a simplified XPath for an element
 * This is used to identify where the selection occurred
 */
function getElementXPath(element: Node | null): string | null {
  if (!element) return null

  // For text nodes, get parent element
  const targetElement = element.nodeType === Node.TEXT_NODE ? element.parentElement : element as Element

  if (!targetElement || targetElement.nodeType !== Node.ELEMENT_NODE) return null

  const parts: string[] = []
  let current: Element | null = targetElement as Element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 0
    let sibling: Element | null = current.previousElementSibling

    while (sibling) {
      if (sibling.tagName === current.tagName) {
        index++
      }
      sibling = sibling.previousElementSibling
    }

    const tagName = current.tagName.toLowerCase()
    const part = index > 0 ? `${tagName}[${index}]` : tagName
    parts.unshift(part)

    // Stop at article content container or body
    if (
      current.classList.contains('prose-immersive') ||
      current.tagName === 'ARTICLE' ||
      current.tagName === 'BODY'
    ) {
      break
    }

    current = current.parentElement
  }

  return parts.length > 0 ? '/' + parts.join('/') : null
}

/**
 * Hook for detecting and managing text selection within article content
 *
 * Features:
 * - Detects text selection in prose-immersive containers
 * - Provides selection coordinates for tooltip positioning
 * - Handles selection clearing and restoration
 * - Debounces rapid selection changes
 */
export function useTextSelection(
  containerRef?: React.RefObject<HTMLElement | null>,
  options: {
    minLength?: number
    debounceMs?: number
    enabled?: boolean
  } = {}
): UseTextSelectionReturn {
  const { minLength = 3, debounceMs = 100, enabled = true } = options

  const [state, setState] = useState<UseTextSelectionState>({
    selection: null,
    isSelecting: false,
  })

  // Debounce timer
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const handleSelectionChange = useCallback(() => {
    if (!enabled) return

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set debounced handler
    debounceTimer = setTimeout(() => {
      const sel = window.getSelection()

      // No selection or empty selection
      if (!sel || sel.toString().trim().length === 0) {
        setState((prev) => ({
          ...prev,
          selection: null,
          isSelecting: false,
        }))
        return
      }

      const text = sel.toString().trim()

      // Selection too short
      if (text.length < minLength) {
        setState((prev) => ({
          ...prev,
          selection: null,
          isSelecting: false,
        }))
        return
      }

      // Check if selection is within the container (if specified)
      if (containerRef?.current) {
        const container = containerRef.current
        const anchorNode = sel.anchorNode

        if (anchorNode && !container.contains(anchorNode)) {
          setState((prev) => ({
            ...prev,
            selection: null,
            isSelecting: false,
          }))
          return
        }
      }

      // Check if selection is within prose-immersive
      const anchorNode = sel.anchorNode
      if (anchorNode) {
        let parent = anchorNode.parentElement
        let isWithinProse = false

        while (parent) {
          if (parent.classList.contains('prose-immersive')) {
            isWithinProse = true
            break
          }
          parent = parent.parentElement
        }

        if (!isWithinProse) {
          setState((prev) => ({
            ...prev,
            selection: null,
            isSelecting: false,
          }))
          return
        }
      }

      // Get range and bounding rect
      try {
        const range = sel.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        const selection: TextSelection = {
          text,
          range: range.cloneRange(),
          rect,
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          containerXPath: getElementXPath(range.startContainer),
        }

        setState({
          selection,
          isSelecting: false,
        })
      } catch {
        // Range extraction failed
        setState((prev) => ({
          ...prev,
          selection: null,
          isSelecting: false,
        }))
      }
    }, debounceMs)
  }, [enabled, minLength, debounceMs, containerRef])

  // Track mouse down for isSelecting state
  const handleMouseDown = useCallback(() => {
    if (enabled) {
      setState((prev) => ({ ...prev, isSelecting: true }))
    }
  }, [enabled])

  const handleMouseUp = useCallback(() => {
    if (enabled) {
      setState((prev) => ({ ...prev, isSelecting: false }))
    }
  }, [enabled])

  const clearSelection = useCallback(() => {
    const sel = window.getSelection()
    if (sel) {
      sel.removeAllRanges()
    }
    setState({
      selection: null,
      isSelecting: false,
    })
  }, [])

  const restoreSelection = useCallback((savedSelection: TextSelection): boolean => {
    try {
      const sel = window.getSelection()
      if (!sel) return false

      sel.removeAllRanges()
      sel.addRange(savedSelection.range)

      setState((prev) => ({
        ...prev,
        selection: savedSelection,
      }))

      return true
    } catch {
      return false
    }
  }, [])

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return

    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)

      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [enabled, handleSelectionChange, handleMouseDown, handleMouseUp])

  return {
    ...state,
    clearSelection,
    restoreSelection,
  }
}

export default useTextSelection