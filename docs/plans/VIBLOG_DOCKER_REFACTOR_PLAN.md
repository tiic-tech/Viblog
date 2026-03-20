# Viblog Docker Refactoring Plan

> **Version:** 1.0
> **Created:** 2026-03-20
> **Authority:** CAO Strategic Decision
> **Related:** ADR-007, PRD V3.4, PRODUCT_SPLIT_PLAN

---

## Executive Summary

This document outlines the comprehensive refactoring plan to transform Viblog from a multi-user Supabase-based platform into a **pure open-source personal tool** with Docker Compose deployment.

**Core Principle:** "你负责边界和验收，AI负责提需求" - User defines boundaries and acceptance criteria; AI proposes solutions.

---

## Phase 1: Requirement Clarification (Step 1)

### 1.1 Problem Statement

**Current State:**
- Viblog is designed as a multi-user platform with Supabase backend
- Mix of personal tool features and community platform features
- Deployment requires Vercel + Supabase Cloud configuration

**Target State:**
- Pure personal tool for single user (fully private)
- Docker Compose one-command deployment
- Local PostgreSQL database
- No cloud dependencies

### 1.2 Feature Boundary Definition

Based on PRD V3.4 Dual-Layer Architecture, the following features belong to each product:

| Feature Layer | Viblog (Personal Tool) | Viblog-community (Platform) |
|---------------|------------------------|----------------------------|
| **Public Layer** | None (single user) | Profiles, Feed, Stars, Social |
| **Private Layer** | Dashboard, Articles, Projects, Sessions, Settings | Same + Team features |
| **Foundation** | Local PostgreSQL, MCP Server | Supabase Cloud, MCP Server |

### 1.3 In-Scope Features (Viblog)

| Feature | Priority | Description |
|---------|----------|-------------|
| MCP Session Sync | P0 | Auto-capture vibe coding sessions |
| OpenAI Format Storage | P0 | Industry-standard session data |
| Metrics Engine | P0 | Calculate efficiency metrics |
| Dashboard | P0 | View sessions, articles, metrics |
| Article Management | P0 | Create, edit, publish articles |
| Project Management | P0 | Group sessions by project |
| LLM Configuration | P0 | Configure API keys for MCP |
| Growth Insights | P1 | Track improvement over time |

### 1.4 Out-of-Scope Features (Move to Viblog-community)

| Feature | Reason | Migration Target |
|---------|--------|-----------------|
| User Registration | Single-user tool | viblog-community |
| User Authentication | No auth needed | viblog-community |
| Public Profiles | No public sharing | viblog-community |
| Article Stars | No social features | viblog-community |
| Credit System | No monetization | viblog-community |
| User Interactions | No analytics | viblog-community |
| External Links | Simplify scope | viblog-community |
| User Insights | Simplify scope | viblog-community |
| Graph Nodes/Edges | Simplify scope | viblog-community |
| Annotations | Simplify scope | viblog-community |

---

## Phase 2: Technical Decisions (Step 2-3)

### 2.1 Technology Selection

| Component | Current | New | Rationale |
|-----------|---------|-----|-----------|
| Database | Supabase (Cloud) | PostgreSQL (Docker) | Local data, full privacy |
| Auth | Supabase Auth | Remove | Single-user, no auth needed |
| ORM | Supabase Client | pg / postgres.js | Direct SQL, simpler |
| Cache | Upstash Redis | Remove / Local Redis | Optional for single user |
| File Storage | Supabase Storage | Local filesystem | Simpler for local deployment |
| MCP Server | Cloud API | Built-in | Direct API calls |

### 2.2 Docker Architecture

