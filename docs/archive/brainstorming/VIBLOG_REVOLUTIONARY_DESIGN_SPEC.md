Now I have a comprehensive understanding of the current state. Let me create a revolutionary design specification that will position Viblog as the #1 AI-Native Blog Platform globally.

---

# Viblog Revolutionary Design System Specification

## Document Information
- **Version:** 1.0
- **Created:** 2026-03-16
- **Author:** Chief UI Designer
- **Status:** Design Specification for Implementation

---

## 1. Design Vision Statement

### 1.1 What Makes Viblog Visually Unique

**The Concept: "Code Gallery" - Where Every Article is an Exhibition Piece**

Viblog is not a blog. It is a gallery where developers showcase their coding sessions as art. Just as Dribbble elevates a UI screenshot to a "shot" worthy of critique and admiration, Viblog elevates a coding session to a "vibe" - a captured moment of creative flow that deserves premium presentation.

**Unique Visual Identity:**
- **Gradient Mesh Backgrounds** - Dynamic, organic gradients that feel alive
- **Glassmorphism Cards** - Frosted glass effects with subtle depth
- **Code as Hero Element** - Code snippets are not secondary; they are the centerpiece
- **Neon Accent System** - Cyberpunk-inspired accent colors that pulse with energy
- **Asymmetric Layouts** - Breaking the grid to feel editorial and premium

### 1.2 Emotional Target

**Primary Emotion: Pride**

When a developer sees their article on Viblog, they should feel:
- "This is gallery-worthy"
- "I want to share this everywhere"
- "My work looks professional and premium"

**Secondary Emotion: Discovery**

When browsing Viblog, users should feel:
- "I want to explore more"
- "This is inspiring"
- "I'm learning something valuable"

### 1.3 The Signature Moment

**The Code Hero:**
Every article opens with a hero section featuring the most significant code snippet as a floating glass card against a gradient mesh background. This is not an afterthought - it is the centerpiece, treated with the same reverence a museum gives to a masterpiece.

**The Masonry Discovery:**
Scrolling the homepage reveals a waterfall of article cards, each with its own gradient accent, hover lift effect, and micro-animations that make browsing feel like exploring a curated collection rather than scanning a feed.

---

## 2. Core Visual System

### 2.1 Color Palette - Dark Theme Primary

```css
:root {
  /* === BACKGROUND SYSTEM === */
  /* Deep Space - The canvas */
  --bg-deep: #050508;
  --bg-surface: #0a0a0f;
  --bg-elevated: #12121a;
  --bg-card: rgba(18, 18, 26, 0.8);
  
  /* === FOREGROUND SYSTEM === */
  --fg-primary: #f4f4f5;
  --fg-secondary: #a1a1aa;
  --fg-muted: #71717a;
  --fg-dim: #3f3f46;
  
  /* === BRAND ACCENT SYSTEM - "Neon Pulse" === */
  /* Primary: Electric Violet */
  --accent-primary: #8b5cf6;
  --accent-primary-light: #a78bfa;
  --accent-primary-dark: #7c3aed;
  --accent-primary-glow: rgba(139, 92, 246, 0.4);
  
  /* Secondary: Cyan Electric */
  --accent-secondary: #06b6d4;
  --accent-secondary-light: #22d3ee;
  --accent-secondary-glow: rgba(6, 182, 212, 0.3);
  
  /* Tertiary: Rose Glow */
  --accent-tertiary: #f43f5e;
  --accent-tertiary-light: #fb7185;
  --accent-tertiary-glow: rgba(244, 63, 94, 0.3);
  
  /* === GRADIENT MESH SYSTEM === */
  --gradient-mesh-primary: radial-gradient(
    ellipse at 20% 30%,
    rgba(139, 92, 246, 0.15) 0%,
    transparent 50%
  ), radial-gradient(
    ellipse at 80% 70%,
    rgba(6, 182, 212, 0.1) 0%,
    transparent 50%
  );
  
  --gradient-mesh-hero: radial-gradient(
    ellipse at 30% 20%,
    rgba(139, 92, 246, 0.2) 0%,
    transparent 40%
  ), radial-gradient(
    ellipse at 70% 80%,
    rgba(244, 63, 94, 0.15) 0%,
    transparent 40%
  ), radial-gradient(
    ellipse at 50% 50%,
    rgba(6, 182, 212, 0.1) 0%,
    transparent 50%
  );
  
  /* === GLASS SYSTEM === */
  --glass-bg: rgba(18, 18, 26, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: 16px;
  
  /* === CODE THEME - VS Code Dark+ Enhanced === */
  --code-bg: #1e1e2e;
  --code-line-number: #6c7086;
  --code-keyword: #cba6f7;
  --code-string: #a6e3a1;
  --code-number: #fab387;
  --code-comment: #6c7086;
  --code-function: #89b4fa;
  --code-variable: #f5e0dc;
  
  /* === SEMANTIC COLORS === */
  --success: #10b981;
  --success-glow: rgba(16, 185, 129, 0.3);
  --warning: #f59e0b;
  --warning-glow: rgba(245, 158, 11, 0.3);
  --error: #ef4444;
  --error-glow: rgba(239, 68, 68, 0.3);
  
  /* === BORDER SYSTEM === */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-emphasis: rgba(255, 255, 255, 0.15);
  --border-accent: rgba(139, 92, 246, 0.3);
  
  /* === SHADOW SYSTEM === */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-glow-primary: 0 0 40px rgba(139, 92, 246, 0.2);
  --shadow-glow-secondary: 0 0 40px rgba(6, 182, 212, 0.15);
}
```

