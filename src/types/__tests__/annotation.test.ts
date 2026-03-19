import { describe, expect, it } from 'vitest'

import type {
  Annotation,
  AnnotationColor,
  AnnotationVisibility,
  DiscussionItem,
} from '../annotation'

describe('Annotation Types', () => {
  describe('AnnotationVisibility', () => {
    it('should allow "public" visibility', () => {
      const visibility: AnnotationVisibility = 'public'
      expect(visibility).toBe('public')
    })

    it('should allow "private" visibility', () => {
      const visibility: AnnotationVisibility = 'private'
      expect(visibility).toBe('private')
    })

    it('should allow "followers" visibility', () => {
      const visibility: AnnotationVisibility = 'followers'
      expect(visibility).toBe('followers')
    })
  })

  describe('AnnotationColor', () => {
    it('should allow default color', () => {
      const color: AnnotationColor = 'default'
      expect(color).toBe('default')
    })

    it('should allow yellow color', () => {
      const color: AnnotationColor = 'yellow'
      expect(color).toBe('yellow')
    })

    it('should allow green color', () => {
      const color: AnnotationColor = 'green'
      expect(color).toBe('green')
    })

    it('should allow blue color', () => {
      const color: AnnotationColor = 'blue'
      expect(color).toBe('blue')
    })

    it('should allow pink color', () => {
      const color: AnnotationColor = 'pink'
      expect(color).toBe('pink')
    })
  })

  describe('Annotation', () => {
    it('should have required fields', () => {
      const annotation: Annotation = {
        id: 'ann_123',
        articleId: 'art_456',
        userId: 'user_789',
        text: 'This is important',
        containerXPath: '/article/p[1]',
        startOffset: 0,
        endOffset: 10,
        content: 'This is my comment',
        color: 'yellow',
        visibility: 'public',
        createdAt: '2026-03-18T00:00:00Z',
      }

      expect(annotation.id).toBe('ann_123')
      expect(annotation.articleId).toBe('art_456')
      expect(annotation.userId).toBe('user_789')
      expect(annotation.text).toBe('This is important')
      expect(annotation.containerXPath).toBe('/article/p[1]')
      expect(annotation.startOffset).toBe(0)
      expect(annotation.endOffset).toBe(10)
      expect(annotation.content).toBe('This is my comment')
      expect(annotation.color).toBe('yellow')
      expect(annotation.visibility).toBe('public')
      expect(annotation.createdAt).toBe('2026-03-18T00:00:00Z')
    })

    it('should allow optional discussion field', () => {
      const annotation: Annotation = {
        id: 'ann_123',
        articleId: 'art_456',
        userId: 'user_789',
        text: 'Selected text',
        containerXPath: '/article/p[1]',
        startOffset: 0,
        endOffset: 10,
        content: 'My thought',
        color: 'default',
        visibility: 'private',
        createdAt: '2026-03-18T00:00:00Z',
        discussion: [
          {
            id: 'disc_1',
            userId: 'user_abc',
            content: 'Reply to comment',
            createdAt: '2026-03-18T01:00:00Z',
          },
        ],
      }

      expect(annotation.discussion).toBeDefined()
      expect(annotation.discussion?.length).toBe(1)
      expect(annotation.discussion?.[0].content).toBe('Reply to comment')
    })

    it('should allow null containerXPath', () => {
      const annotation: Annotation = {
        id: 'ann_123',
        articleId: 'art_456',
        userId: 'user_789',
        text: 'Selected text',
        containerXPath: null,
        startOffset: 0,
        endOffset: 10,
        content: 'Comment',
        color: 'default',
        visibility: 'public',
        createdAt: '2026-03-18T00:00:00Z',
      }

      expect(annotation.containerXPath).toBeNull()
    })
  })

  describe('DiscussionItem', () => {
    it('should have required fields', () => {
      const discussion: DiscussionItem = {
        id: 'disc_123',
        userId: 'user_456',
        content: 'This is a reply',
        createdAt: '2026-03-18T00:00:00Z',
      }

      expect(discussion.id).toBe('disc_123')
      expect(discussion.userId).toBe('user_456')
      expect(discussion.content).toBe('This is a reply')
      expect(discussion.createdAt).toBe('2026-03-18T00:00:00Z')
    })
  })
})