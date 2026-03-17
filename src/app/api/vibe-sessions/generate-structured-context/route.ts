import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { dualAuthenticate } from '@/lib/auth/dual-auth'
import { generateStructuredContext } from '@/lib/llm-service'
import {
  GenerateStructuredContextInputSchema,
  StructuredVibeContextSchema,
} from '@/lib/validations/structured-context'

/**
 * Get the appropriate Supabase client based on authentication method.
 */
function getSupabaseClient(authMethod: 'session' | 'mcp_api') {
  if (authMethod === 'mcp_api') {
    return createServiceRoleClient()
  }
  return createClient()
}

/**
 * POST /api/vibe-sessions/generate-structured-context
 * Generate structured context from raw session data using LLM
 */
export async function POST(request: Request) {
  try {
    const authResult = await dualAuthenticate(request)
    if (!authResult.success) {
      return authResult.error
    }
    const { userId, authMethod } = authResult.data

    const supabase = await getSupabaseClient(authMethod)

    const body = await request.json()
    const validated = GenerateStructuredContextInputSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }

    const input = validated.data

    // Verify session ownership and get fragments
    const { data: session, error: sessionError } = await supabase
      .from('vibe_sessions')
      .select('id, status')
      .eq('id', input.session_id)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Fetch all fragments for the session
    const { data: fragments, error: fragmentsError } = await supabase
      .from('session_fragments')
      .select('fragment_type, content, sequence_number, metadata')
      .eq('session_id', input.session_id)
      .order('sequence_number', { ascending: true })

    if (fragmentsError) {
      return NextResponse.json({ error: fragmentsError.message }, { status: 500 })
    }

    if (!fragments || fragments.length === 0) {
      return NextResponse.json({ error: 'No fragments found in session' }, { status: 400 })
    }

    // Build raw context string from fragments
    const rawContext = fragments
      .map((f) => {
        const header = `[${f.fragment_type.toUpperCase()} #${f.sequence_number}]`
        return `${header}\n${f.content}`
      })
      .join('\n\n---\n\n')

    // Generate structured context using LLM
    const { data: structuredContext, error: llmError } = await generateStructuredContext(
      rawContext,
      input
    )

    if (llmError || !structuredContext) {
      return NextResponse.json({ error: llmError ?? 'Failed to generate' }, { status: 500 })
    }

    // Validate the output
    const validatedOutput = StructuredVibeContextSchema.safeParse(structuredContext)
    if (!validatedOutput.success) {
      return NextResponse.json(
        { error: 'Invalid LLM output', details: validatedOutput.error.errors },
        { status: 500 }
      )
    }

    // Store the structured context in the session's raw_context field
    await supabase
      .from('vibe_sessions')
      .update({ raw_context: validatedOutput.data })
      .eq('id', input.session_id)

    return NextResponse.json({
      success: true,
      structured_context: validatedOutput.data,
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to generate structured context: ${errorMessage}` },
      { status: 500 }
    )
  }
}