## Project Overview

**Viblog** - An AI-Native Blogging Platform for Vibe Coders.

**Mission:** Make Viblog the #1 AI-Native Blog Platform globally.

**Core Values:**
- Record - Capture the authentic vibe coding context
- Share - Transform experiences into beautiful content
- Grow - Build a personal knowledge base

---

## Agent Team Architecture

### Executive Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                    VIBLOG EXECUTIVE TEAM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Chief Technology Officer      Chief UI Designer               │
│   ========================      ==================               │
│                                                                 │
│   10 Technical Metrics          10 Design Metrics               │
│   ├── Architecture Alignment    ├── Visual Hierarchy            │
│   ├── Code Quality              ├── Balance & Layout            │
│   ├── Performance Impact        ├── Typography                  │
│   ├── Security Posture          ├── Color Harmony               │
│   ├── Test Coverage             ├── Spacing System              │
│   ├── Error Handling            ├── Component Design            │
│   ├── Maintainability           ├── Micro-interactions          │
│   ├── Scalability               ├── Responsive Design           │
│   ├── Documentation             ├── Brand Identity              │
│   └── Technical Debt            └── Premium Feel                │
│                                                                 │
│   Target: Grade A (80+)         Target: Grade A (80+)           │
│   Grade C or below = BLOCK      Grade C or below = BLOCK        │
│                                                                 │
│   Sub-Agents:                                                   │
│   ├── code-reviewer                                             │
│   ├── security-reviewer                                         │
│   ├── database-reviewer                                         │
│   └── architect                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Full Agent Roster

| Agent | Role | Level | Focus |
|-------|------|-------|-------|
| `chief-technology-officer` | Technical Executive | Executive | System quality, architecture |
| `chief-ui-designer` | Design Executive | Executive | Visual quality, aesthetics |
| `develop_reviewer` | Engineering Publisher | Independent | Tech blog, functional testing |
| `design_reviewer` | Design Publisher | Independent | Design blog, UI analysis |
| `planner` | Implementation Planner | Engineer | Task breakdown, dependencies |
| `architect` | System Architect | Architect | Architecture decisions |
| `code-reviewer` | Code Quality Specialist | Specialist | PEP8, idioms, patterns |
| `security-reviewer` | Security Specialist | Specialist | OWASP, secrets, injection |
| `database-reviewer` | Database Specialist | Specialist | Queries, indexes, RLS |
| `tdd-guide` | Test-Driven Development | Engineer | 80%+ coverage |
| `e2e-runner` | E2E Testing | Engineer | Playwright tests |

---

## Dual-Track Development

### Backend/Frontend Split

Every Phase/Step is split into TWO independent tracks:

```
┌─────────────────────────────────────────────────────────────────┐
│   DUAL-TRACK PLANNING                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   BACKEND TRACK                 FRONTEND TRACK                  │
│   =============                ================                 │
│   - Database schema            - UI components                  │
│   - API endpoints              - Page layouts                   │
│   - Server logic               - Client state                   │
│   - Migrations                 - Styling                        │
│   - Tests (API/Unit)           - Tests (E2E)                    │
│                                                                 │
│   Independent execution         Independent execution           │
│   Can be parallelized           Can be parallelized             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Parallel Development with Git Worktrees

```
┌─────────────────────────────────────────────────────────────────┐
│   PARALLEL DEVELOPMENT WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Main Repository                                               │
│   ├── branch: feature/phaseX-backend                           │
│   │   └── worktree: .claude/worktrees/backend/                 │
│   │       └── Agent: backend-developer                         │
│   │                                                            │
│   └── branch: feature/phaseX-frontend                          │
│       └── worktree: .claude/worktrees/frontend/                │
│           └── Agent: frontend-developer                        │
│                                                                 │
│   Benefits:                                                     │
│   - No context switching between backend/frontend              │
│   - True parallel development                                  │
│   - Isolated testing environments                              │
│   - Independent commit histories                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Worktree Commands

```bash
# Create backend worktree
git worktree add .claude/worktrees/backend -b feature/phase10-backend

# Create frontend worktree
git worktree add .claude/worktrees/frontend -b feature/phase10-frontend

# List worktrees
git worktree list

# Remove after merge
git worktree remove .claude/worktrees/backend
git worktree remove .claude/worktrees/frontend
```

---

## Quality Gates

### Technical Review Gate (CTO)

```
┌─────────────────────────────────────────────────────────────────┐
│   TECHNICAL QUALITY GATE                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Grade A (80-89):  APPROVE merge                              │
│   Grade B (70-79):  CONDITIONAL (fix P0 issues first)          │
│   Grade C (60-69):  REJECT, substantial rework needed          │
│   Grade D/F (<60):  REJECT, redesign required                   │
│                                                                 │
│   P0 issues BLOCK merge regardless of score                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Design Review Gate (Chief UI Designer)

```
┌─────────────────────────────────────────────────────────────────┐
│   DESIGN QUALITY GATE                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Grade A (80-89):  APPROVE for production                     │
│   Grade B (70-79):  Publish with P0 documented                 │
│   Grade C (60-69):  Block, document as design debt             │
│   Grade D/F (<60):  Block, needs redesign                       │
│                                                                 │
│   Target: Grade A for every page                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Independent Blog Publishing

