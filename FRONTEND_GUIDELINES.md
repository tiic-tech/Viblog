# Viblog - Frontend Design Guidelines

## 文档信息
- **功能**: 前端设计指南，定义视觉设计系统、组件规范和交互模式
- **作用**: 确保 UI/UX 一致性，指导前端开发
- **职责**: 明确"产品长什么样"，覆盖颜色、排版、组件、动效
- **阅读时机**: 按需阅读 - 当需要了解视觉设计、组件规范或卡片样式时

---

## 1. Design Philosophy

### 1.1 Core Principles

- **Beautiful** - Display vibe coding achievements like art pieces (Pinterest-inspired)
- **Minimal** - Clean interfaces that don't distract from content
- **Fluid** - Smooth animations that feel natural, not flashy
- **Accessible** - WCAG 2.1 AA compliant for all users
- **Premium** - High-end visual presentation that inspires confidence

### 1.2 Design Direction

- **Dark-first** - Optimized for dark mode as primary experience
- **Card-centric** - Pinterest-style masonry layout for content discovery
- **Motion-enhanced** - Subtle animations that add polish without distraction
- **Image-focused** - High-quality cover images as primary visual anchors

---

## 2. Color System

### 2.1 Primary Palette

```css
:root {
  /* Background Colors */
  --background: #0a0a0a;           /* Deep black */
  --background-secondary: #171717; /* Card background */
  --background-tertiary: #262626;  /* Elevated surfaces */

  /* Foreground Colors */
  --foreground: #fafafa;           /* Primary text */
  --foreground-muted: #a3a3a3;     /* Secondary text */
  --foreground-dim: #525252;       /* Tertiary text */

  /* Brand Colors */
  --primary: #6366f1;              /* Indigo - Primary action */
  --primary-hover: #4f46e5;        /* Darker indigo */
  --primary-foreground: #ffffff;   /* Text on primary */

  /* Accent Colors */
  --accent: #8b5cf6;               /* Purple - Accent */
  --accent-hover: #7c3aed;         /* Darker purple */

  /* Semantic Colors */
  --success: #22c55e;              /* Green */
  --warning: #f59e0b;              /* Amber */
  --error: #ef4444;                /* Red */
  --info: #3b82f6;                 /* Blue */

  /* Border Colors */
  --border: #262626;               /* Default border */
  --border-hover: #404040;         /* Hover state */

  /* Card Colors */
  --card: #171717;                 /* Card background */
  --card-hover: #1f1f1f;           /* Card hover */
  --card-foreground: #fafafa;      /* Card text */
}
```

---

## 3. Typography

### 3.1 Font Stack

```css
:root {
  /* Primary Font - Sans Serif */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Monospace Font - Code */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
}
```

### 3.2 Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 3rem (48px) | 700 | 1.25 | Page titles |
| H2 | 2.25rem (36px) | 700 | 1.25 | Section headers |
| H3 | 1.5rem (24px) | 600 | 1.25 | Card titles |
| H4 | 1.25rem (20px) | 600 | 1.25 | Subsection |
| Body | 1rem (16px) | 400 | 1.5 | Paragraphs |
| Small | 0.875rem (14px) | 400 | 1.5 | Captions, labels |
| Tiny | 0.75rem (12px) | 400 | 1.5 | Tags, meta |

---

## 4. Article Card Design (Pinterest-Style)

### 4.1 Card Layout

```tsx
// Article Card Component Structure
const ArticleCard = ({ article }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-card
                  transition-all duration-300 hover:shadow-xl hover:shadow-primary/10
                  hover:-translate-y-1">
    {/* Cover Image - Variable Height */}
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={article.cover_image}
        alt={article.title}
        className="object-cover w-full h-full
                   transition-transform duration-500 group-hover:scale-105"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>

    {/* Content Section */}
    <div className="p-4 space-y-2">
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground line-clamp-2">
        {article.title}
      </h3>

      {/* Author & Stats */}
      <div className="flex items-center justify-between text-sm text-foreground-muted">
        <div className="flex items-center gap-2">
          <Avatar src={article.author.avatar_url} size="sm" />
          <span>@{article.author.username}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{article.stars_count}</span>
        </div>
      </div>

      {/* Tags (optional) */}
      {article.tags && (
        <div className="flex flex-wrap gap-1">
          {article.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  </div>
)
```

