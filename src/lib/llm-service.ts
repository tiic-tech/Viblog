import { getDecryptedApiKeys } from '@/lib/api-keys'
import {
  StructuredVibeContext,
  ArticleDraft,
  GenerateStructuredContextInput,
  GenerateArticleDraftInput,
} from '@/lib/validations/structured-context'

/**
 * OpenAI API response types
 */
interface OpenAIMessage {
  role: string
  content: string
}

interface OpenAIChoice {
  message?: {
    content?: string
  }
}

interface OpenAIResponse {
  choices: OpenAIChoice[]
  error?: {
    message: string
  }
}

/**
 * Get OpenAI API key for the user
 */
async function getOpenAIApiKey(): Promise<{ apiKey: string | null; error?: string }> {
  const apiKeys = await getDecryptedApiKeys()

  if (!apiKeys?.llm?.apiKey) {
    return { apiKey: null, error: 'No LLM API key configured' }
  }

  if (apiKeys.llm.provider !== 'openai') {
    return { apiKey: null, error: 'Only OpenAI provider is supported for structured context generation' }
  }

  return { apiKey: apiKeys.llm.apiKey }
}

/**
 * Call OpenAI API using fetch
 */
async function callOpenAI(
  apiKey: string,
  messages: OpenAIMessage[],
  options: {
    model: string
    temperature: number
    max_tokens: number
    response_format?: { type: string }
  }
): Promise<{ content: string | null; error?: string }> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.max_tokens,
        response_format: options.response_format,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { content: null, error: `OpenAI API error (${response.status}): ${errorText}` }
    }

    const data: OpenAIResponse = await response.json()

    if (data.error) {
      return { content: null, error: data.error.message }
    }

    return { content: data.choices[0]?.message?.content ?? null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return { content: null, error: `Failed to call OpenAI API: ${errorMessage}` }
  }
}

/**
 * System prompt for structured context extraction
 */
const STRUCTURED_CONTEXT_SYSTEM_PROMPT = `You are an expert at analyzing vibe coding sessions and extracting structured information.

Your task is to analyze the raw session context (prompts, code, responses, errors) and extract:
1. The core problem being solved
2. The solution approach and steps
3. Key code snippets with explanations
4. Important decisions made
5. Learnings and insights

Be concise but thorough. Focus on extracting actionable knowledge.

Output valid JSON only, no markdown formatting.`

/**
 * User prompt template for structured context extraction
 */
function buildStructuredContextPrompt(
  rawContext: string,
  options: GenerateStructuredContextInput
): string {
  const focusInstructions = options.focus_areas
    ? `Focus specifically on: ${options.focus_areas.join(', ')}.`
    : ''

  const formatMap: Record<string, string> = {
    standard: 'Provide balanced detail across all sections.',
    detailed: 'Provide comprehensive detail with code examples and reasoning.',
    compact: 'Be concise, focus on key points only.',
  }
  const formatInstructions = formatMap[options.format] ?? formatMap.standard

  return `Analyze this vibe coding session and extract structured context.

${focusInstructions}
Format: ${formatInstructions}
${options.custom_prompt ? `Additional instructions: ${options.custom_prompt}` : ''}

RAW SESSION CONTEXT:
---
${rawContext}
---

Extract and output JSON with this structure:
{
  "problem": {
    "summary": "One-line problem description",
    "context": "Background context",
    "constraints": ["constraint1", "constraint2"]
  },
  "solution": {
    "approach": "High-level approach",
    "steps": [
      {"order": 1, "action": "Step description", "code_snippet": "...", "reasoning": "..."}
    ],
    "alternative_approaches": ["alt1", "alt2"]
  },
  "key_code": [
    {"purpose": "What this code does", "language": "typescript", "code": "...", "file_path": "...", "explanation": "..."}
  ],
  "decisions": [
    {"decision": "Decision made", "reasoning": "Why", "alternatives_considered": ["..."]}
  ],
  "learnings": [
    {"category": "technique|pattern|tool|concept|pitfall", "content": "...", "code_example": "..."}
  ],
  "metadata": {
    "tech_stack": ["tech1", "tech2"],
    "difficulty": "beginner|intermediate|advanced",
    "time_spent_minutes": 30,
    "tags": ["tag1", "tag2"]
  }
}`
}

/**
 * Generate structured context from raw session data
 */
