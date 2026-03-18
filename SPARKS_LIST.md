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

### Spark 002: Smart Markdown Editor Backend Support
**Date:** 2026-03-18
**Source:** User Idea
**Priority:** P1
**Status:** Pending
**Recorded From:** Backend Worktree

**Description:**
为前端 Smart Markdown Editor 提供后端支持，实现 LM 驱动的智能编辑功能。

**Frontend Features (User Requested):**
- Visual toolbar with formatting actions
- LM-based intelligent table generation
- LM-based flowchart/diagram generation
- Voice input support

**Backend Architecture Requirements:**

1. **LLM Integration (Phase 11.6 Support)**
   - Use `/api/llm/chat` streaming endpoint (Step 11.6.4)
   - Provider-aware model selection
   - Streaming response for real-time preview
   - Context injection with editor state

2. **Markdown Processing APIs**
   ```
   POST /api/markdown/transform
   - Convert natural language to markdown table
   - Generate mermaid diagrams from description
   - Format code blocks with syntax detection

   POST /api/markdown/enhance
   - Grammar/style improvement
   - Heading structure optimization
   - Link/reference validation
   ```

3. **Voice Input Pipeline**
   - Speech-to-text API integration (Whisper/Deepgram)
   - Real-time streaming transcription
   - Punctuation restoration
   - Multi-language support (zh/en)

4. **AST-based Operations**
   - Parse markdown to abstract syntax tree
   - Enable structural transformations
   - Support partial updates without full re-render

**Implementation Phases:**
- Phase 12.x: Markdown transform APIs
- Phase 13.x: Voice input integration
- Phase 14.x: Advanced diagram generation

**Dependencies:**
- Phase 11.6 Chat API (in progress)
- Provider adapters for OpenAI/Anthropic/Gemini

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

**Last Updated:** 2026-03-18
