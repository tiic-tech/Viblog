# Viblog - Implementation Plan

## 文档信息
- **功能**: 实施计划文档，定义开发阶段、任务分解和技术细节
- **作用**: 开发执行的路线图，跟踪进度和依赖关系
- **职责**: 明确"什么时候做什么"，覆盖所有开发任务
- **阅读顺序**: 3 - 开工会话必读，了解当前任务和下一步工作

---

## 1. Overview

This document provides a step-by-step build sequence for Viblog post-MVP development. Each step has clear deliverables and dependencies.

**Current Status:** Phase 11 COMPLETE - Phase 12 Ready (Dual-Layer Publishing)

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
├── Phase 9: Competitive Analysis (COMPLETE)
├── Phase 10: MCP Server Development (Backend Track)
├── Phase 11: Code Gallery UI/UX Plan (COMPLETE - 2026-03-17)
├── Phase 12: Dual-Layer Publishing (NEXT)
└── Phase 13: Visual Redesign
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

#### Step 10.1.1: Enable Vector and Graph Extensions
**Status:** Pending

**Deliverable:** PostgreSQL extensions enabled

**Tasks:**
- [ ] Enable pgvector extension
- [ ] Enable Apache AGE extension (or evaluate alternatives)
- [ ] Configure TimescaleDB extension
- [ ] Test extension functionality

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS age;
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

---

#### Step 10.1.2: Create AI-Data-Native Tables
**Status:** Pending

**Deliverable:** All new tables with RLS policies

**Tasks:**
- [ ] Create `external_links` table (User DB)
- [ ] Create `user_insights` table (User DB)
- [ ] Create `insight_links` table (User DB)
- [ ] Create `article_paragraphs` table (Platform DB)
- [ ] Create `annotations` table (Platform DB)
- [ ] Create `user_interactions` table (Platform DB)
- [ ] Create `user_credits` table (Platform DB)
- [ ] Create `credit_transactions` table (Platform DB)
- [ ] Create `authorization_tokens` table (Platform DB)
- [ ] Add RLS policies for all tables
- [ ] Generate TypeScript types

---

#### Step 10.1.3: MCP API Key and Authorization Token System
**Status:** Pending

**Deliverable:** Secure key/token generation and management

**Tasks:**
- [ ] Create API key generation endpoint
- [ ] Create authorization token generation endpoint
- [ ] Implement secure key hashing (SHA-256)
- [ ] Add key/token display in settings page (masked)
- [ ] Implement key/token revocation endpoints
- [ ] Add last-used tracking

**Key Format:**
- MCP API Key: `vb_xxxxxxxxxxxxxxxxxxxxxxxx`
- Authorization Token: `vat_xxxxxxxxxxxxxxxxxxxxxxxx`

---

### Phase 10.2: Core MCP Tools Implementation (Week 2-4)

#### Step 10.2.1: Implement create_vibe_session Tool
**Status:** Pending

**Deliverable:** MCP tool for creating new vibe coding sessions

**Tasks:**
- [ ] Define Zod schema for input validation
- [ ] Implement API client call to Viblog backend
- [ ] Handle error responses
- [ ] Return session_id for subsequent calls

---

#### Step 10.2.2: Implement append_session_context Tool
**Status:** Pending

**Deliverable:** MCP tool for incremental session data append

**Tasks:**
- [ ] Implement client-side rate limiting buffer
- [ ] Define context type schemas
- [ ] Implement buffer flush logic (max 50 items or 5 seconds)
- [ ] Add retry logic on failure

---

#### Step 10.2.3: Implement upload_session_context Tool
**Status:** Pending

**Deliverable:** MCP tool for batch upload of complete session context

---

#### Step 10.2.4: Implement generate_structured_context Tool
**Status:** Pending

**Deliverable:** MCP tool for transforming raw data into structured JSON

**Tasks:**
- [ ] Implement model routing logic (local-first)
- [ ] Define StructuredVibeContext output schema
- [ ] Integrate with LLM API (Opus for extraction)
- [ ] Handle model fallback scenarios

---

#### Step 10.2.5: Implement generate_article_draft Tool
**Status:** Pending

**Deliverable:** MCP tool for generating article draft from structured session

---

### Phase 10.3: AI Data Access Protocol (Week 3-4)

#### Step 10.3.1: Implement AIDataSchema Endpoint
**Status:** Pending

**Deliverable:** Endpoint returning available data sources and schemas

**Tasks:**
- [ ] Create `/api/v1/ai/schema` endpoint
- [ ] Implement datasource discovery based on authorization
- [ ] Return JSON Schema definitions
- [ ] Return vector store configurations
- [ ] Return knowledge graph configurations

---

#### Step 10.3.2: Implement Vector Search API
**Status:** Pending

**Deliverable:** Vector similarity search endpoints

**Tasks:**
- [ ] Create `/api/v1/ai/vectors/{store}/search` endpoint
- [ ] Implement embedding generation (OpenAI API)
- [ ] Configure pgvector indexes (IVFFlat/HNSW)
- [ ] Add search result ranking

**Vector Stores:**
| Store | Content | Dimension | Storage |
|-------|---------|-----------|---------|
| article_paragraphs | Article paragraphs | 1536 | Platform DB |
| user_insights | User insights | 1536 | User DB |
| external_links | Link snapshots | 1536 | User DB |
| articles | Article overall | 1536 | Platform DB |

---

#### Step 10.3.3: Implement Knowledge Graph API
**Status:** Pending

**Deliverable:** Graph query endpoints for AI

**Tasks:**
- [ ] Create `/api/v1/ai/graph/{graph}/query` endpoint
- [ ] Define node types and edge types
- [ ] Implement Cypher query execution
- [ ] Add graph visualization data export

---

#### Step 10.3.4: Implement Time Series API
**Status:** Pending

**Deliverable:** Behavioral analytics endpoints

**Tasks:**
- [ ] Create `/api/v1/ai/timeseries/{metric}` endpoint
- [ ] Configure TimescaleDB hypertables
- [ ] Implement aggregation queries
- [ ] Add trend analysis functions

---

### Phase 10.4: Human User Experience Features (Frontend Track)

**Status:** Ready to Start

**Branch:** `feature/phase10-frontend-distinctive-ui`

**Worktree:** `/Users/archy/Projects/StartUp/Viblog/.claude/worktrees/frontend/`

---

#### Phase 10.4 Soul Mission

