# Dual Reading Structure - Implementation Plan

**Document Version:** 1.0
**Created:** 2026-03-18
**Status:** Ready for Implementation

---

## Executive Summary

This document defines the implementation plan for **Dual Reading Structure**, a frontend architecture that maps directly to Viblog's **Dual Data Structure** (Markdown + JSONB).

### Core Concept

```
Dual Data Structure (Backend)     →     Dual Reading Structure (Frontend)

JSONB (AI-Native)                 →     AI View Renderer
├── conversation_thread                  ├── ConversationThreadViewer
├── decisions                            ├── DecisionTimeline
├── code_snippets                        ├── CodeSnippetGallery
├── versions                             ├── VersionHistory
└── insights                             └── InsightsPanel

Markdown (Human)                  →     Human View Renderer
├── title                                ├── MarkdownRenderer
├── content                              ├── ProseStyles
└── excerpt                              └── ArticleContent
```

### Key Differentiator

Unlike ChatGPT's "organize conversation into blog" feature, Viblog's dual reading structure:

1. **Preserves metadata** - Decisions, code snippets, versions are structured, not lost
2. **Enables AI consumption** - JSONB is natively consumable by LLMs
3. **Provides transparency** - Vibe Coders can share "how it was made", not just "what was made"
4. **Supports multiple views** - Human readers get traditional reading, developers get process view

---

## 1. Architecture Overview

### 1.1 System Flow: MCP to Dual Views

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   DEVELOP PHASE                                                                 │
│   ┌─────────────┐    ┌──────────────────┐    ┌─────────────────────┐           │
│   │  MCP Client │───►│ update_vibe_     │───►│ draft_buckets       │           │
│   │ (Claude/    │    │ coding_history   │    │ (JSONB session_data)│           │
│   │  Cursor)    │    │ tool             │    │                     │           │
│   └─────────────┘    └──────────────────┘    └──────────┬──────────┘           │
│                                                          │                      │
│   CRAFT PHASE                                           │                      │
│   ┌──────────────────────────────────────────────────────┼──────────────────┐   │
│   │                   Sketch Mode                        │                  │   │
│   │  ┌───────────────────────────────────────────────────┼───────────────┐  │   │
│   │  │  Split Pane Editor                               │               │  │   │
│   │  │  ├── Left: AI View (JSONB Renderer)              │               │  │   │
│   │  │  │   ├── Conversation Thread                      │               │  │   │
│   │  │  │   ├── Decision Timeline                        │               │  │   │
│   │  │  │   └── Code Snippets                            │               │  │   │
│   │  │  │                                                │               │  │   │
│   │  │  └── Right: Human View (Markdown Editor)          │               │  │   │
│   │  │      ├── Tiptap Editor                            │               │  │   │
│   │  │      └── Generated from JSONB insights            │               │  │   │
│   │  └───────────────────────────────────────────────────┘               │  │   │
│   └───────────────────────────────────────────────────────────────────────┘  │   │
│                                                          │                      │
│   PUBLISH PHASE                                         │                      │
│   ┌──────────────────────────────────────────────────────┼──────────────────┐   │
│   │  Article Record (dual format)                       │                  │   │
│   │  ├── content: markdown                              │                  │   │
│   │  └── json_content: JSONB ◄──────────────────────────┘                  │   │
│   │                                                                        │   │
│   │  Publish Modes:                                                         │   │
│   │  ├── Full Transparency: AI View + Human View both public               │   │
│   │  ├── Reader Mode: Only Human View public                               │   │
│   │  └── Developer Mode: Full JSONB accessible                             │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   CONSUME PHASE                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  Immersive Reader (Dual Views)                                          │   │
│   │  ├── Human Readers: Human View (Markdown)                               │   │
│   │  └── Vibe Coders: Toggle to AI View (JSONB)                             │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Gallery Metaphor Integration

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GALLERY METAPHOR                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   SKETCHES (Drafts)        GALLERY (Published)        MASTERPIECE (Featured)    │
│   =================        ==================        =======================    │
│                                                                                 │
│   ┌───────────────┐        ┌───────────────┐        ┌───────────────┐          │
│   │  Sketch Mode  │   ──►  │  Public Feed  │   ──►  │  Featured     │          │
│   │               │        │               │        │  Articles     │          │
│   │  Raw JSONB    │        │  Published    │        │  High Stars   │          │
│   │  Human Edit   │        │  Human View   │        │  Quality      │          │
│   │               │        │  Default      │        │  Badge        │          │
│   └───────────────┘        └───────────────┘        └───────────────┘          │
│                                                                                 │
│   Each Conversation = Brush Stroke                                              │
│   Final Article = Completed Artwork                                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Design