### 4.2 Masonry Grid Layout

```css
/* Masonry Grid for Pinterest-style layout */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  grid-auto-rows: 10px;
}

.masonry-item {
  grid-row-end: span var(--row-span, 30);
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .masonry-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .masonry-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 5. Draft Bucket UI

### 5.1 Draft Bucket Card

```tsx
const DraftBucketCard = ({ bucket }) => (
  <div className="rounded-xl border border-border bg-card p-6
                  hover:border-primary/50 transition-colors">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold">{bucket.title_suggestions[0]}</h3>
        <p className="text-sm text-foreground-muted">
          {formatDate(bucket.created_at)}
        </p>
      </div>
      <Badge variant={bucket.status}>{bucket.status}</Badge>
    </div>

    {/* Preview */}
    <div className="space-y-3 mb-4">
      {/* Code Snippets Preview */}
      {bucket.code_snippets.slice(0, 2).map((snippet, i) => (
        <div key={i} className="bg-background-tertiary rounded-lg p-3">
          <code className="text-sm text-foreground-muted line-clamp-2">
            {snippet.code}
          </code>
        </div>
      ))}
    </div>

    {/* Human Touch Status */}
    {bucket.human_reflections ? (
      <p className="text-sm text-foreground-muted line-clamp-2 mb-4">
        {bucket.human_reflections}
      </p>
    ) : (
      <div className="flex items-center gap-2 text-sm text-warning mb-4">
        <AlertCircle className="w-4 h-4" />
        <span>Add your reflections to complete</span>
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-2">
      <Button variant="outline" size="sm">Edit</Button>
      <Button size="sm" disabled={!bucket.human_reflections}>
        Generate Article
      </Button>
    </div>
  </div>
)
```

---

## 6. Animation Guidelines

### 6.1 Motion Values

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Easings */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 6.2 Framer Motion Presets

```tsx
// Card hover animation
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 }
}

// Stagger animation for grids
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}
```

---

## 7. Responsive Design

### 7.1 Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### 7.2 Mobile Navigation

```
┌─────────────────────┐
│      Mobile Header   │
│  [Menu]  Viblog  [+] │
├─────────────────────┤
│                     │
│    Main Content     │
│                     │
├─────────────────────┤
│    Bottom Nav Bar   │
│ [Home] [Search] [+] [Profile] [More] │
└─────────────────────┘
```

---

## 8. Accessibility

### 8.1 Focus States

```css
/* Visible focus ring for keyboard navigation */
:focus-visible {
  outline: none;
  ring: 2px solid var(--primary);
  ring-offset: 2px solid var(--background);
}
```

### 8.2 Color Contrast

All text colors meet WCAG 2.1 AA standards:
- Regular text: 4.5:1 minimum
- Large text: 3:1 minimum

---

## 9. Visual Design Inspiration

### 9.1 Reference Sites

| Site | What to Learn |
|------|---------------|
| Pinterest | Masonry layout, card design, image-centric UI |
| Dribbble | High-end visual polish, creative layouts |
| Behance | Portfolio presentation, project showcases |
| Awwwards | Cutting-edge interactions, premium feel |
| Linear | Clean dark UI, smooth animations |

### 9.2 Design Tokens for Premium Feel

```css
:root {
  /* Subtle gradients for depth */
  --gradient-subtle: linear-gradient(180deg, transparent, rgba(0,0,0,0.4));

  /* Soft shadows */
  --shadow-glow: 0 0 40px rgba(99, 102, 241, 0.15);

  /* Glass effect */
  --glass-bg: rgba(23, 23, 23, 0.8);
  --glass-blur: backdrop-filter: blur(12px);
}
```

---

**Document Version:** 2.0
**Last Updated:** 2026-03-15
**Author:** Viblog Team