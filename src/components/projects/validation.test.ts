import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Define schema locally for testing (same as in component)
const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color').optional(),
})

describe('Project form validation', () => {
  it('should validate correct project data', () => {
    const result = projectSchema.safeParse({
      name: 'My Project',
      description: 'A test project',
      color: '#6366f1',
    })
    expect(result.success).toBe(true)
  })

  it('should validate minimal project data (only name)', () => {
    const result = projectSchema.safeParse({
      name: 'My Project',
    })
    expect(result.success).toBe(true)
  })

  describe('name validation', () => {
    it('should reject empty name', () => {
      const result = projectSchema.safeParse({
        name: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Name is required')
      }
    })

    it('should reject name longer than 50 characters', () => {
      const result = projectSchema.safeParse({
        name: 'a'.repeat(51),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Name too long')
      }
    })

    it('should accept name with 50 characters', () => {
      const result = projectSchema.safeParse({
        name: 'a'.repeat(50),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('description validation', () => {
    it('should reject description longer than 500 characters', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        description: 'a'.repeat(501),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Description too long')
      }
    })

    it('should accept description with 500 characters', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        description: 'a'.repeat(500),
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty description', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        description: '',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('color validation', () => {
    it('should accept valid hex color', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        color: '#FF5733',
      })
      expect(result.success).toBe(true)
    })

    it('should accept lowercase hex color', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        color: '#ff5733',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid color format', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        color: 'red',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Invalid color')
      }
    })

    it('should reject color without #', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        color: 'FF5733',
      })
      expect(result.success).toBe(false)
    })

    it('should reject color with wrong length', () => {
      const result = projectSchema.safeParse({
        name: 'My Project',
        color: '#FFF',
      })
      expect(result.success).toBe(false)
    })
  })
})