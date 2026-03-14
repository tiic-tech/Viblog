# Viblog - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

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

**Last Updated:** 2026-03-14