import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { dualAuthenticate } from '@/lib/auth/dual-auth'
import { generateArticleDraft, generateStructuredContext } from '@/lib/llm-service'
import {
  GenerateArticleDraftInputSchema,
  ArticleDraftSchema,
  StructuredVibeContext,
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
 * POST /api/vibe-sessions/generate-article-draft
 * Generate article draft from session using LLM
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
    const validated = GenerateArticleDraftInputSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }

    const input = validated.data

    // Verify session ownership and get session data
    const { data: session, error: sessionError } = await supabase
      .from('vibe_sessions')
      .select('id, status, raw_context, metadata')
      .eq('id', input.session_id)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check if structured context exists, if not generate it
    let structuredContext = session.raw_context

    if (!structuredContext || typeof structuredContext !== 'object') {
      // Fetch fragments and generate structured context first
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

      // Build raw context string
      const rawContext = fragments
        .map((f) => {
          const header = `[${f.fragment_type.toUpperCase()} #${f.sequence_number}]`
          return `${header}\n${f.content}`
        })
        .join('\n\n---\n\n')

      // Generate structured context
      const { data: generated, error: genError } = await generateStructuredContext(rawContext, {
        session_id: input.session_id,
        format: 'standard',
      })

      if (genError || !generated) {
        return NextResponse.json(
          { error: genError ?? 'Failed to generate structured context' },
          { status: 500 }
        )
      }

      structuredContext = generated
    }

    // Generate article draft using LLM
    const { data: articleDraft, error: draftError } = await generateArticleDraft(
      structuredContext as StructuredVibeContext,
      input
    )

    if (draftError || !articleDraft) {
      return NextResponse.json(
        { error: draftError ?? 'Failed to generate article draft' },
        { status: 500 }
      )
    }

    // Validate the output
    const validatedOutput = ArticleDraftSchema.safeParse(articleDraft)
    if (!validatedOutput.success) {
      return NextResponse.json(
        { error: 'Invalid LLM output', details: validatedOutput.error.errors },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      article_draft: validatedOutput.data,
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to generate article draft: ${errorMessage}` },
      { status: 500 }
    )
  }
}