# Viblog - Changelog

## 文档信息
- **功能**: 变更日志，记录所有版本变更和功能更新
- **作用**: 追踪项目演进，快速了解最新状态
- **职责**: 记录"做了什么变更"，保持变更历史可追溯
- **阅读顺序**: 2 - 开工会话必读，了解最新变更

---

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### Added - Phase 10.4 Human User Experience Features (2026-03-18)

- **Soul Mission:** When I'm NOT a vibe coder today - when I just want to write my thoughts, feelings, things I saw - do I still feel at home in Viblog? The answer must be YES.

- **TDD Checkpoint 10.4.3.1: Annotation Type Definition** COMPLETE
  - [x] Created `src/types/annotation.ts` with Annotation, DiscussionItem, AnnotationVisibility, AnnotationColor types
  - [x] Created `src/types/__tests__/annotation.test.ts` with 12 passing tests
  - [x] Added JSDoc documentation for soul-centered annotation system
  - Soul Impact: Transform reading from passive consumption to active dialogue

- **TDD Checkpoint 10.4.3.2: Annotation Hook** COMPLETE
  - [x] Created `src/hooks/use-annotations.ts` with full annotation CRUD operations
  - [x] Created `src/hooks/__tests__/use-annotations.test.ts` with 18 passing tests
  - [x] Implemented localStorage persistence per article
  - [x] Implemented addAnnotation with duplicate prevention
  - [x] Implemented updateAnnotation, deleteAnnotation, addReply, clearAnnotations
  - Soul Impact: Every annotation is a mark of intellectual presence

- **TDD Checkpoint 10.4.3.3: Comment Modal Component** COMPLETE
  - [x] Created `src/components/annotations/comment-modal.tsx` (~150 lines)
  - [x] Created `src/components/annotations/__tests__/comment-modal.test.tsx` with 18 passing tests
  - [x] Implemented selected text preview with italic styling
  - [x] Implemented 5-color picker and 3-option visibility selector
  - [x] Added keyboard accessibility (Escape to close, focus management)
  - Soul Impact: "I've been here. This is my thought. This matters."

- **TDD Checkpoint 10.4.3.4: Annotation Sidebar Component** COMPLETE
  - [x] Created `src/components/annotations/annotation-sidebar.tsx` (~220 lines)
  - [x] Created `src/components/annotations/__tests__/annotation-sidebar.test.tsx` with 16 passing tests
  - [x] Implemented annotation list with color indicators
  - [x] Implemented user filter and visibility filter
  - [x] Implemented ownership indicator ("Yours" badge)
  - [x] Implemented discussion count badges
  - [x] Implemented click navigation to annotation positions
  - Soul Impact: "I've been here. I've grown here. This is my intellectual home."

- **TDD Checkpoint 10.4.3.5: Article Content Integration** COMPLETE
  - [x] Created `src/components/public/__tests__/article-content-integration.test.tsx` with 10 passing tests
  - [x] Added sidebar toggle button for AnnotationSidebar (fixed positioning)
  - [x] Integrated CommentModal for annotation creation
  - [x] Synced annotations with highlights on mount
  - [x] Added annotation click navigation with scroll and highlight effect
  - [x] Integrated useAnnotations hook into ArticleContent
  - Soul Impact: Transform article reading into personal intellectual dialogue

- **TDD Checkpoint 10.4.1.1: Editor State Hook** COMPLETE
  - [x] Created `src/hooks/use-editor-state.ts` with preview/TOC state management
  - [x] Created `src/hooks/__tests__/use-editor-state.test.ts` with 13 passing tests
  - [x] Implemented isPreviewVisible, isTocVisible state with toggles
  - [x] Implemented getContent (HTML/JSON) and setContent methods
  - [x] TypeScript fixes for annotation integration (article-content.tsx, use-annotations.test.ts)
  - [x] Fixed feed-skeleton.test.tsx selectors for shimmer variant
  - Soul Impact: Make writing feel like thinking out loud - fluid, supported, inspiring

- **TDD Checkpoint 10.4.1.2: Split Pane Editor Component** COMPLETE
  - [x] Created `src/components/editor/split-pane-editor.tsx` with dual-pane layout
  - [x] Created `src/components/editor/__tests__/split-pane-editor.test.tsx` with 12 passing tests
  - [x] Created `src/hooks/use-split-pane.ts` custom hook for resizable divider logic
  - [x] Created `src/hooks/__tests__/use-split-pane.test.ts` with 13 passing tests
  - [x] Implemented resizable divider with drag functionality
  - [x] Implemented keyboard navigation (ArrowLeft/ArrowRight)
  - [x] Implemented scroll synchronization between editor and preview panes
  - [x] Implemented ARIA attributes for accessibility (role="separator", aria-valuenow/min/max)
  - [x] Integrated useEditorState and useSplitPane hooks
  - Soul Impact: Make writing feel like thinking out loud - where every keystroke becomes visible art

### Added - Phase 11 Code Gallery UI/UX Plan (2026-03-17)

- **Strategic Context:** Implements Phases 3-7 from VIBLOG_CODE_GALLERY_UI_DEV_PLAN.md
- **Source:** Effortel competitive analysis (22/25 score) - learning principles, maintaining uniqueness
- **Estimated Effort:** 4-5 days
- **Dependencies:** Phase 1-2 (Design Token, Card Polish) - COMPLETE

- **Soul Check: User Story Mapping:**
  | Step | User Story | AI-Native Soul |
  |------|------------|----------------|
  | 11.1 Button System | US-103: Dual Format | Trust in AI-human collaboration |
  | 11.2 Navigation | US-100: MCP Session | Discoverable MCP entry points |
  | 11.3 Footer | US-101: Draft Bucket | Clear product navigation |
  | 11.4 Micro-interactions | All Stories | Premium feel for AI content |
  | 11.5 Mobile Polish | All Stories | Mobile-first AI learners |

