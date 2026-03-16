# Viblog - Backend Structure Document

## 文档信息
- **功能**: 后端结构文档，定义数据库架构、API 端点和后端逻辑
- **作用**: 后端开发的权威参考，确保数据层一致性
- **职责**: 明确"数据如何存储和流转"，覆盖数据库、API、安全
- **阅读时机**: 按需阅读 - 当需要了解数据库结构、API 端点或 MCP 后端实现时

---

## 1. Overview

This document defines the database schema, API endpoints, and backend logic for Viblog, including new MCP-related components.

---

## 2. Database Architecture

### 2.1 Database Provider

**Supabase PostgreSQL** - Managed PostgreSQL with built-in auth and real-time capabilities.

### 2.2 Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  auth.users (Supabase managed)                              │
│       │                                                     │
│       │ 1:1                                                 │
│       ▼                                                     │
│  public.profiles ─────────┬──────────────┐                  │
│       │                   │              │                  │
│       │ 1:N               │ 1:N          │ 1:N              │
│       ▼                   ▼              ▼                  │
│  public.projects     public.articles  public.draft_buckets  │
│       │                   │              │ (NEW)            │
│       │ 1:N               │              │                  │
│       ▼                   │              │                  │
│  public.articles           │              │                 │
│                            │              │                 │
│  public.user_settings      │              │                 │
│  public.stars              │              │                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

### 3.1 Draft Buckets Table (New)

```sql
CREATE TABLE public.draft_buckets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,

  -- Session Data (from MCP)
  session_data JSONB NOT NULL,
  -- Structure:
  -- {
  --   "prompts": [{ "content": "...", "timestamp": "..." }],
  --   "responses": [{ "content": "...", "timestamp": "..." }],
  --   "code_changes": [{ "file": "...", "diff": "...", "timestamp": "..." }],
  --   "decisions": [{ "decision": "...", "context": "..." }],
  --   "metadata": {
  --     "platform": "claude-code",
  --     "duration_minutes": 45,
  --     "model": "claude-opus-4-6"
  --   }
  -- }

  -- AI-Extracted Content
  title_suggestions TEXT[],
  code_snippets JSONB DEFAULT '[]'::jsonb,
  -- [{ "purpose": "...", "code": "...", "language": "...", "context": "..." }]

  decisions JSONB DEFAULT '[]'::jsonb,
  -- [{ "decision": "...", "reason": "...", "context": "..." }]

  problems JSONB DEFAULT '[]'::jsonb,
  -- [{ "problem": "...", "solution": "...", "context": "..." }]

  -- Human Input
  human_reflections TEXT,
  additional_notes TEXT,
  custom_title TEXT,

  -- Status
  status TEXT DEFAULT 'raw' NOT NULL
    CHECK (status IN ('raw', 'draft', 'generating', 'completed')),
  generated_article_id UUID REFERENCES public.articles(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX draft_buckets_user_id_idx ON public.draft_buckets(user_id);
CREATE INDEX draft_buckets_status_idx ON public.draft_buckets(status);
CREATE INDEX draft_buckets_created_at_idx ON public.draft_buckets(created_at DESC);
CREATE INDEX draft_buckets_project_id_idx ON public.draft_buckets(project_id);
```

### 3.2 Articles Table (Updated)

```sql
-- Add JSON content column for AI-consumable format
ALTER TABLE public.articles ADD COLUMN json_content JSONB;

-- json_content structure:
-- {
--   "article_id": "uuid",
--   "title": "...",
--   "summary": "...",
--   "key_decisions": [{ "decision": "...", "reason": "..." }],
--   "code_snippets": [{ "purpose": "...", "code": "...", "language": "..." }],
--   "lessons_learned": ["..."],
--   "related_topics": ["..."],
--   "keywords": ["..."],
--   "difficulty_level": "beginner|intermediate|advanced"
-- }

-- Index for JSON content search
CREATE INDEX articles_json_content_idx ON public.articles USING gin(json_content);
```

### 3.3 MCP API Keys Table (New)

```sql
CREATE TABLE public.mcp_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  api_key_hash TEXT NOT NULL,
  api_key_prefix TEXT NOT NULL, -- First 8 chars for display
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT api_key_prefix_length CHECK (char_length(api_key_prefix) = 8)
);

CREATE INDEX mcp_api_keys_user_id_idx ON public.mcp_api_keys(user_id);
CREATE INDEX mcp_api_keys_prefix_idx ON public.mcp_api_keys(api_key_prefix);
```

---

## 4. Row Level Security (RLS)

### 4.1 Draft Buckets RLS

```sql
ALTER TABLE public.draft_buckets ENABLE ROW LEVEL SECURITY;

-- Users can only see their own draft buckets
CREATE POLICY "Users can manage own draft buckets"
  ON public.draft_buckets FOR ALL
  USING (user_id = auth.uid());
```

### 4.2 MCP API Keys RLS

