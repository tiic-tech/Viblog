# Immersive Experience Design System

**Core Philosophy:** "沉浸感" over "割裂感"

**Principle:** Every transition is a smooth animation, never a hard page jump.

---

## 1. State Machine Definition

### States

| State | Name | Visual | Trigger to Enter |
|-------|------|--------|------------------|
| `HOME` | Homepage/Dashboard | Normal view, cards visible | - |
| `FLOATING_READER` | Floating Reading Window | Centered modal, dimmed background | Click Card |
| `FULL_EXPANDED` | Full Immersive View | Entire screen filled | Click Title |

### State Transitions

```
HOME ──[click Card]──► FLOATING_READER ──[click Title]──► FULL_EXPANDED
  ▲                                                    │
  │                                                    │
  └──────────────[click Back]──────────────────────────┘
                           │
                           ▼
                    (via FLOATING_READER)
```

---

## 2. Animation Specifications

### FLOATING_READER Entry (State 0 → 1)

```typescript
const floatingReaderEntry = {
  // Window slides up from bottom
  window: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },

  // Background dims
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 0.5 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
}
```

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ╔═════════════════════════════════════════════════════════╗   │
│   ║  [Article Title]                    [★ Star] [← Back]   ║   │ ← Fixed Header
│   ╠═════════════════════════════════════════════════════════╣   │
│   ║                                                           ║   │
│   ║                                                           ║   │
│   ║                    READING CONTENT                        ║   │ ← Scrollable
│   ║                    (independent scroll)                   ║   │
│   ║                                                           ║   │
│   ║                                                           ║   │
│   ╠═════════════════════════════════════════════════════════╣   │
│   ║  [Avatar] [Name] [Description]        [Follow/Unfollow] ║   │ ← Fixed Footer
│   ╚═════════════════════════════════════════════════════════╝   │
│                                                                 │
│   ████████████████████ DARKENED BACKDROP █████████████████████  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### FULL_EXPANDED Entry (State 1 → 2)

```typescript
const fullExpandedEntry = {
  // Window expands to fill screen
  window: {
    initial: { width: '80%', height: '80%', borderRadius: '16px' },
    animate: { width: '100%', height: '100%', borderRadius: '0px' },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
  },

  // Left menu slides in
  leftPanel: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.25, delay: 0.1 }
  },

  // Right annotation panel slides in
  rightPanel: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.25, delay: 0.1 }
  },

  // Bottom section slides up
  bottomSection: {
    initial: { y: 200, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.25, delay: 0.15 }
  }
}
```

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────┐
│  LEFT PANEL    │          CENTER CONTENT           │ RIGHT PANEL│
│  ┌───────────┐ │  ┌─────────────────────────────┐ │ ┌─────────┐│
│  │ Menu      │ │  │ [Title]              [Back] │ │ │Annotations│
│  │           │ │  │                             │ │ │         ││
│  │ • Chapter │ │  │                             │ │ │ • Note 1││
│  │ • Chapter │ │  │     READING CONTENT         │ │ │ • Note 2││
│  │ • Chapter │ │  │                             │ │ │         ││
│  │           │ │  │                             │ │ │         ││
│  └───────────┘ │  └─────────────────────────────┘ │ └─────────┘│
│                │  ┌─────────────────────────────┐ │            │
│                │  │ COMMENTS    │   RELATED     │ │            │
│                │  │ • Comment 1 │   • Article 1 │ │            │
│                │  │ • Comment 2 │   • Article 2 │ │            │
│                │  └─────────────────────────────┘ │            │
└─────────────────────────────────────────────────────────────────┘
```

### Exit Animations (Reverse)

```typescript
// State 2 → 1: Contract
const contractToReader = {
  window: {
    animate: { width: '80%', height: '80%', borderRadius: '16px' },
    transition: { duration: 0.25 }
  },
  // Panels fade out with slide
  leftPanel: { animate: { x: -300, opacity: 0 }, transition: { duration: 0.2 } },
  rightPanel: { animate: { x: 300, opacity: 0 }, transition: { duration: 0.2 } },
  bottomSection: { animate: { y: 200, opacity: 0 }, transition: { duration: 0.2 } }
}

