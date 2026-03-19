/**
 * Common JSON schemas for structured LLM output
 */

import { z } from 'zod'

// ============================================================
// Article Generation Schemas
// ============================================================

/**
 * Schema for article generation output
 */
export const ArticleGenerationSchema = z.object({
  title: z.string().describe('Article title'),
  summary: z.string().describe('Brief summary of the article (2-3 sentences)'),
  content: z.string().describe('Full article content in markdown format'),
  tags: z.array(z.string()).describe('Relevant tags for the article'),
  category: z.string().describe('Article category'),
  readingTime: z.number().describe('Estimated reading time in minutes'),
  seoTitle: z.string().describe('SEO-optimized title (60 chars max)'),
  seoDescription: z.string().describe('SEO meta description (160 chars max)'),
})

/**
 * Schema for article outline generation
 */
export const ArticleOutlineSchema = z.object({
  title: z.string(),
  introduction: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      keyPoints: z.array(z.string()),
      estimatedParagraphs: z.number(),
    })
  ),
  conclusion: z.string(),
})

/**
 * Schema for article improvement suggestions
 */
export const ArticleImprovementSchema = z.object({
  overallScore: z.number().min(0).max(100),
  readability: z.object({
    score: z.number(),
    suggestions: z.array(z.string()),
  }),
  structure: z.object({
    score: z.number(),
    suggestions: z.array(z.string()),
  }),
  seo: z.object({
    score: z.number(),
    suggestions: z.array(z.string()),
  }),
  tone: z.object({
    score: z.number(),
    suggestions: z.array(z.string()),
  }),
})

// ============================================================
// Content Analysis Schemas
// ============================================================

/**
 * Schema for content analysis output
 */
export const ContentAnalysisSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']),
  sentimentScore: z.number().min(-1).max(1),
  topics: z.array(
    z.object({
      name: z.string(),
      relevance: z.number().min(0).max(1),
    })
  ),
  keyPhrases: z.array(z.string()),
  language: z.string(),
  wordCount: z.number(),
  readingLevel: z.enum(['elementary', 'middle_school', 'high_school', 'college', 'graduate']),
  summary: z.string(),
})

/**
 * Schema for content classification
 */
export const ContentClassificationSchema = z.object({
  primaryCategory: z.string(),
  secondaryCategories: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string()),
  audience: z.array(z.string()),
  purpose: z.enum(['informative', 'persuasive', 'entertaining', 'instructional', 'other']),
})

// ============================================================
// Entity Extraction Schemas
// ============================================================

/**
 * Schema for entity extraction output
 */
export const EntityExtractionSchema = z.object({
  persons: z.array(
    z.object({
      name: z.string(),
      role: z.string().optional(),
      mentions: z.number(),
    })
  ),
  organizations: z.array(
    z.object({
      name: z.string(),
      type: z.string().optional(),
      mentions: z.number(),
    })
  ),
  locations: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['city', 'country', 'region', 'address', 'other']).optional(),
      mentions: z.number(),
    })
  ),
  dates: z.array(
    z.object({
      date: z.string(),
      context: z.string().optional(),
    })
  ),
  urls: z.array(z.string()),
  emails: z.array(z.string()),
  phoneNumbers: z.array(z.string()),
})

/**
 * Schema for code entity extraction
 */
export const CodeEntityExtractionSchema = z.object({
  functions: z.array(
    z.object({
      name: z.string(),
      parameters: z.array(z.string()),
      returnType: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  classes: z.array(
    z.object({
      name: z.string(),
      methods: z.array(z.string()),
      properties: z.array(z.string()).optional(),
      description: z.string().optional(),
    })
  ),
  imports: z.array(z.string()),
  exports: z.array(z.string()),
  dependencies: z.array(z.string()),
})

// ============================================================
// Sentiment Analysis Schemas
// ============================================================

/**
 * Schema for detailed sentiment analysis
 */
export const SentimentAnalysisSchema = z.object({
  overall: z.enum(['very_positive', 'positive', 'neutral', 'negative', 'very_negative']),
  score: z.number().min(-1).max(1),
  confidence: z.number().min(0).max(1),
  aspects: z.array(
    z.object({
      aspect: z.string(),
      sentiment: z.enum(['positive', 'negative', 'neutral']),
      score: z.number().min(-1).max(1),
      keywords: z.array(z.string()),
    })
  ),
  emotions: z.object({
    joy: z.number().min(0).max(1),
    sadness: z.number().min(0).max(1),
    anger: z.number().min(0).max(1),
    fear: z.number().min(0).max(1),
    surprise: z.number().min(0).max(1),
    disgust: z.number().min(0).max(1),
  }),
})

// ============================================================
// Vibe Session Schemas
// ============================================================

/**
 * Schema for vibe session context extraction
 */
export const VibeSessionContextSchema = z.object({
  summary: z.string().describe('Brief summary of the coding session'),
  tasks: z.array(
    z.object({
      description: z.string(),
      status: z.enum(['completed', 'in_progress', 'blocked']),
      files: z.array(z.string()),
    })
  ),
  technologies: z.array(z.string()),
  challenges: z.array(
    z.object({
      description: z.string(),
      solution: z.string().optional(),
    })
  ),
  decisions: z.array(
    z.object({
      decision: z.string(),
      rationale: z.string(),
    })
  ),
  nextSteps: z.array(z.string()),
  keywords: z.array(z.string()),
})

/**
 * Schema for article draft from vibe session
 */
export const VibeArticleDraftSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  introduction: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      content: z.string(),
      codeBlocks: z
        .array(
          z.object({
            language: z.string(),
            code: z.string(),
            caption: z.string().optional(),
          })
        )
        .optional(),
    })
  ),
  conclusion: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
})

// ============================================================
// Schema Registry
// ============================================================

/**
 * Registry of named schemas for easy reference
 */
export const SchemaRegistry = {
  // Article schemas
  article_generation: ArticleGenerationSchema,
  article_outline: ArticleOutlineSchema,
  article_improvement: ArticleImprovementSchema,

  // Analysis schemas
  content_analysis: ContentAnalysisSchema,
  content_classification: ContentClassificationSchema,

  // Entity schemas
  entity_extraction: EntityExtractionSchema,
  code_entity_extraction: CodeEntityExtractionSchema,

  // Sentiment schemas
  sentiment_analysis: SentimentAnalysisSchema,

  // Vibe session schemas
  vibe_session_context: VibeSessionContextSchema,
  vibe_article_draft: VibeArticleDraftSchema,
} as const

/**
 * Schema names type
 */
export type SchemaName = keyof typeof SchemaRegistry

/**
 * Get schema by name
 */
export function getSchema(name: SchemaName): z.ZodType {
  return SchemaRegistry[name]
}

/**
 * Check if a schema name is valid
 */
export function isValidSchemaName(name: string): name is SchemaName {
  return name in SchemaRegistry
}