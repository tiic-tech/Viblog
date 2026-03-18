import { useCallback, useEffect, useState } from 'react'

import type { Annotation, DiscussionItem } from '@/types/annotation'

const STORAGE_KEY_PREFIX = 'viblog_annotations_'

interface UseAnnotationsOptions {
  articleId: string
  userId: string
}

interface UseAnnotationsReturn {
  annotations: Annotation[]
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => Annotation | null
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void
  deleteAnnotation: (id: string) => void
  addReply: (annotationId: string, reply: Omit<DiscussionItem, 'id' | 'createdAt'>) => void
  getAnnotationByText: (text: string) => Annotation | undefined
  clearAnnotations: () => void
}

/**
 * Generate a unique ID for annotations and discussion items
 */
const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Hook for managing article annotations
 *
 * This hook extends the highlight system with user comments and discussions.
 * It transforms passive reading into active dialogue, building intellectual
 * presence on every article the user engages with.
 *
 * Soul Mission: "I've been here. I've grown here. This is my intellectual home."
 */
export function useAnnotations({ articleId, userId }: UseAnnotationsOptions): UseAnnotationsReturn {
  const storageKey = `${STORAGE_KEY_PREFIX}${articleId}`

  // Initialize state from localStorage
  const [annotations, setAnnotations] = useState<Annotation[]>(() => {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist annotations to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(storageKey, JSON.stringify(annotations))
    } catch (error) {
      console.error('Failed to persist annotations:', error)
    }
  }, [annotations, storageKey])

  /**
   * Add a new annotation
   * Returns the created annotation or null if duplicate detected
   */
  const addAnnotation = useCallback(
    (annotation: Omit<Annotation, 'id' | 'createdAt'>): Annotation | null => {
      const newAnnotation: Annotation = {
        ...annotation,
        id: generateId('ann'),
        createdAt: new Date().toISOString(),
      }

      // Check for duplicates (same text and offsets)
      setAnnotations((prev) => {
        const isDuplicate = prev.some(
          (existing) =>
            existing.text === annotation.text &&
            existing.startOffset === annotation.startOffset &&
            existing.endOffset === annotation.endOffset
        )

        if (isDuplicate) {
          return prev
        }

        return [...prev, newAnnotation]
      })

      // Re-check for duplicate to return null appropriately
      const isDuplicate = annotations.some(
        (existing) =>
          existing.text === annotation.text &&
          existing.startOffset === annotation.startOffset &&
          existing.endOffset === annotation.endOffset
      )

      return isDuplicate ? null : newAnnotation
    },
    [annotations]
  )

  /**
   * Update an existing annotation
   */
  const updateAnnotation = useCallback((id: string, updates: Partial<Annotation>): void => {
    setAnnotations((prev) =>
      prev.map((annotation) => (annotation.id === id ? { ...annotation, ...updates } : annotation))
    )
  }, [])

  /**
   * Delete an annotation by ID
   */
  const deleteAnnotation = useCallback((id: string): void => {
    setAnnotations((prev) => prev.filter((annotation) => annotation.id !== id))
  }, [])

  /**
   * Add a reply to an annotation's discussion thread
   */
  const addReply = useCallback(
    (annotationId: string, reply: Omit<DiscussionItem, 'id' | 'createdAt'>): void => {
      const newReply: DiscussionItem = {
        ...reply,
        id: generateId('disc'),
        createdAt: new Date().toISOString(),
      }

      setAnnotations((prev) =>
        prev.map((annotation) => {
          if (annotation.id !== annotationId) return annotation

          return {
            ...annotation,
            discussion: [...(annotation.discussion || []), newReply],
          }
        })
      )
    },
    []
  )

  /**
   * Find an annotation by its highlighted text
   */
  const getAnnotationByText = useCallback(
    (text: string): Annotation | undefined => {
      return annotations.find((annotation) => annotation.text === text)
    },
    [annotations]
  )

  /**
   * Clear all annotations for the current article
   */
  const clearAnnotations = useCallback((): void => {
    setAnnotations([])
  }, [])

  return {
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    addReply,
    getAnnotationByText,
    clearAnnotations,
  }
}
