# Backend Issue Log

> **Version:** 1.1
> **Updated:** 2026-03-20
> **Team:** Backend
> **Focus:** API, Database, MCP Service, Authentication

---

## Active Issues

| ID | Issue | Impact | Status | Owner | Since |
|----|-------|--------|--------|-------|-------|
| (none) | - | - | - | - | - |

---

## Resolved Issues

| ID | Issue | Root Cause | Resolution | Time | Reference |
|----|-------|------------|------------|------|-----------|
| ISSUE-005 | upload_session_context MCP validation gap | FragmentInputSchema used `z.string()` instead of `FragmentTypeSchema`, allowing invalid fragment_type values to pass MCP validation and fail at API layer | Changed FragmentInputSchema to use FragmentTypeSchema for proper enum validation at MCP layer | 10 min | packages/viblog-mcp-server/src/validation.ts |
| ISSUE-004 | MCP fragment_type validation mismatch | VIBLOG_PUBLISH_GUIDANCE.md used incorrect fragment types ("conversation", "document") instead of valid API types | Updated guidance doc with correct types: user_prompt, ai_response, code_block, file_content, command_output, error_log, system_message, external_link | 20 min | docs/specifications/VIBLOG_PUBLISH_GUIDANCE.md |
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