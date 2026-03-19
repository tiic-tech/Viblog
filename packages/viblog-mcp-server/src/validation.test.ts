/**
 * Tests for Zod Validation Schemas
 *
 * Tests all validation schemas and helper functions with
 * valid inputs, invalid inputs, and edge cases.
 */

import { describe, it, expect } from 'vitest'
import {
  FragmentTypeSchema,
  SessionStatusSchema,
  ContextFormatSchema,
  ArticleStyleSchema,
  TargetAudienceSchema,
  ToneSchema,
  CreateSessionInputSchema,
  AppendSessionContextInputSchema,
  UploadSessionContextInputSchema,
  GenerateStructuredContextInputSchema,
  GenerateArticleDraftInputSchema,
  ListUserSessionsInputSchema,
  validateInput,
  validateCreateSessionInput,
  validateAppendSessionContextInput,
  validateUploadSessionContextInput,
  validateGenerateStructuredContextInput,
  validateGenerateArticleDraftInput,
  validateListUserSessionsInput,
} from './validation.js'

// ============================================
// Enum Schemas
// ============================================

describe('FragmentTypeSchema', () => {
  it('should accept valid fragment types', () => {
    expect(FragmentTypeSchema.parse('user_prompt')).toBe('user_prompt')
    expect(FragmentTypeSchema.parse('ai_response')).toBe('ai_response')
    expect(FragmentTypeSchema.parse('code_block')).toBe('code_block')
    expect(FragmentTypeSchema.parse('file_content')).toBe('file_content')
    expect(FragmentTypeSchema.parse('command_output')).toBe('command_output')
    expect(FragmentTypeSchema.parse('error_log')).toBe('error_log')
    expect(FragmentTypeSchema.parse('system_message')).toBe('system_message')
    expect(FragmentTypeSchema.parse('external_link')).toBe('external_link')
  })

  it('should reject invalid fragment types', () => {
    const result = FragmentTypeSchema.safeParse('invalid_type')
    expect(result.success).toBe(false)
  })
})

describe('SessionStatusSchema', () => {
  it('should accept valid statuses', () => {
    expect(SessionStatusSchema.parse('active')).toBe('active')
    expect(SessionStatusSchema.parse('completed')).toBe('completed')
    expect(SessionStatusSchema.parse('archived')).toBe('archived')
  })

  it('should reject invalid statuses', () => {
    const result = SessionStatusSchema.safeParse('pending')
    expect(result.success).toBe(false)
  })
})

describe('ContextFormatSchema', () => {
  it('should accept valid formats', () => {
    expect(ContextFormatSchema.parse('standard')).toBe('standard')
    expect(ContextFormatSchema.parse('detailed')).toBe('detailed')
    expect(ContextFormatSchema.parse('compact')).toBe('compact')
  })

  it('should reject invalid formats', () => {
    const result = ContextFormatSchema.safeParse('full')
    expect(result.success).toBe(false)
  })
})

describe('ArticleStyleSchema', () => {
  it('should accept valid styles', () => {
    expect(ArticleStyleSchema.parse('tutorial')).toBe('tutorial')
    expect(ArticleStyleSchema.parse('case_study')).toBe('case_study')
    expect(ArticleStyleSchema.parse('tips')).toBe('tips')
    expect(ArticleStyleSchema.parse('deep_dive')).toBe('deep_dive')
    expect(ArticleStyleSchema.parse('quick_note')).toBe('quick_note')
  })

  it('should reject invalid styles', () => {
    const result = ArticleStyleSchema.safeParse('guide')
    expect(result.success).toBe(false)
  })
})

describe('TargetAudienceSchema', () => {
  it('should accept valid audiences', () => {
    expect(TargetAudienceSchema.parse('beginner')).toBe('beginner')
    expect(TargetAudienceSchema.parse('intermediate')).toBe('intermediate')
    expect(TargetAudienceSchema.parse('advanced')).toBe('advanced')
  })

  it('should reject invalid audiences', () => {
    const result = TargetAudienceSchema.safeParse('expert')
    expect(result.success).toBe(false)
  })
})