```sql
ALTER TABLE public.mcp_api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only see their own API keys
CREATE POLICY "Users can manage own MCP API keys"
  ON public.mcp_api_keys FOR ALL
  USING (user_id = auth.uid());
```

---

## 5. API Endpoints

### 5.1 MCP Integration Endpoints (New)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/mcp/history` | Receive session data | MCP API Key |
| GET | `/api/mcp/status` | Check connection status | User Session |
| POST | `/api/mcp/api-keys` | Generate new MCP API key | User Session |
| DELETE | `/api/mcp/api-keys` | Revoke MCP API key | User Session |

### 5.2 Draft Bucket Endpoints (New)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/draft-buckets` | List user's draft buckets |
| GET | `/api/draft-buckets/[id]` | Get draft bucket details |
| PUT | `/api/draft-buckets/[id]` | Update draft bucket (add reflections) |
| POST | `/api/draft-buckets/[id]/generate` | Generate article from bucket |
| DELETE | `/api/draft-buckets/[id]` | Delete draft bucket |

### 5.3 Dual-Layer Content Endpoints (New)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/articles/[id]` | Get article (Markdown) |
| GET | `/api/public/articles/[id]/json` | Get article (JSON format) |
| GET | `/api/public/articles/[id]/json/schema` | Get JSON schema |

---

## 6. API Request/Response Schemas

### 6.1 MCP History Request

```typescript
// POST /api/mcp/history
interface MCPHistoryRequest {
  session_data: {
    prompts: Array<{
      content: string;
      timestamp: string;
    }>;
    responses: Array<{
      content: string;
      timestamp: string;
    }>;
    code_changes: Array<{
      file: string;
      diff: string;
      timestamp: string;
    }>;
    decisions: Array<{
      decision: string;
      context: string;
    }>;
    metadata: {
      platform: 'claude-code' | 'cursor' | 'codex' | 'other';
      duration_minutes: number;
      model: string;
    };
  };
  project_id?: string;
}

interface MCPHistoryResponse {
  draft_bucket_id: string;
  title_suggestions: string[];
  status: 'raw';
  created_at: string;
}
```

### 6.2 Draft Bucket Update Request

```typescript
// PUT /api/draft-buckets/[id]
interface UpdateDraftBucketRequest {
  human_reflections?: string;
  additional_notes?: string;
  custom_title?: string;
  title_selection?: number; // Index of selected title suggestion
}
```

### 6.3 Article Generation Request

```typescript
// POST /api/draft-buckets/[id]/generate
interface GenerateArticleRequest {
  style?: 'tutorial' | 'case-study' | 'reflection' | 'technical';
  target_audience?: 'beginner' | 'intermediate' | 'advanced';
  include_code_comments?: boolean;
}

interface GenerateArticleResponse {
  article_id: string;
  title: string;
  status: 'draft';
  generated_at: string;
}
```

### 6.4 JSON Article Response

```typescript
// GET /api/public/articles/[id]/json
interface JSONArticleResponse {
  article_id: string;
  title: string;
  summary: string;
  key_decisions: Array<{
    decision: string;
    reason: string;
  }>;
  code_snippets: Array<{
    purpose: string;
    code: string;
    language: string;
  }>;
  lessons_learned: string[];
  related_topics: string[];
  keywords: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  full_content_url: string;
  metadata: {
    author: {
      username: string;
      display_name: string | null;
    };
    platform: string | null;
    duration_minutes: number | null;
    model: string | null;
    published_at: string;
  };
}
```

---

## 7. MCP Server Implementation

### 7.1 Server Structure

```
viblog-mcp-server/
├── src/
│   ├── index.ts           # Server entry point
│   ├── tools/
│   │   ├── update-history.ts   # update_vibe_coding_history tool
│   │   ├── get-sessions.ts     # get_recent_sessions tool
│   │   └── generate-draft.ts   # generate_draft_bucket tool
│   ├── api/
│   │   └── client.ts      # Viblog API client
│   └── types/
│       └── index.ts       # Shared types
├── package.json
└── README.md
```

### 7.2 Tool Definitions

```typescript
// MCP Tool: update_vibe_coding_history
const updateVibeCodingHistoryTool = {
  name: "update_vibe_coding_history",
  description: "Record a vibe coding session for article generation",
  inputSchema: {
    type: "object",
    properties: {
      prompts: {
        type: "array",
        items: { type: "string" },
        description: "List of prompts sent to the AI"
      },
      responses: {
        type: "array",
        items: { type: "string" },
        description: "List of AI responses"
      },
      code_changes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            file: { type: "string" },
            diff: { type: "string" }
          }
        },
        description: "Code changes made during session"
      },
      decisions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            decision: { type: "string" },
            context: { type: "string" }
          }
        },
        description: "Key decisions made"
      },
      project_id: {
        type: "string",
        description: "Optional project to associate with"
      }
    },
    required: ["prompts", "responses"]
  }
};
```

---

## 8. Error Handling

