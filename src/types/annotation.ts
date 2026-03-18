/**
 * Annotation Types
 *
 * Annotations extend highlights with user comments and discussion threads.
 * They transform passive reading into active dialogue - every annotation
 * is a mark of intellectual presence.
 *
 * Soul Mission: User sees their annotations accumulate and thinks:
 * "I've been here. I've grown here. This is my intellectual home."
 */

/**
 * Who can see the annotation
 */
export type AnnotationVisibility = 'public' | 'private' | 'followers'

/**
 * Highlight color options
 */
export type AnnotationColor = 'default' | 'yellow' | 'green' | 'blue' | 'pink'

/**
 * A discussion item (reply) within an annotation thread
 */
export interface DiscussionItem {
  /** Unique identifier for the discussion item */
  id: string
  /** ID of the user who wrote the reply */
  userId: string
  /** The reply content */
  content: string
  /** When the reply was created */
  createdAt: string
}

/**
 * Annotation - a highlight with comment and optional discussion
 *
 * This extends the highlight concept with:
 * - User-authored comments
 * - Visibility controls
 * - Discussion threads
 *
 * The annotation system transforms reading from passive consumption
 * to active dialogue, deepening the connection between reader and content.
 */
export interface Annotation {
  /** Unique identifier for the annotation */
  id: string
  /** ID of the article this annotation belongs to */
  articleId: string
  /** ID of the user who created this annotation */
  userId: string
  /** The selected/highlighted text */
  text: string
  /** XPath to the container element (null if DOM changed) */
  containerXPath: string | null
  /** Start offset in the text node */
  startOffset: number
  /** End offset in the text node */
  endOffset: number
  /** User's comment on the highlighted text */
  content: string
  /** Highlight color */
  color: AnnotationColor
  /** Who can see this annotation */
  visibility: AnnotationVisibility
  /** When the annotation was created */
  createdAt: string
  /** Optional discussion thread */
  discussion?: DiscussionItem[]
}