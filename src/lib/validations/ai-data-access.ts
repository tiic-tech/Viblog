/**
 * AI Data Access Validation Schemas
 *
 * Zod schemas for validating AI data access API endpoints:
 * - Vector Search
 * - Knowledge Graph Query
 * - Time Series Analytics
 */

import { z } from 'zod'

// ============================================
// Vector Search Schemas
// ============================================

/**
 * Vector store names that support similarity search
 */
export const VectorStoreNameSchema = z.enum([
  'article_paragraphs',
  'user_insights',
  'external_links',
  'articles',
])

export type VectorStoreName = z.infer<typeof VectorStoreNameSchema>

/**
 * Vector search input validation
 */
export const VectorSearchInputSchema = z.object({
  query: z
    .string()
    .min(1, 'Query cannot be empty')
    .max(10000, 'Query too long (max 10000 characters)'),
  k: z
    .number()
    .int('k must be an integer')
    .min(1, 'k must be at least 1')
    .max(100, 'k cannot exceed 100')
    .default(10),
  threshold: z
    .number()
    .min(0, 'Threshold must be >= 0')
    .max(1, 'Threshold must be <= 1')
    .default(0.7),
  filters: z.record(z.unknown()).optional(),
})

export type VectorSearchInput = z.infer<typeof VectorSearchInputSchema>

/**
 * Vector search result item
 */
export const VectorSearchResultItemSchema = z.object({
  id: z.string().uuid(),
  score: z.number().min(0).max(1),
  content_preview: z.string(),
  metadata: z.record(z.unknown()),
})

export type VectorSearchResultItem = z.infer<typeof VectorSearchResultItemSchema>

/**
 * Vector search response
 */
export const VectorSearchResponseSchema = z.object({
  store: VectorStoreNameSchema,
  query: z.string(),
  results: z.array(VectorSearchResultItemSchema),
  took_ms: z.number().nonnegative(),
})

export type VectorSearchResponse = z.infer<typeof VectorSearchResponseSchema>

// ============================================
// Knowledge Graph Schemas
// ============================================

/**
 * Graph names that support querying
 */
export const GraphNameSchema = z.enum(['user_knowledge', 'insight_network'])

export type GraphName = z.infer<typeof GraphNameSchema>

/**
 * Graph query types
 */
export const GraphQueryTypeSchema = z.enum([
  'traverse', // Traverse from a start node
  'neighbors', // Get immediate neighbors
  'path', // Find path between two nodes
  'subgraph', // Extract a subgraph based on criteria
])

export type GraphQueryType = z.infer<typeof GraphQueryTypeSchema>

/**
 * Graph query input validation
 */
export const GraphQueryInputSchema = z
  .object({
    query_type: GraphQueryTypeSchema,
    start_node: z.string().uuid().optional(),
    end_node: z.string().uuid().optional(), // For path queries
    node_types: z.array(z.string()).optional(),
    edge_types: z.array(z.string()).optional(),
    max_depth: z
      .number()
      .int('max_depth must be an integer')
      .min(1, 'max_depth must be at least 1')
      .max(5, 'max_depth cannot exceed 5')
      .default(2),
    limit: z
      .number()
      .int('limit must be an integer')
      .min(1, 'limit must be at least 1')
      .max(500, 'limit cannot exceed 500')
      .default(100),
  })
  .refine(
    (data) => {
      // start_node is required for traverse, neighbors, and path queries
      if (['traverse', 'neighbors', 'path'].includes(data.query_type) && !data.start_node) {
        return false
      }
      // end_node is required for path queries
      if (data.query_type === 'path' && !data.end_node) {
        return false
      }
      return true
    },
    {
      message:
        'start_node is required for traverse/neighbors/path queries, end_node is required for path queries',
    }
  )

export type GraphQueryInput = z.infer<typeof GraphQueryInputSchema>

/**
 * Graph node
 */
export const GraphNodeSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  data: z.record(z.unknown()),
})

export type GraphNode = z.infer<typeof GraphNodeSchema>

/**
 * Graph edge
 */
export const GraphEdgeSchema = z.object({
  id: z.string().uuid(),
  source: z.string().uuid(),
  target: z.string().uuid(),
  type: z.string(),
  data: z.record(z.unknown()).nullable(),
})

export type GraphEdge = z.infer<typeof GraphEdgeSchema>

/**
 * Graph query response
 */
export const GraphQueryResponseSchema = z.object({
  graph: GraphNameSchema,
  query_type: GraphQueryTypeSchema,
  nodes: z.array(GraphNodeSchema),
  edges: z.array(GraphEdgeSchema),
  stats: z.object({
    nodes_found: z.number().int().nonnegative(),
    edges_found: z.number().int().nonnegative(),
    depth_reached: z.number().int().nonnegative(),
  }),
})

export type GraphQueryResponse = z.infer<typeof GraphQueryResponseSchema>

// ============================================
// Time Series Schemas
// ============================================

/**
 * Time series metric names
 */
export const TimeSeriesMetricSchema = z.enum([
  'article_views',
  'user_engagement',
  'session_activity',
])

