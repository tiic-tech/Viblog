# ADR-007: Product Split - Viblog & Viblog-community

> **Status:** Proposed
> **Created:** 2026-03-20
> **Authority:** CAO Strategic Decision
> **Related:** ADR-006 (Gap Resolution Plan)

---

## 1. Context

### 1.1 Current Problem

Viblog 代码库混合了两个本质不同的产品需求：

| 需求 | 个人工具 | 社区平台 |
|------|---------|---------|
| 部署方式 | Docker Compose 本地 | Vercel 云端 |
| 数据库 | 本地 PostgreSQL | Supabase Cloud |
| 用户模型 | 单用户隔离 | 多用户共享 |
| 数据隐私 | 完全私有 | 公开分享 |
| 认证方式 | 无需/本地 | OAuth + JWT |
| 扩展方向 | Apache AGE, TimescaleDB | 社交、内容、活动 |

**核心矛盾：** 这些需求是互斥的，强行混合会导致：
- 部署复杂化
- 安全边界模糊
- 产品定位不清
- 维护成本翻倍

### 1.2 History

| 阶段 | 产品定位 | 问题 |
|------|---------|------|
| MVP (Phase 1-9) | 平台方向 | 多用户设计 |
| MCP (Phase 10-11) | MCP Service | 混合架构 |
| PRD V3.4 | Dual-Layer | 仍混合两产品 |

### 1.3 Strategic Realization

```
我们实际要开发的是两个独立产品：

1. Viblog - 纯开源个人工具
   - Docker化一键部署
   - 本地数据库，完全私有
   - 个人成长记录与分析

2. Viblog-community - 社区平台
   - Vercel + Supabase 云端托管
   - 多用户注册与分享
   - 内容运营与活动组织
```

---

## 2. Decision

### 2.1 Product Split

**将 Viblog 拆分为两个独立产品：**

| 产品 | 定位 | 技术栈 | 部署 |
|------|------|--------|------|
| **Viblog** | 开源个人工具 | Next.js + PostgreSQL (Docker) | docker-compose up |
| **Viblog-community** | 社区平台 | Next.js + Supabase | Vercel |

### 2.2 Codebase Strategy

```
Viblog (当前仓库)
├── 保持为核心产品
├── 重构为 Docker-first 架构
├── 移除多用户相关代码
└── 成为独立的开源项目

Viblog-community (新仓库)
├── Fork 自 Viblog
├── 重构为 Supabase-first 架构
├── 添加多用户、社交功能
└── 部署到 viblog.tiic.tech
```

### 2.3 Shared Code Strategy

| 模块 | 策略 | 原因 |
|------|------|------|
| MCP Server | 共享 npm 包 | 两者都需要 |
| UI Components | 共享 npm 包 | 设计系统一致 |
| Article Parser | 共享 npm 包 | Markdown处理通用 |
| Database Schema | 各自独立 | 数据模型不同 |
| Auth System | 各自独立 | 认证方式不同 |
| API Routes | 部分共享 | 核心逻辑可复用 |

---

## 3. Technical Architecture

### 3.1 Viblog (Personal Tool)

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG - PERSONAL TOOL                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │   Docker Container                                           │   │
│   │   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │   │
│   │   │   Next.js   │  │  PostgreSQL │  │  Apache AGE         │ │   │
│   │   │   App       │  │  (Primary)  │  │  (Graph, Optional)  │ │   │
│   │   └─────────────┘  └─────────────┘  └─────────────────────┘ │   │
│   │   ┌─────────────┐  ┌─────────────────────────────────────┐  │   │
│   │   │ TimescaleDB │  │  MCP Server (Built-in)              │  │   │
│   │   │ (Time-series│  │  - Session Sync                     │  │   │
│   │   │  Optional)  │  │  - Article Generation               │  │   │
│   │   └─────────────┘  └─────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   DEPLOYMENT: docker-compose up                                     │
│   ACCESS: localhost:3000                                            │
│   DATA: ./data/ (Persistent Volume)                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- 一键启动：`docker-compose up -d`
- 完全私有：数据存储在本地
- 可扩展：Apache AGE（知识图谱）、TimescaleDB（时序分析）
- MCP集成：内置MCP Server
- LLM配置：用户配置自己的API Key

### 3.2 Viblog-community (Community Platform)

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG-COMMUNITY - COMMUNITY PLATFORM                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐   │
│   │   Vercel         │  │   Supabase       │  │   CDN           │   │
│   │   (Frontend)     │  │   (Database)     │  │   (Assets)      │   │
│   │   viblog.tiic.tech│  │   Auth + RLS    │  │   Images        │   │
│   └──────────────────┘  └──────────────────┘  └─────────────────┘   │
│                                                                     │
│   FEATURES:                                                         │
│   ├── User Registration (OAuth + Email)                            │
│   ├── Public Profiles                                              │
│   ├── Content Feed                                                 │
│   ├── Events & Hackathons                                          │
│   ├── News & Trends                                                │
│   └── Viblog User Directory                                        │
│                                                                     │
│   CONTENT CHANNELS:                                                 │
│   ├── viblog.tiic.tech (Main)                                      │
│   ├── 小红书 (Industry News)                                        │
│   ├── 微信公众号 (Tutorials)                                        │
│   └── B站 (Video Content)                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- 云端托管：Vercel + Supabase
- 多用户：注册、登录、个人主页
- 内容运营：资讯、活动、教程
- 社交功能：关注、评论、分享
- Viblog用户目录：展示使用Viblog的开发者

