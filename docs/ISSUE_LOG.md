# ISSUE_LOG.md

> **Version:** 1.0
> **Updated:** 2026-03-19
> **Purpose:** Track issues, blockers, and resolutions

---

## Active Issues

| ID | Issue | Impact | Status | Owner | Since |
|----|-------|--------|--------|-------|-------|
| - | - | - | - | - | - |

---

## Resolved Issues

| ID | Issue | Root Cause | Resolution | Time to Resolve | Reference |
|----|-------|------------|------------|-----------------|-----------|
| - | - | - | - | - | - |

---

## Issue Categories

### Category: Database

Issues related to database schema, migrations, RLS policies.

### Category: API

Issues related to API endpoints, authentication, data access.

### Category: MCP Service

Issues related to MCP protocol, session sync, data sync.

### Category: Frontend

Issues related to UI components, routing, state management.

### Category: Security

Issues related to authentication, authorization, data protection.

### Category: Performance

Issues related to slow queries, load times, resource usage.

---

## Issue Workflow

```
NEW → TRIAGE → IN_PROGRESS → RESOLVED → VERIFIED
                                    │
                                    ▼
                              WONT_FIX
```

**State Definitions:**
- **NEW**: Issue just reported
- **TRIAGE**: Issue prioritized and assigned
- **IN_PROGRESS**: Active resolution work
- **RESOLVED**: Solution implemented
- **VERIFIED**: Solution tested and confirmed
- **WONT_FIX**: Issue acknowledged but not fixed

---

## How to Add an Issue

1. Add entry to Active Issues table
2. Assign unique ID (ISSUE-XXX)
3. Set status to NEW
4. Update IMPLEMENTING_STATUS.md if blocking a task

---

## How to Resolve an Issue

1. Update status to RESOLVED
2. Move to Resolved Issues table
3. Document root cause and resolution
4. Update IMPLEMENTING_STATUS.md to unblock tasks
5. Update relevant documentation

---

**Document Version:** 1.0
**Last Updated:** 2026-03-19