### develop_reviewer → Engineering Blog

**Focus:** Technical implementation
**Output:** `[Step X.Y] Feature - Development Log`

**Content Structure:**
```markdown
## Engineering Development Record
- What I Built
- Technical Approach
- Key Files Changed
- Challenges & Solutions
- Functional Testing Results
```

### design_reviewer → Design Blog

**Focus:** UI/UX analysis
**Output:** `[Page/Feature] - Design Review`

**Content Structure:**
```markdown
## Design Review
- Overall Score (XX/100, Grade X)
- 10 Metrics Score Breakdown
- P0/P1/P2 Issues
- Specific CSS Fixes
- Competitive Comparison
```

### Parallel Publishing Workflow

```
Step Completed
    │
    ├── develop_reviewer (PARALLEL)
    │   ├── Gathers git context
    │   ├── Documents engineering analysis
    │   └── Publishes: "Step X.Y - Development Log"
    │
    └── design_reviewer (PARALLEL)
        ├── Captures screenshots
        ├── Invokes chief-ui-designer
        └── Publishes: "Page - Design Review"

BOTH run independently and concurrently
```

---

## Documentation

### Required Reading (Every Session)

| Document | Purpose | Order |
|----------|---------|-------|
| `DEVELOPLOG.md` | Project history, lessons, bad cases | **1 - First** |
| `CHANGELOG.md` | Latest changes, current status | **2 - Second** |
| `IMPLEMENTATION_PLAN.md` | Current tasks, next steps | **3 - Third** |

### On-Demand Reading

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `PRD.md` | Product positioning, user stories | Product decisions |
| `PRODUCT_COMP_ANALYSIS.md` | Competitive analysis | Differentiation design |
| `TECH_STACK.md` | Technology choices | Technical details |
| `FRONTEND_GUIDELINES.md` | Visual design, components | UI work |
| `BACKEND_STRUCTURE.md` | Database, APIs | Backend work |
| `APP_FLOW.md` | Page structure, user flows | User journey |

---

## Session Startup Checklist

### 1. Document Navigation Scan (MANDATORY)

```bash
head -15 DEVELOPLOG.md CHANGELOG.md IMPLEMENTATION_PLAN.md
```

### 2. Deep Reading (Based on Task)

| Task Type | Read These |
|-----------|------------|
| Project status | DEVELOPLOG → CHANGELOG → IMPLEMENTATION_PLAN |
| Feature development | PRD + relevant technical docs |
| Competitive analysis | PRODUCT_COMP_ANALYSIS → PRD |
| Frontend work | FRONTEND_GUIDELINES → APP_FLOW |
| Backend work | BACKEND_STRUCTURE → TECH_STACK |

### 3. Environment Verification

- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Database connected

---

## Critical Rules

### 1. Code Organization

- Many small files over few large files
- High cohesion, low coupling
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### 2. Code Style

- No emojis in code, comments, or documentation
- Immutability always - never mutate objects or arrays
- No console.log in production code
- Proper error handling with try/catch
- Input validation with Zod or similar

### 3. Testing

- TDD: Write tests first
- 80% minimum coverage
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows
- **MANDATORY E2E for browser-interactive features:**
  - Text selection/annotation (race conditions)
  - Rich text editor (SSR hydration)
  - Drag/resize interactions (real events)
  - SSR-dependent components (hydration mismatch)

### 4. Security

- No hardcoded secrets
- Environment variables for sensitive data
- Validate all user inputs
- Parameterized queries only
- CSRF protection enabled

### 5. Quality Gates

- Technical review: Grade A required for merge
- Design review: Grade A target for every page
- P0 issues block merge/publish

---

## Agent Invocation Rules

### Mandatory Agent Usage

| Scenario | Agent | Trigger |
|----------|-------|---------|
| Complex feature planning | `planner` | Before implementation |
| Step completion | `develop_reviewer` | After git commit |
| UI/UX analysis | `design_reviewer` | After frontend changes |
| Technical review | `chief-technology-officer` | Before merge |
| Design critique | `chief-ui-designer` | Via design_reviewer |
| Code quality | `code-reviewer` | Via CTO |
| Security audit | `security-reviewer` | Via CTO |
| Database optimization | `database-reviewer` | SQL/migrations |
| TDD development | `tdd-guide` | When writing features |
| Competitive analysis | `competitive-analyzer` | Analyzing competitors |
| Browser-interactive features | `e2e-runner` | Text selection, editors, drag/resize, SSR |

### Proactive Agent Invocation

**After Step completion, invoke in parallel:**

```
1. develop_reviewer → Engineering blog
2. design_reviewer → Design blog
3. chief-technology-officer → Technical review (optional, for major changes)
```

### E2E Verification Workflow

**MANDATORY for these feature categories:**

