# Prompt Engineering: Revolutionary Homepage Designs

This document captures the engineering prompts that can recreate each homepage design. Use these as templates for future design explorations.

---

## Prompt Template Structure

Each prompt follows this structure:
1. **Design Philosophy** - Core concept and emotional goal
2. **Visual Language** - Colors, typography, spacing
3. **Layout Architecture** - Component structure and hierarchy
4. **Interaction Patterns** - Animations, hover states, transitions
5. **Technical Constraints** - Framework, libraries, patterns

---

## Option 1: Code Gallery (Immersive Exhibition)

### Master Prompt

```
## Task: Create Revolutionary Homepage - "Code Gallery"

Design a COMPLETELY NEW homepage with an **Immersive Art Exhibition** aesthetic.

### Design Philosophy
- Every article is a "masterpiece" in a gallery, not just content
- Think: walking through a modern art museum
- Dark, atmospheric, premium
- Code is VISUAL ART, not just text
- Scroll should feel like a JOURNEY through an exhibition

### Visual Language
- **Background**: Deep space black (#050508) with gradient mesh overlays
- **Primary Accent**: Electric Violet (#8b5cf6)
- **Secondary Accent**: Cyan (#06b6d4)
- **Tertiary Accent**: Rose (#f43f5e)
- **Glass Effects**: backdrop-blur with rgba(18, 18, 26, 0.7)
- **Glow Effects**: Soft violet/cyan glows on hover

### Typography
- **Display**: Outfit - Bold, geometric sans-serif for hero titles (up to 9xl)
- **Body**: Inter - Clean, readable for content
- **Code**: JetBrains Mono - All code snippets

### Layout Architecture
1. **Hero Section** (100vh)
   - Full-screen centered content
   - Pre-title badge with pulsing dot
   - Massive gradient title: "Where Code Meets Art"
   - Two CTA buttons with glow effects
   - Scroll indicator at bottom

2. **Journey Timeline** (staggered)
   - Three steps: Record, Share, Grow
   - Alternating left/right layout
   - Vertical gradient line connecting steps
   - Icon + description for each

3. **Exhibition Gallery**
   - Asymmetric masonry grid
   - First article: 2x2 size (featured)
   - Glass-morphism cards with gradient overlays
   - Platform-colored badges
   - Hover: scale, glow, content reveal

4. **Code Art Showcase**
   - Terminal-style window (macOS dots)
   - Syntax-highlighted code as visual art
   - Background glow effect

5. **CTA Section**
   - Glassmorphism card
   - Multi-color gradient glow behind
   - Two action buttons

### Interaction Patterns
- **Mouse Tracking**: Subtle spotlight follows cursor (600px radius)
- **Floating Particles**: Code snippets float in background with animation
- **Parallax**: Hero section moves on scroll (y: -200px)
- **Scroll Progress**: Animated bar at top (spring animation)
- **Card Hover**: Scale 1.02, translateY -8px, glow effect
- **Staggered Reveals**: Cards animate in sequence (0.1s delay each)

### Key Components
```tsx
// Floating Code Particles
{floatingCodeSnippets.map((snippet, index) => (
  <motion.code
    animate={{
      opacity: [0.1, 0.3, 0.1],
      y: [0, -30, 0],
    }}
    transition={{ duration: 8 + index, repeat: Infinity }}
  />
))}