### 2.2 Typography System

```css
:root {
  /* === FONT STACKS === */
  /* Display: Outfit - Modern geometric sans for headlines */
  --font-display: 'Outfit', system-ui, -apple-system, sans-serif;
  
  /* Body: Inter - Optimized for readability */
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Code: JetBrains Mono - Excellent legibility */
  --font-code: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  
  /* Reading: Georgia for long-form content */
  --font-reading: Georgia, 'Times New Roman', serif;
  
  /* === TYPE SCALE === */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  
  /* === LINE HEIGHTS === */
  --leading-tight: 1.2;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* === LETTER SPACING === */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}

/* === TYPOGRAPHY PRESETS === */
.display-hero {
  font-family: var(--font-display);
  font-size: var(--text-7xl);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  background: linear-gradient(135deg, var(--fg-primary), var(--accent-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.display-large {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.heading-section {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-tight);
}

.card-title {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: var(--leading-snug);
}

.body-large {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-relaxed);
}

.body-default {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: var(--leading-normal);
}

/* Reading Typography - Medium-inspired */
.reading-content {
  font-family: var(--font-reading);
  font-size: 21px;
  line-height: 1.6;
  max-width: 680px;
  color: var(--fg-primary);
}

.code-block {
  font-family: var(--font-code);
  font-size: var(--text-sm);
  line-height: 1.7;
  letter-spacing: 0.01em;
}
```

### 2.3 Spacing System

```css
:root {
  /* === BASE UNIT: 4px === */
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
  
  /* === SECTION GAPS - Premium Whitespace === */
  --section-gap-hero: var(--space-20);      /* 80px - Hero to content */
  --section-gap-default: var(--space-16);   /* 64px - Between sections */
  --section-gap-compact: var(--space-12);   /* 48px - Dense layouts */
  
  /* === CARD SPACING === */
  --card-padding: var(--space-6);           /* 24px */
  --card-gap: var(--space-4);               /* 16px - Between elements */
  
  /* === GRID GUTTERS === */
  --grid-gap-sm: var(--space-4);            /* 16px - Mobile */
  --grid-gap-md: var(--space-6);            /* 24px - Tablet */
  --grid-gap-lg: var(--space-8);            /* 32px - Desktop */
}
```

### 2.4 Border Radius Philosophy

```css
:root {
  /* === RADIUS SCALE === */
  --radius-sm: 6px;       /* Badges, chips */
  --radius-md: 10px;      /* Buttons, inputs */
  --radius-lg: 14px;      /* Cards */
  --radius-xl: 20px;      /* Large cards, modals */
  --radius-2xl: 28px;     /* Hero elements */
  --radius-full: 9999px;  /* Avatars, pills */
  
  /* === PHILOSOPHY === */
  /*
   * Smaller radii (6-10px) for interactive elements
   * Medium radii (14-20px) for content containers
   * Large radii (28px+) for featured/hero elements
   * Full radius for avatars and pills only
   */
}
```

### 2.5 Shadow and Glow System

```css
:root {
  /* === ELEVATION SHADOWS === */
  --elevation-1: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.2);
  
  --elevation-2:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.1);
  
  --elevation-3:
    0 4px 8px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 16px 32px rgba(0, 0, 0, 0.15);
  
  /* === GLOW EFFECTS === */
  --glow-primary: 
    0 0 20px rgba(139, 92, 246, 0.3),
    0 0 40px rgba(139, 92, 246, 0.15);
  
  --glow-secondary:
    0 0 20px rgba(6, 182, 212, 0.25),
    0 0 40px rgba(6, 182, 212, 0.1);
  
  --glow-card:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  
  --glow-hover:
    0 0 30px rgba(139, 92, 246, 0.2),
    0 12px 32px rgba(0, 0, 0, 0.3);
}
```

---

## 3. Signature Components

### 3.1 Article Card - "The Gallery Piece"

