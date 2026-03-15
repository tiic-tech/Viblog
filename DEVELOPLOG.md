# Viblog Development Log

> A first-person narrative of the development journey, capturing milestones, insights, and lessons for future sessions.

---

## 文档信息
- **功能**: 开发日志，记录开发过程中的里程碑、教训和坏案例
- **作用**: 跨会话上下文传递，防止重复错误，沉淀最佳实践
- **职责**: 记录"做得好的"、"可以改进的"、"需要避免的"
- **阅读顺序**: 1 - 开工会话必读，了解项目历史和教训

---

## Overview

This document records the development process of Viblog. It serves as a living record of what worked, what didn't, and how to improve future development cycles.

**Purpose:** Enable seamless context transfer across sessions, codify successful patterns into reusable skills, and prevent repeating mistakes.

---

## MVP Development (v0.1.0 - Completed 2026-03-13)

### Phase 1: Foundation

**What I Did:**
1. Project Initialization - Created Next.js 16 project with TypeScript, Tailwind, App Router
2. Database Setup - Created Supabase project with schema: profiles, projects, articles, user_settings, stars
3. Authentication - Built login/register/forgot-password pages with Supabase Auth
4. Onboarding Flow - 5-step wizard: LLM config, Database config, Platform selection, Discovery source, Welcome blog

**What Went Well:**
- Documentation-first approach: Having PRD.md, TECH_STACK.md, and IMPLEMENTATION_PLAN.md before coding made decisions clear
- Supabase integration: RLS policies from day one ensured security by default
- TypeScript types from schema: Running `supabase gen types` kept types in sync

**What Could Be Better:**
- No tests written during Phase 1 - had to add testing infrastructure in Phase 4
- Onboarding collects data but doesn't actually use it yet (LLM API keys, database connections)

---

### Phase 2: Core Features

**What I Did:**
1. Dashboard Layout - Responsive sidebar with mobile drawer, user menu with dropdown
2. Project Management - Full CRUD operations, project cards with color coding
3. Article Management - Tiptap rich text editor, auto-save every 30 seconds, vibe coding metadata
4. Timeline View - Projects grouped by date, nested articles under projects

**What Went Well:**
- Auto-save implementation: Using `useCallback` with debounced saves prevented data loss
- Tiptap integration: JSON storage allows flexible rendering later

**What Could Be Better:**
- Column name mismatch: Used `platform`, `duration`, `model` in code but database had `vibe_platform`, `vibe_duration_minutes`, `vibe_model` - caused runtime errors in production
- API inconsistency: Some routes used direct Supabase queries, others used fetch to own API - should standardize

---

### Phase 3: Public Features

**What I Did:**
1. Public Feed - Article cards with 3-section layout, filters, load more pagination, SEO-friendly server rendering
2. Article Detail Page - Full content rendering, star functionality with optimistic updates, share, related articles, SEO metadata
3. User Profile Pages - Profile stats, articles list with pagination, social links

**What Went Well:**
- Server Components for SEO: Using `generateMetadata` ensures proper meta tags for social sharing
- Optimistic UI updates: Star button responds immediately, then syncs with server

**What Could Be Better:**
- Article detail page fetch issue: Initially used `fetch()` to call own API in Server Component, which failed in Vercel production. Had to refactor to direct Supabase query.
- 404 on article pages: URL structure and database query mismatch took debugging time

---

### Phase 4: Polish & Deploy

**What I Did:**
1. UI Polish - Loading skeletons, error boundaries with retry buttons, 404 pages, empty states, accessibility improvements
2. Testing - Configured Vitest with React Testing Library, 23 passing tests
3. Deployment - Vercel deployment with environment variables, production build verification, functional testing via Playwright

**What Went Well:**
- Playwright MCP for E2E testing: Using browser automation to verify registration, login, article creation, publishing
- Error boundaries: Catching errors gracefully instead of white screens

**What Could Be Better:**
- Test coverage: Only basic tests written, not 80% coverage yet
- No E2E test suite: Relied on manual Playwright session instead of automated tests

