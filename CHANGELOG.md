# CHANGELOG

> **Version:** 5.0
> **Updated:** 2026-03-20
> **Phase:** Docker Refactor - Phase 2 Complete

---

## Phase 13 Changelog: Docker Refactor

### 2026-03-20: Phase 1 & 2 Complete

#### feat(docker): Transform Viblog into Docker-based personal tool

**Authority:** CAO ADR-008 (Docker Architecture)

**Strategic Decision:**
Transform Viblog from multi-user Supabase platform into a pure open-source personal tool with Docker Compose deployment.

**Challenge Resolutions:**
| Challenge | Decision |
|-----------|----------|
| Redis Cache | **Remove** - Single-user doesn't need distributed cache |
| SQLite | **No** - Docker + PostgreSQL only |
| Annotation | **Keep with toggle** - `ENABLE_AUTH` enables auth features |

**Phase 1 Complete: Docker Infrastructure**

| File | Purpose |
|------|---------|
| `docker/Dockerfile` | Multi-stage build for Next.js standalone |
| `docker/docker-compose.yml` | PostgreSQL + Next.js services |
| `docker/docker-compose.dev.yml` | Development override with hot reload |
| `docker/init-db.sql` | Complete database schema for single-user |
| `docker/.dockerignore` | Build context optimization |
| `docker/start.sh` | Quick start script |
| `.env.docker.example` | Environment configuration template |
| `next.config.mjs` | Enabled standalone output |

**Phase 2 Complete: PostgreSQL Client Library**

| File | Purpose |
|------|---------|
| `src/lib/db/client.ts` | PostgreSQL client with postgres.js |
| `src/lib/db/index.ts` | Module exports |

**Database Schema Created:**
- `vibe_sessions` - Session tracking
- `session_fragments` - OpenAI format content blocks
- `projects` - Project grouping
- `articles`, `article_paragraphs` - Article management
- `llm_config` - LLM API key storage
- `user_settings` - Application preferences
- `metrics_cache` - Efficiency metrics
- Optional auth tables (users, auth_sessions, annotations)

**Deployment Modes:**
```yaml
# Mode A: Pure Local Tool (Default)
ENABLE_AUTH=false  # No login, localhost only

# Mode B: Personal Server
ENABLE_AUTH=true   # Login required, deploy to your domain
```

**Dependencies Changed:**
- Added: `postgres` (^3.4.5)
- Removed: `@supabase/ssr`, `@supabase/supabase-js`, `@upstash/redis`

**Next Steps:**
- Phase 3: Code refactoring (remove auth/public/Supabase)
- Phase 4: Testing & documentation
- Phase 5: Final review & release

---

### 2026-03-20: Strategic Pivot - Product Split

#### docs: ADR-007 - Product Split Decision

**Authority:** CAO Strategic Decision

**Problem Analysis:**
Current codebase mixes two fundamentally different products:
- Docker-based personal tool (Viblog)
- Cloud-hosted community platform (Viblog-community)

**These requirements are mutually exclusive:**

| Dimension | Personal Tool | Community Platform |
|-----------|--------------|-------------------|
| Deployment | Docker Compose | Vercel + Supabase |
| Database | Local PostgreSQL | Supabase Cloud |
| Users | Single user | Multi-user |
| Privacy | Complete private | Public sharing |
| Auth | Optional/Local | OAuth + JWT |

**Decision:**

Split into two independent products:

| Product | Positioning | Tech Stack | Deployment |
|---------|-------------|------------|------------|
| **Viblog** | Open-source personal tool | Next.js + PostgreSQL (Docker) | docker-compose up |
| **Viblog-community** | Community platform | Next.js + Supabase | Vercel |

**Shared Packages:**

- `@viblog/mcp-server` - MCP tools for both products
- `@viblog/ui-components` - UI component library
- `@viblog/core` - Business logic (metrics, sessions)

**Implementation Timeline:**
- Week 1: Viblog Docker setup
- Week 2: Shared packages extraction
- Week 3: Viblog-community setup
- Week 4: Integration & testing

