# Backend Issue Log

> **Version:** 1.0
> **Updated:** 2026-03-20
> **Team:** Backend
> **Focus:** API, Database, MCP Service, Authentication

---

## Active Issues

| ID | Issue | Impact | Status | Owner | Since |
|----|-------|--------|--------|-------|-------|
| - | - | - | - | - | - |

---

## Resolved Issues

| ID | Issue | Root Cause | Resolution | Time | Reference |
|----|-------|------------|------------|------|-----------|
| ISSUE-003 | status/visibility semantic confusion | API mapped visibility to status | publish_article always sets status=published | 10 min | src/app/api/vibe-sessions/publish-article/route.ts |
| ISSUE-002 | MCP/API fragment_type mismatch | MCP used generic types | Aligned MCP types with API validation | 45 min | packages/viblog-mcp-server/src/types.ts |

---

## Issue Detail

(Reserved for detailed issue analysis)

---

## Categories

- **API** - Endpoint issues, request/response format
- **Database** - Schema, migrations, RLS policies
- **MCP** - MCP protocol, session sync
- **Security** - Auth, authorization, data protection
- **Performance** - Query optimization, caching

---

**Workflow:** NEW → TRIAGE → IN_PROGRESS → RESOLVED → VERIFIED