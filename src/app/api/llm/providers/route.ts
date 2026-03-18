import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllProviders } from '@/lib/llm'

/**
 * GET /api/llm/providers
 * List all available LLM providers with their capabilities
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Public endpoint - no auth required, but check if user is logged in
    // to include their configuration status

    // Get all providers from the database
    const { data: providers, error } = await supabase
      .from('llm_providers')
      .select('id, name, capabilities, is_active')
      .eq('is_active', true)
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get models for each provider
    const { data: models, error: modelsError } = await supabase
      .from('llm_models')
      .select('id, provider_id, model_id, display_name, capabilities, is_active')
      .eq('is_active', true)

    if (modelsError) {
      return NextResponse.json({ error: modelsError.message }, { status: 500 })
    }

    // Group models by provider
    const modelsByProvider = (models || []).reduce((acc, model) => {
      if (!acc[model.provider_id]) {
        acc[model.provider_id] = []
      }
      acc[model.provider_id].push({
        id: model.id,
        modelId: model.model_id,
        displayName: model.display_name,
        capabilities: model.capabilities,
      })
      return acc
    }, {} as Record<string, Array<{ id: string; modelId: string; displayName: string; capabilities: unknown }>>)

    // If user is logged in, check their configured providers
    let userConfigs: Array<{ provider_id: string; is_primary: boolean }> = []
    if (user) {
      const { data: configs } = await supabase
        .from('user_llm_configs')
        .select('provider_id, is_primary')
        .eq('user_id', user.id)

      userConfigs = configs || []
    }

    // Build response
    const response = {
      providers: (providers || []).map((provider) => {
        const userConfig = userConfigs.find((c) => c.provider_id === provider.id)
        return {
          id: provider.id,
          name: provider.name,
          capabilities: provider.capabilities,
          models: modelsByProvider[provider.id] || [],
          isConfigured: !!userConfig,
          isPrimary: userConfig?.is_primary || false,
        }
      }),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
  }
}