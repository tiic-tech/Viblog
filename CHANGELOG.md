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

**Last Updated:** 2026-03-15