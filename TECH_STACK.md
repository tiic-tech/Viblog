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

## 10. AI-Data-Native Infrastructure (New - 2026-03-16)

### 10.1 Vector Database

| Package | Version | Purpose |
|---------|---------|---------|
| pgvector | 0.5.1 | PostgreSQL extension for vector similarity search |
| OpenAI API | latest | text-embedding-3-small for 1536-dim embeddings |

**Configuration:**
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector index (IVFFlat for large datasets)
CREATE INDEX idx_embeddings ON table_name
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- For smaller datasets, use HNSW
CREATE INDEX idx_embeddings_hnsw ON table_name
USING hnsw (embedding vector_cosine_ops);
```

**Embedding Strategy:**
| Content Type | Embedding Model | Dimension | Storage |
|--------------|-----------------|-----------|---------|
| Article paragraphs | text-embedding-3-small | 1536 | Platform DB |
| User insights | text-embedding-3-small | 1536 | User DB |
| External link snapshots | text-embedding-3-small | 1536 | User DB |
| Article overall | text-embedding-3-small | 1536 | Platform DB |

### 10.2 Knowledge Graph

**Current Status (MVP):** Supabase does not support Apache AGE extension. Using JSONB-based fallback.

| Option | Version | Purpose | Status |
|--------|---------|---------|--------|
| Apache AGE | 1.5.0 | Graph extension for PostgreSQL | NOT AVAILABLE on Supabase |
| **JSONB Graph Tables** | N/A | Fallback implementation | **IMPLEMENTED** |
| Neo4j | 5.x | Dedicated graph database | Future microservice |

**Fallback Implementation (graph_nodes + graph_edges):**
```sql
-- Graph Nodes Table (fallback for Apache AGE)
CREATE TABLE graph_nodes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('user', 'article', 'topic', 'technology', 'insight', 'external_link')),
  node_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Graph Edges Table (fallback for Apache AGE)
