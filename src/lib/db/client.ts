/**
 * PostgreSQL Database Client
 *
 * Single-user local database client for Viblog personal tool.
 * Replaces Supabase client for Docker deployment.
 */

import postgres from 'postgres'

// Database configuration
const databaseUrl = process.env.DATABASE_URL || 'postgresql://viblog:viblog@localhost:5432/viblog'

// Create postgres connection
// In development, use a single connection to avoid connection pool issues
// In production, use connection pool
const maxConnections = process.env.NODE_ENV === 'production' ? 10 : 1

export const sql = postgres(databaseUrl, {
  max: maxConnections,
  idle_timeout: 20,
  connect_timeout: 10,
  // Transform snake_case to camelCase
  transform: {
    column: postgres.toCamel,
  },
  // On connection error
  onnotice: (notice) => {
    console.log('Database notice:', notice.message)
  },
})

/**
 * Database types
 */
export interface VibeSession {
  id: string
  title: string | null
  platform: string | null
  model: string | null
  status: string
  metadata: Record<string, unknown> | null
  rawContext: Record<string, unknown> | null
  startTime: Date
  endTime: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface SessionFragment {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'tool' | 'developer' | 'system'
  content: unknown[]
  toolCalls: unknown[] | null
  metadata: Record<string, unknown> | null
  sequenceNumber: number | null
  fragmentType: string | null
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description: string | null
  repositoryUrl: string | null
  color: string | null
  icon: string | null
  slug: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  sessionId: string | null
  projectId: string | null
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  coverImage: string | null
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'unlisted'
  vibePlatform: string | null
  vibeModel: string | null
  vibeDurationMinutes: number | null
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

export interface ArticleParagraph {
  id: string
  articleId: string
  content: string
  paragraphIndex: number
  paragraphType: string | null
  language: string | null
  createdAt: Date
}

export interface LlmConfig {
  id: string
  provider: string
  model: string
  apiKeyEncrypted: string
  baseUrl: string | null
  isPrimary: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserSetting {
  id: string
  key: string
  value: unknown
  createdAt: Date
  updatedAt: Date
}

export interface MetricsCache {
  id: string
  metricType: string
  value: number
  periodStart: Date
  periodEnd: Date
  metadata: Record<string, unknown> | null
  createdAt: Date
}

/**
 * Database helper functions
 */

// Check database connection
export async function checkConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

// Get all sessions
export async function getSessions(options?: {
  status?: string
  limit?: number
  offset?: number
}) {
  const { status, limit = 50, offset = 0 } = options || {}

  let query = sql`
    SELECT * FROM vibe_sessions
    WHERE 1=1
  `

  if (status) {
    query = sql`${query} AND status = ${status}`
  }

  query = sql`${query} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

  return query as Promise<VibeSession[]>
}

// Get session by ID
export async function getSession(id: string) {
  const [session] = await sql`
    SELECT * FROM vibe_sessions WHERE id = ${id}
  `
  return session as VibeSession | undefined
}

// Create session
export async function createSession(data: {
  title?: string
  platform?: string
  model?: string
  status?: string
  metadata?: Record<string, unknown>
}) {
  const [session] = await sql`
    INSERT INTO vibe_sessions (title, platform, model, status, metadata)
    VALUES (${data.title || null}, ${data.platform || null}, ${data.model || null}, ${data.status || 'active'}, ${data.metadata || null})
    RETURNING *
  `
  return session as VibeSession
}

// Update session
export async function updateSession(id: string, data: Partial<{
  title: string
  platform: string
  model: string
  status: string
  metadata: Record<string, unknown>
  endTime: Date
}>) {
  const [session] = await sql`
    UPDATE vibe_sessions
    SET ${sql(data, 'title', 'platform', 'model', 'status', 'metadata', 'endTime')}
    WHERE id = ${id}
    RETURNING *
  `
  return session as VibeSession | undefined
}

// Delete session
export async function deleteSession(id: string) {
  const result = await sql`
    DELETE FROM vibe_sessions WHERE id = ${id}
  `
  return result.count > 0
}

// Get session fragments
export async function getSessionFragments(sessionId: string) {
  return sql`
    SELECT * FROM session_fragments
    WHERE session_id = ${sessionId}
    ORDER BY sequence_number, created_at
  ` as Promise<SessionFragment[]>
}

// Create session fragment
export async function createFragment(data: {
  sessionId: string
  role: string
  content: unknown[]
  toolCalls?: unknown[]
  metadata?: Record<string, unknown>
  sequenceNumber?: number
  fragmentType?: string
}) {
  const [fragment] = await sql`
    INSERT INTO session_fragments (session_id, role, content, tool_calls, metadata, sequence_number, fragment_type)
    VALUES (${data.sessionId}, ${data.role}, ${sql.json(data.content)}, ${data.toolCalls ? sql.json(data.toolCalls) : null}, ${data.metadata ? sql.json(data.metadata) : null}, ${data.sequenceNumber || null}, ${data.fragmentType || null})
    RETURNING *
  `
  return fragment as SessionFragment
}

// Get all articles
export async function getArticles(options?: {
  status?: string
  projectId?: string
  limit?: number
  offset?: number
}) {
  const { status, projectId, limit = 50, offset = 0 } = options || {}

  let query = sql`
    SELECT * FROM articles
    WHERE 1=1
  `

  if (status) {
    query = sql`${query} AND status = ${status}`
  }

  if (projectId) {
    query = sql`${query} AND project_id = ${projectId}`
  }

  query = sql`${query} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

  return query as Promise<Article[]>
}

// Get article by ID or slug
export async function getArticle(identifier: string) {
  const [article] = await sql`
    SELECT * FROM articles
    WHERE id = ${identifier} OR slug = ${identifier}
    LIMIT 1
  `
  return article as Article | undefined
}

// Create article
export async function createArticle(data: {
  sessionId?: string
  projectId?: string
  title: string
  slug: string
  content?: string
  excerpt?: string
  coverImage?: string
  status?: string
  visibility?: string
  vibePlatform?: string
  vibeModel?: string
  vibeDurationMinutes?: number
}) {
  const [article] = await sql`
    INSERT INTO articles (session_id, project_id, title, slug, content, excerpt, cover_image, status, visibility, vibe_platform, vibe_model, vibe_duration_minutes)
    VALUES (${data.sessionId || null}, ${data.projectId || null}, ${data.title}, ${data.slug}, ${data.content || null}, ${data.excerpt || null}, ${data.coverImage || null}, ${data.status || 'draft'}, ${data.visibility || 'private'}, ${data.vibePlatform || null}, ${data.vibeModel || null}, ${data.vibeDurationMinutes || null})
    RETURNING *
  `
  return article as Article
}

// Update article
export async function updateArticle(id: string, data: Partial<{
  title: string
  content: string
  excerpt: string
  coverImage: string
  status: string
  visibility: string
  publishedAt: Date
}>) {
  const [article] = await sql`
    UPDATE articles
    SET ${sql(data, 'title', 'content', 'excerpt', 'coverImage', 'status', 'visibility', 'publishedAt')}
    WHERE id = ${id}
    RETURNING *
  `
  return article as Article | undefined
}

// Delete article
export async function deleteArticle(id: string) {
  const result = await sql`
    DELETE FROM articles WHERE id = ${id}
  `
  return result.count > 0
}

// Get all projects
export async function getProjects(options?: {
  status?: string
  limit?: number
  offset?: number
}) {
  const { status, limit = 50, offset = 0 } = options || {}

  let query = sql`
    SELECT * FROM projects
    WHERE 1=1
  `

  if (status) {
    query = sql`${query} AND status = ${status}`
  }

  query = sql`${query} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

  return query as Promise<Project[]>
}

// Get project by ID or slug
export async function getProject(identifier: string) {
  const [project] = await sql`
    SELECT * FROM projects
    WHERE id = ${identifier} OR slug = ${identifier}
    LIMIT 1
  `
  return project as Project | undefined
}

// Create project
export async function createProject(data: {
  name: string
  slug: string
  description?: string
  repositoryUrl?: string
  color?: string
  icon?: string
}) {
  const [project] = await sql`
    INSERT INTO projects (name, slug, description, repository_url, color, icon)
    VALUES (${data.name}, ${data.slug}, ${data.description || null}, ${data.repositoryUrl || null}, ${data.color || null}, ${data.icon || null})
    RETURNING *
  `
  return project as Project
}

// Update project
export async function updateProject(id: string, data: Partial<{
  name: string
  description: string
  repositoryUrl: string
  color: string
  icon: string
  status: string
}>) {
  const [project] = await sql`
    UPDATE projects
    SET ${sql(data, 'name', 'description', 'repositoryUrl', 'color', 'icon', 'status')}
    WHERE id = ${id}
    RETURNING *
  `
  return project as Project | undefined
}

// Delete project
export async function deleteProject(id: string) {
  const result = await sql`
    DELETE FROM projects WHERE id = ${id}
  `
  return result.count > 0
}

// Get user setting
export async function getSetting(key: string) {
  const [setting] = await sql`
    SELECT * FROM user_settings WHERE key = ${key}
  `
  return setting?.value as unknown
}

// Set user setting
export async function setSetting(key: string, value: unknown) {
  const [setting] = await sql`
    INSERT INTO user_settings (key, value)
    VALUES (${key}, ${sql.json(value)})
    ON CONFLICT (key) DO UPDATE SET value = ${sql.json(value)}
    RETURNING *
  `
  return setting.value as unknown
}

// Get LLM config
export async function getLlmConfigs() {
  return sql`
    SELECT id, provider, model, base_url, is_primary, created_at, updated_at
    FROM llm_config
    ORDER BY is_primary DESC, created_at
  ` as Promise<Omit<LlmConfig, 'apiKeyEncrypted'>[]>
}

// Get primary LLM config
export async function getPrimaryLlmConfig() {
  const [config] = await sql`
    SELECT * FROM llm_config WHERE is_primary = true LIMIT 1
  `
  return config as LlmConfig | undefined
}

// Create LLM config
export async function createLlmConfig(data: {
  provider: string
  model: string
  apiKeyEncrypted: string
  baseUrl?: string
  isPrimary?: boolean
}) {
  // If setting as primary, unset other primaries
  if (data.isPrimary) {
    await sql`UPDATE llm_config SET is_primary = false`
  }

  const [config] = await sql`
    INSERT INTO llm_config (provider, model, api_key_encrypted, base_url, is_primary)
    VALUES (${data.provider}, ${data.model}, ${data.apiKeyEncrypted}, ${data.baseUrl || null}, ${data.isPrimary || false})
    RETURNING *
  `
  return config as LlmConfig
}

// Delete LLM config
export async function deleteLlmConfig(id: string) {
  const result = await sql`
    DELETE FROM llm_config WHERE id = ${id}
  `
  return result.count > 0
}

// Graceful shutdown
export async function closeConnection() {
  await sql.end()
}

// Export default
export default sql