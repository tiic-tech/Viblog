/**
 * Zod Validation Schemas for MCP Tool Inputs
 *
 * Provides structured validation with clear error messages
 * for all MCP tool parameters.
 */

import { z } from 'zod'

// ============================================
// Enum Schemas
// ============================================

export const FragmentTypeSchema = z.enum([
  'user_prompt',
  'ai_response',
  'code_block',
  'file_content',
  'command_output',
  'error_log',
  'system_message',
  'external_link',
], {
  errorMap: () => ({
    message: 'fragment_type must be one of: user_prompt, ai_response, code_block, file_content, command_output, error_log, system_message, external_link',
  }),
})

export const SessionStatusSchema = z.enum(['active', 'completed', 'archived'], {
  errorMap: () => ({
    message: 'status must be one of: active, completed, archived',
  }),
})

export const ContextFormatSchema = z.enum(['standard', 'detailed', 'compact'], {
  errorMap: () => ({
    message: 'format must be one of: standard, detailed, compact',
  }),
})

export const ArticleStyleSchema = z.enum(
  ['tutorial', 'case_study', 'tips', 'deep_dive', 'quick_note'],
  {
    errorMap: () => ({
      message: 'article_style must be one of: tutorial, case_study, tips, deep_dive, quick_note',
    }),
  }
)

export const TargetAudienceSchema = z.enum(['beginner', 'intermediate', 'advanced'], {
  errorMap: () => ({
    message: 'target_audience must be one of: beginner, intermediate, advanced',
  }),
})

export const ToneSchema = z.enum(['casual', 'professional', 'educational'], {
  errorMap: () => ({
    message: 'tone must be one of: casual, professional, educational',
  }),
})

export const ArticleVisibilitySchema = z.enum(['public', 'private', 'unlisted'], {
  errorMap: () => ({
    message: 'visibility must be one of: public, private, unlisted',
  }),
})

// ============================================
// Base Schemas
// ============================================

export const MetadataSchema = z.record(z.unknown()).optional()

export const SessionIdSchema = z.string().min(1, 'session_id is required and cannot be empty')

export const ContentSchema = z.string().min(1, 'content is required and cannot be empty')

export const TitleSchema = z.string().max(500, 'title must be 500 characters or less').optional()

export const PlatformSchema = z.string().max(100, 'platform must be 100 characters or less').optional()

export const ModelSchema = z.string().max(100, 'model must be 100 characters or less').optional()

// ============================================
// Tool Input Schemas
// ============================================

/**
 * create_vibe_session tool input validation
 */
export const CreateSessionInputSchema = z.object({
  title: TitleSchema,
  platform: PlatformSchema,
  model: ModelSchema,
  metadata: MetadataSchema,
})

/**
 * append_session_context tool input validation
 */
export const AppendSessionContextInputSchema = z.object({
  session_id: SessionIdSchema,
  fragment_type: FragmentTypeSchema,
  content: ContentSchema,
  metadata: MetadataSchema,
  sequence_number: z.number().int().positive().optional(),
})

/**
 * upload_session_context tool input validation
 */
export const FragmentInputSchema = z.object({
  fragment_type: z.string().min(1, 'fragment_type is required'),
  content: z.string().min(1, 'content is required'),
  sequence_number: z.number().int().positive(),
  metadata: MetadataSchema,
})

export const UploadSessionContextInputSchema = z.object({
  session_id: SessionIdSchema,
  fragments: z.array(FragmentInputSchema).min(1, 'at least one fragment is required'),
})

/**
 * generate_structured_context tool input validation
 */
export const GenerateStructuredContextInputSchema = z.object({
  session_id: SessionIdSchema,
  format: ContextFormatSchema.optional(),
  focus_areas: z.array(z.string()).optional(),
  custom_prompt: z.string().max(2000, 'custom_prompt must be 2000 characters or less').optional(),
})

/**
 * generate_article_draft tool input validation
 */
export const GenerateArticleDraftInputSchema = z.object({
  session_id: SessionIdSchema,
  article_style: ArticleStyleSchema.optional(),
  target_audience: TargetAudienceSchema.optional(),
  include_sections: z.array(z.string()).optional(),
  tone: ToneSchema.optional(),
  custom_instructions: z.string().max(2000, 'custom_instructions must be 2000 characters or less').optional(),
})

/**
 * list_user_sessions tool input validation
 */
export const ListUserSessionsInputSchema = z.object({
  status: SessionStatusSchema.optional(),
  platform: PlatformSchema,
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
})

/**
 * publish_article tool input validation
 */
export const PublishArticleInputSchema = z.object({
  session_id: SessionIdSchema,
  title: z.string().min(1, 'title is required').max(500, 'title must be 500 characters or less'),
  content: z.string().min(1, 'content is required'),
  excerpt: z.string().max(1000, 'excerpt must be 1000 characters or less').optional(),
  visibility: ArticleVisibilitySchema.optional(),
  cover_image: z.string().url('cover_image must be a valid URL').optional(),
  project_id: z.string().uuid('project_id must be a valid UUID').optional(),
})

// ============================================
// Validation Helper Functions
// ============================================

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown }

/**
 * Validate input against a Zod schema
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> {
  const result = schema.safeParse(input)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Format Zod errors into a user-friendly message
  const issues = result.error.issues
  const messages = issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'input'
    return `${path}: ${issue.message}`
  })

  return {
    success: false,
    error: messages.join('; '),
    details: { issues },
  }
}

/**
 * Validate create_vibe_session input
 */
export function validateCreateSessionInput(input: unknown) {
  return validateInput(CreateSessionInputSchema, input)
}

/**
 * Validate append_session_context input
 */
export function validateAppendSessionContextInput(input: unknown) {
  return validateInput(AppendSessionContextInputSchema, input)
}

/**
 * Validate upload_session_context input
 */
export function validateUploadSessionContextInput(input: unknown) {
  return validateInput(UploadSessionContextInputSchema, input)
}

/**
 * Validate generate_structured_context input
 */
export function validateGenerateStructuredContextInput(input: unknown) {
  return validateInput(GenerateStructuredContextInputSchema, input)
}

/**
 * Validate generate_article_draft input
 */
export function validateGenerateArticleDraftInput(input: unknown) {
  return validateInput(GenerateArticleDraftInputSchema, input)
}

/**
 * Validate list_user_sessions input
 */
export function validateListUserSessionsInput(input: unknown) {
  return validateInput(ListUserSessionsInputSchema, input)
}

/**
 * Validate publish_article input
 */
export function validatePublishArticleInput(input: unknown) {
  return validateInput(PublishArticleInputSchema, input)
}