CREATE TABLE graph_edges (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  source_node_id UUID NOT NULL REFERENCES graph_nodes(id),
  target_node_id UUID NOT NULL REFERENCES graph_nodes(id),
  edge_type TEXT NOT NULL CHECK (edge_type IN ('wrote', 'cites', 'related_to', 'uses', 'inspired_by', 'follows')),
  edge_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Future Migration to Neo4j (Microservice Architecture):**
```
Migration Path:
1. Create graph_sync_service (Node.js/Go)
2. Implement CDC (Change Data Capture) from PostgreSQL
3. Sync graph_nodes/edges to Neo4j in real-time
4. Update API layer to query Neo4j for graph operations
5. PostgreSQL tables remain as source-of-truth

Technical Reserve:
- Abstract graph operations behind IGraphRepository interface
- Use dependency injection for easy swapping
- Document Cypher query equivalents in comments
```

**Graph Schema:**
```
Node Types:
├── User - User entity
├── Article - Published article
├── Topic - Content topic
├── Technology - Tech stack element
├── Insight - User insight
└── ExternalLink - External reference

Edge Types:
├── WROTE - User wrote Article
├── CITES - Article cites ExternalLink
├── RELATED_TO - Article related to Topic
├── USES - Article uses Technology
├── INSPIRED_BY - Insight inspired by ExternalLink
└── FOLLOWS - User follows User
```

### 10.3 Time Series Database

**Current Status (MVP):** Supabase does not support TimescaleDB extension. Using native PostgreSQL indexing and partitioning.

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| TimescaleDB | 2.x | PostgreSQL extension for time series | NOT AVAILABLE on Supabase |
| **PostgreSQL Native Indexing** | 15+ | Time-based indices | **IMPLEMENTED** |
| InfluxDB | 3.x | Dedicated time series database | Future microservice |

**Fallback Implementation (user_interactions table):**
```sql
-- Time-optimized indices (fallback for TimescaleDB)
CREATE INDEX idx_user_interactions_user ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_created_at ON public.user_interactions(created_at DESC);
CREATE INDEX idx_user_interactions_type ON public.user_interactions(interaction_type);

-- Future: Native partitioning for large datasets
-- CREATE TABLE user_interactions_y2026m03 PARTITION OF user_interactions
--   FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

**Future Migration to TimescaleDB/InfluxDB (Microservice Architecture):**
```
Migration Path:
1. Create analytics_service (Go/Rust for high throughput)
2. Implement event streaming (Kafka/Redis Streams)
3. Dual-write to PostgreSQL (source-of-truth) and TimescaleDB
4. Add read replicas for analytics queries
5. Implement data retention policies

Technical Reserve:
- Abstract time-series operations behind ITimeSeriesRepository interface
- Use event sourcing pattern for replay capability
- Document aggregation queries in separate module
- Design API endpoints to support both real-time and batch queries
```

### 10.4 AI Data Access Protocol

| Component | Technology | Purpose |
|-----------|------------|---------|
| JSON Schema | Draft 2020-12 | Structured data schema definition |
| Zod | 3.22.4 | Runtime validation |
| OpenAI API | latest | Embedding generation |
| pgvector | 0.5.1 | Vector similarity search |

**Cost Analysis:**
| Operation | Tokens/Request | Cost (per 1K) | Monthly Estimate |
|-----------|---------------|---------------|------------------|
| Embedding generation | ~500 tokens | $0.00002 | ~$10 for 500K tokens |
| Vector search | ~100 tokens | $0.00002 | ~$5 for 250K queries |
| Structured data API | ~1000 tokens | $0.003 (Sonnet) | ~$30 for 10K requests |

### 10.5 All-in-One PostgreSQL Architecture (MVP)

**Design Principle:** Use PostgreSQL as the single data store for MVP, with clear abstraction layers for future microservice extraction.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CURRENT MVP ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   PostgreSQL (Supabase)                                                     │
│   ├── Relational Data (profiles, articles, projects, etc.)                  │
│   ├── Vector Data (pgvector - article_paragraphs, user_insights)            │
│   ├── Graph Data (JSONB - graph_nodes, graph_edges)                        │
│   └── Time Series Data (indexed - user_interactions)                        │
│                                                                             │
│   Benefits:                                                                 │
│   - Single database to manage                                               │
│   - Simplified deployment                                                   │
│   - Lower operational costs                                                 │
│   - ACID transactions across all data types                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Future Microservice Extraction Points:**

| Service | Extract From | Trigger Condition | Target Technology |
|---------|--------------|-------------------|-------------------|
| Graph Service | graph_nodes, graph_edges | >1M nodes | Neo4j / AWS Neptune |
| Analytics Service | user_interactions | >100M rows | TimescaleDB / ClickHouse |
| Vector Service | article_paragraphs embeddings | >10M vectors | Pinecone / Weaviate |
| Search Service | Full-text search | Complex queries | Elasticsearch / Meilisearch |

**Abstraction Layer Requirements:**
```typescript
// Repository interfaces for future decoupling
interface IGraphRepository {
  createNode(type: NodeType, data: NodeData): Promise<Node>
  createEdge(source: string, target: string, type: EdgeType): Promise<Edge>
  queryGraph(cypher: string): Promise<GraphResult>
}

interface ITimeSeriesRepository {
  insert(metric: Metric): Promise<void>
  queryRange(start: Date, end: Date): Promise<Metric[]>
  aggregate(interval: string): Promise<Aggregation[]>
}

interface IVectorRepository {
  upsert(id: string, embedding: number[]): Promise<void>
  search(query: number[], k: number): Promise<SearchResult[]>
}
```

**Migration Checklist (when extracting):**
- [ ] Create repository interface
- [ ] Implement PostgreSQL adapter (current)
- [ ] Implement target service adapter
- [ ] Add feature flag for switching
- [ ] Implement data sync mechanism
- [ ] Run dual-write period
- [ ] Verify consistency
- [ ] Cut over to new service

---

## 11. Testing

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

## 13. Environment Variables

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

# AI-Data-Native (New)
OPENAI_API_KEY=  # For embedding generation (user's or platform's)
KNOWLEDGE_GRAPH_ENABLED=true
VECTOR_SEARCH_ENABLED=true
TIMESCALE_ENABLED=true
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

**Document Version:** 3.0
**Last Updated:** 2026-03-16
**Author:** Viblog Team
**Key Updates:** Added AI-Data-Native infrastructure (pgvector, Apache AGE, TimescaleDB, embeddings)