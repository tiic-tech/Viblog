# Viblog - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Custom domain configuration: `viblog.tiic.tech`
  - Added `NEXT_PUBLIC_SITE_URL` environment variable
  - Updated `.env.local` and `.env.local.example`
  - Fixed build error by converting vitest.config.ts to JS
- Project documentation suite created:
  - PRD.md - Product Requirements Document
  - APP_FLOW.md - Application Flow Document
  - TECH_STACK.md - Technology Stack Document
  - FRONTEND_GUIDELINES.md - Frontend Design Guidelines
  - BACKEND_STRUCTURE.md - Backend Structure Document
  - IMPLEMENTATION_PLAN.md - Implementation Plan
  - CHANGELOG.md - This changelog
- Updated CLAUDE.md with development workflow rules
  - Agent & Skill usage guidelines
  - Context management rules
  - Development isolation modes (sandbox, worktree)
  - Environment setup instructions
  - Context overflow prevention mechanism
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
- Public feed implemented (Step 3.1)
  - Public layout with header and footer
  - Article card component with 3-section layout
  - Feed filters (platform, sorting)
  - Pagination with load more
  - Public articles API with filtering and sorting
- Article detail page implemented (Step 3.2)
  - Article detail API route with slug lookup
  - Article content renderer for Tiptap JSON/HTML
  - Article header with metadata and author info
  - Star functionality with toggle API
  - Share functionality with native share/clipboard
  - Related articles from same author
  - SEO metadata with OpenGraph and Twitter cards
  - Views count increment on page visit
- User profile pages implemented (Step 3.3)
  - User profile API route with stats
  - Profile header with avatar, bio, social links
  - Profile articles list with pagination
  - SEO metadata for profiles

### Changed
- Updated API routes for Next.js 16 compatibility (params is now Promise)

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

---

## [0.1.0] - 2026-03-13

### Added
- Initial MVP release
- User authentication (login, register, forgot password)
- 5-step onboarding flow
- Project management (CRUD)
- Article management with Tiptap editor
- Auto-save drafts (every 30 seconds)
- Publish with visibility options
- Public feed with filters and sorting
- Article detail pages with star/share
- User profile pages
- Dashboard with timeline
- Loading states and error boundaries
- Accessibility features (skip links, ARIA labels)
- Testing infrastructure (Vitest)

---

## Progress Tracking

### Phase 1: Foundation
| Step | Task | Status |
|------|------|--------|
| 1.1 | Initialize Project | Completed |
| 1.2 | Configure Supabase Client | Completed |
| 1.3 | Set Up Database Schema | Completed |
| 1.4 | Build Authentication | Completed |
| 1.5 | Build Onboarding Flow | Completed |

### Phase 2: Core Features
| Step | Task | Status |
|------|------|--------|
| 2.1 | Build Dashboard Layout | Completed |
| 2.2 | Build Project Management | Completed |
| 2.3 | Build Article Management | Completed |
| 2.4 | Build Timeline View | Completed |

### Phase 3: Public Features
| Step | Task | Status |
|------|------|--------|
| 3.1 | Build Public Feed | Completed |
| 3.2 | Build Article Detail Page | Completed |
| 3.3 | Build User Profile Pages | Completed |

### Phase 4: Polish & Deploy
| Step | Task | Status |
|------|------|--------|
| 4.1 | UI Polish | Completed |
| 4.2 | Testing | Completed |
| 4.3 | Deployment | Completed |

---

## Session Log

### 2026-03-13 (MVP Complete)
- Phase 4 completed: UI Polish, Testing, Deployment
- Added loading skeletons for all pages
- Added error boundaries and 404 pages
- Added accessibility improvements
- Configured Vitest with 23 passing tests
- Deployed to Vercel

### 2026-03-13 (Earlier)
- Created project documentation suite
- Defined product vision: Viblog for Vibe Coders
- Established three-level page architecture
- Confirmed tech stack: Next.js + Tailwind + shadcn/ui + Supabase
- Created detailed implementation plan

---

## MVP Release v0.1.0

**Release Date:** 2026-03-13

All MVP features from PRD.md have been implemented and deployed.

---

**Last Updated:** 2026-03-13