### 8.1 Error Response Format

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

### 8.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Permission denied |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `GENERATION_FAILED` | 500 | Article generation failed |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 9. Database Functions

### 9.1 Auto-generate JSON Content

```sql
CREATE OR REPLACE FUNCTION public.generate_json_content(article_id UUID)
RETURNS JSONB AS $$
DECLARE
  article RECORD;
  json_content JSONB;
BEGIN
  SELECT * INTO article FROM public.articles WHERE id = article_id;

  json_content = jsonb_build_object(
    'article_id', article.id,
    'title', article.title,
    'summary', COALESCE(article.excerpt, LEFT(article.content, 200)),
    'key_decisions', '[]'::jsonb,
    'code_snippets', '[]'::jsonb,
    'lessons_learned', '[]'::jsonb,
    'related_topics', '[]'::jsonb,
    'full_content_url', '/articles/' || article.slug
  );

  UPDATE public.articles
  SET json_content = json_content
  WHERE id = article_id;

  RETURN json_content;
END;
$$ LANGUAGE plpgsql;
```

---

---

## 10. AI-Data-Native Tables (New - 2026-03-16)

### 10.1 Overview

These tables support the AI-Data-Native architecture, enabling:
- **External reference management** - User-cited links and snapshots
- **User insights** - Personal reading reflections and inspirations
- **Annotation system** - Article highlighting and discussions
- **Behavioral analytics** - User interaction tracking
- **Credits system** - Data contribution incentives

### 10.2 External Links (User Private Database)

```sql
-- User-cited external links
CREATE TABLE public.external_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Link information
  url TEXT NOT NULL,
  title TEXT,                    -- Page title
  site_name TEXT,                -- Source website
  favicon_url TEXT,

  -- Snapshot (stored with user authorization)
  snapshot_status TEXT DEFAULT 'none'
    CHECK (snapshot_status IN ('none', 'pending', 'cached', 'failed')),
  snapshot_content TEXT,         -- Cached page content
  snapshot_at TIMESTAMPTZ,

  -- Vector embedding for semantic search
  snapshot_embedding VECTOR(1536),  -- OpenAI text-embedding-3-small

  -- Metadata
  metadata JSONB DEFAULT '{}',   -- {author, publish_date, tags, ...}

  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,

  UNIQUE(user_id, url)
);

CREATE INDEX idx_external_links_user ON public.external_links(user_id);
CREATE INDEX idx_external_links_embedding ON public.external_links USING ivfflat (snapshot_embedding vector_cosine_ops);
```

### 10.3 User Insights (User Private Database)

```sql
-- User's reading reflections and inspirations
CREATE TABLE public.user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Insight content
  content TEXT NOT NULL,         -- User's thoughts/reflections
  source_type TEXT NOT NULL
    CHECK (source_type IN ('external_link', 'viblog_article', 'book', 'conversation')),
  source_id UUID,                -- Related source ID

  -- Vector embedding for semantic search
  embedding VECTOR(1536),        -- OpenAI text-embedding-3-small

  -- Context
  created_at TIMESTAMPTZ DEFAULT NOW(),
  context TEXT,                  -- Context when insight was written

  -- Usage tracking
  used_in_articles UUID[] DEFAULT '{}',

  CONSTRAINT unique_user_insight UNIQUE(user_id, content)
);

CREATE INDEX idx_user_insights_user ON public.user_insights(user_id);
CREATE INDEX idx_user_insights_embedding ON public.user_insights USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_user_insights_source ON public.user_insights(source_type, source_id);
```

### 10.4 Insight Links (User Private Database)

```sql
-- Association between insights and external links
CREATE TABLE public.insight_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id UUID REFERENCES public.user_insights(id) ON DELETE CASCADE NOT NULL,
  link_id UUID REFERENCES public.external_links(id) ON DELETE CASCADE NOT NULL,

  -- Excerpt that triggered the insight
  excerpt TEXT,                  -- Quoted fragment from source
  excerpt_position JSONB,        -- Position of fragment in source

  -- User annotation
  relevance_score INT DEFAULT 3, -- 1-5 relevance rating
  note TEXT,                     -- User's note about this fragment

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(insight_id, link_id)
);

CREATE INDEX idx_insight_links_insight ON public.insight_links(insight_id);
CREATE INDEX idx_insight_links_link ON public.insight_links(link_id);
```

### 10.5 Article Paragraphs (Platform Database)

```sql
-- Article paragraphs for annotation and retrieval
CREATE TABLE public.article_paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL,      -- Public article ID
  paragraph_index INT NOT NULL,  -- Paragraph order
  content TEXT NOT NULL,         -- Paragraph text
  content_hash TEXT,             -- Content hash (detect edits)

  -- Vector embedding for semantic search
  embedding VECTOR(1536),        -- OpenAI text-embedding-3-small

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(article_id, paragraph_index)
);

CREATE INDEX idx_paragraphs_article ON public.article_paragraphs(article_id);
CREATE INDEX idx_paragraphs_embedding ON public.article_paragraphs USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_paragraphs_hash ON public.article_paragraphs(content_hash);
```

