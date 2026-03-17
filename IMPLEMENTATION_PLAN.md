# Viblog - Implementation Plan

## 文档信息
- **功能**: 实施计划文档，定义开发阶段、任务分解和技术细节
- **作用**: 开发执行的路线图，跟踪进度和依赖关系
- **职责**: 明确"什么时候做什么"，覆盖所有开发任务
- **阅读顺序**: 3 - 开工会话必读，了解当前任务和下一步工作

---

## 1. Overview

This document provides a step-by-step build sequence for Viblog post-MVP development. Each step has clear deliverables and dependencies.

**Current Status:** Phase 10.4 COMPLETE - End-to-End MCP Verification (2026-03-17 20:55)

---

## 1.0.1 Core Goal: Claude Code → Viblog MCP Integration

**Mission:** Enable Claude Code to write and publish directly to Viblog via MCP configuration.

**Problem:** Current workflow uses Playwright as indirect publishing mechanism - inefficient and fragile.

**Solution:** Implement MCP Server npm package with stdio transport that wraps existing REST APIs.

**Timeline:** 5-8 days for full MCP integration.

**Approach Selected:** stdio-based npm Package (Recommended)

**Architecture:**
```
Claude Code
    │
    │ stdio (JSON-RPC 2.0)
    ▼
viblog-mcp-server (npm package)
    │
    │ HTTP REST
    ▼
Viblog Backend APIs
├── POST /api/vibe-sessions
├── POST /api/vibe-sessions/[id]/fragments
├── POST /api/vibe-sessions/generate-structured-context
└── POST /api/vibe-sessions/generate-article-draft
```