- **Step 11.1: Button System Standardization** COMPLETE
  - [x] 11.1.1: Update button border-radius to 8px (rounded-md)
  - [x] 11.1.2: Create Premium Button Variant (gradient + accent variants)
  - [x] 11.1.3: Update Homepage CTA Buttons (Hero + Final sections)
  - [x] 11.1.4: Add Button Design Tokens to design-system.css
  - Primary/Secondary/Icon button variants with 40x40px icon size
  - Hover glow effect on primary buttons: `0 0 20px rgba(139,92,246,0.3)`
  - Premium variant with violet-to-cyan gradient for main CTAs

- **Step 11.2: Navigation Implementation** COMPLETE
  - [x] 11.2.1: Create Navigation Component (72px fixed header, backdrop-blur)
  - [x] 11.2.2: Implement Scroll Behavior (hide down, show up)
  - [x] 11.2.3: Add Navigation Styling (14px font, accent hover, gradient logo)
  - [x] 11.2.4: Implement Mobile Navigation (hamburger, slide-in overlay)
  - [x] 11.2.5: Integrate Navigation into Layout (pt-[72px] compensation)
  - Nav items: Explore, Features, Pricing, About
  - Premium "Get Started" CTA button with gradient variant
  - Mobile menu with smooth slide animation from right

- **Step 11.3: Footer Implementation** COMPLETE
  - [x] 11.3.1: Create Footer Component (bg-surface, 80px/48px padding)
  - [x] 11.3.2: Implement CTA Card (gradient bg, animated arrow, /register link)
  - [x] 11.3.3: Implement Footer Grid (4-column responsive: Product/Resources/Company/Legal)
  - [x] 11.3.4: Add Footer Bottom Section (copyright, social links, AI tagline)
  - [x] 11.3.5: Integrate Footer into Layout
  - AI-Native tagline: "Made with AI, for AI"
  - Social links: Twitter, GitHub

- **Step 11.3: Footer Implementation**
  - 4-column layout (Product, Resources, Company, Legal)
  - CTA card with gradient background
  - Social links (Twitter, GitHub)

- **Step 11.4: Micro-interactions Polish** COMPLETE
  - [x] 11.4.1: Define Hover Effects Catalog (design-system.css lines 275-311)
  - [x] 11.4.2: Implement Card Hover Enhancement (hover overlay with arrow reveal)
  - [x] 11.4.3: Implement Scroll Animations (premium easing: cubic-bezier(0.16,1,0.3,1))
  - [x] 11.4.4: Add Loading States (shimmer skeleton placeholders)
  - [x] 11.4.5: Verify Progress Indicator (reusable ScrollProgressIndicator component)
  - Card hover: translateY(-4px) + glow shadow + overlay reveal
  - Premium easing: `cubic-bezier(0.16, 1, 0.3, 1)` for smooth animations
  - Hover overlay with gradient background and arrow animation
  - **Checkpoint 11.4.4 Loading States:**
    - Enhanced `skeleton.tsx` with shimmer variant for premium loading feel
    - Updated `feed-skeleton.tsx` to match article-card.tsx structure (16:10 aspect ratio)
    - Added shimmer animation: `linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)`
    - Tests: 6 passing (3 new shimmer variant tests)
  - **Checkpoint 11.4.5 Progress Indicator:**
    - Created reusable `ScrollProgressIndicator` component
    - Added to article detail page (`/article/[slug]`)
    - Spring animation with stiffness: 100, damping: 30
    - Tests: 5 passing for new component

