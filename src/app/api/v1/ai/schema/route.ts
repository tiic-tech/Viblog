/**
 * AI Data Schema Endpoint
 *
 * GET /api/v1/ai/schema
 *
 * Returns available data sources, schemas, and configurations based on authorization.
 * Enables AI agents to discover what data is available before querying.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateTokenAndGetUser, TokenContext } from '@/lib/auth/token-auth'
import type { AIDataSchemaResponse, AuthorizedSources } from '@/lib/validations/ai-data-access'

/**
 * Vector store configurations
 */
const VECTOR_STORES = [
  {
    name: 'article_paragraphs',
    tableName: 'article_paragraphs',
    dimension: 1536,
    metric: 'cosine' as const,
    searchEndpoint: '/api/v1/ai/vectors/article_paragraphs/search',
    description: 'Article paragraph embeddings for semantic search',
    access: 'public' as const,
  },
  {
    name: 'user_insights',
    tableName: 'user_insights',
    dimension: 1536,
    metric: 'cosine' as const,
    searchEndpoint: '/api/v1/ai/vectors/user_insights/search',
    description: 'User insight embeddings for personalized search',
    access: 'authorized' as const,
  },
  {
    name: 'external_links',
    tableName: 'external_links',
    dimension: 1536,
    metric: 'cosine' as const,
    searchEndpoint: '/api/v1/ai/vectors/external_links/search',
    description: 'External link snapshot embeddings',
    access: 'authorized' as const,
  },
]

/**
 * Knowledge graph configurations
 */
const KNOWLEDGE_GRAPHS = [
  {
    name: 'user_knowledge',
    nodeTypes: ['insight', 'article', 'link', 'project', 'tag'],
    edgeTypes: ['cites', 'references', 'related_to', 'belongs_to', 'tagged_with'],
    queryEndpoint: '/api/v1/ai/graph/user_knowledge/query',
    description: 'User knowledge graph connecting insights, articles, and links',
    access: 'authorized' as const,
  },
  {
    name: 'insight_network',
    nodeTypes: ['insight', 'link', 'article'],
    edgeTypes: ['derived_from', 'supports', 'contradicts'],
    queryEndpoint: '/api/v1/ai/graph/insight_network/query',
    description: 'Network of insights connected to external sources',
    access: 'authorized' as const,
  },
]

/**
 * Time series configurations
 */
const TIME_SERIES: Array<{
  name: string
  tableName: string
  metrics: string[]
  granularity: Array<'hour' | 'day' | 'week' | 'month'>
  queryEndpoint: string
  description: string
}> = [
  {
    name: 'article_views',
    tableName: 'user_interactions',
    metrics: ['views', 'unique_views', 'avg_duration'],
    granularity: ['hour', 'day', 'week'],
    queryEndpoint: '/api/v1/ai/timeseries/article_views',
    description: 'Article view analytics over time',
  },
  {
    name: 'user_engagement',
    tableName: 'user_interactions',
    metrics: ['interactions', 'sessions', 'actions'],
    granularity: ['day', 'week', 'month'],
    queryEndpoint: '/api/v1/ai/timeseries/user_engagement',
    description: 'User engagement metrics over time',
  },
]

/**
 * Build authorization status from token context and sources
 */
function buildAuthorizationStatus(
  context: TokenContext | null,
  sources: AuthorizedSources | null
): { granted: string[]; pending: string[]; unavailable: string[] } {
  const allSources = ['user_insights', 'external_links', 'vibe_sessions', 'knowledge_graph']
  const granted: string[] = []
  const pending: string[] = []
  const unavailable: string[] = []

  if (!context || !sources) {
    // No authorization, all sources are unavailable
    return {
      granted: [],
      pending: [],
      unavailable: allSources,
    }
  }

  for (const source of allSources) {
    if (sources[source as keyof AuthorizedSources]) {
      granted.push(source)
    } else {
      unavailable.push(source)
    }
  }

  return { granted, pending, unavailable }
}

