import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { getProviderAdapter, isProviderSupported } from '@/lib/llm'
import type { ChatMessage, ChatCompletionOptions, LLMModel } from '@/lib/llm/types'

/**
 * GET /api/llm/chat
 * Health check for chat endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/llm/chat',
    methods: ['POST'],
    description: 'LLM chat completion with streaming support',
  })
}

/**
 * POST /api/llm/chat
 * Chat completion endpoint with streaming support
 *
 * Request body:
 * - messages: ChatMessage[] - Conversation messages
 * - stream: boolean - Enable streaming (default: false)
 * - provider_id: string - Provider to use (optional, uses primary if not specified)
 * - model: string - Model override (optional)
 * - temperature: number - Temperature override (optional)
 * - max_tokens: number - Max tokens override (optional)
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
      stream = false,
      provider_id,
      model: modelOverride,
      temperature,
      max_tokens,
      top_p,
      stop,
      frequency_penalty,
      presence_penalty,
    } = body

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      )
    }

    // Get user's LLM config
    let configQuery = supabase
      .from('user_llm_configs')
      .select(
        `
        id,
        provider_id,
        api_key_encrypted,
        default_model_id,
        custom_params,
        custom_prompts,
        is_primary
      `
      )
      .eq('user_id', user.id)

    if (provider_id) {
      // Use specified provider
      if (!isProviderSupported(provider_id)) {
        return NextResponse.json(
          { error: `Unsupported provider: ${provider_id}` },
          { status: 400 }
        )
      }
      configQuery = configQuery.eq('provider_id', provider_id)
    } else {
      // Use primary provider
      configQuery = configQuery.eq('is_primary', true)
    }

    const { data: config, error: configError } = await configQuery.single()

    if (configError || !config) {
      return NextResponse.json(
        {
          error: provider_id
            ? `No configuration found for provider: ${provider_id}`
            : 'No primary LLM configuration found. Please configure an LLM provider.',
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
    let modelInfo: LLMModel | null = null

    if (!modelId && config.default_model_id) {
      // Get default model info
      const { data: model } = await supabase
        .from('llm_models')
        .select('*')
        .eq('id', config.default_model_id)
        .single()

      if (model) {
        modelId = model.model_id
        modelInfo = {
          id: model.id,
          providerId: model.provider_id,
          modelId: model.model_id,
          displayName: model.display_name,
          capabilities: model.capabilities || {},
          contextWindow: model.context_window || 4096,
          maxOutputTokens: model.max_output_tokens || 2048,
          inputPricePer1k: Number(model.input_price_per_1k) || 0,
          outputPricePer1k: Number(model.output_price_per_1k) || 0,
          supportedParams: model.supported_params || [],
        }
      }
    }

    if (!modelId) {
      return NextResponse.json(
        { error: 'No model specified and no default model configured' },
        { status: 400 }
      )
    }

    // If model override was specified, get model info for cost calculation
    if (modelOverride && !modelInfo) {
      const { data: model } = await supabase
        .from('llm_models')
        .select('*')
        .eq('provider_id', config.provider_id)
        .eq('model_id', modelOverride)
        .single()

      if (model) {
        modelInfo = {
          id: model.id,
          providerId: model.provider_id,
          modelId: model.model_id,
          displayName: model.display_name,
          capabilities: model.capabilities || {},
          contextWindow: model.context_window || 4096,
          maxOutputTokens: model.max_output_tokens || 2048,
          inputPricePer1k: Number(model.input_price_per_1k) || 0,
          outputPricePer1k: Number(model.output_price_per_1k) || 0,
          supportedParams: model.supported_params || [],
        }
      }
    }

    // Build chat options
    const customParams = (config.custom_params as Record<string, unknown>) || {}
    const customPrompts =
      (config.custom_prompts as { systemPrompt?: string; userPromptTemplate?: string }) || {}

    const options: ChatCompletionOptions = {
      messages: applyCustomPrompts(messages, customPrompts),
      model: modelId,
      temperature: temperature ?? (customParams.temperature as number) ?? 0.7,
      maxTokens: max_tokens ?? (customParams.maxTokens as number) ?? 2048,
      topP: top_p ?? (customParams.topP as number),
      stop: stop ?? (customParams.stop as string | string[]),
      frequencyPenalty:
        frequency_penalty ?? (customParams.frequencyPenalty as number),
      presencePenalty:
        presence_penalty ?? (customParams.presencePenalty as number),
      stream,
    }

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

    // Handle streaming vs non-streaming
    if (stream) {
      return handleStreamingChat(
        adapter.chatStream(options, context),
        {
          supabase,
          userId: user.id,
          configId: config.id,
          providerId: config.provider_id,
          modelId,
          modelInfo,
          startTime,
        }
      )
    }

    // Non-streaming response
    try {
      const response = await adapter.chat(options, context)
      const latencyMs = Date.now() - startTime

      // Log usage
      await logUsage({
        supabase,
        userId: user.id,
        configId: config.id,
        providerId: config.provider_id,
        modelId,
        requestType: 'chat',
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        latencyMs,
        status: 'success',
        modelInfo,
      })

      return NextResponse.json({
        content: response.content,
        model: response.model,
        usage: response.usage,
        finishReason: response.finishReason,
        latencyMs,
      })
    } catch (error) {
      const latencyMs = Date.now() - startTime
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'

      // Log error
      await logUsage({
        supabase,
        userId: user.id,
        configId: config.id,
        providerId: config.provider_id,
        modelId,
        requestType: 'chat',
        latencyMs,
        status: 'error',
        errorMessage,
        modelInfo,
      })

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Apply custom prompts to messages
 */
