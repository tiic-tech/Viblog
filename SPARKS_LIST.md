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