### 2.1 Extended Article Table

```sql
-- Migration: 20260318_add_ai_native_columns.sql

-- Step 1: Add new columns (nullable for backward compatibility)
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS json_content JSONB,
  ADD COLUMN IF NOT EXISTS conversation_thread JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS decisions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS code_snippets JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS versions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS insights JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS publish_mode TEXT DEFAULT 'reader'
    CHECK (publish_mode IN ('full_transparency', 'reader', 'developer'));

-- Step 2: Create indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS articles_json_content_idx
  ON public.articles USING gin(json_content);
CREATE INDEX CONCURRENTLY IF NOT EXISTS articles_conversation_thread_idx
  ON public.articles USING gin(conversation_thread);
CREATE INDEX CONCURRENTLY IF NOT EXISTS articles_publish_mode_idx
  ON public.articles(publish_mode);

-- Step 3: Add RLS policy for publish_mode
CREATE POLICY "Public articles visible based on publish_mode"
  ON public.articles FOR SELECT
  USING (
    status = 'published' AND (
      publish_mode IN ('full_transparency', 'reader') OR
      (publish_mode = 'developer' AND auth.uid() IS NOT NULL)
    )
  );
```

### 2.2 JSONB Schema Definitions

```typescript
// src/types/ai-native.ts

/**
 * Conversation thread item - a single prompt-response exchange
 */
export interface ConversationThreadItem {
  id: string
  timestamp: string
  role: 'user' | 'assistant'
  content: string
  metadata?: {
    model?: string
    tokens?: number
    duration_ms?: number
  }
}

/**
 * Decision made during coding session
 */
export interface Decision {
  id: string
  timestamp: string
  decision: string
  reason: string
  context: string
  alternatives?: string[]
  impact?: 'high' | 'medium' | 'low'
}

/**
 * Code snippet with context
 */
export interface CodeSnippet {
  id: string
  language: string
  code: string
  purpose: string
  context: string
  file_path?: string
  line_start?: number
  line_end?: number
  diff?: string // For showing changes
}

/**
 * Version history entry
 */
export interface VersionEntry {
  id: string
  version: number
  timestamp: string
  changes_summary: string
  changed_by: 'ai' | 'human'
  diff?: string
}

/**
 * Insight extracted from the session
 */
export interface Insight {
  id: string
  type: 'learning' | 'problem_solved' | 'best_practice' | 'warning' | 'tip'
  title: string
  content: string
  related_snippets?: string[] // CodeSnippet IDs
  importance: 'high' | 'medium' | 'low'
}

/**
 * Full AI-Native content structure
 */
export interface AINativeContent {
  article_id: string
  conversation_thread: ConversationThreadItem[]
  decisions: Decision[]
  code_snippets: CodeSnippet[]
  versions: VersionEntry[]
  insights: Insight[]
  metadata: {
    platform: string
    model: string
    duration_minutes: number
    total_prompts: number
    total_tokens?: number
  }
}
```

---

## 3. Frontend Architecture

### 3.1 Component Hierarchy

```
src/
├── components/
│   ├── immersive/                    # Immersive reading components
│   │   ├── ImmersiveReaderContainer.tsx
│   │   ├── ImmersiveStateProvider.tsx
│   │   ├── Backdrop.tsx
│   │   └── panels/
│   │       ├── LeftPanel.tsx
│   │       ├── RightPanel.tsx
│   │       └── BottomPanel.tsx
│   │
│   ├── ai-view/                      # AI View Renderer (NEW)
│   │   ├── AIViewContainer.tsx
│   │   ├── ConversationThreadViewer.tsx
│   │   ├── DecisionTimeline.tsx
│   │   ├── CodeSnippetGallery.tsx
│   │   ├── VersionHistory.tsx
│   │   ├── InsightsPanel.tsx
│   │   └── shared/
│   │       ├── ThreadItem.tsx
│   │       ├── DecisionCard.tsx
│   │       ├── CodeBlock.tsx
│   │       └── TimelineMarker.tsx
│   │
│   ├── human-view/                   # Human View Renderer
│   │   ├── HumanViewContainer.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── ArticleMetadata.tsx
│   │
│   ├── sketch-mode/                  # Sketch Mode Editor (NEW)
│   │   ├── SketchEditor.tsx
│   │   ├── SplitPaneLayout.tsx
│   │   └── ViewToggle.tsx
│   │
│   └── publish-mode/                 # Publish Mode Selection (NEW)
│       ├── PublishModeSelector.tsx
│       └── PublishModePreview.tsx
│
├── hooks/
│   ├── useImmersiveState.ts
│   ├── useAIViewData.ts
│   ├── useViewToggle.ts
│   └── usePublishMode.ts
│
├── stores/
│   └── readingStore.ts
│
└── types/
    ├── ai-native.ts
    ├── immersive.ts
    └── publish-mode.ts
```

