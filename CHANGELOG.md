# CHANGELOG

> **Version:** 4.0
> **Updated:** 2026-03-19
> **Phase:** Phase 12 - Planning

---

## Phase 12 Changelog

### 2026-03-19: Document System Restructuring

#### docs: Document Architecture Redesign

**Authority:** CAO Architecture Decision

**Changes:**
- Created DOC_CATALOG.md as central navigation hub
- Created IMPLEMENTING_STATUS.md as task state machine
- Split IMPLEMENTATION_PLAN.md into:
  - plans/BACKEND_IMPLEMENTATION_PLAN.md
  - plans/FRONTEND_IMPLEMENTATION_PLAN.md
- Reorganized docs/ structure:
  - docs/architecture/ - ADR-001 through ADR-004 + template
  - docs/specifications/ - Feature specs
  - docs/reviews/ - Technical and design reviews
  - docs/ISSUE_LOG.md - Issue tracking
- Consolidated archives to docs/archive/:
  - mvp-phase-1-9/
  - mcp-phase-10-11/
- Deleted redundant placeholder files:
  - TECH_STACK.md, BACKEND_STRUCTURE.md, FRONTEND_GUIDELINES.md
  - PRODUCT_COMP_ANALYSIS.md, APP_FLOW.md, DEVELOPLOG.md
- Updated CLAUDE.md to reference new navigation system

**Rationale:**
- Enable parallel worktree development
- Provide task state tracking
- Reduce context overhead (~500 lines for session start)
- Preserve knowledge in organized structure

### 2026-03-19: Architecture Redesign

#### docs: PRD v2.0 - Business Model and Data Access Architecture

**Authority:** CAO Architecture Decision ADR-002

**Changes:**
- Added Data Layer Architecture (L0-L3)
- Added AI Access Permission Matrix
- Added Commercial Timeline (Trial 6 months → $9.9/month)
- Added User Stories for core features
- Updated Value Proposition: "Growth Has Value"

#### docs: IMPLEMENTATION_PLAN v3.0 - New Phase Roadmap

**Changes:**
- Added Phase 0: Technical Foundation (RLS + user_id)
- Added Phase 1: Data Management Core (MCP Service)
- Added Phase 2: User LLM Configuration
- Added Phase 3: Subscription System
- Added Phase 4: Community & Growth
- Added Critical Path diagram
- Added Quality Gates (CTO/CUIO)

#### docs: Database Redesign Plan - AI Access Proxy Layer

**Changes:**
- Added Part 8: AI Access Proxy Layer Design
- Added Architecture diagram
- Added Permission Matrix Implementation
- Added Core Functions pseudocode
- Added API Endpoints specification
- Added Security Considerations

#### docs: ADR-002 - Business Model and Data Access Architecture

**Status:** Approved

**Key Decisions:**
- Data Layer Architecture (L0-L3)
- Commercial Model (Trial → Subscription)
- LLM Access Control matrix
- User Data Sovereignty principles

#### docs: ADR-003 - MCP Layer 5 Commercial Architecture

**Status:** Approved

**Key Decisions:**
- Permission at data source level (community_articles), not Layer level
- Layer 5 Tool Permission Matrix (FREE vs SUBSCRIPTION)
- 3 new subscription-only tools: evaluate_article_value, discover_content_opportunities, track_similar_developers
- Value proposition: "知道自己有什么" (Free) vs "知道差距，知道往哪走" (Subscriber)

#### docs: ADR-004 - Agent Team Architecture Redesign

**Status:** Proposed

**Key Decisions:**
- Simplify from 4-level to 3-level hierarchy
- CAO has sole "Challenge Before Implement" authority
- Each agent definition limited to 100 lines max
- Removed mandatory multi-step sequences from reviewers
- Clear responsibility boundaries: CAO (strategy), CTO (quality), CUIO (design)

#### docs: VIBLOG_MCP_SERVICE_DESIGN v5.0

**Changes:**
- Added ADR-003 authority
- Updated Layer 5 architecture diagram with [FREE]/[SUBSCRIPTION] markers
- Added commercial model tables to all Layer 5 tools
- Added permission check code examples
- Added 3 new subscription-only tools (3.5.6, 3.5.7, 3.5.8)

<!--
New entries will be added here as Phase 12 progresses.
Format follows conventional commits:
- feat: New features
- fix: Bug fixes
- refactor: Code refactoring
- docs: Documentation
- test: Testing
- chore: Maintenance
-->