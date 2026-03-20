# Product Split Implementation Plan

> **Version:** 1.0
> **Created:** 2026-03-20
> **Authority:** ADR-007
> **Status:** Planning

---

## Executive Summary

将当前 Viblog 代码库拆分为两个独立产品：

| 产品 | 定位 | 部署 | 目标用户 |
|------|------|------|---------|
| **Viblog** | 开源个人工具 | Docker Compose | Vibe Coders（个人使用） |
| **Viblog-community** | 社区平台 | Vercel + Supabase | Vibe Coding 爱好者（社交发现） |

---

## Part 1: Codebase Audit

### 1.1 Current Structure

```
Viblog/
├── src/                          # Next.js App
│   ├── app/                      # App Router
│   │   ├── (auth)/               # 认证相关 [需评估]
│   │   ├── (public)/             # 公开页面 [需评估]
│   │   ├── api/                  # API Routes [需评估]
│   │   └── ...
│   ├── components/               # UI Components [共享]
│   ├── lib/                      # Utilities [共享]
│   └── types/                    # TypeScript Types [共享]
│
├── packages/
│   └── viblog-mcp-server/        # MCP Server [共享]
│
├── supabase/                     # Supabase配置 [仅community]
│
└── docs/                         # 文档 [需拆分]
```

### 1.2 Code Classification

| 模块/文件 | Viblog | Viblog-community | 处理方式 |
|-----------|--------|------------------|----------|
| `src/app/(auth)/*` | 可选 | 必需 | 拆分 |
| `src/app/api/auth/*` | 可选 | 必需 | 拆分 |
| `src/app/api/vibe-sessions/*` | 必需 | 必需 | 共享 |
| `src/app/api/articles/*` | 必需 | 必需 | 共享 |
| `src/app/api/public/*` | 不需要 | 必需 | 仅community |
| `src/app/(public)/profiles/*` | 不需要 | 必需 | 仅community |
| `src/components/*` | 必需 | 必需 | 共享 |
| `src/lib/supabase/*` | 不需要 | 必需 | 仅community |
| `packages/viblog-mcp-server/*` | 必需 | 必需 | 共享 |
| `supabase/*` | 不需要 | 必需 | 仅community |
| `prisma/*` 或 Drizzle | 必需 | 不需要 | 仅Viblog |

---

## Part 2: Shared Packages Design

### 2.1 Package Structure

```
packages/
├── viblog-mcp-server/          # 已存在
│   ├── src/
│   │   ├── tools/
│   │   ├── api/
│   │   └── index.ts
│   └── package.json
│
├── viblog-ui/                   # 新建 - UI组件库
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── SessionCard.tsx
│   │   │   ├── MetricsCard.tsx
│   │   │   ├── GrowthChart.tsx
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   └── tokens.css
│   │   └── index.ts
│   └── package.json
│
├── viblog-markdown/             # 新建 - Markdown处理
│   ├── src/
│   │   ├── parser.ts
│   │   ├── transformer.ts
│   │   └── index.ts
│   └── package.json
│
└── viblog-core/                 # 新建 - 核心业务逻辑
    ├── src/
    │   ├── metrics/
    │   │   ├── velocity.ts
    │   │   ├── efficiency.ts
    │   │   └── index.ts
    │   ├── session/
    │   │   ├── parser.ts
    │   │   └── index.ts
    │   └── index.ts
    └── package.json
```

### 2.2 Shared Package APIs

#### @viblog/mcp-server

```typescript
// 两个产品共享的MCP工具
export {
  createVibeSession,
  appendSessionContext,
  uploadSessionContext,
  generateStructuredContext,
  generateArticleDraft,
  listUserSessions,
  publishArticle,
}

// 配置接口
export interface MCPServerConfig {
  apiUrl: string;        // Viblog: localhost:3000/api
                         // Community: viblog.tiic.tech/api
  apiKey?: string;       // Community需要认证
}
```

#### @viblog/ui-components

```typescript
// 共享UI组件
export {
  ArticleCard,
  SessionCard,
  MetricsCard,
  GrowthChart,
  Button,
  Input,
  Modal,
  // ...
}

// 设计Token
export { designTokens, cssVariables }
```

#### @viblog/core

```typescript
// 核心业务逻辑（无平台依赖）
export {
  // Metrics计算
  calculateVelocity,
  calculateEfficiency,
  calculateTokenEconomy,

  // Session处理
  parseSessionContent,
  extractCodeBlocks,
  generateSummary,
}
```

---

## Part 3: Viblog (Personal Tool) Architecture

