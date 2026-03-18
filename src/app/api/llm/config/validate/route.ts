import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProviderAdapter, isProviderSupported } from '@/lib/llm'

/**
 * POST /api/llm/config/validate
 * Validate an API key for a provider
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { provider_id, api_key } = body

    // Validate required fields
    if (!provider_id) {
      return NextResponse.json({ error: 'provider_id is required' }, { status: 400 })
    }

    if (!api_key) {
      return NextResponse.json({ error: 'api_key is required' }, { status: 400 })
    }

    // Validate provider is supported
    if (!isProviderSupported(provider_id)) {
      return NextResponse.json({ error: 'Invalid provider_id' }, { status: 400 })
    }

    // Get provider adapter
    const adapter = getProviderAdapter(provider_id)

    // Get provider base URL from database
    const { data: provider } = await supabase
      .from('llm_providers')
      .select('base_url')
      .eq('id', provider_id)
      .single()

    // Validate the API key
    try {
      const isValid = await adapter.validateApiKey(api_key, {
        apiKey: api_key,
        baseUrl: provider?.base_url,
      })

      if (!isValid) {
        return NextResponse.json({
          valid: false,
          error: 'API key validation failed',
        })
      }

      // Get available models on success
      const models = await adapter.getModels({
        apiKey: api_key,
        baseUrl: provider?.base_url,
      })

      // Update last_validated_at if user has a config for this provider
      await supabase
        .from('user_llm_configs')
        .update({ last_validated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('provider_id', provider_id)

      return NextResponse.json({
        valid: true,
        models: models.map((m) => ({
          modelId: m.modelId,
          displayName: m.displayName,
        })),
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json({
        valid: false,
        error: errorMessage,
      })
    }
  } catch (error) {
    console.error('Error validating API key:', error)
    return NextResponse.json({ error: 'Failed to validate API key' }, { status: 500 })
  }
}