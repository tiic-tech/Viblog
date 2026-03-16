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

## 11. Row Level Security (RLS) for New Tables

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

---

## 12. API Endpoints for AI-Data-Native Features

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

### 12.5 Credits Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/credits` | Get user's credit balance |
| GET | `/api/credits/transactions` | Get transaction history |
| POST | `/api/credits/earn` | Earn credits (contribution) |
| POST | `/api/credits/spend` | Spend credits (redemption) |

---

**Document Version:** 3.0
**Last Updated:** 2026-03-16
**Author:** Viblog Team
**Key Updates:** Added AI-Data-Native tables, RLS policies, and API endpoints