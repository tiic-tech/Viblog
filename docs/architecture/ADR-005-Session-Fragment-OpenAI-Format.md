# ADR-005: Session Fragment OpenAI Format Alignment

> **Status:** Proposed
> **Date:** 2026-03-20
> **Decision Makers:** CAO
> **Consulted:** Industry Research (OpenAI, Anthropic, Codex, Gemini formats)
> **Informed:** Development Team

---

## Context

Viblog's MCP Session Sync captures coding session data from Claude Code, but the current `session_fragment` schema uses a custom structure that:

1. **Lacks interoperability** with the broader AI tooling ecosystem
2. **Misses critical data types** like `reasoning` blocks that are essential for Decision Graph extraction
3. **Cannot leverage existing tooling** designed for OpenAI format
4. **Creates migration friction** if users want to move data between platforms

**Industry Trend:** Analysis of `convert_ai_session.py` (v1.3.0) reveals that all major AI coding tools (Claude, Codex, Gemini, OpenCode, Kilocode) are converging toward a unified OpenAI-compatible session format.

**Key Discovery:** The `reasoning` content type, present in Claude's `thinking` blocks, Codex's `agent_reasoning`, and Gemini's `thoughts`, is the **primary source for Decision Graph extraction** - Viblog's core differentiation.

---

## Decision

Adopt OpenAI-compatible message format for `session_fragment` storage, with Viblog-specific extensions for code tracking.

### Core Schema

```typescript
// OpenAI-aligned session fragment schema
interface SessionFragment {
  id: string;
  session_id: string;

  // OpenAI-compatible message structure
  role: 'user' | 'assistant' | 'tool' | 'developer' | 'system';
  content: ContentBlock[];
  tool_calls?: ToolCall[];

  // Metadata (OpenAI-style with _metadata convention)
  metadata: {
    timestamp: string;
    message_id?: string;
    tokens?: TokenCount;
  };

  created_at: string;
}

// Content Block Types (OpenAI + Viblog extensions)
type ContentBlock =
  // OpenAI standard types
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string }  // KEY for Decision Graph
  | { type: 'tool_call'; tool_call_id: string; name: string; arguments: string }
  | { type: 'tool_output'; text: string; metadata?: Record<string, any> }
  // Viblog extensions
  | { type: 'code'; language: string; code: string; file_path?: string; change_type?: 'created' | 'modified' | 'deleted' };

// Tool Call Structure (OpenAI standard)
interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;  // JSON string
  };
}

// Token Tracking (for ROI metrics)
interface TokenCount {
  input: number;
  output: number;
  cached_input: number;  // Cache efficiency
  reasoning: number;     // Thinking budget
}
```

### Session Meta Structure

```typescript
interface SessionMeta {
  session_id: string;
  cwd: string;
  git_branch?: string;
  cli_version?: string;
  source: 'claude' | 'cursor' | 'windsurf' | 'copilot';
  model_provider?: string;
  created_at: string;
  last_updated: string;
}
```

### Turn Contexts (Session Phase Tracking)

```typescript
interface TurnContext {
  cwd: string;
  model: string;
  summary?: string;
  user_instructions?: string;
  timestamp: string;
}
```

---

## Content Type Mapping

### From Claude Code JSONL

| Claude Type | OpenAI Type | Decision Graph Relevance |
|-------------|-------------|--------------------------|
| `text` | `text` | User prompts, AI responses |
| `thinking` | `reasoning` | **PRIMARY** - decision reasoning |
| `tool_use` | `tool_call` | MCP tool invocations |
| `tool_result` | `tool_output` | Code changes, file operations |

### From Codex JSONL

| Codex Type | OpenAI Type | Decision Graph Relevance |
|------------|-------------|--------------------------|
| `text` | `text` | Standard content |
| `agent_reasoning` | `reasoning` | **PRIMARY** - decision reasoning |
| `function_call` | `tool_call` | Tool invocations |
| `function_call_output` | `tool_output` | Execution results |

### From Gemini JSON

