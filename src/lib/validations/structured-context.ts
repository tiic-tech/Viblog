import { z } from 'zod'

/**
 * Difficulty level for vibe sessions
 */
export const DifficultyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced'])
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>

/**
 * Learning category
 */
export const LearningCategorySchema = z.enum(['technique', 'pattern', 'tool', 'concept', 'pitfall'])
export type LearningCategory = z.infer<typeof LearningCategorySchema>

/**
 * Problem description
 */
export const ProblemSchema = z.object({
  summary: z.string(),
  context: z.string(),
  constraints: z.array(z.string()).optional(),
})

export type Problem = z.infer<typeof ProblemSchema>

/**
 * Solution step
 */
export const SolutionStepSchema = z.object({
  order: z.number(),
  action: z.string(),
  code_snippet: z.string().optional(),
  reasoning: z.string().optional(),
})

export type SolutionStep = z.infer<typeof SolutionStepSchema>

/**
 * Solution description
 */
export const SolutionSchema = z.object({
  approach: z.string(),
  steps: z.array(SolutionStepSchema),
  alternative_approaches: z.array(z.string()).optional(),
})

export type Solution = z.infer<typeof SolutionSchema>

/**
 * Key code snippet
 */
export const KeyCodeSchema = z.object({
  purpose: z.string(),
  language: z.string(),
  code: z.string(),
  file_path: z.string().optional(),
  explanation: z.string(),
})

export type KeyCode = z.infer<typeof KeyCodeSchema>

/**
 * Decision made during the session
 */
export const DecisionSchema = z.object({
  decision: z.string(),
  reasoning: z.string(),
  alternatives_considered: z.array(z.string()).optional(),
})

export type Decision = z.infer<typeof DecisionSchema>

/**
 * Learning from the session
 */
export const LearningSchema = z.object({
  category: LearningCategorySchema,
  content: z.string(),
  code_example: z.string().optional(),
})

export type Learning = z.infer<typeof LearningSchema>

/**
 * Session metadata
 */
export const SessionMetadataSchema = z.object({
  tech_stack: z.array(z.string()),
  difficulty: DifficultyLevelSchema,
  time_spent_minutes: z.number().optional(),
  tags: z.array(z.string()),
})

export type SessionMetadata = z.infer<typeof SessionMetadataSchema>

/**
 * Complete structured vibe context
 */
export const StructuredVibeContextSchema = z.object({
  session_id: z.string(),
  problem: ProblemSchema,
  solution: SolutionSchema,
  key_code: z.array(KeyCodeSchema),
  decisions: z.array(DecisionSchema),
  learnings: z.array(LearningSchema),
  metadata: SessionMetadataSchema,
})

export type StructuredVibeContext = z.infer<typeof StructuredVibeContextSchema>

/**
 * Generate structured context input
 */
export const GenerateStructuredContextInputSchema = z.object({
  session_id: z.string().uuid(),
  format: z.enum(['standard', 'detailed', 'compact']).optional().default('standard'),
  focus_areas: z
    .array(z.enum(['problem', 'solution', 'code', 'learnings', 'decisions']))
    .optional(),
  custom_prompt: z.string().optional(),
})

export type GenerateStructuredContextInput = z.output<typeof GenerateStructuredContextInputSchema>

/**
 * Generate article draft input
 */
export const GenerateArticleDraftInputSchema = z.object({
  session_id: z.string().uuid(),
  article_style: z
    .enum(['tutorial', 'case_study', 'tips', 'deep_dive', 'quick_note'])
    .default('tutorial'),
  target_audience: DifficultyLevelSchema.default('intermediate'),
  include_sections: z
    .array(z.enum(['problem', 'solution', 'code', 'learnings', 'next_steps']))
    .optional(),
  tone: z.enum(['casual', 'professional', 'educational']).default('educational'),
  custom_instructions: z.string().optional(),
})

export type GenerateArticleDraftInput = z.infer<typeof GenerateArticleDraftInputSchema>

/**
 * Article draft output
 */
export const ArticleDraftSchema = z.object({
  session_id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  markdown: z.string(),
  metadata: z.object({
    style: z.string(),
    audience: z.string(),
    estimated_read_time_minutes: z.number(),
    word_count: z.number(),
  }),
})

export type ArticleDraft = z.infer<typeof ArticleDraftSchema>