```
┌─────────────────────────────────────────────────────────────────┐
│   VIBLOG'S DUAL-TRACK SOUL                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   AI-NATIVE TRACK (Phase 1-9)     HUMAN TRACK (Phase 10.4)     │
│   ============================     ==========================    │
│                                                                 │
│   When AI visits Viblog           When Human visits Viblog     │
│   ├── Vibe Sessions               ├── Personal journals        │
│   ├── Auto-generated insights     ├── Hand-crafted thoughts    │
│   ├── JSONB data structures       ├── Markdown compositions    │
│   └── AI-readable content         └── Human-readable stories   │
│                                                                 │
│   BOTH tracks deserve unparalleled experience                   │
│   Both can Record → Share → Grow                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Core Question:** When I'm NOT a vibe coder today - when I just want to write my thoughts, feelings, things I saw - do I still feel at home in Viblog?

**The Answer Must Be:** YES. Every space I create must give users a sense of belonging unique to Viblog.

---

#### Priority Order (Soul-Centered)

| Priority | Step | Feature | Soul Impact | Status |
|----------|------|---------|-------------|--------|
| 1 | 10.4.3 | Annotation System Polish | Deepens reading into dialogue | 90% done |
| 2 | 10.4.1 | Smart Markdown Editor | Transforms writing into flow | Pending |
| 3 | 10.4.4 | Credits System | Recognizes user value | Pending |
| 4 | 10.4.5 | Authorization Settings UI | Builds trust foundation | Pending |
| 5 | 10.4.2 | External Link Citation | Bridges to wider web | Pending |

---

#### Step 10.4.3: Annotation System Polish (Priority 1)

**Soul Mission:** Transform reading from passive consumption to active dialogue. Every annotation is a mark of intellectual presence.

**Belonging Moment:** User sees their annotations accumulate and thinks: "I've been here. I've grown here. This is my intellectual home."

**Current State (90% Complete):**
- `/src/hooks/use-highlights.ts` (277 lines) - Highlight persistence to localStorage
- `/src/hooks/use-text-selection.ts` - Text selection with XPath
- `/src/components/ui/annotation-tooltip.tsx` - Floating tooltip UI
- `/src/components/public/article-content.tsx` - Content renderer with highlights

---

##### TDD Checkpoint 10.4.3.1: Comment Type Definition ✅ COMPLETE

**RED Phase:**
- [x] Write test: `src/types/__tests__/annotation.test.ts`
  - Test `Annotation` type structure (id, articleId, userId, xpath, content, color, visibility, createdAt)
  - Test `DiscussionItem` type structure (id, userId, content, createdAt)
  - Test `AnnotationVisibility` type values ('public', 'private', 'followers')
  - Test `AnnotationColor` type values ('default', 'yellow', 'green', 'blue', 'pink')

**GREEN Phase:**
- [x] Create `src/types/annotation.ts` (~75 lines)
  - Export `Annotation` interface
  - Export `DiscussionItem` interface
  - Export `AnnotationVisibility` type
  - Export `AnnotationColor` type

**REFACTOR Phase:**
- [x] Ensure types are DRY and well-documented
- [x] Add JSDoc comments for each field

**Test Pass Criteria:** TypeScript compilation succeeds, 12 type tests pass

**Completed:** 2026-03-18

---

##### TDD Checkpoint 10.4.3.2: Annotation Hook [COMPLETE]

**RED Phase:**
- [x] Write test: `src/hooks/__tests__/use-annotations.test.ts`
  - Test `useAnnotations(articleId)` returns annotations list
  - Test `addAnnotation(annotation)` persists to localStorage
  - Test `updateAnnotation(id, updates)` updates existing annotation
  - Test `deleteAnnotation(id)` removes annotation
  - Test `addReply(annotationId, reply)` adds discussion item
  - Test `getAnnotationByText(text)` finds annotation
  - Test `clearAnnotations()` removes all annotations

**GREEN Phase:**
- [x] Create `src/hooks/use-annotations.ts` (~180 lines)
  - Implement CRUD operations with useState/useCallback
  - localStorage persistence with useEffect
  - Duplicate prevention on addAnnotation
  - Generate unique IDs with `ann_` prefix

**REFACTOR Phase:**
- [x] Use @testing-library/react's renderHook for proper testing
- [x] Add JSDoc documentation with soul mission

**Test Pass Criteria:** All 18 test cases pass

**Completed:** 2026-03-18

---

##### TDD Checkpoint 10.4.3.3: Comment Modal Component [COMPLETE]

**RED Phase:**
- [x] Write test: `src/components/annotations/__tests__/comment-modal.test.tsx`
  - Test modal opens when `isOpen` is true
  - Test selected text preview displays correctly (italic, muted)
  - Test textarea for comment input works
  - Test color picker shows 5 color options
  - Test visibility selector has 3 options
  - Test Save button calls `onSave` with correct data
  - Test Cancel button calls `onClose`

**GREEN Phase:**
- [x] Create `src/components/annotations/comment-modal.tsx` (~150 lines)
  - Props: `isOpen`, `onClose`, `selectedText`, `onSave`
  - Selected text preview (italic, muted styling)
  - Textarea for comment
  - Color picker (default, yellow, green, blue, pink)
  - Visibility selector (public/private/followers)

**REFACTOR Phase:**
- [x] Add accessibility labels and keyboard support
- [x] Add focus management with auto-focus

**Test Pass Criteria:** All 18 test cases pass

**Completed:** 2026-03-18

---

##### TDD Checkpoint 10.4.3.4: Annotation Sidebar Component ✅ COMPLETE

**RED Phase:**
- [x] Write test: `src/components/annotations/__tests__/annotation-sidebar.test.tsx`
  - Test sidebar renders with correct width (w-80)
  - Test annotation list renders all items
  - Test clicking item scrolls to position
  - Test filter by user works
  - Test filter by visibility works
  - Test empty state displays when no annotations

**GREEN Phase:**
- [x] Create `src/components/annotations/annotation-sidebar.tsx` (~220 lines)
  - Fixed right sidebar (w-80)
  - List annotations with text preview
  - Click to scroll to annotation position
  - Filter by user, visibility
  - Color indicators and visibility icons
  - Ownership indicator ("Yours" badge)
  - Discussion count badges

**REFACTOR Phase:**
- [ ] Use virtual list for performance with many annotations
- [ ] Add loading skeleton state

**Test Pass Criteria:** All 16 test cases pass

---

##### TDD Checkpoint 10.4.3.5: Article Content Integration ✅ COMPLETE

**RED Phase:**
- [x] Write test: `src/components/public/__tests__/article-content-integration.test.tsx`
  - Test sidebar toggle button appears
  - Test clicking toggle shows/hides sidebar
  - Test handleComment opens modal instead of toast
  - Test annotation modal saves correctly
  - Test highlights sync with annotations

**GREEN Phase:**
- [x] Modify `/src/components/public/article-content.tsx`
  - Add sidebar toggle button
  - Replace `handleComment` toast with modal opening
  - Import and render `AnnotationSidebar`
  - Import and render `CommentModal`
  - Sync highlights with annotations

**REFACTOR Phase:**
- [ ] Extract annotation state to context if needed (deferred)
- [ ] Optimize re-renders (deferred)

**Test Pass Criteria:** All 10 test cases pass, integration works end-to-end

---

#### Step 10.4.1: Smart Markdown Editor (Priority 2)

**Soul Mission:** Make writing feel like thinking out loud - fluid, supported, inspiring. The editor disappears; only thought remains.

**Belonging Moment:** Writer thinks: "This editor understands me. It helps me think, structure, and see. I'm not fighting the tool - I'm flowing with my thoughts."

**Current State:**
- `/src/components/articles/article-editor.tsx` (146 lines) - TipTap with StarterKit
- TipTap packages: react, starter-kit, placeholder, code-block-lowlight, image, link

---

##### TDD Checkpoint 10.4.1.1: Editor State Hook

**RED Phase:**
- [ ] Write test: `src/hooks/__tests__/use-editor-state.test.ts`
  - Test `useEditorState()` returns editor instance
  - Test `togglePreview()` flips preview state
  - Test `toggleToc()` flips TOC state
  - Test `getContent()` returns current content
  - Test `setContent()` updates editor content

**GREEN Phase:**
- [ ] Create `src/hooks/use-editor-state.ts` (~80 lines)
  - Manage preview visible state
  - Manage TOC visible state
  - Expose editor instance
  - Content getter/setter

**REFACTOR Phase:**
- [ ] Add debounced content save
- [ ] Add content change callback

**Test Pass Criteria:** All 5+ test cases pass, state management works

---

##### TDD Checkpoint 10.4.1.2: Split Pane Editor Component

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/split-pane-editor.test.tsx`
  - Test two-column layout renders
  - Test divider is draggable
  - Test editor is on left, preview on right
  - Test preview updates as user types
  - Test sync scroll position between editor and preview

**GREEN Phase:**
- [ ] Create `src/components/editor/split-pane-editor.tsx` (~200 lines)
  - Two-column layout with resizable divider
  - Editor on left, preview on right
  - Sync scroll position
  - Toggle preview button in toolbar

- [ ] Create `src/components/editor/preview-pane.tsx` (~150 lines)
  - Render Markdown as HTML
  - Apply article styling
  - Scroll sync with editor

