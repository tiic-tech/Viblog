// Database Types

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  website_url: string | null
  github_username: string | null
  twitter_username: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  user_id: string
  project_id: string | null
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image: string | null

  // Vibe Coding Metadata
  vibe_platform: string | null
  vibe_duration_minutes: number | null
  vibe_model: string | null
  vibe_prompt: string | null
  vibe_ai_response: string | null

  // Publishing
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'unlisted'
  is_premium: boolean
  price: number

  // Engagement
  stars_count: number
  views_count: number

  // Timestamps
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface UserSettings {
  id: string
  user_id: string
  llm_provider: string | null
  llm_model: string | null
  database_type: 'supabase' | 'clickhouse' | 'sqlite' | 'none' | null
  vibe_platforms: VibePlatform[]
  discovery_source: string | null
  created_at: string
  updated_at: string
}

export interface VibePlatform {
  name: string
  config?: Record<string, unknown>
}

// API Types

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Auth Types

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  username: string
}

// Form Types

export interface CreateProjectInput {
  name: string
  description?: string
  icon?: string
  color?: string
  is_public?: boolean
}

export interface CreateArticleInput {
  title: string
  content?: string
  excerpt?: string
  cover_image?: string
  project_id?: string
  vibe_platform?: string
  vibe_duration_minutes?: number
  vibe_model?: string
  vibe_prompt?: string
  vibe_ai_response?: string
  status?: 'draft' | 'published'
  visibility?: 'public' | 'private' | 'unlisted'
  is_premium?: boolean
  price?: number
}