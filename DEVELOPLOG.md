# Viblog Development Log

> A first-person narrative of the MVP development journey, capturing milestones, insights, and lessons for future vibe coding sessions.

---

## Overview

This document records the development process of Viblog MVP (v0.1.0), completed on 2026-03-13. It serves as a living record of what worked, what didn't, and how to improve future development cycles.

**Purpose:** Enable seamless context transfer across sessions, codify successful patterns into reusable skills, and prevent repeating mistakes.

---

## Phase 1: Foundation (Completed)

### What I Did

1. **Project Initialization**
   - Created Next.js 16 project with TypeScript, Tailwind, App Router
   - Set up pnpm as package manager
   - Configured shadcn/ui components
   - Established folder structure by feature/domain

2. **Database Setup**
   - Created Supabase project
   - Defined schema: profiles, projects, articles, user_settings, stars
   - Implemented Row Level Security (RLS) policies
   - Generated TypeScript types from schema

3. **Authentication**
   - Built login/register/forgot-password pages
   - Integrated Supabase Auth with SSR
   - Created middleware for protected routes

4. **Onboarding Flow**
   - 5-step wizard: LLM config, Database config, Platform selection, Discovery source, Welcome blog
   - Progress indicator with skip option

### What Went Well

- **Documentation-first approach:** Having PRD.md, TECH_STACK.md, and IMPLEMENTATION_PLAN.md before coding made decisions clear
- **Supabase integration:** RLS policies from day one ensured security by default
- **TypeScript types from schema:** Running `supabase gen types` kept types in sync

### What Could Be Better

- No tests written during Phase 1 - had to add testing infrastructure in Phase 4
- Onboarding collects data but doesn't actually use it yet (LLM API keys, database connections)

---

## Phase 2: Core Features (Completed)

### What I Did

1. **Dashboard Layout**
   - Responsive sidebar with mobile drawer
   - User menu with dropdown
   - Stats overview and timeline

2. **Project Management**
   - Full CRUD operations
   - Project cards with color coding
   - Delete confirmation dialog

3. **Article Management**
   - Tiptap rich text editor
   - Auto-save every 30 seconds
   - Vibe coding metadata (platform, duration, model, prompt)
   - Publish modal with visibility/pricing

4. **Timeline View**
   - Projects grouped by date
   - Nested articles under projects
   - Quick actions on hover

### What Went Well

- **Auto-save implementation:** Using `useCallback` with debounced saves prevented data loss
- **Tiptap integration:** JSON storage allows flexible rendering later

### What Could Be Better

- **Column name mismatch:** Used `platform`, `duration`, `model` in code but database had `vibe_platform`, `vibe_duration_minutes`, `vibe_model` - caused runtime errors in production
- **API inconsistency:** Some routes used direct Supabase queries, others used fetch to own API - should standardize

---

## Phase 3: Public Features (Completed)

### What I Did

1. **Public Feed**
   - Article cards with 3-section layout
   - Filters (platform, sort)
   - Load more pagination
   - SEO-friendly server rendering

2. **Article Detail Page**
   - Full content rendering
   - Star functionality with optimistic updates
   - Share (native API + clipboard fallback)
   - Related articles
   - SEO metadata (OpenGraph, Twitter cards)

3. **User Profile Pages**
   - Profile stats (articles count, stars received)
   - Articles list with pagination
   - Social links

### What Went Well

- **Server Components for SEO:** Using `generateMetadata` ensures proper meta tags for social sharing
- **Optimistic UI updates:** Star button responds immediately, then syncs with server

### What Could Be Better

- **Article detail page fetch issue:** Initially used `fetch()` to call own API in Server Component, which failed in Vercel production. Had to refactor to direct Supabase query.
- **404 on article pages:** URL structure and database query mismatch took debugging time

---

## Phase 4: Polish & Deploy (Completed)

### What I Did

1. **UI Polish**
   - Loading skeletons for all pages
   - Error boundaries with retry buttons
   - 404 pages for articles/profiles
   - Empty state components
   - Accessibility improvements (skip links, ARIA labels)

2. **Testing**
   - Configured Vitest with React Testing Library
   - 23 passing tests (utilities, components, API)

3. **Deployment**
   - Vercel deployment with environment variables
   - Production build verification
   - Functional testing via Playwright

### What Went Well

- **Playwright MCP for E2E testing:** Using browser automation to verify registration, login, article creation, publishing
- **Error boundaries:** Catching errors gracefully instead of white screens

### What Could Be Better

- **Test coverage:** Only basic tests written, not 80% coverage yet
- **No E2E test suite:** Relied on manual Playwright session instead of automated tests