**REFACTOR Phase:**
- [ ] Extract resize logic to custom hook
- [ ] Add min/max width constraints

**Test Pass Criteria:** All 5+ test cases pass, drag works smoothly

---

##### TDD Checkpoint 10.4.1.3: Table of Contents Hook

**RED Phase:**
- [ ] Write test: `src/hooks/__tests__/use-toc.test.ts`
  - Test `useToc(editor)` extracts headings from content
  - Test returns array of { id, level, text }
  - Test updates when content changes
  - Test ignores empty headings

**GREEN Phase:**
- [ ] Create `src/hooks/use-toc.ts` (~60 lines)
  - Extract headings from TipTap JSON
  - Return array of heading objects
  - Update on content change

**REFACTOR Phase:**
- [ ] Add debounced extraction
- [ ] Cache extraction results

**Test Pass Criteria:** All 4+ test cases pass, headings extracted correctly

---

##### TDD Checkpoint 10.4.1.4: Table of Contents Component

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/table-of-contents.test.tsx`
  - Test renders nested list of headings (h1-h3)
  - Test clicking heading scrolls to section
  - Test active heading is highlighted
  - Test collapsible panel works

**GREEN Phase:**
- [ ] Create `src/components/editor/table-of-contents.tsx` (~100 lines)
  - Collapsible sidebar panel
  - Nested list of headings (h1-h3)
  - Click to scroll to section
  - Active heading highlight

**REFACTOR Phase:**
- [ ] Add smooth scroll animation
- [ ] Add heading count indicator

**Test Pass Criteria:** All 4+ test cases pass, scroll and highlight work

---

##### TDD Checkpoint 10.4.1.5: Editor Enhancements

**RED Phase:**
- [ ] Write test: `src/components/articles/__tests__/article-editor-enhancements.test.tsx`
  - Test preview toggle button exists and works
  - Test TOC toggle button exists and works
  - Test typography extension converts quotes correctly
  - Test highlight extension applies highlighting

**GREEN Phase:**
- [ ] Modify `/src/components/articles/article-editor.tsx`
  - Add preview toggle button
  - Add TOC toggle button
  - Add `@tiptap/extension-typography` for smart quotes
  - Add `@tiptap/extension-highlight` for text highlighting

**REFACTOR Phase:**
- [ ] Extract toolbar to separate component
- [ ] Add keyboard shortcuts for toggles

**Test Pass Criteria:** All 4+ test cases pass, extensions work correctly

---

##### TDD Checkpoint 10.4.1.6: Editor Type Definitions (Spark 002)

**Soul Mission:** Make writing feel like thinking out loud - with AI-powered assistance that understands intent.

**RED Phase:**
- [ ] Write test: `src/types/__tests__/editor.test.ts`
  - Test `SmartInsertType` type correctness ('table' | 'flowchart' | 'mindmap' | 'swimlane')
  - Test `VoiceRecording` interface structure (id, blob, transcription, timestamp, duration)
  - Test `SmartInsertState` interface structure
  - Test type guards for each type

**GREEN Phase:**
- [ ] Create `src/types/editor.ts` (~50 lines)
  - Define `SmartInsertType` union type
  - Define `VoiceRecording` interface
  - Define `SmartInsertState` interface
  - Define `GenerateStructureRequest/Response` interfaces
  - Define `TranscriptionResponse` interface

**REFACTOR Phase:**
- [ ] Ensure types are DRY and well-documented
- [ ] Add JSDoc comments for complex types

**Test Pass Criteria:** TypeScript compilation succeeds, type tests pass

---

##### TDD Checkpoint 10.4.1.7: LLM Service Mock

**RED Phase:**
- [ ] Write test: `src/services/editor/__tests__/llm-service.test.ts`
  - Test `generateStructure` returns success response
  - Test response contains markdown for each type (table, flowchart, mindmap, swimlane)
  - Test response contains preview text
  - Test error handling simulation

**GREEN Phase:**
- [ ] Create `src/services/editor/llm-service.ts` (~80 lines)
  - Implement `ILLMService` interface
  - Implement `MockLLMService` class with mock responses
  - Implement `getLLMService` factory function

**REFACTOR Phase:**
- [ ] Extract mock response generation to separate function
- [ ] Add configurable delay for realistic testing

**Test Pass Criteria:** All 4+ test cases pass, mock returns valid responses

**Note:** Mock service will be replaced by real API in Phase 11.6 (Platform LLM Config)

---

##### TDD Checkpoint 10.4.1.8: Voice Service Mock

**RED Phase:**
- [ ] Write test: `src/services/editor/__tests__/voice-service.test.ts`
  - Test `startRecording` initializes recording state
  - Test `stopRecording` returns blob
  - Test `transcribe` returns transcription
  - Test `saveRecording` stores recording
  - Test `getRecordings` returns all recordings

**GREEN Phase:**
- [ ] Create `src/services/editor/voice-service.ts` (~100 lines)
  - Implement `IVoiceService` interface
  - Implement `MockVoiceService` class
  - Implement `getVoiceService` factory

**REFACTOR Phase:**
- [ ] Add proper MediaRecorder mock for browser testing
- [ ] Add cleanup for recordings in tests

**Test Pass Criteria:** All 5+ test cases pass, recording lifecycle works

**Note:** Mock service will be replaced by real API in Phase 11.6 (Platform LLM Config)

---

##### TDD Checkpoint 10.4.1.9: Editor Sidebar Toolbar

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/sidebar-toolbar.test.tsx`
  - Test renders vertical toolbar
  - Test renders all expected icons (bullet list, table, flowchart, mind map, hyperlink, image, code block)
  - Test click on bullet list inserts bullet list
  - Test click on hyperlink opens EnhancedLinkDialog
  - Test click on table opens SmartInsertDialog with type='table'
  - Test click on flowchart opens SmartInsertDialog with type='flowchart'
  - Test toolbar is positioned correctly (fixed right side)

**GREEN Phase:**
- [ ] Create `src/components/editor/sidebar-toolbar.tsx` (~120 lines)
  - Import TipTap editor instance via props
  - Render vertical button list using existing Button component
  - Use lucide-react icons: List, Table, GitBranch, Network, Link, Image, Code
  - Handle click events for each tool type
  - Position with `fixed right-0 top-1/2 -translate-y-1/2`

**REFACTOR Phase:**
- [ ] Extract tool configuration to constant array
- [ ] Add keyboard shortcuts for common tools
- [ ] Add tooltip for each tool using Tooltip component

**Test Pass Criteria:** All 7+ test cases pass, toolbar renders correctly

---

##### TDD Checkpoint 10.4.1.10: Enhanced Link Dialog

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/enhanced-link-dialog.test.tsx`
  - Test dialog opens when `isOpen` is true
  - Test dialog closes on cancel button click
  - Test renders three tabs: My Articles, Bookmarks, External URL
  - Test search input for My Articles
  - Test search input for Bookmarks
  - Test URL input for External URL
  - Test selecting article inserts link into editor
  - Test pasting URL inserts link into editor

**GREEN Phase:**
- [ ] Create `src/components/editor/enhanced-link-dialog.tsx` (~200 lines)
  - Use Radix Dialog or custom modal pattern
  - Implement tab-based navigation (My Articles, Bookmarks, External URL)
  - Implement autocomplete dropdown for article search
  - Handle URL validation for external links
  - Integrate with TipTap link extension

- [ ] Create `src/services/editor/article-search.ts` (~60 lines)
  - Implement `IArticleSearchService` interface
  - Implement `MockArticleSearchService` class
  - Return mock article list with id, title, slug

**REFACTOR Phase:**
- [ ] Extract tab content to separate sub-components
- [ ] Add debounced search for articles
- [ ] Add recent links history

**Test Pass Criteria:** All 8+ test cases pass, all three link types work

---

##### TDD Checkpoint 10.4.1.11: Smart Insert Dialog

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/smart-insert-dialog.test.tsx`
  - Test dialog opens with correct type (table/flowchart/mindmap/swimlane)
  - Test renders input textarea for content description
  - Test renders voice input button
  - Test renders "Generate" button
  - Test clicking Generate calls LLM service
  - Test shows loading state during generation
  - Test renders preview area with generated content
  - Test "Insert" button inserts content into editor
  - Test "Cancel" button closes dialog

