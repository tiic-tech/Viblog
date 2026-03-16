import { createClient } from '@/lib/supabase/server'
import { decrypt, isEncrypted } from '@/lib/encryption'

export interface DecryptedApiKeys {
  llm: {
    provider: string | null
    model: string | null
    apiKey: string | null
  } | null
  database: {
    type: string | null
    connectionString: string | null
  } | null
}

/**
 * Get decrypted API keys for the current user
 */
export async function getDecryptedApiKeys(): Promise<DecryptedApiKeys | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select(
        'llm_provider, llm_model, llm_api_key_encrypted, database_type, database_url_encrypted'
      )
      .eq('user_id', user.id)
      .single()

    if (error || !settings) return null

    let decryptedApiKey = null
    if (settings.llm_api_key_encrypted) {
      try {
        decryptedApiKey = isEncrypted(settings.llm_api_key_encrypted)
          ? decrypt(settings.llm_api_key_encrypted)
          : settings.llm_api_key_encrypted
      } catch {
        console.error('Failed to decrypt LLM API key')
      }
    }

    let decryptedDbUrl = null
    if (settings.database_url_encrypted) {
      try {
        decryptedDbUrl = isEncrypted(settings.database_url_encrypted)
          ? decrypt(settings.database_url_encrypted)
          : settings.database_url_encrypted
      } catch {
        console.error('Failed to decrypt database URL')
      }
    }

    return {
      llm:
        settings.llm_provider || settings.llm_model || decryptedApiKey
          ? { provider: settings.llm_provider, model: settings.llm_model, apiKey: decryptedApiKey }
          : null,
      database:
        settings.database_type || decryptedDbUrl
          ? { type: settings.database_type, connectionString: decryptedDbUrl }
          : null,
    }
  } catch {
    return null
  }
}