// State 1 → 0: Slide down and exit
const exitToHome = {
  window: {
    animate: { y: '100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  },
  backdrop: {
    animate: { opacity: 0 },
    transition: { duration: 0.3 }
  }
}
```

---

## 3. Component Architecture

### Component Hierarchy

```
ImmersiveReadingContainer (State Machine Controller)
├── Backdrop (dimmed overlay)
├── FloatingReaderWindow (animated container)
│   ├── ReaderHeader (fixed)
│   │   ├── ArticleTitle (clickable → expand)
│   │   ├── StarButton
│   │   └── BackButton
│   ├── ReaderContent (scrollable)
│   │   └── ArticleContent
│   └── ReaderFooter (fixed)
│       ├── AuthorAvatar
│       ├── AuthorName
│       ├── AuthorDescription
│       └── FollowButton
├── ExpandedPanels (visible in FULL_EXPANDED state)
│   ├── LeftMenuPanel
│   ├── RightAnnotationPanel
│   └── BottomCommentSection
└── StateIndicator (for debugging, hidden in prod)
```

### React Hook: useImmersiveState

```typescript
type ImmersiveState = 'HOME' | 'FLOATING_READER' | 'FULL_EXPANDED'

interface UseImmersiveStateReturn {
  state: ImmersiveState
  article: Article | null
  openReader: (article: Article) => void
  expandToFull: () => void
  closeReader: () => void
  goBack: () => void
}

function useImmersiveState(): UseImmersiveStateReturn {
  const [state, setState] = useState<ImmersiveState>('HOME')
  const [article, setArticle] = useState<Article | null>(null)
  const [previousState, setPreviousState] = useState<ImmersiveState>('HOME')

  const openReader = useCallback((article: Article) => {
    setArticle(article)
    setState('FLOATING_READER')
  }, [])

  const expandToFull = useCallback(() => {
    setPreviousState('FLOATING_READER')
    setState('FULL_EXPANDED')
  }, [])

  const closeReader = useCallback(() => {
    setState('HOME')
    setArticle(null)
  }, [])

  const goBack = useCallback(() => {
    if (state === 'FULL_EXPANDED') {
      setState('FLOATING_READER')
    } else if (state === 'FLOATING_READER') {
      closeReader()
    }
  }, [state, closeReader])

  return { state, article, openReader, expandToFull, closeReader, goBack }
}
```

---

## 4. Application Contexts

### Public Homepage (Exhibition Cards)

| Action | Transition |
|--------|------------|
| Click Exhibition Card | HOME → FLOATING_READER |
| Click Article Title | FLOATING_READER → FULL_EXPANDED |
| Click Back (from FULL) | FULL_EXPANDED → FLOATING_READER |
| Click Back (from FLOATING) | FLOATING_READER → HOME |

### Personal Dashboard (Projects/Articles)

| Action | Transition |
|--------|------------|
| Click Article in Timeline | HOME → FLOATING_READER |
| Click Article Title | FLOATING_READER → FULL_EXPANDED |
| Click Edit (from FULL) | FULL_EXPANDED → EDIT_MODE |
| Click Back (from EDIT) | EDIT_MODE → FULL_EXPANDED |
| Click Back (from FULL) | FULL_EXPANDED → FLOATING_READER |
| Click Back (from FLOATING) | FLOATING_READER → HOME |

### Key Difference: Edit Mode

In Personal Dashboard, FULL_EXPANDED state has an additional transition to EDIT_MODE:

```
FULL_EXPANDED ──[click Edit]──► EDIT_MODE
                                      │
  ┌───────────────────────────────────┘
  │
  ▼
FULL_EXPANDED (click Back)
```

---

## 5. CSS Variables for Animation Timing

```css
:root {
  /* Immersive Animation Timing */
  --immersive-slide-duration: 300ms;
  --immersive-expand-duration: 250ms;
  --immersive-panel-duration: 250ms;
  --immersive-ease: cubic-bezier(0.16, 1, 0.3, 1);

  /* Immersive Layout */
  --immersive-reader-width: 80%;
  --immersive-reader-height: 85%;
  --immersive-backdrop-opacity: 0.5;
  --immersive-border-radius: 16px;
}
```

---

## 6. Accessibility Considerations

### Focus Management

```typescript
// When entering FLOATING_READER
useEffect(() => {
  if (state === 'FLOATING_READER') {
    // Focus the close button for keyboard users
    closeButtonRef.current?.focus()
    // Trap focus within the modal
    trapFocus(containerRef.current)
  }
}, [state])
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .immersive-container {
    transition-duration: 0ms !important;
  }
}
```

### ARIA Labels

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label={`Reading ${article.title}`}
  aria-hidden={state === 'HOME'}
>
```

---

## 7. Implementation Checklist

### Phase 1: Core State Machine
- [ ] Create `useImmersiveState` hook
- [ ] Create `ImmersiveReadingContainer` component
- [ ] Implement FLOATING_READER entry/exit animations

### Phase 2: Floating Reader
- [ ] Create `FloatingReaderWindow` component
- [ ] Create `ReaderHeader` with Title, Star, Back
- [ ] Create `ReaderContent` with independent scroll
- [ ] Create `ReaderFooter` with author info

### Phase 3: Full Expanded View
- [ ] Create `LeftMenuPanel` component
- [ ] Create `RightAnnotationPanel` component
- [ ] Create `BottomCommentSection` component
- [ ] Implement expand/contract animations

### Phase 4: Integration
- [ ] Integrate with Public Homepage Exhibition Cards
- [ ] Integrate with Dashboard Timeline Articles
- [ ] Add keyboard navigation (Escape to go back)
- [ ] Add focus trap for accessibility

### Phase 5: Polish
- [ ] Fine-tune animation timing
- [ ] Add reduced motion support
- [ ] Test on mobile (responsive adjustments)
- [ ] Performance optimization (layout thrashing prevention)

---

**Document Version:** 1.0
**Created:** 2026-03-18
**Status:** Design specification ready for implementation