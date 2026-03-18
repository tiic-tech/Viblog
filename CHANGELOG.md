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
- **Phase 11.6.2: Provider Adapter Layer - COMPLETE (2026-03-18 09:51):**
  - Created `src/lib/llm/` library with Strategy Pattern for multi-provider support
  - Core types: `ILLMProviderAdapter`, `ChatMessage`, `ChatResponse`, `StreamChunk`, etc.
  - Abstract base class `BaseProviderAdapter` with common utilities:
    - Cost estimation based on token pricing
    - HTTP request helpers with error handling
    - Token counting heuristics
    - Options merging with model defaults
  - Provider factory with `getProviderAdapter()`, `getAllProviders()`, `isProviderSupported()`
  - 9 Provider Adapters implemented:
    - OpenAI - Reference implementation with streaming, structured output, vision
    - Anthropic - Claude models with messages API
    - Gemini - Google's Gemini with OpenAI-compatible endpoint
    - DeepSeek - Chinese provider with competitive pricing
    - Moonshot - Kimi models with long context
    - Qwen - Alibaba's Qwen series
    - Zhipu AI - GLM models from Tsinghua University
    - MiniMax - abab models with voice capabilities
    - OpenRouter - Gateway to 100+ models from various providers
  - Fixed logger.test.ts to use `vi.stubEnv()` for environment variable mocking
  - TypeScript compilation clean with no errors
- **Phase 11.6.1: Database Schema & Provider Registry - COMPLETE (2026-03-18 10:30):**
  - Created `llm_providers` table - Provider metadata with capabilities
  - Created `llm_models` table - Model catalog with pricing and context windows
  - Created `user_llm_configs` table - User configurations with encrypted API keys
  - Created `llm_usage_logs` table - Usage tracking and cost attribution
  - Row Level Security policies for all tables
  - Performance indexes for common query patterns
  - Auto-updating `updated_at` triggers
  - Seed data: 9 providers (OpenAI, Anthropic, Google Gemini, DeepSeek, Moonshot, Qwen, Zhipu AI, MiniMax, OpenRouter)
  - Seed data: 36 models across all providers
  - Migrations applied via Supabase MCP
- **Phase 11.6: LLM Platform Configuration - PLANNED (2026-03-18):**
  - Comprehensive plan for multi-provider LLM support integrated into IMPLEMENTATION_PLAN.md
  - 9 LLM Providers planned: OpenAI, Anthropic, Google Gemini, DeepSeek, Moonshot, OpenRouter, Qwen, Zhipu AI, MiniMax
  - LLM Provider Adapter Pattern using Strategy design pattern for extensibility
  - Database schema designed: llm_providers, llm_models, user_llm_configs, llm_usage_logs
  - AES-256-GCM encryption for secure API key storage
  - SSE (Server-Sent Events) for streaming chat responses
  - JSON Schema structured output for type-safe AI responses
  - Usage tracking and cost attribution per user/provider
  - 7 implementation steps (Phase 11.6.1-11.6.7)
  - Estimated 8-day implementation timeline
  - This is a P0 requirement for Human Experience enhancement
- **Phase 11.5.2: Health Check Endpoints - COMPLETE (2026-03-18 00:30):**
  - Created `/api/health` - Comprehensive health check with component status
  - Created `/api/health/ready` - Kubernetes readiness probe endpoint
  - Created `/api/health/live` - Kubernetes liveness probe endpoint
  - Features:
    - Database connectivity check with latency measurement
    - Cache health with Redis/memory mode detection
    - Overall status aggregation (healthy/degraded/unhealthy)
    - Request ID tracking for distributed tracing
    - Uptime tracking for liveness probe
  - 12 comprehensive tests covering all endpoints
  - Structured logging integration for health events
- **Phase 11.5.1: Structured Logging - COMPLETE (2026-03-18 00:24):**
  - Created structured JSON logging utility with request ID tracking
  - Implemented performance timing with `logger.time()` and `startTimer()`
  - Added specialized logging methods: `apiRequest()`, `dbOperation()`, `cacheOperation()`, `authEvent()`
  - Integrated structured logging into key modules:
    - `token-auth.ts`: Auth event logging, cache hit/miss tracking
    - `cache.ts`: Structured error logging for Redis operations
    - `rate-limit.ts`: Rate limit violation logging
  - Request ID context management: `setRequestId()`, `getRequestId()`, `clearRequestId()`
  - Helper functions: `withLogging()`, `withLoggingAsync()` for scoped logging
  - File: `src/lib/logger.ts` with 22 passing tests
