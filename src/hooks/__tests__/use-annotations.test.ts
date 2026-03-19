import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Annotation, DiscussionItem } from '@/types/annotation'

import { useAnnotations } from '../use-annotations'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useAnnotations', () => {
  const articleId = 'article-123'
  const userId = 'user-456'

  const mockAnnotation: Omit<Annotation, 'id' | 'createdAt'> = {
    articleId,
    userId,
    text: 'Selected text for annotation',
    containerXPath: '/article/p[1]',
    startOffset: 0,
    endOffset: 10,
    content: 'This is my comment',
    color: 'yellow',
    visibility: 'public',
  }

  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('useAnnotations(articleId, userId)', () => {
    it('should return empty annotations list initially', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))
      expect(result.current.annotations).toEqual([])
    })

    it('should load existing annotations from localStorage', () => {
      const existingAnnotation: Annotation = {
        ...mockAnnotation,
        id: 'ann_existing',
        createdAt: '2026-03-18T00:00:00Z',
      }
      localStorageMock.setItem(
        `viblog_annotations_${articleId}`,
        JSON.stringify([existingAnnotation])
      )

      const { result } = renderHook(() => useAnnotations({ articleId, userId }))
      expect(result.current.annotations).toHaveLength(1)
    })
  })

  describe('addAnnotation(annotation)', () => {
    it('should add new annotation and return it', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      let returnedAnnotation: Annotation | null = null
      act(() => {
        returnedAnnotation = result.current.addAnnotation(mockAnnotation)
      })

      expect(returnedAnnotation).not.toBeNull()
      // Use result.current.annotations[0] which is guaranteed to exist after add
      expect(result.current.annotations[0].id).toMatch(/^ann_/)
      expect(result.current.annotations[0].content).toBe('This is my comment')
      expect(result.current.annotations).toHaveLength(1)
    })

    it('should persist annotation to localStorage', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `viblog_annotations_${articleId}`,
        expect.stringContaining('This is my comment')
      )
    })

    it('should generate unique ID and timestamp', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
        result.current.addAnnotation({ ...mockAnnotation, text: 'Another text' })
      })

      expect(result.current.annotations[0].id).not.toBe(result.current.annotations[1].id)
      expect(result.current.annotations[0].createdAt).toBeDefined()
      expect(result.current.annotations[1].createdAt).toBeDefined()
    })

    it('should prevent duplicate annotations (same text and offsets)', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })

      let duplicate: Annotation | null = null
      act(() => {
        duplicate = result.current.addAnnotation(mockAnnotation)
      })

      expect(duplicate).toBeNull()
      expect(result.current.annotations).toHaveLength(1)
    })
  })

  describe('updateAnnotation(id, updates)', () => {
    it('should update existing annotation', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })

      const annotationId = result.current.annotations[0].id
      act(() => {
        result.current.updateAnnotation(annotationId, { content: 'Updated comment' })
      })

      expect(result.current.annotations[0].content).toBe('Updated comment')
    })

    it('should update visibility', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })

      const annotationId = result.current.annotations[0].id
      act(() => {
        result.current.updateAnnotation(annotationId, { visibility: 'private' })
      })

      expect(result.current.annotations[0].visibility).toBe('private')
    })

    it('should update color', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })

      const annotationId = result.current.annotations[0].id
      act(() => {
        result.current.updateAnnotation(annotationId, { color: 'blue' })
      })

      expect(result.current.annotations[0].color).toBe('blue')
    })

    it('should do nothing if annotation not found', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })

      act(() => {
        result.current.updateAnnotation('non-existent', { content: 'Updated' })
      })

      expect(result.current.annotations).toHaveLength(1)
      expect(result.current.annotations[0].content).toBe('This is my comment')
    })
  })

  describe('deleteAnnotation(id)', () => {
    it('should remove annotation by ID', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })
      const addedId = result.current.annotations[0].id

      act(() => {
        result.current.deleteAnnotation(addedId)
      })

      expect(result.current.annotations).toHaveLength(0)
    })

    it('should update localStorage after deletion', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })
      const addedId = result.current.annotations[0].id

      act(() => {
        result.current.deleteAnnotation(addedId)
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(`viblog_annotations_${articleId}`, '[]')
    })
  })

  describe('addReply(annotationId, reply)', () => {
    it('should add discussion item to annotation', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      let added: Annotation | null = null
      act(() => {
        added = result.current.addAnnotation(mockAnnotation)
      })
      if (!added) throw new Error('Failed to add annotation')

      const reply: Omit<DiscussionItem, 'id' | 'createdAt'> = {
        userId: 'user-789',
        content: 'This is a reply',
      }

      act(() => {
        result.current.addReply(added!.id, reply)
      })

      expect(result.current.annotations[0].discussion).toBeDefined()
      expect(result.current.annotations[0].discussion).toHaveLength(1)
      expect(result.current.annotations[0].discussion?.[0].content).toBe('This is a reply')
    })

    it('should generate unique ID and timestamp for reply', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      let added: Annotation | null = null
      act(() => {
        added = result.current.addAnnotation(mockAnnotation)
      })
      if (!added) throw new Error('Failed to add annotation')

      act(() => {
        result.current.addReply(added!.id, { userId: 'user-789', content: 'Reply 1' })
        result.current.addReply(added!.id, { userId: 'user-abc', content: 'Reply 2' })
      })

      expect(result.current.annotations[0].discussion).toHaveLength(2)
      expect(result.current.annotations[0].discussion?.[0].id).not.toBe(
        result.current.annotations[0].discussion?.[1].id
      )
    })

    it('should do nothing if annotation not found', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addReply('non-existent', { userId: 'user-789', content: 'Reply' })
      })

      expect(result.current.annotations).toHaveLength(0)
    })
  })

  describe('getAnnotationByText(text)', () => {
    it('should find annotation by text', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
      })

      let found: Annotation | undefined
      act(() => {
        found = result.current.getAnnotationByText('Selected text for annotation')
      })

      expect(found).toBeDefined()
      expect(found?.content).toBe('This is my comment')
    })

    it('should return undefined if not found', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      let found: Annotation | undefined
      act(() => {
        found = result.current.getAnnotationByText('non-existent text')
      })

      expect(found).toBeUndefined()
    })
  })

  describe('clearAnnotations()', () => {
    it('should remove all annotations for article', () => {
      const { result } = renderHook(() => useAnnotations({ articleId, userId }))

      act(() => {
        result.current.addAnnotation(mockAnnotation)
        result.current.addAnnotation({ ...mockAnnotation, text: 'Another text' })
      })

      expect(result.current.annotations).toHaveLength(2)

      act(() => {
        result.current.clearAnnotations()
      })

      expect(result.current.annotations).toHaveLength(0)
    })
  })
})
