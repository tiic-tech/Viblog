# Viblog Publish Guidance

> **Version:** 1.2
> **Updated:** 2026-03-20
> **Purpose:** Guide for publishing articles to Viblog via MCP Service
> **Deployment:** viblog.tiic.tech

---

## Current MCP Tools Status

| Layer | Tool | Status | Description |
|-------|------|--------|-------------|
| 1 | `create_vibe_session` | Implemented | Create new vibe coding session |
| 1 | `append_session_context` | Implemented | Append fragments incrementally |
| 1 | `upload_session_context` | Implemented | Batch upload fragments |
| 2 | `generate_structured_context` | Implemented | Extract structured data via LLM |
| 3 | `generate_article_draft` | Implemented | Generate article from session |
| 4 | `list_user_sessions` | Implemented | List user's sessions |
| 4 | `publish_article` | **Implemented** | Publish article with visibility options |

**All 7 MCP tools implemented.**

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

## Publishing Workflow

### Full Workflow (MCP + Web UI)

```
Step 1: create_vibe_session
    ↓
Step 2: upload_session_context (or append_session_context)
    ↓
Step 3: generate_article_draft
    ↓
Step 4: Manual publish via Web UI (viblog.tiic.tech)
```

### Step 1: Create Session

```typescript
// MCP Tool: create_vibe_session
{
  title: "Viblog Ecosystem Positioning",
  platform: "claude-code",
  model: "glm-5"
}
// Returns: { session_id: "uuid", ... }
```

### Step 2: Upload Context

```typescript
// MCP Tool: upload_session_context
{
  session_id: "uuid-from-step-1",
  fragments: [
    {
      fragment_type: "conversation",
      content: "User asked about ecosystem positioning...",
      sequence_number: 1
    },
    {
      fragment_type: "document",
      content: "Analysis of Claude Code vs OpenClaw vs Viblog...",
      sequence_number: 2
    }
  ]
}
```

### Step 3: Generate Article Draft

```typescript
// MCP Tool: generate_article_draft
{
  session_id: "uuid-from-step-1",
  article_style: "deep_dive",
  tone: "professional",
  target_audience: "intermediate"
}
// Returns: { article_draft: { title, excerpt, markdown, metadata } }
```

### Step 4: Publish via Web UI

1. Go to https://viblog.tiic.tech
2. Login to Dashboard
3. Create new article with generated content
4. Edit and publish

---

## Alternative: Direct API Publishing

For direct article creation without session workflow:

```bash
# Create article draft
curl -X POST https://viblog.tiic.tech/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VIBLOG_API_KEY" \
  -d '{
    "title": "Article Title",
    "content": "<p>HTML content</p>",
    "platform": "claude-code",
    "model": "glm-5"
  }'

# Response: { "article": { "id": "uuid", "slug": "...", "status": "draft" } }

# Publish the article
curl -X POST https://viblog.tiic.tech/api/articles/{article_id}/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VIBLOG_API_KEY" \
  -d '{"visibility": "public"}'
```

---

## Article Draft Schema

The `generate_article_draft` tool returns:

```typescript
{
  session_id: string;
  title: string;
  excerpt: string;
  markdown: string;
  metadata: {
    style: string;
    audience: string;
    estimated_read_time_minutes: number;
    word_count: number;
  };
}
```

---

## Best Practices

### Fragment Types

| Type | Use Case |
|------|----------|
| `conversation` | User-assistant dialogue |
| `code_snippet` | Code examples |
| `file_change` | Code diffs |
| `command` | Shell commands |
| `document` | Reference documents |

### Article Styles

| Style | Description |
|-------|-------------|
| `tutorial` | Step-by-step guide |
| `case_study` | Real-world example |
| `tips` | Quick tips list |
| `deep_dive` | In-depth analysis |
| `quick_note` | Short note |

### Tone Options

| Tone | Use Case |
|------|----------|
| `casual` | Blog-style, conversational |
| `professional` | Business-oriented |
| `educational` | Teaching focus |

---

## Example: Publishing Strategy Article

See `docs/specifications/article-draft-viblog-ecosystem-positioning.md` for a complete example of a vibe coding session converted to article draft.

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

---

**Document Version:** 1.1
**Last Updated:** 2026-03-20