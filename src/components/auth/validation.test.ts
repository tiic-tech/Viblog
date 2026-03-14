import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Define schemas locally for testing (same as in components)
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

describe('Login form validation', () => {
  it('should validate correct email and password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Invalid email address')
    }
  })

  it('should reject password shorter than 8 characters', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'pass',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Password must be at least 8 characters')
    }
  })

  it('should reject empty email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('Register form validation', () => {
  it('should validate correct registration data', () => {
    const result = registerSchema.safeParse({
      username: 'johndoe',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    })
    expect(result.success).toBe(true)
  })

  describe('username validation', () => {
    it('should reject username shorter than 3 characters', () => {
      const result = registerSchema.safeParse({
        username: 'ab',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Username must be at least 3 characters')
      }
    })

    it('should reject username longer than 30 characters', () => {
      const result = registerSchema.safeParse({
        username: 'a'.repeat(31),
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Username must be at most 30 characters')
      }
    })

    it('should reject username with special characters', () => {
      const result = registerSchema.safeParse({
        username: 'john@doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'Username can only contain letters, numbers, and underscores'
        )
      }
    })

    it('should accept username with underscores', () => {
      const result = registerSchema.safeParse({
        username: 'john_doe',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('password validation', () => {
    it('should reject password without number', () => {
      const result = registerSchema.safeParse({
        username: 'johndoe',
        email: 'test@example.com',
        password: 'Password!',
        confirmPassword: 'Password!',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.find((e) => e.message.includes('number'))).toBeDefined()
      }
    })

    it('should reject password without special character', () => {
      const result = registerSchema.safeParse({
        username: 'johndoe',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors.find((e) => e.message.includes('special character'))).toBeDefined()
      }
    })

    it('should reject if passwords do not match', () => {
      const result = registerSchema.safeParse({
        username: 'johndoe',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Different123!',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        const confirmError = result.error.errors.find((e) => e.path.includes('confirmPassword'))
        expect(confirmError?.message).toBe('Passwords do not match')
      }
    })
  })
})