/**
 * Filter vector stores based on authorization
 */
function filterVectorStores(context: TokenContext | null) {
  return VECTOR_STORES.map((store) => {
    const isAuthorized =
      store.access === 'public' ||
      (context?.sources &&
        (store.name === 'user_insights'
          ? context.sources.user_insights
          : store.name === 'external_links'
            ? context.sources.external_links
            : true))

    return {
      ...store,
      accessible: isAuthorized,
    }
  })
}

/**
 * Filter knowledge graphs based on authorization
 */
function filterKnowledgeGraphs(context: TokenContext | null) {
  return KNOWLEDGE_GRAPHS.map((graph) => {
    const isAuthorized = context?.sources?.knowledge_graph === true

    return {
      ...graph,
      accessible: isAuthorized,
    }
  })
}

/**
 * GET /api/v1/ai/schema
 *
 * Returns the complete AI data access schema for the authenticated token.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const authResult = await validateTokenAndGetUser(authHeader)

    // Determine context based on auth result
    const context = 'context' in authResult ? authResult.context : null
    const sources = context?.sources || null

    const supabase = await createClient()

    // Get table row counts for datasources
    const [articlesCount, paragraphsCount, insightsCount, linksCount] = await Promise.all([
      supabase.from('articles').select('id', { count: 'exact', head: true }),
      supabase.from('article_paragraphs').select('id', { count: 'exact', head: true }),
      supabase.from('user_insights').select('id', { count: 'exact', head: true }),
      supabase.from('external_links').select('id', { count: 'exact', head: true }),
    ])

    // Build datasources list
    const datasources = [
      {
        name: 'articles',
        type: 'table' as const,
        access: 'public' as const,
        description: 'Published articles',
        rowCount: articlesCount.count || 0,
      },
      {
        name: 'article_paragraphs',
        type: 'table' as const,
        access: 'public' as const,
        description: 'Article content paragraphs with embeddings',
        rowCount: paragraphsCount.count || 0,
      },
      {
        name: 'user_insights',
        type: 'table' as const,
        access: 'authorized' as const,
        description: 'User insights and notes',
        rowCount: insightsCount.count || 0,
      },
      {
        name: 'external_links',
        type: 'table' as const,
        access: 'authorized' as const,
        description: 'External link snapshots',
        rowCount: linksCount.count || 0,
      },
    ]

    // Build schemas (simplified JSON schemas)
    const schemas = [
      {
        name: 'article',
        jsonSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            excerpt: { type: 'string' },
            published_at: { type: 'string', format: 'date-time' },
            views_count: { type: 'integer' },
            stars_count: { type: 'integer' },
          },
        },
        endpoints: {
          read: '/api/v1/articles',
        },
      },
      {
        name: 'user_insight',
        jsonSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            title: { type: 'string' },
            insight_type: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        endpoints: {
          read: '/api/v1/insights',
        },
      },
    ]

    // Build response
    const response: AIDataSchemaResponse = {
      datasources,
      schemas,
      vectorStores: filterVectorStores(context).map((store) => ({
        name: store.name,
        tableName: store.tableName,
        dimension: store.dimension,
        metric: store.metric,
        searchEndpoint: store.searchEndpoint,
        description: store.description,
      })),
      knowledgeGraphs: filterKnowledgeGraphs(context).map((graph) => ({
        name: graph.name,
        nodeTypes: graph.nodeTypes,
        edgeTypes: graph.edgeTypes,
        queryEndpoint: graph.queryEndpoint,
        description: graph.description,
      })),
      timeSeries: TIME_SERIES.map((ts) => ({
        name: ts.name,
        tableName: ts.tableName,
        metrics: ts.metrics,
        granularity: ts.granularity,
        queryEndpoint: ts.queryEndpoint,
        description: ts.description,
      })),
      authorization: buildAuthorizationStatus(context, sources),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('AI Schema error:', error)
    return NextResponse.json({ error: 'Failed to retrieve AI schema' }, { status: 500 })
  }
}