**Documents Created:**
- `docs/architecture/ADR-007-Product-Split-Viblog-Viblogcommunity.md`
- `docs/plans/PRODUCT_SPLIT_PLAN.md`

**Documents Updated:**
- `PRD_TRACK.md` - Added product strategy
- `DOC_CATALOG.md` (v2.3 → v2.4)

---

### 2026-03-20: Gap Analysis & Implementation Plan Update

#### docs: ADR-006 - Viblog V3.4 Gap Resolution Plan

**Authority:** CAO + CTO + CUIO Joint Analysis

**Gap Analysis Summary:**

| Layer | PRD V3.4 Requirement | Current State | Completion |
|-------|---------------------|---------------|------------|
| Foundation | MCP + OpenAI Format + Metrics | MCP ✅, OpenAI 🟡, Metrics ❌ | 40% |
| Public Layer | Dashboard + Profile + Timeline | Profile 🟡, Others ❌ | 15% |
| Private Layer | Agent + Workflow + Insights | All ❌ | 0% |

**Critical Gaps Identified:**

| Gap | Impact | Priority |
|-----|--------|----------|
| SessionFragment not OpenAI format | Blocks multi-platform support | P0 |
| Metrics Engine missing | Blocks Efficiency Dashboard | P0 |
| article_paragraphs no user_id | Security risk | P0 |
| No session_fragments API tests | Regression risk | P1 |
| Missing UI components | Blocks Public Layer | P0 |

**Implementation Phases:**

```
Phase 0: Foundation (1-2 weeks)
├── ADR-005 Execution (session_fragments migration)
├── Metrics Engine Implementation
├── Security Fix (article_paragraphs user_id)
└── API Test Coverage

Phase 1: Public Layer (2 weeks)
├── Efficiency Dashboard UI
├── Public Profile Enhancement
├── Session Timeline View
└── Product Showcase

Phase 2: Private Layer (2 weeks)
├── Agent Team Manager
├── Workflow Library
└── Growth Insights
```

**Documents Updated:**
- `docs/architecture/ADR-006-Viblog-V3.4-Gap-Resolution-Plan.md`
- `plans/BACKEND_IMPLEMENTATION_PLAN.md` (v1.0 → v2.0)
- `plans/FRONTEND_IMPLEMENTATION_PLAN.md` (v1.0 → v2.0)
- `PRD.md` → `PRD_TRACK.md` (dynamic PRD tracking)
- `DOC_CATALOG.md` (v2.2 → v2.3)

---

### 2026-03-20: MCP Validation Fix

#### fix(mcp): Add fragment_type enum validation to upload_session_context

**Issue:** ISSUE-005 - FragmentInputSchema validation gap

**Problem:**
`FragmentInputSchema` in `validation.ts` used `z.string()` instead of `FragmentTypeSchema` for `fragment_type`, allowing invalid values to pass MCP validation and fail at API layer with confusing error messages.

**Before:**
```typescript
export const FragmentInputSchema = z.object({
  fragment_type: z.string().min(1, 'fragment_type is required'),  // ❌ No enum validation
  ...
})
```

**After:**
```typescript
export const FragmentInputSchema = z.object({
  fragment_type: FragmentTypeSchema,  // ✅ Proper enum validation
  ...
})
```

**Impact:**
- Invalid fragment_type now caught at MCP layer
- Friendly error message: "fragment_type must be one of: user_prompt, ai_response, code_block, file_content, command_output, error_log, system_message, external_link"
- All 203 tests passing

**Documents:**
- `docs/issues/BACKEND_ISSUES.md` (ISSUE-005)

---

### 2026-03-20: Dual-Layer Architecture

#### docs: PRD V3.4 - Dual-Layer Growth Platform

**Authority:** CAO Strategic Decision

**Research Foundation:**

| Finding | Source | Implication |
|---------|--------|-------------|
| AI tools cause 19% initial productivity drop | METR Study 2024 | Quantified learning curve = differentiation |
| AGENTS.md adopted by Linux Foundation | Agentic AI Foundation | Cross-platform agent config is standardizing |
| "Proof of work" products exist but fragmented | BragDoc, Codeboards, MindSkill | Market validates need, no complete solution |