**GREEN Phase:**
- [ ] Create `src/components/editor/smart-insert-dialog.tsx` (~250 lines)
  - Use Radix Dialog or custom modal
  - Implement state machine: input -> generating -> preview -> inserted
  - Integrate with LLM service (mock)
  - Integrate with VoiceInputButton
  - Render Mermaid preview for diagrams

- [ ] Create `src/components/editor/mermaid-preview.tsx` (~80 lines)
  - Use mermaid library for rendering
  - Handle async rendering
  - Display error message for invalid syntax

**REFACTOR Phase:**
- [ ] Extract state logic to custom hook
- [ ] Add retry mechanism for failed generations
- [ ] Add content editing before insert

**Test Pass Criteria:** All 9+ test cases pass, generation flow works

**Dependencies:** `pnpm add mermaid @tiptap/extension-table`

---

##### TDD Checkpoint 10.4.1.12: Voice Input Button

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/voice-input-button.test.tsx`
  - Test renders microphone button
  - Test clicking starts recording (visual feedback: pulsing red dot)
  - Test clicking again stops recording
  - Test shows real-time transcription in tooltip
  - Test calls `onTranscriptionComplete` with transcribed text
  - Test handles microphone permission denied
  - Test shows error state when recording fails

**GREEN Phase:**
- [ ] Create `src/components/editor/voice-input-button.tsx` (~100 lines)
  - Use Button component with microphone icon
  - Implement recording state: idle, recording, processing
  - Integrate with Voice service (mock)
  - Show pulsing animation during recording
  - Display transcription in tooltip or inline

- [ ] Create `src/hooks/use-voice-recording.ts` (~80 lines)
  - Manage recording state
  - Handle MediaRecorder lifecycle
  - Integrate with voice service
  - Return: { isRecording, transcription, error, startRecording, stopRecording }

**REFACTOR Phase:**
- [ ] Add recording duration display
- [ ] Add cancel recording option
- [ ] Add audio level visualization

**Test Pass Criteria:** All 7+ test cases pass, recording flow works

---

##### TDD Checkpoint 10.4.1.13: Voice Recording List

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/voice-recording-list.test.tsx`
  - Test renders list of recordings
  - Test each recording shows playback button
  - Test each recording shows transcription preview
  - Test each recording shows timestamp
  - Test clicking transcription inserts text
  - Test delete recording removes from list

**GREEN Phase:**
- [ ] Create `src/components/editor/voice-recording-list.tsx` (~120 lines)
  - Fetch recordings from voice service
  - Render list with playback controls
  - Display truncated transcription preview
  - Handle delete action
  - Handle reuse action (insert transcription)

**REFACTOR Phase:**
- [ ] Add sorting options
- [ ] Add search/filter
- [ ] Add bulk actions

**Test Pass Criteria:** All 6+ test cases pass, list management works

---

##### TDD Checkpoint 10.4.1.14: Smart Syntax Handler

**RED Phase:**
- [ ] Write test: `src/hooks/__tests__/use-smart-syntax.test.ts`
  - Test detects `@table` trigger
  - Test detects `@flowchart` trigger
  - Test detects `@mindmap` trigger
  - Test shows inline prompt on trigger
  - Test calls LLM service with content
  - Test inserts result at cursor position
  - Test removes trigger text after insertion

**GREEN Phase:**
- [ ] Create `src/hooks/use-smart-syntax.ts` (~150 lines)
  - Watch editor content for trigger patterns
  - Show inline prompt (floating input)
  - Call LLM service on submit
  - Insert generated content
  - Clean up trigger text

- [ ] Create `src/components/editor/inline-prompt.tsx` (~80 lines)
  - Position relative to cursor
  - Render input with voice button
  - Handle generate action
  - Handle cancel/close

**REFACTOR Phase:**
- [ ] Add debounce for trigger detection
- [ ] Add autocomplete for trigger types
- [ ] Add custom triggers configuration

**Test Pass Criteria:** All 7+ test cases pass, @triggers work correctly

---

##### TDD Checkpoint 10.4.1.15: Editor Integration

**RED Phase:**
- [ ] Write test: `src/components/articles/__tests__/article-editor-spark002.test.tsx`
  - Test EditorSidebarToolbar appears
  - Test SmartInsertDialog integration
  - Test EnhancedLinkDialog integration
  - Test VoiceInputButton integration
  - Test @trigger detection works in editor

**GREEN Phase:**
- [ ] Update: `src/components/articles/article-editor.tsx`
  - Add EditorSidebarToolbar beside EditorContent
  - Pass editor instance to toolbar
  - Add useSmartSyntax hook
  - Configure new TipTap extensions (table, mermaid)

- [ ] Create `src/lib/tiptap-extensions.ts` (~60 lines)
  - Configure table extension
  - Configure mermaid extension
  - Export extensions array for editor

**REFACTOR Phase:**
- [ ] Extract editor configuration to separate file
- [ ] Add feature flags for new features

**Test Pass Criteria:** All 5+ test cases pass, all features integrated

---

#### Spark 002 Summary: Smart Markdown Editor Extension

**Added TDD Checkpoints:** 10 (10.4.1.6 - 10.4.1.15)
**Estimated Tests:** 60+
**Estimated Lines of Code:** ~1,200 (implementation) + ~600 (tests)

**New Components:**
| Component | File | Lines |
|-----------|------|-------|
| EditorSidebarToolbar | `sidebar-toolbar.tsx` | 120 |
| EnhancedLinkDialog | `enhanced-link-dialog.tsx` | 200 |
| SmartInsertDialog | `smart-insert-dialog.tsx` | 250 |
| MermaidPreview | `mermaid-preview.tsx` | 80 |
| VoiceInputButton | `voice-input-button.tsx` | 100 |
| VoiceRecordingList | `voice-recording-list.tsx` | 120 |
| InlinePrompt | `inline-prompt.tsx` | 80 |

**New Hooks:**
| Hook | File | Lines |
|------|------|-------|
| useVoiceRecording | `use-voice-recording.ts` | 80 |
| useSmartSyntax | `use-smart-syntax.ts` | 150 |

**New Services (Mock):**
| Service | File | Lines |
|---------|------|-------|
| LLM Service | `llm-service.ts` | 80 |
| Voice Service | `voice-service.ts` | 100 |
| Article Search | `article-search.ts` | 60 |

**Dependencies to Add:**
```bash
pnpm add @tiptap/extension-table mermaid
pnpm add -D @types/mermaid
```

**Phase 11.6 Integration Points:**
- `MockLLMService` -> `POST /api/llm/generate-structure`
- `MockVoiceService` -> `POST /api/voice/transcribe`
- `MockArticleSearchService` -> `GET /api/articles/search`

---

#### Step 10.4.4: Credits System (Priority 3)

**Soul Mission:** Make contribution visible and valued. Every action has meaning. Credits say: "You belong here. Your presence matters."

**Belonging Moment:** User sees their balance and thinks: "Viblog sees me. Viblog values me. I'm not just a user - I'm a contributor to something meaningful."

**Current State:**
- `/src/components/dashboard/dashboard-stats.tsx` (61 lines) - Stats card pattern
- Card, CardHeader, CardContent components

---

##### TDD Checkpoint 10.4.4.1: Credits Types

**RED Phase:**
- [ ] Write test: `src/types/__tests__/credits.test.ts`
  - Test `CreditBalance` type structure
  - Test `CreditTransaction` type structure
  - Test `TransactionType` enum values
  - Test `RedemptionOption` type structure