### 10.6 Annotations (Platform Database)

```sql
-- Article annotations (highlighting and margin notes)
CREATE TABLE public.annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL,      -- Public article ID
  paragraph_id UUID REFERENCES public.article_paragraphs(id),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,

  -- Annotation position
  start_offset INT,              -- Character offset within paragraph
  end_offset INT,
  selected_text TEXT,            -- Selected original text (for display)

  -- Annotation content
  content TEXT NOT NULL,         -- Annotation content

  -- Discussion chain
  discussion JSONB DEFAULT '[]', -- [{user_id, content, created_at}]

  -- Privacy
  visibility TEXT DEFAULT 'public'
    CHECK (visibility IN ('public', 'private', 'followers')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_annotations_user ON public.annotations(user_id);
CREATE INDEX idx_annotations_article ON public.annotations(article_id);
CREATE INDEX idx_annotations_paragraph ON public.annotations(paragraph_id);
```

### 10.7 User Interactions (Platform Database)

```sql
-- User behavioral events for analytics
CREATE TABLE public.user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  session_id UUID,               -- Browser session

  -- Interaction type
  interaction_type TEXT NOT NULL
    CHECK (interaction_type IN (
      'page_view', 'article_view', 'click', 'scroll',
      'star', 'unstar', 'follow', 'unfollow',
      'search', 'share', 'bookmark', 'annotation_create'
    )),

  -- Target
  target_type TEXT,              -- 'article', 'user', 'tag', 'annotation'
  target_id UUID,

  -- Details
  metadata JSONB DEFAULT '{}',   -- {duration_ms, scroll_depth, referrer, ...}

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioned by month for performance
CREATE INDEX idx_interactions_user ON public.user_interactions(user_id);
CREATE INDEX idx_interactions_type ON public.user_interactions(interaction_type);
CREATE INDEX idx_interactions_created ON public.user_interactions(created_at);
CREATE INDEX idx_interactions_target ON public.user_interactions(target_type, target_id);
```

### 10.8 User Credits (Platform Database)

```sql
-- User credits for data contribution
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) UNIQUE NOT NULL,

  balance INT DEFAULT 0,         -- Current balance
  total_earned INT DEFAULT 0,    -- Total earned
  total_spent INT DEFAULT 0,     -- Total spent

  -- Privacy level
  privacy_level INT DEFAULT 1
    CHECK (privacy_level BETWEEN 1 AND 3),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_credits_user ON public.user_credits(user_id);
```

### 10.9 Credit Transactions (Platform Database)

```sql
-- Credit transaction history
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,

  amount INT NOT NULL,           -- Positive = earned, negative = spent
  transaction_type TEXT NOT NULL
    CHECK (transaction_type IN (
      'session_contribution', 'article_contribution', 'active_usage',
      'subscription_payment', 'reward_redemption', 'referral_bonus'
    )),

  reference_id UUID,             -- Related session/article/etc
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON public.credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_created ON public.credit_transactions(created_at);
```

### 10.10 Authorization Tokens (Platform Database)

```sql
-- AI access authorization tokens
CREATE TABLE public.authorization_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,

  token_hash TEXT NOT NULL,      -- SHA-256 hash of token
  token_prefix TEXT NOT NULL,    -- First 8 chars for display

  -- Granted data sources
  granted_datasources TEXT[] DEFAULT '{}',  -- ['user_insights', 'external_links', ...]

  -- Privacy level
  privacy_level INT DEFAULT 1
    CHECK (privacy_level BETWEEN 1 AND 3),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  UNIQUE(token_hash)
);

CREATE INDEX idx_auth_tokens_user ON public.authorization_tokens(user_id);
CREATE INDEX idx_auth_tokens_hash ON public.authorization_tokens(token_hash);
CREATE INDEX idx_auth_tokens_prefix ON public.authorization_tokens(token_prefix);
```

---

## 11. Multimedia & Social Integration Tables (New - 2026-03-16)

### 11.1 Overview

These tables support multimedia content, social platform integration, and viral growth mechanisms:
- **Media assets** - Images and video links associated with articles
- **Social accounts** - OAuth-connected third-party platforms
- **Social prompts** - Platform-specific content adaptation prompts
- **Share history** - Cross-platform sharing tracking and credits

### 11.2 Media Assets (User Private Database)

```sql
-- Images and media files uploaded by users
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,

  -- Asset information
  asset_type TEXT NOT NULL
    CHECK (asset_type IN ('image', 'video_thumbnail')),
  file_name TEXT NOT NULL,
  file_size INT,                  -- Bytes
  mime_type TEXT,

  -- Storage
  storage_path TEXT NOT NULL,     -- Supabase Storage path
  public_url TEXT NOT NULL,
  thumbnail_url TEXT,             -- For videos

  -- Metadata
  width INT,
  height INT,
  alt_text TEXT,
  metadata JSONB DEFAULT '{}',    -- {exif, compression, etc.}

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_assets_user ON public.media_assets(user_id);
CREATE INDEX idx_media_assets_article ON public.media_assets(article_id);
```