### 3.2 State Machine Definition

```typescript
// src/types/immersive.ts

/**
 * Extended immersive states for dual reading structure
 */
export type ImmersiveState =
  | 'HOME'                    // Normal view, cards visible
  | 'FLOATING_READER'         // Centered modal, dimmed background
  | 'FULL_EXPANDED'           // Full immersive view
  | 'AI_VIEW'                 // AI View mode (from FULL_EXPANDED)
  | 'SKETCH_MODE'             // Edit mode for authors

/**
 * View mode for dual reading
 */
export type ViewMode = 'human' | 'ai' | 'split'

/**
 * State transitions
 */
export const stateTransitions = {
  HOME: {
    clickCard: 'FLOATING_READER',
  },
  FLOATING_READER: {
    clickTitle: 'FULL_EXPANDED',
    clickBack: 'HOME',
  },
  FULL_EXPANDED: {
    clickBack: 'FLOATING_READER',
    toggleAIView: 'AI_VIEW',
    clickEdit: 'SKETCH_MODE',
  },
  AI_VIEW: {
    clickBack: 'FULL_EXPANDED',
    toggleHumanView: 'FULL_EXPANDED',
  },
  SKETCH_MODE: {
    clickBack: 'FULL_EXPANDED',
  },
} as const
```

### 3.3 Zustand Store Definition

```typescript
// src/stores/readingStore.ts

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ImmersiveState, ViewMode } from '@/types/immersive'
import type { AINativeContent } from '@/types/ai-native'

interface ReadingState {
  // Immersive state
  immersiveState: ImmersiveState
  previousState: ImmersiveState | null

  // Current article
  articleId: string | null
  humanContent: string | null
  aiContent: AINativeContent | null

  // View configuration
  viewMode: ViewMode
  publishMode: 'full_transparency' | 'reader' | 'developer'
  isAuthor: boolean

  // UI state
  annotationsVisible: boolean
  leftPanelOpen: boolean
  rightPanelOpen: boolean

  // Actions
  openReader: (articleId: string) => void
  expandToFull: () => void
  toggleAIView: () => void
  toggleViewMode: (mode: ViewMode) => void
  closeReader: () => void
  goBack: () => void

  // Data actions
  setHumanContent: (content: string) => void
  setAIContent: (content: AINativeContent) => void

  // Panel actions
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  toggleAnnotations: () => void
}

export const useReadingStore = create<ReadingState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        immersiveState: 'HOME',
        previousState: null,
        articleId: null,
        humanContent: null,
        aiContent: null,
        viewMode: 'human',
        publishMode: 'reader',
        isAuthor: false,
        annotationsVisible: true,
        leftPanelOpen: true,
        rightPanelOpen: false,

        // Actions
        openReader: (articleId) => set({
          articleId,
          immersiveState: 'FLOATING_READER'
        }),

        expandToFull: () => {
          const { immersiveState } = get()
          set({
            previousState: immersiveState,
            immersiveState: 'FULL_EXPANDED'
          })
        },

        toggleAIView: () => {
          const { immersiveState, viewMode } = get()
          if (immersiveState === 'FULL_EXPANDED') {
            set({ immersiveState: 'AI_VIEW', viewMode: 'ai' })
          } else if (immersiveState === 'AI_VIEW') {
            set({ immersiveState: 'FULL_EXPANDED', viewMode: 'human' })
          }
        },

        toggleViewMode: (mode) => set({ viewMode: mode }),

        closeReader: () => set({
          immersiveState: 'HOME',
          articleId: null,
          humanContent: null,
          aiContent: null,
          previousState: null
        }),

        goBack: () => {
          const { immersiveState } = get()
          if (immersiveState === 'AI_VIEW') {
            set({ immersiveState: 'FULL_EXPANDED', viewMode: 'human' })
          } else if (immersiveState === 'FULL_EXPANDED') {
            set({ immersiveState: 'FLOATING_READER' })
          } else if (immersiveState === 'FLOATING_READER') {
            get().closeReader()
          }
        },

        setHumanContent: (content) => set({ humanContent: content }),
        setAIContent: (content) => set({ aiContent: content }),

        toggleLeftPanel: () => set((state) => ({
          leftPanelOpen: !state.leftPanelOpen
        })),

        toggleRightPanel: () => set((state) => ({
          rightPanelOpen: !state.rightPanelOpen
        })),

        toggleAnnotations: () => set((state) => ({
          annotationsVisible: !state.annotationsVisible
        })),
      }),
      {
        name: 'viblog-reading-store',
        partialize: (state) => ({
          viewMode: state.viewMode,
          annotationsVisible: state.annotationsVisible,
          leftPanelOpen: state.leftPanelOpen,
          rightPanelOpen: state.rightPanelOpen,
        }),
      }
    )
  )
)
```

