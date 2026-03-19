import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/llm/config/primary
 * Set a provider as the user's primary provider
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { config_id, provider_id } = body

    // Must provide either config_id or provider_id
    if (!config_id && !provider_id) {
      return NextResponse.json({ error: 'config_id or provider_id is required' }, { status: 400 })
    }

    // Find the config to make primary
    let targetConfigId = config_id

    if (!targetConfigId && provider_id) {
      // Find config by provider_id
      const { data: config } = await supabase
        .from('user_llm_configs')
        .select('id')
        .eq('user_id', user.id)
        .eq('provider_id', provider_id)
        .single()

      if (!config) {
        return NextResponse.json({
          error: 'No configuration found for this provider',
        }, { status: 404 })
      }

      targetConfigId = config.id
    }

    // Verify the config belongs to the user
    const { data: existingConfig } = await supabase
      .from('user_llm_configs')
      .select('id, provider_id')
      .eq('id', targetConfigId)
      .eq('user_id', user.id)
      .single()

    if (!existingConfig) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
    }

    // Unset all primary flags for this user
    await supabase
      .from('user_llm_configs')
      .update({ is_primary: false })
      .eq('user_id', user.id)

    // Set the new primary
    const { data: config, error } = await supabase
      .from('user_llm_configs')
      .update({ is_primary: true })
      .eq('id', targetConfigId)
      .select('id, provider_id, is_primary')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error setting primary provider:', error)
    return NextResponse.json({ error: 'Failed to set primary provider' }, { status: 500 })
  }
}