### 11.3 Video Links (User Private Database)

```sql
-- Video platform links associated with articles
CREATE TABLE public.video_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,

  -- Platform information
  platform TEXT NOT NULL
    CHECK (platform IN ('youtube', 'tiktok', 'bilibili', 'douyin', 'vimeo', 'other')),
  platform_video_id TEXT NOT NULL,

  -- URLs
  video_url TEXT NOT NULL,        -- Original video URL
  embed_url TEXT,                 -- Embed URL for preview
  thumbnail_url TEXT,             -- Video thumbnail

  -- Metadata
  title TEXT,
  description TEXT,
  duration_seconds INT,
  view_count INT,

  -- Sync status
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending'
    CHECK (sync_status IN ('pending', 'synced', 'failed')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(article_id, platform, platform_video_id)
);

CREATE INDEX idx_video_links_user ON public.video_links(user_id);
CREATE INDEX idx_video_links_article ON public.video_links(article_id);
CREATE INDEX idx_video_links_platform ON public.video_links(platform);
```

### 11.4 Social Accounts (Platform Database)

```sql
-- OAuth-connected social media accounts
CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Platform information
  platform TEXT NOT NULL
    CHECK (platform IN ('facebook', 'x', 'linkedin', 'instagram', 'xiaohongshu', 'weibo', 'zhihu', 'whatsapp', 'threads')),
  platform_user_id TEXT,          -- Third-party user ID
  platform_username TEXT,

  -- OAuth tokens (encrypted)
  access_token TEXT,              -- Encrypted with AES-256-GCM
  refresh_token TEXT,             -- Encrypted
  token_expires_at TIMESTAMPTZ,

  -- Permissions
  granted_scopes TEXT[],          -- ['publish', 'read', 'profile']
  can_post BOOLEAN DEFAULT FALSE,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, platform)
);

CREATE INDEX idx_social_accounts_user ON public.social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON public.social_accounts(platform);
```

### 11.5 Social Prompts (Platform Database)

```sql
-- Platform-specific content adaptation prompts
CREATE TABLE public.social_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Platform
  platform TEXT NOT NULL,

  -- Prompt configuration
  prompt TEXT NOT NULL,           -- "Rewrite my blog for X platform..."
  tone TEXT DEFAULT 'professional',
    CHECK (tone IN ('professional', 'casual', 'humorous', 'inspirational', 'educational')),
  include_hashtags BOOLEAN DEFAULT TRUE,
  include_link BOOLEAN DEFAULT TRUE,
  max_length INT,                 -- Character limit for platform

  -- Template variables
  variables JSONB DEFAULT '{}',   -- {tone_hints, preferred_hashtags, call_to_action}

  -- Status
  is_default BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, platform)
);

CREATE INDEX idx_social_prompts_user ON public.social_prompts(user_id);
```

### 11.6 Share History (Platform Database)

```sql
-- Cross-platform sharing history
CREATE TABLE public.share_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,

  -- Platform information
  platform TEXT NOT NULL,
  platform_post_id TEXT,          -- Post ID on third-party platform
  platform_post_url TEXT,         -- URL to the shared post

  -- Generated content
  generated_content TEXT,         -- AI-generated share text
  used_prompt_id UUID REFERENCES public.social_prompts(id),

  -- Metrics
  platform_likes INT DEFAULT 0,
  platform_comments INT DEFAULT 0,
  platform_shares INT DEFAULT 0,
  platform_views INT DEFAULT 0,
  last_metric_sync TIMESTAMPTZ,

  -- Credits
  credits_earned INT DEFAULT 0,   -- Credits from this share

  -- Status
  status TEXT DEFAULT 'success'
    CHECK (status IN ('success', 'failed', 'pending', 'deleted')),

  shared_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, article_id, platform)
);

CREATE INDEX idx_share_history_user ON public.share_history(user_id);
CREATE INDEX idx_share_history_article ON public.share_history(article_id);
CREATE INDEX idx_share_history_platform ON public.share_history(platform);
CREATE INDEX idx_share_history_shared ON public.share_history(shared_at);
```

### 11.7 Credit Rewards (Platform Database)

```sql
-- Credit earning rules and history
CREATE TABLE public.credit_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Reward type
  reward_type TEXT NOT NULL
    CHECK (reward_type IN (
      'share_platform', 'high_quality_article', 'session_contribution',
      'referral', 'early_adopter', 'community_contribution'
    )),

  -- Related entity
  reference_id UUID,              -- share_history.id, article.id, etc.
  reference_type TEXT,

  -- Credits
  credits INT NOT NULL,           -- Credits earned

  -- Verification
  verification_status TEXT DEFAULT 'verified'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_rewards_user ON public.credit_rewards(user_id);
CREATE INDEX idx_credit_rewards_type ON public.credit_rewards(reward_type);
CREATE INDEX idx_credit_rewards_created ON public.credit_rewards(created_at);
```

