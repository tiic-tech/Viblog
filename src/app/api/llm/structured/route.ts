import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { getProviderAdapter, isProviderSupported } from '@/lib/llm'
import { isValidSchemaName, getSchema, SchemaRegistry, type SchemaName } from '@/lib/llm/schemas'
import type { ChatMessage, LLMModel } from '@/lib/llm/types'
import { z } from 'zod'

/**
 * GET /api/llm/structured
 * List available schemas
 */
export async function GET() {
  const schemas = Object.keys(SchemaRegistry).map((name) => ({
    name,
    description: getSchemaDescription(name as SchemaName),
  }))

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/llm/structured',
    methods: ['GET', 'POST'],
    description: 'Type-safe structured output for LLM responses',
    schemas,
  })
}

/**
 * Get description for a schema
 */
function getSchemaDescription(name: SchemaName): string {
  const descriptions: Record<SchemaName, string> = {
    article_generation: 'Generate article with title, content, tags, and SEO metadata',
    article_outline: 'Generate article outline with sections and key points',
    article_improvement: 'Analyze article and provide improvement suggestions',
    content_analysis: 'Analyze content for sentiment, topics, and key phrases',
    content_classification: 'Classify content by category, audience, and purpose',
    entity_extraction: 'Extract persons, organizations, locations, dates from content',
    code_entity_extraction: 'Extract functions, classes, imports from code',
    sentiment_analysis: 'Detailed sentiment analysis with emotions and aspects',
    vibe_session_context: 'Extract structured context from vibe coding session',
    vibe_article_draft: 'Generate article draft from vibe session',
  }
  return descriptions[name] || 'No description available'
}

/**
 * POST /api/llm/structured
 * Generate structured output from LLM
 *
 * Request body:
 * - messages: ChatMessage[] - Conversation messages
 * - schema_name: string - Name of predefined schema (optional)
 * - schema: object - Custom JSON schema (optional, used if schema_name not provided)
 * - provider_id: string - Provider to use (optional)
 * - model: string - Model override (optional)
 * - max_retries: number - Max retry attempts (default: 3)
 */