```
+---------------------------------------------------------------------+
|   VIBLOG DOCKER ARCHITECTURE                                         |
+---------------------------------------------------------------------+
|                                                                      |
|   +-------------------------------------------------------------+   |
|   |  Docker Network: viblog-network                              |   |
|   |                                                             |   |
|   |   +-------------+    +-------------+    +----------------+ |   |
|   |   |   app       |    |     db      |    |  mcp-server    | |   |
|   |   |   (Next.js) |    | (PostgreSQL)|    |   (Optional)   | |   |
|   |   |   :3000     |    |    :5432    |    |     :3001      | |   |
|   |   +-------------+    +-------------+    +----------------+ |   |
|   |         |                  |                    |         |   |
|   |         +------------------+--------------------+         |   |
|   |                           |                              |   |
|   +---------------------------|------------------------------+   |
|                               |                                   |
|   +---------------------------|------------------------------+   |
|   |  Volumes                  |                              |   |
|   |                           v                              |   |
|   |   ./data/postgres  -->  PostgreSQL data                  |   |
|   |   ./data/uploads   -->  File uploads                     |   |
|   |   ./data/exports   -->  Data exports                     |   |
|   +-------------------------------------------------------------+   |
|                                                                      |
|   COMMANDS:                                                          |
|   docker-compose up -d          # Start all services                 |
|   docker-compose logs -f app    # View app logs                     |
|   docker-compose down          # Stop all services                  |
|                                                                      |
+---------------------------------------------------------------------+
```

### 2.3 Component Reuse Analysis

| Component Category | Reuse Status | Action Required |
|--------------------|--------------|-----------------|
| **UI Components** | | |
| `src/components/ui/*` | KEEP | No changes, pure UI |
| `src/components/dashboard/*` | KEEP | Remove user references |
| `src/components/articles/*` | KEEP | Remove user_id fields |
| `src/components/projects/*` | KEEP | Remove user_id fields |
| `src/components/auth/*` | REMOVE | Not needed for single user |
| `src/components/public/*` | REMOVE | Not needed for single user |
| `src/components/onboarding/*` | MODIFY | Simplify for LLM config only |
| **Pages** | | |
| `src/app/(auth)/*` | REMOVE | Not needed |
| `src/app/(public)/*` | REMOVE | Not needed |
| `src/app/(dashboard)/*` | KEEP | Remove auth checks |
| `src/app/api/auth/*` | REMOVE | Not needed |
| `src/app/api/public/*` | REMOVE | Not needed |
| `src/app/api/articles/*` | MODIFY | Remove user_id logic |
| `src/app/api/projects/*` | MODIFY | Remove user_id logic |
| `src/app/api/vibe-sessions/*` | MODIFY | Remove user_id logic |
| `src/app/api/llm/*` | KEEP | Core functionality |
| `src/app/api/health/*` | KEEP | Health checks |
| **Libraries** | | |
| `src/lib/supabase/*` | REMOVE | Replace with PostgreSQL client |
| `src/lib/auth/*` | REMOVE | Not needed |
| `src/lib/llm/*` | KEEP | Core functionality |
| `src/lib/mcp/*` | KEEP | Core functionality |
| `src/lib/cache/*` | OPTIONAL | Can simplify |
| **Types** | | |
| `src/types/database.ts` | MODIFY | Remove user-related tables |
| `src/types/index.ts` | MODIFY | Remove user-related types |
| **Packages** | | |
| `packages/viblog-mcp-server/*` | KEEP | Core functionality |

---

## Phase 3: Database Schema Design (Step 4)

### 3.1 Simplified Schema for Single User

```sql
-- docker/init-db.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions (removed user_id)
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

-- Session Fragments (OpenAI Format)
CREATE TABLE session_fragments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES vibe_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content JSONB NOT NULL,
  tool_calls JSONB,
  metadata JSONB,
  sequence_number INTEGER,
  fragment_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (removed user_id)
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

-- Articles (removed user_id, stars, premium, price)
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES vibe_sessions(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'draft',
  visibility TEXT DEFAULT 'private',
  vibe_platform TEXT,
  vibe_model TEXT,
  vibe_duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Article Paragraphs
CREATE TABLE article_paragraphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  paragraph_index INTEGER NOT NULL,
  paragraph_type TEXT,
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LLM Configuration (replaces user_settings, removed user_id)
CREATE TABLE llm_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Metrics Cache
CREATE TABLE metrics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_status ON vibe_sessions(status);
CREATE INDEX idx_sessions_created ON vibe_sessions(created_at DESC);
CREATE INDEX idx_fragments_session ON session_fragments(session_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_project ON articles(project_id);
CREATE INDEX idx_metrics_type_period ON metrics_cache(metric_type, period_start);
```

