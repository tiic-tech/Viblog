# ISSUE_LOG.md

> **Version:** 1.2
> **Updated:** 2026-03-20
> **Status:** ARCHIVED - Replaced by team-specific issue logs
> **See Also:**
> - Backend issues: `docs/issues/BACKEND_ISSUES.md`
> - Frontend issues: `docs/issues/FRONTEND_ISSUES.md`
> - Cross-team issues: `docs/issues/SHARED_ISSUES.md`

---

## Archive Notice

This file is retained for historical reference. New issues should be recorded in:

| Team | Issue Log |
|------|-----------|
| Backend | `docs/issues/BACKEND_ISSUES.md` |
| Frontend | `docs/issues/FRONTEND_ISSUES.md` |
| Cross-team | `docs/issues/SHARED_ISSUES.md` |

---

## Active Issues

| ID | Issue | Impact | Status | Owner | Since |
|----|-------|--------|--------|-------|-------|
| - | - | - | - | - | - |

---

## Resolved Issues

| ID | Issue | Root Cause | Resolution | Time to Resolve | Reference |
|----|-------|------------|------------|-----------------|-----------|
| ISSUE-003 | status/visibility语义混淆 | API将visibility映射到status | publish_article始终设置status=published | 10 min | src/app/api/vibe-sessions/publish-article/route.ts |
| ISSUE-002 | MCP/API fragment_type mismatch | MCP Server used generic types, API used vibe-specific types | Aligned MCP types with API validation | 45 min | packages/viblog-mcp-server/src/types.ts, validation.ts |
| ISSUE-001 | MCP test type errors | SDK union types require narrowing | Added type guards and proper type assertions | 30 min | packages/viblog-mcp-server/src/tools/handlers.test.ts |

---

## Issue Detail

### ISSUE-002: MCP/API fragment_type Mismatch (RESOLVED)

**Discovered:** 2026-03-20 during MCP full workflow test

**Problem:**
MCP Server and API Endpoint had inconsistent `fragment_type` definitions.

**Resolution:**
Aligned MCP Server types with API validation. Updated:
- `packages/viblog-mcp-server/src/types.ts`
- `packages/viblog-mcp-server/src/validation.ts`
- `packages/viblog-mcp-server/src/tools/index.ts`
- All test files

**Final Fragment Types:**
- `user_prompt`, `ai_response`, `code_block`, `file_content`
- `command_output`, `error_log`, `system_message`, `external_link`

**Verification:**
Full MCP workflow test passed. Article published successfully.

### ISSUE-003: status/visibility Semantic Confusion (RESOLVED)

**Discovered:** 2026-03-20 during user verification

**Problem:**
API code incorrectly mapped `visibility` to `status`:
```javascript
// Wrong
const status = visibility === 'public' ? 'published' : 'draft'
```

This caused `visibility: private` articles to have `status: draft`.

**Correct Semantics:**
- `status` (draft/published/archived) = Workflow state
- `visibility` (public/private/unlisted) = Access control

**Resolution:**
`publish_article` always sets `status: published`. The `visibility` parameter only controls who can see the article.

---

## Development History

### 2026-03-20: publish_article MCP Tool Implementation

**Feature:** Add `publish_article` tool to MCP server

**Changes:**
- Added `PUBLISH_ARTICLE_TOOL` to tool definitions
- Added `publishArticle` handler in ToolHandler
- Added `publishArticle` method to API client
- Created `/api/vibe-sessions/publish-article` endpoint
- Supports visibility: `public`, `private`, `unlisted`

**Tests Added:**
- 3 new tests for publish_article in handlers.test.ts
- 2 new tests in tools/index.test.ts
- Total: 203 tests passing

**Files Modified:**
- `packages/viblog-mcp-server/src/types.ts`
- `packages/viblog-mcp-server/src/validation.ts`
- `packages/viblog-mcp-server/src/tools/index.ts`
- `packages/viblog-mcp-server/src/tools/handlers.ts`
- `packages/viblog-mcp-server/src/api/client.ts`
- `src/app/api/vibe-sessions/publish-article/route.ts` (new)

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