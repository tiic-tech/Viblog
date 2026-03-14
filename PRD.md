# Viblog - Product Requirements Document (PRD)

## 文档信息
- **功能**: 产品需求文档，定义产品愿景、用户故事和功能范围
- **作用**: 产品开发的核心参考，指导所有技术决策和功能实现
- **职责**: 明确"做什么"和"为什么做"，保持产品方向一致性
- **阅读时机**: 按需阅读 - 当需要了解产品定位、功能范围或用户故事时

---

## 1. Executive Summary

### 1.1 Product Vision

**Viblog** is an AI-Native blogging platform designed for Vibe Coders and AI enthusiasts. Our mission is to help developers effortlessly transform their AI-assisted development experiences into shareable knowledge.

### 1.2 Product Statement

> "Not just AI writing blogs for you, but AI growing blogs from your coding sessions."

### 1.3 AI-Native Definition

**AI-Native means:**

1. **Content Generation from Coding Sessions** - AI extracts insights from your vibe coding history, not from scratch
2. **Dual-Layer Content Format** - Markdown for humans + Structured JSON for AI consumers
3. **MCP as Core Entry Point** - Seamless integration with development tools
4. **LLM-Optimized Output** - Content designed for token efficiency, speed, and accuracy

### 1.4 Target Users (Dual-Track)

| Segment | Description | Primary Needs | Value Proposition |
|---------|-------------|---------------|-------------------|
| **A2A Users** | Vibe Coders (developers with AI assistants) | Efficient development + experience sharing | MCP integration, session-based content generation |
| **Human Readers** | AI learners and enthusiasts | Discover AI knowledge, understand vibe coding | Curated insights, structured content |

---

## 2. Core Principles

### 2.1 The Three Pillars

1. **Record** - Capture the authentic vibe coding context (prompts, AI responses, decisions)
2. **Share** - Transform experiences into beautiful, shareable content
3. **Grow** - Build a personal knowledge base with AI-consumable structure

### 2.2 AI-Native Design Philosophy

- **For LLM Effect** - Optimize for token count, generation speed, accuracy
- **Dual Format** - Human-readable Markdown + AI-consumable JSON
- **From Session to Article** - Content grows from coding sessions, not from blank pages
- **MCP First** - Technical differentiation through seamless tool integration

---

## 3. User Stories

### 3.1 MCP Integration (Phase 2)

**US-100: MCP Session Recording**
```
As a Vibe Coder using Claude Code or Cursor
I want my coding session automatically recorded via MCP
So that I can generate articles from my actual development work
```
**Acceptance Criteria:**
- [ ] MCP server provides `update_vibe_coding_history` function
- [ ] Records: prompts, AI responses, code changes, decisions
- [ ] Timestamps and metadata captured automatically
- [ ] Works with Claude Code, Cursor, and other MCP-compatible tools

**US-101: Draft Bucket Generation**
```
As a Vibe Coder finishing a coding session
I want AI to generate a draft bucket with key insights
So that I can review and refine before publishing
```
**Acceptance Criteria:**
- [ ] Auto-generate title suggestions
- [ ] Extract key code snippets with context
- [ ] Identify decisions and rationale
- [ ] List problems encountered and solutions

**US-102: Human Touch Input**
```
As a Vibe Coder reviewing my draft bucket
I want to add my personal reflections and insights
So that the final article has authentic human perspective
```
**Acceptance Criteria:**
- [ ] Text field for "Today's learnings/reflections"
- [ ] Optional: custom title override
- [ ] Optional: additional context or notes
- [ ] Save as draft before generating

### 3.2 Dual-Layer Content (Phase 2)

**US-103: Dual Format Publishing**
```
As an author publishing an article
I want both Markdown and structured JSON versions generated
So that both humans and AI can consume my content effectively
```
**Acceptance Criteria:**
- [ ] Markdown version for human readers
- [ ] JSON version with structured metadata:
  - article_id, title, summary
  - key_decisions: [{decision, reason}]
  - code_snippets: [{purpose, code, language}]
  - lessons_learned: []
  - related_topics: []
- [ ] Both versions accessible via API
- [ ] AI version optimized for LLM consumption

### 3.3 High-End Visual Presentation (Phase 2)

**US-104: Pinterest-Style Article Cards**
```
As a visitor browsing Viblog
I want to see beautiful, Pinterest-style article cards
So that the platform feels premium and inspiring
```
**Acceptance Criteria:**
- [ ] Masonry or grid layout with varying card heights
- [ ] High-quality cover image display
- [ ] Smooth hover animations
- [ ] Mobile-responsive design
- [ ] Fast loading with image optimization

---

## 4. Success Criteria

### 4.1 Post-MVP Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| MCP Integration Usage | 50% of users connect via MCP | Database tracking |
| Article Generation Rate | 3+ articles/week per active MCP user | Article count |
| AI Content Consumption | 1000+ JSON API requests/month | API analytics |
| User Retention | 50% weekly active return | DAU/WAU ratio |
| Visual Satisfaction | 4.5+ star rating in user surveys | Survey feedback |

### 4.2 Quality Metrics

| Metric | Target |
|--------|--------|
| MCP Response Time | < 500ms |
| Article Generation | < 5 seconds |
| Page Load Time | < 2 seconds |
| Mobile Responsiveness | 100% functional |

---

## 5. Scope Definition

### 5.1 In Scope (Post-MVP Phase 2)

| Feature | Priority | Notes |
|---------|----------|-------|
| MCP Server Development | P0 | Core technical differentiation |
| MCP Session Recording | P0 | Primary content source |
| Draft Bucket System | P0 | Bridge between sessions and articles |
| Dual-Layer Publishing | P0 | AI-Native content format |
| Premium Visual Design | P0 | Brand differentiation |
| Article Card Redesign | P1 | Pinterest-style aesthetics |

### 5.2 Out of Scope (Phase 2)

| Feature | Reason | Planned Phase |
|---------|--------|---------------|
| Third-party OAuth | Not critical | Phase 3 |
| Paid Article Transactions | Payment complexity | Phase 3 |
| Comments System | Engagement feature | Phase 3 |
| Cross-platform Publishing | Integration complexity | Phase 3 |

---

## 6. Competitive Analysis Scope

| Category | Products | Analysis Purpose |
|----------|----------|------------------|
| **Traditional Blogs** | Notion, Medium, Substack | Content publishing flow |
| **AI Coding Tools** | Cursor, Claude Code, Windsurf | Session recording capabilities |
| **Code Sharing** | GitHub Gist, Stack Overflow | Developer sharing habits |
| **Visual Design** | Pinterest, Dribbble, Behance | Card design inspiration |
| **Creative Showcase** | Awwwards, FWA | Premium visual presentation |

---

## 7. Dependencies

### 7.1 MCP Integration Requirements

- MCP SDK understanding and implementation
- Claude Code MCP adapter
- Cursor MCP adapter (future)
- Secure credential management

### 7.2 Design Requirements

- Figma/Sketch for design mockups
- Image optimization pipeline
- Animation library (Framer Motion)

---

**Document Version:** 2.0
**Last Updated:** 2026-03-15
**Author:** Viblog Team