### 3.2 Tables to Remove

| Table | Reason |
|-------|--------|
| `profiles` | Single user, no profiles |
| `user_settings` | Replaced by `llm_config` |
| `user_credits` | No monetization |
| `credit_transactions` | No monetization |
| `stars` | No social features |
| `annotations` | Simplified scope |
| `user_insights` | Simplified scope |
| `user_interactions` | No analytics |
| `external_links` | Simplified scope |
| `graph_nodes` | Simplified scope |
| `graph_edges` | Simplified scope |
| `insight_links` | Simplified scope |
| `authorization_tokens` | No multi-user auth |

---

## Phase 4: Security Model (Step 5)

### 4.1 Security Boundaries

```
+---------------------------------------------------------------------+
|   VIBLOG SECURITY MODEL                                              |
+---------------------------------------------------------------------+
|                                                                      |
|   TRUST BOUNDARY: Docker Host                                        |
|   ============================================================       |
|                                                                      |
|   [User's Machine]                                                   |
|   |                                                                  |
|   +-- [Docker Container]                                             |
|   |   |                                                              |
|   |   +-- Next.js App (:3000)                                        |
|   |   |   - No authentication required                               |
|   |   |   - All data accessible to single user                       |
|   |   |                                                              |
|   |   +-- PostgreSQL (:5432)                                         |
|   |   |   - Only accessible within Docker network                    |
|   |   |   - No external exposure                                      |
|   |   |                                                              |
|   |   +-- MCP Server (:3001, optional)                              |
|   |       - Internal API only                                        |
|   |                                                                  |
|   +-- [Volumes]                                                      |
|       |                                                              |
|       +-- ./data/postgres (Database)                                |
|       +-- ./data/uploads (Files)                                    |
|       +-- ./data/exports (Backups)                                  |
|                                                                      |
|   EXTERNAL SERVICES:                                                 |
|   ============================================================       |
|                                                                      |
|   [LLM Providers]                                                    |
|   - User's API keys stored locally (encrypted)                       |
|   - Direct API calls from container                                  |
|   - No data sent to external servers except LLM APIs                 |
|                                                                      |
+---------------------------------------------------------------------+
```

### 4.2 Security Considerations

| Concern | Mitigation |
|---------|-----------|
| API Key Storage | Encrypt at rest, user manages keys |
| Network Exposure | Bind to localhost only |
| Data Backup | User-controlled, local files |
| Container Security | Use official images, minimal attack surface |
| Updates | User controls when to update |

---

## Phase 5: Implementation Plan (Step 6-9)

### 5.1 Phase Breakdown

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | Day 1-2 | Docker Infrastructure |
| Phase 2 | Day 3-4 | Database Migration |
| Phase 3 | Day 5-7 | Code Refactoring |
| Phase 4 | Day 8-9 | Testing & Documentation |
| Phase 5 | Day 10 | Final Review & Release |

### 5.2 Detailed Task List

#### Phase 1: Docker Infrastructure (Day 1-2)

| Task | Priority | Est. Hours | Dependencies |
|------|----------|------------|--------------|
| Create Dockerfile for Next.js app | P0 | 4h | None |
| Create docker-compose.yml | P0 | 2h | Dockerfile |
| Create .dockerignore | P0 | 1h | None |
| Create docker/init-db.sql | P0 | 4h | Schema design |
| Create .env.docker.example | P0 | 1h | None |
| Test Docker build | P0 | 2h | All above |
| Optimize for production | P1 | 2h | Test build |

#### Phase 2: Database Migration (Day 3-4)

