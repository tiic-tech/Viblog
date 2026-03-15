# Viblog - Implementation Plan

## 文档信息
- **功能**: 实施计划文档，定义开发阶段、任务分解和技术细节
- **作用**: 开发执行的路线图，跟踪进度和依赖关系
- **职责**: 明确"什么时候做什么"，覆盖所有开发任务
- **阅读顺序**: 3 - 开工会话必读，了解当前任务和下一步工作

---

## 1. Overview

This document provides a step-by-step build sequence for Viblog post-MVP development. Each step has clear deliverables and dependencies.

**Current Status:** Post-MVP Phase 2 Planning

---

## 2. Development Phases

```
MVP Phases (Completed)
├── Phase 1: Foundation (Completed)
├── Phase 2: Core Features (Completed)
├── Phase 3: Public Features (Completed)
└── Phase 4: Polish & Deploy (Completed)

Post-MVP Phases (Completed)
├── Phase 5: Custom Domain (Completed)
├── Phase 6: Test Coverage (Completed 20.15%)
├── Phase 7: E2E Test Suite (Completed)
└── Phase 8: Secure API Key Storage (Completed)

Post-MVP Phase 2 (Current)
├── Phase 9: Competitive Analysis
├── Phase 10: MCP Server Development
├── Phase 11: Draft Bucket System
├── Phase 12: Dual-Layer Publishing
└── Phase 13: Visual Redesign
```

---

## 3. Current Phase: Phase 9 - Competitive Analysis

**Goal:** Deep-dive analysis of competitors to inform product differentiation

**Status:** In Progress

**Dependencies:** None (can run in parallel with planning)

**Cache Folder:** `.comp_product_assets/` (git-ignored, stores screenshots and raw data)

**Recommended Model:** `kimi-k2.5` (better multimodal understanding for web analysis)

---

### Step 9.0: Setup Analysis Environment
**Status:** Completed

**Deliverable:** Cache folder structure and analysis tools ready

**Checkpoints:**
- [x] Create `.comp_product_assets/` folder with subdirectories
- [x] Add to `.gitignore`
- [x] Create README for cache folder
- [ ] Verify kimi-k2.5 model availability (user action required)

---

### Step 9.1: Define Analysis Framework
**Status:** Completed

**Deliverable:** Analysis framework with evaluation criteria

**Checkpoints:**
- [x] Define 5 analysis dimensions:
  - [x] Information Architecture (IA) - structure, navigation, hierarchy
  - [x] Visual Design System - colors, typography, components
  - [x] Interaction Flow - user journeys, interaction patterns
  - [x] Feature Matrix - functionality comparison
  - [x] Technical Implementation - tech stack inference
- [x] Create scoring rubric for each dimension (1-5 scale)
- [x] Design analysis output template
- [x] Update `PRODUCT_COMP_ANALYSIS.md` with framework

**Analysis Output Template:**
```markdown
## [Product Name] - [Dimension] Analysis

**Analysis Date:** YYYY-MM-DD
**Analyst Model:** kimi-k2.5
**Assets Cached:** [screenshot paths]

### Summary
[2-3 sentence overview]

### Key Findings
1. Finding 1
2. Finding 2
3. Finding 3

### Applicable to Viblog
- [ ] Feature to adopt: [description]
- [ ] Pattern to learn: [description]
- [ ] Anti-pattern to avoid: [description]

### Technical Translation
[How to implement key findings in Viblog]
```

---

### Step 9.2: Analyze Claude Code (Priority 1 - MCP Reference)
**Status:** Completed

**Deliverable:** Comprehensive analysis of Claude Code for MCP patterns

**Why Priority 1:** Direct reference for Viblog MCP implementation

**Checkpoints:**
- [x] **9.2.1 Session Structure Analysis**
  - [x] Capture session format and structure
  - [x] Document context management approach
  - [x] Identify session persistence mechanisms
  - [x] Cache: `.comp_product_assets/ai-coding-tools/claude-code-analysis.md`

- [x] **9.2.2 MCP Protocol Analysis**
  - [x] Analyze MCP tool definitions
  - [x] Document server-client communication
  - [x] Identify extension patterns
  - [x] Design Viblog MCP tools schema

- [x] **9.2.3 Context Capture Analysis**
  - [x] Document what context is captured
  - [x] Identify context filtering mechanisms
  - [x] Analyze context window management

- [x] **9.2.4 Export/Share Analysis**
  - [x] Document sharing capabilities
  - [x] Identify export formats
  - [x] Analyze integration points

**Key Findings:**
- Score: 23/25 (Reference implementation)
- MCP Protocol: JSON-RPC 2.0 with Tools, Resources, Prompts primitives
- Session Recording: Complete pattern for Draft Bucket system
- Multi-surface: Shared context across Terminal, VS Code, Desktop, Web