---

## 12. MCP Governance Tables (New - 2026-03-16)

### 12.1 Overview

These tables support the MCP ecosystem:
- **MCP Registry** - Catalog of available third-party MCPs
- **User MCP Installs** - User's installed MCPs
- **MCP Configurations** - User-specific MCP settings
- **Local MCP Sync** - Sync between local dev platforms and Viblog

### 12.2 MCP Registry (Platform Database)

```sql
-- Public MCP marketplace catalog
CREATE TABLE public.mcp_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- MCP information
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general'
    CHECK (category IN ('productivity', 'analytics', 'integration', 'content', 'development', 'general')),

  -- Publisher
  publisher_id UUID REFERENCES public.profiles(id),
  publisher_name TEXT NOT NULL,

  -- Version and source
  version TEXT NOT NULL,
  repository_url TEXT,
  documentation_url TEXT,

  -- Capabilities (declared)
  capabilities JSONB DEFAULT '[]', -- [{name, description, inputSchema}]

  -- Stats
  installation_count INT DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0.0,
  rating_count INT DEFAULT 0,

  -- Moderation
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'deprecated', 'removed', 'pending_review')),

  -- Pricing
  is_free BOOLEAN DEFAULT TRUE,
  price_credits INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mcp_registry_category ON public.mcp_registry(category);
CREATE INDEX idx_mcp_registry_publisher ON public.mcp_registry(publisher_id);
CREATE INDEX idx_mcp_registry_installations ON public.mcp_registry(installation_count DESC);
CREATE INDEX idx_mcp_registry_rating ON public.mcp_registry(rating_avg DESC);
```

### 12.3 User MCP Installs (Platform Database)

```sql
-- User's installed MCPs
CREATE TABLE public.user_mcp_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mcp_id UUID REFERENCES public.mcp_registry(id) ON DELETE CASCADE NOT NULL,

  -- Installation details
  installed_version TEXT NOT NULL,

  -- Status
  enabled BOOLEAN DEFAULT TRUE,
  auto_update BOOLEAN DEFAULT TRUE,

  -- Usage stats
  total_calls INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,

  installed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, mcp_id)
);

CREATE INDEX idx_user_mcp_installs_user ON public.user_mcp_installs(user_id);
CREATE INDEX idx_user_mcp_installs_mcp ON public.user_mcp_installs(mcp_id);
```

### 12.4 MCP Configurations (User Private Database)

```sql
-- User-specific MCP configurations
CREATE TABLE public.mcp_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mcp_id UUID REFERENCES public.mcp_registry(id) ON DELETE CASCADE NOT NULL,

  -- Configuration
  config JSONB DEFAULT '{}',      -- MCP-specific settings
  -- {
  --   "api_keys": {"encrypted": "..."},
  --   "preferences": {...},
  --   "custom_prompts": [...]
  -- }

  -- Privacy
  share_with_platform BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, mcp_id)
);

CREATE INDEX idx_mcp_configurations_user ON public.mcp_configurations(user_id);
```

### 12.5 Local MCP Sync (User Private Database)

```sql
-- Sync between local dev platforms and Viblog
CREATE TABLE public.local_mcp_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Local platform
  local_platform TEXT NOT NULL
    CHECK (local_platform IN ('claude-code', 'cursor', 'windsurf', 'zed', 'vscode')),

  -- Sync configuration
  sync_token TEXT,                -- Encrypted authentication token
  sync_enabled BOOLEAN DEFAULT TRUE,

  -- MCP list to sync
  mcps_to_sync TEXT[] DEFAULT '{}',

  -- Sync status
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'not_configured'
    CHECK (sync_status IN ('not_configured', 'active', 'error', 'paused')),
  last_error TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, local_platform)
);

CREATE INDEX idx_local_mcp_sync_user ON public.local_mcp_sync(user_id);
```

---

## 13. Row Level Security (RLS) for New Tables

### 11.1 External Links RLS

```sql
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own external links"
  ON public.external_links FOR ALL
  USING (user_id = auth.uid());
```

### 11.2 User Insights RLS

```sql
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own insights"
  ON public.user_insights FOR ALL
  USING (user_id = auth.uid());
```

### 11.3 Annotations RLS

```sql
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;

-- Public annotations are viewable by all
CREATE POLICY "Public annotations viewable by all"
  ON public.annotations FOR SELECT
  USING (visibility = 'public' OR user_id = auth.uid());

-- Users manage own annotations
CREATE POLICY "Users manage own annotations"
  ON public.annotations FOR ALL
  USING (user_id = auth.uid());
```

### 11.4 User Interactions RLS