export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      messages,
      schema_name,
      schema: customSchema,
      provider_id,
      model: modelOverride,
      max_retries = 3,
    } = body

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      )
    }

    // Get schema
    let schema: z.ZodType
    let schemaJson: Record<string, unknown>

    if (schema_name) {
      if (!isValidSchemaName(schema_name)) {
        return NextResponse.json(
          { error: `Invalid schema_name: ${schema_name}. Available: ${Object.keys(SchemaRegistry).join(', ')}` },
          { status: 400 }
        )
      }
      schema = getSchema(schema_name)
      schemaJson = schemaToJsonObject(schema)
    } else if (customSchema) {
      try {
        schema = z.object(customSchema)
        schemaJson = customSchema
      } catch {
        return NextResponse.json(
          { error: 'Invalid custom schema format' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Either schema_name or schema is required' },
        { status: 400 }
      )
    }

    // Get user's LLM config (similar to chat endpoint)
    let configQuery = supabase
      .from('user_llm_configs')
      .select(
        `
        id,
        provider_id,
        api_key_encrypted,
        default_model_id,
        custom_params,
        is_primary
      `
      )
      .eq('user_id', user.id)

    if (provider_id) {
      if (!isProviderSupported(provider_id)) {
        return NextResponse.json(
          { error: `Unsupported provider: ${provider_id}` },
          { status: 400 }
        )
      }
      configQuery = configQuery.eq('provider_id', provider_id)
    } else {
      configQuery = configQuery.eq('is_primary', true)
    }

    const { data: config, error: configError } = await configQuery.single()

    if (configError || !config) {
      return NextResponse.json(
        {
          error: provider_id
            ? `No configuration found for provider: ${provider_id}`
            : 'No primary LLM configuration found',
        },
        { status: 404 }
      )
    }

    if (!config.api_key_encrypted) {
      return NextResponse.json(
        { error: 'API key not configured for this provider' },
        { status: 400 }
      )
    }

    // Decrypt API key
    let apiKey: string
    try {
      apiKey = decrypt(config.api_key_encrypted)
    } catch {
      return NextResponse.json(
        { error: 'Failed to decrypt API key' },
        { status: 500 }
      )
    }

    // Get provider base URL
    const { data: provider } = await supabase
      .from('llm_providers')
      .select('base_url')
      .eq('id', config.provider_id)
      .single()

    // Determine model to use
    let modelId = modelOverride

    if (!modelId && config.default_model_id) {
      const { data: model } = await supabase
        .from('llm_models')
        .select('model_id')
        .eq('id', config.default_model_id)
        .single()

      if (model) {
        modelId = model.model_id
      }
    }

    if (!modelId) {
      return NextResponse.json(
        { error: 'No model specified and no default model configured' },
        { status: 400 }
      )
    }

    // Get model info for cost calculation
    const { data: modelData } = await supabase
      .from('llm_models')
      .select('*')
      .eq('provider_id', config.provider_id)
      .eq('model_id', modelId)
      .single()

    const modelInfo: LLMModel | null = modelData
      ? {
          id: modelData.id,
          providerId: modelData.provider_id,
          modelId: modelData.model_id,
          displayName: modelData.display_name,
          capabilities: modelData.capabilities || {},
          contextWindow: modelData.context_window || 4096,
          maxOutputTokens: modelData.max_output_tokens || 2048,
          inputPricePer1k: Number(modelData.input_price_per_1k) || 0,
          outputPricePer1k: Number(modelData.output_price_per_1k) || 0,
          supportedParams: modelData.supported_params || [],
        }
      : null

    // Get provider adapter
    const adapter = getProviderAdapter(config.provider_id)

    // Build context
    const context = {
      apiKey,
      baseUrl: provider?.base_url,
      model: modelInfo || {
        id: '',
        providerId: config.provider_id,
        modelId: modelId,
        displayName: modelId,
        capabilities: { streaming: true, structured_output: false, vision: false },
        contextWindow: 4096,
        maxOutputTokens: 2048,
        inputPricePer1k: 0,
        outputPricePer1k: 0,
        supportedParams: [],
      },
    }

    // Add system message for JSON output if provider doesn't support structured output natively
    const messagesWithInstruction: ChatMessage[] =
      adapter.capabilities.structured_output
        ? messages
        : [
            {
              role: 'system',
              content: `You must respond with valid JSON that matches the following schema. Do not include any other text, markdown, or formatting - only the JSON object.

Schema:
${JSON.stringify(schemaJson, null, 2)}

Important:
- Return ONLY valid JSON
- Do not wrap in markdown code blocks
- Ensure all required fields are present
- Use appropriate data types for each field`,
            },
            ...messages,
          ]

    // Try structured output with retries
    let attempts = 0
    let lastError: Error | null = null
    let totalInputTokens = 0
    let totalOutputTokens = 0

    while (attempts < max_retries) {
      attempts++

      try {
        // Use structuredOutput if provider supports it, otherwise fall back to chat
        let result: unknown

        if (adapter.capabilities.structured_output) {
          result = await adapter.structuredOutput(
            {
              messages: messagesWithInstruction,
              schema: schemaJson,
            },
            context
          )
        } else {
          // Fall back to chat and parse JSON
          const response = await adapter.chat(
            {
              messages: messagesWithInstruction,
              model: modelId,
              temperature: 0.3, // Lower temperature for more consistent output
            },
            context
          )

          totalInputTokens = response.usage.inputTokens
          totalOutputTokens = response.usage.outputTokens

          // Try to parse JSON from response
          result = parseJsonFromResponse(response.content)
        }

        // Validate against schema
        const parsed = schema.parse(result)

        const latencyMs = Date.now() - startTime

        // Log usage
        await logUsage({
          supabase,
          userId: user.id,
          configId: config.id,
          providerId: config.provider_id,
          modelId,
          requestType: 'structured',
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
          latencyMs,
          status: 'success',
          modelInfo,
        })

        return NextResponse.json({
          data: parsed,
          metadata: {
            schema: schema_name || 'custom',
            model: modelId,
            provider: config.provider_id,
            attempts,
            latencyMs,
          },
        })
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        // Log retry attempt
        console.warn(
          `Structured output attempt ${attempts}/${max_retries} failed:`,
          lastError.message
        )

        // If this was the last attempt, log error and return
        if (attempts >= max_retries) {
          const latencyMs = Date.now() - startTime

          await logUsage({
            supabase,
            userId: user.id,
            configId: config.id,
            providerId: config.provider_id,
            modelId,
            requestType: 'structured',
            latencyMs,
            status: 'error',
            errorMessage: lastError.message,
            modelInfo,
          })

          return NextResponse.json(
            {
              error: 'Failed to generate valid structured output',
              details: lastError.message,
              attempts,
            },
            { status: 500 }
          )
        }

        // Add error feedback to messages for next attempt
        messagesWithInstruction.push({
          role: 'assistant',
          content: '[Previous attempt failed validation]',
        })
        messagesWithInstruction.push({
          role: 'user',
          content: `Your previous response failed validation with error: ${lastError.message}. Please try again and ensure your response matches the schema exactly.`,
        })
      }
    }

    // Should not reach here, but TypeScript needs a return
    return NextResponse.json(
      { error: 'Unexpected error in structured output' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Structured output API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Parse JSON from LLM response
 * Handles various formats the LLM might return
 */
function parseJsonFromResponse(content: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(content)
  } catch {
    // Continue to other methods
  }

  // Try to extract JSON from markdown code block
  const jsonBlockMatch = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim())
    } catch {
      // Continue
    }
  }

  // Try to find JSON object in the response
  const jsonObjectMatch = content.match(/\{[\s\S]*\}/)
  if (jsonObjectMatch) {
    try {
      return JSON.parse(jsonObjectMatch[0])
    } catch {
      // Continue
    }
  }

  // Try to find JSON array
  const jsonArrayMatch = content.match(/\[[\s\S]*\]/)
  if (jsonArrayMatch) {
    try {
      return JSON.parse(jsonArrayMatch[0])
    } catch {
      // Continue
    }
  }

  throw new Error('Could not parse JSON from response')
}