**Viblog MCP Tools Designed:**
- `create_draft_bucket` - Create draft from session
- `update_draft_bucket` - Update existing draft
- `publish_article` - Publish draft to blog
- `get_user_articles` - List user's articles

---

### Step 9.3: Analyze Cursor (Priority 2 - IDE Integration)
**Status:** Completed

**Deliverable:** Analysis of Cursor for IDE integration patterns

**Checkpoints:**
- [x] **9.3.1 IDE Integration Analysis**
  - [x] Document editor integration approach
  - [x] Identify inline suggestion patterns
  - [x] Analyze code context awareness
  - [x] Cache: `ai-coding-tools/cursor-analysis.md`

- [x] **9.3.2 Session Recording Analysis**
  - [x] Document chat history format
  - [x] Identify code change tracking
  - [x] Analyze session persistence
  - [x] Cache: Documented in analysis

- [x] **9.3.3 MCP Compatibility Analysis**
  - [x] Check MCP support status - **FULL SUPPORT**
  - [x] Document alternative protocols
  - [x] Identify integration opportunities
  - [x] Cache: `ai-coding-tools/cursor-analysis.md`

**Key Findings:**
- Score: 24/25 (Reference implementation for AI-native IDE)
- **MCP Support:** Full protocol support (Tools, Prompts, Resources, Roots, Elicitation, Apps)
- **Transport:** stdio, SSE, Streamable HTTP with OAuth support
- **Plugin System:** Rules, Skills, Agents, Commands, MCP Servers, Hooks
- **Multi-Surface:** IDE, CLI, Slack, GitHub, GitLab, JetBrains
- **Agent Tools:** Semantic search, File ops, Terminal, Browser, Image generation
- **Checkpoints:** Automatic snapshots for rollback
- **Models:** Claude 4.6, GPT-5.x, Gemini 3.x, Grok, Composer 1.5

**Critical Insights for Viblog:**
1. MCP is confirmed as industry standard - Viblog MUST implement MCP server
2. Plugin architecture provides comprehensive extensibility model
3. Session recording via checkpoints and tool call logging
4. Multi-surface strategy essential for user adoption

**Screenshots Cached:**
- `cursor-home-hero.png` - Homepage with IDE demo
- `cursor-agent-dashboard.png` - Agent interface with MCPs button
- `cursor-mcp-docs.png` - MCP documentation page

---

### Step 9.4: Analyze Pinterest (Priority 3 - Visual Reference)
**Status:** Completed

**Deliverable:** Analysis of Pinterest for card design and masonry layout

**Checkpoints:**
- [x] **9.4.1 Card Design Analysis**
  - [x] Screenshot card variations
  - [x] Document card component structure
  - [x] Identify hover interactions
  - [x] Cache: `.comp_product_assets/visual-design/screenshots/pinterest-*.png`

- [x] **9.4.2 Masonry Grid Analysis**
  - [x] Analyze grid implementation
  - [x] Document responsive behavior
  - [x] Identify performance optimizations
  - [x] Cache: Documented in analysis

- [x] **9.4.3 Interaction Animation Analysis**
  - [x] Document scroll animations
  - [x] Identify hover effects
  - [x] Analyze loading states
  - [x] Cache: Documented in analysis

- [x] **9.4.4 Deep Visual Analysis (Playwright + Screenshot)**
  - [x] Capture homepage hero section
  - [x] Capture explore page with Pin cards
  - [x] Capture login modal design
  - [x] Analyze navigation bar structure
  - [x] Document featured topic cards
  - [x] Document category grid layout