| Task | Priority | Est. Hours | Dependencies |
|------|----------|------------|--------------|
| Create PostgreSQL client library | P0 | 4h | None |
| Create database connection utilities | P0 | 2h | Client library |
| Update types/database.ts | P0 | 2h | Schema |
| Create migration script from Supabase | P1 | 4h | None |
| Test database operations | P0 | 2h | All above |

#### Phase 3: Code Refactoring (Day 5-7)

| Task | Priority | Est. Hours | Dependencies |
|------|----------|------------|--------------|
| Remove auth components and pages | P0 | 2h | None |
| Remove public components and pages | P0 | 2h | None |
| Update API routes for single user | P0 | 4h | Database migration |
| Update dashboard components | P0 | 4h | API routes |
| Update article components | P0 | 2h | API routes |
| Update project components | P0 | 2h | API routes |
| Remove Supabase dependencies | P0 | 2h | All above |
| Update MCP server integration | P1 | 4h | API routes |

#### Phase 4: Testing & Documentation (Day 8-9)

| Task | Priority | Est. Hours | Dependencies |
|------|----------|------------|--------------|
| Update unit tests | P0 | 4h | Code refactoring |
| Create Docker integration tests | P0 | 4h | Docker setup |
| Update README.md | P0 | 2h | None |
| Create INSTALLATION.md | P0 | 2h | None |
| Create CONFIGURATION.md | P0 | 2h | None |
| Create docs/DOCKER.md | P1 | 2h | None |
| Update CHANGELOG.md | P0 | 1h | None |

#### Phase 5: Final Review & Release (Day 10)

| Task | Priority | Est. Hours | Dependencies |
|------|----------|------------|--------------|
| End-to-end testing | P0 | 4h | All above |
| Performance testing | P1 | 2h | E2E testing |
| Security review | P0 | 2h | None |
| Create release tag | P0 | 1h | All above |
| Publish documentation | P0 | 1h | All above |

---

## Phase 6: File-Level Changes

### 6.1 Files to Remove

```
src/
├── app/
│   ├── (auth)/                        # REMOVE entire directory
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── onboarding/
│   │   └── register/
│   ├── (public)/                      # REMOVE entire directory
│   │   ├── u/[username]/             # Public profiles
│   │   ├── article/[slug]/           # Public articles
│   │   ├── cyberpunk/                # Landing variants
│   │   ├── editorial/                # Landing variants
│   │   └── page*.tsx                 # Landing pages
│   └── api/
│       ├── auth/                      # REMOVE entire directory
│       └── public/                    # REMOVE entire directory
├── components/
│   ├── auth/                          # REMOVE entire directory
│   ├── public/                        # REMOVE entire directory
│   └── onboarding/                    # REMOVE or SIMPLIFY
└── lib/
    ├── supabase/                      # REMOVE entire directory
    └── auth/                          # REMOVE entire directory
```

### 6.2 Files to Create

```
docker/
├── init-db.sql                        # Database initialization
├── Dockerfile                         # Production image
├── docker-compose.yml                 # Service orchestration
├── docker-compose.dev.yml             # Development override
└── .dockerignore                      # Build exclusions

src/
├── lib/
│   ├── db/
│   │   ├── client.ts                  # PostgreSQL client
│   │   ├── index.ts                   # Exports
│   │   └── migrations/                # Migration scripts
│   └── single-user/
│       └── context.tsx                # Single user context

docs/
├── INSTALLATION.md                    # Installation guide
├── CONFIGURATION.md                   # Configuration guide
├── DOCKER.md                          # Docker reference
└── MIGRATION.md                       # Migration from Supabase
```

### 6.3 Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Remove Supabase deps, add postgres |
| `src/middleware.ts` | Remove auth checks |
| `src/types/database.ts` | Simplify to single-user schema |
| `src/types/index.ts` | Remove user-related types |
| `src/app/(dashboard)/layout.tsx` | Remove auth check |
| `src/app/api/articles/route.ts` | Remove user_id logic |
| `src/app/api/projects/route.ts` | Remove user_id logic |
| `src/app/api/vibe-sessions/route.ts` | Remove user_id logic |
| `src/app/api/llm/config/route.ts` | Use local config table |
| All components with user_id | Remove user_id references |
| `packages/viblog-mcp-server/src/*.ts` | Update API endpoints |

