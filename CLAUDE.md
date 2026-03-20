## Project Overview

**Viblog** - An AI-Native Blogging Platform for Vibe Coders.

**Mission:** Make Viblog the #1 AI-Native Blog Platform globally.

**Core Values:**
- Record - Capture the authentic vibe coding context
- Share - Transform experiences into beautiful content
- Grow - Build a personal knowledge base

---

## Agent Team Architecture

### Simplified Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│   VIBLOG AGENT TEAM                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   EXECUTIVE LAYER (Strategic)                                   │
│   ===========================                                   │
│   CAO - Chief Architect Officer                                 │
│   ├── Final architecture authority                              │
│   ├── Challenge Before Implement                                │
│   └── ADR creation                                              │
│                                                                 │
│   CTO - Chief Technology Officer                                │
│   ├── Implementation quality gate                               │
│   ├── 11 Technical Metrics (including scenario testing)         │
│   └── Merge approval/rejection                                  │
│                                                                 │
│   CUIO - Chief UI Officer                                       │
│   ├── Visual excellence gate                                    │
│   ├── Real-World Interaction Verification                       │
│   ├── 16 Design Metrics (including scenario testing)            │
│   └── Production design approval                                │
│                                                                 │
│   SPECIALIST LAYER                                              │
│   ===============                                               │
│   architect - System design & ADRs                              │
│   planner - Implementation planning                             │
│   code-reviewer - Code quality analysis                         │
│   security-reviewer - Security audit                            │
│   database-reviewer - Query/index analysis                      │
│   tdd-guide - Test-driven development                           │
│   e2e-runner - End-to-end testing                               │
│                                                                 │
│   PUBLISHER LAYER                                               │
│   ===============                                               │
│   develop-reviewer - Engineering documentation                  │
│   design-reviewer - Design documentation                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Agent Quick Reference

| Agent | Purpose | Trigger |
|-------|---------|---------|
| CAO | Architecture decisions + Scenario verification | Before major changes, After implementation |
| CTO | Quality gate (11 metrics) + Scenario testing | Before merge, After feature completion |
| CUIO | Design gate (16 metrics) + Real-world interaction testing | After UI changes, before production |
| architect | System design | When detailed design needed |
| planner | Task breakdown | Before implementation |
| code-reviewer | Code quality | Via CTO |
| security-reviewer | Security audit | Via CTO or for auth/data features |
| database-reviewer | DB optimization | SQL/migrations |
| tdd-guide | TDD workflow | Writing features |
| e2e-runner | E2E testing | Browser-interactive features |
| develop-reviewer | Engineering docs | After step completion |
| design-reviewer | Design docs | After UI changes |

---

## Simple Workflows

### Before Implementation

```
User Request
    │
    ├─ Is this an architectural decision?
    │   └─ YES → Invoke CAO → Challenge/Evaluate → ADR
    │
    └─ NO → Proceed with implementation
```

### After Implementation

```
Code Complete
    │
    ├─ Commit to git
    │
    ├─ develop-reviewer (engineering docs)
    │   └─ Document technical implementation
    │
    └─ design-reviewer (if UI changed)
        └─ Document design analysis
```

### Before Merge

```
PR Ready
    │
    ├─ CTO Review (11 metrics including scenario testing)
    │   ├─ Grade A → APPROVE merge
    │   ├─ Grade B → Fix P0, then approve
    │   └─ Grade C/D → REJECT, rework
    │
    └─ CUIO Review (if UI changed)
        ├─ Grade A → APPROVE
        └─ Grade C/D → BLOCK, document debt
```

---

## Issue Discovery Protocol

**Core Principle:** Every discovered issue is a growth opportunity. Document it.

### Issue Workflow

```
DISCOVER → RECORD → ANALYZE → AUDIT → FIX → VERIFY → DOCUMENT
              │                          │
              ▼                          ▼
        ISSUE_LOG.md              CHANGELOG.md
```

### When Issue Discovered

1. **Record** → Add to `docs/ISSUE_LOG.md` immediately
2. **Analyze** → Find root cause
3. **Audit** → Check similar code for same issue (CRITICAL)
4. **Fix** → Implement solution
5. **Verify** → Test in real usage scenario
6. **Document** → Update CHANGELOG.md, ADRs if needed

### Issue Log Format

