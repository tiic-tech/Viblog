# Viblog - Implementation Plan

## 1. Overview

This document provides a step-by-step build sequence for Viblog. Each step has clear deliverables and dependencies.

---

## 2. Development Phases

```
Phase 1: Foundation (Day 1-2)
    ├── Project Setup
    ├── Database Setup
    └── Authentication

Phase 2: Core Features (Day 3-5)
    ├── Project Management
    ├── Article Management
    └── Dashboard

Phase 3: Public Features (Day 6-7)
    ├── Public Feed
    ├── Article Detail
    └── User Profiles

Phase 4: Polish & Deploy (Day 8-10)
    ├── UI Polish
    ├── Testing
    └── Deployment
```

---

## 3. Detailed Implementation Steps

### Phase 1: Foundation

#### Step 1.1: Initialize Project
**Deliverable:** Working Next.js project with TypeScript

**Tasks:**
- [ ] Create Next.js project with TypeScript
- [ ] Install dependencies from TECH_STACK.md
- [ ] Configure Tailwind CSS
- [ ] Set up project folder structure
- [ ] Configure ESLint and Prettier
- [ ] Create `.env.local` template

**Files to Create:**
```
viblog/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── .env.local.example
└── package.json
```

**Command:**
```bash
pnpm create next-app@14.1.0 viblog --typescript --tailwind --eslint --app --src-dir
cd viblog
pnpm add @supabase/supabase-js @supabase/ssr
```

---

#### Step 1.2: Configure Supabase Client
**Deliverable:** Working Supabase connection

**Tasks:**
- [ ] Create Supabase project in dashboard
- [ ] Create Supabase client files
- [ ] Configure environment variables
- [ ] Test connection

**Files to Create:**
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

---

#### Step 1.3: Set Up Database Schema
**Deliverable:** Complete database tables with RLS policies

**Tasks:**
- [ ] Run migration for profiles table
- [ ] Run migration for projects table
- [ ] Run migration for articles table
- [ ] Run migration for user_settings table
- [ ] Run migration for stars table
- [ ] Enable RLS policies
- [ ] Create database functions

**Files to Create:**
```
supabase/migrations/
├── 20260313000000_initial_schema.sql
├── 20260313000001_rls_policies.sql
└── 20260313000002_functions.sql
```

**Command:**
```bash
# Using Supabase CLI
supabase db push
```

---

#### Step 1.4: Build Authentication
**Deliverable:** Working login/register flow

**Tasks:**
- [ ] Create auth context/provider
- [ ] Create login page
- [ ] Create register page
- [ ] Create password reset page
- [ ] Add middleware for protected routes
- [ ] Create auth API routes