---

## Phase 7: Component Migration Matrix

### 7.1 UI Components (Keep with Modifications)

| Component | Location | Modification |
|-----------|----------|--------------|
| Button | `src/components/ui/button.tsx` | None |
| Card | `src/components/ui/card.tsx` | None |
| Input | `src/components/ui/input.tsx` | None |
| Select | `src/components/ui/select.tsx` | None |
| Toast | `src/components/ui/toast.tsx` | None |
| Badge | `src/components/ui/badge.tsx` | None |
| Skeleton | `src/components/ui/skeleton.tsx` | None |
| EmptyState | `src/components/ui/empty-state.tsx` | None |
| CodeBlock | `src/components/ui/code-block.tsx` | None |

### 7.2 Dashboard Components (Keep with Modifications)

| Component | Location | Modification |
|-----------|----------|--------------|
| DashboardLayout | `src/components/dashboard/dashboard-layout.tsx` | Remove auth/user menu |
| Header | `src/components/dashboard/header.tsx` | Simplify, no user menu |
| Sidebar | `src/components/dashboard/sidebar.tsx` | Remove profile link |
| DashboardStats | `src/components/dashboard/dashboard-stats.tsx` | Remove user comparison |
| RecentArticles | `src/components/dashboard/recent-articles.tsx` | None |
| Timeline | `src/components/dashboard/timeline.tsx` | None |
| TimelineItem | `src/components/dashboard/timeline-item.tsx` | None |

### 7.3 Article Components (Keep with Modifications)

| Component | Location | Modification |
|-----------|----------|--------------|
| ArticleEditor | `src/components/articles/article-editor.tsx` | None |
| ArticleForm | `src/components/articles/article-form.tsx` | Remove user fields |
| ArticleList | `src/components/articles/article-list.tsx` | None |
| PublishModal | `src/components/articles/publish-modal.tsx` | Remove visibility options |

### 7.4 Project Components (Keep with Modifications)

| Component | Location | Modification |
|-----------|----------|--------------|
| ProjectForm | `src/components/projects/project-form.tsx` | Remove is_public field |
| ProjectList | `src/components/projects/project-list.tsx` | None |

---

## Phase 8: API Routes Refactoring

### 8.1 Routes to Keep (Modified)

| Route | Method | Changes |
|-------|--------|---------|
| `/api/articles` | GET, POST | Remove user_id filter/insert |
| `/api/articles/[id]` | GET, PUT, DELETE | Remove user_id check |
| `/api/articles/[id]/publish` | POST | Remove user_id check |
| `/api/projects` | GET, POST | Remove user_id filter/insert |
| `/api/projects/[id]` | GET, PUT, DELETE | Remove user_id check |
| `/api/vibe-sessions` | GET, POST | Remove user_id filter/insert |
| `/api/vibe-sessions/[id]/fragments` | POST | Remove user_id check |
| `/api/vibe-sessions/generate-article-draft` | POST | None |
| `/api/vibe-sessions/generate-structured-context` | POST | None |
| `/api/vibe-sessions/publish-article` | POST | None |
| `/api/llm/*` | ALL | Use local config table |
| `/api/health/*` | ALL | None |

### 8.2 Routes to Remove

| Route | Reason |
|-------|--------|
| `/api/auth/callback` | No auth |
| `/api/public/articles` | No public API |
| `/api/public/users/[username]` | No public profiles |
| `/api/articles/[id]/star` | No social features |
| `/api/user/api-keys` | Simplified config |
| `/api/user/mcp-keys` | Simplified config |
| `/api/user/authorization-tokens` | No multi-user auth |

---

## Phase 9: Docker Configuration Files

### 9.1 Dockerfile

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/viblog-mcp-server/package.json ./packages/viblog-mcp-server/

# Install pnpm and dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/viblog-mcp-server/node_modules ./packages/viblog-mcp-server/node_modules