### 3.1 Docker Configuration

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://viblog:viblog@db:5432/viblog
      - MCP_API_URL=http://localhost:3000/api
    volumes:
      - ./data:/app/data
    depends_on:
      - db
      - db-age  # Optional: Apache AGE for knowledge graph

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=viblog
      - POSTGRES_PASSWORD=viblog
      - POSTGRES_DB=viblog
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  db-age:
    image: apache/age:latest
    environment:
      - POSTGRES_USER=viblog
      - POSTGRES_PASSWORD=viblog
      - POSTGRES_DB=viblog
    profiles:
      - extended  # Optional, enable with --profile extended
    volumes:
      - age_data:/var/lib/postgresql/data

  timescaledb:
    image: timescale/timescaledb:latest-pg16
    environment:
      - POSTGRES_USER=viblog
      - POSTGRES_PASSWORD=viblog
      - POSTGRES_DB=viblog_ts
    profiles:
      - extended
    volumes:
      - ts_data:/var/lib/postgresql/data

volumes:
  postgres_data:
  age_data:
  ts_data:
```

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/viblog-mcp-server/package*.json ./packages/viblog-mcp-server/
COPY packages/viblog-ui/package*.json ./packages/viblog-ui/

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
```

### 3.2 Database Schema (PostgreSQL)

```sql
-- docker/init-db.sql

-- Sessions
CREATE TABLE vibe_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  platform TEXT,
  model TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Fragments (OpenAI Format - ADR-005)
CREATE TABLE session_fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES vibe_sessions(id),
  role TEXT NOT NULL,
  content JSONB NOT NULL,
  tool_calls JSONB,
  metadata JSONB,
  sequence_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES vibe_sessions(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  status TEXT DEFAULT 'draft',
  visibility TEXT DEFAULT 'private',
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Article Paragraphs
CREATE TABLE article_paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id),
  content TEXT NOT NULL,
  sequence_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Metrics Cache
CREATE TABLE metrics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (Products)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  repository_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_status ON vibe_sessions(status);
CREATE INDEX idx_sessions_created ON vibe_sessions(created_at DESC);
CREATE INDEX idx_fragments_session ON session_fragments(session_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_metrics_type_period ON metrics_cache(metric_type, period_start);
```

### 3.3 Environment Configuration

**.env.example:**

```env
# Database
DATABASE_URL=postgresql://viblog:viblog@localhost:5432/viblog

# LLM Configuration (User's own API keys)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# MCP Server
MCP_API_URL=http://localhost:3000/api

# Optional: Extended features
ENABLE_APACHE_AGE=false
ENABLE_TIMESCALEDB=false
```

### 3.4 Commands

```bash
# Start Viblog
docker-compose up -d

# Start with extended features
docker-compose --profile extended up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Backup data
docker-compose exec db pg_dump viblog > backup.sql

# Restore data
cat backup.sql | docker-compose exec -T db psql viblog
```

---

## Part 4: Viblog-community Architecture

### 4.1 Repository Setup

```bash
# Create new repository
gh repo create viblog-community --public

# Clone and setup
git clone https://github.com/archygang/viblog-community
cd viblog-community

# Copy from Viblog
cp -r ../Viblog/src .
cp -r ../Viblog/packages .
cp -r ../Viblog/public .
# ... selective copy
```

### 4.2 Supabase Configuration

**supabase/config.toml:**

```toml
[auth]
enabled = true
site_url = "https://viblog.tiic.tech"

[auth.providers.email]
enabled = true

[auth.providers.github]
enabled = true

[storage]
enabled = true
```

### 4.3 Database Schema (Supabase)

```sql
-- supabase/migrations/001_initial.sql

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Profiles (Extended from Viblog)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  -- Public metrics settings
  public_metrics_enabled BOOLEAN DEFAULT FALSE,
  show_velocity BOOLEAN DEFAULT FALSE,
  show_efficiency BOOLEAN DEFAULT FALSE,
  -- Social
  github_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Sessions (with user_id for multi-tenant)
CREATE TABLE vibe_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT,
  -- ... same as Viblog
);

-- RLS for sessions
ALTER TABLE vibe_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON vibe_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON vibe_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ... similar for other tables
```

### 4.4 Vercel Configuration

