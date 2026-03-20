# Parallel Development Protocol

> **Version:** 1.0
> **Updated:** 2026-03-20
> **Purpose:** Enable efficient BACKEND/FRONTEND parallel development with clear coordination

---

## Core Principles

1. **Independent Progress** - Each worktree works autonomously
2. **Explicit Interfaces** - Clear API contracts between teams
3. **Proactive Sync** - Pull updates, don't wait for push
4. **Conflict Resolution** - CAO as final arbiter

---

## Document Architecture

### Split Documents (Worktree-Local)

| Document | Backend Worktree | Frontend Worktree |
|----------|------------------|-------------------|
| Implementation Plan | `plans/BACKEND_IMPLEMENTATION_PLAN.md` | `plans/FRONTEND_IMPLEMENTATION_PLAN.md` |
| Issue Log | `docs/issues/BACKEND_ISSUES.md` | `docs/issues/FRONTEND_ISSUES.md` |
| Dev Log | `docs/dev-logs/BACKEND_DEVLOG.md` | `docs/dev-logs/FRONTEND_DEVLOG.md` |

### Shared Documents (Synced via Git)

| Document | Purpose | Update Frequency |
|----------|---------|------------------|
| `IMPLEMENTING_STATUS.md` | Global checkpoint status | Every checkpoint |
| `docs/issues/SHARED_ISSUES.md` | Cross-team issues | When conflict detected |
| `docs/DECISION_LOG.md` | CAO rulings, shared decisions | When CAO invoked |
| `docs/INTERFACE_CONTRACT.md` | API/Data contracts | When interface changes |

---

## Sync Protocol

### Daily Sync (Session Start)

```
1. git fetch origin
2. Read IMPLEMENTING_STATUS.md (global view)
3. Read DECISION_LOG.md (new rulings)
4. Read SHARED_ISSUES.md (cross-team issues)
5. Check counterpart's DEVLOG for relevant updates
```

### Checkpoint Sync (Per Checkpoint)

```
1. Complete checkpoint
2. Update local files:
   - plans/[TEAM]_IMPLEMENTATION_PLAN.md
   - docs/issues/[TEAM]_ISSUES.md
   - docs/dev-logs/[TEAM]_DEVLOG.md
3. Update shared files:
   - IMPLEMENTING_STATUS.md (checkpoint status)
   - docs/INTERFACE_CONTRACT.md (if API changed)
4. Commit & push
5. Check for counterpart updates
```

### Cross-Team Impact Detection

Before committing, check:

```markdown
## Impact Checklist

□ Does my change affect API contracts?
  → Update INTERFACE_CONTRACT.md
  → Create SHARED_ISSUE if breaking change

□ Does my change affect shared types?
  → Update shared types
  → Notify via DECISION_LOG.md

□ Does my change affect database schema?
  → Update INTERFACE_CONTRACT.md
  → Create SHARED_ISSUE

□ Does my change affect user flow?
  → Check FRONTEND_DEVLOG.md for dependencies
  → Coordinate via SHARED_ISSUES.md
```

---

## Conflict Resolution Workflow

```
DISCOVER CONFLICT
       │
       ▼
RECORD IN SHARED_ISSUES.md
       │
       ├── Issue ID: SHARED-XXX
       ├── Type: API / Data / Flow / Priority
       ├── Impact: Backend / Frontend / Both
       └── Proposed Resolution: [Team's proposal]
       │
       ▼
INVOKE CAO (if unresolved)
       │
       ▼
CAO RULING → DECISION_LOG.md
       │
       ├── Decision ID: DEC-XXX
       ├── Related Issue: SHARED-XXX
       ├── Ruling: [CAO decision]
       ├── Rationale: [Why]
       └── Action Required: [Each team's tasks]
       │
       ▼
BOTH TEAMS ACKNOWLEDGE
       │
       ├── Update local IMPLEMENTATION_PLAN
       ├── Update local ISSUES
       └── Add ACK comment to DECISION_LOG
       │
       ▼
PROCEED
```

---

## SHARED_ISSUES.md Format

```markdown
| ID | Type | Title | Impact | Status | Decision |
|----|------|-------|--------|--------|----------|
| SHARED-001 | API | User auth response format | Both | RESOLVED | DEC-001 |
| SHARED-002 | Data | Article schema visibility field | Backend | OPEN | - |

## SHARED-001: User Auth Response Format

**Discovered:** 2026-03-20
**Reporter:** Frontend
**Impact:** Both teams

**Problem:**
Frontend expects `{ user, token }` but Backend returns `{ data: { user }, token }`.

**Proposed Resolution (Frontend):**
Backend should flatten response.

**CAO Ruling:** See DEC-001
```

