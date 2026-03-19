# Viblog - Implementation Plan

## 1. Overview

This document provides a step-by-step build sequence for Viblog. Each step has clear deliverables and dependencies.

**Current Status:** MVP v0.1.0 Released (2026-03-13), Post-MVP in progress

---

## 2. Development Phases

```
MVP Phases (Completed)
├── Phase 1: Foundation
├── Phase 2: Core Features
├── Phase 3: Public Features
└── Phase 4: Polish & Deploy

Post-MVP Phases
├── Phase 5: Custom Domain (Completed 2026-03-14)
├── Phase 6: Test Coverage (Completed 20.15%, 142 tests)
├── Phase 7: E2E Test Suite (Completed 2026-03-14)
└── Phase 8: Fix Onboarding Data Usage (Current)
```

---

## 3. Current Phase: Phase 8 - Fix Onboarding Data Usage

**Goal:** Actually store and use LLM API keys collected during onboarding

**Status:** Completed (2026-03-14)

**Dependencies:** Phase 7 completion

---

### Step 8.1: Design Secure Storage for API Keys
**Status:** Completed

**Deliverable:** AES-256-GCM encryption with PBKDF2 key derivation

**File:** `src/lib/encryption.ts`

---

### Step 8.2: Update Onboarding to Encrypt and Store Keys
**Status:** Completed

**Deliverable:** Modified onboarding flow that stores encrypted keys via API

**Files:**
- `src/components/onboarding/step-1-llm.tsx`
- `src/components/onboarding/step-2-database.tsx`

---

### Step 8.3: Create API Route to Retrieve Keys Securely
**Status:** Completed

**Deliverable:** Secure API endpoint for key management (GET/PUT/DELETE)

**Files:**
- `src/app/api/user/api-keys/route.ts`
- `src/lib/api-keys.ts` (server-side key retrieval)

---

### Step 8.4: Update Settings Page to Manage Keys
**Status:** Completed

**Deliverable:** Settings UI for viewing/updating API keys

**File:** `src/app/(dashboard)/dashboard/settings/page.tsx`

---

### Step 8.5: Add Tests for Key Management
**Status:** Completed

**Deliverable:** Unit tests for encryption utilities (7 tests passing)

**File:** `src/lib/encryption.test.ts`

---

### Phase 8 Configuration Changes

**Required Environment Variable:**
```bash
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=<64-character-hex-string>
```

**GitHub Secrets:** Add `ENCRYPTION_KEY` to repository secrets for CI

---

## 4. Phase 7: E2E Test Suite (Completed)

**Completed:** 2026-03-14

**What was accomplished:**
- Playwright configuration with Chromium
- Test fixtures with authentication helpers
- Page Object Models for Login, Register, Dashboard, ArticleEditor
- 8 E2E tests for login and registration UI flows
- CI/CD pipeline with GitHub Actions

---

### Step 7.1: Configure Playwright
**Status:** Completed

**Deliverable:** Playwright configuration for E2E testing

**Tasks:**
- [x] Install Playwright dependencies
- [x] Create `playwright.config.ts`
- [x] Set up test directory structure
- [x] Configure test fixtures

---

### Step 7.2: Create Test Utilities
**Status:** Completed

**Deliverable:** Reusable E2E test helpers

**Tasks:**
- [x] Create authentication helpers
- [x] Create page object models
- [x] Create test data generators

---

### Step 7.3: E2E Test for Registration Flow
**Status:** Completed

**Deliverable:** Automated registration test

**File:** `e2e/register.spec.ts`

---

### Step 7.4: E2E Test for Login Flow
**Status:** Completed

**Deliverable:** Automated login test

**File:** `e2e/login.spec.ts`

---

### Step 7.5: E2E Test for Article Creation
**Status:** Skipped (requires authentication)

**Note:** Moved to `e2e/authenticated.spec.ts` - requires `E2E_RUN_AUTH_TESTS=1`

---

### Step 7.6: E2E Test for Article Publishing
**Status:** Skipped (requires authentication)

**Note:** Moved to `e2e/authenticated.spec.ts` - requires `E2E_RUN_AUTH_TESTS=1`

---

### Step 7.7: Add CI/CD Integration
**Status:** Completed

**Deliverable:** GitHub Actions workflow for automated testing

**Strategy:**

CI (Continuous Integration) automatically runs tests when pushing code or creating PRs.
This catches bugs early before they reach production.

**Pipeline:**
```
1. Install & Build (pnpm install → pnpm build)
2. Lint & Type Check (pnpm lint → pnpm type-check)
3. Unit Tests (pnpm test:run - 142 Vitest tests)
4. E2E Tests (skipped in CI - requires Supabase auth, rate-limited)
```

**Why skip E2E in CI?**
- Supabase has email rate limits
- E2E tests require real authentication
- Run locally with `E2E_RUN_AUTH_TESTS=1 pnpm test:e2e`

**Tasks:**
- [x] Create `.github/workflows/` directory
- [x] Create `ci.yml` workflow file
- [x] Configure pnpm caching for faster builds
- [x] Add GitHub secrets (manual step completed)
- [x] Test workflow by pushing to a branch

**File:** `.github/workflows/ci.yml`