**vercel.json:**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "regions": ["sin1"],
  "env": {
    NEXT_PUBLIC_SUPABASE_URL": "@viblog-supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@viblog-supabase-anon-key"
  }
}
```

---

## Part 5: Implementation Timeline

### Week 1: Viblog Docker Setup

| Day | Task | Hours |
|-----|------|-------|
| 1 | Create Dockerfile, docker-compose.yml | 4 |
| 1 | Create init-db.sql schema | 4 |
| 2 | Update Next.js for standalone build | 4 |
| 2 | Test Docker build locally | 4 |
| 3 | Remove Supabase dependencies from Viblog | 4 |
| 3 | Implement local PostgreSQL client | 4 |
| 4 | Test full workflow in Docker | 4 |
| 4 | Write deployment documentation | 4 |

### Week 2: Shared Packages Extraction

| Day | Task | Hours |
|-----|------|-------|
| 1 | Extract @viblog/core package | 4 |
| 1 | Create metrics calculation functions | 4 |
| 2 | Extract @viblog/ui-components | 4 |
| 2 | Update imports in Viblog | 4 |
| 3 | Test Viblog with shared packages | 4 |
| 3 | Document shared package APIs | 4 |

### Week 3: Viblog-community Setup

| Day | Task | Hours |
|-----|------|-------|
| 1 | Create viblog-community repository | 2 |
| 1 | Copy and adapt codebase | 4 |
| 2 | Configure Supabase project | 4 |
| 2 | Update auth for multi-user | 4 |
| 3 | Configure Vercel deployment | 2 |
| 3 | Test deployment | 4 |
| 4 | Create Supabase migrations | 4 |
| 4 | Test RLS policies | 4 |

### Week 4: Integration & Testing

| Day | Task | Hours |
|-----|------|-------|
| 1 | Test MCP Server on both platforms | 4 |
| 1 | Verify shared packages work | 4 |
| 2 | Update documentation | 4 |
| 2 | Create README for both projects | 4 |
| 3 | End-to-end testing | 4 |
| 3 | Performance testing | 4 |
| 4 | Final review and launch prep | 4 |

---

## Part 6: File-by-File Migration Checklist

### Viblog (Keep & Modify)

| File | Action | Notes |
|------|--------|-------|
| `src/app/(auth)/*` | Remove or simplify | Local-only, no OAuth |
| `src/app/api/auth/*` | Remove | No server auth needed |
| `src/app/api/public/*` | Remove | No public API |
| `src/lib/supabase/*` | Remove | Replace with PostgreSQL client |
| `supabase/*` | Remove | Not needed |
| `src/lib/db.ts` | Create | PostgreSQL client |
| `Dockerfile` | Create | Docker build |
| `docker-compose.yml` | Create | Multi-service |
| `docker/init-db.sql` | Create | Schema init |

### Viblog-community (New Repository)

| File | Action | Notes |
|------|--------|-------|
| All files | Copy from Viblog | Then modify |
| `src/app/(auth)/*` | Keep | Multi-user auth |
| `src/app/api/auth/*` | Keep | OAuth + JWT |
| `src/app/api/public/*` | Keep | Public API |
| `src/lib/supabase/*` | Keep | Supabase client |
| `supabase/*` | Keep | Migrations |
| `vercel.json` | Create | Deployment config |

### Shared Packages (Both Use)

| Package | Action |
|---------|--------|
| `packages/viblog-mcp-server` | Keep, update for dual-platform |
| `packages/viblog-ui` | Extract from src/components |
| `packages/viblog-core` | Extract metrics, session logic |
| `packages/viblog-markdown` | Extract parser logic |

---

## Part 7: Success Criteria

### Viblog Launch Criteria

- [ ] `docker-compose up` starts all services
- [ ] Database initializes automatically
- [ ] MCP Server works locally
- [ ] Articles can be created and viewed
- [ ] Metrics are calculated
- [ ] Data persists across restarts
- [ ] README clearly explains setup

### Viblog-community Launch Criteria

- [ ] Vercel deployment succeeds
- [ ] User registration works (OAuth + Email)
- [ ] RLS policies enforce data isolation
- [ ] Public profiles visible
- [ ] Content feed functional
- [ ] MCP Server works with cloud API

---

## Part 8: Documentation Plan

### Viblog Documentation

```
README.md                    # Quick start, Docker setup
docs/
├── INSTALLATION.md          # Detailed installation
├── CONFIGURATION.md         # Environment variables
├── EXTENSIONS.md            # Apache AGE, TimescaleDB
├── API.md                   # Local API reference
└── MIGRATION.md             # Upgrading guide
```

### Viblog-community Documentation

```
README.md                    # Platform overview
docs/
├── DEPLOYMENT.md            # Vercel + Supabase setup
├── AUTHENTICATION.md        # OAuth configuration
├── RLS_POLICIES.md          # Security model
├── CONTENT_GUIDELINES.md    # Content policy
└── API.md                   # Public API reference
```

---

## Part 9: Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Docker networking issues | Medium | High | Test on multiple OS, document ports |
| Shared package version drift | Medium | Medium | Use workspace protocol, sync versions |
| Supabase RLS complexity | Medium | High | Thorough testing, security review |
| Migration data loss | Low | Critical | Backup before migration, test restore |
| Two-repo maintenance burden | Medium | Medium | Clear ownership, shared CI/CD |

---

## References

- ADR-007: Product Split Decision
- ADR-006: Gap Resolution Plan
- PRD V3.4: Dual-Layer Architecture
- Docker Documentation: https://docs.docker.com/
- Supabase Documentation: https://supabase.com/docs

---

**Document Version:** 1.0
**Created:** 2026-03-20
**Status:** Planning - Ready for Execution