---

## 4. API Design

### 4.1 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/articles/[slug]` | Get article with human content |
| GET | `/api/public/articles/[slug]/ai` | Get article with AI content (JSONB) |
| GET | `/api/public/articles/[slug]/full` | Get article with both views |
| PATCH | `/api/articles/[id]/publish-mode` | Update publish mode |

### 4.2 Response Schemas

```typescript
// src/types/api.ts

/**
 * Article API Response - AI View
 */
export interface ArticleAIResponse {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  publish_mode: 'full_transparency' | 'reader' | 'developer'

  author: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  }

  published_at: string | null
  stars_count: number
  views_count: number

  vibe_platform: string | null
  vibe_duration_minutes: number | null
  vibe_model: string | null

  json_content: AINativeContent | null
  ai_view_available: boolean
}
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Establish database schema and basic state management

| Step | Task | Effort | Dependencies |
|------|------|--------|--------------|
| 1.1 | Create migration for AI-Native columns | 2h | None |
| 1.2 | Create TypeScript types for AI-Native content | 3h | None |
| 1.3 | Create Zustand store for reading state | 4h | 1.2 |
| 1.4 | Create API endpoints for AI content | 4h | 1.1, 1.2 |
| 1.5 | Write unit tests for types and store | 3h | 1.2, 1.3 |

**Deliverables:**
- Database migration applied
- TypeScript types defined
- Zustand store functional
- API endpoints tested

### Phase 2: AI View Components (Week 3-4)

**Goal:** Build AI View renderer components

| Step | Task | Effort | Dependencies |
|------|------|--------|--------------|
| 2.1 | Create AIViewContainer component | 4h | Phase 1 |
| 2.2 | Build ConversationThreadViewer | 6h | 2.1 |
| 2.3 | Build DecisionTimeline component | 4h | 2.1 |
| 2.4 | Build CodeSnippetGallery component | 4h | 2.1 |
| 2.5 | Build VersionHistory component | 3h | 2.1 |
| 2.6 | Build InsightsPanel component | 3h | 2.1 |
| 2.7 | Create shared sub-components | 4h | 2.1-2.6 |
| 2.8 | Write component tests | 4h | 2.1-2.7 |

**Deliverables:**
- All AI View components built
- Component tests passing
- Storybook stories created

### Phase 3: Immersive Integration (Week 5-6)

**Goal:** Integrate dual views into immersive reader

| Step | Task | Effort | Dependencies |
|------|------|--------|--------------|
| 3.1 | Extend ImmersiveReaderContainer for dual views | 6h | Phase 2 |
| 3.2 | Implement view toggle animation | 4h | 3.1 |
| 3.3 | Create ViewToggle component | 3h | 3.2 |
| 3.4 | Integrate with existing annotation system | 6h | 3.1 |
| 3.5 | Update panel layout for dual views | 4h | 3.1, 3.4 |
| 3.6 | Write E2E tests for view transitions | 4h | 3.1-3.5 |

**Deliverables:**
- Dual views integrated
- Smooth transitions working
- E2E tests passing

### Phase 4: Sketch Mode (Week 7-8)

**Goal:** Build split-pane editor for authors

| Step | Task | Effort | Dependencies |
|------|------|--------|--------------|
| 4.1 | Create SketchEditor container | 4h | Phase 3 |
| 4.2 | Build SplitPaneLayout component | 6h | 4.1 |
| 4.3 | Integrate Tiptap editor (existing) | 4h | 4.2 |
| 4.4 | Create content sync between views | 6h | 4.2, 4.3 |
| 4.5 | Implement auto-save | 3h | 4.4 |
| 4.6 | Write E2E tests for sketch mode | 4h | 4.1-4.5 |

**Deliverables:**
- Sketch mode functional
- Split-pane editor working
- Auto-save implemented

### Phase 5: Publish Mode (Week 9-10)

**Goal:** Implement publish mode selection and permissions

| Step | Task | Effort | Dependencies |
|------|------|--------|--------------|
| 5.1 | Create PublishModeSelector component | 4h | Phase 4 |
| 5.2 | Build PublishModePreview component | 4h | 5.1 |
| 5.3 | Implement publish mode API endpoint | 3h | 5.1 |
| 5.4 | Add RLS policies for publish modes | 4h | 5.3 |
| 5.5 | Integrate with existing publish flow | 4h | 5.1-5.4 |
| 5.6 | Write tests for publish modes | 3h | 5.1-5.5 |

**Deliverables:**
- Publish mode selector working
- RLS policies enforced
- Publish flow updated

---

## 6. Technical Decisions

### 6.1 State Management: Zustand

**Rationale:**
- Simpler learning curve
- Better TypeScript support
- Smaller bundle size
- Sufficient for our state complexity

### 6.2 Rendering Strategy

**Decision: Client-side rendering with SSR hydration**

**Rationale:**
- Human View (Markdown) can be SSR'd for SEO
- AI View is interactive, client-side is acceptable
- Progressive enhancement approach
- Faster perceived performance

### 6.3 Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Large JSONB payloads | Pagination, lazy loading |
| Animation jank | Use transforms, will-change |
| Memory leaks | Proper cleanup in useEffect |
| Bundle size | Code splitting by view mode |

---

## 7. Backend-Frontend Sync Points

### 7.1 Backend Deliverables

| Deliverable | ETA | Consumer |
|-------------|-----|----------|
| Database migration | Week 1 | Frontend types |
| API endpoints | Week 1 | Frontend hooks |
| RLS policies | Week 9 | Publish mode |

### 7.2 Frontend Expectations

| Expectation | Provider | Consumer |
|-------------|----------|----------|
| AINativeContent type | Backend | Frontend components |
| API response schema | Backend | Frontend hooks |
| Publish mode validation | Backend | Frontend forms |

### 7.3 Integration Checkpoints

| Checkpoint | When | Verify |
|------------|------|--------|
| API Contract | Week 1 | Endpoints return expected schema |
| Data Flow | Week 3 | JSONB renders correctly |
| Permissions | Week 9 | RLS policies enforced |
| E2E | Week 10 | Full user flow works |

---

## 8. Risk Mitigation

### 8.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large JSONB payload size | High | Implement pagination, compression |
| Animation performance | Medium | Use transforms, requestAnimationFrame |
| State sync between views | High | Single source of truth in Zustand |
| SSR hydration mismatch | Medium | Use dynamic imports for AI View |

### 8.2 Integration Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing annotation system | High | Comprehensive E2E tests |
| RLS policy conflicts | Medium | Test all publish modes |
| Migration rollback | High | Test migration on staging first |

---

## 9. Success Metrics

### 9.1 Performance Targets

| Metric | Target |
|--------|--------|
| AI View load time | < 500ms |
| View toggle animation | 300ms smooth |
| Bundle size increase | < 50KB gzipped |
| Lighthouse score | > 90 |

### 9.2 User Experience Targets

| Metric | Target |
|--------|--------|
| View toggle success rate | > 99% |
| Error rate in sketch mode | < 1% |
| Time to first contentful paint | < 1.5s |

---

## 10. Design Discussion Summary

This implementation plan is based on the deep design discussion between the user and AI on 2026-03-18. Key insights from that discussion:

### 10.1 Core Philosophy

- **"沉浸感" over "割裂感"** - Every transition should be smooth, never a hard jump
- **Dual Reading Structure** mirrors the Dual Data Structure (Markdown + JSONB)
- **Gallery Metaphor** - Each conversation is a brush stroke, final article is a completed artwork

### 10.2 Key Differentiators from ChatGPT

| Aspect | ChatGPT | Viblog |
|--------|---------|--------|
| Output | Plain text | Markdown + structured JSONB |
| Metadata | Lost | Preserved (decisions, code, versions) |
| AI Consumable | No | Yes (native JSONB) |
| Traceability | None | Full conversation thread |

### 10.3 Publish Modes

- **Full Transparency**: AI View + Human View both public
- **Reader Mode**: Only Human View public (default)
- **Developer Mode**: Full JSONB accessible (requires auth)

---

**Document Version:** 1.0
**Created:** 2026-03-18
**Author:** System Architect + Chief UI Officer
**Status:** Ready for Implementation Planning