describe('ToneSchema', () => {
  it('should accept valid tones', () => {
    expect(ToneSchema.parse('casual')).toBe('casual')
    expect(ToneSchema.parse('professional')).toBe('professional')
    expect(ToneSchema.parse('educational')).toBe('educational')
  })

  it('should reject invalid tones', () => {
    const result = ToneSchema.safeParse('friendly')
    expect(result.success).toBe(false)
  })
})

// ============================================
// CreateSessionInputSchema
// ============================================

describe('CreateSessionInputSchema', () => {
  it('should accept empty object', () => {
    const result = CreateSessionInputSchema.parse({})
    expect(result).toEqual({})
  })

  it('should accept valid input with all fields', () => {
    const input = {
      title: 'My Session',
      platform: 'claude',
      model: 'claude-3',
      metadata: { key: 'value' },
    }
    const result = CreateSessionInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should reject title over 500 characters', () => {
    const result = CreateSessionInputSchema.safeParse({
      title: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('should reject platform over 100 characters', () => {
    const result = CreateSessionInputSchema.safeParse({
      platform: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('should reject model over 100 characters', () => {
    const result = CreateSessionInputSchema.safeParse({
      model: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })
})

// ============================================
// AppendSessionContextInputSchema
// ============================================

describe('AppendSessionContextInputSchema', () => {
  it('should accept valid input', () => {
    const input = {
      session_id: 'session-123',
      fragment_type: 'user_prompt',
      content: 'Test content',
    }
    const result = AppendSessionContextInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should accept optional fields', () => {
    const input = {
      session_id: 'session-123',
      fragment_type: 'code_block',
      content: 'const x = 1',
      metadata: { language: 'typescript' },
      sequence_number: 5,
    }
    const result = AppendSessionContextInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should reject empty session_id', () => {
    const result = AppendSessionContextInputSchema.safeParse({
      session_id: '',
      fragment_type: 'user_prompt',
      content: 'Test',
    })
    expect(result.success).toBe(false)
  })

  it('should reject empty content', () => {
    const result = AppendSessionContextInputSchema.safeParse({
      session_id: 'session-123',
      fragment_type: 'user_prompt',
      content: '',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid fragment_type', () => {
    const result = AppendSessionContextInputSchema.safeParse({
      session_id: 'session-123',
      fragment_type: 'invalid',
      content: 'Test',
    })
    expect(result.success).toBe(false)
  })

  it('should reject non-positive sequence_number', () => {
    const result = AppendSessionContextInputSchema.safeParse({
      session_id: 'session-123',
      fragment_type: 'user_prompt',
      content: 'Test',
      sequence_number: 0,
    })
    expect(result.success).toBe(false)
  })
})

// ============================================
// UploadSessionContextInputSchema
// ============================================

describe('UploadSessionContextInputSchema', () => {
  it('should accept valid input with multiple fragments', () => {
    const input = {
      session_id: 'session-123',
      fragments: [
        { fragment_type: 'user_prompt', content: 'Content 1', sequence_number: 1 },
        { fragment_type: 'code_block', content: 'Content 2', sequence_number: 2 },
      ],
    }
    const result = UploadSessionContextInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should accept fragments with metadata', () => {
    const input = {
      session_id: 'session-123',
      fragments: [
        {
          fragment_type: 'code_block',
          content: 'const x = 1',
          sequence_number: 1,
          metadata: { language: 'typescript' },
        },
      ],
    }
    const result = UploadSessionContextInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should reject empty fragments array', () => {
    const result = UploadSessionContextInputSchema.safeParse({
      session_id: 'session-123',
      fragments: [],
    })
    expect(result.success).toBe(false)
  })

  it('should reject fragment without sequence_number', () => {
    const result = UploadSessionContextInputSchema.safeParse({
      session_id: 'session-123',
      fragments: [
        { fragment_type: 'user_prompt', content: 'Test' },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('should reject fragment with empty content', () => {
    const result = UploadSessionContextInputSchema.safeParse({
      session_id: 'session-123',
      fragments: [
        { fragment_type: 'user_prompt', content: '', sequence_number: 1 },
      ],
    })
    expect(result.success).toBe(false)
  })
})

// ============================================
// GenerateStructuredContextInputSchema
// ============================================

describe('GenerateStructuredContextInputSchema', () => {
  it('should accept valid input with only session_id', () => {
    const input = { session_id: 'session-123' }
    const result = GenerateStructuredContextInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should accept all optional fields', () => {
    const input = {
      session_id: 'session-123',
      format: 'detailed',
      focus_areas: ['problem', 'solution'],
      custom_prompt: 'Focus on technical details',
    }
    const result = GenerateStructuredContextInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should reject custom_prompt over 2000 characters', () => {
    const result = GenerateStructuredContextInputSchema.safeParse({
      session_id: 'session-123',
      custom_prompt: 'a'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid format', () => {
    const result = GenerateStructuredContextInputSchema.safeParse({
      session_id: 'session-123',
      format: 'invalid',
    })
    expect(result.success).toBe(false)
  })
})

// ============================================
// GenerateArticleDraftInputSchema
// ============================================

describe('GenerateArticleDraftInputSchema', () => {
  it('should accept valid input with only session_id', () => {
    const input = { session_id: 'session-123' }
    const result = GenerateArticleDraftInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should accept all optional fields', () => {
    const input = {
      session_id: 'session-123',
      article_style: 'tutorial',
      target_audience: 'beginner',
      include_sections: ['Introduction', 'Setup', 'Conclusion'],
      tone: 'educational',
      custom_instructions: 'Make it beginner-friendly',
    }
    const result = GenerateArticleDraftInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should reject custom_instructions over 2000 characters', () => {
    const result = GenerateArticleDraftInputSchema.safeParse({
      session_id: 'session-123',
      custom_instructions: 'a'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid article_style', () => {
    const result = GenerateArticleDraftInputSchema.safeParse({
      session_id: 'session-123',
      article_style: 'invalid',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid target_audience', () => {
    const result = GenerateArticleDraftInputSchema.safeParse({
      session_id: 'session-123',
      target_audience: 'invalid',
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid tone', () => {
    const result = GenerateArticleDraftInputSchema.safeParse({
      session_id: 'session-123',
      tone: 'invalid',
    })
    expect(result.success).toBe(false)
  })
})

// ============================================
// ListUserSessionsInputSchema
// ============================================

describe('ListUserSessionsInputSchema', () => {
  it('should accept empty object', () => {
    const result = ListUserSessionsInputSchema.parse({})
    expect(result).toEqual({})
  })

  it('should accept valid query parameters', () => {
    const input = {
      status: 'active',
      platform: 'claude',
      limit: 20,
      offset: 10,
    }
    const result = ListUserSessionsInputSchema.parse(input)
    expect(result).toEqual(input)
  })

  it('should reject limit below 1', () => {
    const result = ListUserSessionsInputSchema.safeParse({ limit: 0 })
    expect(result.success).toBe(false)
  })

  it('should reject limit above 100', () => {
    const result = ListUserSessionsInputSchema.safeParse({ limit: 101 })
    expect(result.success).toBe(false)
  })

  it('should reject negative offset', () => {
    const result = ListUserSessionsInputSchema.safeParse({ offset: -1 })
    expect(result.success).toBe(false)
  })

  it('should reject invalid status', () => {
    const result = ListUserSessionsInputSchema.safeParse({ status: 'pending' })
    expect(result.success).toBe(false)
  })

  it('should reject platform over 100 characters', () => {
    const result = ListUserSessionsInputSchema.safeParse({
      platform: 'a'.repeat(101),
    })
    expect(result.success).toBe(false)
  })
})

// ============================================
// validateInput Helper
// ============================================

describe('validateInput', () => {
  it('should return success with data for valid input', () => {
    const result = validateInput(SessionStatusSchema, 'active')

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('active')
    }
  })

  it('should return failure with error message for invalid input', () => {
    const result = validateInput(SessionStatusSchema, 'invalid')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeDefined()
      expect(result.details).toBeDefined()
    }
  })

  it('should format error path correctly', () => {
    const result = validateInput(AppendSessionContextInputSchema, {
      session_id: '',
      fragment_type: 'invalid',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('session_id')
      expect(result.error).toContain('fragment_type')
    }
  })
})

// ============================================
// Validation Helper Functions
// ============================================

describe('validateCreateSessionInput', () => {
  it('should validate valid input', () => {
    const result = validateCreateSessionInput({
      title: 'Test Session',
      platform: 'claude',
    })

    expect(result.success).toBe(true)
  })

  it('should reject invalid input', () => {
    const result = validateCreateSessionInput({
      title: 'a'.repeat(501),
    })

    expect(result.success).toBe(false)
  })
})

describe('validateAppendSessionContextInput', () => {
  it('should validate valid input', () => {
    const result = validateAppendSessionContextInput({
      session_id: 'session-123',
      fragment_type: 'user_prompt',
      content: 'Test content',
    })

    expect(result.success).toBe(true)
  })

  it('should reject missing session_id', () => {
    const result = validateAppendSessionContextInput({
      fragment_type: 'user_prompt',
      content: 'Test content',
    })

    expect(result.success).toBe(false)
  })
})

describe('validateUploadSessionContextInput', () => {
  it('should validate valid input', () => {
    const result = validateUploadSessionContextInput({
      session_id: 'session-123',
      fragments: [
        { fragment_type: 'user_prompt', content: 'Test', sequence_number: 1 },
      ],
    })

    expect(result.success).toBe(true)
  })

  it('should reject empty fragments', () => {
    const result = validateUploadSessionContextInput({
      session_id: 'session-123',
      fragments: [],
    })

    expect(result.success).toBe(false)
  })
})

describe('validateGenerateStructuredContextInput', () => {
  it('should validate valid input', () => {
    const result = validateGenerateStructuredContextInput({
      session_id: 'session-123',
      format: 'standard',
    })

    expect(result.success).toBe(true)
  })

  it('should reject missing session_id', () => {
    const result = validateGenerateStructuredContextInput({
      format: 'standard',
    })

    expect(result.success).toBe(false)
  })
})

describe('validateGenerateArticleDraftInput', () => {
  it('should validate valid input', () => {
    const result = validateGenerateArticleDraftInput({
      session_id: 'session-123',
      article_style: 'tutorial',
    })

    expect(result.success).toBe(true)
  })

  it('should reject missing session_id', () => {
    const result = validateGenerateArticleDraftInput({
      article_style: 'tutorial',
    })

    expect(result.success).toBe(false)
  })
})

describe('validateListUserSessionsInput', () => {
  it('should validate valid input', () => {
    const result = validateListUserSessionsInput({
      status: 'active',
      limit: 10,
    })

    expect(result.success).toBe(true)
  })

  it('should validate empty input', () => {
    const result = validateListUserSessionsInput({})

    expect(result.success).toBe(true)
  })

  it('should reject invalid limit', () => {
    const result = validateListUserSessionsInput({
      limit: 200,
    })

    expect(result.success).toBe(false)
  })
})

// ============================================
// Edge Cases
// ============================================

describe('Edge Cases', () => {
  it('should handle null input', () => {
    const result = validateCreateSessionInput(null)
    expect(result.success).toBe(false)
  })

  it('should handle undefined input', () => {
    const result = validateCreateSessionInput(undefined)
    expect(result.success).toBe(false)
  })

  it('should handle non-object input', () => {
    const result = validateCreateSessionInput('string')
    expect(result.success).toBe(false)
  })

  it('should handle array input', () => {
    const result = validateCreateSessionInput([])
    expect(result.success).toBe(false)
  })

  it('should handle extra properties (pass through)', () => {
    const result = validateCreateSessionInput({
      title: 'Test',
      extraProperty: 'should be ignored',
    })

    expect(result.success).toBe(true)
  })
})