---

## 4. Shared Packages

### 4.1 @viblog/mcp-server

**Purpose:** MCP Server for session sync and article generation

```typescript
// packages/viblog-mcp-server
// Shared between Viblog and Viblog-community

export {
  createVibeSession,
  appendSessionContext,
  uploadSessionContext,
  generateStructuredContext,
  generateArticleDraft,
  listUserSessions,
  publishArticle,
}
```

**Usage:**
- Viblog: Built-in MCP Server (local API)
- Viblog-community: MCP Server as API endpoint

### 4.2 @viblog/ui-components

**Purpose:** Shared UI component library

```
packages/viblog-ui/
├── src/
│   ├── components/
│   │   ├── ArticleCard/
│   │   ├── SessionCard/
│   │   ├── MetricsCard/
│   │   └── ...
│   └── index.ts
└── package.json
```

**Usage:**
- Viblog: Import directly
- Viblog-community: Import directly
- Both use same design system

### 4.3 @viblog/markdown-parser

**Purpose:** Markdown parsing and transformation

```
packages/viblog-markdown/
├── src/
│   ├── parser.ts
│   ├── transformer.ts
│   └── index.ts
└── package.json
```

---

## 5. Implementation Phases

### Phase 0: Planning (Current)

| Task | Priority | Status |
|------|----------|--------|
| Create ADR-007 | P0 | ✅ Done |
| Create Split Plan | P0 | In Progress |
| Update PRD_TRACK.md | P0 | Pending |

### Phase 1: Viblog Docker-First Refactor (Week 1-2)

| Task | Priority | Est. Hours |
|------|----------|------------|
| Create Dockerfile for Next.js app | P0 | 4h |
| Create docker-compose.yml with PostgreSQL | P0 | 4h |
| Create database initialization scripts | P0 | 4h |
| Remove Supabase dependencies | P0 | 4h |
| Implement local auth (optional) | P1 | 4h |
| Test Docker deployment | P0 | 2h |
| Write deployment documentation | P0 | 4h |

### Phase 2: Viblog-community Setup (Week 3)

| Task | Priority | Est. Hours |
|------|----------|------------|
| Create new repository | P0 | 1h |
| Fork current codebase | P0 | 2h |
| Configure Vercel deployment | P0 | 2h |
| Configure Supabase project | P0 | 2h |
| Update environment variables | P0 | 1h |
| Test deployment | P0 | 2h |

### Phase 3: Shared Packages Extraction (Week 4)

| Task | Priority | Est. Hours |
|------|----------|------------|
| Extract @viblog/mcp-server | P0 | 8h |
| Extract @viblog/ui-components | P1 | 8h |
| Extract @viblog/markdown-parser | P1 | 4h |
| Publish to npm (optional) | P2 | 4h |

### Phase 4: Feature Development (Week 5+)

| Product | Focus | Priority |
|---------|-------|----------|
| Viblog | Metrics Engine, Docker optimization | P0 |
| Viblog-community | Content, Events, Social | P1 |

---

## 6. Consequences

### Positive

- **清晰的产品定位：** 每个产品有明确的目标用户和价值
- **简化的部署：** Viblog 一键启动，Viblog-community 云端托管
- **独立迭代：** 两个产品可以独立发展，互不影响
- **代码共享：** 通过共享包复用核心逻辑
- **商业清晰：** 个人工具开源，社区平台可商业化

### Negative

- **维护两套代码：** 需要维护两个仓库
- **同步成本：** 共享包更新需要两边同步
- **初期工作量：** 拆分需要重构工作

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| 共享包版本不同步 | Medium | Medium | Monorepo with shared packages |
| 两个产品定位模糊 | Low | High | Clear ADR documentation |
| Docker部署复杂度 | Medium | Medium | Thorough testing, simple compose |

---

## 7. Success Metrics

### Viblog (Personal Tool)

| Metric | Target | Timeline |
|--------|--------|----------|
| GitHub Stars | 100+ | 3 months |
| Docker pulls | 500+ | 6 months |
| One-command setup | < 5 min | Launch |
| Active users (self) | 1 (you) | Immediate |

### Viblog-community (Community Platform)

| Metric | Target | Timeline |
|--------|--------|----------|
| Registered users | 50+ | 3 months |
| Monthly visitors | 500+ | 6 months |
| Content articles | 20+ | 3 months |
| Social followers | 100+ each | 6 months |

---

## 8. References

- PRD V3.4: `docs/prd/Viblog_PRD_V3.4.md`
- ADR-006: Gap Resolution Plan
- Product Split Plan: `docs/plans/PRODUCT_SPLIT_PLAN.md` (to be created)

---

**Document Version:** 1.0
**Created:** 2026-03-20
**Status:** Proposed - Awaiting Approval