**Strategic Evolution:**

| Dimension | V3.3 (Before) | V3.4 (After) |
|-----------|---------------|--------------|
| **Architecture** | Single-layer (Public) | **Dual-Layer (Public + Private)** |
| **Mission** | Prove capability | **Prove + Accelerate Growth** |
| **Private Tools** | None | **Agent Manager, Workflows, Insights** |

**New Architecture:**

```
PUBLIC LAYER (Prove)
├── Profile Dashboard
├── Session Timeline
├── Product Showcase
└── Article Publishing

PRIVATE LAYER (Grow)
├── Agent Team Manager
├── Workflow Library
├── Growth Insights
└── Cross-Platform Sync
```

**New Features (Private Layer):**

| Priority | Feature | Purpose |
|----------|---------|---------|
| P1 | Agent Team Manager | Configure AI assistants, deploy cross-platform |
| P1 | Workflow Library | Reuse proven patterns |
| P2 | Growth Insights | Track improvement vs METR baseline |
| P2 | Cross-Platform Sync | Deploy configs to Claude Code, Cursor, Windsurf |

**Documents:**
- `docs/prd/Viblog_PRD_V3.4.md`

---

### 2026-03-20: Strategic Pivot - Capability Archive

#### docs: PRD V3.3 - Repositioned as Vibe Coder's Capability Archive

**Authority:** CAO Strategic Decision

**Problem Analysis:**
- Previous positioning (Knowledge Asset Platform) was too broad
- Canvas Editor over-engineered for core need
- Target user unclear (platform vs personal tool)
- No clear path to proving the product's value

**Strategic Pivot:**

| Dimension | V3.2 (Before) | V3.3 (After) |
|-----------|---------------|--------------|
| **Positioning** | Knowledge Asset Platform | **Capability Archive** |
| **Core Value** | Manage knowledge | **Prove capability** |
| **Target User** | Vibe Coders (broad) | **You** (and people like you) |
| **Key Metric** | User count | **Opportunities created** |
| **Business Model** | Subscription | **Open source, proof for yourself** |

**New Core Features (Simplified):**

| Priority | Feature | Purpose |
|----------|---------|---------|
| P0 | MCP Session Sync | Zero-effort recording |
| P0 | Efficiency Dashboard | Quantified capability |
| P0 | Public Profile | One-link proof |
| P0 | Session Timeline | Journey showcase |
| P1 | Product Showcase | Outcome display |
| P1 | Article Generation | Thought leadership |
| P2 | Verification Badge | Third-party trust |

**What Was Cut:**

| Removed Feature | Reason |
|-----------------|--------|
| Canvas Editor | Over-engineered, Markdown sufficient |
| Decision Graph | Not core to proving capability |
| Community Feed | Personal archive, not social platform |
| Subscription System | Open source, no need to charge |
| Dual-Layer Publishing | Simplified to single output |

**New Success Metrics:**
- Active Users: 1 (you) - First user is the target
- Sessions Synced: 100+ - Proof of usage
- Profile Views: 50+ - Proof of value
- Opportunities: 1+ - Job/project/investment interest

**Core Insight:**
> Viblog doesn't need to make money. Viblog IS your proof of capability. The capability you prove WITH Viblog makes money (job, consulting, investment).

**Documents:**
- `docs/prd/Viblog_PRD_V3.3.md`

---

### 2026-03-20: AI-Native Data Architecture

#### docs: PRD V3.2 - OpenAI Format Alignment

**Authority:** CAO Architecture Decision

**Problem Analysis:**
- Session data used custom format, lacking interoperability
- `reasoning` blocks (critical for Decision Graph) not captured
- Token tracking for ROI not supported
- No alignment with industry format convergence

**PRD V3.2 Key Changes:**