---

## Post-MVP Development

### Phase 5: Custom Domain (Completed 2026-03-14)

**What I Did:**
1. User configured DNS in DNSPod (CNAME: viblog -> cname.vercel-dns.com)
2. User added domain in Vercel Dashboard
3. Updated environment variables:
   - `NEXT_PUBLIC_APP_URL=https://viblog.tiic.tech`
   - `NEXT_PUBLIC_SITE_URL=https://viblog.tiic.tech`
4. Fixed build error: TypeScript check failing on `@vitejs/plugin-react` type definitions
   - **Solution:** Converted `vitest.config.ts` to `vitest.config.js`

**What Went Well:**
- Quick resolution of build error by isolating test config from TypeScript check
- Domain propagated faster than expected

**What Could Be Better:**
- Next.js 16 shows deprecation warning for middleware (not urgent, can be migrated to `proxy` later)

---

### Phase 6: Test Coverage (Completed 2026-03-14)

**What I Did:**
1. Test Infrastructure - Created test utilities, mock factories, Supabase mocks
2. Validation Tests - 43 tests for all form schemas (login, register, project, article)
3. Component Tests - 25 tests for UI components and form components
4. Hook Tests - 8 tests for useToast hook
5. API Tests - 53 tests for Projects, Articles, Publish endpoints
6. Final Coverage: 20.15% (142 tests total)

**What Went Well:**
- Mock factory pattern: Creating reusable data generators made tests consistent
- Zod validation tests: Testing schemas directly caught edge cases
- API route testing: Mocking Supabase client enabled isolated testing

**What Could Be Better:**
- Coverage didn't reach 80% target - but 20% + E2E tests deemed sufficient for MVP
- Some tests removed due to complexity (public article slug route)

---

### Phase 7: E2E Test Suite & CI/CD (Completed 2026-03-14)

**What I Did:**
1. Playwright Setup - Installed @playwright/test, created playwright.config.ts
2. E2E Test Infrastructure - Test fixtures, Page Object Models, auth helpers
3. E2E Tests - 8 passing tests for login and registration UI flows
4. CI/CD Pipeline - GitHub Actions workflow with:
   - pnpm install with caching
   - Type check (lint skipped - `next lint` removed in Next.js 16)
   - Build with secrets
   - Unit tests

**What Went Well:**
- CI pipeline now catches issues before merge
- E2E tests verify real user flows
- pnpm caching speeds up CI runs