| Gemini Type | OpenAI Type | Decision Graph Relevance |
|-------------|-------------|--------------------------|
| `content` | `text` | Standard content |
| `thoughts` | `reasoning` | **PRIMARY** - decision reasoning |
| `toolCalls` | `tool_call` | Tool invocations |
| `toolResults` | `tool_output` | Execution results |

---

## Decision Graph Extraction

The `reasoning` content type enables systematic decision extraction:

```
┌─────────────────────────────────────────────────────────────┐
│  REASONING BLOCK → DECISION MAPPING                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Input: reasoning text                                      │
│  "I'll use useEffect because we need to handle WebSocket   │
│   lifecycle. SSE would require custom server which is      │
│   overkill. SWR could work but adds complexity."           │
│                                                             │
│  Extraction Algorithm:                                      │
│  1. Identify decision statement → decision                 │
│  2. Extract "because" clauses → reasoning                  │
│  3. Identify alternatives mentioned → alternatives         │
│  4. Assess confidence from reasoning depth                 │
│                                                             │
│  Output: Decision Graph Node                               │
│  {                                                          │
│    decision: "Use useEffect for WebSocket",                │
│    reasoning: "Handle lifecycle in React component",       │
│    alternatives: ["SSE", "SWR", "Custom hook"],            │
│    confidence: 0.85                                         │
│  }                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Consequences

### Positive

1. **Interoperability:** Data can be exchanged with any OpenAI-compatible tool
2. **Reasoning Preservation:** `reasoning` type captures decision context for Decision Graph
3. **Token Tracking:** Built-in support for cost/ROI analytics
4. **Tool Ecosystem:** Can leverage existing OpenAI format tooling
5. **Future-Proof:** Aligned with industry convergence trend
6. **Multi-Source Support:** Same schema works for Claude, Cursor, Windsurf, etc.

### Negative

1. **Migration Required:** Existing session data needs conversion
2. **Schema Complexity:** More complex than simple text storage
3. **Storage Overhead:** Structured format uses more space than plain text

### Neutral

1. **API Changes:** MCP server needs update to emit OpenAI format
2. **Documentation:** Need to document content type semantics
3. **Testing:** Need tests for each content type

---

## Alternatives Considered

### Alternative 1: Custom Schema (Current)

**Description:** Continue with custom `session_fragment` schema with simple `content` text field.

**Rejected Because:**
- Loses `reasoning` type distinction critical for Decision Graph
- No interoperability with other tools
- Cannot leverage ecosystem tooling

### Alternative 2: Store Raw JSONL Only

**Description:** Store raw Claude Code JSONL without transformation.

**Rejected Because:**
- Vendor lock-in to Claude Code
- Complex querying across different formats
- No unified data model for Decision Graph extraction

### Alternative 3: Dual Format Storage

**Description:** Store both raw JSONL and OpenAI format.

**Rejected Because:**
- Double storage cost
- Sync complexity between formats
- Unnecessary - OpenAI format preserves all needed data

---

## Implementation Plan

### Phase 1: Schema Migration
1. Update `session_fragments` table with OpenAI format columns
2. Create migration script for existing data
3. Update MCP server to emit OpenAI format

### Phase 2: Decision Graph Integration
1. Build `reasoning` content type parser
2. Implement decision extraction from reasoning blocks
3. Connect to Canvas Auto-Layout pipeline

### Phase 3: Analytics & ROI
1. Implement token tracking dashboard
2. Add cache efficiency metrics
3. Build cost estimation for users

---

## Related Decisions

- ADR-001: Database Multi-Tenant Isolation (data layer for fragments)
- ADR-003: MCP Commercial Architecture (MCP server design)
- PRD V3.2: Product requirements with OpenAI format alignment

---

## References

- `convert_ai_session.py` v1.3.0 - Multi-format AI session converter
- OpenAI Messages API Documentation
- Claude Code Session Format Specification
- Codex CLI Session Format
- Gemini CLI Session Format

---

**Document Version:** 1.0
**Last Updated:** 2026-03-20