---

## Key Insights: Vibe Coding Principles

### 1. Token Monitoring is Critical

**Why:** LLM context windows are finite. Without monitoring, you hit limits unexpectedly and lose work.

**How I did it:**
- Checked `~/.claude.json` for `lastTotalInputTokens` and `lastTotalOutputTokens`
- Calculated warning threshold: 90% of available context (50% of max window)
- Triggered strategic compact before hitting limits

**Codify as Skill:**
```
/token-check - Display current token usage and warn if approaching limit
```

### 2. Strategic Compact, Not Auto-Compact

**Why:** Auto-compact at arbitrary points loses context mid-task. Strategic compact at phase boundaries preserves task coherence.

**How I did it:**
- Compact AFTER completing a phase, not mid-phase
- Before compact: Update CHANGELOG.md with completed work
- After compact: CHANGELOG.md provides full context recovery

**Codify as Skill:**
```
/strategic-compact - Compact at logical boundaries with proper documentation
```

### 3. Seamless Session Continuation

**Why:** Complex projects span multiple sessions. Without proper handoff, each session starts from scratch.

**How I did it:**
- CHANGELOG.md updated after EACH step completion
- Git commits with conventional messages
- Clear "Next Step" markers
- Task list in memory for progress tracking

**Codify as Skill:**
```
/session-checkpoint - Update CHANGELOG, commit changes, note next step
```

### 4. Documentation as Context Bridge

**Why:** When context is compacted, documentation becomes the only memory.

**Documents that saved me:**
- CHANGELOG.md - Progress tracking
- IMPLEMENTATION_PLAN.md - Task breakdown
- PRD.md - Feature scope decisions

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

### Bad Case 2: Server Component Fetching Own API

**What happened:** Article detail page used `fetch('/api/public/articles/...')` in Server Component, which failed in Vercel.

**Impact:** 404 errors on article pages in production.

**Root cause:** Misunderstanding of Next.js server-side rendering context.

**Prevention:**
```
Server Components should query databases directly, not fetch own APIs.
Use API routes only for client-side data fetching.
```

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

## Urgent Tasks (Post-MVP)

| Priority | Task | Status |
|----------|------|--------|
| High | Configure custom domain `viblog.tiic.tech` | **Completed** |
| High | Increase test coverage to 80% | Pending |
| Medium | Add E2E test suite (Playwright) | Pending |
| Medium | Fix onboarding data usage (actually store/use LLM keys) | Pending |
| Low | Add animations (Framer Motion) | Skipped |

---

## Post-MVP Progress

### 2026-03-14: Custom Domain Configuration

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

## Next Phase Planning

### Phase 5: Post-MVP Features (From PRD.md Out of Scope)

| Feature | Priority | Effort |
|---------|----------|--------|
| MCP Integration | High | Large |
| AI-assisted Writing | High | Large |
| Third-party OAuth | Medium | Medium |
| Paid Article Transactions | Medium | Large |
| Comments System | Medium | Medium |
| Follow/Followers | Low | Medium |
| Email Notifications | Low | Medium |

### Recommended Next Steps

1. **Custom Domain Setup**
   - Configure DNS in DNSPod for `viblog.tiic.tech`
   - Add domain in Vercel
   - Update `NEXT_PUBLIC_APP_URL`

2. **Test Coverage Push**
   - Write tests for all API routes
   - Add component tests for forms
   - Create E2E test suite for critical flows

3. **Feature Prioritization**
   - Survey potential users
   - Analyze competitor features
   - Decide on Phase 5 scope

---

## How to Use This Document

### For New Sessions

1. Read `DEVELOPLOG.md` first to understand project history
2. Check `CHANGELOG.md` for current progress
3. Review `IMPLEMENTATION_PLAN.md` for next tasks

### For Context Recovery After Compact/Clear

1. This document + CHANGELOG.md provide full context
2. "Urgent Tasks" section tells you where to resume
3. "Bad Cases" section prevents repeat mistakes

### For Future Vibe Coding Projects

1. Copy this DEVELOPLOG.md structure
2. Customize sections for your project
3. Update after each phase completion

---

## Document Maintenance

**Update frequency:**
- After each phase completion
- After significant bug fixes
- After architecture decisions

**Keep updated in CLAUDE.md:**

```markdown
## Session Startup Checklist

At the start of each session:
- [ ] Read CHANGELOG.md for current progress
- [ ] Read DEVELOPLOG.md for context and lessons
- [ ] Check IMPLEMENTATION_PLAN.md for next steps
```

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13
**Author:** Claude (with human collaborator)