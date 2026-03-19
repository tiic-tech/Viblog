import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/llm/models
 * List models for a specific provider or all models
 * Query params: provider_id (optional)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('provider_id')

    // Build query
    let query = supabase
      .from('llm_models')
      .select(
        `
        id,
        provider_id,
        model_id,
        display_name,
        capabilities,
        context_window,
        max_output_tokens,
        input_price_per_1k,
        output_price_per_1k,
        supported_params,
        is_active
      `
      )
      .eq('is_active', true)
      .order('display_name')

    // Filter by provider if specified
    if (providerId) {
      query = query.eq('provider_id', providerId)
    }

    const { data: models, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to API response format
    const response = {
      models: (models || []).map((model: Record<string, unknown>) => ({
        id: model.id,
        providerId: model.provider_id,
        modelId: model.model_id,
        displayName: model.display_name,
        capabilities: model.capabilities,
        contextWindow: model.context_window,
        maxOutputTokens: model.max_output_tokens,
        inputPricePer1k: model.input_price_per_1k,
        outputPricePer1k: model.output_price_per_1k,
        supportedParams: model.supported_params,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}
