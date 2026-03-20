# ADR-008: Docker Architecture for Personal Tool

> **Status:** Approved
> **Created:** 2026-03-20
> **Authority:** CAO Strategic Decision
> **Related:** ADR-007 (Product Split)

---

## 1. Context

Following the product split decision (ADR-007), Viblog is now positioned as a pure open-source personal tool. This requires:

1. Docker Compose deployment for one-command setup
2. Local PostgreSQL database
3. No cloud dependencies
4. Single-user architecture

---

## 2. Decision

### 2.1 Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | Node.js 20 Alpine | Lightweight, secure |
| Framework | Next.js 16 (standalone) | Smaller Docker image |
| Database | PostgreSQL 16 Alpine | Production-ready, lightweight |
| ORM | postgres.js | Direct SQL, simple, fast |
| Auth | Optional (ENABLE_AUTH toggle) | Flexible deployment modes |

### 2.2 Docker Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG DOCKER ARCHITECTURE                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Docker Network: viblog-network                              │   │
│   │                                                             │   │
│   │   ┌─────────────┐    ┌─────────────┐                       │   │
│   │   │   app       │    │     db      │                       │   │
│   │   │   (Next.js) │    │ (PostgreSQL)│                       │   │
│   │   │   :3000     │    │    :5432    │                       │   │
│   │   └─────────────┘    └─────────────┘                       │   │
│   │         │                  │                                │   │
│   │         └──────────────────┘                                │   │
│   │                                                            │   │
│   └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│   Volumes:                                                           │
│   ├── ./data/postgres  →  PostgreSQL data (persistent)             │
│   ├── ./data/uploads   →  File uploads                             │
│   └── ./data/exports   →  Data exports/backups                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Deployment Modes

| Mode | Config | Use Case |
|------|--------|----------|
| **Local Tool** | `ENABLE_AUTH=false` | Default, localhost only |
| **Personal Server** | `ENABLE_AUTH=true` | Deploy to own domain |

---

## 3. Challenge Resolutions

### 3.1 Cache System (Redis)

**Issue:** Current codebase uses Upstash Redis
**Options:**
1. Remove caching (simplest)
2. Local Redis container
3. In-memory cache

**Decision:** **Remove caching**

**Rationale:**
- Single-user performance is acceptable without cache
- Reduces deployment complexity
- Can be re-added if performance issues arise

### 3.2 SQLite Alternative

**Issue:** PostgreSQL requires Docker knowledge
**Options:**
1. PostgreSQL only
2. SQLite support
3. Both options

**Decision:** **PostgreSQL only**

**Rationale:**
- Docker is the target deployment method
- Vibe Coders can ask AI to configure
- PostgreSQL provides better features (JSONB, full-text search)
- SQLite can be added later if demand exists

### 3.3 Annotation Feature

**Issue:** Annotation system adds complexity
**Options:**
1. Remove entirely
2. Keep with toggle
3. Move to viblog-community

**Decision:** **Keep with ENABLE_AUTH toggle**

**Rationale:**
- Users may want to deploy to personal domain
- Toggle allows flexibility without complexity
- Disabled by default for simplest setup

---

## 4. Database Schema

### 4.1 Core Tables

```sql
-- Sessions (no user_id)
CREATE TABLE vibe_sessions (
  id UUID PRIMARY KEY,
  title TEXT,
  platform TEXT,
  model TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Fragments (OpenAI Format)
CREATE TABLE session_fragments (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES vibe_sessions(id),
  role TEXT NOT NULL,
  content JSONB NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (no user_id)
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles (no user_id, no stars/premium)
CREATE TABLE articles (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LLM Config (encrypted API keys)
CREATE TABLE llm_config (
  id UUID PRIMARY KEY,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE
);

-- Metrics Cache
CREATE TABLE metrics_cache (
  id UUID PRIMARY KEY,
  metric_type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL
);
```

### 4.2 Optional Auth Tables

```sql
-- Only created when ENABLE_AUTH=true
CREATE TABLE users (...);
CREATE TABLE auth_sessions (...);
CREATE TABLE annotations (...);
```

---

## 5. Implementation Timeline

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| Phase 1 | Day 1-2 | Docker Infrastructure | ✅ Complete |
| Phase 2 | Day 3-4 | Database Migration | ✅ Complete |
| Phase 3 | Day 5-7 | Code Refactoring | 🔴 Pending |
| Phase 4 | Day 8-9 | Testing & Documentation | 🔴 Pending |
| Phase 5 | Day 10 | Final Review & Release | 🔴 Pending |

---

## 6. Success Criteria

### Technical

- [ ] `docker-compose up` starts all services in under 60 seconds
- [ ] Database initializes automatically
- [ ] MCP Server works with local API
- [ ] Data persists across container restarts
- [ ] Build size under 500MB

### User Experience

- [ ] Setup completed in under 5 minutes
- [ ] Clear error messages
- [ ] No manual database configuration required

---

## 7. Consequences

### Positive

- True "one-command" deployment
- Complete data privacy
- No cloud dependencies
- Lower operating costs
- Easier to contribute to open source

### Negative

- Requires Docker knowledge
- No managed database backups (user responsibility)
- Manual updates required

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Docker networking issues | Medium | High | Test on multiple OS |
| Data migration errors | Low | Critical | Migration scripts, backups |
| Build size too large | Low | Medium | Optimize Dockerfile |

---

## 8. References

- ADR-007: Product Split Decision
- Docker Refactor Plan: `docs/plans/VIBLOG_DOCKER_REFACTOR_PLAN.md`
- Dev Log: `docs/dev-logs/docker-refactor-dev-log.md`

---

**Document Version:** 1.0
**Created:** 2026-03-20
**Status:** Approved
**Authority:** CAO Strategic Decision