/**
 * Convert Zod schema to JSON Schema format
 */
function schemaToJsonObject(schema: z.ZodType): Record<string, unknown> {
  // Simple conversion for basic schemas
  // For more complex schemas, consider using zod-to-json-schema package
  const result: Record<string, unknown> = {
    type: 'object',
    properties: {},
    required: [],
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const properties: Record<string, unknown> = {}
    const required: string[] = []

    for (const [key, value] of Object.entries(shape)) {
      properties[key] = zodTypeToJsonSchema(value as z.ZodType)

      // Check if field is optional
      if (!(value instanceof z.ZodOptional)) {
        required.push(key)
      }
    }

    result.properties = properties
    result.required = required
  }

  return result
}

/**
 * Convert Zod type to JSON Schema
 */
function zodTypeToJsonSchema(zodType: z.ZodType): Record<string, unknown> {
  if (zodType instanceof z.ZodString) {
    return { type: 'string' }
  }
  if (zodType instanceof z.ZodNumber) {
    return { type: 'number' }
  }
  if (zodType instanceof z.ZodBoolean) {
    return { type: 'boolean' }
  }
  if (zodType instanceof z.ZodArray) {
    return {
      type: 'array',
      items: zodTypeToJsonSchema(zodType.element),
    }
  }
  if (zodType instanceof z.ZodObject) {
    return schemaToJsonObject(zodType)
  }
  if (zodType instanceof z.ZodOptional) {
    return zodTypeToJsonSchema(zodType.unwrap())
  }
  if (zodType instanceof z.ZodNullable) {
    return {
      ...zodTypeToJsonSchema(zodType.unwrap()),
      nullable: true,
    }
  }
  if (zodType instanceof z.ZodEnum) {
    return {
      type: 'string',
      enum: zodType.options,
    }
  }
  if (zodType instanceof z.ZodNativeEnum) {
    return {
      type: 'string',
      enum: Object.values(zodType.enum),
    }
  }
  if (zodType instanceof z.ZodLiteral) {
    return { const: zodType.value }
  }

  // Default fallback
  return {}
}

/**
 * Log LLM usage to database
 */
async function logUsage({
  supabase,
  userId,
  configId,
  providerId,
  modelId,
  requestType,
  inputTokens = 0,
  outputTokens = 0,
  latencyMs,
  status,
  errorMessage,
  modelInfo,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  configId: string
  providerId: string
  modelId: string
  requestType: 'chat' | 'structured' | 'embedding' | 'other'
  inputTokens?: number
  outputTokens?: number
  latencyMs: number
  status: 'success' | 'error' | 'timeout' | 'rate_limited'
  errorMessage?: string
  modelInfo?: LLMModel | null
}): Promise<void> {
  try {
    let estimatedCostUsd = 0
    if (modelInfo) {
      estimatedCostUsd =
        (inputTokens / 1000) * modelInfo.inputPricePer1k +
        (outputTokens / 1000) * modelInfo.outputPricePer1k
    }

    await supabase.from('llm_usage_logs').insert({
      user_id: userId,
      config_id: configId,
      provider_id: providerId,
      model_id: modelId,
      request_type: requestType,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      estimated_cost_usd: estimatedCostUsd,
      latency_ms: latencyMs,
      status,
      error_message: errorMessage || null,
    })
  } catch (error) {
    console.error('Failed to log usage:', error)
  }
}