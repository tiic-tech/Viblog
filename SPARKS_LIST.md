# Viblog - Sparks List

## 文档信息
- **功能**: 记录临时想法、功能请求、未来规划
- **作用**: 避免打断当前开发流程，集中管理创意
- **职责**: 收集"可能要做的"，定期融入 IMPLEMENTATION_PLAN.md

---

## Sparks (Pending Ideas)

### Spark 001: MD File Upload for Draft Creation
**Date:** 2026-03-18
**Source:** User Idea
**Priority:** P2
**Status:** Pending
**Recorded From:** Backend Worktree

**Description:**
为 viblog-mcp-service 添加一个工具，支持直接上传 .md 文件，自动解析并在 Viblog 创建 draft。

**Use Case:**
- 用户使用 Claude Code / Cursor 等 AI 工具生成 markdown 内容
- 通过 MCP 工具直接上传到 Viblog 作为草稿
- 简化内容迁移和创作流程

**Implementation Ideas:**
- 新增 MCP Tool: `upload_markdown_draft`
- 参数: `file_path` 或 `content` + `title`
- 自动解析 frontmatter (title, tags, etc.)
- 创建 draft article，状态为 "draft"

**Integration Point:**
- Phase 12 或后续版本
- 可与现有的 vibe-sessions 工具链整合

---

### Spark 002: Smart Markdown Editor - Intelligent Writing Experience (Frontend)
**Date:** 2026-03-18
**Source:** User Idea
**Priority:** P1
**Status:** Integrated into IMPLEMENTATION_PLAN.md
**Integrated At:** 2026-03-18
**Recorded From:** Frontend Worktree

**Integration:** Added as TDD Checkpoints 10.4.1.6 - 10.4.1.15 in IMPLEMENTATION_PLAN.md

**Core Objective:**
Based on LLM infrastructure, create an **efficient, intelligent, differentiated** Markdown editing experience that replaces traditional manual operations.

---

#### Current Frontend Gaps
1. **Incomplete TipTap Extensions:** Missing support for:
   - Flowcharts / Mermaid diagrams
   - Mind maps
   - Swimlane diagrams
   - Enhanced table editor

2. **Inefficient UI Interactions:**
   - No visual sidebar toolbar for quick element insertion
   - Table insertion requires manual row/column setup
   - No intelligent content generation UI

3. **No Voice Input UI:**
   - No microphone button for voice input
   - No real-time transcription display
   - No voice recording list/playback UI

---

#### Frontend Components to Build

**1. EditorSidebarToolbar Component** (`src/components/editor/sidebar-toolbar.tsx`)
- Vertical fixed toolbar beside TipTap editor
- Icons: bullet list, table, flowchart, mind map, hyperlink, image, code block
- Click triggers appropriate insertion action
- Position: fixed right side of editor container

**2. EnhancedLinkDialog Component** (`src/components/editor/enhanced-link-dialog.tsx`)
- Search/select own articles (autocomplete dropdown)
- Search/select bookmarked articles
- Paste external URL
- Selected text -> auto-populate link text field

**3. SmartInsertDialog Component** (`src/components/editor/smart-insert-dialog.tsx`)
- Modal triggered by toolbar click (table/flowchart/mind map/swimlane)
- Input textarea for content description
- Voice input button (microphone icon)
- "Generate" button -> calls LLM API
- Preview area showing generated structure
- "Insert" button -> inserts into TipTap editor

**4. SmartSyntaxHandler** (`src/hooks/use-smart-syntax.ts`)
- Detects `@table`, `@flowchart`, `@mindmap` triggers
- Shows inline prompt for content input
- Calls LLM API for structure generation
- Inserts result at cursor position

**5. VoiceInputButton Component** (`src/components/editor/voice-input-button.tsx`)
- Microphone toggle button
- Visual feedback: recording state (pulsing red dot)
- Real-time transcription display in tooltip
- On stop: returns transcribed text to parent component

**6. VoiceRecordingList Component** (`src/components/editor/voice-recording-list.tsx`)
- List of saved voice recordings (from draft bucket)
- Each item: playback button, transcription preview, timestamp
- Click to re-use transcription or regenerate

---

#### Frontend State Management

```typescript
// Voice recording state
interface VoiceRecording {
  id: string
  blob: Blob
  transcription: string
  timestamp: Date
  duration: number
}

// Smart insert state
interface SmartInsertState {
  isOpen: boolean
  type: 'table' | 'flowchart' | 'mindmap' | 'swimlane'
  inputText: string
  isGenerating: boolean
  previewContent: string | null
}
```

---

#### API Calls Required (Frontend -> Backend)

| Action | Endpoint | Payload |
|--------|----------|---------|
| Smart generate | `POST /api/llm/generate-structure` | `{ type, content }` |
| Voice transcribe | `POST /api/voice/transcribe` | `FormData (audio blob)` |
| Save voice recording | `POST /api/voice/recordings` | `{ blob, transcription }` |
| Get voice recordings | `GET /api/voice/recordings` | - |
| Search own articles | `GET /api/articles/search?q={query}` | - |
| Get bookmarked articles | `GET /api/articles/bookmarked` | - |

---

#### TipTap Extensions to Add

| Extension | Package | Purpose |
|-----------|---------|---------|
| `@tiptap/extension-table` | Already exists | Enhanced table editing |
| `tiptap-extension-mermaid` | Custom | Flowchart/diagram support |
| Custom mindmap extension | Build | Mind map visualization |
| Smart syntax trigger | Build custom | Detect `@table` etc. |

---

#### Core Value (Frontend Perspective)
- Reduce clicks for common operations from 5+ to 1-2
- Real-time visual feedback for voice input
- Intelligent content generation without leaving editor
- Differentiated UX vs Feishu, Obsidian, Notion

---

#### Integration Point
- Phase 10.4.1: Smart Markdown Editor (extends current plan)
- Frontend-only: Sidebar toolbar, dialog components, voice UI
- Backend dependency: LLM API + Voice API (from Phase 11.6 Platform LLM Config)

---

## Processed Sparks

*(None yet - sparks will be moved here after integration into IMPLEMENTATION_PLAN.md)*

---

## How to Use This Document

1. **Add Spark:** When a new idea comes up during development, add it above
2. **Review Regularly:** During planning sessions, review pending sparks
3. **Integrate:** Move relevant sparks to IMPLEMENTATION_PLAN.md as formal tasks
4. **Archive:** Move processed sparks to "Processed Sparks" section

---

**Last Updated:** 2026-03-18 (Added Spark 002: Smart Markdown Editor)
