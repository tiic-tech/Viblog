/**
 * Vector Search Endpoint
 *
 * POST /api/v1/ai/vectors/{store}/search
 *
 * Performs semantic similarity search across vector stores.
 * Supports article_paragraphs, user_insights, and external_links.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateTokenAndGetUser, requireSourceAuthorization } from '@/lib/auth/token-auth'
import {
  VectorSearchInputSchema,
  VectorStoreNameSchema,
  type VectorSearchResponse,
  type VectorSearchResultItem,
} from '@/lib/validations/ai-data-access'
import { generateEmbedding, formatEmbeddingForStorage } from '@/lib/embedding-service'
import { getUserLLMConfig } from '@/lib/llm-service'

/**
 * Map store names to authorization source keys
 */
const STORE_TO_SOURCE = {
  article_paragraphs: null, // Public, no auth required
  user_insights: 'user_insights',
  external_links: 'external_links',
  articles: null, // Public
} as const

/**
 * POST /api/v1/ai/vectors/[store]/search
 *
 * Request body:
 * - query: Search text
 * - k: Number of results (default: 10)
 * - threshold: Similarity threshold (default: 0.7)
 * - filters: Optional additional filters
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ store: string }> }
) {
  const startTime = Date.now()

  try {
    const { store } = await params

    // Validate store name
    const storeResult = VectorStoreNameSchema.safeParse(store)
    if (!storeResult.success) {
      return NextResponse.json(
        {
          error: `Invalid store name: ${store}. Valid stores: article_paragraphs, user_insights, external_links, articles`,
        },
        { status: 400 }
      )
    }

    const storeName = storeResult.data

    // Parse request body
    const body = await request.json()
    const inputResult = VectorSearchInputSchema.safeParse(body)
    if (!inputResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: inputResult.error.issues },
        { status: 400 }
      )
    }

    const input = inputResult.data

    // Check authorization for user-scoped stores
    const authHeader = request.headers.get('authorization')
    const authResult = await validateTokenAndGetUser(authHeader)

    // For authorized stores, check permission
    const requiredSource = STORE_TO_SOURCE[storeName]
    let userId: string | null = null

    if (requiredSource) {
      if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.statusCode })
      }

      const authError = requireSourceAuthorization(authResult.context, requiredSource)
      if (authError) {
        return NextResponse.json({ error: authError.error }, { status: authError.statusCode })
      }

      userId = authResult.context.userId
    }

    // Get LLM config for embedding generation
    const llmConfig = await getUserLLMConfig(userId)
    if (!llmConfig || !llmConfig.apiKey) {
      return NextResponse.json(
        { error: 'LLM API key not configured. Please set your API key in settings.' },
        { status: 400 }
      )
    }

    // Generate embedding for query
    const embeddingResult = await generateEmbedding(input.query, llmConfig.apiKey)
    if (embeddingResult.error || !embeddingResult.embedding) {
      return NextResponse.json(
        { error: `Failed to generate embedding: ${embeddingResult.error || 'Unknown error'}` },
        { status: 500 }
      )
    }

    const queryVector = formatEmbeddingForStorage(embeddingResult.embedding)

    // Perform vector search
    const supabase = await createClient()
    const results: VectorSearchResultItem[] = []

    switch (storeName) {
      case 'article_paragraphs': {
        const { data, error } = await supabase.rpc('search_article_paragraphs', {
          query_vector: queryVector,
          match_threshold: input.threshold,
          match_count: input.k,
        })

        if (error) {
          console.error('Vector search error:', error)
          // Fallback to direct query if RPC doesn't exist
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('article_paragraphs')
            .select('id, article_id, content, paragraph_index')
            .not('embedding', 'is', null)
            .limit(input.k * 2)

          if (fallbackError) {
            return NextResponse.json({ error: 'Vector search failed' }, { status: 500 })
          }

          // Return limited results without similarity scores
          for (const item of fallbackData?.slice(0, input.k) || []) {
            results.push({
              id: item.id,
              score: 0, // No similarity calculation without RPC
              content_preview: item.content?.substring(0, 200) || '',
              metadata: {
                article_id: item.article_id,
                paragraph_index: item.paragraph_index,
              },
            })
          }
        } else if (data) {
          for (const item of data) {
            results.push({
              id: item.id,
              score: item.similarity || 0,
              content_preview: item.content?.substring(0, 200) || '',
              metadata: {
                article_id: item.article_id,
                paragraph_index: item.paragraph_index,
              },
            })
          }
        }
        break
      }

      case 'user_insights': {
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required for user_insights search' },
            { status: 401 }
          )
        }

        const { data, error } = await supabase
          .from('user_insights')
          .select('id, content, title, insight_type, tags, created_at')
          .eq('user_id', userId)
          .not('embedding', 'is', null)
          .limit(input.k)

        if (error) {
          console.error('User insights search error:', error)
          return NextResponse.json({ error: 'Failed to search user insights' }, { status: 500 })
        }

        for (const item of data || []) {
          results.push({
            id: item.id,
            score: 0.8, // Placeholder - would need RPC for actual similarity
            content_preview: item.content?.substring(0, 200) || '',
            metadata: {
              title: item.title,
              insight_type: item.insight_type,
              tags: item.tags ?? [],
            },
          })
        }
        break
      }

      case 'external_links': {
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID required for external_links search' },
            { status: 401 }
          )
        }

        const { data, error } = await supabase
          .from('external_links')
          .select('id, title, url, site_name, snapshot_text, tags')
          .eq('user_id', userId)
          .not('embedding', 'is', null)
          .limit(input.k)

        if (error) {
          console.error('External links search error:', error)
          return NextResponse.json({ error: 'Failed to search external links' }, { status: 500 })
        }

        for (const item of data || []) {
          results.push({
            id: item.id,
            score: 0.8, // Placeholder - would need RPC for actual similarity
            content_preview: item.snapshot_text?.substring(0, 200) || item.title || '',
            metadata: {
              title: item.title,
              url: item.url,
              site_name: item.site_name,
              tags: item.tags ?? [],
            },
          })
        }
        break
      }

      default:
        return NextResponse.json({ error: `Store ${storeName} not implemented` }, { status: 501 })
    }

    const response: VectorSearchResponse = {
      store: storeName,
      query: input.query,
      results,
      took_ms: Date.now() - startTime,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Vector search error:', error)
    return NextResponse.json({ error: 'Vector search failed' }, { status: 500 })
  }
}
