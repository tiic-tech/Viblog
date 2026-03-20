# Shared Issues

> **Version:** 1.0
> **Updated:** 2026-03-20
> **Purpose:** Cross-team issues requiring coordination

---

## Active Shared Issues

| ID | Type | Title | Impact | Reporter | Status | Decision |
|----|------|-------|--------|----------|--------|----------|
| - | - | - | - | - | - | - |

---

## Resolved Shared Issues

| ID | Type | Title | Impact | Resolution | Decision |
|----|------|-------|--------|------------|----------|
| - | - | - | - | - | - |

---

## Issue Types

| Type | Description | Example |
|------|-------------|---------|
| API | Endpoint contract mismatch | Response format differs |
| Data | Shared type/schema conflict | User object missing field |
| Flow | User flow cross-team dependency | Auth flow requires both teams |
| Priority | Conflicting priorities | Both teams need same resource |
| Integration | Integration point issue | WebSocket connection format |

---

## Workflow

```
DISCOVER → REPORT in SHARED_ISSUES.md → ASSESS IMPACT
    │
    ├── Simple fix (one team)
    │   → Team fixes → Update INTERFACE_CONTRACT.md → RESOLVED
    │
    └── Requires CAO
        → Invoke CAO → Ruling in DECISION_LOG.md → Both teams implement
```

---

## Template for New Shared Issue

```markdown
## SHARED-XXX: [Title]

**Discovered:** YYYY-MM-DD
**Reporter:** Backend / Frontend
**Impact:** Backend / Frontend / Both
**Blocking:** Yes / No

**Problem:**
[Description of the conflict]

**Backend Perspective:**
[How it affects backend, what backend needs]

**Frontend Perspective:**
[How it affects frontend, what frontend needs]

**Proposed Resolution:**
[Suggested solution]

**Decision:** See DEC-XXX (if CAO invoked)
```

---

**Document Version:** 1.0