```sql
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own interactions
CREATE POLICY "Users see own interactions"
  ON public.user_interactions FOR SELECT
  USING (user_id = auth.uid());

-- Anyone can insert (for anonymous tracking)
CREATE POLICY "Anyone can insert interactions"
  ON public.user_interactions FOR INSERT
  WITH CHECK (true);
```

### 13.5 Media Assets RLS

```sql
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own media assets"
  ON public.media_assets FOR ALL
  USING (user_id = auth.uid());

-- Public read for images in published articles
CREATE POLICY "Public images viewable"
  ON public.media_assets FOR SELECT
  USING (
    article_id IN (SELECT id FROM public.articles WHERE status = 'published')
  );
```

### 13.6 Video Links RLS

```sql
ALTER TABLE public.video_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own video links"
  ON public.video_links FOR ALL
  USING (user_id = auth.uid());

-- Public read for videos in published articles
CREATE POLICY "Public videos viewable"
  ON public.video_links FOR SELECT
  USING (
    article_id IN (SELECT id FROM public.articles WHERE status = 'published')
  );
```

### 13.7 Social Accounts RLS

```sql
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Users manage own social accounts
CREATE POLICY "Users manage own social accounts"
  ON public.social_accounts FOR ALL
  USING (user_id = auth.uid());
```

### 13.8 Social Prompts RLS

```sql
ALTER TABLE public.social_prompts ENABLE ROW LEVEL SECURITY;

-- Users manage own social prompts
CREATE POLICY "Users manage own social prompts"
  ON public.social_prompts FOR ALL
  USING (user_id = auth.uid());
```

### 13.9 Share History RLS

```sql
ALTER TABLE public.share_history ENABLE ROW LEVEL SECURITY;

-- Users see own share history
CREATE POLICY "Users see own share history"
  ON public.share_history FOR SELECT
  USING (user_id = auth.uid());

-- Users insert own shares
CREATE POLICY "Users create own shares"
  ON public.share_history FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

### 13.10 Credit Rewards RLS

```sql
ALTER TABLE public.credit_rewards ENABLE ROW LEVEL SECURITY;

-- Users see own credit rewards
CREATE POLICY "Users see own credit rewards"
  ON public.credit_rewards FOR SELECT
  USING (user_id = auth.uid());
```

### 13.11 MCP Registry RLS

```sql
ALTER TABLE public.mcp_registry ENABLE ROW LEVEL SECURITY;

-- Public MCPs viewable by all
CREATE POLICY "Active MCPs viewable by all"
  ON public.mcp_registry FOR SELECT
  USING (status = 'active');

-- Only publishers can manage their MCPs
CREATE POLICY "Publishers manage own MCPs"
  ON public.mcp_registry FOR ALL
  USING (publisher_id = auth.uid());
```

### 13.12 User MCP Installs RLS

```sql
ALTER TABLE public.user_mcp_installs ENABLE ROW LEVEL SECURITY;

-- Users manage own MCP installs
CREATE POLICY "Users manage own MCP installs"
  ON public.user_mcp_installs FOR ALL
  USING (user_id = auth.uid());
```

### 13.13 MCP Configurations RLS

```sql
ALTER TABLE public.mcp_configurations ENABLE ROW LEVEL SECURITY;

-- Users manage own MCP configurations
CREATE POLICY "Users manage own MCP configurations"
  ON public.mcp_configurations FOR ALL
  USING (user_id = auth.uid());
```

### 13.14 Local MCP Sync RLS

```sql
ALTER TABLE public.local_mcp_sync ENABLE ROW LEVEL SECURITY;

-- Users manage own local MCP sync
CREATE POLICY "Users manage own local MCP sync"
  ON public.local_mcp_sync FOR ALL
  USING (user_id = auth.uid());
```

---

## 14. API Endpoints for AI-Data-Native Features

### 12.1 External Links Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/links` | Create external link with snapshot |
| GET | `/api/links` | List user's external links |
| GET | `/api/links/[id]` | Get link details |
| DELETE | `/api/links/[id]` | Delete external link |
| POST | `/api/links/[id]/snapshot` | Refresh snapshot |

### 12.2 Insights Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/insights` | Create insight |
| GET | `/api/insights` | List user's insights |
| PUT | `/api/insights/[id]` | Update insight |
| DELETE | `/api/insights/[id]` | Delete insight |
| POST | `/api/insights/search` | Semantic search insights |

### 12.3 Annotation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/articles/[id]/annotations` | Create annotation |
| GET | `/api/articles/[id]/annotations` | List article annotations |
| PUT | `/api/annotations/[id]` | Update annotation |
| DELETE | `/api/annotations/[id]` | Delete annotation |
| POST | `/api/annotations/[id]/reply` | Add reply to discussion |

### 12.4 Authorization Token Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/tokens` | Generate new authorization token |
| GET | `/api/auth/tokens` | List user's tokens |
| DELETE | `/api/auth/tokens/[id]` | Revoke token |
| PUT | `/api/auth/tokens/[id]` | Update token permissions |