- **Step 11.5: Mobile Responsive Polish** COMPLETE
  - [x] 11.5.1: Mobile Typography Adaptations (already responsive)
  - [x] 11.5.2: Mobile Spacing Adaptations (py-32 -> py-16 md:py-32)
  - [x] 11.5.3: Mobile Grid Adaptations (already responsive: grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
  - [x] 11.5.4: Mobile Navigation (implemented in 11.2.4)
  - [x] 11.5.5: Mobile Footer (implemented in 11.3.3)
  - [x] 11.5.6: Touch Interactions (active:scale-[0.98] feedback on cards)
  - [x] 11.5.7: Mobile Card Adaptations (touch feedback added)
  - Section padding: `py-16 md:py-32` for all sections
  - CTA card padding: `p-8 md:p-12 lg:p-16`
  - Touch feedback: `active:scale-[0.98]` on article cards

- **CRITICAL FIX: Container Centering** (2026-03-17)
  - Issue: All page elements except hero were left-aligned instead of centered
  - Root cause: Tailwind's default `container` class does NOT center content
  - Fix: Added container configuration to `tailwind.config.ts`:
    ```typescript
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '2rem', lg: '4rem', xl: '5rem' }
    }
    ```
  - This fix affects ALL page layouts across the entire application

- **Step 11.5: Mobile Responsive Polish**
  - Hero title: 60-128px desktop, 36-48px mobile
  - Section padding: 128px desktop, 64px mobile
  - Grid: 3 columns desktop, 1 column mobile
  - Touch targets: 44px minimum

- **Design Target:** Grade A (85+/100) across 10 Design Metrics

- **Documentation:**
  - `IMPLEMENTATION_PLAN.md` - Phase 11 detailed checkpoints
  - `VIBLOG_CODE_GALLERY_UI_DEV_PLAN.md` - Source plan
  - `docs/UI_TEAM_WORKFLOW.md` - Working method

### Added - UI Team Workflow Phase 3: Article Detail Polish (2026-03-17)
- **Soul-Centered Design:**
  - Immersive reading typography (65ch, 1.75 line-height)
  - Code block theming with language badge + copy button
  - Annotation UI for text selection (US-205, US-206)
  - Author journey section celebrating Vibe Coder

- **Components Created:**
  - `src/components/ui/code-block.tsx` - Syntax highlighted code
  - `src/hooks/use-text-selection.ts` - Selection detection
  - `src/components/ui/annotation-tooltip.tsx` - Annotation UI

- **Design Metrics Improved:**
  - Typography: 6/10 → 9/10
  - Component Design: 6/10 → 9/10
  - Brand Identity: 6/10 → 9/10

- **Documentation:**
  - `docs/dev-logs/phase-3-article-detail-polish.md` - Full design review

### Added - UI Team Workflow Phase 2: Card Component Polish (2026-03-17)
- **Design Review Score: 83/100 (Grade A-)**
- **Effortel-Inspired Design Patterns:**
  - Border radius migration: `rounded-2xl` → `rounded-xl` (16px)
  - 16:10 aspect ratio image containers for cinematic feel
  - Hover overlay with diagonal gradient + arrow icon reveal
  - Outlined tag component for vibe metadata (model, duration)
  - Platform color badges (claude=rose, cursor=violet)

- **10 Design Metrics Evaluation:**
  - Visual Hierarchy: 9/10 - Excellent
  - Balance & Layout: 8/10 - Very Good
  - Typography: 8/10 - Very Good
  - Color Harmony: 9/10 - Excellent
  - Spacing System: 9/10 - Excellent
  - Component Design: 9/10 - Excellent
  - Micro-interactions: 8/10 - Very Good
  - Responsive Design: 7/10 - Good
  - Brand Identity: 9/10 - Excellent
  - Premium Feel: 8/10 - Very Good

- **Key Code Patterns:**
  - Hover overlay with backdrop-blur and scale animation
  - Outlined tags with uppercase + 0.1em letter-spacing
  - Vibe metadata as "badges of honor" for creators

- **Documentation:**
  - `docs/dev-logs/phase-2-card-component-polish.md` - Full design review
  - `docs/UI_TEAM_WORKFLOW.md` - Workflow status update

### Added - Three Revolutionary Homepage Designs (2026-03-17)
- **Three Completely Different Design Directions:**

  1. **Code Gallery (Immersive Exhibition)**
     - Full-screen parallax hero with "Where Code Meets Art" gradient title
     - Mouse-tracking spotlight effect (600px radius)
     - Floating code particles animation in background
     - Three-step journey timeline (Record → Share → Grow)
     - Asymmetric masonry grid (first article 2x2)
     - Terminal-style code art showcase
     - Scroll progress indicator with spring animation
     - Route: `/` (default)

  2. **Cyberpunk Terminal**
     - Matrix rain canvas animation (Japanese + numbers)
     - Neon grid background with perspective effect
     - CRT scanline overlay
     - Typing animation with cycling commands
     - Glitch text effect on titles
     - File system-style article cards (SYSTEM://, EXEC://)
     - Monospace-only typography
     - Route: `/cyberpunk`

  3. **Editorial Magazine**
     - Serif typography (Georgia) for headlines
     - Pull quote design with decorative lines
     - Magazine-style asymmetric grid
     - Reading time prominently displayed
     - Newsletter subscription section
     - Elegant, content-focused design
     - Route: `/editorial`

- **Documentation:**
  - Created `docs/REVOLUTIONARY_DESIGNS.md` - Design overview and comparison
  - Created `docs/PROMPT_ENGINEERING_DESIGNS.md` - Engineering prompts for each design
  - Prompts enable recreation/iteration of each design direction

- **Technical Implementation:**
  - All designs use Framer Motion for animations
  - Mock data for preview without Supabase connection
  - Defensive Supabase client for offline development
  - Shared design tokens from design-system.css

### Added - Frontend Redesign Phase 1 (2026-03-16)
- **Revolutionary Design System Foundation:**
  - Created `src/styles/design-system.css` with ~100 design tokens
  - Extended `tailwind.config.ts` with custom colors, spacing, shadows, animations
  - Updated `src/app/layout.tsx` with Outfit (display) and JetBrains Mono (code) fonts
  - Created `src/lib/animations.ts` with Framer Motion variants
  - Design Vision: "Code Gallery" - Where Every Article is an Exhibition Piece
  - Core Identity: Gradient Mesh | Glassmorphism | Code as Hero | Neon Accent
  - Design Review Score: 219/250 (Grade A - 87.6/100)

- **Color System:**
  - Background: Deep Space Black (#050508)
  - Primary Accent: Electric Violet (#8b5cf6)
  - Secondary Accent: Cyan Electric (#06b6d4)
  - Tertiary Accent: Rose Glow (#f43f5e)
  - Complete glow variables for each accent

- **Typography Strategy:**
  - Display: Outfit (geometric sans for headlines)
  - Body: Inter (optimized for readability)
  - Code: JetBrains Mono (excellent legibility)
  - Reading: Georgia (Medium-inspired 21px, 1.6 line-height)

- **Animation System:**
  - 6 duration presets (instant to slowest)
  - 7 custom easing functions (spring, dramatic, smooth)
  - 15+ Framer Motion variant presets
  - State-based animations (rest/hover/tap)

### Changed - CLAUDE.md Complete Rewrite (2026-03-16):
  - Version 3.0 - Complete team architecture documentation
  - Added Executive Layer: CTO + Chief UI Designer
  - Added Full Agent Roster with roles and levels
  - Added Dual-Track Development (Backend/Frontend split)
  - Added Git Worktrees parallel development workflow
  - Added Quality Gates (Technical + Design)
  - Added Independent Blog Publishing workflow
  - Added 10 Technical Metrics and 10 Design Metrics
  - Added Grade Scale (S/A/B/C/D/F)
  - Removed outdated content, consolidated rules

- **Implementation Plan Structure (2026-03-16):**
  - Added "Planning Principles" section to IMPLEMENTATION_PLAN.md
  - Every Phase/Step now split into BACKEND and FRONTEND tracks
  - Enabled git worktrees for parallel development
  - Backend and Frontend can be developed by separate agents simultaneously
  - Independent blog publishing per track

- **Agent Architecture Decoupling (2026-03-16):**
  - Created `design_reviewer` agent - Independent UI/UX design analysis
  - Simplified `develop_reviewer` agent - Now focuses purely on engineering
  - **Key Change:** Agents now work in parallel, publish separately:
    - `develop_reviewer` → Engineering blog (code, APIs, architecture)
    - `design_reviewer` → Design blog (UI/UX, visual analysis, design metrics)
  - **Workflow Benefits:**
    - Independent execution schedules
    - Separate article publishing
    - Can run concurrently for efficiency
    - Clear responsibility boundaries

### Added
- **Chief Technology Officer Agent (2026-03-16):**
  - Created `~/.claude/agents/chief-technology-officer.md` - Executive technical review agent
  - Mission: Make Viblog the #1 AI-Native Blog Platform globally through technical excellence
  - Evaluates 10 Technical Metrics (100 points total):
    1. Architecture Alignment (10pts) - System vision, patterns
    2. Code Quality (10pts) - Readability, structure
    3. Performance Impact (10pts) - Queries, caching, latency
    4. Security Posture (10pts) - OWASP, auth, validation
    5. Test Coverage (10pts) - Unit, integration, E2E
    6. Error Handling (10pts) - Graceful degradation
    7. Maintainability (10pts) - Coupling, cohesion
    8. Scalability (10pts) - 10x traffic, horizontal
    9. Documentation (10pts) - API docs, runbooks
    10. Technical Debt (10pts) - New debt, payoff plan
  - Grade scale: S (90-100), A (80-89), B (70-79), C (60-69), D (50-59), F (<50)
  - Target: Every PR must achieve Grade A (80+)
  - Sub-agent orchestration: Can invoke code-reviewer, security-reviewer, database-reviewer, architect
  - Blocks merge if P0 issues found or score below Grade B

- **Chief UI Designer Agent (2026-03-16):**
  - Created `~/.claude/agents/chief-ui-designer.md` - A top-tier design critic agent
  - Mission: Make Viblog the #1 AI-Native Blog Platform globally through design excellence
  - Evaluates 10 Design Metrics (100 points total):
    1. Visual Hierarchy (10pts) - Focal points, scanning patterns
    2. Balance & Layout (10pts) - Grid system, centering, whitespace
    3. Typography (10pts) - Font choices, type scale, line height
    4. Color Harmony (10pts) - Palette, contrast, accent usage
    5. Spacing System (10pts) - 8px grid, consistent gaps
    6. Component Design (10pts) - Buttons, cards, inputs polish
    7. Micro-interactions (10pts) - Hover, focus, loading states
    8. Responsive Design (10pts) - Breakpoints, mobile adaptation
    9. Brand Identity (10pts) - Memorability, differentiation
    10. Premium Feel (10pts) - Awwwards-worthy quality
  - Grade scale: S (90-100), A (80-89), B (70-79), C (60-69), D (50-59), F (<50)
  - Target: Every page must achieve Grade A (80+)
  - Critical mindset: Deep thinking, push back, self-review, redesign, refine
  - Outputs specific CSS fixes with reference to top products
  - Invoked by design_reviewer for professional evaluation

- **Design Reviewer Agent (2026-03-16):**
  - Created `~/.claude/agents/design_reviewer.md` - Independent design review agent
  - Own workflow: 8 steps from screenshot capture to blog publish
  - Publishes separate design review articles
  - Invokes chief-ui-designer for metric-based evaluation
  - Independent from develop_reviewer (parallel execution)

### Fixed
- **Image Analyzer Skills - Execution Capability (2026-03-16):**
  - Fixed image-analyzer-kimi and image-analyzer-qwen skills to be executable
  - Previous version: Skills returned documentation instead of performing analysis
  - New version: Skills now contain execution instructions for vision models
  - Both skills now:
    - Read image using Read tool automatically
    - Perform structured UI/UX analysis
    - Output markdown-formatted results
  - Updated files:
    - ~/.claude/skills/image-analyzer-kimi/SKILL.md
    - ~/.claude/skills/image-analyzer-qwen/SKILL.md

### Changed
- **Visual Analysis Workflow - Sequential Batch Processing (2026-03-16):**
  - CRITICAL FIX: Changed from parallel agents to sequential batch processing
  - Root cause: kimi-k2.5 context limits (Input: 128K, Output: 8K)
  - Parallel processing multiple images causes output overflow
  - New workflow: Process ONE image at a time → Save to tmp file → Clear context → Repeat
  - Updated files:
    - CLAUDE.md - RULE 4 updated to sequential batch processing
    - PRODUCT_COMP_ANALYSIS.md - RULE 4 and Step 3 updated
    - develop_reviewer.md v4.0 - Complete rewrite with:
      - Step 0: Initialize Checkpoint Tasks (SequentialThinking MCP)
      - Step 4: Sequential Batch Processing for visual analysis
      - TaskCreate/TaskUpdate integration for progress tracking
      - Recovery Mode updated for sequential processing

### Added
- **Supplemental Decision Points Documentation (2026-03-16 - Phase 9.6):**
  - BACKEND_STRUCTURE.md v4.0 - Added 10 new tables for extended features:
    - Multimedia: media_assets, video_links
    - Social Integration: social_accounts, social_prompts, share_history, credit_rewards
    - MCP Governance: mcp_registry, user_mcp_installs, mcp_configurations, local_mcp_sync
    - Credits System Design with earning rules and redemption options
  - VIBLOG_MCP_SERVICE_DESIGN.md v4.0 - Extended MCP tools to 8 layers:
    - Layer 6: Multimedia Management (upload_media_asset, link_video_to_article, sync_video_metadata)
    - Layer 7: Social Distribution (bind_social_account, configure_platform_prompt, generate_share_content, one_click_share, get_share_analytics)
    - Layer 8: MCP Governance (browse_mcp_market, install_mcp, configure_mcp, sync_local_mcp, invoke_mcp_tool)
    - AIDataSchema v2.0 interface with social platforms and installed MCPs
  - PRD.md v4.0 - Added 12 new user stories:
    - US-213~215: Multimedia Support (image upload, video links, sync)
    - US-216~220: Social Distribution (account binding, prompts, sharing, analytics, credits)
    - US-221~224: MCP Governance (marketplace, install, sync, invoke)
  - Key design decisions:
    - Credits baseline: 100 credits = 1 month subscription
    - Share incentive: 1 credit per platform
    - MCP marketplace with ratings and installation tracking
- **AI-Data-Native Architecture Documentation (2026-03-16):**
  - VIBLOG_MCP_SERVICE_DESIGN.md v3.0 - Added AI Data Access Protocol (Section 10)
    - AIDataSchema interface for AI self-discovery
    - Four data protocols: Structured Data, Vector Embeddings, Knowledge Graph, Time Series
    - Authorization model with three-level privacy
    - Data source-level authorization with token management
  - BACKEND_STRUCTURE.md v3.0 - Added 10 new AI-Data-Native tables:
    - external_links (user citations with snapshots)
    - user_insights (reflections with embeddings)
    - insight_links (insight-source associations)
    - article_paragraphs (for annotation and retrieval)
    - annotations (highlighting and margin notes)
    - user_interactions (behavioral analytics)
    - user_credits (contribution incentives)
    - credit_transactions (earning history)
    - authorization_tokens (AI access control)
    - Complete RLS policies and API endpoints
  - TECH_STACK.md v3.0 - Added AI-Data-Native infrastructure:
    - pgvector 0.5.1 for vector similarity search
    - Apache AGE 1.5.0 for knowledge graph
    - TimescaleDB 2.x for time series data
    - OpenAI text-embedding-3-small for 1536-dim embeddings
    - Cost analysis for embedding generation
  - PRD.md v3.0 - Added Human User Experience user stories:
    - US-200/201: Smart Markdown Input
    - US-202/203/204: Link Citation System
    - US-205/206/207: Annotation System (Medium-style)
    - US-208/209/210: Credits System
    - US-211/212: AI Authorization Management
  - FRONTEND_GUIDELINES.md v4.0 - Added AI-Data-Native UI components:
    - Smart Markdown Editor with AI formatting
    - Annotation UI (highlight, sidebar, creation modal)
    - Authorization Settings UI (data source toggles, privacy levels)
    - Credits Dashboard (balance, opportunities, transactions)
  - IMPLEMENTATION_PLAN.md v4.0 - Restructured Phase 10:
    - Phase 10.1: Database Infrastructure (Week 1-2)
    - Phase 10.2: Core MCP Tools (Week 2-4)
    - Phase 10.3: AI Data Access Protocol (Week 3-4)
    - Phase 10.4: Human User Experience Features (Week 4-6)
    - Phase 10.5: Testing & Documentation (Week 6-8)
    - Total: 6-8 weeks, merged phases 11-13 into visual redesign
- Phase 10 Planning Documentation (2026-03-16):
  - IMPLEMENTATION_PLAN.md updated with detailed Phase 10 steps (15-20 days estimate)
  - 5 sub-phases defined: Foundation, Core Tools, Infrastructure, Sync Protocol, Testing
  - Architecture decisions documented: Hybrid Data, Local-first Model Routing, Draft Buckets
  - VIBLOG_MCP_SERVICE_DESIGN.md updated with resolved technical questions
  - Rate limiting strategy: Client buffer + Server queue
  - Data sync protocol: User-authorized with granular control
- Key Design Principles (from Competitive Analysis):
  - 7 core principles defined: AI-Native, Content as Art, Code-First Reading, etc.
  - Design philosophy statement: "Treat every coding session as a masterpiece"
  - FRONTEND_GUIDELINES.md updated with Section 10
  - Visual system specifications derived from Pinterest, Dribbble, Awwwards
  - Component design specs: Article Card, Button, Code Block

- **MVP System Health Assessment (2026-03-16 - Phase 9 Complete):**
  - CTO Technical Review: 72/100 (Grade B) - Conditional approval
  - Chief UI Designer Review: 68.9/100 (Grade C+) - Significant improvements required
  - 9-page visual analysis with 10 design metrics each
  - Critical issues identified: 404 pages (28/100), missing hover states, placeholder icons
  - Article published: https://viblog.tiic.tech/article/phase-mvp-technical-design-review-viblog-system-health-check-mmt881rh
  - Output: `.ui_ux_experience_test/MVP_Design_Review/` folder with complete analysis

### Added
- Post-MVP planning documentation:
  - PRD.md v2.0 - Updated with AI-Native definition and dual-track users
  - APP_FLOW.md v2.0 - Added MCP session-to-article flow
  - TECH_STACK.md v2.0 - Added MCP-related technologies
  - FRONTEND_GUIDELINES.md v2.0 - Added Pinterest-style card design
  - BACKEND_STRUCTURE.md v2.0 - Added draft_buckets and MCP API schemas
  - IMPLEMENTATION_PLAN.md v3.0 - Post-MVP Phase 2 roadmap
  - PRODUCT_COMP_ANALYSIS.md - Competitive analysis framework
- Competitive Analysis Framework (Step 9.1):
  - 5-dimension evaluation system (IA, Visual, Flow, Features, Tech)
  - 1-5 scoring rubric for each dimension
  - Detailed evaluation criteria with observable indicators
  - Design token extraction template
  - Quick and detailed analysis templates
- Claude Code Analysis (Step 9.2):
  - Comprehensive MCP protocol analysis
  - Session recording pattern for Draft Bucket system
  - Multi-surface architecture study
  - Score: 23/25 (Reference implementation)
- Viblog MCP Service Design Document:
  - 5-layer tool architecture (14 tools total)
  - Layer 1: Data Collection (create_vibe_session, append_session_context, upload_session_context)
  - Layer 2: Structured Processing (generate_structured_context, update_structured_context)
  - Layer 3: Content Generation (generate_article_draft, update_article_draft, merge_sessions_to_article)
  - Layer 4: Publish Management (publish_article, get_session_status, list_user_sessions)
  - Layer 5: Intelligent Learning & Growth (learn_from_articles, analyze_project_health, create_project_assistant, get_growth_metrics, check_content_freshness)
  - Complete database schema for sessions, skills, knowledge graph
  - AI-Native growth flywheel design
  - Viblog MCP tools design: create_draft_bucket, update_draft_bucket, publish_article, get_user_articles
  - Draft Bucket database schema
  - Score: 23/25 (Reference implementation)
- Pinterest Deep Visual Analysis (Step 9.4):
  - Playwright screenshot capture: homepage hero, explore page, login modal
  - Deep visual analysis from screenshots
  - Pin card component specifications (236px width, 16px radius, variable height)
  - Featured topic card design (16:9 aspect ratio, gradient overlay)
  - Category grid layout (4×2, 150×100px cards)
  - Navigation bar specifications (64px height, search-focused)
  - Login modal design (484px width, 32px radius)
  - Button state designs (Primary red, Secondary gray)
  - Hover interaction patterns (scale 1.02, lift effect)
  - Updated analysis document to v2.0 with 6 new sections
  - Score: 22/25 (Reference implementation for visual-first feeds)
- Notion UI/UX Analysis (Step 9.5):
  - Complete 9-screenshot UI tour analysis
  - Block-based editor and slash commands pattern
  - AI integration model (dedicated nav + permission controls)
  - Library view with metadata table for Draft Bucket reference
  - Template-driven creation flow
  - Interactive onboarding patterns
  - Score: 24/25 (Reference implementation for AI-native content creation)
- Dual Vision Model Workflow (Competitive Analysis Improvement):
  - Created `image-analyzer-qwen` skill using qwen3.5-plus model
  - Created `image-analyzer-kimi` skill using kimi-k2.5 model
  - Configured environment variables in settings.json for model routing
  - kimi-k2.5: Deep visual analysis for complex UI/screenshots
  - qwen3.5-plus: Quick visual analysis for simple images
  - Completed Notion screenshot analysis with kimi model
  - Generated `notion-analysis_kimi.md` with detailed visual breakdown
  - Comparison analysis: kimi provides more precise design tokens and measurements
  - Recommendation: use kimi for detailed specs, qwen for quick overviews
- Cursor IDE Analysis (Step 9.3):
  - Full MCP protocol support confirmed (Tools, Prompts, Resources, Roots, Elicitation, Apps)
  - Transport methods: stdio, SSE, Streamable HTTP with OAuth
  - Plugin system architecture: Rules, Skills, Agents, Commands, MCP Servers, Hooks
  - Multi-surface presence: IDE, CLI, Slack, GitHub, GitLab, JetBrains
  - Agent tools: Semantic search, File ops, Terminal, Browser, Image generation
  - Checkpoint system for session rollback
  - Config interpolation with environment variable support
  - Team marketplaces for enterprise plugin distribution
  - Playwright screenshots: home hero, agent dashboard, MCP docs
  - Score: 24/25 (Reference implementation for AI-native IDE)
- Medium Platform Analysis (Step 9.6):
  - Following competitive analysis workflow correctly:
    - Step 1: Web scraping (firecrawl, exa) - Platform content
    - Step 2: Screenshots (Playwright) - 5 UI screenshots captured
    - Step 3: Visual Analysis (image-analyzer-kimi) - Deep visual understanding via 5 parallel agents
    - Step 4: Comprehensive Report - Integrated analysis
  - Reading typography: 21px Georgia serif, 1.6 line-height, 680px max-width
  - Engagement patterns: Clap system (1-50), highlight & share, save to library
  - Content management: 5 status tabs (Drafts/Scheduled/Published/Unlisted/Submissions)
  - Writer dashboard: 5 metrics with hourly updates, time-series chart
  - Progress bar pattern for reading position tracking
  - Score: 21/25 (Reference for reading experience)
  - Screenshots: 5 screenshots analyzed via image-analyzer-kimi skill
- Competitive Analysis Planning Update:
  - Added Step 9.7: Dribbble Analysis (Visual Design Showcase)
  - Added Step 9.8: Awwwards Analysis (Premium Web Design)
  - These design-focused platforms are critical for:
    - Understanding "premium visual design" patterns
    - Learning hover interactions and animation techniques
    - Extracting typography for design credibility
    - Achieving design-forward product feel
  - Renumbered Step 9.9: Synthesize Findings
- Dribbble Platform Analysis (Step 9.7):
  - Following competitive analysis workflow correctly:
    - Step 1: Web scraping (firecrawl, exa) - Platform content
    - Step 2: Screenshots (Playwright) - 5 UI screenshots captured
    - Step 3: Visual Analysis (image-analyzer-kimi) - Deep visual understanding via 5 parallel agents
    - Step 4: Comprehensive Report - Integrated analysis
  - Visual design patterns extracted:
    - 4-column responsive grid with 24px horizontal / 32-40px vertical gutters
    - Shot cards: 4:3 or 16:10 aspect ratio, 8-12px border radius
    - Hover effect: `translateY(-4px)` + box-shadow, 200ms transition
    - Pink accent color #ea4c89 (used sparingly)
    - Whitespace philosophy: 60-80px section gaps
  - Premium design principles documented for Viblog
  - Technical CSS translation for article cards and grid
  - Score: 22/25 (Reference for premium visual design)
  - Screenshots: 5 screenshots analyzed via image-analyzer-kimi skill
- Awwwards Platform Analysis (Step 9.8):
  - Following competitive analysis workflow correctly:
    - Step 1: Web scraping (firecrawl, exa) - Award system, jury process
    - Step 2: Screenshots (Playwright) - 12 UI screenshots captured (deep exploration)
    - Step 3: Visual Analysis - 12 parallel agents for comprehensive coverage
    - Step 4: Comprehensive Report - Integrated analysis
  - Key visual patterns extracted:
    - SOTD Badge: Border-style with large score number (7.36/10)
    - Pricing contrast pattern: Dark Pro card (2x width) vs White Standard
    - Score transparency: Jury votes visible with individual member scores
    - Typography: 72-96px for major titles, minimal color palette
    - Dashboard: 3-column grid with icon + title + description cards
  - Award hierarchy documented: HM → SOTD → Developer Award → SOTM → SOTY
  - Developer Award criteria: Semantics, Animations, Accessibility, WPO, Responsive, Markup
  - Premium interaction principles for Viblog
  - Score: 22/25 (Reference for premium award platforms)
  - Screenshots: 12 screenshots analyzed via parallel agents
- Competitive Analysis Workflow Enhancement (CRITICAL):
  - **Root Cause:** Repeated serious errors during competitive analysis:
    1. Playwright exploration too shallow (only 2 layers)
    2. glm-5 called for visual analysis (TEXT-ONLY model, caused input errors)
    3. Step 1 and Step 2 not decoupled (data lost on rollback)
  - **Consequences:** Session rollbacks, wasted API calls, productivity loss
  - **Solution:** Updated PRODUCT_COMP_ANALYSIS.md Section 0 with 6 MANDATORY RULES:
    - RULE 1: Step 1 MUST save to *.md before Step 2
    - RULE 2: Playwright MUST deep explore all layers (5-8+ screenshots)
    - RULE 3: Step 2 MUST stop and report, wait for user confirmation
    - RULE 4: Visual analysis MUST use parallel agents (one image per agent)
    - RULE 5: Comprehensive report after all visual analysis complete
    - RULE 6: Self-update IMPLEMENTATION_PLAN.md and CHANGELOG.md, then report
  - Updated CLAUDE.md with workflow reference and mandatory rules table
  - Added clear warnings about glm-5's lack of vision capability
- Competitive Analysis Synthesis (Step 9.9):
  - Comprehensive synthesis of all 7 product analyses
  - Created feature comparison matrix (Section 6.2)
  - Identified 5 key differentiation opportunities:
    1. MCP-Native Blogging Platform (P0) - First mover advantage
    2. Session-to-Article Automation (P0) - 10x faster content creation
    3. Dual-Layer Content Format (P0) - Human + AI consumable
    4. Pinterest-Style Article Cards (P1) - Visual quality differentiation
    5. AI-Native Reading Experience (P1) - Code-optimized typography
  - Documented technical implementation recommendations
  - Created priority roadmap for P0/P1 features
  - Average competitor score: 22.7/25 (reference quality)
  - **Phase 9 Status:** COMPLETED
- Phase 9 DEVELOPLOG Update:
  - Comprehensive "What Went Well" section with 3 Good Cases
  - Good Case 1: Awwwards screenshot capture - Think-first approach
  - Good Case 2: Parallel visual analysis with vision-capable models
  - Good Case 3: Documentation updates following RULE 6
  - Comprehensive "What Could Be Better" section with 4 Bad Cases
  - Bad Case 7: glm-5 called for visual analysis (CRITICAL)
  - Bad Case 8: Playwright exploration too shallow
  - Bad Case 9: Step 1 and Step 2 not decoupled
  - Bad Case 10: Proceeding without user confirmation
  - Lessons learned: Workflow engineering with explicit guardrails
  - DEVELOPLOG.md version updated to 4.0

---

## [0.2.0] - 2026-03-14

### Added
- Secure API key storage with AES-256-GCM encryption (Phase 8)
  - `src/lib/encryption.ts` - Encryption utility with encrypt/decrypt/mask functions
  - `src/lib/api-keys.ts` - Server-side key retrieval for internal use
  - `src/app/api/user/api-keys/route.ts` - GET/PUT/DELETE endpoints for key management
  - `src/app/(dashboard)/dashboard/settings/page.tsx` - Settings UI for managing keys
  - Updated onboarding steps to use encrypted storage via API
  - Added `ENCRYPTION_KEY` to environment variables and CI workflow
- CI/CD pipeline with GitHub Actions
  - Automated lint, type-check, build, and test on every PR
  - pnpm caching for faster CI runs
  - Skips E2E tests in CI (Supabase rate limits)
- E2E test infrastructure with Playwright
  - `playwright.config.ts` with base URL, retries, and browser configuration
  - Test fixtures with authentication helpers (username, email, password)
  - Page Object Models for Login, Register, Dashboard, ArticleEditor
  - E2E tests for login and registration UI flows (8 passing tests)
  - Authenticated tests template (requires `E2E_RUN_AUTH_TESTS=1`)
  - NPM scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:debug`, `test:e2e:report`
- Test infrastructure for Phase 6
  - Test utilities with custom render function
  - Mock factories for User, Project, Article types
  - Mock Supabase client helpers
- Comprehensive test suite (142 tests, 20.15% coverage)
  - Validation tests for all form schemas
  - Component tests for LoginForm, RegisterForm, ProjectForm, PublishModal
  - UI component tests for Button, Input, Label, Card
  - Hook tests for useToast
  - API tests for Projects, Articles, and Article Publish endpoints
- Custom domain configuration: `viblog.tiic.tech`
  - Added `NEXT_PUBLIC_SITE_URL` environment variable
  - Updated `.env.local` and `.env.local.example`
  - Fixed build error by converting vitest.config.ts to JS

---

## [0.1.0] - 2026-03-13

### Added
- Project documentation suite created:
  - PRD.md - Product Requirements Document
  - APP_FLOW.md - Application Flow Document
  - TECH_STACK.md - Technology Stack Document
  - FRONTEND_GUIDELINES.md - Frontend Design Guidelines
  - BACKEND_STRUCTURE.md - Backend Structure Document
  - IMPLEMENTATION_PLAN.md - Implementation Plan
  - CHANGELOG.md - This changelog
- Updated CLAUDE.md with development workflow rules
- Database schema created via Supabase migrations
  - profiles table with RLS
  - projects table with RLS
  - articles table with RLS
  - user_settings table with RLS
  - stars table with RLS
- Generated TypeScript types from database schema
- Authentication system implemented
  - Login page with form
  - Register page with form
  - Forgot password page with form
  - Auth callback API route
  - Supabase auth integration
- Onboarding flow implemented
  - Step 1: LLM configuration
  - Step 2: Database configuration
  - Step 3: Vibe platform selection
  - Step 4: Discovery source tracking
  - Step 5: Welcome blog generation
- Dashboard layout implemented
  - Responsive sidebar navigation
  - User menu with dropdown
  - Dashboard stats component
  - Recent articles component
- Project management implemented
  - Projects list page with cards
  - Create project form
  - Edit project form
  - Delete with confirmation dialog
  - Project API routes (GET, POST, PUT, DELETE)
- Article management implemented
  - Articles list page with status indicators
  - Rich text editor with Tiptap
  - Article form with vibe coding metadata
  - Auto-save every 30 seconds
  - Publish modal with visibility and pricing options
  - Article API routes (GET, POST, PUT, DELETE, PUBLISH)
- Timeline view implemented
  - Projects and articles grouped by date
  - Expandable project buckets with nested articles
  - Quick actions (edit, delete) on hover
- Public feed implemented
  - Public layout with header and footer
  - Article card component with 3-section layout
  - Feed filters (platform, sorting)
  - Pagination with load more
  - Public articles API with filtering and sorting
- Article detail page implemented
  - Article detail API route with slug lookup
  - Article content renderer for Tiptap JSON/HTML
  - Article header with metadata and author info
  - Star functionality with toggle API
  - Share functionality with native share/clipboard
  - Related articles from same author
  - SEO metadata with OpenGraph and Twitter cards
  - Views count increment on page visit
- User profile pages implemented
  - User profile API route with stats
  - Profile header with avatar, bio, social links
  - Profile articles list with pagination
  - SEO metadata for profiles
- Loading states and error boundaries
- Accessibility features (skip links, ARIA labels)
- Testing infrastructure (Vitest)

### Changed
- Updated API routes for Next.js 16 compatibility (params is now Promise)

---

## Version History

| Version | Date | Milestone |
|---------|------|-----------|
| 0.2.0 | 2026-03-14 | Post-MVP: Secure storage, E2E tests, CI/CD |
| 0.1.0 | 2026-03-13 | MVP Release |
| 0.0.1 | 2026-03-12 | Project initialization |

---

**Last Updated:** 2026-03-16
### Added - Competitive Analysis: Effortel Blog (2026-03-17)

- **Target:** https://www.effortel.com/categories/blog
- **Platform:** Webflow (B2B Telecom/MVNE)
- **Score:** 22/25 (Reference Implementation)

**Key Findings:**

- **Color System:**
  - Dark theme: #1B2123 (page), #22282A (cards)
  - Cyan accent: #66E8FA (primary CTA)
  - Secondary accents: #2EF5BD (mint), #DCFC4C (yellow)
  - Text hierarchy: White → #B1C5CE → #77858B

- **Typography:**
  - Font: Satoshi Variable (custom variable font)
  - Hero headlines: 64-72px, tight line-height (1.1-1.15)
  - Tags: Uppercase, wide letter-spacing (0.1em)
  - Body: 16px, comfortable line-height (1.6)

- **Card Design:**
  - Border radius: 16px
  - Border: 1px solid #394247
  - Hover: Overlay with arrow reveal
  - Thumbnail aspect ratio: 16:10

- **Spacing:**
  - Section padding: 80-120px
  - Container max: 1400px
  - Grid gaps: 24px (standard)

- **Components:**
  - Buttons: 8px border radius, 12-16px vertical padding
  - Tags: Outlined, 4px border radius, uppercase
  - Cookie modal: 16px border radius, subtle shadow

**Design Patterns for Viblog:**
- Adopt: Dark theme + cyan accent, 16px card radius, card hover overlays
- Adapt: Font family to Inter/Outfit, adjust to brand colors
- Avoid: Multiple accent colors, complex navigation

**Artifacts:**
- Full analysis: `.competitive-analysis/effortel-ui-ux-analysis.md`
- Screenshots: `.comp_product_assets/traditional-blogs/effortel_screenshots/`
- Scraped data: `.comp_product_assets/traditional-blogs/effortel-scraped.md`

### Added - Code Gallery UI Development (2026-03-17)

**Phase 1: Design Token Refinement - COMPLETED**
- Border radius scale: 4px/8px/12px/16px (Effortel-aligned)
- Hero/Display line heights: 1.1/1.15 (premium typography)
- Tag/Badge system tokens: transparent bg, 4px radius, 0.1em letter-spacing
- Deprecation: `rounded-2xl` (28px) → `rounded-xl` (16px)
- Reference: `docs/dev-logs/phase-1-design-token-refinement.md`

**Phase 2: Card Component Polish - COMPLETED**
- **2.1 Border Radius Migration:** Updated cards from `rounded-2xl` to `rounded-xl`
- **2.2 Hover Overlay Enhancement:**
  - Added diagonal gradient overlay (135deg, black/80 → transparent)
  - Arrow icon reveal on hover with spring animation
  - 300ms transition duration
- **2.3 16:10 Aspect Ratio:**
  - Image containers use `aspect-[16/10]` for consistent proportions
  - Object-cover for proper image fitting
- **2.4 Outlined Tag Component:**
  - Pattern: `bg-transparent border-white/[0.15] rounded-sm`
  - Typography: 11px, uppercase, tracking-widest
  - Displays: `vibe_model` and `vibe_duration_minutes` tags
  - Positioned after title, before excerpt

**Technical Implementation:**
- Card structure: Image container (aspect ratio + badge + hover overlay) + Content section
- Fixed duplicate hover overlay bug (removed incorrectly placed duplicate)
- All changes aligned with Effortel design patterns (22/25 score reference)

**Files Modified:**
- `src/app/(public)/page.tsx` - Exhibition card component updates
- `src/styles/design-system.css` - Phase 1 design tokens
- `tailwind.config.ts` - Token synchronization