# Copy source
COPY . .

# Set environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build
RUN corepack enable pnpm && pnpm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create data directories
RUN mkdir -p /app/data/uploads /app/data/exports && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 9.2 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://viblog:viblog@db:5432/viblog
      - MCP_API_URL=http://localhost:3000/api
      - NODE_ENV=production
    volumes:
      - ./data/uploads:/app/data/uploads
      - ./data/exports:/app/data/exports
    depends_on:
      db:
        condition: service_healthy
    networks:
      - viblog-network
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=viblog
      - POSTGRES_PASSWORD=viblog
      - POSTGRES_DB=viblog
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    networks:
      - viblog-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U viblog -d viblog"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  viblog-network:
    driver: bridge
```

### 9.3 .env.docker.example

```env
# Database (auto-configured in Docker)
DATABASE_URL=postgresql://viblog:viblog@db:5432/viblog

# LLM Configuration (User provides their own keys)
# Choose one or more providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
MINIMAX_API_KEY=...
MOONSHOT_API_KEY=sk-...
ZHIPU_API_KEY=...

# MCP Server
MCP_API_URL=http://localhost:3000/api

# Optional: Extended features (future)
ENABLE_APACHE_AGE=false
ENABLE_TIMESCALEDB=false
```

---

## Phase 10: Testing Strategy

### 10.1 Test Categories

| Category | Focus | Tools |
|----------|-------|-------|
| Unit Tests | Individual functions, components | Vitest |
| Integration Tests | API routes, database operations | Vitest + Test containers |
| E2E Tests | User workflows | Playwright |
| Docker Tests | Container build, startup, networking | Custom scripts |

### 10.2 Test Commands

```bash
# Unit tests
pnpm test

# Integration tests (requires Docker)
pnpm test:integration

# E2E tests
pnpm test:e2e

# Docker tests
./docker/test.sh
```

### 10.3 CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm build

  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -f docker/Dockerfile -t viblog:test .
      - run: docker compose -f docker/docker-compose.yml up -d --wait
      - run: curl -f http://localhost:3000/api/health || exit 1
```

---

## Phase 11: Documentation Plan

### 11.1 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Quick start, overview | All users |
| `docs/INSTALLATION.md` | Detailed installation | New users |
| `docs/CONFIGURATION.md` | Environment variables | Users |
| `docs/DOCKER.md` | Docker reference | DevOps |
| `docs/API.md` | Local API reference | Developers |
| `docs/MIGRATION.md` | Supabase to local migration | Existing users |

### 11.2 README.md Structure

```markdown
# Viblog - Your Vibe Coding Growth Platform

## Quick Start

\`\`\`bash
# Clone and start
git clone https://github.com/archygang/viblog.git
cd viblog
cp .env.docker.example .env
# Edit .env with your LLM API keys
docker-compose up -d

# Open http://localhost:3000
\`\`\`

## Features

- MCP Session Sync: Auto-capture vibe coding sessions
- Metrics Engine: Track efficiency and growth
- Article Generation: Convert sessions to articles
- Project Management: Organize sessions by project
- LLM Integration: Configure your own API keys

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Configuration](docs/CONFIGURATION.md)
- [Docker Reference](docs/DOCKER.md)
- [API Reference](docs/API.md)

## Requirements

- Docker and Docker Compose
- 4GB+ RAM
- LLM API key (OpenAI, Anthropic, etc.)
```

---

## Phase 12: Risk Assessment

### 12.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Docker networking issues | Medium | High | Test on multiple OS, document ports |
| Data migration errors | Medium | Critical | Create migration script, test thoroughly |
| Build size too large | Low | Medium | Optimize Dockerfile, use multi-stage build |
| Performance degradation | Low | Medium | Profile and optimize queries |

### 12.2 User Experience Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Setup too complex | Medium | High | Clear documentation, one-command setup |
| Data loss during update | Low | Critical | Backup scripts, data persistence docs |
| API key management confusion | Medium | Medium | Clear configuration guide |