**Files to Create:**
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   └── api/auth/
│       ├── login/route.ts
│       ├── register/route.ts
│       └── callback/route.ts
├── components/auth/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── auth-provider.tsx
└── middleware.ts
```

---

#### Step 1.5: Build Onboarding Flow
**Deliverable:** 5-step onboarding wizard

**Tasks:**
- [ ] Create onboarding layout
- [ ] Build Step 1: LLM Configuration
- [ ] Build Step 2: Database Configuration
- [ ] Build Step 3: Vibe Platform Selection
- [ ] Build Step 4: Discovery Source
- [ ] Build Step 5: Welcome Blog Generation
- [ ] Create progress indicator
- [ ] Store settings in database

**Files to Create:**
```
src/
├── app/
│   └── (auth)/
│       └── onboarding/
│           ├── page.tsx
│           └── components/
│               ├── step-1-llm.tsx
│               ├── step-2-database.tsx
│               ├── step-3-platform.tsx
│               ├── step-4-discovery.tsx
│               ├── step-5-welcome.tsx
│               └── progress-bar.tsx
```

---

### Phase 2: Core Features

#### Step 2.1: Build Dashboard Layout
**Deliverable:** Dashboard with sidebar navigation

**Tasks:**
- [ ] Create dashboard layout component
- [ ] Build sidebar navigation
- [ ] Build header with user menu
- [ ] Create mobile-responsive drawer

**Files to Create:**
```
src/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx
│       └── dashboard/
│           └── page.tsx
├── components/dashboard/
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── mobile-nav.tsx
```

---

#### Step 2.2: Build Project Management
**Deliverable:** Full CRUD for projects

**Tasks:**
- [ ] Create projects list page
- [ ] Create new project form
- [ ] Create edit project form
- [ ] Create delete confirmation dialog
- [ ] Build project card component
- [ ] Create project API routes

**Files to Create:**
```
src/
├── app/
│   └── (dashboard)/
│       └── projects/
│           ├── page.tsx
│           ├── new/page.tsx
│           └── [id]/
│               ├── page.tsx
│               └── edit/page.tsx
├── components/projects/
│   ├── project-card.tsx
│   ├── project-form.tsx
│   └── project-list.tsx
├── app/api/projects/
│   ├── route.ts
│   └── [id]/route.ts
```

---

#### Step 2.3: Build Article Management
**Deliverable:** Full CRUD for articles with rich text editor

**Tasks:**
- [ ] Create articles list page
- [ ] Create article editor page
- [ ] Integrate Tiptap editor
- [ ] Add auto-save functionality
- [ ] Create article form with metadata
- [ ] Build publish modal
- [ ] Create article API routes

**Files to Create:**
```
src/
├── app/
│   └── (dashboard)/
│       └── articles/
│           ├── page.tsx
│           ├── new/page.tsx
│           └── [id]/
│               └── edit/page.tsx
├── components/articles/
│   ├── article-card.tsx
│   ├── article-editor.tsx
│   ├── article-form.tsx
│   ├── publish-modal.tsx
│   └── vibe-metadata-form.tsx
├── app/api/articles/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── [id]/publish/route.ts
```

---

#### Step 2.4: Build Timeline View
**Deliverable:** Timeline showing projects and articles

**Tasks:**
- [ ] Create timeline component
- [ ] Build date grouping logic
- [ ] Create timeline item component
- [ ] Add expand/collapse for projects
- [ ] Implement article nesting

**Files to Create:**
```
src/
├── components/dashboard/
│   ├── timeline.tsx
│   ├── timeline-item.tsx
│   ├── project-bucket.tsx
│   └── date-marker.tsx
```

---

### Phase 3: Public Features

#### Step 3.1: Build Public Feed
**Deliverable:** Landing page with article cards

**Tasks:**
- [ ] Create public landing page
- [ ] Build article card component (3-section)
- [ ] Add filter/sort functionality
- [ ] Implement infinite scroll
- [ ] Create public API routes

**Files to Create:**
```
src/
├── app/
│   └── (public)/
│       └── page.tsx
├── components/public/
│   ├── article-card.tsx
│   ├── feed-filters.tsx
│   └── feed-sort.tsx
├── app/api/public/articles/
│   └── route.ts
```

---

#### Step 3.2: Build Article Detail Page
**Deliverable:** Full article view with metadata

**Tasks:**
- [ ] Create article detail page
- [ ] Build content renderer
- [ ] Add star functionality
- [ ] Create share functionality
- [ ] Build related articles section

**Files to Create:**
```
src/
├── app/
│   └── (public)/
│       └── article/
│           └── [slug]/
│               └── page.tsx
├── components/articles/
│   ├── article-content.tsx
│   ├── article-header.tsx
│   ├── article-actions.tsx
│   └── related-articles.tsx
```

---

#### Step 3.3: Build User Profile Pages
**Deliverable:** Public profile with article list

**Tasks:**
- [ ] Create user profile page
- [ ] Build profile header component
- [ ] Create user articles list
- [ ] Add follow button (UI only)
- [ ] Build profile stats

**Files to Create:**
```
src/
├── app/
│   └── (public)/
│       └── @/
│           └── [username]/
│               └── page.tsx
├── components/profile/
│   ├── profile-header.tsx
│   ├── profile-stats.tsx
│   └── profile-articles.tsx
├── app/api/public/users/
│   └── [username]/
│       └── route.ts
```

---

### Phase 4: Polish & Deploy

#### Step 4.1: UI Polish
**Deliverable:** Consistent, polished UI

**Tasks:**
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states
- [ ] Add animations (Framer Motion)
- [ ] Responsive testing
- [ ] Accessibility audit

---

#### Step 4.2: Testing
**Deliverable:** Test coverage > 80%

**Tasks:**
- [ ] Write unit tests for utilities
- [ ] Write component tests
- [ ] Write API route tests
- [ ] Write E2E tests for critical flows

---

#### Step 4.3: Deployment
**Deliverable:** Live application on Vercel

**Tasks:**
- [ ] Configure Vercel project
- [ ] Set environment variables
- [ ] Configure custom domain (if applicable)
- [ ] Run production build test
- [ ] Deploy to production
- [ ] Verify all features work

---

## 4. Dependency Graph

```
Step 1.1 (Project Init)
    │
    ├── Step 1.2 (Supabase)
    │       │
    │       └── Step 1.3 (Database)
    │               │
    │               └── Step 1.4 (Auth)
    │                       │
    │                       └── Step 1.5 (Onboarding)
    │
    └── Step 2.1 (Dashboard)
            │
            ├── Step 2.2 (Projects)
            │       │
            │       └── Step 2.3 (Articles)
            │               │
            │               └── Step 2.4 (Timeline)
            │
            └── Step 3.1 (Feed)
                    │
                    ├── Step 3.2 (Article Detail)
                    │
                    └── Step 3.3 (Profiles)
                            │
                            └── Step 4.x (Polish & Deploy)
```

---

## 5. Environment Setup Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm installed
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Vercel account created
- [ ] Git repository initialized
- [ ] IDE configured (VS Code recommended)

---

## 6. Quick Start Commands

```bash
# 1. Create project
pnpm create next-app@14.1.0 viblog

# 2. Install dependencies
cd viblog
pnpm add @supabase/supabase-js @supabase/ssr

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
pnpm dev

# 5. Open browser
open http://localhost:3000
```

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13