# DOC_CATALOG.md

> **Version:** 1.0
> **Updated:** 2026-03-19
> **Purpose:** Central navigation hub for Viblog documentation

---

## Quick Reference

| What You Need | Read This | Lines |
|---------------|-----------|-------|
| Start a new session | CLAUDE.md | ~200 |
| Check current tasks | IMPLEMENTING_STATUS.md | ~100 |
| Understand product vision | PRD.md | ~270 |
| Review architecture decisions | docs/architecture/ADR-XXX.md | ~100 each |
| Plan implementation | plans/BACKEND_PLAN.md or plans/FRONTEND_PLAN.md | ~200 each |
| Track changes | CHANGELOG.md | ~100 |
| Find issue resolutions | docs/ISSUE_LOG.md | ~50 |

---

## Core Documents

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| `CLAUDE.md` | Agent instructions & workflows | Process changes |
| `IMPLEMENTING_STATUS.md` | Task state machine | Every task change |
| `PRD.md` | Product requirements | Strategic pivot |
| `CHANGELOG.md` | Change history | Every commit |

---

## Architecture Documents (docs/architecture/)

| ADR | Topic | Status |
|-----|-------|--------|
| ADR-001 | Database Multi-Tenant Isolation | Approved |
| ADR-002 | Business Model & Data Access | Approved |
| ADR-003 | MCP Layer 5 Commercial Architecture | Approved |
| ADR-004 | Agent Team Architecture Redesign | Approved |
| ADR-TEMPLATE | Template for new ADRs | Reference |

---

## Feature Specifications (docs/specifications/)

| Document | Feature | Status |
|----------|---------|--------|
| `DUAL_READING_STRUCTURE.md` | Article reading UX | Planned |
| `IMMERSIVE_EXPERIENCE_DESIGN.md` | Immersive reading mode | Planned |
| `MCP_SERVICE_DESIGN.md` | MCP service architecture | Active |
| `VIBLOG_PUBLISH_GUIDANCE.md` | Publishing workflow guide | Active |
| `article-draft-viblog-ecosystem-positioning.md` | Example article draft | Reference |

---

## Reviews (docs/reviews/)

### Technical Reviews (reviews/technical/)

| Document | Review Date | Grade |
|----------|-------------|-------|
| *Pending* | - | - |

### Design Reviews (reviews/design/)

| Document | Review Date | Grade |
|----------|-------------|-------|
| `phase1-design-system-review.md` | Phase 1 | A |
| `UX_EVALUATION_2026-03-18.md` | 2026-03-18 | Reference |

---

## Implementation Plans (plans/)

| Plan | Focus | Parallel Worktree |
|------|-------|-------------------|
| `BACKEND_IMPLEMENTATION_PLAN.md` | API, Database, MCP Service | `.claude/worktrees/backend` |
| `FRONTEND_IMPLEMENTATION_PLAN.md` | UI, Components, UX | `.claude/worktrees/frontend` |

---

## Archive (docs/archive/)

| Directory | Content | Phase |
|-----------|---------|-------|
| `mvp-phase-1-9/` | MVP development docs | Phase 1-9 |
| `mcp-phase-10-11/` | MCP service development | Phase 10-11 |
| `brainstorming/` | Design exploration docs | Reference |
| `UI_TEAM_WORKFLOW.md` | Workflow (merged into CLAUDE.md) | Archived |

---

## Query Guide

### Starting a Session

1. Read `DOC_CATALOG.md` (this file) - understand what exists
2. Read `IMPLEMENTING_STATUS.md` - check current state
3. Read relevant ADR(s) - understand constraints
4. Read relevant implementation plan - understand tasks

### Planning a Feature

1. Check `IMPLEMENTING_STATUS.md` for current phase
2. Read relevant `ADR-XXX.md` for architecture constraints
3. Read `plans/BACKEND_PLAN.md` or `plans/FRONTEND_PLAN.md`
4. Create task in `IMPLEMENTING_STATUS.md`

### Encountering an Issue

1. Check `docs/ISSUE_LOG.md` for similar issues
2. If new issue, add to `ISSUE_LOG.md` with status BLOCKED
3. Resolve and document in `ISSUE_LOG.md`

### Making an Architectural Decision

1. Check existing ADRs for relevant decisions
2. If new decision needed:
   - Create `ADR-XXX.md` using template
   - Update affected documents
   - Update `IMPLEMENTING_STATUS.md`

---

## Document Responsibilities

| Document | Responsibility | Owner |
|----------|---------------|-------|
| DOC_CATALOG.md | Navigation hub | CAO |
| IMPLEMENTING_STATUS.md | Task tracking | All agents |
| PRD.md | Product vision | Product Owner |
| CLAUDE.md | Agent instructions | CAO |
| CHANGELOG.md | Change history | All agents |
| ADR-XXX.md | Architecture decisions | CAO |
| ISSUE_LOG.md | Issue tracking | All agents |

---

**Document Version:** 1.0
**Last Updated:** 2026-03-19