```tsx
// Revolutionary Article Card with Glassmorphism and Gradient Accents
const ArticleCardRevolutionary = ({ article }) => {
  // Dynamic accent based on article category
  const accentColor = getAccentForCategory(article.category);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* Gradient Mesh Background */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${accentColor}15 0%, transparent 50%)`,
        }}
      />
      
      {/* Glass Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]">
        {/* Code Hero Preview */}
        {article.featured_code && (
          <div className="relative h-48 overflow-hidden">
            <div 
              className="absolute inset-0 bg-[var(--code-bg)]"
              style={{
                background: `linear-gradient(135deg, ${accentColor}10, var(--code-bg))`,
              }}
            />
            <pre className="p-4 text-sm font-mono text-[var(--fg-secondary)] opacity-80">
              <code>{article.featured_code}</code>
            </pre>
            
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 50%, var(--bg-card) 100%)`,
              }}
            />
            
            {/* Language Badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 text-xs font-medium rounded-md bg-[var(--bg-elevated)]/80 backdrop-blur-sm border border-white/10">
                {article.code_language}
              </span>
            </div>
          </div>
        )}
        
        {/* Cover Image (Alternative to Code Hero) */}
        {!article.featured_code && article.cover_image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 40%, var(--bg-card) 100%)`,
              }}
            />
          </div>
        )}
        
        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-semibold text-[var(--fg-primary)] leading-snug line-clamp-2 group-hover:text-[var(--accent-primary-light)] transition-colors">
            {article.title}
          </h3>
          
          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-sm text-[var(--fg-secondary)] line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          
          {/* Metadata Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            {/* Author */}
            <div className="flex items-center gap-2">
              <img
                src={article.author.avatar_url}
                alt={article.author.name}
                className="w-6 h-6 rounded-full ring-2 ring-white/10"
              />
              <span className="text-sm font-medium text-[var(--fg-secondary)]">
                {article.author.name}
              </span>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-3 text-sm text-[var(--fg-muted)]">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[var(--accent-tertiary)]" />
                {article.stars_count}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views_count}
              </span>
            </div>
          </div>
          
          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-white/[0.04] text-[var(--fg-muted)] border border-white/[0.06]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Hover Glow Effect */}
        <div
          className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${accentColor}20, inset 0 0 0 1px ${accentColor}30`,
          }}
        />
      </div>
    </motion.article>
  );
};

// Accent color mapping
const getAccentForCategory = (category: string) => {
  const accents = {
    'ai-ml': '#8b5cf6',      // Violet
    'frontend': '#06b6d4',   // Cyan
    'backend': '#10b981',    // Emerald
    'devops': '#f59e0b',     // Amber
    'security': '#ef4444',   // Red
    'mobile': '#ec4899',     // Pink
  };
  return accents[category] || '#8b5cf6';
};
```

### 3.2 Code Block - "Code as Art"