**GREEN Phase:**
- [ ] Create `src/types/credits.ts` (~60 lines)
  - Export `CreditBalance` interface
  - Export `CreditTransaction` interface
  - Export `TransactionType` type
  - Export `RedemptionOption` interface

**REFACTOR Phase:**
- [ ] Add JSDoc documentation
- [ ] Add factory functions for types

**Test Pass Criteria:** All 4+ test cases pass, types compile correctly

---

##### TDD Checkpoint 10.4.4.2: Credits Dashboard Page

**RED Phase:**
- [ ] Write test: `src/app/(dashboard)/dashboard/credits/__tests__/page.test.tsx`
  - Test page renders credits balance
  - Test page renders stats (Total Earned, Total Spent, Pending)
  - Test redeem button exists
  - Test loading state displays

**GREEN Phase:**
- [ ] Create `src/app/(dashboard)/dashboard/credits/page.tsx` (~200 lines)
  - Fetch credits data (mock for now)
  - Render balance card
  - Render stats
  - Render transaction list
  - Render redemption modal trigger

**REFACTOR Phase:**
- [ ] Add error boundary
- [ ] Add retry logic for failed fetches

**Test Pass Criteria:** All 4+ test cases pass, page renders correctly

---

##### TDD Checkpoint 10.4.4.3: Balance Card Component

**RED Phase:**
- [ ] Write test: `src/components/credits/__tests__/credits-balance-card.test.tsx`
  - Test large balance display renders
  - Test gradient background applied
  - Test redeem button triggers callback
  - Test loading skeleton displays

**GREEN Phase:**
- [ ] Create `src/components/credits/credits-balance-card.tsx` (~100 lines)
  - Large balance display
  - Gradient background (primary/20 to accent/20)
  - Redeem button
  - Loading skeleton

**REFACTOR Phase:**
- [ ] Add animation on balance change
- [ ] Add tooltip explaining credits

**Test Pass Criteria:** All 4+ test cases pass, styling matches design

---

##### TDD Checkpoint 10.4.4.4: Transaction List Component

**RED Phase:**
- [ ] Write test: `src/components/credits/__tests__/transaction-list.test.tsx`
  - Test renders all transactions
  - Test positive amounts in green
  - Test negative amounts in muted
  - Test transaction type icons display
  - Test empty state displays
  - Test pagination works

**GREEN Phase:**
- [ ] Create `src/components/credits/transaction-list.tsx` (~150 lines)
  - Transaction list with pagination
  - Type icons for each transaction type

- [ ] Create `src/components/credits/transaction-item.tsx` (~80 lines)
  - Single transaction display
  - Amount styling (positive/negative)
  - Timestamp
  - Description

**REFACTOR Phase:**
- [ ] Add infinite scroll option
- [ ] Add date grouping

**Test Pass Criteria:** All 6+ test cases pass, list renders correctly

---

##### TDD Checkpoint 10.4.4.5: Redemption Modal Component

**RED Phase:**
- [ ] Write test: `src/components/credits/__tests__/redemption-modal.test.tsx`
  - Test modal opens on button click
  - Test redemption options display
  - Test selecting option enables confirm
  - Test confirm triggers callback
  - Test insufficient balance shows warning

**GREEN Phase:**
- [ ] Create `src/components/credits/redemption-modal.tsx` (~150 lines)
  - Modal with redemption options
  - Balance check
  - Confirm/Cancel buttons

- [ ] Create `src/components/credits/redemption-options.tsx` (~100 lines)
  - Option cards: 100 credits = 1 month sub, etc.
  - Selected state styling

**REFACTOR Phase:**
- [ ] Add success animation
- [ ] Add confirmation step

**Test Pass Criteria:** All 5+ test cases pass, redemption flow works

---

##### TDD Checkpoint 10.4.4.6: Sidebar Navigation

**RED Phase:**
- [ ] Write test: `src/components/dashboard/__tests__/sidebar-credits.test.tsx`
  - Test "Credits" nav item exists
  - Test `Coins` icon displays
  - Test clicking navigates to /dashboard/credits

**GREEN Phase:**
- [ ] Modify `/src/components/dashboard/sidebar.tsx`
  - Add "Credits" nav item
  - Use `Coins` icon from lucide-react
  - Link to /dashboard/credits

**REFACTOR Phase:**
- [ ] Add credit balance indicator in sidebar
- [ ] Add notification dot for new credits

**Test Pass Criteria:** All 3+ test cases pass, navigation works

---

#### Step 10.4.5: Authorization Settings UI (Priority 4)

**Soul Mission:** Give users true ownership and control over their data sovereignty. Build trust through transparency. Privacy is empowerment.

**Belonging Moment:** User configures settings and thinks: "Viblog respects my boundaries. I'm in control. This platform treats me like an adult who can make my own decisions."

**Current State:**
- `/src/app/(dashboard)/dashboard/settings/page.tsx` (347 lines) - LLM and Database settings

---

##### TDD Checkpoint 10.4.5.1: Data Source Toggle Component

**RED Phase:**
- [ ] Write test: `src/components/settings/__tests__/data-source-toggle.test.tsx`
  - Test renders toggle for each data source
  - Test toggle switches state on click
  - Test calls onChange callback
  - Test disabled state works

**GREEN Phase:**
- [ ] Create `src/components/settings/data-source-toggle.tsx` (~120 lines)
  - Data sources: user_insights, external_links, annotations, user_interactions
  - Toggle buttons for each source
  - Human-readable labels
  - On/Off state visualization

**REFACTOR Phase:**
- [ ] Add bulk toggle (all on/off)
- [ ] Add explanation tooltips

**Test Pass Criteria:** All 4+ test cases pass, toggles work

---

##### TDD Checkpoint 10.4.5.2: Privacy Level Selector Component

**RED Phase:**
- [ ] Write test: `src/components/settings/__tests__/privacy-level-selector.test.tsx`
  - Test renders 3 privacy levels
  - Test selecting level updates state
  - Test level descriptions display
  - Test calls onChange callback

**GREEN Phase:**
- [ ] Create `src/components/settings/privacy-level-selector.tsx` (~100 lines)
  - Level 1: "Public data only" - I'm private
  - Level 2: "Public + anonymized private" - I'm cautious
  - Level 3: "Full access with consent" - I trust Viblog
  - Radio selection UI

**REFACTOR Phase:**
- [ ] Add comparison table
- [ ] Add visual indicator of data access

**Test Pass Criteria:** All 4+ test cases pass, selection works

---

##### TDD Checkpoint 10.4.5.3: Token Manager Component

**RED Phase:**
- [ ] Write test: `src/components/settings/__tests__/token-manager.test.tsx`
  - Test renders token list
  - Test generate new token button works
  - Test token prefix displays (first 8 chars)
  - Test granted data sources display per token
  - Test revoke button removes token
  - Test last used timestamp displays

**GREEN Phase:**
- [ ] Create `src/components/settings/token-manager.tsx` (~150 lines)
  - Generate new token button
  - Token creation flow

- [ ] Create `src/components/settings/token-list.tsx` (~100 lines)
  - Token list with prefix display
  - Granted data sources per token
  - Last used timestamp
  - Revoke button

**REFACTOR Phase:**
- [ ] Add token naming
- [ ] Add expiration settings

**Test Pass Criteria:** All 6+ test cases pass, CRUD works

---

##### TDD Checkpoint 10.4.5.4: Settings Page Integration

**RED Phase:**
- [ ] Write test: `src/app/(dashboard)/dashboard/settings/__tests__/page-integration.test.tsx`
  - Test new "AI Data Access" section renders
  - Test data source toggles render
  - Test privacy level selector renders
  - Test token manager renders
  - Test save changes persists data

**GREEN Phase:**
- [ ] Modify `/src/app/(dashboard)/dashboard/settings/page.tsx`
  - Add new "AI Data Access" Card section
  - Import and render `DataSourceToggle`
  - Import and render `PrivacyLevelSelector`
  - Import and render `TokenManager`

