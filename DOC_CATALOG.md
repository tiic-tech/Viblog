# DOC_CATALOG.md

> **Version:** 2.0
> **Updated:** 2026-03-20
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
| Find issue resolutions | docs/issues/[TEAM]_ISSUES.md | ~50 |
| Check cross-team issues | docs/issues/SHARED_ISSUES.md | ~30 |
| Review CAO decisions | docs/DECISION_LOG.md | ~50 |
| Check API contracts | docs/INTERFACE_CONTRACT.md | ~100 |
| Parallel dev protocol | docs/PARALLEL_DEVELOPMENT_PROTOCOL.md | ~200 |

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

## Parallel Development Documents

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| `PARALLEL_DEVELOPMENT_PROTOCOL.md` | Worktree coordination rules | Process changes |
| `INTERFACE_CONTRACT.md` | API/Data contracts | Interface changes |
| `DECISION_LOG.md` | CAO rulings, shared decisions | When CAO invoked |
| `issues/SHARED_ISSUES.md` | Cross-team issues | When conflict found |

### Team-Specific Documents

| Team | Issue Log | Dev Log | Focus |
|------|-----------|---------|-------|
| Backend | `issues/BACKEND_ISSUES.md` | `dev-logs/BACKEND_DEVLOG.md` | API, DB, MCP |
| Frontend | `issues/FRONTEND_ISSUES.md` | `dev-logs/FRONTEND_DEVLOG.md` | UI, UX, Components |

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
3. Read `DECISION_LOG.md` - check new rulings
4. Read relevant ADR(s) - understand constraints
5. Read relevant implementation plan - understand tasks

### Starting a Worktree Session

1. **Sync first:**
   - `git fetch origin`
   - Read `IMPLEMENTING_STATUS.md` (global progress)
   - Read `DECISION_LOG.md` (new rulings)
   - Read `issues/SHARED_ISSUES.md` (cross-team issues)
2. **Check counterpart:**
   - Read other team's DEVLOG
   - Check for INTERFACE_CONTRACT changes
3. **Proceed with work**

### Planning a Feature

1. Check `IMPLEMENTING_STATUS.md` for current phase
2. Read relevant `ADR-XXX.md` for architecture constraints
3. Read `plans/BACKEND_PLAN.md` or `plans/FRONTEND_PLAN.md`
4. Check `INTERFACE_CONTRACT.md` for existing contracts
5. Create task in `IMPLEMENTING_STATUS.md`

### Encountering an Issue

1. Check `docs/issues/[TEAM]_ISSUES.md` for similar issues
2. If cross-team, check `issues/SHARED_ISSUES.md`
3. If new issue:
   - Team-only: Add to `[TEAM]_ISSUES.md`
   - Cross-team: Add to `SHARED_ISSUES.md`
4. Resolve and document

### Making an Architectural Decision

1. Check existing ADRs for relevant decisions
2. If new decision needed:
   - Create `ADR-XXX.md` using template
   - Update `INTERFACE_CONTRACT.md` if API affected
   - Update affected documents
   - Update `IMPLEMENTING_STATUS.md`

### Detecting Cross-Team Conflict

1. Check your changes against `INTERFACE_CONTRACT.md`
2. If conflict detected:
   - Add to `SHARED_ISSUES.md`
   - If unresolved, invoke CAO
   - CAO ruling → `DECISION_LOG.md`
   - Both teams acknowledge

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
| DECISION_LOG.md | CAO rulings | CAO |
| INTERFACE_CONTRACT.md | API contracts | Backend + Frontend |
| SHARED_ISSUES.md | Cross-team issues | Both teams |
| [TEAM]_ISSUES.md | Team issues | Respective team |
| [TEAM]_DEVLOG.md | Team progress | Respective team |

---

**Document Version:** 2.0
**Last Updated:** 2026-03-20