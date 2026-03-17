import { z } from 'zod'

/**
 * Vibe Session Status
 */
export const SessionStatusSchema = z.enum(['active', 'completed', 'abandoned'])
export type SessionStatus = z.infer<typeof SessionStatusSchema>

/**
 * Fragment types for session context
 */
export const FragmentTypeSchema = z.enum([
  'user_prompt',
  'ai_response',
  'code_block',
  'file_content',
  'command_output',
  'error_log',
  'system_message',
  'external_link',
])
export type FragmentType = z.infer<typeof FragmentTypeSchema>

/**
 * Schema for creating a new vibe session
 */
export const createVibeSessionSchema = z.object({
  title: z.string().max(200).optional(),
  platform: z.string().max(50).optional(),
  model: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type CreateVibeSessionInput = z.infer<typeof createVibeSessionSchema>

/**
 * Schema for updating a vibe session
 */
export const updateVibeSessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200).optional(),
  status: SessionStatusSchema.optional(),
  end_time: z.string().datetime().optional().nullable(),
  raw_context: z.record(z.unknown()).optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
})

export type UpdateVibeSessionInput = z.infer<typeof updateVibeSessionSchema>

/**
 * Schema for appending session context
 */
export const appendSessionContextSchema = z.object({
  session_id: z.string().uuid(),
  fragment_type: FragmentTypeSchema,
  content: z.string().max(100000), // 100KB max per fragment
  metadata: z.record(z.unknown()).optional(),
  sequence_number: z.number().int().positive().optional(),
})

export type AppendSessionContextInput = z.infer<typeof appendSessionContextSchema>

/**
 * Schema for batch uploading session context
 */
export const uploadSessionContextSchema = z.object({
  session_id: z.string().uuid(),
  fragments: z
    .array(
      z.object({
        fragment_type: FragmentTypeSchema,
        content: z.string().max(100000),
        metadata: z.record(z.unknown()).optional(),
        sequence_number: z.number().int().positive(),
      })
    )
    .max(100), // Max 100 fragments per batch
})

export type UploadSessionContextInput = z.infer<typeof uploadSessionContextSchema>

/**
 * Schema for listing vibe sessions
 */
export const listVibeSessionsSchema = z.object({
  status: SessionStatusSchema.optional(),
  platform: z.string().max(50).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

export type ListVibeSessionsInput = z.infer<typeof listVibeSessionsSchema>