**Key Findings:**
- Score: 22/25 (Reference implementation for visual-first feeds)
- Visual Design: 5/5 - Card-centric, consistent 8px grid, strong design tokens
- Interaction Flow: 5/5 - Minimal friction, satisfying micro-interactions
- Technical: JavaScript-based masonry, image optimization, lazy loading
- Pinterest Red (#e60023) accent color, 16px card radius, 8px grid system

**Deep Visual Analysis (from Playwright screenshots):**
- Navigation: 64px height, search-focused, clean minimal design
- Pin Cards: 236px width, 16px border-radius, variable height, hover lift effect
- Featured Cards: 16:9 aspect ratio, left-to-right gradient overlay for text
- Category Grid: 4×2 layout, 150×100px cards, center-aligned text
- Login Modal: 484px width, 32px border-radius, 48px input/button height
- Button States: Primary (red #e60023), Secondary (gray #f0f0f0)

**Applicable Patterns for Viblog:**
- Masonry grid layout for article feed
- Card hover effects with overlay + quick actions
- 8px grid system for spacing
- Dominant color image placeholders
- Infinite scroll with prefetching
- Clean navigation with search focus

**Screenshots Cached:**
- `pinterest-home-hero.png` - Homepage hero section
- `pinterest-home-signup.png` - Signup modal
- `pinterest-explore-page.png` - Explore page with masonry grid

---

### Step 9.5: Analyze Notion (Priority 4 - Content Creation)
**Status:** Completed

**Deliverable:** Analysis of Notion for content creation flow

**Checkpoints:**
- [x] **9.5.1 Screenshot Analysis (9 screenshots)**
  - [x] Welcome Page - Onboarding checklist, slash commands
  - [x] Search Interface - Global search with filters
  - [x] Notion AI Interface - AI-first interaction
  - [x] Notion AI Permissions - Fine-grained AI controls
  - [x] Library Page - File manager with metadata views
  - [x] To Do List - Interactive onboarding, dual views
  - [x] Add To Modal - Template-driven creation
  - [x] New Page - Blank canvas with quick actions
  - [x] Page Actions Menu - Rich page operations
  - [x] Cache: `traditional-blogs/notion-analysis.md`

**Key Findings:**
- Score: 24/25 (Reference implementation for AI-native content creation)
- **Architecture:** Left sidebar + right content, block-based editor
- **AI Integration:** Dedicated "Notion AI" nav item + embedded input with permission controls
- **Content Organization:** Recents/Favorites/Shared/Private views, Library with metadata table
- **Onboarding:** Task-driven checklist, interactive learning-by-doing
- **Templates:** Suggested cards with visual previews, AI-assisted building

**Core Patterns for Viblog:**
1. **MCP as Nav Item** - Like "Notion AI", Viblog MCP should appear in developer tool sidebar
2. **Draft Bucket = Library** - Reference Library view for Draft Bucket design with metadata columns
3. **Dual-Layer Content** - Human (Markdown) + AI (Structured JSON metadata)
4. **Block-Based Vibe** - Treat code snippets, insights, metadata as composable blocks
5. **Slash Commands** - Design `/vibe` command for quick blog draft generation
6. **AI Permission Transparency** - Clear controls for what AI can access (code history, sessions)

**Visual Design Takeaways:**
- Emoji for亲和力 - Each page/function has corresponding emoji
- Card previews - Templates show actual layout preview
- Status tags - Colored labels (Not started/In progress/Done)
- Modal focus - Key actions use centered modal windows
- Bottom action bar - Quick starts on blank pages

**Screenshots Cached:**
- `notion_screenshot_1.png` through `notion_screenshot_9.png` - Complete UI tour

---

### Step 9.6: Analyze Medium (Priority 5 - Reader Experience)
**Status:** Pending

**Deliverable:** Analysis of Medium for reader experience

**Checkpoints:**
- [ ] **9.6.1 Reading Experience Analysis**
  - [ ] Document typography choices
  - [ ] Identify reading flow patterns
  - [ ] Analyze engagement features
  - [ ] Cache: `traditional-blogs/medium-reading-*.md`

- [ ] **9.6.2 Recommendation Analysis**
  - [ ] Document recommendation algorithm signals
  - [ ] Identify discovery mechanisms
  - [ ] Cache: `traditional-blogs/medium-recommendation-*.md`

---

### Step 9.7: Synthesize Findings
**Status:** Pending

**Deliverable:** Competitive analysis summary with actionable insights

**Checkpoints:**
- [ ] Create feature comparison matrix
- [ ] Identify 5 key differentiation opportunities
- [ ] Document technical implementation recommendations
- [ ] Update `PRODUCT_COMP_ANALYSIS.md` with full analysis
- [ ] Present findings for user review

**Output Artifacts:**
1. `PRODUCT_COMP_ANALYSIS.md` - Complete analysis report
2. `.comp_product_assets/` - All cached screenshots and raw data
3. Feature comparison matrix
4. Differentiation strategy document

---

## 4. Phase 10: MCP Server Development

**Goal:** Build MCP server that integrates with Claude Code and Cursor

**Estimated Effort:** 2-3 weeks

**Dependencies:** Phase 9 completion

---

### Step 10.1: MCP SDK Setup
**Status:** Pending

**Deliverable:** Working MCP server skeleton

**Tasks:**
- [ ] Initialize MCP server project
- [ ] Set up build and publish pipeline
- [ ] Create basic server with health check

---

### Step 10.2: Implement update_vibe_coding_history Tool
**Status:** Pending

**Deliverable:** MCP tool for session recording

**Tasks:**
- [ ] Define input schema
- [ ] Implement API client
- [ ] Add error handling
- [ ] Write unit tests

---

### Step 10.3: Implement get_recent_sessions Tool
**Status:** Pending

**Deliverable:** MCP tool for retrieving sessions

**Tasks:**
- [ ] Define output schema
- [ ] Implement pagination
- [ ] Add filtering options

---

### Step 10.4: MCP API Key Management
**Status:** Pending

**Deliverable:** API key generation and management

**Tasks:**
- [ ] Create MCP API key generation endpoint
- [ ] Add key display in settings
- [ ] Implement key revocation

---

### Step 10.5: Documentation and Testing
**Status:** Pending

**Deliverable:** MCP server documentation and tests

**Tasks:**
- [ ] Write README with setup instructions
- [ ] Create Claude Code config example
- [ ] Add integration tests

---

## 5. Phase 11: Draft Bucket System

**Goal:** Build the draft bucket UI and article generation pipeline

**Estimated Effort:** 2 weeks

**Dependencies:** Phase 10 completion

---

### Step 11.1: Database Migration
**Status:** Pending

**Deliverable:** draft_buckets table with RLS

**Tasks:**
- [ ] Create migration file
- [ ] Add RLS policies
- [ ] Generate TypeScript types

---

### Step 11.2: Draft Bucket API
**Status:** Pending

**Deliverable:** REST API for draft buckets

**Tasks:**
- [ ] Implement CRUD endpoints
- [ ] Add filtering and pagination
- [ ] Write API tests

---

### Step 11.3: Draft Bucket UI
**Status:** Pending

**Deliverable:** Draft bucket list and detail pages

**Tasks:**
- [ ] Create list page with cards
- [ ] Create detail page with human input form
- [ ] Add status indicators

---

### Step 11.4: Article Generation Pipeline
**Status:** Pending

**Deliverable:** AI article generation from draft buckets

**Tasks:**
- [ ] Create generation endpoint
- [ ] Implement LLM integration
- [ ] Add progress tracking
- [ ] Handle generation failures

---

## 6. Phase 12: Dual-Layer Publishing

**Goal:** Implement dual-format (Markdown + JSON) publishing

**Estimated Effort:** 1 week

**Dependencies:** Phase 11 completion

---

### Step 12.1: JSON Content Schema
**Status:** Pending

**Deliverable:** JSON schema for AI-consumable content

**Tasks:**
- [ ] Define JSON structure
- [ ] Add validation
- [ ] Document schema

---

### Step 12.2: JSON Generation
**Status:** Pending

**Deliverable:** Auto-generate JSON from article content

**Tasks:**
- [ ] Create generation logic
- [ ] Add extraction for code snippets
- [ ] Add key decision extraction

---

### Step 12.3: JSON API Endpoint
**Status:** Pending

**Deliverable:** Public API for JSON content

**Tasks:**
- [ ] Create JSON endpoint
- [ ] Add caching
- [ ] Document API

---

## 7. Phase 13: Visual Redesign

**Goal:** Implement Pinterest-style card layout and premium visual design

**Estimated Effort:** 2 weeks

**Dependencies:** Phase 9 completion (analysis)

---

### Step 13.1: Card Component Redesign
**Status:** Pending

**Deliverable:** New article card component

**Tasks:**
- [ ] Design new card in Figma
- [ ] Implement card component
- [ ] Add hover animations

---

### Step 13.2: Masonry Grid Layout
**Status:** Pending

**Deliverable:** Pinterest-style grid layout

**Tasks:**
- [ ] Implement masonry grid
- [ ] Add responsive breakpoints
- [ ] Optimize for performance

---

### Step 13.3: Visual Polish
**Status:** Pending

**Deliverable:** Premium visual design throughout

**Tasks:**
- [ ] Update color system
- [ ] Add micro-interactions
- [ ] Improve typography
- [ ] Add loading animations

---

## 8. Dependency Graph

```
Phase 9: Competitive Analysis
    │
    ├── Phase 10: MCP Server
    │       │
    │       └── Phase 11: Draft Buckets
    │               │
    │               └── Phase 12: Dual-Layer Publishing
    │
    └── Phase 13: Visual Redesign (can run parallel with 10-12)
```

---

## 9. Environment Setup Checklist

- [x] Node.js 20+ installed
- [x] pnpm installed
- [x] Supabase project configured
- [x] Vercel deployment configured
- [x] Custom domain configured (viblog.tiic.tech)
- [x] CI/CD pipeline active
- [ ] MCP SDK documentation reviewed
- [ ] LLM API keys configured for article generation

---

**Document Version:** 3.0
**Last Updated:** 2026-03-15
**Author:** Viblog Team