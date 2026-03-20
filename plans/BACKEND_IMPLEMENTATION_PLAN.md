# Backend Implementation Plan

> **Version:** 2.0
> **Updated:** 2026-03-20
> **Authority:** CAO Architecture Decision ADR-006
> **Phase:** Phase 0 - Foundation
> **PRD:** V3.4 Dual-Layer Architecture

---

## Overview

This plan covers backend implementation aligned with PRD V3.4 Dual-Layer Architecture:
- **Foundation Layer:** MCP + OpenAI Format + Metrics Engine
- **Public Layer:** Efficiency Dashboard + Profile + Timeline + Product Showcase
- **Private Layer:** Agent Manager + Workflows + Growth Insights

**Worktree:** `.claude/worktrees/backend`
**Branch:** `feature/phase0-backend`

---

## Gap Analysis Summary

Based on CAO/CTO/CUIO joint analysis (ADR-006):

| Layer | PRD V3.4 Requirement | Current State | Gap |
|-------|---------------------|---------------|-----|
| Foundation | MCP + OpenAI Format + Metrics | MCP ✅, OpenAI 🟡, Metrics ❌ | 60% |
| Public | Dashboard + Profile + Timeline | Profile 🟡, Others ❌ | 85% |
| Private | Agent + Workflow + Insights | All ❌ | 100% |

---

## Phase 0: Foundation (1-2 weeks)

**Goal:** Establish PRD V3.4 foundation layer

### Sprint 0.1: SessionFragment OpenAI Format Migration (ADR-005)

**Priority:** P0 (Critical - Blocks multi-platform support)

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design OpenAI format schema for session_fragments | 4h | Pending | ADR-005 reference |
| Create migration: add role, content, tool_calls columns | 6h | Pending | Backward compatible |
| Update MCP Server output to OpenAI format | 8h | Pending | All 7 tools |
| Migrate existing data to new format | 4h | Pending | Batch migration |
| Write migration tests | 4h | Pending | Rollback scenarios |
| Verify and switch over | 2h | Pending | Feature flag |

**Deliverables:**
- [ ] session_fragments uses OpenAI ContentBlock[] format
- [ ] MCP Server outputs OpenAI-compatible content
- [ ] Migration tested with rollback capability

### Sprint 0.2: Metrics Engine Implementation

**Priority:** P0 (Critical - Blocks Efficiency Dashboard)

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design metrics_cache table schema | 4h | Pending | See ADR-006 |
| Implement velocity calculator | 6h | Pending | features/week |
| Implement efficiency calculator | 6h | Pending | hours/feature |
| Implement token economy calculator | 4h | Pending | output/input ratio |
| Implement iteration ratio calculator | 4h | Pending | revisions/initial |
| Implement cache efficiency calculator | 4h | Pending | cached/total |
| Implement AI leverage calculator | 4h | Pending | generated/manual lines |
| Create `/api/metrics/calculate` endpoint | 4h | Pending | Trigger calculation |
| Create `/api/metrics/dashboard` endpoint | 4h | Pending | Get dashboard data |
| Write metrics engine tests | 6h | Pending | Unit + integration |

**Deliverables:**
- [ ] metrics_cache table created
- [ ] All 6 metric calculators implemented
- [ ] API endpoints functional

### Sprint 0.3: Security Fix - article_paragraphs

**Priority:** P0 (Critical - Security risk)

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Add user_id to article_paragraphs table | 2h | Pending | Migration |
| Create RLS policy for article_paragraphs | 2h | Pending | user_id isolation |
| Update API to filter by user_id | 2h | Pending | All paragraphs endpoints |
| Write security tests | 2h | Pending | Multi-tenant isolation |

**Deliverables:**
- [ ] article_paragraphs has user_id column
- [ ] RLS policy enforces tenant isolation
- [ ] API returns only user's paragraphs

### Sprint 0.4: API Test Coverage

**Priority:** P1 (Important - Regression prevention)

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Create vibe-sessions API tests | 6h | Pending | 0% → 80% coverage |
| Create session-fragments API tests | 6h | Pending | CRUD + edge cases |
| Create metrics API tests | 4h | Pending | Calculation + caching |
| Create articles API tests | 4h | Pending | CRUD + publishing |

**Deliverables:**
- [ ] All API routes have 80%+ test coverage
- [ ] Edge cases covered
- [ ] Integration tests for workflows

---

## Phase 1: Public Layer (2 weeks)

**Goal:** Implement "Prove" layer for PRD V3.4

### Sprint 1.1: Efficiency Dashboard Backend

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design dashboard API schema | 4h | Pending | Metrics aggregation |
| Implement weekly/monthly aggregations | 6h | Pending | Time-series data |
| Create comparison endpoints | 4h | Pending | METR baseline |
| Build caching layer | 4h | Pending | Redis/memory |
| Write dashboard API tests | 4h | Pending | E2E scenarios |

**Deliverables:**
- [ ] Dashboard API returns all metrics
- [ ] Time-series aggregation working
- [ ] METR baseline comparison available

### Sprint 1.2: Public Profile Enhancement

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Extend profiles table | 4h | Pending | public_metrics_enabled, show_velocity, etc. |
| Create public profile API | 4h | Pending | /api/public/profiles/[username] |
| Implement metrics visibility controls | 4h | Pending | User preferences |
| Create profile badge system | 4h | Pending | Verification, milestones |
| Write profile API tests | 4h | Pending | Privacy + public access |