- **Phase 11.4: Caching Layer - COMPLETE (2026-03-17 23:50):**
  - Implemented Redis-compatible cache layer with Upstash support
  - Created cache utilities: getCache, setCache, getOrSetCache, deleteCache
  - Implemented cache-aside pattern for read-heavy endpoints
  - Cache invalidation on token mutations (DELETE/PATCH operations)
  - TTL configurations: API key validation (5 min), LLM context (1 hour), User sessions (5 min)
  - Cache key prefixes for organized invalidation: api_key:, session:, llm_context:
  - Token hash (SHA-256) used as cache key for secure invalidation
  - Files: `src/lib/cache/client.ts`, `src/lib/cache/cache.ts`, `src/lib/cache/invalidation.ts`
  - Tests: 11 cache invalidation tests passing
- **Phase 11.2.2: Environment-Based Rate Limiting & Monitoring - COMPLETE (2026-03-17 23:38):**
  - Environment-based rate limit configuration (stricter in production)
  - Production limits are 50% of development limits automatically
  - Rate limit violation monitoring and statistics tracking
  - Statistics API: `getRateLimitStats()` for monitoring
  - Structured JSON logging for production rate limit violations
  - New exports: `isProduction()`, `getRateLimitStats()`, `clearStats()`
  - 9 new tests for environment config and statistics (58 total tests)
  - Updated `.env.local.example` with rate limiting documentation
  - All API routes automatically protected via middleware integration
- **Phase 11.2.1: Rate Limiting Middleware - COMPLETE (2026-03-17 23:31):**
  - Implemented sliding window rate limiting algorithm
  - Created in-memory rate limit store with automatic cleanup
  - Per-IP and per-user identification from request headers
  - Configurable rate limits per endpoint pattern:
    - Auth: 10 req/min (strict security)
    - LLM/generate: 20 req/min (cost control)
    - AI: 50 req/min
    - Vibe sessions: 100 req/min
    - Fragments: 500 req/min (high for MCP use)
    - Default: 60 req/min
  - Rate limit response headers (X-RateLimit-Limit, -Remaining, -Reset, Retry-After)
  - Integration with Next.js middleware for API routes
  - Comprehensive test suite: 49 tests passing
  - Commit ec01da7: 5 files changed, 1001 insertions
  - Files: `src/lib/rate-limit.ts`, `src/lib/middleware/rate-limit.ts`
- **Phase 11.1: Test Coverage Expansion - COMPLETE (2026-03-17 21:34):**
  - Added Vitest testing framework with v8 coverage
  - Created 68 comprehensive tests across 5 test files
  - Achieved 99.03% overall coverage (target: 90%+)
  - 100% function coverage, 98.38% branch coverage
  - Test files:
    - `src/api/client.test.ts` - 23 tests for ViblogApiClient
    - `src/tools/handlers.test.ts` - 22 tests for ToolHandler
    - `src/tools/index.test.ts` - 17 tests for tool definitions
    - `src/types.test.ts` - 4 tests for getServerConfig
    - `src/server.test.ts` - 2 tests for server creation
  - Phase 11.1 P0 BLOCKER resolved
- **Phase 11.3: Error Handling Improvements - COMPLETE (2026-03-17 22:48):**
  - Created custom error class hierarchy for MCP Server:
    - `McpServerError` (base class with toJSON, toUserMessage)
    - `ConfigurationError`, `ValidationError`, `ApiError`
    - `RateLimitError`, `NetworkError`, `UnknownError`
  - Implemented Zod validation schemas for all 6 MCP tools:
    - `create_vibe_session`, `append_session_context`, `upload_session_context`
    - `generate_structured_context`, `generate_article_draft`, `list_user_sessions`
  - Added helper functions: `toMcpError()` (error conversion), `isMcpError()` (type guard)
  - 198 tests passing across 8 test files (99%+ coverage)
  - Commit 8843891: 19 files changed
  - Files: `src/errors.ts`, `src/validation.ts`, `src/errors.test.ts`, `src/validation.test.ts`
- **MILESTONE: End-to-End MCP Verification Complete (2026-03-17 20:55):**
  - All 6 MCP tools verified working in Claude Code session
  - Verified tools: list_user_sessions, create_vibe_session, append_session_context
  - Created verification session: bd46ae60-d7b2-48bb-b568-71ae77ccdd76
  - Full workflow: Claude Code → MCP Server → REST API → Supabase (all green)
  - Article generation requires LLM API key (optional feature)
  - **Mission Accomplished:** Claude Code can now write directly to Viblog via MCP
- **MILESTONE: MCP Server MVP Complete - Production Working (2026-03-17 17:40):**
  - MCP API Key authentication fully functional in production
  - Tested endpoints: create session, append fragments - ALL PASSING
  - Critical fix: SUPABASE_SERVICE_SECRET_KEY (not ROLE_KEY) environment variable
  - Session created: fcc763ff-9d3e-460a-8e11-5ddf71e7c428 (Milestone recording)
  - Next: Configure global MCP settings for Claude Code auto-loading
- **CORE GOAL: Claude Code → Viblog MCP Integration (2026-03-17):**
  - Mission: Enable Claude Code to write and publish directly to Viblog via MCP configuration
  - Eliminates Playwright-based indirect publishing workflow
  - Timeline: 5-8 days for full MCP integration
  - User selected "Pivot to MCP Server (Recommended)" approach
