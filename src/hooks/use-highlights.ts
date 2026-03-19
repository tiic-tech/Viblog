'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Stored highlight data (serializable, without Range object)
 */
export interface StoredHighlight {
  id: string
  text: string
  containerXPath: string | null
  startOffset: number
  endOffset: number
  createdAt: string
  color?: 'default' | 'yellow' | 'green' | 'blue' | 'pink'
}

/**
 * Highlight with DOM range for active manipulation
 */
export interface ActiveHighlight extends StoredHighlight {
  range: Range | null
}

/**
 * Hook options
 */
interface UseHighlightsOptions {
  articleId: string
  storageKey?: string
  maxHighlights?: number
}

/**
 * Hook return type
 */
interface UseHighlightsReturn {
  highlights: StoredHighlight[]
  addHighlight: (highlight: Omit<StoredHighlight, 'id' | 'createdAt'>) => StoredHighlight | null
  removeHighlight: (id: string) => void
  clearHighlights: () => void
  getHighlightByText: (text: string) => StoredHighlight | undefined
  isHighlighted: (text: string) => boolean
}

/**
 * Generate unique ID for highlight
 */
function generateId(): string {
  return `hl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Get storage key for article
 */
function getStorageKey(articleId: string, customKey?: string): string {
  return customKey || `viblog_highlights_${articleId}`
}

/**
 * Hook for managing article highlights with localStorage persistence
 *
 * Features:
 * - Persist highlights to localStorage per article
 * - Add, remove, and query highlights
 * - Automatic cleanup of old highlights
 * - Support for multiple highlight colors
 *
 * Usage:
 * ```tsx
 * const { highlights, addHighlight, removeHighlight } = useHighlights({
 *   articleId: 'article-123'
 * })
 * ```
 */
export function useHighlights({
  articleId,
  storageKey,
  maxHighlights = 100,
}: UseHighlightsOptions): UseHighlightsReturn {
  const [highlights, setHighlights] = useState<StoredHighlight[]>([])

  // Load highlights from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const key = getStorageKey(articleId, storageKey)
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored) as StoredHighlight[]
        // Validate and filter valid highlights
        const valid = parsed.filter(
          (h) => h.id && h.text && typeof h.startOffset === 'number' && typeof h.endOffset === 'number'
        )
        setHighlights(valid)
      }
    } catch (error) {
      console.warn('Failed to load highlights:', error)
      setHighlights([])
    }
  }, [articleId, storageKey])

  // Save highlights to localStorage when changed
  useEffect(() => {
    if (typeof window === 'undefined') return

    const key = getStorageKey(articleId, storageKey)
    try {
      localStorage.setItem(key, JSON.stringify(highlights))
    } catch (error) {
      console.warn('Failed to save highlights:', error)
    }
  }, [highlights, articleId, storageKey])

  // Add new highlight
  const addHighlight = useCallback(
    (highlight: Omit<StoredHighlight, 'id' | 'createdAt'>): StoredHighlight | null => {
      // Check for duplicate (same text and offsets)
      const isDuplicate = highlights.some(
        (h) =>
          h.text === highlight.text &&
          h.startOffset === highlight.startOffset &&
          h.endOffset === highlight.endOffset
      )

      if (isDuplicate) return null

      const newHighlight: StoredHighlight = {
        ...highlight,
        id: generateId(),
        createdAt: new Date().toISOString(),
        color: highlight.color || 'default',
      }

      setHighlights((prev) => {
        // Enforce max limit (remove oldest first)
        const updated = [...prev, newHighlight]
        if (updated.length > maxHighlights) {
          return updated.slice(-maxHighlights)
        }
        return updated
      })

      return newHighlight
    },
    [highlights, maxHighlights]
  )

  // Remove highlight by ID
  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
  }, [])

  // Clear all highlights for article
  const clearHighlights = useCallback(() => {
    setHighlights([])
  }, [])

  // Get highlight by exact text match
  const getHighlightByText = useCallback(
    (text: string): StoredHighlight | undefined => {
      return highlights.find((h) => h.text === text)
    },
    [highlights]
  )

  // Check if text is highlighted
  const isHighlighted = useCallback(
    (text: string): boolean => {
      return highlights.some((h) => h.text === text)
    },
    [highlights]
  )

  return {
    highlights,
    addHighlight,
    removeHighlight,
    clearHighlights,
    getHighlightByText,
    isHighlighted,
  }
}

/**
 * Restore a Range from a stored highlight
 * Returns null if restoration fails (DOM changed)
 */
export function restoreRangeFromHighlight(highlight: StoredHighlight, container: Element): Range | null {
  try {
    if (!highlight.containerXPath) return null

    // Find the container element using XPath
    const result = document.evaluate(
      highlight.containerXPath,
      container,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )

    const targetNode = result.singleNodeValue
    if (!targetNode) return null

    // Create range with stored offsets
    const range = document.createRange()

    // Handle text nodes
    const textNode = targetNode.nodeType === Node.TEXT_NODE ? targetNode : targetNode.firstChild

    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null

    const textLength = textNode.textContent?.length || 0
    const startOffset = Math.min(highlight.startOffset, textLength)
    const endOffset = Math.min(highlight.endOffset, textLength)

    range.setStart(textNode, startOffset)
    range.setEnd(textNode, endOffset)

    return range
  } catch {
    return null
  }
}

/**
 * Apply highlights to DOM by wrapping text in mark elements
 */
export function applyHighlightsToDOM(container: Element, highlights: StoredHighlight[]): void {
  // Remove existing highlight markers
  const existingMarks = container.querySelectorAll('mark[data-highlight-id]')
  existingMarks.forEach((mark) => {
    const parent = mark.parentNode
    while (mark.firstChild) {
      parent?.insertBefore(mark.firstChild, mark)
    }
    parent?.removeChild(mark)
  })

  // Apply each highlight
  highlights.forEach((highlight) => {
    const range = restoreRangeFromHighlight(highlight, container)
    if (!range) return

    try {
      const mark = document.createElement('mark')
      mark.setAttribute('data-highlight-id', highlight.id)
      mark.className = getHighlightClassName(highlight.color)
      range.surroundContents(mark)
    } catch {
      // Range spans multiple elements - skip for now
      // Could implement more sophisticated wrapping here
    }
  })
}

/**
 * Get CSS class name for highlight color
 */
function getHighlightClassName(color?: string): string {
  const baseClass = 'bg-accent-primary/20 rounded px-0.5'

  switch (color) {
    case 'yellow':
      return `${baseClass} bg-yellow-200/50 dark:bg-yellow-500/30`
    case 'green':
      return `${baseClass} bg-green-200/50 dark:bg-green-500/30`
    case 'blue':
      return `${baseClass} bg-blue-200/50 dark:bg-blue-500/30`
    case 'pink':
      return `${baseClass} bg-pink-200/50 dark:bg-pink-500/30`
    default:
      return baseClass
  }
}

export default useHighlights