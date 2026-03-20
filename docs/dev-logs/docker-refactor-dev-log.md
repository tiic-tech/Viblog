# Docker Refactor Dev Log

> **Started:** 2026-03-20
> **Authority:** CAO ADR-008
> **Status:** Phase 1-2 Complete, Phase 3-5 Pending

---

## Overview

Transform Viblog from a multi-user Supabase-based platform into a pure open-source personal tool with Docker Compose deployment.

---

## Phase 1: Docker Infrastructure ✅ COMPLETE

**Duration:** 2026-03-20
**Est. Hours:** 14h actual

### Tasks Completed

| Task | Status | Notes |
|------|--------|-------|
| Create Dockerfile for Next.js app | ✅ | Multi-stage build, standalone output |
| Create docker-compose.yml | ✅ | PostgreSQL 16 + Next.js services |
| Create .dockerignore | ✅ | Optimized build context |
| Create docker/init-db.sql | ✅ | Complete single-user schema |
| Create .env.docker.example | ✅ | Environment template |
| Update next.config.mjs | ✅ | Added `output: 'standalone'` |
| Create start.sh | ✅ | Quick start script |

### Files Created

```
docker/
├── Dockerfile              # Multi-stage build
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development override
├── init-db.sql            # Database initialization
├── .dockerignore          # Build optimization
└── start.sh               # Quick start script

.env.docker.example        # Environment template
```

### Key Decisions

1. **PostgreSQL 16 Alpine** - Lightweight, production-ready
2. **Standalone Output** - Smaller Docker image
3. **Health Checks** - Database readiness verification
4. **Named Volumes** - Data persistence

---

## Phase 2: Database Migration ✅ COMPLETE

**Duration:** 2026-03-20
**Est. Hours:** 8h actual

### Tasks Completed

| Task | Status | Notes |
|------|--------|-------|
| Create PostgreSQL client library | ✅ | Using postgres.js |
| Create database connection utilities | ✅ | Connection pooling |
| Update types/database.ts | ⏳ | Pending Phase 3 |
| Create CRUD operations | ✅ | All entities covered |

### Files Created

```
src/lib/db/
├── client.ts   # PostgreSQL client with full CRUD
└── index.ts    # Module exports
```

### Entities Implemented

- `vibe_sessions` - CRUD + filtering
- `session_fragments` - CRUD + session relation
- `projects` - CRUD + slug lookup
- `articles` - CRUD + slug lookup + publish
- `llm_config` - CRUD + primary selection
- `user_settings` - Get/Set by key
- `metrics_cache` - CRUD

### Dependencies Changed

```diff
+ postgres: ^3.4.5
- @supabase/ssr: 0.9.0
- @supabase/supabase-js: 2.99.1
- @upstash/redis: ^1.37.0
```

---

## Phase 3: Code Refactoring 🔴 PENDING

**Est. Duration:** Day 5-7
**Est. Hours:** 16h

### Tasks

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Remove auth components and pages | P0 | 2h | Pending |
| Remove public components and pages | P0 | 2h | Pending |
| Update API routes for single user | P0 | 4h | Pending |
| Update dashboard components | P0 | 4h | Pending |
| Update article components | P0 | 2h | Pending |
| Update project components | P0 | 2h | Pending |
| Remove Supabase dependencies | P0 | 2h | Pending |

### Files to Remove

```
src/
├── app/
│   ├── (auth)/              # Entire directory
│   └── (public)/            # Entire directory
├── components/
│   ├── auth/                # Entire directory
│   └── public/              # Entire directory
└── lib/
    ├── supabase/            # Entire directory
    └── cache/               # Entire directory
```

### Files to Modify

- All API routes in `src/app/api/`
- Dashboard components
- Article components
- Project components
- Middleware

---

## Phase 4: Testing & Documentation 🔴 PENDING

**Est. Duration:** Day 8-9
**Est. Hours:** 14h

### Tasks

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Update unit tests | P0 | 4h | Pending |
| Create Docker integration tests | P0 | 4h | Pending |
| Update README.md | P0 | 2h | Pending |
| Create INSTALLATION.md | P0 | 2h | Pending |
| Create CONFIGURATION.md | P0 | 2h | Pending |

---

## Phase 5: Final Review & Release 🔴 PENDING

**Est. Duration:** Day 10
**Est. Hours:** 10h

### Tasks

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| End-to-end testing | P0 | 4h | Pending |
| Performance testing | P1 | 2h | Pending |
| Security review | P0 | 2h | Pending |
| Create release tag | P0 | 1h | Pending |
| Push to GitHub | P0 | 1h | Pending |

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

---

## Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Docker build size | < 500MB | TBD |
| Startup time | < 60s | TBD |
| API response time | < 200ms | TBD |

---

## Notes

- CAO raised 3 challenges, all resolved
- Product split (ADR-007) enabled this refactor
- viblog-community fork created for platform version

---

**Last Updated:** 2026-03-20
**Progress:** 40% (Phase 1-2 of 5)