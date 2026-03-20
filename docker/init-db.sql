-- ============================================
-- Viblog Database Initialization
-- Version: 1.0
-- Created: 2026-03-20
-- Purpose: Single-user personal tool schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Core Tables
-- ============================================

-- Sessions: Vibe coding sessions
CREATE TABLE vibe_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  platform TEXT,
  model TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB,
  raw_context JSONB,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Fragments: OpenAI Format (ADR-005)
CREATE TABLE session_fragments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES vibe_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool', 'developer', 'system')),
  content JSONB NOT NULL,
  tool_calls JSONB,
  metadata JSONB,
  sequence_number INTEGER,
  fragment_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects: Group sessions by product/project
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  repository_url TEXT,
  color TEXT,
  icon TEXT,
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles: Generated from sessions
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES vibe_sessions(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted')),
  vibe_platform TEXT,
  vibe_model TEXT,
  vibe_duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Article Paragraphs: Structured content
CREATE TABLE article_paragraphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  paragraph_index INTEGER NOT NULL,
  paragraph_type TEXT,
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Configuration Tables
-- ============================================

-- LLM Configuration: User's API keys (encrypted)
CREATE TABLE llm_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'deepseek', 'minimax', 'moonshot', 'zhipu', 'gemini', 'openrouter', 'doubao', 'qwen')),
  model TEXT NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  base_url TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings: Application preferences
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Analytics Tables
-- ============================================

-- Metrics Cache: Calculated efficiency metrics
CREATE TABLE metrics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('velocity', 'efficiency', 'token_economy', 'iteration_ratio', 'cache_efficiency', 'ai_leverage')),
  value DECIMAL NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Auth Tables (Optional - for ENABLE_AUTH=true)
-- ============================================

-- Users: Simple auth for personal server deployment
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions: Auth sessions
CREATE TABLE auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Annotations: For ENABLE_AUTH=true mode
CREATE TABLE annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  selected_text TEXT NOT NULL,
  note TEXT,
  start_offset INTEGER,
  end_offset INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Annotation Comments
CREATE TABLE annotation_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  annotation_id UUID REFERENCES annotations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

-- Sessions
CREATE INDEX idx_sessions_status ON vibe_sessions(status);
CREATE INDEX idx_sessions_created ON vibe_sessions(created_at DESC);
CREATE INDEX idx_sessions_platform ON vibe_sessions(platform);

-- Fragments
CREATE INDEX idx_fragments_session ON session_fragments(session_id);
CREATE INDEX idx_fragments_role ON session_fragments(role);

-- Projects
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);

-- Articles
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_project ON articles(project_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC);

-- Paragraphs
CREATE INDEX idx_paragraphs_article ON article_paragraphs(article_id);

-- Metrics
CREATE INDEX idx_metrics_type_period ON metrics_cache(metric_type, period_start);

-- Auth (optional)
CREATE INDEX idx_auth_sessions_token ON auth_sessions(token);
CREATE INDEX idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX idx_annotations_article ON annotations(article_id);

-- ============================================
-- Default Settings
-- ============================================

INSERT INTO user_settings (key, value) VALUES
  ('enable_auth', '"false"'),
  ('default_llm_provider', '"openai"'),
  ('metrics_calculation_interval', '"daily"');

-- ============================================
-- Update Trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_vibe_sessions_updated_at
  BEFORE UPDATE ON vibe_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_llm_config_updated_at
  BEFORE UPDATE ON llm_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Complete
-- ============================================

-- Log initialization
INSERT INTO user_settings (key, value) VALUES
  ('db_initialized_at', '"' || NOW()::TEXT || '"');

-- Print success message
DO $$
BEGIN
  RAISE NOTICE 'Viblog database initialized successfully!';
  RAISE NOTICE 'Tables created: vibe_sessions, session_fragments, projects, articles, article_paragraphs, llm_config, user_settings, metrics_cache';
  RAISE NOTICE 'Auth tables (optional): users, auth_sessions, annotations, annotation_comments';
END $$;