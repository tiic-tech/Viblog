import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encrypt, maskApiKey } from '@/lib/encryption'
import { isProviderSupported } from '@/lib/llm'

/**
 * GET /api/llm/config
 * List user's LLM configurations
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's configurations with provider and model details
    const { data: configs, error } = await supabase
      .from('user_llm_configs')
      .select(
        `
        id,
        provider_id,
        api_key_encrypted,
        default_model_id,
        custom_params,
        custom_prompts,
        is_primary,
        last_validated_at,
        llm_providers (
          name,
          capabilities
        ),
        llm_models (
          model_id,
          display_name
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform response - mask API keys
    // Note: Supabase returns joined data as arrays for foreign key relationships
    const response = {
      configs: (configs || []).map((config) => {
        // Handle provider data (may be array or object depending on relationship)
        const provider = Array.isArray(config.llm_providers)
          ? config.llm_providers[0]
          : config.llm_providers

        // Handle model data (may be array or object depending on relationship)
        const model = Array.isArray(config.llm_models) ? config.llm_models[0] : config.llm_models

        return {
          id: config.id,
          providerId: config.provider_id,
          providerName: provider?.name,
          providerCapabilities: provider?.capabilities,
          hasApiKey: !!config.api_key_encrypted,
          apiKeyMasked: maskApiKey(config.api_key_encrypted),
          defaultModelId: config.default_model_id,
          defaultModel: model
            ? {
                modelId: model.model_id,
                displayName: model.display_name,
              }
            : null,
          customParams: config.custom_params,
          customPrompts: config.custom_prompts,
          isPrimary: config.is_primary,
          lastValidatedAt: config.last_validated_at,
        }
      }),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching configs:', error)
    return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 })
  }
}

/**
 * POST /api/llm/config
 * Create or update a user's LLM configuration
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { provider_id, api_key, default_model_id, custom_params, custom_prompts } = body

    // Validate required fields
    if (!provider_id) {
      return NextResponse.json({ error: 'provider_id is required' }, { status: 400 })
    }

    // Validate provider is supported
    if (!isProviderSupported(provider_id)) {
      return NextResponse.json({ error: 'Invalid provider_id' }, { status: 400 })
    }

    // Encrypt API key if provided
    let apiKeyEncrypted: string | null = null
    if (api_key) {
      try {
        apiKeyEncrypted = encrypt(api_key)
      } catch {
        return NextResponse.json({ error: 'Failed to encrypt API key' }, { status: 500 })
      }
    }

    // Check if config already exists
    const { data: existingConfig } = await supabase
      .from('user_llm_configs')
      .select('id, is_primary')
      .eq('user_id', user.id)
      .eq('provider_id', provider_id)
      .single()

    if (existingConfig) {
      // Update existing config
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (apiKeyEncrypted) {
        updateData.api_key_encrypted = apiKeyEncrypted
      }
      if (default_model_id !== undefined) {
        updateData.default_model_id = default_model_id
      }
      if (custom_params !== undefined) {
        updateData.custom_params = custom_params
      }
      if (custom_prompts !== undefined) {
        updateData.custom_prompts = custom_prompts
      }

      const { data: config, error } = await supabase
        .from('user_llm_configs')
        .update(updateData)
        .eq('id', existingConfig.id)
        .select('id, provider_id, is_primary')
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ config, updated: true })
    }

    // Check if this is the user's first config (make it primary)
    const { count } = await supabase
      .from('user_llm_configs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const isPrimary = count === 0

    // Create new config
    const { data: config, error } = await supabase
      .from('user_llm_configs')
      .insert({
        user_id: user.id,
        provider_id,
        api_key_encrypted: apiKeyEncrypted,
        default_model_id,
        custom_params: custom_params || {},
        custom_prompts: custom_prompts || {},
        is_primary: isPrimary,
      })
      .select('id, provider_id, is_primary')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ config, created: true })
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}

/**
 * DELETE /api/llm/config
 * Remove a user's LLM configuration
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const configId = searchParams.get('id')

    if (!configId) {
      return NextResponse.json({ error: 'id parameter is required' }, { status: 400 })
    }

    // Verify ownership and delete
    const { data: config, error: fetchError } = await supabase
      .from('user_llm_configs')
      .select('id, is_primary')
      .eq('id', configId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
    }

    const wasPrimary = config.is_primary

    // Delete the config
    const { error } = await supabase
      .from('user_llm_configs')
      .delete()
      .eq('id', configId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If deleted config was primary, assign a new primary
    if (wasPrimary) {
      const { data: remainingConfigs } = await supabase
        .from('user_llm_configs')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (remainingConfigs) {
        await supabase
          .from('user_llm_configs')
          .update({ is_primary: true })
          .eq('id', remainingConfigs.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting config:', error)
    return NextResponse.json({ error: 'Failed to delete configuration' }, { status: 500 })
  }
}

/**
 * PATCH /api/llm/config
 * Update specific fields of a configuration
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, default_model_id, custom_params, custom_prompts } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (default_model_id !== undefined) {
      updateData.default_model_id = default_model_id
    }
    if (custom_params !== undefined) {
      updateData.custom_params = custom_params
    }
    if (custom_prompts !== undefined) {
      updateData.custom_prompts = custom_prompts
    }

    // Update the config
    const { data: config, error } = await supabase
      .from('user_llm_configs')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, provider_id, is_primary')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 })
  }
}