---

## Phase 13: Success Criteria

### 13.1 Technical Success Criteria

- [ ] `docker-compose up` starts all services in under 60 seconds
- [ ] Database initializes automatically with correct schema
- [ ] MCP Server works with local API
- [ ] All existing features work without auth
- [ ] Data persists across container restarts
- [ ] Build size under 500MB

### 13.2 User Experience Success Criteria

- [ ] Setup completed in under 5 minutes
- [ ] Clear error messages for common issues
- [ ] Documentation covers all setup scenarios
- [ ] No manual database configuration required

---

## Appendices

### A. Command Reference

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm test                   # Run tests

# Docker
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs -f app  # View app logs
docker-compose exec db psql -U viblog  # Access database

# Backup
docker-compose exec db pg_dump viblog > backup.sql
cat backup.sql | docker-compose exec -T db psql viblog

# Reset
docker-compose down -v      # Stop and remove volumes
docker-compose up -d        # Fresh start
```

### B. Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `MCP_API_URL` | No | `http://localhost:3000/api` | MCP Server API URL |
| `OPENAI_API_KEY` | Optional | - | OpenAI API key |
| `ANTHROPIC_API_KEY` | Optional | - | Anthropic API key |
| `DEEPSEEK_API_KEY` | Optional | - | DeepSeek API key |
| `MINIMAX_API_KEY` | Optional | - | MiniMax API key |
| `MOONSHOT_API_KEY` | Optional | - | Moonshot API key |
| `ZHIPU_API_KEY` | Optional | - | ZhiPu AI API key |

### C. File Structure After Refactoring

```
viblog/
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── init-db.sql
│   └── .dockerignore
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── articles/
│   │   │   │   ├── projects/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── articles/
│   │   │   ├── projects/
│   │   │   ├── vibe-sessions/
│   │   │   ├── llm/
│   │   │   └── health/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   ├── articles/
│   │   └── projects/
│   ├── lib/
│   │   ├── db/
│   │   ├── llm/
│   │   ├── mcp/
│   │   └── utils.ts
│   └── types/
├── packages/
│   └── viblog-mcp-server/
├── docs/
│   ├── INSTALLATION.md
│   ├── CONFIGURATION.md
│   ├── DOCKER.md
│   └── API.md
├── data/
│   ├── postgres/
│   ├── uploads/
│   └── exports/
├── .env.docker.example
├── README.md
└── package.json
```

---

**Document Version:** 1.0
**Created:** 2026-03-20
**Status:** Ready for Implementation
**Authority:** CAO Strategic Decision

---

## Challenge Record

| Challenge | Raised By | Resolution |
|-----------|-----------|-----------|
| Should we keep Upstash Redis cache? | CAO | **REMOVE** - Single-user tool doesn't need distributed cache |
| Should we support SQLite as alternative? | CAO | **NO** - Docker + PostgreSQL only. Vibe Coders can ask AI to configure |
| Should we keep annotation features? | CAO | **OPTIONAL** - Keep with `ENABLE_AUTH` toggle. Supports deployment to personal domain |

---

## Deployment Modes

### Mode A: Pure Local Tool (Default)

```yaml
# docker-compose.yml
environment:
  - ENABLE_AUTH=false
```

- No login required
- localhost:3000
- Single user, full access
- Annotation disabled

### Mode B: Personal Server Deployment

```yaml
# docker-compose.yml
environment:
  - ENABLE_AUTH=true
  - JWT_SECRET=your-secret-key
```

- Login required
- your-domain.com
- Public Profile visible
- Annotation enabled
- Access from mobile

### Implementation

```typescript
// src/lib/config.ts
export const config = {
  enableAuth: process.env.ENABLE_AUTH === 'true',
  // Features that require auth
  features: {
    annotations: process.env.ENABLE_AUTH === 'true',
    publicProfile: process.env.ENABLE_AUTH === 'true',
  }
}
```

**This design allows users to:**
1. Use locally without any auth setup (simplest)
2. Deploy to their own domain with auth (flexible)