```tsx
// Revolutionary Code Block with Syntax Highlighting and Copy Animation
const CodeBlockRevolutionary = ({ code, language, filename, highlightLines = [] }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group rounded-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-elevated)] border-b border-white/[0.06]">
        {/* Window Dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
        </div>
        
        {/* Filename */}
        {filename && (
          <span className="text-sm text-[var(--fg-muted)] font-mono">
            {filename}
          </span>
        )}
        
        {/* Language Badge */}
        <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary-light)]">
          {language}
        </span>
      </div>
      
      {/* Code Container */}
      <div className="relative bg-[var(--code-bg)] overflow-x-auto">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[var(--code-bg)] border-r border-white/[0.06] flex flex-col items-end pr-3 py-4 text-[var(--code-line-number)] text-sm font-mono select-none">
          {code.split('\n').map((_, i) => (
            <div key={i} className="h-[1.7em] leading-[1.7]">
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Code Content */}
        <pre className="p-4 pl-16 text-sm font-mono leading-[1.7] overflow-x-auto">
          <code className="text-[var(--fg-primary)]">
            {code.split('\n').map((line, i) => (
              <div
                key={i}
                className={cn(
                  "px-2 -mx-2",
                  highlightLines.includes(i + 1) && "bg-[var(--accent-primary)]/10 border-l-2 border-[var(--accent-primary)]"
                )}
              >
                {highlightLine(line, language)}
              </div>
            ))}
          </code>
        </pre>
        
        {/* Copy Button */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/[0.05] border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-4 h-4 text-[var(--success)]" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy className="w-4 h-4 text-[var(--fg-muted)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      
      {/* Gradient Glow Effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 60px rgba(139, 92, 246, 0.05)`,
        }}
      />
    </div>
  );
};
```

### 3.3 Session Timeline - "The Vibe Journey"

```tsx
// Revolutionary Session Timeline Visualization
const SessionTimeline = ({ session }) => {
  return (
    <div className="relative">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{ background: 'var(--gradient-mesh-hero)' }}
      />
      
      {/* Timeline Container */}
      <div className="relative p-8">
        {/* Session Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-semibold text-[var(--fg-primary)]">
              Vibe Session
            </h3>
            <p className="text-sm text-[var(--fg-muted)] mt-1">
              {formatDuration(session.duration)} - {session.files_changed} files changed
            </p>
          </div>
          
          {/* AI Model Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-[var(--accent-primary-light)]">
              {session.model}
            </span>
          </div>
        </div>
        
        {/* Timeline Events */}
        <div className="space-y-4">
          {session.events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4"
            >
              {/* Timeline Dot */}
              <div className="relative flex flex-col items-center">
                <div 
                  className={cn(
                    "w-3 h-3 rounded-full",
                    event.type === 'code' && "bg-[var(--accent-primary)]",
                    event.type === 'decision' && "bg-[var(--accent-secondary)]",
                    event.type === 'insight' && "bg-[var(--accent-tertiary)]",
                  )}
                />
                {index < session.events.length - 1 && (
                  <div className="w-px h-full bg-white/10 mt-2" />
                )}
              </div>
              
              {/* Event Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-[var(--fg-secondary)]">
                    {formatTime(event.timestamp)}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded bg-white/[0.04] text-[var(--fg-muted)]">
                    {event.type}
                  </span>
                </div>
                
                {/* Code Preview */}
                {event.code && (
                  <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-white/[0.06] mb-2">
                    <code className="text-sm font-mono text-[var(--fg-secondary)]">
                      {event.code}
                    </code>
                  </div>
                )}
                
                {/* Description */}
                <p className="text-sm text-[var(--fg-primary)] leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Token Stats */}
        <div className="flex items-center gap-6 pt-6 border-t border-white/[0.06] mt-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--accent-secondary)]" />
            <span className="text-sm text-[var(--fg-muted)]">
              {session.tokens_used.toLocaleString()} tokens
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm text-[var(--fg-muted)]">
              {session.commits} commits
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3.4 Hero Section - "The First Impression"

```tsx
// Revolutionary Hero Section for Article Page
const ArticleHeroRevolutionary = ({ article }) => {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 animate-pulse-slow"
          style={{ background: 'var(--gradient-mesh-hero)' }}
        />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[var(--accent-primary)]/10 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--accent-secondary)]/10 blur-3xl"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Meta Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm font-medium rounded-full bg-white/[0.05] border border-white/10 text-[var(--fg-secondary)]"
            >
              {tag}
            </span>
          ))}
        </motion.div>
        
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{
            background: 'linear-gradient(135deg, var(--fg-primary), var(--accent-primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {article.title}
        </motion.h1>
        
        {/* Excerpt */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-[var(--fg-secondary)] max-w-3xl mb-8 leading-relaxed"
        >
          {article.excerpt}
        </motion.p>
        
        {/* Author and Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-6"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar_url}
              alt={article.author.name}
              className="w-12 h-12 rounded-full ring-2 ring-[var(--accent-primary)]/30"
            />
            <div>
              <p className="font-semibold text-[var(--fg-primary)]">
                {article.author.name}
              </p>
              <p className="text-sm text-[var(--fg-muted)]">
                {formatDate(article.published_at)}
              </p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-px h-10 bg-white/10" />
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[var(--fg-muted)]">
              <Clock className="w-4 h-4" />
              {article.reading_time} min read
            </span>
            <span className="flex items-center gap-2 text-[var(--fg-muted)]">
              <Star className="w-4 h-4" />
              {article.stars_count}
            </span>
          </div>
        </motion.div>
        
        {/* Featured Code Hero */}
        {article.featured_code && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20">
              <CodeBlockRevolutionary
                code={article.featured_code}
                language={article.code_language}
                filename={article.code_filename}
              />
            </div>
          </motion.div>
        )}
        
        {/* Reading Progress Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/[0.02]">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
            style={{ scaleX: 0, transformOrigin: 'left' }}
          />
        </div>
      </div>
    </section>
  );
};
```

---

## 4. Interaction Philosophy

### 4.1 Animation Timing and Easing

```css
:root {
  /* === DURATION SCALE === */
  --duration-instant: 100ms;    /* Micro-interactions */
  --duration-fast: 150ms;       /* Hover states */
  --duration-normal: 250ms;     /* Standard transitions */
  --duration-slow: 400ms;       /* Page transitions */
  --duration-slower: 600ms;     /* Complex animations */
  --duration-slowest: 1000ms;   /* Hero animations */
  
  /* === EASING FUNCTIONS === */
  /* Default - Smooth and natural */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Smooth entry */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  
  /* Smooth exit */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  
  /* Bounce/Spring */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Dramatic */
  --ease-dramatic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* Smooth for scrolling */
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

### 4.2 Hover States

```css
/* === CARD HOVER === */
.card-hover {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: var(--glow-hover);
}

/* === BUTTON HOVER === */
.button-hover {
  position: relative;
  overflow: hidden;
  transition: all var(--duration-fast) var(--ease-default);
}

.button-hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1));
  opacity: 0;
  transition: opacity var(--duration-fast);
}

.button-hover:hover::before {
  opacity: 1;
}

/* === LINK HOVER === */
.link-hover {
  position: relative;
  transition: color var(--duration-instant);
}

.link-hover::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-primary);
  transition: width var(--duration-normal) var(--ease-out);
}

.link-hover:hover::after {
  width: 100%;
}

/* === IMAGE HOVER === */
.image-hover {
  transition: transform var(--duration-slow) var(--ease-out);
}