**REFACTOR Phase:**
- [ ] Group related settings
- [ ] Add save indicator

**Test Pass Criteria:** All 5+ test cases pass, integration works

---

#### Step 10.4.2: External Link Citation (Priority 5)

**Soul Mission:** Let writers build bridges between their ideas and the wider web. Citations show: "I did my research. I honor my sources. My ideas have foundation."

**Belonging Moment:** Writer adds a citation and thinks: "Viblog helps me build credibility. My sources are presented beautifully. I'm not just writing - I'm building a foundation of knowledge."

**Current State:**
- Nothing exists - build from scratch
- TipTap link extension available

---

##### TDD Checkpoint 10.4.2.1: Link Preview Hook

**RED Phase:**
- [ ] Write test: `src/hooks/__tests__/use-link-preview.test.ts`
  - Test `useLinkPreview()` returns preview data
  - Test detects URL input
  - Test fetches Open Graph metadata
  - Test handles fetch errors gracefully
  - Test returns null for invalid URLs

**GREEN Phase:**
- [ ] Create `src/hooks/use-link-preview.ts` (~100 lines)
  - Detect URL paste in editor
  - Fetch Open Graph metadata
  - Return preview data (title, description, image, favicon)
  - Error handling

**REFACTOR Phase:**
- [ ] Add caching for repeated URLs
- [ ] Add timeout handling

**Test Pass Criteria:** All 5+ test cases pass, preview fetches correctly

---

##### TDD Checkpoint 10.4.2.2: Citation Types

**RED Phase:**
- [ ] Write test: `src/types/__tests__/external-link.test.ts`
  - Test `ExternalLink` type structure
  - Test `CitationPreview` type structure
  - Test validation of required fields

**GREEN Phase:**
- [ ] Create `src/types/external-link.ts` (~40 lines)
  - Export `ExternalLink` interface
  - Export `CitationPreview` interface

**REFACTOR Phase:**
- [ ] Add factory functions
- [ ] Add validation helpers

**Test Pass Criteria:** All 3+ test cases pass, types compile

---

##### TDD Checkpoint 10.4.2.3: Citation Preview Component

**RED Phase:**
- [ ] Write test: `src/components/editor/__tests__/citation-preview.test.tsx`
  - Test renders citation card
  - Test favicon displays
  - Test title displays
  - Test description displays
  - Test domain link works
  - Test loading state displays
  - Test error state displays

**GREEN Phase:**
- [ ] Create `src/components/editor/citation-preview.tsx` (~120 lines)
  - Card with favicon, title, description
  - Domain link
  - Loading skeleton
  - Error fallback

- [ ] Create `src/components/editor/citation-card.tsx` (~100 lines)
  - Display citation in article content
  - Hover interaction
  - Click to open original

**REFACTOR Phase:**
- [ ] Add image preview option
- [ ] Add cite count display

**Test Pass Criteria:** All 7+ test cases pass, preview renders correctly

---

##### TDD Checkpoint 10.4.2.4: Editor Integration

**RED Phase:**
- [ ] Write test: `src/components/articles/__tests__/article-editor-citation.test.tsx`
  - Test pasting URL triggers preview fetch
  - Test preview displays in editor
  - Test accepting preview inserts citation
  - Test citation renders in content
  - Test citation is stored in article

**GREEN Phase:**
- [ ] Modify `/src/components/articles/article-editor.tsx`
  - Add citation paste handler to TipTap
  - Import `use-link-preview`
  - Render citation preview on URL paste
  - Insert citation card on acceptance

**REFACTOR Phase:**
- [ ] Add citation editing
- [ ] Add citation removal

**Test Pass Criteria:** All 5+ test cases pass, citation flow works

---

#### API Endpoints Required (Backend Track)

The following API endpoints are needed from the Backend Track:

```yaml
Annotations:
  GET    /api/annotations?article_id=xxx
  POST   /api/annotations
  PUT    /api/annotations/[id]
  DELETE /api/annotations/[id]
  POST   /api/annotations/[id]/reply

Credits:
  GET  /api/credits
  GET  /api/credits/transactions
  POST /api/credits/redeem
  GET  /api/credits/opportunities

Authorization:
  GET    /api/authorization-tokens
  POST   /api/authorization-tokens
  DELETE /api/authorization-tokens/[id]
  PUT    /api/authorization-settings

Citations:
  POST /api/citations/preview
  POST /api/citations
  GET  /api/citations?article_id=xxx
```

---

#### Soul-Centered Verification Checklist

For each feature, verify the **Belonging Test**:

| Feature | User Feels Seen? | User Feels Valued? | User Feels Belonging? |
|---------|------------------|-------------------|----------------------|
| Annotation System | [ ] My thoughts are preserved | [ ] My insights matter | [ ] This is my intellectual home |
| Smart Editor | [ ] Editor understands me | [ ] My ideas have structure | [ ] I flow with my thoughts |
| Credits System | [ ] Viblog sees my contribution | [ ] My presence has value | [ ] I'm part of something meaningful |
| Authorization UI | [ ] Viblog respects boundaries | [ ] I'm in control | [ ] This platform treats me as an adult |
| Link Citation | [ ] Viblog honors my research | [ ] My sources build credibility | [ ] I'm building a foundation |

---

#### File Structure Summary

```
src/
├── app/(dashboard)/dashboard/
│   ├── credits/page.tsx                     (new)
│   └── settings/page.tsx                    (modify)
├── components/
│   ├── annotations/
│   │   ├── annotation-sidebar.tsx           (new)
│   │   ├── annotation-item.tsx              (new)
│   │   └── comment-modal.tsx                (new)
│   ├── articles/article-editor.tsx          (modify)
│   ├── credits/
│   │   ├── credits-balance-card.tsx         (new)
│   │   ├── credits-stats.tsx                (new)
│   │   ├── transaction-list.tsx             (new)
│   │   ├── transaction-item.tsx             (new)
│   │   ├── redemption-modal.tsx             (new)
│   │   └── redemption-options.tsx           (new)
│   ├── dashboard/sidebar.tsx                (modify)
│   ├── editor/
│   │   ├── split-pane-editor.tsx            (new)
│   │   ├── preview-pane.tsx                 (new)
│   │   ├── table-of-contents.tsx            (new)
│   │   ├── citation-preview.tsx             (new)
│   │   └── citation-card.tsx                (new)
│   ├── public/article-content.tsx           (modify)
│   └── settings/
│       ├── data-source-toggle.tsx           (new)
│       ├── privacy-level-selector.tsx       (new)
│       ├── token-manager.tsx                (new)
│       └── token-list.tsx                   (new)
├── hooks/
│   ├── use-annotations.ts                   (new)
│   ├── use-editor-state.ts                  (new)
│   ├── use-toc.ts                           (new)
│   └── use-link-preview.ts                  (new)
└── types/
    ├── annotation.ts                        (new)
    ├── external-link.ts                     (new)
    └── credits.ts                           (new)
```

---

#### TDD Summary

| Step | TDD Checkpoints | Test Files | Estimated Tests |
|------|-----------------|------------|-----------------|
| 10.4.3 Annotation | 5 | 5 | 28+ |
| 10.4.1 Editor (Core) | 5 | 5 | 23+ |
| 10.4.1 Editor (Spark 002) | 10 | 15 | 60+ |
| 10.4.4 Credits | 6 | 6 | 28+ |
| 10.4.5 Authorization | 4 | 4 | 19+ |
| 10.4.2 Citation | 4 | 4 | 20+ |
| **Total** | **34** | **39** | **178+** |

---

#### Implementation Sequence

