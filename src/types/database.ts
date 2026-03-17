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
      annotations: {
        Row: {
          annotation_type: string | null
          article_id: string
          created_at: string
          end_offset: number
          highlight_color: string | null
          id: string
          is_public: boolean | null
          note_content: string | null
          paragraph_id: string | null
          selected_text: string
          start_offset: number
          updated_at: string
          user_id: string
        }
        Insert: {
          annotation_type?: string | null
          article_id: string
          created_at?: string
          end_offset: number
          highlight_color?: string | null
          id?: string
          is_public?: boolean | null
          note_content?: string | null
          paragraph_id?: string | null
          selected_text: string
          start_offset: number
          updated_at?: string
          user_id: string
        }
        Update: {
          annotation_type?: string | null
          article_id?: string
          created_at?: string
          end_offset?: number
          highlight_color?: string | null
          id?: string
          is_public?: boolean | null
          note_content?: string | null
          paragraph_id?: string | null
          selected_text?: string
          start_offset?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      article_paragraphs: {
        Row: {
          article_id: string
          content: string
          created_at: string
          embedding: string | null
          id: string
          language: string | null
          paragraph_index: number
          paragraph_type: string | null
          updated_at: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          language?: string | null
          paragraph_index: number
          paragraph_type?: string | null
          updated_at?: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          language?: string | null
          paragraph_index?: number
          paragraph_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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
      authorization_tokens: {
        Row: {
          authorized_sources: Json | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          name: string
          privacy_level: number | null
          token_hash: string
          token_prefix: string
          token_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          authorized_sources?: Json | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name: string
          privacy_level?: number | null
          token_hash: string
          token_prefix: string
          token_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          authorized_sources?: Json | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name?: string
          privacy_level?: number | null
          token_hash?: string
          token_prefix?:string
          token_type?: string | null
          updated_at?: string
          user_id?:string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          related_id: string | null
          related_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      external_links: {
        Row: {
          created_at: string
          description: string | null
          embedding: string | null
          id: string
          image_url: string | null
          link_type: string | null
          notes: string | null
          site_name: string | null
          snapshot_at: string | null
          snapshot_html: string | null
          snapshot_text: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          embedding?: string | null
          id?: string
          image_url?: string | null
          link_type?: string | null
          notes?: string | null
          site_name?: string | null
          snapshot_at?: string | null
          snapshot_html?: string | null
          snapshot_text?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          embedding?: string | null
          id?: string
          image_url?: string | null
          link_type?: string | null
          notes?: string | null
          site_name?: string | null
          snapshot_at?: string | null
          snapshot_html?: string | null
          snapshot_text?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          url?: string
          user_id?:string
        }
        Relationships: []
      }
      graph_edges: {
        Row: {
          created_at: string
          edge_data: Json | null
          edge_type: string
          id: string
          source_node_id: string
          target_node_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          edge_data?: Json | null
          edge_type: string
          id?: string
          source_node_id: string
          target_node_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          edge_data?: Json | null
          edge_type?: string
          id?: string
          source_node_id?: string
          target_node_id?:string
          user_id?:string
        }
        Relationships: []
      }
      graph_nodes: {
        Row: {
          created_at: string
          id: string
          node_data: Json
          node_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          node_data?: Json
          node_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          node_data?: Json
          node_type?: string
          updated_at?: string
          user_id?:string
        }
        Relationships: []
      }
      insight_links: {
        Row: {
          created_at: string
          external_link_id: string
          id: string
          insight_id: string
          link_context: string | null
          relevance_score: number | null
        }
        Insert: {
          created_at?: string
          external_link_id: string
          id?: string
          insight_id: string
          link_context?: string | null
          relevance_score?: number | null
        }
        Update: {
          created_at?: string
          external_link_id?: string
          id?: string
          insight_id?: string
          link_context?: string | null
          relevance_score?: number | null
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
          user_id?:string
        }
        Relationships: []
      }
      session_fragments: {
        Row: {
          content: string
          created_at: string
          fragment_type: string
          id: string
          metadata: Json | null
          sequence_number: number
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          fragment_type: string
          id?: string
          metadata?: Json | null
          sequence_number: number
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          fragment_type?: string
          id?: string
          metadata?: Json | null
          sequence_number?: number
          session_id?: string
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
          user_id?:string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          pro_multiplier: number | null
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          pro_multiplier?: number | null
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          pro_multiplier?: number | null
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?:string
        }
        Relationships: []
      }
      user_insights: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          id: string
          insight_type: string | null
          privacy_level: number | null
          related_article_id: string | null
          related_project_id: string | null
          source_id: string | null
          source_type: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          insight_type?: string | null
          privacy_level?: number | null
          related_article_id?: string | null
          related_project_id?: string | null
          source_id?: string | null
          source_type?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          insight_type?: string | null
          privacy_level?: number | null
          related_article_id?: string | null
          related_project_id?: string | null
          source_id?: string | null
          source_type?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?:string
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          article_id: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          interaction_data: Json | null
          interaction_type: string
          referrer: string | null
          session_id: string | null
          target_id: string | null
          target_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          referrer?: string | null
          session_id?: string | null
          target_id?: string | null
          target_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          article_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          referrer?: string | null
          session_id?: string | null
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
          user_id?: string | null
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
          user_id?:string
          vibe_platforms?: Json | null
        }
        Relationships: []
      }
      vibe_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          metadata: Json | null
          model: string | null
          platform: string | null
          raw_context: Json | null
          start_time: string
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          metadata?: Json | null
          model?: string | null
          platform?: string | null
          raw_context?: Json | null
          start_time?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          metadata?: Json | null
          model?: string | null
          platform?: string | null
          raw_context?: Json | null
          start_time?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
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