| Feature | Change |
|---------|--------|
| Problem Decomposition | Added "Format Lock-in" gap |
| AI-Native Definition | Added "OpenAI-Aligned" as 7th pillar |
| Feature Matrix | Added "OpenAI Format Storage" as P0 |
| Core Loop | Added "Reasoning Block Extraction" step |
| Data Model | Complete OpenAI-aligned Session Fragment schema |
| New Section | "AI Session Format Standardization" |
| ROI Metrics | Token tracking, cache efficiency, cost awareness |

**OpenAI Content Block Types:**

| Type | Purpose | Decision Graph Role |
|------|---------|---------------------|
| `text` | Standard messages | Context, prompts |
| `reasoning` | Thinking content | **PRIMARY for decisions** |
| `tool_call` | MCP invocations | Code operations |
| `tool_output` | Execution results | Implementation details |
| `code` | Code snippets | Code node generation |

**Documents:**
- `docs/prd/Viblog_PRD_V3.2.md` - Updated PRD with OpenAI format

---

#### docs: ADR-005 - Session Fragment OpenAI Format Alignment

**Authority:** CAO Architecture Decision

**Status:** Proposed

**Decision:**
Adopt OpenAI-compatible message format for `session_fragment` storage.

**Schema:**
```typescript
interface SessionFragment {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'tool' | 'developer' | 'system';
  content: ContentBlock[];
  tool_calls?: ToolCall[];
  metadata: {
    timestamp: string;
    message_id?: string;
    tokens?: TokenCount;
  };
  created_at: string;
}

type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string }
  | { type: 'tool_call'; tool_call_id: string; name: string; arguments: string }
  | { type: 'tool_output'; text: string; metadata?: Record<string, any> }
  | { type: 'code'; language: string; code: string; file_path?: string };
```

**Benefits:**
- Interoperability with AI ecosystem
- Reasoning preservation for Decision Graph
- Token tracking for ROI analytics
- Future-proof aligned with industry trend
- Multi-source support (Claude, Cursor, Windsurf)

**Source Format Mapping:**

| Source | Reasoning Type | Converges To |
|--------|---------------|--------------|
| Claude | `thinking` block | `reasoning` |
| Codex | `agent_reasoning` | `reasoning` |
| Gemini | `thoughts` array | `reasoning` |
| OpenCode | `reasoning` part | `reasoning` |

**Documents:**
- `docs/architecture/ADR-005-Session-Fragment-OpenAI-Format.md`

**References:**
- `convert_ai_session.py` v1.3.0 - Industry format analysis source

---

### 2026-03-20: Parallel Development Architecture

#### docs: Establish Parallel Development Protocol

**Authority:** CAO Architecture Decision

**Problem Analysis:**
- BACKEND and FRONTEND need independent progress
- Worktree development causes merge conflicts on shared files
- Cross-team issues need systematic resolution
- Information silos reduce collaboration efficiency

**New Documents Created:**

| Document | Purpose |
|----------|---------|
| `docs/PARALLEL_DEVELOPMENT_PROTOCOL.md` | Worktree coordination rules |
| `docs/INTERFACE_CONTRACT.md` | API/Data contracts between teams |
| `docs/DECISION_LOG.md` | CAO rulings and shared decisions |
| `docs/issues/SHARED_ISSUES.md` | Cross-team issue tracking |
| `docs/issues/BACKEND_ISSUES.md` | Backend-specific issues |
| `docs/issues/FRONTEND_ISSUES.md` | Frontend-specific issues |
| `docs/dev-logs/BACKEND_DEVLOG.md` | Backend development progress |
| `docs/dev-logs/FRONTEND_DEVLOG.md` | Frontend development progress |

**Key Mechanisms:**

1. **Sync Protocol:**
   - Session start: Fetch origin, check status, decisions, shared issues
   - Checkpoint sync: Update local + shared files, push, check counterpart

2. **Cross-Team Impact Detection:**
   - Before commit, check if change affects:
     - API contracts → Update INTERFACE_CONTRACT
     - Shared types → Notify via DECISION_LOG
     - Database schema → Create SHARED_ISSUE
     - User flow → Check counterpart DEVLOG