| Week | Focus | Belonging Goal |
|------|-------|----------------|
| Week 1 | Annotation System (10.4.3) | Reader feels part of dialogue |
| Week 1-2 | Smart Editor Core (10.4.1.1-5) | Writer feels flow, not friction |
| Week 2-3 | Smart Editor Spark 002 (10.4.1.6-15) | Writer feels AI-powered, efficient |
| Week 3 | Credits System (10.4.4) | User feels valued and recognized |
| Week 3-4 | Authorization UI (10.4.5) | User feels in control and trusted |
| Week 4 | Citation System (10.4.2) | Writer feels their research is honored |

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

## 5. Phase 11: Code Gallery UI/UX Plan

**Goal:** Complete the Code Gallery distinctive UI with premium visual design, enhancing the AI-Native soul through polished interactions

**Status:** COMPLETE (2026-03-17)

**Estimated Effort:** 4-5 days

**Dependencies:**
- Phase 1-2 (Design Token Refinement, Card Component Polish) - COMPLETE
- Phase 10 (can run in parallel - frontend worktree)

**Strategic Context:** This phase implements Phases 3-7 from VIBLOG_CODE_GALLERY_UI_DEV_PLAN.md, translating Effortel's premium UI patterns into Viblog's unique "Code Gallery" identity.

---

### Soul Check: User Story Mapping

| UI Phase | User Story | AI-Native Soul Enhancement |
|----------|------------|---------------------------|
| Step 11.1: Button System | US-103: Dual Format Publishing | Consistent CTAs for AI-human collaboration |
| Step 11.2: Navigation | US-100: MCP Session Recording | Discoverable MCP entry points |
| Step 11.3: Footer | US-101: Draft Bucket Generation | Clear product navigation for content flow |
| Step 11.4: Micro-interactions | All User Stories | Premium feel builds trust in AI-generated content |
| Step 11.5: Mobile Polish | All User Stories | Vibe coding is mobile-first for AI learners |

---

### Step 11.1: Button System Standardization

**Status:** Complete

**Soul Check:** Serves US-103 (Dual Format Publishing) - Consistent button styling creates trust in AI-human collaboration interfaces. Primary buttons guide users to AI-assisted content creation.

**Deliverable:** Standardized button components with premium 8px border-radius, updated variants

**Files to Modify:**
- `src/components/ui/button.tsx` ✅
- `src/app/(public)/page.tsx` ✅
- `src/styles/design-system.css` ✅

**Checkpoints:**

- [x] **11.1.1: Update Button Variants** (File: `src/components/ui/button.tsx`) ✅ COMPLETE
  - Change default border-radius from `rounded-lg` to `rounded-md` (8px) ✅
  - Update `size="icon"` to 40x40px with `rounded-md` ✅
  - Add glow effect on primary button hover ✅
  - Result: `variant: { default: "bg-accent-primary text-white hover:bg-accent-primary-light hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" }`
  - Icon sizes: `size-10` (40x40px), `size-9` (36px for sm), `size-11` (44px for lg)

- [x] **11.1.2: Create Premium Button Variant** (File: `src/components/ui/button.tsx`) ✅ COMPLETE
  - Add `premium` variant with gradient background ✅
  - Add `accent` variant for secondary CTAs ✅

- [x] **11.1.3: Update Homepage CTA Buttons** (File: `src/app/(public)/page.tsx`) ✅ COMPLETE
  - Replace inline button styles with Button component ✅
  - Update CTA buttons in Hero section ✅
  - Update CTA buttons in final section ✅

- [x] **11.1.4: Add Button Design Tokens** (File: `src/styles/design-system.css`) ✅ COMPLETE
  - Added button-specific tokens: --btn-radius, --btn-height-*, --btn-icon-size, --btn-padding-*, --btn-transition, --btn-primary-glow

**Target Score:** Visual Hierarchy (8/10), Component Design (9/10)

---

### Step 11.2: Navigation Implementation

**Status:** Complete

**Soul Check:** Serves US-100 (MCP Session Recording) - Navigation provides discoverable entry points to MCP features. Clear product structure builds trust in AI-Native capabilities.

**Deliverable:** Fixed navigation with premium interactions, scroll behavior, and mobile hamburger menu

**Files to Create/Modify:**
- `src/components/layout/Navigation.tsx` (NEW)
- `src/app/(public)/layout.tsx`
- `src/app/(public)/page.tsx`

**Checkpoints:**

- [x] **11.2.1: Create Navigation Component** (File: `src/components/layout/Navigation.tsx`)
  - Fixed header at 72px height
  - Background: `rgba(5, 5, 8, 0.9)` with backdrop-blur
  - Border bottom: 1px solid `rgba(255, 255, 255, 0.05)`
  - Z-index: 50
  - Nav items: Explore, Features, Pricing, About

- [x] **11.2.2: Implement Scroll Behavior** (File: `src/components/layout/Navigation.tsx`)
  - Hide on scroll down, show on scroll up
  - Add background opacity transition on scroll

- [x] **11.2.3: Add Navigation Styling** (File: `src/components/layout/Navigation.tsx`)
  - Nav items: 14px font, medium weight, 32px spacing
  - Hover: Color shift to accent-primary (150ms ease)
  - Logo positioning with gradient text
  - CTA button on right side

- [x] **11.2.4: Implement Mobile Navigation** (File: `src/components/layout/Navigation.tsx`)
  - Hamburger menu toggle
  - Full-screen mobile menu overlay
  - Animate menu slide-in from right

- [x] **11.2.5: Integrate Navigation into Layout** (File: `src/app/(public)/layout.tsx`)
  - Add Navigation component above main content
  - Add padding-top to main content for fixed header

**Target Score:** Visual Hierarchy (9/10), Balance & Layout (8/10)

---

### Step 11.3: Footer Implementation

**Status:** Complete

**Soul Check:** Serves US-101 (Draft Bucket Generation) - Footer provides clear product navigation and reinforces the content creation flow. CTA card drives users toward AI-assisted publishing.

**Deliverable:** Structured 4-column footer with CTA card and social links

**Files to Create/Modify:**
- `src/components/layout/Footer.tsx` (NEW)
- `src/app/(public)/layout.tsx`

**Checkpoints:**

- [x] **11.3.1: Create Footer Component** (File: `src/components/layout/Footer.tsx`)
  - Background: `var(--bg-surface)`
  - Padding: 80px top, 48px bottom
  - Structure: CTA Card + 4-column grid + Bottom section

- [x] **11.3.2: Implement CTA Card** (File: `src/components/layout/Footer.tsx`)
  - 16px radius, subtle gradient background
  - Link to /register
  - Animated arrow icon on hover

- [x] **11.3.3: Implement Footer Grid** (File: `src/components/layout/Footer.tsx`)
  - 4-column grid on desktop (PRODUCT, RESOURCES, COMPANY, LEGAL)
  - 2-column on tablet
  - Single column on mobile

- [x] **11.3.4: Add Footer Bottom Section** (File: `src/components/layout/Footer.tsx`)
  - Copyright with AI-Native tagline: "Made with AI, for AI"
  - Social links (Twitter, GitHub)
  - Border top separator

- [x] **11.3.5: Integrate Footer into Layout** (File: `src/app/(public)/layout.tsx`)
  - Add Footer component at bottom of layout

**Target Score:** Balance & Layout (9/10), Brand Identity (8/10)

---

### Step 11.4: Micro-interactions Polish

**Status:** COMPLETE (5/5 checkpoints)

**Soul Check:** Serves ALL User Stories - Premium feel through subtle animations builds trust in AI-generated content. Every interaction reinforces the "Code Gallery" aesthetic.

**Deliverable:** Comprehensive hover effects, scroll animations, and loading states

**Files Modified:**
- `src/styles/design-system.css`
- `src/app/(public)/page.tsx`
- `src/components/public/article-card.tsx`
- `src/components/ui/skeleton.tsx` (shimmer variant)
- `src/components/public/feed-skeleton.tsx` (premium loading)
- `src/components/ui/scroll-progress-indicator.tsx` (reusable component)
- `src/app/(public)/article/[slug]/page.tsx` (progress indicator added)
- `tailwind.config.ts` (CRITICAL: container centering fix)

