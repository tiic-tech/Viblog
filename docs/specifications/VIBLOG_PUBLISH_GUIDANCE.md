# Viblog Publish Guidance

> **Version:** 2.0
> **Updated:** 2026-03-20
> **Purpose:** Guide for publishing articles to Viblog via MCP Service
> **Deployment:** viblog.tiic.tech

---

## Quick Start

**Before using any Viblog MCP tool, read this document.**

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG MCP PUBLISHING WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Step 1: create_vibe_session                                       │
│           ↓                                                         │
│   Step 2: upload_session_context (or append_session_context)        │
│           ↓                                                         │
│   Step 3: publish_article (OR generate_article_draft first)        │
│           ↓                                                         │
│   Result: Article published at viblog.tiic.tech/articles/{slug}    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## MCP Tools Overview

| Layer | Tool | Purpose | Required Parameters |
|-------|------|---------|---------------------|
| 1 | `create_vibe_session` | Create session container | (none required) |
| 1 | `append_session_context` | Add single fragment | `session_id`, `fragment_type`, `content` |
| 1 | `upload_session_context` | Batch upload fragments | `session_id`, `fragments[]` |
| 2 | `generate_structured_context` | Extract structured data | `session_id` |
| 3 | `generate_article_draft` | Generate article via LLM | `session_id` |
| 4 | `list_user_sessions` | List user's sessions | (none required) |
| 4 | `publish_article` | Publish article directly | `session_id`, `title`, `content` |

---

## CRITICAL: Fragment Types

**These are the ONLY valid fragment_type values:**

| Type | Use Case | Example |
|------|----------|---------|
| `user_prompt` | User's input/question | "Help me debug this function..." |
| `ai_response` | AI's response | "The issue is in line 42..." |
| `code_block` | Code examples | `function foo() { ... }` |
| `file_content` | File contents/debug output | Configuration files, logs |
| `command_output` | Shell command results | `npm test` output |
| `error_log` | Error messages | Stack traces, error logs |
| `system_message` | System notifications | Tool invocations, status |
| `external_link` | External references | URLs, documentation links |

**INVALID types (do NOT use):**
- ❌ `conversation` - Not a valid type
- ❌ `document` - Not a valid type
- ❌ `insight` - Not a valid type
- ❌ `code_snippet` - Use `code_block` instead
- ❌ `file_change` - Use `file_content` instead

---

## Step-by-Step Workflow

### Step 1: Create Session

```typescript
// MCP Tool: create_vibe_session
// Returns: { session_id: "uuid", ... }

// Example call:
{
  title: "Viblog Ecosystem Positioning",
  platform: "claude-code",
  model: "glm-5"
}

// Response:
{
  "success": true,
  "session_id": "22b6ffa8-3d23-4ec7-84d2-5bf669d30f0d",
  "session": { ... }
}
```

**Save the `session_id` for all subsequent operations.**

---

### Step 2: Upload Context

**Option A: Batch Upload (Recommended)**

```typescript
// MCP Tool: upload_session_context
{
  session_id: "22b6ffa8-3d23-4ec7-84d2-5bf669d30f0d",
  fragments: [
    {
      fragment_type: "user_prompt",  // MUST be one of the 8 valid types
      content: "User asked about ecosystem positioning...",
      sequence_number: 1
    },
    {
      fragment_type: "ai_response",  // NOT "conversation" or "document"
      content: "Analysis of Claude Code vs OpenClaw vs Viblog...",
      sequence_number: 2
    },
    {
      fragment_type: "code_block",
      content: "const x = 1;",
      sequence_number: 3
    }
  ]
}
```

**Option B: Incremental Append**

```typescript
// MCP Tool: append_session_context
{
  session_id: "22b6ffa8-3d23-4ec7-84d2-5bf669d30f0d",
  fragment_type: "ai_response",  // Single valid type
  content: "The response content...",
  sequence_number: 1
}
```

---

### Step 3: Publish Article

**Option A: Direct Publish (Fastest)**