// Cursor Spotlight
<div style={{
  background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(139, 92, 246, 0.06), transparent 40%)`
}} />

// Asymmetric Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {articles.map((article, index) => (
    <div className={index === 0 ? 'md:col-span-2 md:row-span-2' : ''} />
  ))}
</div>
```

### Emotional Goal
Visitors should feel like they've entered a premium digital gallery where code is celebrated as art. The experience should be memorable and share-worthy.

---

## Option 2: Cyberpunk Terminal

### Master Prompt

```
## Task: Create Revolutionary Homepage - "Cyberpunk Terminal"

Design a COMPLETELY NEW homepage with a **Cyberpunk / Hacker / Terminal** aesthetic.

### Design Philosophy
- Bold, neon, futuristic
- Think: Cyberpunk 2077 meets The Matrix
- Code is KING - everything looks like a terminal
- Dark, immersive, intense
- Embrace the "hacker" identity

### Visual Language
- **Background**: Pure black with animated effects
- **Matrix Rain**: Green/violet characters falling
- **Neon Grid**: Perspective grid lines (violet/cyan)
- **Scanlines**: CRT monitor overlay effect
- **Glitch Effects**: Text glitch on key elements
- **All Neon Colors**: Violet, Cyan, Rose with high saturation

### Typography
- **Monospace ONLY**: JetBrains Mono or similar
- **Uppercase**: Key labels and badges
- **Terminal Style**: $ > prefix for commands

### Layout Architecture
1. **Terminal Hero**
   - Terminal window with macOS dots
   - Typing animation with commands
   - Commands cycle automatically
   - Glitch text effect on main title
   - Neon-bordered CTA buttons

2. **File System Grid**
   - Cards look like file system entries
   - Titles prefixed: SYSTEM://, EXEC://, DATA://
   - Meta info styled like terminal output
   - Minimal padding, high information density

3. **Stats Section**
   - Large monospace numbers
   - Labels as comments: // SESSIONS, // CODERS

4. **CTA**
   - Terminal command style
   - Glitch effect on hover

### Interaction Patterns
- **Matrix Rain**: Canvas animation with Japanese characters + numbers
- **Typing Animation**: Character-by-character reveal at 80ms delay
- **Glitch Effect**: Duplicate text with clip-path and color shift
- **Scanlines**: Fixed overlay with repeating gradient
- **Command Cycling**: Auto-rotate commands every 4 seconds

### Key Components
```tsx
// Matrix Rain Canvas
const draw = () => {
  ctx.fillStyle = 'rgba(5, 5, 8, 0.05)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = Math.random() > 0.98 ? '#06b6d4' : '#8b5cf640'
  ctx.fillText(char, x, y)
}

// Glitch Text
<span className="relative">
  <span className="relative z-10">{text}</span>
  <span className="absolute" style={{ clipPath: 'inset(0 0 50% 0)', transform: 'translate(-2px, 0)', color: '#22d3ee' }}>{text}</span>
  <span className="absolute" style={{ clipPath: 'inset(50% 0 0 0)', transform: 'translate(2px, 0)', color: '#fb7185' }}>{text}</span>
</span>

// Terminal Typing
function TypeWriter({ text, delay = 80 }) {
  const [displayText, setDisplayText] = useState('')
  // Character-by-character reveal
  return <span>{displayText}<span className="animate-pulse">_</span></span>
}
```

### Emotional Goal
Visitors should feel like they've entered a futuristic hacker den. The design should appeal to developers who embrace the "cyberpunk" identity and want their tools to feel powerful and cutting-edge.

---

## Option 3: Editorial Magazine

### Master Prompt

```
## Task: Create Revolutionary Homepage - "Editorial Magazine"

Design a COMPLETELY NEW homepage with a **Premium Publication / Magazine** aesthetic.

### Design Philosophy
- Typography-first, content-focused
- Think: Medium, The Outline, Kinfolk Magazine
- Beautiful reading experience
- Editorial layouts with generous whitespace
- Premium, sophisticated, elegant
- Content is HERO

### Visual Language
- **Background**: Dark but with subtle warmth
- **Accents**: Used sparingly for emphasis only
- **Whitespace**: Generous padding and margins
- **Lines**: Subtle dividers and section breaks
- **No flashy effects**: Elegance over impact

### Typography
- **Headlines**: Georgia (serif) - 5xl to 7xl, normal weight
- **Body**: Georgia (serif) - lg to xl, relaxed line-height
- **UI Labels**: Inter (sans) - small, uppercase, tracking-wide
- **Code**: JetBrains Mono - only where needed

### Layout Architecture
1. **Editorial Hero**
   - Large featured article
   - Gradient overlay on background
   - Serif title (up to 7xl)
   - Reading time prominent
   - Author info with avatar

2. **Pull Quotes**
   - Large italic text (up to 4xl)
   - Centered with decorative lines
   - Attribution below

3. **Article Grid**
   - Magazine-style layout
   - Featured articles larger
   - Standard grid for rest
   - Numbered sidebar option

4. **Section Headers**
   - Decorative line above
   - Bold title
   - Subtitle in serif
   - Subtle line below

5. **Newsletter CTA**
   - Glassmorphism card
   - Simple email input
   - Minimal design

6. **Footer**
   - Organized links
   - Newsletter reminder
   - Social icons

### Interaction Patterns
- **Fade In**: Simple opacity + y translation on scroll
- **Hover**: Subtle color change, no dramatic effects
- **Stagger**: 0.08s delay between cards
- **Transitions**: Smooth 0.3s ease

### Key Components
```tsx
// Serif Typography
<h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
  {title}
</h1>

// Pull Quote
<blockquote className="py-12 text-center">
  <p className="text-3xl italic" style={{ fontFamily: 'Georgia, serif' }}>
    "{quote}"
  </p>
  <cite className="text-lg text-fg-secondary">{author}</cite>
</blockquote>

// Section Header
<div className="mb-12 text-center">
  <div className="w-12 h-px bg-gradient-to-r from-transparent via-accent-primary to-transparent mx-auto mb-4" />
  <h2 className="font-display text-4xl">{title}</h2>
  <p style={{ fontFamily: 'Georgia, serif' }}>{subtitle}</p>
</div>
```

### Emotional Goal
Visitors should feel like they've opened a premium magazine. The design should invite reading and make content feel valuable. Less "wow factor", more "I want to read this".

---

## Prompt Variables

When customizing these prompts, adjust:

| Variable | Description | Examples |
|----------|-------------|----------|
| `BACKGROUND` | Base background color | `#050508`, `#000000`, `#0a0a0f` |
| `PRIMARY_ACCENT` | Main brand color | `#8b5cf6` (violet), `#10b981` (green) |
| `FONT_DISPLAY` | Hero/headline font | Outfit, Inter, Georgia |
| `FONT_BODY` | Content font | Inter, Georgia, system-ui |
| `ANIMATION_SPEED` | Transition duration | `0.3s` (fast), `0.5s` (medium), `0.8s` (slow) |
| `CARD_VARIANT` | Card style | glass, flat, bordered, elevated |
| `GRID_TYPE` | Layout pattern | masonry, symmetric, editorial |

---

## Combining Designs

To merge elements from different designs:

```
Take the TYPOGRAPHY from Editorial (serif, elegant)
Add the ANIMATIONS from Code Gallery (parallax, particles)
Use the COLOR PALETTE from Cyberpunk (neon, high contrast)
Apply the LAYOUT from Code Gallery (asymmetric masonry)
```

---

## Testing Checklist

For each design, verify:
- [ ] Hero loads within 2 seconds
- [ ] Animations don't cause jank (60fps)
- [ ] Text is readable on all backgrounds
- [ ] Hover states work on touch devices
- [ ] Reduced motion preference respected
- [ ] No horizontal scroll on mobile

---

**Document Purpose:** Enable consistent recreation and iteration of revolutionary homepage designs.

**Created:** 2026-03-17
**Author:** Claude (Prompt Engineering Perspective)