export type TimeSeriesMetric = z.infer<typeof TimeSeriesMetricSchema>

/**
 * Time granularity options
 */
export const TimeGranularitySchema = z.enum(['hour', 'day', 'week', 'month'])

export type TimeGranularity = z.infer<typeof TimeGranularitySchema>

/**
 * Aggregation function options
 */
export const AggregationFunctionSchema = z.enum(['count', 'sum', 'avg', 'min', 'max'])

export type AggregationFunction = z.infer<typeof AggregationFunctionSchema>

/**
 * Time series query parameters
 */
export const TimeSeriesQuerySchema = z.object({
  from: z.string().datetime('Invalid from date format'),
  to: z.string().datetime('Invalid to date format'),
  granularity: TimeGranularitySchema.default('day'),
  aggregation: AggregationFunctionSchema.default('count'),
  filters: z.record(z.unknown()).optional(),
})

export type TimeSeriesQuery = z.infer<typeof TimeSeriesQuerySchema>

/**
 * Time series data point
 */
export const TimeSeriesDataPointSchema = z.object({
  time: z.string().datetime(),
  value: z.number(),
  breakdown: z.record(z.number()).optional(),
})

export type TimeSeriesDataPoint = z.infer<typeof TimeSeriesDataPointSchema>

/**
 * Trend direction
 */
export const TrendDirectionSchema = z.enum(['increasing', 'decreasing', 'stable'])

export type TrendDirection = z.infer<typeof TrendDirectionSchema>

/**
 * Time series response
 */
export const TimeSeriesResponseSchema = z.object({
  metric: TimeSeriesMetricSchema,
  granularity: TimeGranularitySchema,
  data: z.array(TimeSeriesDataPointSchema),
  stats: z.object({
    total: z.number(),
    average: z.number(),
    min: z.number(),
    max: z.number(),
    trend: TrendDirectionSchema,
  }),
})

export type TimeSeriesResponse = z.infer<typeof TimeSeriesResponseSchema>

// ============================================
// AI Schema Response Schemas
// ============================================

/**
 * Authorized sources for a token
 */
export interface AuthorizedSources {
  user_insights: boolean
  external_links: boolean
  vibe_sessions: boolean
  knowledge_graph: boolean
}

/**
 * Datasource definition
 */
export const DatasourceSchema = z.object({
  name: z.string(),
  type: z.enum(['table', 'view']),
  access: z.enum(['public', 'authorized', 'private']),
  description: z.string(),
  rowCount: z.number().int().nonnegative().optional(),
})

export type Datasource = z.infer<typeof DatasourceSchema>

/**
 * Schema endpoint definition
 */
export const SchemaEndpointSchema = z.object({
  read: z.string().url(),
  write: z.string().url().optional(),
})

export type SchemaEndpoint = z.infer<typeof SchemaEndpointSchema>

/**
 * Schema definition
 */
export const SchemaDefinitionSchema = z.object({
  name: z.string(),
  jsonSchema: z.record(z.unknown()),
  endpoints: SchemaEndpointSchema,
})

export type SchemaDefinition = z.infer<typeof SchemaDefinitionSchema>

/**
 * Vector store configuration
 */
export const VectorStoreConfigSchema = z.object({
  name: z.string(),
  tableName: z.string(),
  dimension: z.number().int().positive(),
  metric: z.enum(['cosine', 'euclidean']),
  searchEndpoint: z.string(),
  description: z.string(),
})

export type VectorStoreConfig = z.infer<typeof VectorStoreConfigSchema>

/**
 * Knowledge graph configuration
 */
export const KnowledgeGraphConfigSchema = z.object({
  name: z.string(),
  nodeTypes: z.array(z.string()),
  edgeTypes: z.array(z.string()),
  queryEndpoint: z.string(),
  description: z.string(),
})

export type KnowledgeGraphConfig = z.infer<typeof KnowledgeGraphConfigSchema>

/**
 * Time series configuration
 */
export const TimeSeriesConfigSchema = z.object({
  name: z.string(),
  tableName: z.string(),
  metrics: z.array(z.string()),
  granularity: z.array(TimeGranularitySchema),
  queryEndpoint: z.string(),
  description: z.string(),
})

export type TimeSeriesConfig = z.infer<typeof TimeSeriesConfigSchema>

/**
 * Authorization status
 */
export const AuthorizationStatusSchema = z.object({
  granted: z.array(z.string()),
  pending: z.array(z.string()),
  unavailable: z.array(z.string()),
})

export type AuthorizationStatus = z.infer<typeof AuthorizationStatusSchema>

/**
 * AI Data Schema response
 */
export const AIDataSchemaResponseSchema = z.object({
  datasources: z.array(DatasourceSchema),
  schemas: z.array(SchemaDefinitionSchema),
  vectorStores: z.array(VectorStoreConfigSchema),
  knowledgeGraphs: z.array(KnowledgeGraphConfigSchema),
  timeSeries: z.array(TimeSeriesConfigSchema),
  authorization: AuthorizationStatusSchema,
})

export type AIDataSchemaResponse = z.infer<typeof AIDataSchemaResponseSchema>