- **Phase 10.4: MCP Server npm Package (BUILD SUCCESSFUL - 2026-03-17):**
  - Created standalone npm package `@viblog/mcp-server` with stdio transport
  - Package location: `packages/viblog-mcp-server/`
  - Implemented 6 MCP tools:
    - Layer 1: Data Collection (create_vibe_session, append_session_context, upload_session_context)
    - Layer 2: Structured Processing (generate_structured_context)
    - Layer 3: Content Generation (generate_article_draft)
    - Layer 4: Session Management (list_user_sessions)
  - Architecture:
    - `src/index.ts` - Entry point with StdioServerTransport
    - `src/server.ts` - MCP server setup with ListToolsRequestSchema and CallToolRequestSchema handlers
    - `src/tools/index.ts` - Tool definitions with Zod-style inputSchema
    - `src/tools/handlers.ts` - Tool execution logic with error handling
    - `src/api/client.ts` - REST API client for backend communication
    - `src/types.ts` - Shared types (re-exports CallToolResult from SDK)
  - Uses `@modelcontextprotocol/sdk` for MCP protocol implementation
  - TypeScript ESM modules with NodeNext resolution
  - **CI PASSED (2026-03-17 14:43):** All checks green (Type check, Build, Tests 166 passed)
  - PR #9 ready for merge: https://github.com/tiic-tech/Viblog/pull/9
- **Phase 10.3: AI Data Access Protocol (2026-03-17):**
  - Implemented AIDataSchema endpoint (GET /api/v1/ai/schema)
  - Implemented Vector Search API (POST /api/v1/ai/vectors/{store}/search)
  - Implemented Knowledge Graph API (POST /api/v1/ai/graph/{graph}/query)
  - Implemented Time Series API (GET /api/v1/ai/timeseries/{metric})
  - Created AI data access validation schemas (Zod)
  - Created token-based authentication middleware for MCP/authorization tokens
  - Created embedding service with fetch-based OpenAI API calls
  - Added getUserLLMConfig utility for LLM configuration retrieval
- **Phase 10.2: Core MCP Tools (2026-03-17):**
  - Created vibe_sessions and session_fragments tables with RLS policies
  - Implemented create_vibe_session MCP tool (POST /api/vibe-sessions)
  - Implemented append_session_context MCP tool (POST /api/vibe-sessions/[id]/fragments)
  - Implemented upload_session_context MCP tool (PUT /api/vibe-sessions/[id]/fragments)
  - Implemented generate_structured_context MCP tool (POST /api/vibe-sessions/generate-structured-context)
  - Implemented generate_article_draft MCP tool (POST /api/vibe-sessions/generate-article-draft)
  - Created LLM service with fetch-based OpenAI API calls (no SDK dependency)
  - Created Zod validation schemas for session and structured context types
  - Full CRUD API for vibe sessions (GET/POST/PATCH/DELETE)
  - Fragment management API (GET/POST/PUT/DELETE)
- **Phase 10.1: Database Infrastructure (2026-03-16 ~ 2026-03-17):**
  - Enabled pgvector extension for vector similarity search
  - Created 11 new AI-Data-Native tables with RLS policies:
    - `graph_nodes`, `graph_edges` - JSONB-based knowledge graph fallback
    - `external_links` - User external link citations with embeddings
    - `user_insights` - User reflections with vector embeddings
    - `insight_links` - Insight-source associations
    - `article_paragraphs` - Paragraph-level content for retrieval
    - `annotations` - Medium-style highlights and margin notes
    - `user_interactions` - Behavioral analytics (time-series)
    - `user_credits`, `credit_transactions` - Credits system
    - `authorization_tokens` - MCP API and authorization tokens
  - Created token generation utility (`src/lib/token-generator.ts`)
  - Created token verification utility (`src/lib/token-verification.ts`)
  - Created MCP API Keys endpoint (`/api/user/mcp-keys`)
  - Created Authorization Tokens endpoint (`/api/user/authorization-tokens`)
  - Updated TypeScript types for all new tables
  - Documented All-in-One PostgreSQL architecture with microservice migration paths
  - Documented Dual-Track Database Architecture (2026-03-17):
    - Platform DB + User DB decoupled architecture
    - Managed Proxy Architecture: Users need only ONE PostgreSQL connection
    - Platform microservice migration is INVISIBLE to users
    - Migration triggers and thresholds for future scaling

### Changed
- **CLAUDE.md Complete Rewrite (2026-03-16):**
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
- **CI TypeScript Errors (2026-03-17):**
  - Fixed mock `TokenAuthResult` type errors in `dual-auth.test.ts` (added missing `null` properties)
  - Excluded `packages/` directory from root TypeScript config (MCP server is standalone npm package)
  - Root cause: TypeScript include pattern `**/*.ts` picked up MCP server files without SDK installed
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