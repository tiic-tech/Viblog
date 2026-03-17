/**
 * Embedding Service
 *
 * Generates text embeddings using OpenAI's embedding API.
 * Uses fetch-based implementation to avoid SDK dependency conflicts.
 */

// Constants
export const EMBEDDING_DIMENSION = 1536
export const EMBEDDING_MODEL = 'text-embedding-3-small'
export const EMBEDDING_MAX_BATCH_SIZE = 100

/**
 * Result of embedding generation
 */
export interface EmbeddingResult {
  embedding: number[]
  error?: never
}

export interface EmbeddingError {
  embedding?: never
  error: string
}

export type EmbeddingResponse = EmbeddingResult | EmbeddingError

/**
 * Result of batch embedding generation
 */
export interface BatchEmbeddingResult {
  embeddings: number[][]
  error?: never
}

export interface BatchEmbeddingError {
  embeddings?: never
  error: string
}

export type BatchEmbeddingResponse = BatchEmbeddingResult | BatchEmbeddingError

/**
 * Generate embedding for a single text
 *
 * @param text - Text to embed
 * @param apiKey - OpenAI API key
 * @returns Embedding vector or error
 */
export async function generateEmbedding(
  text: string,
  apiKey: string
): Promise<EmbeddingResponse> {
  if (!text || text.trim().length === 0) {
    return { error: 'Text cannot be empty' }
  }

  if (!apiKey) {
    return { error: 'API key is required' }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: text,
        dimensions: EMBEDDING_DIMENSION,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        (errorData as { error?: { message?: string } }).error?.message ||
        `OpenAI API error: ${response.status}`
      return { error: errorMessage }
    }

    const data = await response.json()

    // Validate response structure
    if (
      !data.data ||
      !Array.isArray(data.data) ||
      data.data.length === 0 ||
      !data.data[0].embedding
    ) {
      return { error: 'Invalid response from OpenAI API' }
    }

    const embedding = data.data[0].embedding as number[]

    // Validate embedding dimensions
    if (embedding.length !== EMBEDDING_DIMENSION) {
      return {
        error: `Unexpected embedding dimension: ${embedding.length}, expected ${EMBEDDING_DIMENSION}`,
      }
    }

    return { embedding }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred'
    return { error: `Failed to generate embedding: ${errorMessage}` }
  }
}

/**
 * Generate embeddings for multiple texts in batch
 *
 * @param texts - Array of texts to embed
 * @param apiKey - OpenAI API key
 * @returns Array of embedding vectors or error
 */
export async function generateEmbeddings(
  texts: string[],
  apiKey: string
): Promise<BatchEmbeddingResponse> {
  if (!texts || texts.length === 0) {
    return { error: 'Texts array cannot be empty' }
  }

  if (texts.length > EMBEDDING_MAX_BATCH_SIZE) {
    return {
      error: `Batch size exceeds limit: ${texts.length} > ${EMBEDDING_MAX_BATCH_SIZE}`,
    }
  }

  if (!apiKey) {
    return { error: 'API key is required' }
  }

  // Filter out empty texts
  const validTexts = texts.filter((t) => t && t.trim().length > 0)
  if (validTexts.length === 0) {
    return { error: 'No valid texts to embed' }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: validTexts,
        dimensions: EMBEDDING_DIMENSION,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        (errorData as { error?: { message?: string } }).error?.message ||
        `OpenAI API error: ${response.status}`
      return { error: errorMessage }
    }

    const data = await response.json()

    // Validate response structure
    if (!data.data || !Array.isArray(data.data)) {
      return { error: 'Invalid response from OpenAI API' }
    }

    // Sort by index to ensure correct order
    const sortedData = [...data.data].sort(
      (a: { index: number }, b: { index: number }) => a.index - b.index
    )

    const embeddings: number[][] = []
    for (const item of sortedData) {
      const embedding = item.embedding as number[]
      if (embedding.length !== EMBEDDING_DIMENSION) {
        return {
          error: `Unexpected embedding dimension: ${embedding.length}, expected ${EMBEDDING_DIMENSION}`,
        }
      }
      embeddings.push(embedding)
    }

    return { embeddings }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred'
    return { error: `Failed to generate embeddings: ${errorMessage}` }
  }
}

/**
 * Calculate cosine similarity between two embeddings
 *
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Cosine similarity (-1 to 1)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimension')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Format embedding for pgvector storage
 *
 * @param embedding - Embedding vector
 * @returns String representation for pgvector
 */
export function formatEmbeddingForStorage(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}

/**
 * Parse embedding from pgvector storage
 *
 * @param stored - String representation from pgvector
 * @returns Embedding vector
 */
export function parseEmbeddingFromStorage(stored: string): number[] {
  // Remove brackets and split by comma
  const clean = stored.replace(/^\[|\]$/g, '')
  return clean.split(',').map(Number)
}