3. **Conflict Resolution:**
   ```
   DISCOVER → SHARED_ISSUES.md → INVOKE CAO
       → DECISION_LOG.md → Both teams acknowledge
   ```

4. **Interface-First Development:**
   - Define interface → Both teams review → Implement → Verify

**Core Principle:**
> Break silos. Proactive sync, not reactive fire-fighting.

---

### 2026-03-20: Process Improvement - Issue Discovery Protocol

#### docs: Establish Issue Discovery Protocol and enhance agent responsibilities

**Authority:** CAO Process Decision

**Problem Analysis:**
- Code tests passing ≠ Feature working correctly
- Issue discovery was reactive, not systematic
- No mandatory scenario testing workflow

**Changes:**

**CAO (v2.1):**
- Added: Scenario Verification Authority
- Added: Post-Implementation verification checklist
- Added: Issue Discovery Protocol

**CTO (v2.1):**
- Added: Scenario Coverage as 11th metric
- Changed: 10 metrics → 11 metrics (9 points each, 99 total)
- Added: Scenario Testing Protocol
- Added: Issue Discovery Protocol

**CUIO (v2.1):**
- Added: Real-World Interaction Verification as second responsibility
- Added: Real-World Scenario Testing as 16th metric
- Changed: 15 metrics → 16 metrics (9 points each, 144 total)
- Added: Interaction Testing Checklist (mandatory before UI approval)
- Added: Issue Discovery Protocol for UI
- Added: Common UI Issue Patterns to Audit

**CLAUDE.md (v4.1):**
- Added: Issue Discovery Protocol section
- Added: Issue Workflow diagram
- Updated: Quality Gates with 11 metrics
- Updated: Agent responsibilities

**Core Principle:**
> Every discovered issue is a growth opportunity. Document it.

---

### 2026-03-20: status/visibility Fix

#### fix(api): Correct status/visibility semantics in publish_article

**Issue:** ISSUE-003 - status/visibility semantic confusion

**Problem:**
API incorrectly mapped `visibility: private` to `status: draft`.
This conflated two independent concepts:
- `status` = workflow state (draft/published/archived)
- `visibility` = access control (public/private/unlisted)

**Resolution:**
`publish_article` now always sets `status: published`.
The `visibility` parameter only controls access.

**Before:**
```javascript
const status = visibility === 'public' ? 'published' : 'draft'
```

**After:**
```javascript
const status = 'published'  // publish_article always publishes
// visibility controls who can see it
```

---

### 2026-03-20: fragment_type Alignment Fix

#### fix(mcp): Align fragment_type with API validation

**Issue:** ISSUE-002 - MCP/API fragment_type mismatch

**Problem:**
MCP Server and API Endpoint had inconsistent `fragment_type` definitions, causing all MCP upload operations to fail.

**Resolution:**
Aligned MCP types with API validation using vibe-specific types:
- `user_prompt`, `ai_response`, `code_block`, `file_content`
- `command_output`, `error_log`, `system_message`, `external_link`

**Verification:**
Full MCP workflow test passed. Article published via MCP tools.

---

### 2026-03-20: publish_article MCP Tool

#### feat(mcp): Implement publish_article tool with visibility options

**Authority:** CAO Architecture Decision

**New Features:**
- `publish_article` MCP tool for publishing articles from vibe sessions
- Visibility options: `public`, `private`, `unlisted`
- Auto-converts Markdown to HTML
- Generates URL-friendly slugs
- Updates session status on publish

**API Endpoint:**
- `POST /api/vibe-sessions/publish-article`

**MCP Tools Status (7/7 Complete):**
| Layer | Tool | Status |
|-------|------|--------|
| 1 | create_vibe_session | Implemented |
| 1 | append_session_context | Implemented |
| 1 | upload_session_context | Implemented |
| 2 | generate_structured_context | Implemented |
| 3 | generate_article_draft | Implemented |
| 4 | list_user_sessions | Implemented |
| 4 | publish_article | **NEW** |

**Tests:** 203 passing (8 test files)

---

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