```markdown
| ID | Issue | Root Cause | Resolution | Time | Reference |
|----|-------|------------|------------|------|-----------|
| ISSUE-XXX | Brief description | Why it happened | How fixed | Time spent | File paths |
```

### Critical Mindset

When fixing any issue, ask:

1. **Is this issue isolated?** → Check similar code patterns
2. **What assumptions were wrong?** → Document in ISSUE_LOG
3. **How do we prevent this?** → Update tests, add validation

**Example:** ISSUE-002 fragment_type mismatch
- Found in upload_session_context
- Audited: Also affected append_session_context
- Fixed both, updated all tests

---

## Quality Gates

### Technical Quality Gate (CTO)

| Score | Grade | Action |
|-------|-------|--------|
| 90-99 | S | Reference implementation |
| 80-89 | A | **APPROVE** merge |
| 70-79 | B | Fix P0 first |
| 60-69 | C | **REJECT** rework |
| <60 | D/F | **REJECT** redesign |

**11 Metrics (9 points each):**
1. Architecture Alignment
2. Code Quality
3. Performance Impact
4. Security Posture
5. Test Coverage (>=80%)
6. Error Handling
7. Maintainability
8. Scalability
9. Documentation
10. Technical Debt
11. **Scenario Coverage** (Real-world usage tested)

### Design Quality Gate (CUIO)

| Score | Grade | Action |
|-------|-------|--------|
| 130-144 | S | Award-worthy |
| 110-129 | A | **APPROVE** production |
| 90-109 | B | Publish with P0 documented |
| 70-89 | C | **BLOCK**, document debt |
| <70 | D/F | **BLOCK**, redesign |

**16 Metrics (9 points each):**
1. Visual Hierarchy
2. Balance & Layout
3. Typography
4. Color Harmony
5. Spacing System
6. Component Design
7. Micro-interactions
8. Responsive Design
9. Premium Feel
10. Brand Identity
11. Design System Compliance
12. UI Architecture
13. UX Flow Clarity
14. AI-Native UX
15. Design Debt Control
16. **Real-World Scenario Testing** (Actual browser interaction tested)

---

## Documentation

### Required Reading (Every Session)

| Order | Document | Purpose |
|-------|----------|---------|
| 1 | DOC_CATALOG.md | Navigation hub |
| 2 | IMPLEMENTING_STATUS.md | Task state machine |
| 3 | CHANGELOG.md | Latest changes |

### Architecture Decisions (ADRs)

Location: `docs/architecture/ADR-XXX.md`

| ADR | Topic |
|-----|-------|
| ADR-001 | Database Multi-Tenant Isolation |
| ADR-002 | Business Model & Data Access |
| ADR-003 | MCP Layer 5 Commercial Architecture |
| ADR-004 | Agent Team Architecture Redesign |

### Implementation Plans

| Plan | Focus |
|------|-------|
| plans/BACKEND_IMPLEMENTATION_PLAN.md | Backend tasks |
| plans/FRONTEND_IMPLEMENTATION_PLAN.md | Frontend tasks |

---

## Critical Rules

### Code Organization

- Many small files over few large files
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### Code Style

- No emojis in code or documentation
- Immutability always - never mutate objects
- No console.log in production code
- Proper error handling with try/catch

### Testing

- TDD: Write tests first
- 80% minimum coverage
- E2E tests for browser-interactive features

### Security

- No hardcoded secrets
- Validate all user inputs
- Parameterized queries only

### Challenge Before Implement

**Core Principle:** "你负责边界和验收，AI负责提需求"

Before implementing ANY architectural decision:
1. Ask "Why?" - What problem are we solving?
2. Ask "What else?" - What alternatives exist?
3. Ask "What if?" - What are the implications?

**Never just implement what's asked. Always evaluate and challenge.**

---

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require Grade A technical review
- All tests must pass before merge

---

## Model Capabilities (CRITICAL)

| Model | Vision? | Note |
|-------|---------|------|
| glm-5 | NO | TEXT-ONLY - Never use for images |
| kimi-k2.5 | YES | Use via `image-analyzer-kimi` skill |
| qwen3.5-plus | YES | Use via `image-analyzer-qwen` skill |

---

**Document Version:** 4.1
**Last Updated:** 2026-03-20
**Mission:** Make Viblog the #1 AI-Native Blog Platform globally