export async function generateStructuredContext(
  rawContext: string,
  options: GenerateStructuredContextInput
): Promise<{ data: StructuredVibeContext | null; error?: string }> {
  const { apiKey, error: keyError } = await getOpenAIApiKey()

  if (!apiKey) {
    return { data: null, error: keyError }
  }

  const { content, error: apiError } = await callOpenAI(
    apiKey,
    [
      { role: 'system', content: STRUCTURED_CONTEXT_SYSTEM_PROMPT },
      { role: 'user', content: buildStructuredContextPrompt(rawContext, options) },
    ],
    {
      model: 'gpt-4o',
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }
  )

  if (apiError || !content) {
    return { data: null, error: apiError ?? 'No response from LLM' }
  }

  try {
    const parsed = JSON.parse(content)
    const structuredContext = {
      session_id: options.session_id,
      ...parsed,
    }

    return { data: structuredContext as StructuredVibeContext }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return { data: null, error: `Failed to parse LLM response: ${errorMessage}` }
  }
}

/**
 * System prompt for article draft generation
 */
const ARTICLE_DRAFT_SYSTEM_PROMPT = `You are an expert technical writer who transforms coding sessions into engaging blog posts.

Your task is to write a well-structured article based on the structured vibe session context.

Write in clear, engaging prose. Include code examples where helpful. Make it educational but not dry.

Output valid JSON only, no markdown formatting.`

/**
 * User prompt template for article draft generation
 */
function buildArticleDraftPrompt(
  structuredContext: StructuredVibeContext,
  options: GenerateArticleDraftInput
): string {
  const styleMap: Record<string, string> = {
    tutorial: 'Write as a step-by-step tutorial with clear instructions.',
    case_study: 'Write as a real-world case study with lessons learned.',
    tips: 'Write as a collection of practical tips and tricks.',
    deep_dive: 'Write as an in-depth technical deep dive.',
    quick_note: 'Write as a brief, focused note on a specific topic.',
  }
  const styleInstructions = styleMap[options.article_style] ?? styleMap.tutorial

  const toneMap: Record<string, string> = {
    casual: 'Write in a friendly, conversational tone.',
    professional: 'Write in a polished, professional tone.',
    educational: 'Write in a clear, educational tone.',
  }
  const toneInstructions = toneMap[options.tone] ?? toneMap.educational

  const sectionsList = options.include_sections?.join(', ') ?? 'all sections'

  return `Create a blog article from this structured coding session.

Style: ${styleInstructions}
Tone: ${toneInstructions}
Target audience: ${options.target_audience}
Include sections: ${sectionsList}
${options.custom_instructions ? `Additional instructions: ${options.custom_instructions}` : ''}

STRUCTURED SESSION CONTEXT:
---
${JSON.stringify(structuredContext, null, 2)}
---

Write the article and output JSON with this structure:
{
  "title": "Article title",
  "excerpt": "Brief summary (1-2 sentences)",
  "markdown": "Full article in markdown format",
  "metadata": {
    "style": "${options.article_style}",
    "audience": "${options.target_audience}",
    "estimated_read_time_minutes": 5,
    "word_count": 800
  }
}`
}

/**
 * Generate article draft from structured context
 */
export async function generateArticleDraft(
  structuredContext: StructuredVibeContext,
  options: GenerateArticleDraftInput
): Promise<{ data: ArticleDraft | null; error?: string }> {
  const { apiKey, error: keyError } = await getOpenAIApiKey()

  if (!apiKey) {
    return { data: null, error: keyError }
  }

  const { content, error: apiError } = await callOpenAI(
    apiKey,
    [
      { role: 'system', content: ARTICLE_DRAFT_SYSTEM_PROMPT },
      { role: 'user', content: buildArticleDraftPrompt(structuredContext, options) },
    ],
    {
      model: 'gpt-4o',
      temperature: 0.5,
      max_tokens: 6000,
      response_format: { type: 'json_object' },
    }
  )

  if (apiError || !content) {
    return { data: null, error: apiError ?? 'No response from LLM' }
  }

  try {
    const parsed = JSON.parse(content)
    const articleDraft: ArticleDraft = {
      session_id: structuredContext.session_id,
      ...parsed,
    }

    return { data: articleDraft }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return { data: null, error: `Failed to parse LLM response: ${errorMessage}` }
  }
}