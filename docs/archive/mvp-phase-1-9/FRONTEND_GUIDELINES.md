# Viblog - Frontend Guidelines

## 1. Design Philosophy

### 1.1 Core Principles

- **Beautiful** - Display vibe coding achievements like art pieces
- **Minimal** - Clean interfaces that don't distract from content
- **Fluid** - Smooth animations that feel natural, not flashy
- **Accessible** - WCAG 2.1 AA compliant for all users

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

### 2.2 Color Usage

| Color | Usage | Examples |
|-------|-------|----------|
| `--background` | Page background | All pages |
| `--card` | Cards, panels | Article cards, sidebar |
| `--primary` | Primary actions | Buttons, links, highlights |
| `--accent` | Secondary highlights | Badges, tags |
| `--success` | Success states | Confirmations, valid inputs |
| `--error` | Error states | Errors, destructive actions |
| `--warning` | Warning states | Alerts, cautions |

### 2.3 Dark Mode (Default)

Viblog is designed dark-first. Light mode is not in MVP scope.

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

### 3.2 Font Import

```html
<!-- In layout.tsx head -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

### 3.3 Type Scale

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Letter Spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

### 3.4 Typography Components

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

## 4. Spacing System

### 4.1 Spacing Scale

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### 4.2 Spacing Usage

| Space | Usage |
|-------|-------|
| `--space-1` | Icon padding, tight gaps |
| `--space-2` | Button padding, inline gaps |
| `--space-3` | Small component padding |
| `--space-4` | Default padding, paragraph spacing |
| `--space-6` | Card padding, section gaps |
| `--space-8` | Section margins |
| `--space-12` | Page section gaps |
| `--space-16` | Major section dividers |

---

## 5. Layout

### 5.1 Container Widths

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### 5.2 Grid System

```css
/* 12-column grid */
.grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(12, 1fr);
}

/* Common patterns */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

### 5.3 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## 6. Components

### 6.1 Buttons

```tsx
// Button Variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive: "bg-error text-white hover:bg-error/90",
        outline: "border border-border bg-transparent hover:bg-card",
        secondary: "bg-card text-foreground hover:bg-card-hover",
        ghost: "hover:bg-card hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 6.2 Cards

```tsx
// Card Component
const cardStyles = cva(
  "rounded-xl border border-border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "hover:border-border-hover hover:bg-card-hover",
        interactive: "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer",
        static: "",
      },
      padding: {
        default: "p-6",
        compact: "p-4",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)
```

### 6.3 Input Fields

```tsx
// Input Component
const inputStyles = cva(
  "flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-error focus-visible:ring-error",
      },
    },
  }
)
```

---

## 7. Animation

### 7.1 Motion Values

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

### 7.2 Framer Motion Presets

```tsx
// Animation Variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: "easeOut" },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}
```

### 7.3 Animation Guidelines

| Animation | Duration | Use Case |
|-----------|----------|----------|
| Fade | 150-200ms | Simple visibility |
| Slide | 200-300ms | Page transitions, modals |
| Scale | 150-200ms | Buttons, cards on hover |
| Stagger | 50ms delay | List items |

---

## 8. Icons

### 8.1 Icon Library

Using **Lucide React** for consistent iconography.

### 8.2 Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| xs | 12px | Inline, badges |
| sm | 16px | Buttons, inputs |
| md | 20px | Default |
| lg | 24px | Section headers |
| xl | 32px | Feature highlights |

### 8.3 Common Icons

```tsx
import {
  // Navigation
  Home, Search, User, Settings, Menu, X,

  // Actions
  Plus, Edit, Trash2, Save, Send, Star,

  // Status
  Check, AlertCircle, Info, AlertTriangle,

  // Content
  FileText, Image, Link, Code, Clock,

  // Social
  Share2, Heart, MessageCircle,

  // UI
  ChevronDown, ChevronRight, ArrowRight, ExternalLink,
} from 'lucide-react'
```

---

## 9. Shadows

### 9.1 Shadow Scale

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Glow shadows for primary elements */
  --shadow-primary: 0 0 20px rgb(99 102 241 / 0.3);
  --shadow-accent: 0 0 20px rgb(139 92 246 / 0.3);
}
```

---

## 10. Border Radius

### 10.1 Radius Scale

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius: 0.5rem;       /* 8px */
  --radius-md: 0.75rem;   /* 12px */
  --radius-lg: 1rem;      /* 16px */
  --radius-xl: 1.5rem;    /* 24px */
  --radius-2xl: 2rem;     /* 32px */
  --radius-full: 9999px;  /* Pill */
}
```

### 10.2 Radius Usage

| Radius | Usage |
|--------|-------|
| `--radius-sm` | Badges, small elements |
| `--radius` | Inputs, small buttons |
| `--radius-md` | Default buttons |
| `--radius-lg` | Cards |
| `--radius-xl` | Large cards, modals |
| `--radius-full` | Avatars, pills |

---

## 11. Accessibility

### 11.1 Focus States

```css
/* Visible focus ring for keyboard navigation */
:focus-visible {
  outline: none;
  ring: 2px solid var(--primary);
  ring-offset: 2px solid var(--background);
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-4);
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: var(--radius);
  z-index: 9999;
}

.skip-link:focus {
  top: var(--space-4);
}
```

### 11.2 Color Contrast

All text colors meet WCAG 2.1 AA standards:
- Regular text: 4.5:1 minimum
- Large text: 3:1 minimum

---

## 12. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        // ... other colors
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      spacing: {
        // Using CSS variables for spacing
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
    },
  },
  plugins: [],
}
```

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13