```typescript
// MCP Tool: publish_article
// Required: session_id, title, content
{
  session_id: "22b6ffa8-3d23-4ec7-84d2-5bf669d30f0d",
  title: "Deep Research: Viblog Analysis",
  content: "# Article content in Markdown\n\n...",
  excerpt: "Short description for preview",
  visibility: "public"  // "public", "private", or "unlisted"
}

// Response:
{
  "success": true,
  "article": {
    "id": "333a2166-6f40-4f2f-9f87-470625d3fe87",
    "title": "Deep Research: Viblog Analysis",
    "slug": "deep-research-viblog-mmyidxzm",
    "status": "published",
    "visibility": "public",
    "url": "https://viblog.tiic.tech/articles/deep-research-viblog-mmyidxzm"
  }
}
```

**Option B: Generate Draft First**

```typescript
// MCP Tool: generate_article_draft
// NOTE: Requires LLM API key configured on server
{
  session_id: "22b6ffa8-3d23-4ec7-84d2-5bf669d30f0d",
  article_style: "deep_dive",      // tutorial, case_study, tips, deep_dive, quick_note
  tone: "professional",             // casual, professional, educational
  target_audience: "intermediate"   // beginner, intermediate, advanced
}

// Response: { article_draft: { title, excerpt, markdown, metadata } }
// Then use publish_article with the generated content
```

**Important:** `generate_article_draft` requires an LLM API key configured on the server. If it fails with "No LLM API key configured", use Option A (direct publish) instead.

---

## Common Errors & Solutions

### Error: "Invalid enum value. Expected 'user_prompt' | 'ai_response' | ..."

**Cause:** Using invalid fragment_type value.

**Solution:** Use only the 8 valid types listed above.

```typescript
// WRONG:
fragment_type: "document"    // ❌ Invalid
fragment_type: "conversation" // ❌ Invalid
fragment_type: "insight"     // ❌ Invalid

// CORRECT:
fragment_type: "ai_response" // ✅ Valid
fragment_type: "user_prompt" // ✅ Valid
fragment_type: "code_block"  // ✅ Valid
```

---

### Error: "Required field 'session_id' missing"

**Cause:** `publish_article` requires a `session_id`.

**Solution:** Create a session first with `create_vibe_session`, then use that `session_id`.

```typescript
// Step 1: Create session
create_vibe_session({ title: "My Article" })
// → Returns session_id

// Step 2: Upload context
upload_session_context({ session_id: "...", fragments: [...] })

// Step 3: Publish with session_id
publish_article({ session_id: "...", title: "...", content: "..." })
```

---

### Error: "No LLM API key configured"

**Cause:** `generate_article_draft` requires server-side LLM configuration.

**Solution:** Use `publish_article` directly with pre-written content, skipping `generate_article_draft`.

---

## Article Styles

| Style | Description | Best For |
|-------|-------------|----------|
| `tutorial` | Step-by-step guide | How-to articles |
| `case_study` | Real-world example | Project showcases |
| `tips` | Quick tips list | Quick reference |
| `deep_dive` | In-depth analysis | Research, architecture |
| `quick_note` | Short note | Brief updates |

---

## Visibility Options

| Visibility | Description | URL Access |
|------------|-------------|------------|
| `public` | Visible to everyone | Anyone with link |
| `private` | Only visible to owner | Owner only |
| `unlisted` | Not in public feeds | Anyone with link |

---

## MCP Configuration

Current `.mcp.json` configuration:

```json
{
  "mcpServers": {
    "viblog": {
      "command": "node",
      "args": ["packages/viblog-mcp-server/dist/index.js"],
      "env": {
        "VIBLOG_API_URL": "https://viblog.tiic.tech",
        "VIBLOG_API_KEY": "your_api_key"
      }
    }
  }
}
```

---

## Troubleshooting

### MCP Server Not Running

```bash
# Build MCP server
cd packages/viblog-mcp-server
npm run build

# Verify dist/index.js exists
ls dist/index.js
```

### Authentication Errors

Ensure `VIBLOG_API_KEY` is set in `.mcp.json` and valid.

### API Errors

Check viblog.tiic.tech is accessible and API endpoints are responding.

---

## References

- MCP Service Design: `docs/specifications/MCP_SERVICE_DESIGN.md`
- MCP Server Package: `packages/viblog-mcp-server/`
- API Routes: `src/app/api/vibe-sessions/`, `src/app/api/articles/`
- Tool Definitions: `packages/viblog-mcp-server/src/tools/index.ts`

---

**Document Version:** 2.0
**Last Updated:** 2026-03-20
**Issue Resolved:** ISSUE-004 (fragment_type validation mismatch)