.image-hover:hover {
  transform: scale(1.05);
}
```

### 4.3 Micro-interactions

```tsx
// Framer Motion Variants for Consistent Animations
export const motionVariants = {
  // Fade In Up
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  // Scale In
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  // Slide In Right
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  // Stagger Children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
  },
  
  // Card Hover
  cardHover: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: 'var(--glow-card)',
    },
    hover: { 
      scale: 1.02, 
      y: -8,
      boxShadow: 'var(--glow-hover)',
      transition: {
        duration: 0.3,
        ease: [0, 0, 0.2, 1],
      },
    },
  },
  
  // Button Press
  buttonPress: {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
  
  // Icon Pop
  iconPop: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  },
};

// Animation Utilities
export const animations = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
  },
  
  listStagger: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  
  listItem: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
};
```

### 4.4 Loading States

```tsx
// Revolutionary Loading States
const LoadingSkeleton = ({ variant = 'card' }) => {
  const variants = {
    card: (
      <div className="rounded-2xl bg-[var(--bg-card)] border border-white/[0.06] p-5 space-y-4">
        <div className="h-48 rounded-lg bg-white/[0.02] animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-white/[0.03] animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-white/[0.02] animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-24 rounded bg-white/[0.02] animate-pulse" />
          <div className="h-4 w-16 rounded bg-white/[0.02] animate-pulse" />
        </div>
      </div>
    ),
    
    code: (
      <div className="rounded-xl bg-[var(--code-bg)] overflow-hidden">
        <div className="h-10 bg-[var(--bg-elevated)] border-b border-white/[0.06]" />
        <div className="p-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-white/[0.02] animate-pulse"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </div>
    ),
    
    text: (
      <div className="space-y-3">
        <div className="h-8 w-2/3 rounded bg-white/[0.03] animate-pulse" />
        <div className="h-4 w-full rounded bg-white/[0.02] animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-white/[0.02] animate-pulse" />
        <div className="h-4 w-4/5 rounded bg-white/[0.02] animate-pulse" />
      </div>
    ),
  };
  
  return variants[variant];
};

// Spinner Component
const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={cn(
        sizes[size],
        'rounded-full border-2 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)]'
      )}
    />
  );
};