**Deliverables:**
- [ ] Extended profiles schema
- [ ] Public profile API with visibility controls
- [ ] Badge system foundation

### Sprint 1.3: Session Timeline Backend

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design timeline API schema | 4h | Pending | Session grouping |
| Implement session grouping by date | 4h | Pending | Daily/weekly/monthly |
| Create timeline filtering | 4h | Pending | By project, status, date |
| Build timeline export | 4h | Pending | JSON/Markdown |
| Write timeline API tests | 4h | Pending | Filtering + export |

**Deliverables:**
- [ ] Timeline API functional
- [ ] Session grouping working
- [ ] Export functionality ready

### Sprint 1.4: Product Showcase Backend

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Map projects table to products concept | 2h | Pending | Semantic mapping |
| Create `/api/products/[id]/showcase` endpoint | 6h | Pending | Showcase management |
| Implement product metrics calculation | 4h | Pending | Per-product stats |
| Create showcase visibility controls | 4h | Pending | Public/private |
| Write showcase API tests | 4h | Pending | CRUD + visibility |

**Deliverables:**
- [ ] Products API (mapped from projects)
- [ ] Showcase endpoint functional
- [ ] Product metrics calculated

---

## Phase 2: Private Layer (2 weeks)

**Goal:** Implement "Grow" layer for PRD V3.4

### Sprint 2.1: Agent Team Manager Backend

**Priority:** P1

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design agent_configs table schema | 4h | Pending | Agent configuration storage |
| Create `/api/agent-configs/` CRUD | 6h | Pending | Full CRUD operations |
| Implement config validation | 4h | Pending | Schema validation |
| Create AGENTS.md export | 4h | Pending | Linux Foundation format |
| Write agent config API tests | 4h | Pending | CRUD + export |

**Deliverables:**
- [ ] agent_configs table created
- [ ] Agent config CRUD API functional
- [ ] AGENTS.md export working

### Sprint 2.2: Workflow Library Backend

**Priority:** P1

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design workflows table schema | 4h | Pending | Workflow templates |
| Design workflow_steps table schema | 4h | Pending | Step definitions |
| Create `/api/workflows/` CRUD | 6h | Pending | Full CRUD operations |
| Implement workflow execution engine | 8h | Pending | Step-by-step execution |
| Write workflow API tests | 4h | Pending | CRUD + execution |

**Deliverables:**
- [ ] workflows + workflow_steps tables created
- [ ] Workflow CRUD API functional
- [ ] Execution engine foundation

### Sprint 2.3: Growth Insights Backend

**Priority:** P2

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design growth_insights table schema | 4h | Pending | Insights storage |
| Implement insight generation | 6h | Pending | AI-powered analysis |
| Create `/api/growth-insights/` endpoints | 4h | Pending | CRUD operations |
| Build insight scheduling | 4h | Pending | Periodic generation |
| Write growth API tests | 4h | Pending | CRUD + generation |

**Deliverables:**
- [ ] growth_insights table created
- [ ] Insight generation functional
- [ ] Scheduled insights working

---

## Database Schema Summary

### New Tables (from Gap Analysis)

```sql
-- Phase 0
CREATE TABLE metrics_cache (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phase 2
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workflows (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE growth_insights (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  insight_type TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Modified Tables

```sql
-- session_fragments: Add OpenAI format columns (ADR-005)
ALTER TABLE session_fragments ADD COLUMN role TEXT;
ALTER TABLE session_fragments ADD COLUMN content JSONB;
ALTER TABLE session_fragments ADD COLUMN tool_calls JSONB;
ALTER TABLE session_fragments ADD COLUMN metadata JSONB;

-- article_paragraphs: Security fix
ALTER TABLE article_paragraphs ADD COLUMN user_id UUID REFERENCES auth.users;

-- profiles: Extend for public metrics
ALTER TABLE profiles ADD COLUMN public_metrics_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN show_velocity BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN show_efficiency BOOLEAN DEFAULT FALSE;
```

---

## Quality Gates

### Technical Review (CTO) - 11 Metrics

| Metric | Target | Weight |
|--------|--------|--------|
| Architecture Alignment | Grade A | 9 points |
| Code Quality | Grade A | 9 points |
| Security Posture | Grade A | 9 points |
| Test Coverage | 80%+ | 9 points |
| Scenario Coverage | All critical paths | 9 points |
| API Design | RESTful, documented | 9 points |
| Database Design | Normalized, indexed | 9 points |
| Error Handling | Comprehensive | 9 points |
| Performance | <200ms API response | 9 points |
| Documentation | Complete | 9 points |
| Maintainability | High | 9 points |

**Pass Threshold:** Grade A (80-89 points)

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SessionFragment migration complexity | Medium | High | Keep old table 90 days, batch migration |
| Metrics calculation performance | Medium | Medium | Async worker, incremental updates |
| OpenAI format incompatibility | Low | Medium | Validate in MCP Server first |
| RLS policy complexity | Medium | High | Thorough testing, rollback scripts |

---

## References

| Document | Purpose |
|----------|---------|
| `PRD_TRACK.md` | Current PRD requirements |
| `docs/architecture/ADR-005` | SessionFragment OpenAI Format |
| `docs/architecture/ADR-006` | Gap Resolution Plan |
| `IMPLEMENTING_STATUS.md` | Task status tracking |
| `docs/specifications/MCP_SERVICE_DESIGN.md` | MCP Server design |

---

**Document Version:** 2.0
**Last Updated:** 2026-03-20
**Authority:** ADR-006 Gap Resolution Plan