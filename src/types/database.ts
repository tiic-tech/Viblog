export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_premium: boolean
          price: number | null
          project_id: string | null
          published_at: string | null
          slug: string
          stars_count: number
          status: string
          title: string
          updated_at: string
          user_id: string
          vibe_ai_response: string | null
          vibe_duration_minutes: number | null
          vibe_model: string | null
          vibe_platform: string | null
          vibe_prompt: string | null
          views_count: number
          visibility: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_premium?: boolean
          price?: number | null
          project_id?: string | null
          published_at?: string | null
          slug: string
          stars_count?: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
          vibe_ai_response?: string | null
          vibe_duration_minutes?: number | null
          vibe_model?: string | null
          vibe_platform?: string | null
          vibe_prompt?: string | null
          views_count?: number
          visibility?: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_premium?: boolean
          price?: number | null
          project_id?: string | null
          published_at?: string | null
          slug?: string
          stars_count?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          vibe_ai_response?: string | null
          vibe_duration_minutes?: number | null
          vibe_model?: string | null
          vibe_platform?: string | null
          vibe_prompt?: string | null
          views_count?: number
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          github_username: string | null
          id: string
          twitter_username: string | null
          updated_at: string
          username: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          github_username?: string | null
          id: string
          twitter_username?: string | null
          updated_at?: string
          username: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          github_username?: string | null
          id?: string
          twitter_username?: string | null
          updated_at?: string
          username?: string
          website_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_public: boolean
          name: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean
          name: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean
          name?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stars: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          database_type: string | null
          database_url_encrypted: string | null
          discovery_source: string | null
          id: string
          llm_api_key_encrypted: string | null
          llm_model: string | null
          llm_provider: string | null
          updated_at: string
          user_id: string
          vibe_platforms: Json | null
        }
        Insert: {
          created_at?: string
          database_type?: string | null
          database_url_encrypted?: string | null
          discovery_source?: string | null
          id?: string
          llm_api_key_encrypted?: string | null
          llm_model?: string | null
          llm_provider?: string | null
          updated_at?: string
          user_id: string
          vibe_platforms?: Json | null
        }
        Update: {
          created_at?: string
          database_type?: string | null
          database_url_encrypted?: string | null
          discovery_source?: string | null
          id?: string
          llm_api_key_encrypted?: string | null
          llm_model?: string | null
          llm_provider?: string | null
          updated_at?: string
          user_id?: string
          vibe_platforms?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Row']

export type TablesInsert<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Insert']

export type TablesUpdate<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Update']