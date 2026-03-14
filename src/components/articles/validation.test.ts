import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Define schema locally for testing (same as in component)
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string(),
  cover_image: z.string().url('Invalid URL').optional().or(z.literal('')),
  project_id: z.string().optional().or(z.literal('')),
  platform: z.string().optional().or(z.literal('')),
  duration: z.number().min(1).max(480).optional().or(z.nan()),
  model: z.string().max(100).optional().or(z.literal('')),
  original_prompt: z.string().optional().or(z.literal('')),
})

describe('Article form validation', () => {
  it('should validate correct article data', () => {
    const result = articleSchema.safeParse({
      title: 'My Article',
      content: '<p>Article content</p>',
    })
    expect(result.success).toBe(true)
  })

  it('should validate article with all optional fields', () => {
    const result = articleSchema.safeParse({
      title: 'My Article',
      content: '<p>Content</p>',
      cover_image: 'https://example.com/image.png',
      project_id: 'project-123',
      platform: 'cursor',
      duration: 30,
      model: 'claude-3',
      original_prompt: 'Write an article',
    })
    expect(result.success).toBe(true)
  })

  describe('title validation', () => {
    it('should reject empty title', () => {
      const result = articleSchema.safeParse({
        title: '',
        content: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Title is required')
      }
    })

    it('should reject title longer than 100 characters', () => {
      const result = articleSchema.safeParse({
        title: 'a'.repeat(101),
        content: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Title too long')
      }
    })

    it('should accept title with 100 characters', () => {
      const result = articleSchema.safeParse({
        title: 'a'.repeat(100),
        content: '',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('cover_image validation', () => {
    it('should accept valid URL', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        cover_image: 'https://example.com/image.jpg',
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty string for cover_image', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        cover_image: '',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid URL', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        cover_image: 'not-a-url',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Invalid URL')
      }
    })
  })

  describe('duration validation', () => {
    it('should accept valid duration', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        duration: 60,
      })
      expect(result.success).toBe(true)
    })

    it('should accept minimum duration (1)', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        duration: 1,
      })
      expect(result.success).toBe(true)
    })

    it('should accept maximum duration (480)', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        duration: 480,
      })
      expect(result.success).toBe(true)
    })

    it('should reject duration below minimum', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        duration: 0,
      })
      expect(result.success).toBe(false)
    })

    it('should reject duration above maximum', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        duration: 481,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('model validation', () => {
    it('should accept valid model name', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        model: 'claude-3-opus',
      })
      expect(result.success).toBe(true)
    })

    it('should reject model longer than 100 characters', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        model: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('optional fields', () => {
    it('should accept empty strings for optional fields', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        project_id: '',
        platform: '',
        model: '',
        original_prompt: '',
      })
      expect(result.success).toBe(true)
    })

    it('should accept undefined for optional fields', () => {
      const result = articleSchema.safeParse({
        title: 'Article',
        content: '',
        project_id: undefined,
        platform: undefined,
      })
      expect(result.success).toBe(true)
    })
  })
})