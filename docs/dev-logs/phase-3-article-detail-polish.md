# [Phase 3] Article Detail Polish - Soul-Centered Design Plan

**Date**: 2026-03-17
**Phase**: Phase 3 - Article Detail Polish
**Status**: In Progress
**Workflow**: Soul First → User Story Second → Design Third → Code Last

---

## Soul Check: The AI-Native Questions

Before any design decision, we must answer:

### 1. Record - Is the Vibe Coder's journey fully captured?
- The article page must show the **journey context**, not just the output
- Vibe metadata (platform, duration, model) should feel like **badges of honor**
- The author section must celebrate the **real coding process**

### 2. Share - Does sharing feel natural and meaningful?
- The article must be a **portal to the creator's mind**
- Highlighting and annotations transform passive reading into **active engagement**
- The journey visualization should make the reader feel **part of something real**

### 3. Grow - Does this help build knowledge?
- Annotations become **seeds for future content** (US-207)
- Code blocks must be **copyable, referenceable, learnable**
- Related articles should feel like **chapters in a larger story**

---

## User Stories Served

| Story | Description | Design Impact |
|-------|-------------|---------------|
| **US-200** | Smart Markdown Formatting | Typography must disappear, letting content shine |
| **US-205** | Article Highlighting | Selection triggers elegant annotation UI |
| **US-206** | Annotation Discussions | Discussions feel like natural article extension |

---

## Current State Analysis

### Article Page Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  [Cover Image]                                                  │
├─────────────────────────────────────────────────────────────────┤
│  ArticleHeader                                                  │
│  ├── Title (text-3xl)                                          │
│  ├── Excerpt (text-lg)                                         │
│  ├── Meta Badges (platform, duration, model)                   │
│  ├── Author Row (avatar, name, stats)                          │
│  └── Project Badge                                             │
├─────────────────────────────────────────────────────────────────┤
│  ArticleActions (stars)                                        │
├─────────────────────────────────────────────────────────────────┤
│  ArticleContent                                                 │
│  └── Basic prose styling (no soul)                             │
├─────────────────────────────────────────────────────────────────┤
│  RelatedArticles                                                │
└─────────────────────────────────────────────────────────────────┘
```

### Missing Soul Elements
1. **No journey visualization** - Where's the vibe coding journey?
2. **No annotation UI** - US-205/US-206 not implemented
3. **Basic code blocks** - Code is not celebrated as protagonist
4. **Author section is functional, not celebratory** - Missing the "why" of the journey

---

## Soul-Centered Design Goals

### Goal 1: Immersive Reading Typography (US-200)

**Soul Purpose**: Let readers forget they're looking at a screen.

**Design Principles**:
- Optimal line length: 65-75 characters (ch units)
- Generous line height: 1.7-1.8 for body text
- Proper type scale with rhythm
- Font: Inter for body, Outfit for headings

**Implementation**:
```css
/* Reading-optimized prose */
.prose-immersive {
  --reading-width: 65ch;
  max-width: var(--reading-width);
  font-size: 1.125rem; /* 18px for comfortable reading */
  line-height: 1.75;
  letter-spacing: 0.01em;
}

/* Heading hierarchy */
.prose-immersive h1 { font-size: 2.5rem; line-height: 1.15; }
.prose-immersive h2 { font-size: 1.875rem; line-height: 1.2; }
.prose-immersive h3 { font-size: 1.5rem; line-height: 1.25; }
```

---

### Goal 2: Code Block Theming (Respect Code as Protagonist)

**Soul Purpose**: Code is the hero of Vibe Coder stories. It deserves respect.

**Design Principles**:
- Syntax highlighting with dark theme
- Language badge with icon
- Copy button with feedback
- Line numbers for longer blocks
- Filename header when available

**Implementation**:
```tsx
// CodeBlock component structure
<div className="code-block">
  <header className="flex items-center justify-between">
    <span className="language-badge">{language}</span>
    <button className="copy-btn" onClick={handleCopy}>Copy</button>
  </header>
  <pre className="code-content">
    <code>{/* Syntax highlighted code */}</code>
  </pre>
</div>
```

**Styling**:
```css
.code-block {
  background: var(--bg-deep);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.code-block header {
  background: var(--glass-surface);
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--glass-border);
}
```

---

### Goal 3: Annotation UI (US-205, US-206)

**Soul Purpose**: Transform reading from passive consumption to active dialogue.

**Design Principles**:
- Selection triggers elegant tooltip
- Highlights persist with subtle color
- Margin notes for context
- Discussion threads feel natural

**Interaction Flow**:
1. User selects text → Annotation tooltip appears
2. User clicks "Highlight" → Text gets highlighted color
3. User clicks "Annotate" → Margin note input appears
4. Other users can reply → Discussion thread forms

**Implementation**:
```tsx
// Annotation state
const [selection, setSelection] = useState<Selection | null>(null)
const [annotations, setAnnotations] = useState<Annotation[]>([])