**Checkpoints:**

- [x] **11.4.1: Define Hover Effects Catalog** (File: `src/styles/design-system.css`)
  - Card: Overlay fade + arrow slide (300ms ease-out)
  - Button (filled): Background lighten + glow (200ms ease)
  - Button (outlined): Border color + bg fill (200ms ease)
  - Nav Link: Color shift to accent (150ms ease)
  - Tag: Border opacity + text color (200ms ease)
  - Article Title: Color shift to accent (150ms ease)

- [x] **11.4.2: Implement Card Hover Enhancement** (File: `src/components/public/article-card.tsx`)
  - Extract hover logic to article-card.tsx for reusability
  - Add translateY(-4px) + box-shadow on hover
  - Hover overlay with arrow reveal animation

- [x] **11.4.3: Implement Scroll Animations** (File: `src/app/(public)/page.tsx`)
  - Staggered card reveal with premium easing
  - Update easing function: `[0.16, 1, 0.3, 1]` (premium smooth)

- [x] **11.4.4: Add Loading States** (Files: `src/components/ui/skeleton.tsx`, `src/components/public/feed-skeleton.tsx`)
  - Enhanced Skeleton component with shimmer variant
  - Premium shimmer animation: `linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)`
  - Updated feed-skeleton to match article-card structure (16:10 aspect ratio)
  - Tests: 6 passing (3 new shimmer variant tests)

- [x] **11.4.5: Verify Progress Indicator** (Files: `src/components/ui/scroll-progress-indicator.tsx`, `src/app/(public)/article/[slug]/page.tsx`)
  - Created reusable `ScrollProgressIndicator` component
  - Added to article detail page
  - Spring animation: stiffness 100, damping 30
  - Tests: 5 passing
  - Verify scroll progress animation
  - Consider adding to article detail pages

**CRITICAL FIX (2026-03-17):**
- Fixed Tailwind container centering issue
- Root cause: Tailwind's default `container` class does NOT center content
- Fix: Added `center: true` and responsive padding to `tailwind.config.ts`
- This affected ALL page layouts, causing elements to appear left-aligned

**Target Score:** Micro-interactions (10/10), Premium Feel (9/10)

---

### Step 11.5: Mobile Responsive Polish

**Status:** COMPLETE

**Soul Check:** Serves ALL User Stories - Vibe coding is mobile-first for AI learners. Mobile optimization ensures AI-Native content is accessible everywhere.

**Deliverable:** Seamless mobile experience with responsive adaptations

**Files Modified:**
- `src/app/(public)/page.tsx`
- `src/components/public/article-card.tsx`

**Checkpoints:**

- [x] **11.5.1: Mobile Typography Adaptations** (File: `src/app/(public)/page.tsx`)
  - Hero Title: Already responsive `text-6xl sm:text-7xl md:text-8xl lg:text-9xl`
  - Section titles: Already responsive `text-4xl md:text-5xl lg:text-6xl`
  - Body text: Already responsive `text-xl md:text-2xl`

- [x] **11.5.2: Mobile Spacing Adaptations** (File: `src/app/(public)/page.tsx`)
  - Section padding: `py-16 md:py-32` for all sections
  - CTA card padding: `p-8 md:p-12 lg:p-16`
  - Container padding: Already responsive via tailwind.config.ts

- [x] **11.5.3: Mobile Grid Adaptations** (File: `src/app/(public)/page.tsx`)
  - Grid: Already responsive `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - Card radius: 16px maintained (rounded-xl)

- [x] **11.5.4: Mobile Navigation** (File: `src/components/layout/Navigation.tsx`)
  - Hamburger menu for mobile (implemented in 11.2.4)

- [x] **11.5.5: Mobile Footer** (File: `src/components/layout/Footer.tsx`)
  - 4 columns -> 2 columns on tablet (implemented in 11.3.3)
  - 2 columns -> 1 column on mobile (implemented in 11.3.3)

- [x] **11.5.6: Touch Interactions** (File: `src/components/public/article-card.tsx`)
  - Touch feedback: `active:scale-[0.98]` on cards
  - Cards are full-width tap targets

- [x] **11.5.7: Mobile Card Adaptations** (File: `src/components/public/article-card.tsx`)
  - Touch feedback added for better mobile UX
  - Responsive padding maintained

**Target Score:** Responsive Design (10/10), Spacing System (8/10)

---

### Success Criteria

**Design Quality Gate (Chief UI Designer):** ACHIEVED
- [x] Visual Hierarchy: 9/10 (Excellent)
- [x] Balance & Layout: 9/10 (Excellent)
- [x] Typography: 9/10 (Excellent)
- [x] Color Harmony: 9/10 (Excellent)
- [x] Spacing System: 9/10 (Excellent)
- [x] Component Design: 9/10 (Excellent)
- [x] Micro-interactions: 10/10 (Reference)
- [x] Responsive Design: 10/10 (Reference)
- [x] Brand Identity: 9/10 (Excellent)
- [x] Premium Feel: 9/10 (Excellent)

**Overall Score: 92/100 (Grade A)**

**Target Grade:** A (85+/100 total)

**Technical Quality Gate (CTO):**
- [ ] All button variants render correctly
- [ ] Navigation scroll behavior smooth
- [ ] Footer links functional
- [ ] No console errors on mobile
- [ ] Performance: First Contentful Paint < 1.5s
- [ ] Performance: Largest Contentful Paint < 2.5s
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Cross-browser: Chrome, Safari, Firefox tested

---

### Timeline & Dependencies

```
Day 1: Step 11.1 Button System (0.5 day) + Step 11.2 Navigation Start (0.5 day)
Day 2: Step 11.2 Navigation Complete (0.5 day) + Step 11.3 Footer (0.5 day)
Day 3: Step 11.4 Micro-interactions (1 day)
Day 4: Step 11.5 Mobile Polish (0.5 day) + Testing & Review (0.5 day)

Total: 4 days
```

**Dependency Graph:**
```
Step 11.1 (Buttons) ─────┬──> Step 11.2 (Navigation)
                         │
                         └──> Step 11.4 (Micro-interactions) ──> Step 11.5 (Mobile)
                                 ^                                      ^
                                 │                                      │
Step 11.3 (Footer) ─────────────┴──────────────────────────────────────┘
```

---

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Over-engineering | Stick to Effortel patterns, don't add extra features |
| Breaking existing animations | Test after each CSS change, use browser dev tools |
| Inconsistent button usage | Audit all button instances, create migration guide |
| Mobile performance | Test on real devices, optimize animation complexity |
| Navigation z-index conflicts | Document z-index hierarchy, use CSS variables |

---

### File Change Summary

**New Files:**
- `src/components/layout/Navigation.tsx` - Fixed navigation component
- `src/components/layout/Footer.tsx` - Structured footer component

**Modified Files:**
- `src/components/ui/button.tsx` - Updated variants with premium styling
- `src/app/(public)/page.tsx` - Homepage button updates
- `src/app/(public)/layout.tsx` - Add Navigation and Footer
- `src/styles/design-system.css` - Add interaction tokens
- `src/components/public/article-card.tsx` - Enhanced hover effects
- `tailwind.config.ts` - Add responsive utilities if needed

---

## 6. Dependency Graph (Updated)

```
Phase 9: Competitive Analysis ✅ COMPLETED
    │
    ├── Phase 10: AI-Data-Native MCP Platform
    │       │
    │       ├── 10.1: Database Infrastructure
    │       ├── 10.2: Core MCP Tools
    │       ├── 10.3: AI Data Access Protocol
    │       ├── 10.4: Human User Experience Features
    │       └── 10.5: Testing & Documentation
    │
    └── Phase 11: Visual Redesign (can run parallel with 10)
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