---

## DECISION_LOG.md Format

```markdown
| ID | Date | Type | Related Issue | Status |
|----|------|------|---------------|--------|
| DEC-001 | 2026-03-20 | API | SHARED-001 | IMPLEMENTED |

## DEC-001: User Auth Response Format

**Context:**
Frontend and Backend had different expectations for auth response format.

**Ruling:**
Backend will flatten response to `{ user, token }`.

**Rationale:**
- Simpler for frontend consumption
- Follows existing patterns in codebase
- No breaking change (not yet deployed)

**Action Required:**
- [x] Backend: Update auth endpoint (owner: backend)
- [x] Frontend: Remove response unwrapping (owner: frontend)

**Acknowledged:**
- [x] Backend: @backend-team
- [x] Frontend: @frontend-team
```

---

## INTERFACE_CONTRACT.md Format

```markdown
# Interface Contract

> Last Updated: 2026-03-20
> Version: 1.0

## API Endpoints

### POST /api/auth/login

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": { "id": "string", "email": "string", ... },
  "token": "string"
}
```

**Last Changed:** DEC-001 (2026-03-20)

---

## Shared Types

### User

```typescript
interface User {
  id: string
  email: string
  name: string | null
  created_at: string
}
```
```

---

## Worktree Workflow

### Backend Worktree

```bash
# Create
git worktree add .claude/worktrees/backend -b develop/backend

# Work
cd .claude/worktrees/backend
# ... implement backend features ...

# Sync checkpoint
git add . && git commit -m "feat(backend): checkpoint X complete"
git push origin develop/backend

# Check frontend progress
cat IMPLEMENTING_STATUS.md
cat docs/issues/FRONTEND_ISSUES.md
```

### Frontend Worktree

```bash
# Create
git worktree add .claude/worktrees/frontend -b develop/frontend

# Work
cd .claude/worktrees/frontend
# ... implement frontend features ...

# Sync checkpoint
git add . && git commit -m "feat(frontend): checkpoint Y complete"
git push origin develop/frontend

# Check backend progress
cat IMPLEMENTING_STATUS.md
cat docs/issues/BACKEND_ISSUES.md
```

---

## Communication Templates

### Cross-Team Notification

When your change affects the other team:

```markdown
## Cross-Team Notification

**From:** Backend
**To:** Frontend
**Type:** API Change

**Summary:**
Auth endpoint response format changed.

**Details:**
See DEC-001 in DECISION_LOG.md

**Action Required:**
Frontend needs to update auth service.

**Deadline:** Before next deployment
```

### Conflict Report

```markdown
## Conflict Report

**ID:** SHARED-XXX
**Reporter:** Frontend
**Discovered:** 2026-03-20

**Description:**
Backend's user schema missing `avatar_url` field that frontend needs.

**Impact:**
- Frontend cannot display user avatars
- Affects: User profile page, comment authors

**Proposed Resolution:**
Backend adds `avatar_url` to user response.

**Blocking:** Yes - frontend feature blocked until resolved
```

---

## Prevention Mechanisms

### Interface-First Development

1. **Define Interface** → Update INTERFACE_CONTRACT.md
2. **Review by Both Teams** → Check shared docs
3. **Implement** → Both teams work to contract
4. **Verify** → Integration test

### Weekly Architecture Sync

```
1. Review SHARED_ISSUES.md (open issues)
2. Review DECISION_LOG.md (recent rulings)
3. Review INTERFACE_CONTRACT.md (proposed changes)
4. Align on priorities
5. Update IMPLEMENTING_STATUS.md
```

---

## Summary

| Mechanism | Purpose | Frequency |
|-----------|---------|-----------|
| IMPLEMENTING_STATUS.md | Global progress view | Every checkpoint |
| SHARED_ISSUES.md | Cross-team conflicts | When discovered |
| DECISION_LOG.md | CAO rulings | When CAO invoked |
| INTERFACE_CONTRACT.md | API/Data contracts | When interface changes |
| [TEAM]_DEVLOG.md | Team progress | Daily |
| Cross-Team Notification | Proactive communication | When affecting others |

---

**Document Version:** 1.0
**Authority:** CAO Architecture Decision