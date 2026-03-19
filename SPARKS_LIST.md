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

### Spark 003: Multi-LLM Model Routing Layer
**Date:** 2026-03-18
**Source:** User Idea
**Priority:** P1
**Status:** Pending
**Recorded From:** Backend Worktree

**Description:**
支持用户同时配置多个不同的LLM，提供模型路由层让用户自定义不同LLM执行不同任务。类似于Claude Code的Opus/Sonnet/Haiku策略。

**Use Case:**
- 用户可以快速切换不同LLM完成不同任务
- 针对海外社交媒体：优先使用ChatGPT、Gemini
- 针对国内社交媒体：配置DeepSeek、豆包、Qwen
- 不同任务类型选择最适合的模型（写作、翻译、代码等）

**Implementation Ideas:**
1. **模型路由层架构**
   ```
   user_llm_route_rules 表:
   - user_id: 用户ID
   - task_type: 任务类型 (social_overseas, social_china, writing, translation, code)
   - preferred_provider_id: 首选提供商
   - fallback_provider_id: 备选提供商
   - priority: 优先级
   ```

2. **任务类型定义**
   - `social_overseas`: 海外社交媒体内容生成 (ChatGPT, Gemini)
   - `social_china`: 国内社交媒体内容生成 (DeepSeek, 豆包, Qwen)
   - `article_writing`: 文章写作 (高质量模型)
   - `translation`: 翻译任务
   - `code_generation`: 代码生成

3. **API扩展**
   ```
   POST /api/llm/route
   - task_type: 指定任务类型
   - 自动选择用户配置的最佳模型
   - 支持fallback机制

   GET /api/llm/route/config
   - 获取用户的路由配置

   PUT /api/llm/route/config
   - 更新路由规则
   ```

4. **智能路由逻辑**
   - 根据任务类型匹配用户配置
   - 优先使用首选模型
   - 首选失败时自动fallback
   - 支持负载均衡（多模型轮询）

**Integration Point:**
- Phase 12: 社交媒体分发模块
- 可与现有的 user_llm_configs 表整合
- 扩展 /api/llm/chat 端点支持 task_type 参数

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
