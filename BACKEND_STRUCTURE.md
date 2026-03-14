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

**Document Version:** 2.0
**Last Updated:** 2026-03-15
**Author:** Viblog Team