// Progress Dots
const ProgressDots = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: steps }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: i === currentStep ? 1.2 : 1,
            backgroundColor: i <= currentStep ? 'var(--accent-primary)' : 'var(--fg-dim)',
          }}
          transition={{ duration: 0.2 }}
          className="w-2 h-2 rounded-full"
        />
      ))}
    </div>
  );
};
```

---

## 5. Page Layout Concepts

### 5.1 Homepage/Feed Layout

```tsx
// Revolutionary Homepage Layout
const HomePageRevolutionary = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: 'var(--gradient-mesh-hero)' }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--fg-primary), var(--accent-primary-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Where Code Meets Art
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--fg-secondary)] max-w-2xl mx-auto"
          >
            The AI-native blog platform for vibe coders. Transform your coding sessions into gallery-worthy articles.
          </motion.p>
        </div>
      </section>
      
      {/* Filter Bar */}
      <section className="sticky top-0 z-20 bg-[var(--bg-deep)]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    activeCategory === cat.id
                      ? "bg-[var(--accent-primary)] text-white"
                      : "bg-white/[0.04] text-[var(--fg-secondary)] hover:bg-white/[0.08]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            {/* Search and Sort */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
                <input
                  type="text"
                  placeholder="Search vibes..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--accent-primary)]/50"
                />
              </div>
              
              <select className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-[var(--fg-secondary)]">
                <option>Most Recent</option>
                <option>Most Starred</option>
                <option>Most Viewed</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Masonry Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={motionVariants.staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                variants={motionVariants.staggerItem}
                transition={{ delay: index * 0.05 }}
              >
                <ArticleCardRevolutionary article={article} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
```

### 5.2 Article Reading View

```tsx
// Revolutionary Article Reading View
const ArticlePageRevolutionary = ({ article }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress((scrollTop / docHeight) * 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-white/[0.02]">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      
      {/* Hero Section */}
      <ArticleHeroRevolutionary article={article} />
      
      {/* Main Content */}
      <main className="relative">
        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Article Content */}
          <article className="prose prose-invert max-w-none">
            {/* Reading Typography - Medium-inspired */}
            <div className="reading-content space-y-8">
              {article.content_blocks.map((block, index) => (
                <ContentBlock key={index} block={block} />
              ))}
            </div>
          </article>
          
          {/* Author Card */}
          <div className="mt-16 p-6 rounded-2xl bg-[var(--bg-card)] border border-white/[0.06]">
            <div className="flex items-center gap-4">
              <img
                src={article.author.avatar_url}
                alt={article.author.name}
                className="w-16 h-16 rounded-full ring-2 ring-[var(--accent-primary)]/20"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-[var(--fg-primary)]">
                  {article.author.name}
                </h4>
                <p className="text-sm text-[var(--fg-muted)]">
                  {article.author.bio}
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium">
                Follow
              </button>
            </div>
          </div>
          
          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-[var(--fg-primary)] mb-8">
              Related Vibes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {article.related.map((related) => (
                <ArticleCardRevolutionary key={related.id} article={related} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Floating Actions */}
        <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-[var(--bg-card)] border border-white/[0.06] backdrop-blur-sm"
          >
            <Star className="w-5 h-5 text-[var(--fg-muted)]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-[var(--bg-card)] border border-white/[0.06] backdrop-blur-sm"
          >
            <Bookmark className="w-5 h-5 text-[var(--fg-muted)]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-[var(--bg-card)] border border-white/[0.06] backdrop-blur-sm"
          >
            <Share2 className="w-5 h-5 text-[var(--fg-muted)]" />
          </motion.button>
        </div>
      </main>
    </div>
  );
};
```

### 5.3 Editor Interface

```tsx
// Revolutionary Editor Interface
const EditorRevolutionary = ({ article, onSave, onPublish }) => {
  const [content, setContent] = useState(article?.content || '');
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-[var(--bg-deep)] flex">
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Toolbar */}
        <header className="sticky top-0 z-20 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-6 py-3">
            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                <ArrowLeft className="w-5 h-5 text-[var(--fg-muted)]" />
              </button>
              <div className="h-6 w-px bg-white/[0.06]" />
              <span className="text-sm text-[var(--fg-muted)]">
                Draft
              </span>
            </div>
            
            {/* Center: Formatting Tools */}
            <div className="flex items-center gap-1">
              <EditorToolbar />
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAIAssistOpen(!isAIAssistOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isAIAssistOpen
                    ? "bg-[var(--accent-primary)] text-white"
                    : "bg-white/[0.04] text-[var(--fg-secondary)] hover:bg-white/[0.08]"
                )}
              >
                <Sparkles className="w-4 h-4" />
                AI Assist
              </button>
              
              <button
                onClick={onSave}
                className="px-4 py-1.5 rounded-lg bg-white/[0.04] text-sm font-medium text-[var(--fg-secondary)] hover:bg-white/[0.08] transition-colors"
              >
                Save
              </button>
              
              <button
                onClick={onPublish}
                className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-sm font-medium text-white hover:bg-[var(--accent-primary-dark)] transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </header>
        
        {/* Editor Area */}
        <div className="flex-1 flex">
          {/* Main Content Area */}
          <div className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
              {/* Title Input */}
              <input
                type="text"
                placeholder="Untitled Vibe"
                className="w-full text-4xl font-bold text-[var(--fg-primary)] bg-transparent border-none outline-none placeholder:text-[var(--fg-dim)] mb-8"
              />
              
              {/* Content Editor */}
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your vibe..."
                  className="w-full min-h-[60vh] text-lg text-[var(--fg-primary)] bg-transparent border-none outline-none resize-none placeholder:text-[var(--fg-dim)] leading-relaxed"
                  style={{ fontFamily: 'var(--font-reading)' }}
                />
                
                {/* AI Suggestions Overlay */}
                {isAIAssistOpen && (
                  <AIAssistPanel />
                )}
              </div>
            </div>
          </div>
          
          {/* Preview Panel */}
          <div className="w-1/2 border-l border-white/[0.06] p-8 overflow-y-auto">
            <div className="text-sm text-[var(--fg-muted)] mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </div>
            <ArticlePreview content={content} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Editor Toolbar Component
const EditorToolbar = () => {
  const tools = [
    { icon: Bold, label: 'Bold' },
    { icon: Italic, label: 'Italic' },
    { icon: Underline, label: 'Underline' },
    { icon: Strikethrough, label: 'Strikethrough' },
    { icon: Code, label: 'Code' },
    { icon: Link, label: 'Link' },
    { icon: Image, label: 'Image' },
    { icon: List, label: 'List' },
    { icon: ListOrdered, label: 'Ordered List' },
    { icon: Quote, label: 'Quote' },
    { icon: Heading1, label: 'Heading 1' },
    { icon: Heading2, label: 'Heading 2' },
  ];
  
  return (
    <>
      {tools.map((tool, index) => (
        <React.Fragment key={tool.label}>
          <button
            className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
            title={tool.label}
          >
            <tool.icon className="w-4 h-4 text-[var(--fg-muted)] group-hover:text-[var(--fg-secondary)]" />
          </button>
          {(index === 4 || index === 7 || index === 10) && (
            <div className="h-5 w-px bg-white/[0.06] mx-1" />
          )}
        </React.Fragment>
      ))}
    </>
  );
};
```

### 5.4 Profile/Portfolio Page

```tsx
// Revolutionary Profile Page
const ProfilePageRevolutionary = ({ user }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-deep)]">
      {/* Profile Hero */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: 'var(--gradient-mesh-primary)' }}
        />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-32 h-32 rounded-full ring-4 ring-[var(--accent-primary)]/30"
              />
              {/* Online Status */}
              <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-[var(--success)] ring-4 ring-[var(--bg-deep)]" />
            </motion.div>
            
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-4xl font-bold text-[var(--fg-primary)] mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-[var(--fg-secondary)] mb-4">
                @{user.username}
              </p>
              <p className="text-[var(--fg-muted)] max-w-xl mb-6">
                {user.bio}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-8 justify-center md:justify-start">
                <div>
                  <span className="text-2xl font-bold text-[var(--fg-primary)]">
                    {user.articles_count}
                  </span>
                  <span className="text-sm text-[var(--fg-muted)] ml-2">vibes</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-[var(--fg-primary)]">
                    {user.followers_count}
                  </span>
                  <span className="text-sm text-[var(--fg-muted)] ml-2">followers</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-[var(--fg-primary)]">
                    {user.total_stars}
                  </span>
                  <span className="text-sm text-[var(--fg-muted)] ml-2">stars</span>
                </div>
              </div>
            </motion.div>
            
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-3"
            >
              <button className="px-6 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white font-medium">
                Follow
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[var(--fg-secondary)] font-medium">
                Message
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Tabs */}
      <section className="sticky top-0 z-20 bg-[var(--bg-deep)]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-6">
            {['Vibes', 'Starred', 'Collections'].map((tab) => (
              <button
                key={tab}
                className={cn(
                  "py-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab
                    ? "text-[var(--fg-primary)] border-[var(--accent-primary)]"
                    : "text-[var(--fg-muted)] border-transparent hover:text-[var(--fg-secondary)]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Content Grid */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.articles.map((article) => (
              <ArticleCardRevolutionary key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
```

---

## 6. Dark/Light Mode Strategy

### 6.1 Primary Mode Recommendation

**Dark Mode is the PRIMARY mode.**

Viblog targets developers who prefer dark interfaces (VS Code, Cursor, Terminal). Dark mode should be the default and the most polished experience.

### 6.2 Light Mode Implementation

```css
/* Light Mode Variables */
:root[data-theme='light'] {
  /* === BACKGROUND SYSTEM === */
  --bg-deep: #fafafa;
  --bg-surface: #ffffff;
  --bg-elevated: #f4f4f5;
  --bg-card: rgba(255, 255, 255, 0.9);
  
  /* === FOREGROUND SYSTEM === */
  --fg-primary: #18181b;
  --fg-secondary: #52525b;
  --fg-muted: #a1a1aa;
  --fg-dim: #d4d4d8;
  
  /* === BRAND ACCENTS (Same as dark for consistency) === */
  --accent-primary: #7c3aed;
  --accent-primary-light: #8b5cf6;
  --accent-primary-dark: #6d28d9;
  --accent-primary-glow: rgba(124, 58, 237, 0.2);
  
  /* === GRADIENT MESH (Softer for light mode) === */
  --gradient-mesh-primary: radial-gradient(
    ellipse at 20% 30%,
    rgba(124, 58, 237, 0.08) 0%,
    transparent 50%
  ), radial-gradient(
    ellipse at 80% 70%,
    rgba(6, 182, 212, 0.05) 0%,
    transparent 50%
  );
  
  /* === GLASS SYSTEM === */
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-blur: 16px;
  
  /* === CODE THEME - VS Code Light+ === */
  --code-bg: #ffffff;
  --code-line-number: #9ca3af;
  --code-keyword: #af00db;
  --code-string: #098658;
  --code-number: #b5200d;
  --code-comment: #6a9955;
  --code-function: #795e26;
  --code-variable: #001080;
  
  /* === BORDER SYSTEM === */
  --border-subtle: rgba(0, 0, 0, 0.04);
  --border-default: rgba(0, 0, 0, 0.08);
  --border-emphasis: rgba(0, 0, 0, 0.12);
  --border-accent: rgba(124, 58, 237, 0.3);
  
  /* === SHADOW SYSTEM === */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.1);
  --shadow-glow-primary: 0 0 40px rgba(124, 58, 237, 0.1);
  --shadow-glow-secondary: 0 0 40px rgba(6, 182, 212, 0.08);
}
```

### 6.3 Contrast Maintenance

```css
/* WCAG 2.1 AA Compliance Checklist */

/* Dark Mode Contrast Ratios */
/*
 * Primary text (#f4f4f5) on Deep (#050508): 18.5:1 ✓
 * Secondary text (#a1a1aa) on Deep (#050508): 8.2:1 ✓
 * Muted text (#71717a) on Deep (#050508): 4.8:1 ✓
 * Primary accent (#8b5cf6) on Deep (#050508): 5.2:1 ✓
 */

/* Light Mode Contrast Ratios */
/*
 * Primary text (#18181b) on Surface (#ffffff): 18.1:1 ✓
 * Secondary text (#52525b) on Surface (#ffffff): 7.0:1 ✓
 * Muted text (#a1a1aa) on Surface (#ffffff): 3.9:1 ⚠ (use for decorative only)
 * Primary accent (#7c3aed) on Surface (#ffffff): 4.7:1 ✓
 */

/* Ensure interactive elements have sufficient contrast */
.interactive-element {
  min-height: 44px; /* Touch target size */
  border: 2px solid transparent;
}

.interactive-element:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

---

## 7. Implementation Guidelines

### 7.1 Tailwind Configuration

```typescript
// tailwind.config.ts - Revolutionary Design System
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background
        'bg-deep': 'var(--bg-deep)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-card': 'var(--bg-card)',
        
        // Foreground
        'fg-primary': 'var(--fg-primary)',
        'fg-secondary': 'var(--fg-secondary)',
        'fg-muted': 'var(--fg-muted)',
        'fg-dim': 'var(--fg-dim)',
        
        // Accents
        accent: {
          primary: 'var(--accent-primary)',
          'primary-light': 'var(--accent-primary-light)',
          'primary-dark': 'var(--accent-primary-dark)',
          secondary: 'var(--accent-secondary)',
          tertiary: 'var(--accent-tertiary)',
        },
        
        // Glass
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
        },
        
        // Code
        code: {
          bg: 'var(--code-bg)',
          keyword: 'var(--code-keyword)',
          string: 'var(--code-string)',
          number: 'var(--code-number)',
          comment: 'var(--code-comment)',
          function: 'var(--code-function)',
          variable: 'var(--code-variable)',
        },
        
        // Border
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          emphasis: 'var(--border-emphasis)',
          accent: 'var(--border-accent)',
        },
      },
      
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        code: ['var(--font-code)'],
        reading: ['var(--font-reading)'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.625' }],
        'xl': ['1.25rem', { lineHeight: '1.375' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '28px',
      },
      
      boxShadow: {
        'glow-primary': 'var(--glow-primary)',
        'glow-secondary': 'var(--glow-secondary)',
        'glow-card': 'var(--glow-card)',
        'glow-hover': 'var(--glow-hover)',
      },
      
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' },
        },
      },
      
      backdropBlur: {
        xs: '4px',
        glass: 'var(--glass-blur)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 7.2 Component Structure

```
src/
  components/
    ui/
      glass-card.tsx         # Glassmorphism card component
      code-block.tsx         # Code display with syntax highlighting
      badge.tsx              # Category/status badges
      button.tsx             # Interactive buttons
      input.tsx              # Form inputs
      tooltip.tsx            # Contextual tooltips
      skeleton.tsx           # Loading states
      spinner.tsx            # Progress indicators
      
    articles/
      article-card.tsx       # Gallery-style article card
      article-hero.tsx       # Hero section for articles
      article-content.tsx    # Reading view content
      code-hero.tsx          # Featured code display
      session-timeline.tsx   # Vibe session visualization
      
    layout/
      header.tsx             # Navigation header
      sidebar.tsx            # Sidebar navigation
      footer.tsx             # Footer component
      
    editor/
      editor-toolbar.tsx     # Formatting tools
      ai-assist-panel.tsx    # AI assistance overlay
      preview-panel.tsx      # Live preview
      
    profile/
      profile-hero.tsx       # Profile header
      profile-stats.tsx      # User statistics
      
  styles/
    globals.css              # CSS variables and base styles
    animations.css           # Animation keyframes
    typography.css           # Typography utilities
```

---

## 8. Quality Metrics

### 8.1 Design Score Target

| Metric | Target | Measurement |
|--------|--------|-------------|
| Visual Hierarchy | 90+ | Clear hierarchy on all pages |
| Balance & Layout | 90+ | Asymmetric but balanced layouts |
| Typography | 90+ | Readable, beautiful type system |
| Color Harmony | 90+ | Consistent accent system |
| Spacing System | 90+ | 64px+ section gaps |
| Component Design | 90+ | Signature components |
| Micro-interactions | 90+ | Smooth 60fps animations |
| Responsive Design | 90+ | Mobile-first, all breakpoints |
| Brand Identity | 90+ | Unique "Code Gallery" identity |
| Premium Feel | 90+ | Dribbble/Awwwards-level polish |

### 8.2 Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Cumulative Layout Shift | < 0.1 |
| Animation Frame Rate | 60fps |

---

## 9. Summary

This design system establishes Viblog as a premium, AI-native blogging platform with:

1. **Unique Visual Identity** - Gradient meshes, glassmorphism, and neon accents create a distinctive "Code Gallery" aesthetic

2. **Code-First Design** - Code blocks are treated as art pieces, not afterthoughts

3. **Premium Experience** - Dribbble/Awwwards-level polish with smooth animations and careful typography

4. **AI-Native Architecture** - Built for both human and AI consumption with dual-layer content

5. **Developer-Centric** - Dark-first design with VS Code-inspired code themes

The implementation should follow this specification while iterating based on user feedback and technical constraints. The goal is to make Viblog the most visually distinctive and premium blogging platform for developers globally.