| Feature | E2E Test File | Reason |
|---------|---------------|--------|
| Text Selection/Annotation | `e2e/annotations.spec.ts` | Browser clears selection on mousedown |
| Rich Text Editor (Tiptap) | `e2e/editor.spec.ts` | SSR hydration, real DOM |
| Drag/Resize Interactions | Feature-specific | Real mouse events |
| SSR-Dependent Components | Feature-specific | Hydration mismatch |

**Workflow:**

```
Unit Tests Pass
       │
       ▼
Browser-Interactive? ── NO ──► COMPLETE
       │
       YES
       │
       ▼
e2e-runner Agent ──── FAIL ──► Fix Browser Behavior
       │
       PASS
       │
       ▼
COMPLETE
```

---

## Step Completion Workflow

### Standard Flow

```
Complete Step
    │
    ├── Update CHANGELOG.md
    ├── Commit to Git
    │
    ├── develop_reviewer (PARALLEL)
    │   └── Publish Engineering Blog
    │
    ├── design_reviewer (PARALLEL)
    │   └── Publish Design Blog
    │
    └── Update IMPLEMENTATION_PLAN.md
```

### Quality Gate Enforcement

```
Before Merge:
├── Technical Review (CTO)
│   └── Grade A required, or fix P0 issues
│
└── Design Review (Chief UI Designer)
    └── Grade A target, or document P0 issues
```

---

## Model Capabilities (CRITICAL)

| Model | Vision? | CRITICAL NOTE |
|-------|---------|---------------|
| **glm-5** | ❌ **NO** | TEXT-ONLY - NEVER use for images |
| **kimi-k2.5** | ✅ YES | Use via `image-analyzer-kimi` skill |
| **qwen3.5-plus** | ✅ YES | Use via `image-analyzer-qwen` skill |

```
┌─────────────────────────────────────────────────────────────────┐
│   ⚠️ NEVER use glm-5 for visual analysis ⚠️                    │
│   glm-5 is TEXT-ONLY - will cause input errors and rollbacks   │
│   ✅ ALWAYS use image-analyzer-kimi or image-analyzer-qwen     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Visual Analysis Workflow

### Sequential Batch Processing (MANDATORY)

```
┌─────────────────────────────────────────────────────────────────┐
│   FOR EACH screenshot (ONE AT A TIME):                          │
│                                                                 │
│   1. Invoke image-analyzer-kimi skill with ONE screenshot       │
│   2. Receive visual analysis result                             │
│   3. SAVE result to tmp file immediately                        │
│   4. Clear context before next image                            │
│   5. Repeat for next screenshot                                 │
│                                                                 │
│   ❌ NEVER process multiple images in parallel                   │
│   ❌ NEVER accumulate outputs in single context                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Context Management

### Token Thresholds

| Model | Warning Threshold |
|-------|-------------------|
| glm-5 | ~59,000 tokens |
| MiniMax-M2.5 | ~90,000 tokens |
| qwen3.5-plus | ~59,000 tokens |

### Context Overflow Protocol

1. Update CHANGELOG.md with current state
2. Commit: `docs: context overflow - update CHANGELOG`
3. Execute `/strategic-compact`
4. Repeat if still approaching threshold
5. Notify user for `/clear` if needed

---

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require Grade A technical review
- All tests must pass before merge

---

## Session Checklist

### Start of Session
- [ ] Scan document headers: `head -15 *.md`
- [ ] Read DEVELOPLOG → CHANGELOG → IMPLEMENTATION_PLAN
- [ ] Verify environment variables

### During Development
- [ ] Use appropriate agents proactively
- [ ] Monitor context length
- [ ] Reference relevant documentation

### After Step Completion
- [ ] Update CHANGELOG.md
- [ ] Commit to Git
- [ ] Invoke develop_reviewer (engineering blog)
- [ ] Invoke design_reviewer (design blog)
- [ ] Update IMPLEMENTATION_PLAN.md

### After Phase Completion
- [ ] Update DEVELOPLOG.md
- [ ] Create PR and merge
- [ ] Strategic compact if needed

---

## Quick Reference

### 10 Technical Metrics (CTO)

1. Architecture Alignment
2. Code Quality
3. Performance Impact
4. Security Posture
5. Test Coverage
6. Error Handling
7. Maintainability
8. Scalability
9. Documentation
10. Technical Debt

### 10 Design Metrics (Chief UI Designer)

1. Visual Hierarchy
2. Balance & Layout
3. Typography
4. Color Harmony
5. Spacing System
6. Component Design
7. Micro-interactions
8. Responsive Design
9. Brand Identity
10. Premium Feel

### Grade Scale

| Score | Grade | Action |
|-------|-------|--------|
| 90-100 | S | Reference implementation |
| 80-89 | A | Approve merge/publish |
| 70-79 | B | Conditional (fix P0) |
| 60-69 | C | Reject, rework needed |
| <60 | D/F | Redesign required |

---

**Document Version:** 3.0
**Last Updated:** 2026-03-16
**Mission:** Make Viblog the #1 AI-Native Blog Platform globally