### 14.5 Credits Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/credits` | Get user's credit balance |
| GET | `/api/credits/transactions` | Get transaction history |
| POST | `/api/credits/earn` | Earn credits (contribution) |
| POST | `/api/credits/spend` | Spend credits (redemption) |

---

## 15. API Endpoints for Multimedia Features

### 15.1 Media Assets Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/media` | Upload media asset |
| GET | `/api/media` | List user's media assets |
| GET | `/api/media/[id]` | Get media asset details |
| DELETE | `/api/media/[id]` | Delete media asset |

### 15.2 Video Links Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/articles/[id]/videos` | Link video to article |
| GET | `/api/articles/[id]/videos` | Get article's video links |
| DELETE | `/api/videos/[id]` | Remove video link |
| POST | `/api/videos/[id]/sync` | Sync video metadata |

---

## 16. API Endpoints for Social Integration

### 16.1 Social Accounts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/social/accounts` | List connected accounts |
| POST | `/api/social/connect/[platform]` | Initiate OAuth flow |
| DELETE | `/api/social/accounts/[id]` | Disconnect account |
| GET | `/api/social/callback/[platform]` | OAuth callback handler |

### 16.2 Social Prompts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/social/prompts` | List user's prompts |
| POST | `/api/social/prompts` | Create platform prompt |
| PUT | `/api/social/prompts/[id]` | Update prompt |
| DELETE | `/api/social/prompts/[id]` | Delete prompt |

### 16.3 Share Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/articles/[id]/share` | Generate share content |
| POST | `/api/articles/[id]/share/[platform]` | Share to specific platform |
| POST | `/api/articles/[id]/share-all` | One-click share to all platforms |
| GET | `/api/articles/[id]/shares` | Get share history |
| GET | `/api/share/[id]/analytics` | Get share analytics |

### 16.4 Credit Rewards Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rewards` | List user's rewards |
| GET | `/api/rewards/summary` | Get rewards summary |
| POST | `/api/rewards/claim` | Claim pending rewards |

---

## 17. API Endpoints for MCP Governance

### 17.1 MCP Market Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mcp/market` | Browse MCP market |
| GET | `/api/mcp/market/[id]` | Get MCP details |
| GET | `/api/mcp/market/search` | Search MCPs |
| POST | `/api/mcp/market` | Publish new MCP (publishers) |
| PUT | `/api/mcp/market/[id]` | Update MCP listing |
| POST | `/api/mcp/market/[id]/review` | Submit review |

### 17.2 User MCP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mcp/installed` | List installed MCPs |
| POST | `/api/mcp/install/[id]` | Install MCP |
| DELETE | `/api/mcp/installed/[id]` | Uninstall MCP |
| PUT | `/api/mcp/installed/[id]` | Update MCP settings |

### 17.3 MCP Configuration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mcp/config/[id]` | Get MCP configuration |
| PUT | `/api/mcp/config/[id]` | Update MCP configuration |
| POST | `/api/mcp/config/[id]/validate` | Validate configuration |

### 17.4 Local MCP Sync Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mcp/sync` | List sync configurations |
| POST | `/api/mcp/sync` | Setup platform sync |
| PUT | `/api/mcp/sync/[platform]` | Update sync settings |
| POST | `/api/mcp/sync/[platform]/now` | Trigger immediate sync |
| DELETE | `/api/mcp/sync/[platform]` | Remove sync |

---

## 18. Credits System Design

### 18.1 Credit Earning Rules

| Action | Credits | Verification | Notes |
|--------|---------|--------------|-------|
| Share to platform | 1 credit | Auto-verified | Per platform share |
| High-quality article (100+ stars) | 10 credits | Auto-verified | One-time per article |
| Session data contribution | 50 credits | Manual review | User authorization required |
| Referral signup | 5 credits | Auto-verified | When referral completes onboarding |
| Early adopter bonus | 20 credits | Auto-verified | First 1000 users |

### 18.2 Credit Redemption

| Redemption | Credits Required | Notes |
|------------|------------------|-------|
| 1 month Pro subscription | 100 credits | Standard redemption |
| Featured article placement | 50 credits | 7-day featured spot |
| Custom domain (annual) | 200 credits | One domain per year |

### 18.3 Credit Transaction Flow

```
User Action → System Check → Credit Calculation → Verification → Balance Update

1. User shares article to X
2. System checks: platform connected? article owned? not already shared?
3. Calculate: 1 credit for X share
4. Verify: API confirms post exists
5. Update: user_credits.balance += 1
6. Record: credit_rewards + credit_transactions
```

---

**Document Version:** 4.0
**Last Updated:** 2026-03-16
**Author:** Viblog Team
**Key Updates:**
- v4.0: Added Multimedia, Social Integration, MCP Governance tables (10 new tables)
- v3.0: Added AI-Data-Native tables, RLS policies, and API endpoints
- v2.0: Added Draft Buckets, MCP API schemas