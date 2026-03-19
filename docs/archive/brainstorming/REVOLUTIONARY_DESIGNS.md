# Revolutionary Homepage Designs

Three completely different design directions for Viblog, each exploring unique visual and interaction paradigms.

---

## Quick Access

| Design | URL | Style |
|--------|-----|-------|
| Code Gallery | http://localhost:3001/ | Immersive, Art Exhibition |
| Cyberpunk Terminal | http://localhost:3001/cyberpunk | Neon, Hacker, Futuristic |
| Editorial Magazine | http://localhost:3001/editorial | Typography, Premium Publication |

---

## Design Philosophy

All three designs share the same core values but express them differently:

### Viblog Core Values
- **Record** - Capture authentic vibe coding context
- **Share** - Transform experiences into beautiful content
- **Grow** - Build personal knowledge base

### "Code Gallery" Concept
Every article is an EXHIBITION PIECE, not just a blog post.

---

## Files Structure

```
src/app/(public)/
├── page.tsx              # Option 1: Code Gallery (default)
├── page-cyberpunk.tsx    # Option 2: Cyberpunk Terminal
├── page-editorial.tsx    # Option 3: Editorial Magazine
├── cyberpunk/
│   └── page.tsx          # Route: /cyberpunk
└── editorial/
    └── page.tsx          # Route: /editorial
```

---

## Design Comparison Matrix

| Aspect | Code Gallery | Cyberpunk | Editorial |
|--------|-------------|-----------|-----------|
| **Visual Impact** | High - Immersive | Very High - Bold | Medium - Elegant |
| **Typography** | Mixed (Display + Body) | Monospace Only | Serif + Sans |
| **Color Palette** | Gradient Mesh | Neon on Black | Subtle Accents |
| **Animation Style** | Smooth, Parallax | Glitch, Matrix | Subtle Fade |
| **Content Density** | Medium | High | Low |
| **Target Audience** | General Developers | Hacker Culture | Content Readers |
| **Mobile Experience** | Good | Moderate | Excellent |

---

## Technical Stack

All designs use:
- **Framer Motion** - Scroll animations, transitions
- **Tailwind CSS** - Utility-first styling
- **Design Tokens** - CSS custom properties from `design-system.css`

---

## How to Switch Default Design

```bash
# Make Cyberpunk the default
cd src/app/\(public\)
mv page.tsx page-gallery.tsx
mv page-cyberpunk.tsx page.tsx

# Make Editorial the default
mv page.tsx page-cyberpunk.tsx
mv page-editorial.tsx page.tsx
```

---

## Next Steps

1. Choose primary direction
2. Deepen selected design
3. Add real data integration
4. Implement responsive refinements
5. Add micro-interactions

---

**Created:** 2026-03-17
**Session:** Phase 1 Frontend Redesign