// Selection handler
const handleSelection = () => {
  const sel = window.getSelection()
  if (sel && sel.toString().length > 0) {
    setSelection({
      text: sel.toString(),
      range: sel.getRangeAt(0),
      rect: sel.getRangeAt(0).getBoundingClientRect()
    })
  }
}
```

---

### Goal 4: Author Journey Section (Celebrate Vibe Coder)

**Soul Purpose**: The author is not just a byline. They are a Vibe Coder whose journey matters.

**Design Principles**:
- Author card with journey context
- Vibe model and duration as achievements
- "About this session" narrative
- Links to author's other works

**Implementation**:
```tsx
// Enhanced author section
<section className="author-journey">
  <div className="journey-header">
    <h3>Written by</h3>
  </div>
  <div className="author-card">
    <Avatar />
    <div className="author-info">
      <name />
      <bio />
      <vibe-stats> {/* model, duration, platform */} </vibe-stats>
    </div>
  </div>
  <div className="session-context">
    <p>This article was crafted in a {duration} vibe coding session with {model}.</p>
  </div>
</section>
```

---

## 10 Design Metrics Target

| Metric | Current | Target | Key Improvements |
|--------|---------|--------|------------------|
| Visual Hierarchy | 7/10 | 9/10 | Reading flow, code emphasis |
| Balance & Layout | 7/10 | 8/10 | Optimal width, breathing room |
| Typography | 6/10 | 9/10 | Immersive reading experience |
| Color Harmony | 7/10 | 8/10 | Code theming, highlight colors |
| Spacing System | 7/10 | 8/10 | Consistent rhythm |
| Component Design | 6/10 | 9/10 | Code blocks, annotation UI |
| Micro-interactions | 5/10 | 8/10 | Copy feedback, highlight animation |
| Responsive Design | 7/10 | 8/10 | Mobile annotation fallback |
| Brand Identity | 6/10 | 9/10 | Vibe journey celebration |
| Premium Feel | 6/10 | 9/10 | Polished details |

**Target Grade**: A (85/100)

---

## Implementation Phases

### Phase 3.1: Reading Typography (Day 1) - COMPLETE
- [x] Create `prose-immersive` CSS module
- [x] Update ArticleContent to use immersive prose
- [x] Test readability with real content

### Phase 3.2: Code Block Enhancement (Day 1) - COMPLETE
- [x] Create CodeBlock component with syntax highlighting
- [x] Add language badge and copy button
- [x] Style with dark theme

### Phase 3.3: Author Journey Section (Day 2) - COMPLETE
- [x] Redesign author section with journey context
- [x] Add vibe coding session narrative
- [x] Link to author's other works

### Phase 3.4: Annotation UI Foundation (Day 2-3) - COMPLETE
- [x] Create selection detection hook (`use-text-selection.ts`)
- [x] Build annotation tooltip component (`annotation-tooltip.tsx`)
- [x] Implement highlight persistence (`use-highlights.ts`)
- [x] Integrate with ArticleContent component
- [x] Add toast notifications for user feedback

---

## Technical Constraints

1. **No WebGL** - All animations via CSS/Framer Motion
2. **Accessibility** - All interactions keyboard-accessible
3. **Performance** - FCP < 2s, LCP < 2.5s
4. **Mobile-first** - Annotation works on touch devices

---

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `src/styles/prose-immersive.css` | Create | Immersive reading typography |
| `src/components/public/article-content.tsx` | Modify | Use immersive prose, add code blocks |
| `src/components/ui/code-block.tsx` | Create | Syntax-highlighted code component |
| `src/components/public/article-header.tsx` | Modify | Enhanced author journey section |
| `src/hooks/use-text-selection.ts` | Create | Selection detection for annotations |
| `src/components/ui/annotation-tooltip.tsx` | Create | Annotation UI component |

---

## Success Criteria

1. **Gap Test**: Reading feels like a conversation, not consumption
2. **EVA Soul**: Code blocks feel like gallery pieces, not text dumps
3. **The Fold**: Author section celebrates the journey, not just lists metadata

---

**Author**: Claude (UI Team Leader - chief-ui-officer)
**Document Version**: 1.0
**Reference**: `docs/UI_TEAM_WORKFLOW.md`, `PRD.md`