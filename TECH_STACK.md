# Viblog - Technology Stack Document

## 文档信息
- **功能**: 技术栈文档，定义所有技术选型、版本和配置
- **作用**: 技术决策的权威参考，确保开发一致性
- **职责**: 明确"用什么技术实现"，覆盖所有依赖
- **阅读时机**: 按需阅读 - 当需要了解技术选型、依赖版本或 MCP 技术细节时

---

## 1. Overview

This document defines the exact versions of every package, dependency, API, and tool used in the Viblog project, including new MCP-related technologies.

---

## 2. Runtime Environment

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 20.11.0 LTS | Required for development |
| pnpm | 8.15.1 | Package manager (preferred over npm/yarn) |
| TypeScript | 5.3.3 | Strict mode enabled |

---

## 3. Core Framework

### 3.1 Frontend Framework

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.1.0 | React framework with App Router |
| react | 18.2.0 | UI library |
| react-dom | 18.2.0 | React DOM renderer |

### 3.2 Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*.supabase.co', 'avatars.githubusercontent.com'],
  },
  experimental: {
    serverActions: true,
  },
}
```

---

## 4. MCP Integration (New)

### 4.1 MCP Server Development

| Package | Version | Purpose |
|---------|---------|---------|
| @modelcontextprotocol/sdk | latest | MCP SDK for server development |
| zod | 3.22.4 | Schema validation for MCP tools |

### 4.2 MCP Server Configuration

```json
// User's MCP config (Claude Code)
{
  "mcpServers": {
    "viblog": {
      "command": "npx",
      "args": ["viblog-mcp-server"],
      "env": {
        "VIBLOG_API_KEY": "user-api-key"
      }
    }
  }
}
```

### 4.3 MCP Tools Provided

| Tool | Description | Parameters |
|------|-------------|------------|
| `update_vibe_coding_history` | Record coding session | session_data, metadata |
| `get_recent_sessions` | Get recent sessions | limit, project_id |
| `generate_draft_bucket` | Create draft from session | session_id |

---

## 5. Styling & UI

### 5.1 CSS Framework

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | 3.4.1 | Utility-first CSS |
| postcss | 8.4.35 | CSS processor |
| autoprefixer | 10.4.17 | Vendor prefixes |

### 5.2 Component Library

| Package | Version | Purpose |
|---------|---------|---------|
| @radix-ui/react-dialog | 1.0.5 | Modal component |
| @radix-ui/react-dropdown-menu | 2.0.6 | Dropdown component |
| @radix-ui/react-select | 2.0.0 | Select component |
| @radix-ui/react-tabs | 1.0.4 | Tabs component |
| @radix-ui/react-toast | 1.1.5 | Toast notifications |
| @radix-ui/react-tooltip | 1.0.7 | Tooltip component |
| @radix-ui/react-avatar | 1.0.4 | Avatar component |
| @radix-ui/react-checkbox | 1.0.4 | Checkbox component |
| @radix-ui/react-label | 2.0.2 | Label component |
| @radix-ui/react-slot | 1.0.2 | Slot component |
| @radix-ui/react-switch | 1.0.3 | Switch component |
| class-variance-authority | 0.7.0 | Variant styling |
| clsx | 2.1.0 | Class merging |
| tailwind-merge | 2.2.1 | Tailwind class merging |
| lucide-react | 0.323.0 | Icon library |

### 5.3 Animation

| Package | Version | Purpose |
|---------|---------|---------|
| framer-motion | 11.0.8 | Animation library |

---

## 6. Forms & Validation

### 6.1 Form Management

| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | 7.50.1 | Form state management |
| @hookform/resolvers | 3.3.4 | Form resolvers |

### 6.2 Validation

| Package | Version | Purpose |
|---------|---------|---------|
| zod | 3.22.4 | Schema validation |

---

## 7. Backend & Database

### 7.1 Supabase Client

| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | 2.39.7 | Supabase client |
| @supabase/ssr | 0.1.0 | SSR support for Supabase |

### 7.2 New Tables for MCP

```sql
-- Draft Buckets Table (New)
CREATE TABLE public.draft_buckets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,

  -- Session Data
  session_data JSONB NOT NULL,
  title_suggestions TEXT[],
  code_snippets JSONB DEFAULT '[]'::jsonb,
  decisions JSONB DEFAULT '[]'::jsonb,
  problems JSONB DEFAULT '[]'::jsonb,

  -- Human Input
  human_reflections TEXT,
  additional_notes TEXT,

  -- Status
  status TEXT DEFAULT 'raw' NOT NULL CHECK (status IN ('raw', 'draft', 'generating', 'completed')),
  generated_article_id UUID REFERENCES public.articles(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX draft_buckets_user_id_idx ON public.draft_buckets(user_id);
CREATE INDEX draft_buckets_status_idx ON public.draft_buckets(status);
```

---

## 8. AI Content Generation

### 8.1 LLM Integration

| Provider | Use Case | Notes |
|----------|----------|-------|
| OpenAI | Article generation | User's own API key |
| Anthropic | Article generation | User's own API key |
| Custom | Article generation | User-configured endpoint |

### 8.2 Prompt Templates

```typescript
// Article generation prompt structure
interface ArticleGenerationPrompt {
  systemPrompt: string;
  sessionData: SessionData;
  humanReflections: string;
  codeSnippets: CodeSnippet[];
  decisions: Decision[];
  problems: Problem[];
}
```

---

## 9. Dual-Layer Content Structure

### 9.1 JSON Schema for AI-Consumable Content

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "article_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "maxLength": 100 },
    "summary": { "type": "string", "maxLength": 500 },
    "key_decisions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "decision": { "type": "string" },
          "reason": { "type": "string" }
        }
      }
    },
    "code_snippets": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "purpose": { "type": "string" },
          "code": { "type": "string" },
          "language": { "type": "string" }
        }
      }
    },
    "lessons_learned": {
      "type": "array",
      "items": { "type": "string" }
    },
    "related_topics": {
      "type": "array",
      "items": { "type": "string" }
    },
    "full_content_url": { "type": "string", "format": "uri" }
  },
  "required": ["article_id", "title", "summary"]
}
```

---

## 10. Testing

### 10.1 Unit Testing

| Package | Version | Purpose |
|---------|---------|---------|
| vitest | 1.2.2 | Test runner |
| @testing-library/react | 14.2.1 | React testing |

### 10.2 E2E Testing

| Package | Version | Purpose |
|---------|---------|---------|
| @playwright/test | 1.41.2 | E2E testing |

---

## 11. Deployment

### 11.1 Hosting Platform

**Vercel** - Primary deployment target

### 11.2 MCP Server Deployment

| Option | Description | Notes |
|--------|-------------|-------|
| npm package | `viblog-mcp-server` | Users install via npx |
| Docker image | `ghcr.io/viblog/mcp-server` | Alternative deployment |

---

## 12. Environment Variables

```bash
# Required in Production
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://viblog.tiic.tech
ENCRYPTION_KEY=

# MCP Server (User's local)
VIBLOG_API_KEY=  # User's personal API key from Viblog
VIBLOG_API_URL=https://viblog.tiic.tech
```

---

## 13. Version Lock Reasoning

### Why These Specific Versions?

| Package | Reasoning |
|---------|-----------|
| Next.js 14.1.0 | Latest stable with App Router, server actions |
| React 18.2.0 | Stable, compatible with all our dependencies |
| MCP SDK latest | Rapidly evolving, use latest |
| TypeScript 5.3.3 | Latest stable, improved type inference |
| Tailwind 3.4.1 | Latest stable with new features |

---

**Document Version:** 2.0
**Last Updated:** 2026-03-15
**Author:** Viblog Team