**Setup Instructions:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add the following secrets from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SITE_URL`

---

## 4. Phase 6: Test Coverage (Completed)

**Final Coverage:** 20.15% (142 tests)

**What was accomplished:**
- Test utilities with mock factories
- Validation tests for all forms (43 tests)
- Component tests (25 tests)
- Hook tests (8 tests)
- API tests (53 tests)

---

### Step 6.2: Unit Tests for Utilities
**Status:** Completed

**Deliverable:** Tests for all utility functions

---

### Step 6.3: Unit Tests for Form Validation
**Status:** Completed

**Deliverable:** Tests for all form validation schemas (43 tests)

---

### Step 6.4: Component Tests for Forms
**Status:** Completed

**Deliverable:** Tests for form components (17 tests)

---

### Step 6.5: Integration Tests for Auth API
**Status:** Completed (merged into API tests)

---

### Step 6.6: Integration Tests for Project API
**Status:** Completed

**Deliverable:** Tests for project API routes

---

### Step 6.7: Integration Tests for Article API
**Status:** Completed

**Deliverable:** Tests for article API routes (53 API tests)

---

### Step 6.8: Coverage Report and Gap Filling
**Status:** Deferred

**Note:** Further coverage improvements deferred. Current 20.15% coverage with E2E tests provides sufficient stability for MVP.

**If resumed:**
- [ ] Add tests for `src/app/(public)` pages
- [ ] Add tests for middleware
- [ ] Add tests for remaining components
- [ ] Run final coverage report

---

## 4. Phase 5: Custom Domain (Completed)

**Completed:** 2026-03-14

**What was done:**
- Configured DNS in DNSPod (CNAME: viblog -> cname.vercel-dns.com)
- Added domain in Vercel Dashboard
- Updated environment variables
- Fixed build error by converting vitest.config.ts to JS

---

## 5. Phase 7: E2E Test Suite (Planned)

**Goal:** Create automated E2E tests for critical user flows

**Estimated Effort:** 5-6 hours

**Dependencies:** Phase 6 completion

**Planned Steps:**
- Step 7.1: Configure Playwright
- Step 7.2: Create test utilities and fixtures
- Step 7.3: E2E test for registration flow
- Step 7.4: E2E test for login flow
- Step 7.5: E2E test for article creation
- Step 7.6: E2E test for article publishing
- Step 7.7: Add CI/CD integration

---

## 6. Phase 8: Fix Onboarding Data Usage (Planned)

**Goal:** Actually store and use LLM API keys collected during onboarding

**Estimated Effort:** 4-5 hours

**Dependencies:** Phase 6 completion

**Planned Steps:**
- Step 8.1: Design secure storage for API keys
- Step 8.2: Update onboarding to encrypt and store keys
- Step 8.3: Create API route to retrieve keys securely
- Step 8.4: Update settings page to manage keys
- Step 8.5: Add tests for key management

---

## 7. MVP Implementation (Completed)

### Phase 1: Foundation (Completed)

#### Step 1.1: Initialize Project
**Status:** Completed
**Deliverable:** Working Next.js project with TypeScript

#### Step 1.2: Configure Supabase Client
**Status:** Completed
**Deliverable:** Working Supabase connection

#### Step 1.3: Set Up Database Schema
**Status:** Completed
**Deliverable:** Complete database tables with RLS policies

#### Step 1.4: Build Authentication
**Status:** Completed
**Deliverable:** Working login/register flow

#### Step 1.5: Build Onboarding Flow
**Status:** Completed
**Deliverable:** 5-step onboarding wizard

---

### Phase 2: Core Features (Completed)

#### Step 2.1: Build Dashboard Layout
**Status:** Completed
**Deliverable:** Dashboard with sidebar navigation

#### Step 2.2: Build Project Management
**Status:** Completed
**Deliverable:** Full CRUD for projects

#### Step 2.3: Build Article Management
**Status:** Completed
**Deliverable:** Full CRUD for articles with rich text editor

#### Step 2.4: Build Timeline View
**Status:** Completed
**Deliverable:** Timeline showing projects and articles

---

### Phase 3: Public Features (Completed)

#### Step 3.1: Build Public Feed
**Status:** Completed
**Deliverable:** Landing page with article cards

#### Step 3.2: Build Article Detail Page
**Status:** Completed
**Deliverable:** Full article view with metadata

#### Step 3.3: Build User Profile Pages
**Status:** Completed
**Deliverable:** Public profile with article list

---

### Phase 4: Polish & Deploy (Completed)

#### Step 4.1: UI Polish
**Status:** Completed
**Deliverable:** Consistent, polished UI

#### Step 4.2: Testing
**Status:** Completed
**Deliverable:** Basic test coverage (23 tests)

#### Step 4.3: Deployment
**Status:** Completed
**Deliverable:** Live application on Vercel

---

## 8. Dependency Graph

```
MVP (Completed)
├── Phase 1: Foundation
│   └── Phase 2: Core Features
│       └── Phase 3: Public Features
│           └── Phase 4: Polish & Deploy

Post-MVP
├── Phase 5: Custom Domain (Completed)
└── Phase 6: Test Coverage
    ├── Phase 7: E2E Test Suite
    └── Phase 8: Fix Onboarding Data Usage
```

---

## 9. Environment Setup Checklist

- [x] Node.js 20+ installed
- [x] pnpm installed
- [x] Supabase account created
- [x] Supabase project created
- [x] Vercel account created
- [x] Custom domain configured (viblog.tiic.tech)
- [x] Git repository initialized

---

**Document Version:** 2.0
**Last Updated:** 2026-03-14