function applyCustomPrompts(
  messages: ChatMessage[],
  customPrompts: { systemPrompt?: string; userPromptTemplate?: string }
): ChatMessage[] {
  const result: ChatMessage[] = []

  // Add custom system prompt if specified
  if (customPrompts.systemPrompt) {
    result.push({
      role: 'system',
      content: customPrompts.systemPrompt,
    })
  }

  // Process messages
  for (const msg of messages) {
    if (msg.role === 'user' && customPrompts.userPromptTemplate) {
      // Apply user prompt template
      result.push({
        role: 'user',
        content: customPrompts.userPromptTemplate.replace(
          '{content}',
          msg.content
        ),
      })
    } else {
      // Skip original system prompt if we have a custom one
      if (msg.role === 'system' && customPrompts.systemPrompt) {
        continue
      }
      result.push(msg)
    }
  }

  return result
}

/**
 * Handle streaming chat response with SSE
 */
async function handleStreamingChat(
  stream: AsyncIterable<{ delta: string; finishReason?: string | null; usage?: { inputTokens: number; outputTokens: number } }>,
  logData: {
    supabase: Awaited<ReturnType<typeof createClient>>
    userId: string
    configId: string
    providerId: string
    modelId: string
    modelInfo: LLMModel | null
    startTime: number
  }
): Promise<Response> {
  const encoder = new TextEncoder()
  let totalInputTokens = 0
  let totalOutputTokens = 0
  let errorOccurred = false
  let errorMessage = ''

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          // Track usage
          if (chunk.usage) {
            totalInputTokens = chunk.usage.inputTokens
            totalOutputTokens = chunk.usage.outputTokens
          }

          // Send SSE event
          const data = JSON.stringify({
            delta: chunk.delta,
            finishReason: chunk.finishReason,
            usage: chunk.usage,
          })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))

          // Check for completion
          if (chunk.finishReason) {
            break
          }
        }

        // Send done event
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()

        // Log successful usage
        const latencyMs = Date.now() - logData.startTime
        await logUsage({
          ...logData,
          requestType: 'chat',
          inputTokens: totalInputTokens,
          outputTokens: totalOutputTokens,
          latencyMs,
          status: 'success',
        })
      } catch (error) {
        errorOccurred = true
        errorMessage = error instanceof Error ? error.message : 'Unknown error'

        // Send error event
        const errorData = JSON.stringify({ error: errorMessage })
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        controller.close()

        // Log error
        const latencyMs = Date.now() - logData.startTime
        await logUsage({
          ...logData,
          requestType: 'chat',
          latencyMs,
          status: 'error',
          errorMessage,
        })
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
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
    // Calculate estimated cost
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
    // Don't fail the request if logging fails
    console.error('Failed to log usage:', error)
  }
}