**Progress:**
- [x] Created `src/lib/mcp/types.ts` - MCP Protocol Types
- [x] Created `src/lib/mcp/tools.ts` - 11 MCP Tools Definition
- [x] Created `packages/viblog-mcp-server/` - npm package structure
- [x] Created `packages/viblog-mcp-server/src/index.ts` - Entry point (stdio)
- [x] Created `packages/viblog-mcp-server/src/server.ts` - MCP server setup
- [x] Created `packages/viblog-mcp-server/src/tools/index.ts` - Tool definitions
- [x] Created `packages/viblog-mcp-server/src/tools/handlers.ts` - Tool handlers
- [x] Created `packages/viblog-mcp-server/src/api/client.ts` - REST client
- [x] Created `packages/viblog-mcp-server/src/types.ts` - Shared types
- [x] Created `packages/viblog-mcp-server/README.md` - Usage guide
- [x] Build npm package successfully (TypeScript compilation passed)
- [x] CI PASSED (PR #9) - All checks green: Type check, Build, 166 tests
- [x] Merged to main branch
- [x] Production API tested - ALL PASSING (2026-03-17 17:40)
- [x] MCP API Key authentication working in production
- [x] Critical fix: SUPABASE_SERVICE_SECRET_KEY env variable
- [x] Configure global MCP settings for Claude Code auto-loading
- [x] End-to-end MCP tool test from Claude Code session
- [ ] Publish to npm registry (optional)

**Breakpoint:** PHASE 10.4 COMPLETE. Claude Code can now write directly to Viblog via MCP. Verified session: bd46ae60-d7b2-48bb-b568-71ae77ccdd76. All 6 MCP tools operational.

---

## 1.1 Planning Principles (CRITICAL)

### Backend/Frontend Split

Every Phase/Step plan MUST be split into TWO tracks:

```
┌─────────────────────────────────────────────────────────────────┐
│   DUAL-TRACK PLANNING                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   BACKEND DEVELOP PLAN          FRONTEND DEVELOP PLAN          │
│   ===================          ====================            │
│   - Database schema            - UI components                  │
│   - API endpoints              - Page layouts                   │
│   - Server logic               - Client state                   │
│   - Migrations                 - Styling                        │
│   - Tests (API)                - Tests (E2E)                    │
│                                                                 │
│   Independent execution         Independent execution           │
│   Can be parallelized           Can be parallelized             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Parallel Development with Git Worktrees

```
┌─────────────────────────────────────────────────────────────────┐
│   PARALLEL DEVELOPMENT WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Main Repository                                               │
│   ├── branch: feature/phaseX-backend                           │
│   │   └── worktree: .claude/worktrees/backend/                 │
│   │       └── Agent: backend-developer                         │
│   │                                                            │
│   └── branch: feature/phaseX-frontend                          │
│       └── worktree: .claude/worktrees/frontend/                │
│           └── Agent: frontend-developer                        │
│                                                                 │
│   Benefits:                                                     │
│   - No context switching between backend/frontend              │
│   - True parallel development                                  │
│   - Isolated testing environments                              │
│   - Independent commit histories                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Worktree Commands

```bash
# Create backend worktree
git worktree add .claude/worktrees/backend -b feature/phase10-backend

# Create frontend worktree
git worktree add .claude/worktrees/frontend -b feature/phase10-frontend

# List worktrees
git worktree list

# Remove after merge
git worktree remove .claude/worktrees/backend
git worktree remove .claude/worktrees/frontend
```

### Independent Agent Publishing

```
┌─────────────────────────────────────────────────────────────────┐
│   INDEPENDENT BLOG PUBLISHING                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Backend Completion:                                           │
│   → develop_reviewer publishes "Step X.Y Backend - Dev Log"    │
│                                                                 │
│   Frontend Completion:                                          │
│   → develop_reviewer publishes "Step X.Y Frontend - Dev Log"   │
│   → design_reviewer publishes "Page - Design Review"           │
│                                                                 │
│   Both can publish independently and concurrently               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1.2 Agent Assignment

| Track | Primary Agent | Support Agents |
|-------|---------------|----------------|
| Backend | `planner` + general-purpose | `database-reviewer`, `security-reviewer` |
| Frontend | `planner` + general-purpose | `chief-ui-designer`, `design_reviewer` |

**Parallel Execution:**
- Backend and Frontend can be developed simultaneously
- Each has its own worktree and branch
- Merge to main after both complete and tests pass

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
├── Phase 9: Competitive Analysis ✅
├── Phase 10: MCP Server Development ✅
├── Phase 11: Technical Quality Improvement (CTO Evaluation)
├── Phase 12: Draft Bucket System
├── Phase 13: Dual-Layer Publishing
└── Phase 14: Visual Redesign
```

---

## 3. Phase 9: Competitive Analysis (COMPLETED)

**Goal:** Deep-dive analysis of competitors to inform product differentiation

**Status:** Completed (2026-03-16)

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
**Status:** Completed

**Deliverable:** Analysis of Medium for reader experience

**Checkpoints:**
- [x] **9.6.1 Reading Experience Analysis**
  - [x] Document typography choices (21px Georgia, 1.6 line-height)
  - [x] Identify reading flow patterns (progress bar, scroll tracking)
  - [x] Analyze engagement features (clap, save, highlight, share)
  - [x] Cache: `traditional-blogs/medium-analysis.md`

- [x] **9.6.2 Platform Analysis**
  - [x] Document information architecture (feed, library, profile)
  - [x] Identify discovery mechanisms (tags, publications, following)
  - [x] Analyze monetization model ($5 membership, partner program)
  - [x] Document writer features (stats, drafts, publications)

**Key Findings:**
- Score: 21/25 (Reference for reading experience)
- **Reading Typography:** 21px Georgia serif, 1.6 line-height, 680px max-width
- **Engagement:** Clap system (1-50), highlight & share, save to library
- **Discovery:** Infinite scroll feed, personalized recommendations, tag browsing
- **Writer Tools:** Stats dashboard, draft auto-save, publication submission
- **Monetization:** Membership paywall (3 free articles), Partner Program

**Applicable Patterns for Viblog:**
1. **Reading Typography** - Adopt 21px serif body text for long-form reading
2. **Progress Indicator** - Reading progress bar at top of viewport
3. **Estimated Read Time** - Adapt for AI readers with token estimates
4. **Appreciation System** - Single-action (star/fork) instead of 50 claps
5. **Related Content** - Contextually similar articles at end of post

**Differentiation Opportunities:**
- Dual-layer content (Human + AI readable)
- MCP protocol integration (unlike Medium's closed API)
- Rich code snippet handling (vs basic code blocks)
- Session context (Draft buckets from coding sessions)

---

### Step 9.7: Analyze Dribbble (Priority 6 - Visual Design Showcase)
**Status:** Completed

**Deliverable:** Analysis of Dribbble for high-end visual design patterns

**Why Critical:** Dribbble is the premier design showcase platform - essential for understanding what "premium visual design" looks like. Viblog needs to feel like a designer-made product, not a generic blog.

**Checkpoints:**
- [x] **9.7.1 Web Scraping**
  - [x] Scrape homepage for shot grid layout
  - [x] Scrape individual shot pages for detail view
  - [x] Document hover interaction descriptions
  - [x] Cache: `visual-design/dribbble-analysis.md` (integrated)

- [x] **9.7.2 Screenshot Capture (Playwright)**
  - [x] Homepage shot grid
  - [x] Shot detail page (with sidebar)
  - [x] Profile/portfolio page
  - [x] Explore page grid
  - [x] Full shot page (landing page design)
  - [x] Cache: `visual-design/dribbble_screenshots/`

- [x] **9.7.3 Visual Analysis (image-analyzer-kimi)**
  - [x] Shot card design and dimensions
  - [x] Hover effect details (scale, overlay, actions)
  - [x] Grid spacing and layout
  - [x] Color palette and typography
  - [x] Navigation and search patterns

- [x] **9.7.4 Design Pattern Extraction**
  - [x] Card hover animations (timing, easing)
  - [x] Overlay action buttons design
  - [x] User attribution display
  - [x] Like/save interaction patterns
  - [x] Infinite scroll behavior

**Key Findings:**
- Score: 22/25 (Reference for premium visual design)
- **Grid System:** 4-column responsive grid, 24px horizontal gutters, 32-40px vertical gutters
- **Shot Cards:** 4:3 or 16:10 aspect ratio, 8-12px border radius, subtle hover elevation
- **Hover Effect:** `transform: translateY(-4px)` + box-shadow, 200ms transition
- **Color Palette:** Pink accent #ea4c89 (used sparingly), high contrast black/white
- **Typography:** Clean sans-serif, strong hierarchy (32-36px titles, 14-16px body)
- **Whitespace Philosophy:** 60-80px section gaps, generous padding (24-32px)

**Premium Design Principles for Viblog:**
1. **Whitespace is Premium** - 60-80px section gaps create luxury feel
2. **Consistency Creates Trust** - Same border radius (8-12px) throughout
3. **One Accent Color** - Pink used sparingly for maximum impact
4. **Content First** - Let images breathe, minimal UI chrome
5. **Hover Delight** - Subtle elevation and shadow on interaction

**Technical Translation (CSS):**
```css
/* Dribbble-inspired Article Card */
.article-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Grid Layout */
.article-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 32px;
}
```

**Screenshots Analyzed:**
- `01-homepage.png` - Hero section, navigation, featured shots
- `02-explore-shots-grid.png` - 4-column grid layout, shot cards
- `03-shot-detail-page.png` - Shot display, profile card, related shots
- `04-profile-page.png` - Designer profile, 3-column portfolio grid
- `05-landing-page-shot-full.png` - Full page: landing page design shot with services

---

### Step 9.8: Analyze Awwwards (Priority 7 - Premium Web Design)
**Status:** Completed

**Deliverable:** Analysis of Awwwards for cutting-edge web design patterns

**Why Critical:** Awwwards showcases the best of web design - this is where "high-end visual presentation" is defined. Essential for making Viblog feel like a premium, design-forward product rather than a typical blog.

**Checkpoints:**
- [x] **9.8.1 Web Scraping**
  - [x] Scrape homepage for award site cards
  - [x] Scrape individual site showcase pages
  - [x] Document animation techniques described
  - [x] Cache: `visual-design/awwwards-analysis.md`

- [x] **9.8.2 Screenshot Capture (Playwright)**
  - [x] Homepage with SOTD hero
  - [x] Winners grid (3-column)
  - [x] Site detail page with scores
  - [x] Jury voting table
  - [x] Directory page
  - [x] User Dashboard
  - [x] Pricing/Submit page
  - [x] Elements gallery
  - [x] Academy course detail
  - [x] Cache: `visual-design/awwwards_screenshots/` (12 screenshots)

- [x] **9.8.3 Visual Analysis (12 parallel agents)**
  - [x] SOTD badge design (border-style, score display)
  - [x] Site card design (16:10 aspect ratio)
  - [x] Pricing contrast pattern (dark/light cards)
  - [x] Navigation patterns
  - [x] Typography for design authority (72-96px titles)
  - [x] Dashboard grid layout (3-column)

- [x] **9.8.4 Premium Pattern Extraction**
  - [x] What defines "award-winning" visual design
  - [x] How to balance creativity with usability
  - [x] Typography choices for design-forward products
  - [x] Dark/light pricing contrast pattern
  - [x] Score transparency for credibility

**Key Findings:**
- Score: 22/25 (Reference for premium award platforms)
- **SOTD Badge:** Border-style with large score number (7.36/10)
- **Pricing Pattern:** Dark Pro card (2x width) vs White Standard card
- **Grid System:** 3-column for winners, 2-column for directory
- **Typography:** 72-96px for major titles, minimal color usage
- **Dashboard:** 10-item grid with icon + title + description cards
- **Score Transparency:** Jury votes visible with individual scores

**Critical Insights for Viblog:**
1. Quality score badge design - border-style with prominent number
2. Dark/light pricing contrast highlights preferred option
3. Jury/expert validation builds credibility
4. Minimal color palette (black/white/gray) feels premium
5. Floating bottom navigation for mobile-friendly access

**Screenshots Analyzed (12 total):**
- `01-homepage-hero.png` - Hero, SOTD display, navigation
- `02-homepage-winners.png` - Winners cards, grid layout
- `03-winners-grid.png` - 3-column grid, site cards, filters
- `04-site-detail-sotd.png` - SOTD header, badge design
- `05-scoring-jury-votes.png` - Score breakdown, jury voting
- `06-directory-page.png` - Professional directory, dark cards
- `07-sotd-detail-full.png` - Full detail page with elements
- `08-user-profile.png` - Profile page, stats table
- `09-user-dashboard.png` - Dashboard with 10 menu items
- `10-submit-page.png` - Pricing cards, Standard vs Pro
- `11-elements-page.png` - Elements gallery, video previews
- `12-academy-course-detail.png` - Course page, chapters

---

### Step 9.9: Synthesize Findings
**Status:** Completed

**Deliverable:** Competitive analysis summary with actionable insights

**Checkpoints:**
- [x] Create feature comparison matrix
- [x] Identify 5 key differentiation opportunities
- [x] Document technical implementation recommendations
- [x] Update `PRODUCT_COMP_ANALYSIS.md` with full analysis
- [x] Present findings for user review

**Output Artifacts:**
1. `PRODUCT_COMP_ANALYSIS.md` - Complete analysis report with synthesis
2. `.comp_product_assets/` - All cached screenshots and raw data (7 products)
3. Feature comparison matrix (in Section 6.2)
4. Differentiation strategy document (in Section 6.3)

**Key Findings:**

| Product | Score | Key Takeaway |
|---------|-------|--------------|
| Cursor IDE | 24/25 | Reference for AI-native IDE |
| Notion | 24/25 | Reference for AI-native content creation |
| Claude Code | 23/25 | Reference for MCP protocol |
| Pinterest | 22/25 | Reference for visual-first feeds |
| Dribbble | 22/25 | Reference for premium visual design |
| Awwwards | 22/25 | Reference for premium award platforms |
| Medium | 21/25 | Reference for reading experience |

**5 Key Differentiation Opportunities:**
1. **MCP-Native Blogging Platform** (P0) - First mover advantage
2. **Session-to-Article Automation** (P0) - 10x faster content creation
3. **Dual-Layer Content Format** (P0) - Human + AI consumable
4. **Pinterest-Style Article Cards** (P1) - Visual quality differentiation
5. **AI-Native Reading Experience** (P1) - Code-optimized typography

**Phase 9 Status:** COMPLETED

---

## 4. Phase 10: AI-Data-Native MCP Platform

**Goal:** Build AI-Data-Native MCP platform with complete data architecture

**Estimated Effort:** 6-8 weeks

**Dependencies:** Phase 9 completion

**Strategic Context:** Phase 10 implements the AI-Data-Native architecture designed in brainstorming sessions (2026-03-16)

---

### Phase 10 Dual-Track Planning

```
┌─────────────────────────────────────────────────────────────────┐
│   PHASE 10: BACKEND/FRONTEND SPLIT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   BACKEND TRACK                 FRONTEND TRACK                  │
│   =============                ================                 │
│   - Database migrations         - UI components                 │
│   - API endpoints               - Page layouts                  │
│   - MCP server                  - Design system                 │
│   - Vector search               - User interactions             │
│   - Tests (API/Unit)            - Tests (E2E)                   │
│                                                                 │
│   Worktree: backend/            Worktree: frontend/             │
│   Branch: feature/phase10-be    Branch: feature/phase10-fe      │
│   Agent: backend-developer      Agent: frontend-developer       │
│                                                                 │
│   PARALLEL DEVELOPMENT ENABLED                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Architecture Decisions (From Brainstorming 2026-03-16)

#### Decision 1: Hybrid Data Architecture
```
User Database (Supabase/Local)          Viblog Platform Database
├── vibe_sessions (raw session)         ├── published_articles (public copy)
├── session_fragments                   ├── article_paragraphs (for retrieval)
├── articles (draft/private)            ├── annotations (public)
├── external_links (user citations)     ├── user_interactions (analytics)
├── user_insights (reflections)         ├── user_credits (incentives)
├── insight_links (associations)        └── authorization_tokens
└── knowledge_graph (personal)

Core Principle: Private data stays in user database;
published content syncs to platform with user authorization.
```

#### Decision 2: AI-Data-Native = Four Data Protocols
```
1. Structured Data (JSON Schema)    → MCP tool param parsing, Article JSON
2. Vector Embeddings (pgvector)     → Semantic retrieval, Similarity search
3. Knowledge Graph (Apache AGE)     → Association reasoning, Citation discovery
4. Time Series (TimescaleDB)        → Interest evolution, Trend analysis
```

#### Decision 3: AI Data Access Protocol
```typescript
// AI obtains this when accessing Viblog
interface AIDataSchema {
  datasources: DataSource[];
  schemas: JSONSchema[];
  vectorStores: VectorStore[];
  knowledgeGraphs: KnowledgeGraph[];
  timeSeries: TimeSeries[];
  authorization: AuthorizationStatus;
}
```

#### Decision 4: Authorization Model
```
Three-Level Privacy:
├── Level 1: Sensitive fields desensitized (default)
├── Level 2: Fully transparent (user confirmation required)
└── Level 3: Training authorization (+50 credits/month)

Data Source Authorization:
├── user_insights → [ ] Authorize
├── external_links → [ ] Authorize
├── vibe_sessions → [ ] Authorize (contribute training data)
└── knowledge_graph → [ ] Authorize
```

#### Decision 5: Draft Bucket Model
**Chosen: Independent drafts table (Option B)**

Rationale:
- Clear separation: sessions = raw data, drafts = processed content
- Better query performance for draft management
- Enables multiple drafts per session
- Cleaner status workflow (raw → structured → draft → published)

---

### Phase 10.1: Database Infrastructure (Week 1-2)

**Status:** COMPLETED (2026-03-16)

#### Step 10.1.1: Enable Vector and Graph Extensions
**Status:** Completed

**Deliverable:** PostgreSQL extensions enabled (pgvector), fallback implementations for AGE/TimescaleDB

**Tasks:**
- [x] Enable pgvector extension
- [x] Create JSONB-based graph storage (graph_nodes, graph_edges) as Apache AGE fallback
- [x] Create time-optimized indices as TimescaleDB fallback
- [x] Document microservice migration paths for future extraction

---

#### Step 10.1.2: Create AI-Data-Native Tables
**Status:** Completed

**Deliverable:** All new tables with RLS policies

**Tasks:**
- [x] Create `external_links` table (User DB)
- [x] Create `user_insights` table (User DB)
- [x] Create `insight_links` table (User DB)
- [x] Create `article_paragraphs` table (Platform DB)
- [x] Create `annotations` table (Platform DB)
- [x] Create `user_interactions` table (Platform DB)
- [x] Create `user_credits` table (Platform DB)
- [x] Create `credit_transactions` table (Platform DB)
- [x] Create `authorization_tokens` table (Platform DB)
- [x] Add RLS policies for all tables
- [x] Generate TypeScript types

---

#### Step 10.1.3: MCP API Key and Authorization Token System
**Status:** Completed

**Deliverable:** Secure key/token generation and management

**Tasks:**
- [x] Create API key generation endpoint
- [x] Create authorization token generation endpoint
- [x] Implement secure key hashing (SHA-256)
- [x] Add key/token display in settings page (masked)
- [x] Implement key/token revocation endpoints
- [x] Add last-used tracking

**Key Format:**
- MCP API Key: `vb_xxxxxxxxxxxxxxxxxxxxxxxx`
- Authorization Token: `vat_xxxxxxxxxxxxxxxxxxxxxxxx`

---

### Phase 10.2: Core MCP Tools Implementation (Week 2-4)

**Status:** COMPLETED (2026-03-17)

**Implementation Notes:**
- Used fetch-based OpenAI API calls instead of SDK (zod version conflict)
- All 5 MCP tools implemented as REST API endpoints
- Created validation schemas in `src/lib/validations/`
- LLM service in `src/lib/llm-service.ts`

#### Step 10.2.1: Implement create_vibe_session Tool
**Status:** COMPLETED

**Deliverable:** MCP tool for creating new vibe coding sessions

**Tasks:**
- [x] Define Zod schema for input validation
- [x] Implement API client call to Viblog backend
- [x] Handle error responses
- [x] Return session_id for subsequent calls

**Files:**
- `src/lib/validations/vibe-session.ts`
- `src/app/api/vibe-sessions/route.ts`

---

#### Step 10.2.2: Implement append_session_context Tool
**Status:** COMPLETED

**Deliverable:** MCP tool for incremental session data append

**Tasks:**
- [x] Define context type schemas
- [x] Implement API endpoint for fragment append
- [x] Auto-assign sequence_number if not provided
- [x] Add session ownership verification

**Files:**
- `src/app/api/vibe-sessions/[id]/fragments/route.ts`

---

#### Step 10.2.3: Implement upload_session_context Tool
**Status:** COMPLETED

**Deliverable:** MCP tool for batch upload of complete session context

**Files:**
- `src/app/api/vibe-sessions/[id]/fragments/route.ts` (PUT method)

---

#### Step 10.2.4: Implement generate_structured_context Tool
**Status:** COMPLETED

**Deliverable:** MCP tool for transforming raw data into structured JSON

**Tasks:**
- [x] Define StructuredVibeContext output schema
- [x] Integrate with LLM API (OpenAI GPT-4o)
- [x] Handle JSON response parsing

**Files:**
- `src/lib/validations/structured-context.ts`
- `src/lib/llm-service.ts`
- `src/app/api/vibe-sessions/generate-structured-context/route.ts`

---

#### Step 10.2.5: Implement generate_article_draft Tool
**Status:** COMPLETED

**Deliverable:** MCP tool for generating article draft from structured session

**Files:**
- `src/app/api/vibe-sessions/generate-article-draft/route.ts`

---

### Phase 10.3: AI Data Access Protocol (Week 3-4)

**Status:** COMPLETED (2026-03-17)

#### Step 10.3.1: Implement AIDataSchema Endpoint
**Status:** Completed

**Deliverable:** Endpoint returning available data sources and schemas

**Tasks:**
- [x] Create `/api/v1/ai/schema` endpoint
- [x] Implement datasource discovery based on authorization
- [x] Return JSON Schema definitions
- [x] Return vector store configurations
- [x] Return knowledge graph configurations

---

#### Step 10.3.2: Implement Vector Search API
**Status:** Completed

**Deliverable:** Vector similarity search endpoints

**Tasks:**
- [x] Create `/api/v1/ai/vectors/{store}/search` endpoint
- [x] Implement embedding generation (OpenAI API)
- [x] Configure pgvector indexes (IVFFlat/HNSW) - deferred to migration
- [x] Add search result ranking

**Vector Stores:**
| Store | Content | Dimension | Storage |
|-------|---------|-----------|---------|
| article_paragraphs | Article paragraphs | 1536 | Platform DB |
| user_insights | User insights | 1536 | User DB |
| external_links | Link snapshots | 1536 | User DB |
| articles | Article overall | 1536 | Platform DB |

---

#### Step 10.3.3: Implement Knowledge Graph API
**Status:** Completed

**Deliverable:** Graph query endpoints for AI

**Tasks:**
- [x] Create `/api/v1/ai/graph/{graph}/query` endpoint
- [x] Define node types and edge types
- [x] Implement SQL-based graph queries (Supabase compatible)
- [x] Add graph visualization data export

---

#### Step 10.3.4: Implement Time Series API
**Status:** Completed

**Deliverable:** Behavioral analytics endpoints

**Tasks:**
- [x] Create `/api/v1/ai/timeseries/{metric}` endpoint
- [x] Implement time-based aggregation (PostgreSQL date_trunc)
- [x] Implement aggregation queries
- [x] Add trend analysis functions

---

### Phase 10.4: MCP Server npm Package (Week 4-5)

**Status:** IN PROGRESS (2026-03-17)

**Decision:** stdio-based npm package (not HTTP endpoint)

**Rationale:**
- Simpler authentication (copy-paste API key from Web UI)
- No OAuth complexity for MVP
- Easier Claude Code integration
- Can migrate to HTTP/SSE later for multi-platform support

#### Step 10.4.0: Create MCP Server npm Package
**Status:** COMPLETED

**Deliverable:** Complete npm package structure with stdio transport

**Files Created:**
```
packages/viblog-mcp-server/
├── package.json              # Package config with @modelcontextprotocol/sdk
├── tsconfig.json             # TypeScript config (ESM, NodeNext)
├── README.md                 # Installation and usage guide
└── src/
    ├── index.ts              # Entry point (stdio server)
    ├── server.ts             # MCP Server setup
    ├── types.ts              # Shared types and config
    ├── tools/
    │   ├── index.ts          # 6 MVP tools definition
    │   └── handlers.ts       # Tool execution logic
    └── api/
        └── client.ts         # REST API client
```

**MVP Tools (6 implemented):**
1. `create_vibe_session` - Create recording session
2. `append_session_context` - Add context incrementally
3. `upload_session_context` - Batch upload
4. `generate_structured_context` - AI processing
5. `generate_article_draft` - Create draft from session
6. `list_user_sessions` - List user's sessions

---

#### Step 10.4.1: Smart Markdown Editor
**Status:** Pending

**Deliverable:** AI-assisted Markdown editor

**Tasks:**
- [ ] Create editor component with live preview
- [ ] Implement AI formatting suggestions
- [ ] Add auto heading level detection
- [ ] Implement code block language detection
- [ ] Add table of contents generation

---

#### Step 10.4.2: External Link Citation System
**Status:** Pending

**Deliverable:** Link aggregation and citation features

**Tasks:**
- [ ] Create link paste and fetch UI
- [ ] Implement page snapshot with authorization
- [ ] Create insight-link association UI
- [ ] Add citation preview in editor
- [ ] Implement article generation from insights

---

#### Step 10.4.3: Annotation System
**Status:** Pending

**Deliverable:** Article highlighting and margin notes

**Tasks:**
- [ ] Create text selection and highlight UI
- [ ] Implement annotation creation modal
- [ ] Add annotation sidebar for reading
- [ ] Implement discussion/reply functionality
- [ ] Add annotation dashboard view
- [ ] Handle article edit detection for annotations

---

#### Step 10.4.4: Credits System
**Status:** Pending

**Deliverable:** Complete credits earning and redemption flow

**Tasks:**
- [ ] Create credits dashboard
- [ ] Implement earning opportunities UI
- [ ] Add transaction history view
- [ ] Implement credits redemption flow
- [ ] Add Pro bonus calculation

---

#### Step 10.4.5: Authorization Settings UI
**Status:** Pending

**Deliverable:** User control panel for AI data access

**Tasks:**
- [ ] Create data source toggle UI
- [ ] Implement privacy level selection
- [ ] Add token management interface
- [ ] Create authorization status dashboard

---

### Phase 10.5: Testing & Documentation (Week 6-8)

#### Step 10.5.1: MCP Server Unit Tests
**Status:** Pending

**Deliverable:** Comprehensive unit tests for MCP tools

**Tasks:**
- [ ] Test tool input validation (100% coverage)
- [ ] Test API client calls (90% coverage)
- [ ] Test error handling (100% coverage)
- [ ] Test rate limiting (90% coverage)

---

#### Step 10.5.2: Integration Tests
**Status:** Pending

**Deliverable:** Integration tests for all new features

**Tasks:**
- [ ] Test full session lifecycle
- [ ] Test vector search flows
- [ ] Test annotation system end-to-end
- [ ] Test credits earning and redemption
- [ ] Test authorization flows

---

#### Step 10.5.3: Documentation
**Status:** Pending

**Deliverable:** Comprehensive MCP server documentation

**Tasks:**
- [ ] Write installation and setup guide
- [ ] Document all available tools and parameters
- [ ] Create Claude Code integration guide
- [ ] Create Cursor integration guide
- [ ] Document AI-Data-Schema protocol
- [ ] Add troubleshooting guide

---

### Success Criteria

- [ ] MCP server installable via `npx @viblog/mcp-server`
- [ ] All 5 core tools implemented and tested
- [ ] AI-Data-Schema endpoint returns correct metadata
- [ ] Vector search returns relevant results (>75% precision)
- [ ] Annotation system handles article edits correctly
- [ ] Credits system tracks earnings accurately
- [ ] Authorization tokens control data access correctly
- [ ] Response time < 500ms for 95th percentile
- [ ] Unit test coverage >= 80%
- [ ] Integration tests pass for all critical flows
- [ ] Security review completed

---

## 5. Phase 11: Technical Quality Improvement (CTO Evaluation)

**Goal:** Address P0/P1 technical debt identified in CTO evaluation to achieve Grade A (80+) system quality

**Source:** CTO Technical Evaluation (2026-03-17) - Overall Score: 75/100, Grade B, Conditional Approval

**Estimated Effort:** 2-3 weeks

**Dependencies:** Phase 10.4 completion (MCP MVP complete)

**P0 Blocker:** Test coverage at 20% MUST reach 60%+ before production scaling

---

### Phase 11.0: CTO Evaluation Summary

```
┌─────────────────────────────────────────────────────────────────┐
│   CTO TECHNICAL EVALUATION - 2026-03-17                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Overall Score: 75/100 (Grade B - Conditional Approval)       │
│                                                                 │
│   10 Technical Metrics:                                        │
│   ├── Architecture Alignment:    8/10 (Strong)                 │
│   ├── Code Quality:              7/10 (Good, needs cleanup)    │
│   ├── Performance Impact:        7/10 (Acceptable, no cache)   │
│   ├── Security Posture:          7/10 (Good, rate limiting)    │
│   ├── Test Coverage:             3/10 (CRITICAL - 20%)         │
│   ├── Error Handling:            6/10 (Gaps in API routes)     │
│   ├── Maintainability:           8/10 (Good structure)         │
│   ├── Scalability:               7/10 (Good, needs monitoring) │
│   ├── Documentation:             8/10 (Comprehensive)          │
│   └── Technical Debt:            6/10 (Some debt, manageable)  │
│                                                                 │
│   P0 Issues (BLOCK):                                           │
│   1. Test coverage at 20% (target: 80%, minimum: 60%)          │
│   2. Missing rate limiting (production risk)                   │
│   3. Error handling gaps in API routes                         │
│                                                                 │
│   P1 Issues (HIGH):                                            │
│   1. No caching layer (performance under load)                 │
│   2. Missing monitoring/observability                          │
│   3. No CI/CD for npm package                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 11.1: Test Coverage Expansion (P0 - BLOCKER)

**Priority:** CRITICAL - Must complete before production scaling

**Current State:** 20% coverage
**Target:** 60%+ (Phase 11), 80%+ (Phase 12)

**Deliverable:** Test coverage increased to 60%+

#### Step 11.1.1: MCP Server Unit Tests
**Status:** Pending

**Deliverable:** 90%+ coverage for MCP server package

**Tasks:**
- [ ] Test tool input validation (100% coverage)
  - [ ] `create_vibe_session` validation tests
  - [ ] `append_session_context` validation tests
  - [ ] `upload_session_context` validation tests
  - [ ] `generate_structured_context` validation tests
  - [ ] `generate_article_draft` validation tests
  - [ ] `list_user_sessions` validation tests
- [ ] Test API client calls (90% coverage)
  - [ ] Mock HTTP responses for success cases
  - [ ] Mock HTTP errors (4xx, 5xx)
  - [ ] Test timeout handling
  - [ ] Test retry logic
- [ ] Test error handling (100% coverage)
  - [ ] Invalid input errors
  - [ ] Authentication failures
  - [ ] Network errors
  - [ ] Rate limiting responses

**Files to Create:**
```
packages/viblog-mcp-server/
├── src/
│   ├── tools/
│   │   └── handlers.test.ts
│   └── api/
│       └── client.test.ts
```

**Test Framework:** Vitest (already in project)

**Coverage Target:** 90%+ for MCP server package

---

#### Step 11.1.2: API Route Integration Tests
**Status:** Pending

**Deliverable:** Integration tests for all vibe-session endpoints

**Tasks:**
- [ ] Test `/api/vibe-sessions` (POST) - create session
  - [ ] Valid request returns 201 with session_id
  - [ ] Invalid input returns 400 with error details
  - [ ] Unauthorized returns 401
  - [ ] Rate limited returns 429
- [ ] Test `/api/vibe-sessions/[id]/fragments` (POST) - append fragment
  - [ ] Valid fragment types accepted
  - [ ] Invalid fragment_type rejected
  - [ ] Session ownership verified
  - [ ] Sequence number auto-assigned
- [ ] Test `/api/vibe-sessions/[id]/fragments` (PUT) - batch upload
  - [ ] Batch upload replaces existing fragments
  - [ ] Array validation
- [ ] Test `/api/vibe-sessions/generate-structured-context` (POST)
  - [ ] LLM integration (mocked)
  - [ ] Error handling for LLM failures
- [ ] Test `/api/vibe-sessions/generate-article-draft` (POST)
  - [ ] Article generation flow
  - [ ] LLM key validation

**Files to Create:**
```
src/app/api/vibe-sessions/
├── route.test.ts
├── [id]/
│   └── fragments/
│       └── route.test.ts
├── generate-structured-context/
│   └── route.test.ts
└── generate-article-draft/
    └── route.test.ts
```

**Coverage Target:** 80%+ for API routes

---

#### Step 11.1.3: Authentication Tests
**Status:** Pending

**Deliverable:** Complete test coverage for dual-auth system

**Tasks:**
- [ ] Test `dual-auth.ts` middleware
  - [ ] Supabase session authentication
  - [ ] MCP API Key authentication
  - [ ] Priority: API Key > Session
  - [ ] Error responses for invalid credentials
- [ ] Test `token-auth.ts` utility
  - [ ] Token validation
  - [ ] Token expiration handling
  - [ ] Service role client creation

**Files to Create:**
```
src/lib/auth/
├── dual-auth.test.ts
└── token-auth.test.ts
```

**Coverage Target:** 100% for auth utilities

---

### Phase 11.2: Rate Limiting Implementation (P0 - CRITICAL)

**Priority:** CRITICAL - Production security requirement

**Deliverable:** Rate limiting for all API endpoints

#### Step 11.2.1: Implement Rate Limiter Middleware
**Status:** Pending

**Deliverable:** Configurable rate limiting middleware

**Tasks:**
- [ ] Create rate limiter utility
  - [ ] Sliding window algorithm
  - [ ] Per-IP and per-user limits
  - [ ] Configurable thresholds
- [ ] Add Redis-based distributed rate limiting (optional, use in-memory fallback)
- [ ] Integrate with Next.js middleware
- [ ] Add rate limit headers to responses
  - [ ] `X-RateLimit-Limit`
  - [ ] `X-RateLimit-Remaining`
  - [ ] `X-RateLimit-Reset`

**Configuration:**
```typescript
const rateLimits = {
  // MCP API endpoints - higher limits for legitimate use
  'api/vibe-sessions': { limit: 100, window: '1m' },
  'api/vibe-sessions/*/fragments': { limit: 500, window: '1m' },

  // LLM-powered endpoints - lower limits (cost control)
  'api/vibe-sessions/generate-*': { limit: 20, window: '1m' },

  // Auth endpoints - strict limits
  'api/auth/*': { limit: 10, window: '1m' },
}
```

**Files to Create:**
```
src/lib/
├── rate-limit.ts          # Rate limiter utility
└── middleware/
    └── rate-limit.ts      # Next.js middleware integration
```

---

#### Step 11.2.2: Apply Rate Limiting to Endpoints
**Status:** Pending

**Tasks:**
- [ ] Apply rate limiting to `/api/vibe-sessions/*`
- [ ] Apply rate limiting to `/api/v1/ai/*`
- [ ] Add environment-based configuration (stricter in production)
- [ ] Add monitoring for rate limit violations

---

### Phase 11.3: Error Handling Improvements (P0 - HIGH)

**Priority:** HIGH - User experience and debugging

**Deliverable:** Consistent error handling across all API routes

#### Step 11.3.1: Standardize Error Responses
**Status:** Pending

**Deliverable:** Consistent error response format

**Tasks:**
- [ ] Create error response utility
  ```typescript
  interface APIError {
    error: {
      code: string;       // 'VALIDATION_ERROR', 'AUTH_ERROR', etc.
      message: string;    // User-friendly message
      details?: unknown;  // Additional context (dev only)
    }
  }
  ```
- [ ] Define error codes enum
- [ ] Create error handling middleware
- [ ] Add request ID for debugging

**Files to Create:**
```
src/lib/
├── api-errors.ts         # Error codes and utilities
└── error-handler.ts      # Error handling middleware
```

---

#### Step 11.3.2: Audit and Fix API Routes
**Status:** Pending

**Tasks:**
- [ ] Audit all API routes for error handling gaps
- [ ] Add try/catch to all route handlers
- [ ] Ensure consistent error responses
- [ ] Add logging for unhandled errors
- [ ] Test error paths in integration tests

**Files to Update:**
- `src/app/api/vibe-sessions/route.ts`
- `src/app/api/vibe-sessions/[id]/fragments/route.ts`
- `src/app/api/vibe-sessions/generate-structured-context/route.ts`
- `src/app/api/vibe-sessions/generate-article-draft/route.ts`

---

### Phase 11.4: Caching Layer (P1 - PERFORMANCE)

**Priority:** HIGH - Performance under load

**Deliverable:** Redis caching for frequently accessed data

#### Step 11.4.1: Implement Cache Layer
**Status:** Pending

**Tasks:**
- [ ] Add Redis client configuration
- [ ] Create cache utility with TTL support
- [ ] Implement cache-aside pattern
- [ ] Add cache invalidation hooks

**Files to Create:**
```
src/lib/
├── cache/
│   ├── client.ts         # Redis client
│   ├── cache.ts          # Cache utility
│   └── invalidation.ts   # Cache invalidation
```

---

#### Step 11.4.2: Apply Caching to Endpoints
**Status:** Pending

**Tasks:**
- [ ] Cache `list_user_sessions` results (5 min TTL)
- [ ] Cache user authentication validation (15 min TTL)
- [ ] Cache LLM-generated structured context (1 hour TTL)
- [ ] Add cache headers for static responses

---

### Phase 11.5: Monitoring & Observability (P1 - OPERATIONS)

**Priority:** HIGH - Production visibility

**Deliverable:** Comprehensive logging and monitoring

#### Step 11.5.1: Structured Logging
**Status:** Pending

**Tasks:**
- [ ] Implement structured JSON logging
- [ ] Add request ID tracking
- [ ] Add performance timing logs
- [ ] Integrate with Vercel Analytics

**Files to Create:**
```
src/lib/
└── logger.ts             # Structured logging utility
```

---

#### Step 11.5.2: Health Check Endpoints
**Status:** Pending

**Tasks:**
- [ ] Create `/api/health` endpoint
  - [ ] Database connectivity
  - [ ] Redis connectivity (if configured)
  - [ ] External API status
- [ ] Create `/api/health/ready` for Kubernetes readiness
- [ ] Create `/api/health/live` for Kubernetes liveness

---

### Phase 11.6: MCP Package CI/CD (P1 - DEVOPS)

**Priority:** MEDIUM - Release automation

**Deliverable:** Automated testing and publishing for MCP package

#### Step 11.6.1: GitHub Actions for MCP Package
**Status:** Pending

**Tasks:**
- [ ] Create CI workflow for MCP package
  - [ ] Type checking
  - [ ] Unit tests
  - [ ] Build verification
- [ ] Create CD workflow for npm publishing
  - [ ] Trigger on version tag
  - [ ] Run tests before publish
  - [ ] Publish to npm registry

**Files to Create:**
```
.github/workflows/
├── mcp-ci.yml            # CI for MCP package
└── mcp-publish.yml       # CD for npm publishing
```

---

### Phase 11 Success Criteria

**P0 Requirements (BLOCK):**
- [ ] Test coverage >= 60% (current: 20%)
- [ ] Rate limiting implemented on all API endpoints
- [ ] Consistent error handling across all routes

**P1 Requirements (HIGH):**
- [ ] Caching layer operational (Redis or in-memory fallback)
- [ ] Structured logging with request tracking
- [ ] Health check endpoints deployed

**Quality Gate:**
- [ ] CTO Technical Score >= 80 (Grade A)
- [ ] All P0 issues resolved
- [ ] No regression in existing functionality

---

## 6. Phase 12: Draft Bucket System

**Goal:** Implement session-to-draft workflow for content creation

**Estimated Effort:** 1-2 weeks

**Dependencies:** Phase 11 completion (quality improvements)

---

### Step 12.1: Draft Bucket Data Model
**Status:** Pending

**Deliverable:** Database schema and API for draft management

**Tasks:**
- [ ] Create `draft_buckets` table
  - [ ] Link to vibe_sessions
  - [ ] Draft status (raw, structured, ready, published)
  - [ ] Version history
- [ ] Create draft management API
  - [ ] Create draft from session
  - [ ] Update draft content
  - [ ] List user drafts
  - [ ] Delete draft

---

### Step 12.2: Draft Editor Integration
**Status:** Pending

**Deliverable:** UI for editing and managing drafts

**Tasks:**
- [ ] Create draft list page
- [ ] Create draft editor page
- [ ] Add AI-assisted content refinement
- [ ] Implement auto-save

---

## 7. Phase 13: Dual-Layer Publishing

**Goal:** Implement human-readable + AI-readable content publishing

**Estimated Effort:** 1-2 weeks

**Dependencies:** Phase 12 completion (draft bucket system)

---

### Step 13.1: Dual-Layer Content Format
**Status:** Pending

**Deliverable:** JSON + Markdown content structure

**Tasks:**
- [ ] Define dual-layer content schema
  - [ ] Human layer: Markdown with formatting
  - [ ] AI layer: Structured metadata (JSON)
- [ ] Implement content transformer
- [ ] Update article rendering

---

### Step 13.2: Publishing Workflow
**Status:** Pending

**Deliverable:** Complete draft-to-publish workflow

**Tasks:**
- [ ] Create publish endpoint
- [ ] Implement SEO metadata generation
- [ ] Add social sharing integration
- [ ] Create publish confirmation flow

---

## 8. Phase 14: Visual Redesign

**Goal:** Implement Pinterest-style card layout and premium visual design

**Estimated Effort:** 2 weeks

**Dependencies:** Phase 10 completion (uses new data structures)

---

### Step 14.1: Card Component Redesign
**Status:** Pending

**Deliverable:** New article card component with Pinterest-style design

**Tasks:**
- [ ] Design new card in Figma
- [ ] Implement card component with hover effects
- [ ] Add masonry grid layout
- [ ] Optimize for performance
- [ ] Add responsive breakpoints

---

### Step 14.2: Masonry Grid Layout
**Status:** Pending

**Deliverable:** Pinterest-style grid layout

**Tasks:**
- [ ] Implement masonry grid with CSS Grid
- [ ] Add lazy loading for images
- [ ] Implement infinite scroll
- [ ] Optimize for mobile

---

### Step 14.3: Visual Polish
**Status:** Pending

**Deliverable:** Premium visual design throughout

**Tasks:**
- [ ] Update color system (from Dribbble analysis)
- [ ] Add micro-interactions (from Pinterest analysis)
- [ ] Improve typography (from Medium analysis)
- [ ] Add loading animations
- [ ] Implement dark-first design

---

## 9. Dependency Graph (Updated)

```
Phase 9: Competitive Analysis ✅ COMPLETED
    │
    ├── Phase 10: AI-Data-Native MCP Platform ✅ COMPLETED
    │       │
    │       ├── 10.1: Database Infrastructure ✅
    │       ├── 10.2: Core MCP Tools ✅
    │       ├── 10.3: AI Data Access Protocol ✅
    │       └── 10.4: MCP Server npm Package ✅
    │
    └── Phase 11: Technical Quality Improvement (CURRENT)
            │
            ├── 11.1: Test Coverage Expansion (P0)
            ├── 11.2: Rate Limiting (P0)
            ├── 11.3: Error Handling (P0)
            ├── 11.4: Caching Layer (P1)
            ├── 11.5: Monitoring (P1)
            └── 11.6: MCP Package CI/CD (P1)
                │
                ├── Phase 12: Draft Bucket System
                │
                ├── Phase 13: Dual-Layer Publishing
                │
                └── Phase 14: Visual Redesign
```

---

## 7. Environment Setup Checklist (Updated)

- [x] Node.js 20+ installed
- [x] pnpm installed
- [x] Supabase project configured
- [x] Vercel deployment configured
- [x] Custom domain configured (viblog.tiic.tech)
- [x] CI/CD pipeline active
- [ ] MCP SDK documentation reviewed
- [ ] LLM API keys configured for article generation
- [ ] **NEW:** pgvector extension enabled
- [ ] **NEW:** Apache AGE extension enabled (or Neo4j)
- [ ] **NEW:** TimescaleDB extension enabled
- [ ] **NEW:** OpenAI API key for embeddings

---

**Document Version:** 4.0
**Last Updated:** 2026-03-16
**Author:** Viblog Team
**Key Updates:** Restructured Phase 10 with AI-Data-Native architecture, merged phases 11-13, added Human User Experience features