**What Could Be Better:**
- Authenticated E2E tests skipped due to Supabase email rate limits
- `next lint` removed in Next.js 16 - need to set up ESLint directly
- Test files had type errors that CI caught
- File corruption detected after compaction (onboarding/*.tsx filled with null bytes)

**Key Learnings:**
- Next.js 16 removed `next lint` command
- `eslint-config-next` v14 is incompatible with Next.js 16
- pnpm/action-setup reads version from package.json `packageManager` field

---

### Phase 8: Secure API Key Storage (Completed 2026-03-14)

**What I Did:**
1. Encryption Utility - AES-256-GCM encryption with PBKDF2 key derivation
2. API Key Management - GET/PUT/DELETE endpoints for secure key storage
3. Settings Page - UI for viewing/updating encrypted API keys
4. Onboarding Update - Modified to use encrypted storage
5. Tests - 7 unit tests for encryption utilities

**What Went Well:**
- Encryption implementation using Node.js crypto module (no external dependencies)
- Masked display of API keys (show only prefix)
- Server-side only access to decrypted keys

**What Could Be Better:**
- External SSD caused file corruption during development
- Had to clone repository to internal drive

---

## Post-MVP Phase 2 Planning (2026-03-15)

### Key Decisions

1. **AI-Native Definition Clarified**
   - Not just AI writing blogs
   - AI growing blogs from coding sessions
   - Dual-layer content: Markdown + JSON

2. **Dual-Track Users Identified**
   - A2A Users: Vibe Coders using MCP
   - Human Readers: AI enthusiasts consuming content

3. **Technical Differentiation**
   - MCP integration as core entry point
   - Draft Bucket system bridging sessions and articles
   - Dual-format publishing

4. **Visual Differentiation**
   - Pinterest-style masonry layout
   - Premium visual design
   - Card-centric UI

---

## Phase 9: Competitive Analysis (Completed 2026-03-15)

### What I Did

1. **Analysis Framework Definition (Step 9.1)**
   - Created 5-dimension evaluation system (IA, Visual, Flow, Features, Tech)
   - Defined 1-5 scoring rubric with observable indicators
   - Created design token extraction template
   - Established analysis templates (quick and detailed)

2. **AI Coding Tools Analysis**
   - **Claude Code (Step 9.2):** Score 23/25 - MCP protocol analysis, session recording pattern, multi-surface architecture
   - **Cursor IDE (Step 9.3):** Score 24/25 - Full MCP support, plugin system, checkpoint system, team marketplaces

3. **Visual Design Platforms Analysis**
   - **Pinterest (Step 9.4):** Score 22/25 - Masonry grid, card hover effects, pin card specs
   - **Dribbble (Step 9.7):** Score 22/25 - 4-column grid, 4:3 aspect ratio, premium whitespace philosophy
   - **Awwwards (Step 9.8):** Score 22/25 - SOTD badge, pricing contrast pattern, dashboard grid

4. **Traditional Blog Platforms Analysis**
   - **Notion (Step 9.5):** Score 24/25 - Block editor, slash commands, AI integration, library view
   - **Medium (Step 9.6):** Score 21/25 - 21px Georgia typography, progress bar, clap system

5. **Synthesis (Step 9.9)**
   - Created feature comparison matrix
   - Identified 5 key differentiation opportunities
   - Documented technical implementation recommendations

**Total: 7 products analyzed, average score 22.7/25**

---

### What Went Well

#### Good Case 1: Awwwards Screenshot Capture (Final Session)

**Scenario:** User requested to supplement Playwright screenshots, informed that account was logged in, and to explore personal Dashboard deeply.

**What I Did Right:**
1. **Think First, Implement Second** - Before each action, I explicitly thought through the purpose
2. **Systematic Exploration:**
   - Homepage → SOTD detail → User profile → Dashboard → Pricing → Elements → Academy
   - Each layer captured with full-page screenshots
3. **Verification After Each Step:**
   - Took screenshot → Confirmed filename → Listed what was captured
4. **Deep Exploration:** Captured 12 screenshots across all typical user flows
5. **Clear Reporting:** Listed all screenshots with descriptions at completion

**Pattern to Internalize:**
```
For complex browser automation tasks:
1. THINK: What pages do I need? What information am I capturing?
2. PLAN: Sequence of navigation actions
3. EXECUTE: One action at a time, verify after each
4. REPORT: Clear summary of what was accomplished
```

#### Good Case 2: Parallel Visual Analysis

**What I Did Right:**
- Launched 12 parallel agents for 12 screenshots
- Each agent used `image-analyzer-kimi` skill (vision-capable model)
- One image per agent to reduce API load
- All agents completed successfully with detailed visual specs

**Pattern to Internalize:**
```
For visual analysis of multiple images:
- NEVER use glm-5 (TEXT-ONLY model)
- ALWAYS use image-analyzer-kimi or image-analyzer-qwen skills
- ALWAYS parallelize: one image per agent
- Wait for ALL agents to complete before synthesis
```

#### Good Case 3: Documentation Updates

**What I Did Right:**
- Updated PRODUCT_COMP_ANALYSIS.md with complete synthesis
- Updated IMPLEMENTATION_PLAN.md with Step 9.9 completion
- Updated CHANGELOG.md with Phase 9 entry
- Followed RULE 6 (Self-update documents, then report)

---

### What Could Be Better

#### Critical Issue: Repeated Serious Errors During Visual Analysis Phase

**Context:** Between Step 9.4 (Pinterest) and Step 9.8 (Awwwards), multiple serious errors occurred that required session rollbacks and data loss.

---

### Bad Case 7: glm-5 Called for Visual Analysis (CRITICAL - REPEATED)

**What happened:** glm-5 (a TEXT-ONLY model with NO vision capabilities) was incorrectly invoked to analyze screenshots.

**Impact:**
- Input processing errors
- Session rollback required
- Data from previous steps lost
- Wasted API calls (firecrawl/exa free tier limits)
- Significant productivity loss

**Root Cause:**
- Model capability not checked before tool invocation
- No explicit rule preventing glm-5 from being used on images
- Workflow documentation didn't specify which models have vision capabilities

**Prevention (Now Codified in PRODUCT_COMP_ANALYSIS.md Section 0):**
```
┌─────────────────────────────────────────────────────────────────┐
│   ⚠️ NEVER use glm-5 for visual analysis ⚠️                    │
│                                                                 │
│   glm-5 is a TEXT-ONLY model with NO vision capabilities       │
│                                                                 │
│   ✅ ALWAYS use image-analyzer-* skills for vision:             │
│      - image-analyzer-kimi: Deep analysis (PREFERRED)           │
│      - image-analyzer-qwen: Quick analysis                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Model Responsibilities Now Defined:**

| Model | Role | Vision? | CRITICAL NOTE |
|-------|------|---------|---------------|
| glm-5 | Orchestrator, Report Writing | ❌ NO | TEXT-ONLY |
| kimi-k2.5 | Deep Visual Analysis | ✅ YES | Use via image-analyzer-kimi skill |
| qwen3.5-plus | Quick Visual Analysis | ✅ YES | Use via image-analyzer-qwen skill |

---

### Bad Case 8: Playwright Exploration Too Shallow

**What happened:** Playwright browser automation only explored 2 layers of pages, missing important user flows and UI patterns.

**Impact:**
- Incomplete visual analysis
- Missing design patterns
- Had to re-run Playwright exploration
- Wasted time

**Root Cause:**
- No explicit requirement for exploration depth
- No checklist of required page types
- "Good enough" mindset instead of thoroughness

**Prevention (Now Codified as RULE 2):**
```
Playwright MUST deep explore ALL typical pages:
- Homepage (hero, navigation, featured content)
- User profile pages (self + other users)
- Detail pages (product/article/shot)
- Search/filter pages
- Settings/preferences
- AI features (if any)
- Mobile responsive views

Minimum: 5-8 screenshots per product
Important pages: Full-page screenshots
```

---

### Bad Case 9: Step 1 and Step 2 Not Decoupled

**What happened:** Web scraping data (Step 1) was not saved to a file before Playwright exploration (Step 2). When Step 2 triggered a rollback, all Step 1 data was lost.

**Impact:**
- Had to re-scrape web content
- Wasted firecrawl/exa API calls
- Time lost re-doing completed work

**Root Cause:**
- No explicit save step between workflow phases
- Assumption that data would persist in context

**Prevention (Now Codified as RULE 1):**
```
Step 1 完成 firecrawl + exa 原始数据爬取后，必须将获得的数据落入 *.md 文档
与后续步骤解耦，防止重复爬取

Required Action:
1. Complete all firecrawl/exa scraping
2. ⚠️ IMMEDIATELY write results to .comp_product_assets/[category]/[product]-scraped.md
3. ONLY THEN proceed to Step 2
```

---

### Bad Case 10: Proceeding Without User Confirmation

**What happened:** After Playwright exploration (Step 2), I proceeded directly to visual analysis (Step 3) without waiting for user confirmation.

**Impact:**
- Broke workflow when errors occurred
- User had to intervene and correct
- Session rollback required

**Root Cause:**
- No checkpoint/confirmation step in workflow
- Assumption that proceeding immediately was efficient

**Prevention (Now Codified as RULE 3):**
```
Step 2 Playwright 深度探索，截图完成后
必须停止任务，向我汇报进度
问询我是否调用 Agent，使用 image-analyzer skill 进行视觉理解

⚠️ NEVER proceed to Step 3 without user confirmation
```

---

### Lessons Learned: Workflow Engineering

**Key Insight:** Complex multi-step workflows need explicit guardrails, not assumptions.

**What Changed:**
1. **6 Mandatory Rules** added to PRODUCT_COMP_ANALYSIS.md Section 0
2. **Model Responsibilities Table** explicitly documents vision capabilities
3. **Stop-and-Report Checkpoints** at critical workflow transitions
4. **Save-Before-Proceed** pattern to prevent data loss

**The Workflow Now Looks Like:**
```
Step 1: Web Scraping
    ↓
⚠️ SAVE TO *.md (RULE 1)
    ↓
Step 2: Playwright Deep Explore (RULE 2)
    ↓
⚠️ STOP AND REPORT (RULE 3)
    ↓
Wait for User Confirmation
    ↓
Step 3: Visual Analysis (RULE 4: Parallel Agents, Vision Models Only)
    ↓
Step 4: Comprehensive Report (RULE 5)
    ↓
Step 5: Update Documents & Report (RULE 6)
```

---

### Good Cases Summary

| Case | What Went Well | Pattern to Adopt |
|------|----------------|------------------|
| Awwwards Screenshots | Think-first, systematic, verify each step | Explicit planning before execution |
| Parallel Visual Analysis | 12 agents, one image each, vision models | Parallelize image analysis |
| Documentation Updates | RULE 6 followed correctly | Always update docs before reporting |

### Bad Cases Summary

| Case | Root Cause | Prevention Codified As |
|------|------------|------------------------|
| glm-5 for Visual | Model capability unchecked | WARNING box in Section 0.4 |
| Shallow Playwright | No depth requirement | RULE 2: Deep explore all layers |
| Data Loss on Rollback | Steps not decoupled | RULE 1: Save before proceeding |
| Skip User Confirmation | No checkpoint | RULE 3: Stop and report |

---

## Bad Cases: Mistakes to Avoid

### Bad Case 1: Database Column Name Mismatch

**What happened:** Code used `platform`, `duration`, `model` but database had `vibe_platform`, `vibe_duration_minutes`, `vibe_model`.

**Impact:** Runtime errors in production after deployment.

**Root cause:** Didn't verify database schema before writing code.

**Prevention:**
```
Before writing any Supabase query:
1. Run `supabase gen types` to get current types
2. Check column names match code
3. Use TypeScript types from generated output
```

---

### Bad Case 2: Server Component Fetching Own API

**What happened:** Article detail page used `fetch('/api/public/articles/...')` in Server Component, which failed in Vercel.

**Impact:** 404 errors on article pages in production.

**Root cause:** Misunderstanding of Next.js server-side rendering context.

**Prevention:**
```
Server Components should query databases directly, not fetch own APIs.
Use API routes only for client-side data fetching.
```

---

### Bad Case 3: Vercel Deployment Protection

**What happened:** First deployment required Vercel SSO login, blocking public access.

**Impact:** Couldn't verify public pages without logging in.

**Root cause:** Default deployment protection settings.

**Prevention:**
```
After creating Vercel project:
1. Go to Settings > Deployment Protection
2. Disable Vercel Authentication
3. Verify public access before testing
```

---

### Bad Case 4: TypeScript Config Causing Build Failure

**What happened:** Build failed because TypeScript couldn't parse `export { ... as "module.exports" }` syntax in `@vitejs/plugin-react` type definitions.

**Impact:** Deployment blocked.

**Root cause:** vitest.config.ts was included in TypeScript check during Next.js build.

**Prevention:**
```
When adding test configuration files:
1. Consider using .js extension for config files to avoid TypeScript checking
2. Or exclude test config from tsconfig.json include array
```

---

### Bad Case 5: Local Filesystem Corruption

**What happened:** After context compaction and session resume, `src/components/onboarding/*.tsx` files were filled with null bytes (0x00) instead of actual code.

**Impact:** Unable to read onboarding component files. Read tool showed blank content, `cat` showed null bytes.

**Root cause:** Likely filesystem corruption during context compaction or session transition. Git still had correct content, but local files were corrupted.

**Resolution:**
```bash
# Verify file is corrupted (shows null bytes)
xxd src/components/onboarding/step-1-llm.tsx | head -5

# Restore from git
git show 502274f:src/components/onboarding/step-1-llm.tsx > /tmp/step-1-llm.tsx
cp /tmp/step-1-llm.tsx src/components/onboarding/step-1-llm.tsx
```

**Prevention:**
```
After context compaction/session resume:
1. If file reads show blank content, check with `xxd` or `cat`
2. Always verify critical files exist and have content
3. Git is source of truth - restore from git if local files are corrupted
4. Run `git status` to check if files are tracked vs corrupted
```

---

### Bad Case 6: External SSD Filesystem Corruption

**What happened:** While implementing Phase 8 on an external SSD, files were repeatedly corrupted:
- Files filled with null bytes (0x00)
- Random content from other files appearing (tiptap code in unrelated test files)
- `pnpm install` producing corrupted packages
- Corruption persisted after multiple `rm -rf node_modules && pnpm install`
- Even `git checkout HEAD -- <file>` didn't restore files properly

**Impact:**
- Unable to run tests
- Unable to develop
- Wasted significant debugging time

**Root cause:** External SSD filesystem/drive corruption. First Aid reported "partition map appears to be OK" but data was still corrupted.

**Resolution:**
```
1. Clone repository to INTERNAL drive: ~/Projects/StartUp/Viblog
2. Run pnpm install on internal drive
3. All tests passed immediately (148 tests)
```

**Prevention:**
```
1. Develop on INTERNAL drive, not external SSD
2. External SSDs are prone to:
   - Connection drops during writes
   - Heat-related issues
   - Power fluctuations
3. If corruption occurs, clone fresh from git rather than copying folder
```

---

## Key Insights: Vibe Coding Principles

### 1. Token Monitoring is Critical

**Why:** LLM context windows are finite. Without monitoring, you hit limits unexpectedly and lose work.

**How I did it:**
- Checked `~/.claude.json` for `lastTotalInputTokens` and `lastTotalOutputTokens`
- Calculated warning threshold: 90% of available context (50% of max window)
- Triggered strategic compact before hitting limits

---

### 2. Strategic Compact, Not Auto-Compact

**Why:** Auto-compact at arbitrary points loses context mid-task. Strategic compact at phase boundaries preserves task coherence.

**How I did it:**
- Compact AFTER completing a phase, not mid-phase
- Before compact: Update CHANGELOG.md with completed work
- After compact: CHANGELOG.md provides full context recovery

---

### 3. Seamless Session Continuation

**Why:** Complex projects span multiple sessions. Without proper handoff, each session starts from scratch.

**How I did it:**
- CHANGELOG.md updated after EACH step completion
- Git commits with conventional messages
- Clear "Next Step" markers in IMPLEMENTATION_PLAN.md

---

### 4. Documentation as Context Bridge

**Why:** When context is compacted, documentation becomes the only memory.

**Documents that saved me:**
- CHANGELOG.md - Progress tracking
- IMPLEMENTATION_PLAN.md - Task breakdown
- PRD.md - Feature scope decisions

---

## How to Use This Document

### For New Sessions

1. Read `DEVELOPLOG.md` first to understand project history and lessons learned
2. Check `CHANGELOG.md` for latest changes
3. Review `IMPLEMENTATION_PLAN.md` for next tasks

### For Context Recovery After Compact/Clear

1. This document + CHANGELOG.md provide full context
2. "Bad Cases" section prevents repeat mistakes
3. IMPLEMENTATION_PLAN.md tells you where to resume

---

## Document Maintenance

**Update frequency:**
- After each Phase completion
- After significant bug fixes
- After architecture decisions

---

**Document Version:** 4.0
**Last Updated:** 2026-03-15
**Author:** Claude (with human collaborator)
**Phase 9 Completion:** 7 products analyzed, 22.7/25 average score, 4 new bad cases documented