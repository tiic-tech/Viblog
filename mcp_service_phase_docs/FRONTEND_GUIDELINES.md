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

## 10. Key Design Principles (From Competitive Analysis)

### 10.1 Design Philosophy

> **"Treat every coding session as a masterpiece in the making - transforming developer experiences into gallery-worthy content through AI-native design."**

### 10.2 Core Principles

| Principle | Source Products | Key Metric | Priority |
|-----------|-----------------|------------|----------|
| AI-Native by Design | Claude Code, Notion, Cursor | <5% AI info loss | P0 |
| Content as Visual Art | Pinterest, Dribbble, Awwwards | >= 22/25 visual score | P0 |
| Code-First Reading | Medium, Notion, Cursor | >= 21/25 reading score | P0 |
| Effortless Flow | Claude Code, Notion, Pinterest | <5 min to publish | P0 |
| Dark-First, Always Polished | Cursor, Awwwards, Dribbble | WCAG 2.1 AA | P1 |
| Motion with Purpose | Pinterest, Dribbble, Awwwards | >= 60fps | P1 |
| Progressive Complexity | Notion, Medium, Awwwards | <30s to first action | P1 |

### 10.3 Principle Details

#### P0-1: AI-Native by Design

Every feature built assuming AI as a primary user. Content flows seamlessly between human and AI consumption.

**Evidence from Analysis:**
- Claude Code (23/25): MCP protocol enables seamless tool integration
- Notion (24/25): Block-based content for AI parsing
- Cursor (24/25): Session context capture and persistence

**Implementation:**
- Dual-layer content format (Markdown + JSON)
- MCP tools following Claude Code patterns
- Token estimates for AI consumption

#### P0-2: Content as Visual Art

Developer achievements deserve the same visual treatment as design portfolios. Every article card is a "shot" worthy of a gallery wall.

**Evidence from Analysis:**
- Pinterest (22/25): Masonry grid, image-centric cards
- Dribbble (22/25): Premium feel, 60-80px section gaps
- Awwwards (22/25): High-end typography

**Implementation:**
- Article cards with 12px border-radius, 4:3 aspect ratio
- Hover lift effect: `translateY(-4px)` + box-shadow
- Premium whitespace: 60px section gaps

#### P0-3: Code-First Reading Experience

Reading experiences optimized for developer content, where code blocks are first-class citizens.

**Evidence from Analysis:**
- Medium (21/25): 21px Georgia, 1.6 line-height, 680px max-width
- Notion (24/25): Block-based code with language labels
- Cursor (24/25): VS Code dark theme

**Implementation:**
- Prose: 21px Georgia, 1.6 line-height, 680px max-width
- Code: JetBrains Mono, 14px, VS Code dark background
- Reading progress indicator

#### P0-4: Effortless Flow from Code to Content

The path from coding session to published article should feel magical - minimal friction, maximum automation.

**Evidence from Analysis:**
- Claude Code (23/25): Session-based interaction model
- Notion (24/25): AI integration as dedicated nav item
- Pinterest (22/25): Collections/Boards organization

**Implementation:**
- Draft Bucket system for session-to-article transformation
- Human touch prompts at critical moments
- One-click publish with dual-layer format

---

## 11. AI-Data-Native UI Components (New - 2026-03-16)

### 11.1 Smart Markdown Editor

**Design Philosophy:** Minimalist interface with intelligent assistance

```tsx
// Editor Component Structure
const SmartMarkdownEditor = ({ article, onChange }) => (
  <div className="flex flex-col h-full">
    {/* Toolbar - Minimal */}
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Code className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Link className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Format
        </Button>
      </div>
    </div>

    {/* Editor Area */}
    <div className="flex-1 p-6">
      <textarea
        className="w-full h-full resize-none bg-transparent
                   text-foreground font-mono text-base leading-relaxed
                   focus:outline-none"
        placeholder="Start writing..."
        value={article.content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>

    {/* AI Suggestions Panel */}
    <div className="border-t border-border p-4 bg-background-secondary">
      <h4 className="text-sm font-medium text-foreground-muted mb-2">
        AI Suggestions
      </h4>
      <div className="flex gap-2 flex-wrap">
        {suggestions.map((s, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="cursor-pointer hover:bg-primary/20"
          >
            {s}
          </Badge>
        ))}
      </div>
    </div>
  </div>
)
```

**Typography for Editing:**
```css
.editor-textarea {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  line-height: 1.75;
  letter-spacing: 0.01em;
}
```

### 11.2 Annotation UI Design

**Design Philosophy:** Non-intrusive highlighting with elegant margin notes

```tsx
// Annotation Highlight Component
const AnnotationHighlight = ({ text, annotation, onClick }) => (
  <span
    className="relative cursor-pointer group"
    onClick={onClick}
  >
    {/* Highlighted text */}
    <span className="bg-primary/20 border-b-2 border-primary/50
                   transition-colors hover:bg-primary/30">
      {text}
    </span>

    {/* Annotation indicator */}
    <span className="absolute -top-1 -right-1 w-2 h-2
                   bg-primary rounded-full
                   group-hover:scale-125 transition-transform" />
  </span>
)

// Annotation Sidebar Component
const AnnotationSidebar = ({ annotations, activeId }) => (
  <div className="w-80 border-l border-border p-4
                bg-background-secondary overflow-y-auto">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Annotations</h3>
      <Badge variant="secondary">{annotations.length}</Badge>
    </div>

    <div className="space-y-4">
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className={cn(
            "p-3 rounded-lg border transition-colors",
            activeId === annotation.id
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          )}
        >
          {/* Quoted text */}
          <p className="text-sm text-foreground-muted italic mb-2">
            "{annotation.selected_text}"
          </p>

          {/* Annotation content */}
          <p className="text-sm text-foreground mb-2">
            {annotation.content}
          </p>

          {/* Author and timestamp */}
          <div className="flex items-center gap-2 text-xs text-foreground-dim">
            <Avatar src={annotation.author.avatar} size="xs" />
            <span>@{annotation.author.username}</span>
            <span>•</span>
            <span>{formatTimeAgo(annotation.created_at)}</span>
          </div>

          {/* Reply count */}
          {annotation.discussion?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" className="text-xs">
                {annotation.discussion.length} replies
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)

// Annotation Creation Modal
const AnnotationModal = ({ isOpen, onClose, selectedText, onSubmit }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Add Annotation</DialogTitle>
      </DialogHeader>

      {/* Selected text preview */}
      <div className="p-3 bg-background-tertiary rounded-lg">
        <p className="text-sm italic text-foreground-muted">
          "{selectedText}"
        </p>
      </div>

      {/* Annotation input */}
      <textarea
        className="w-full h-32 p-3 bg-background rounded-lg border
                 border-border focus:border-primary focus:outline-none
                 text-foreground resize-none"
        placeholder="Write your thoughts..."
      />

      {/* Privacy toggle */}
      <div className="flex items-center gap-2">
        <Switch id="public" defaultChecked />
        <Label htmlFor="public" className="text-sm">
          Public annotation
        </Label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Save Annotation
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
```

**Annotation Color Palette:**
```css
:root {
  --annotation-highlight: rgba(99, 102, 241, 0.2);    /* Primary indigo */
  --annotation-underline: rgba(99, 102, 241, 0.5);
  --annotation-hover: rgba(99, 102, 241, 0.3);
}
```

### 11.3 Authorization Settings UI

**Design Philosophy:** Clear trade-offs with easy toggles

```tsx
// Authorization Settings Page
const AuthorizationSettings = () => (
  <div className="max-w-2xl mx-auto p-6 space-y-8">
    {/* Header */}
    <div>
      <h1 className="text-2xl font-bold">AI Data Access</h1>
      <p className="text-foreground-muted mt-1">
        Control what data AI tools can access
      </p>
    </div>

    {/* Data Source Toggles */}
    <Card>
      <CardHeader>
        <CardTitle>Data Sources</CardTitle>
        <CardDescription>
          Grant access to your private data for enhanced AI features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {datasources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between p-4
                     rounded-lg border border-border hover:border-primary/50
                     transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                source.authorized
                  ? "bg-primary/20 text-primary"
                  : "bg-background-tertiary text-foreground-muted"
              )}>
                {source.icon}
              </div>
              <div>
                <h4 className="font-medium">{source.name}</h4>
                <p className="text-sm text-foreground-muted">
                  {source.description}
                </p>
              </div>
            </div>
            <Switch
              checked={source.authorized}
              onCheckedChange={(checked) => toggleSource(source.id, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Privacy Level */}
    <Card>
      <CardHeader>
        <CardTitle>Privacy Level</CardTitle>
        <CardDescription>
          Choose how much detail AI can see
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={privacyLevel} onValueChange={setPrivacyLevel}>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg border
                          border-border hover:border-primary/50 cursor-pointer
                          data-[state=checked]:border-primary">
              <RadioGroupItem value="1" id="level1" />
              <div className="flex-1">
                <Label htmlFor="level1" className="font-medium cursor-pointer">
                  Sensitive fields desensitized
                </Label>
                <p className="text-sm text-foreground-muted">
                  Email, phone numbers, and other PII are masked
                </p>
                <Badge variant="secondary" className="mt-2">Recommended</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border
                          border-border hover:border-primary/50 cursor-pointer">
              <RadioGroupItem value="2" id="level2" />
              <div className="flex-1">
                <Label htmlFor="level2" className="font-medium cursor-pointer">
                  Fully transparent
                </Label>
                <p className="text-sm text-foreground-muted">
                  AI can access all raw data
                </p>
                <Badge variant="warning" className="mt-2">⚠️ Risk warning</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border
                          border-border hover:border-primary/50 cursor-pointer">
              <RadioGroupItem value="3" id="level3" />
              <div className="flex-1">
                <Label htmlFor="level3" className="font-medium cursor-pointer">
                  Training authorization
                </Label>
                <p className="text-sm text-foreground-muted">
                  Data can be used to train Viblog models
                </p>
                <Badge variant="success" className="mt-2">+50 credits/month</Badge>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>

    {/* Token Management */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Access Tokens</CardTitle>
          <CardDescription>
            Tokens used by MCP tools to access your data
          </CardDescription>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Token
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-mono">
                  vb_{token.prefix}••••••••••••••••
                </TableCell>
                <TableCell>{formatDate(token.created_at)}</TableCell>
                <TableCell>{formatTimeAgo(token.last_used_at)}</TableCell>
                <TableCell>
                  <Badge variant={token.is_active ? "success" : "secondary"}>
                    {token.is_active ? "Active" : "Revoked"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
)
```

### 11.4 Credits Dashboard UI

```tsx
// Credits Dashboard Component
const CreditsDashboard = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-6">
    {/* Balance Card */}
    <Card className="bg-gradient-to-r from-primary/20 to-accent/20">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground-muted">Your Balance</p>
            <h2 className="text-5xl font-bold mt-2">
              {balance.toLocaleString()}
              <span className="text-lg font-normal text-foreground-muted ml-2">
                credits
              </span>
            </h2>
          </div>
          <Button size="lg">
            Redeem Credits
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <p className="text-2xl font-semibold">{totalEarned}</p>
            <p className="text-sm text-foreground-muted">Total Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold">{totalSpent}</p>
            <p className="text-sm text-foreground-muted">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold">{redeemable}</p>
            <p className="text-sm text-foreground-muted">Redeemable Months</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Earning Opportunities */}
    <Card>
      <CardHeader>
        <CardTitle>Earning Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="flex items-center justify-between p-4
                       rounded-lg border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-success/20
                              flex items-center justify-center">
                  {opp.icon}
                </div>
                <div>
                  <h4 className="font-medium">{opp.title}</h4>
                  <p className="text-sm text-foreground-muted">
                    {opp.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-success">
                  +{opp.credits}
                </p>
                <p className="text-xs text-foreground-muted">credits/month</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Transaction History */}
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{formatDate(tx.created_at)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{tx.type}</Badge>
                </TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell className={cn(
                  "text-right font-mono",
                  tx.amount > 0 ? "text-success" : "text-foreground"
                )}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
)
```

---

## 12. Implementation Checklist

- [ ] Article cards with Pinterest-style hover effects
- [ ] Reading typography matching Medium standards
- [ ] Code blocks with VS Code dark theme
- [ ] Progress indicator for article reading
- [ ] Token estimate display for AI consumers
- [ ] Dark mode as primary, light mode equally polished

---

---

**Document Version:** 4.0
**Last Updated:** 2026-03-16
**Author:** Viblog Team
**Key Design Principles:** From 7-product competitive analysis (avg score 22.7/25)
**Key Updates:** Added AI-Data-Native UI components (Smart Markdown Editor, Annotations, Authorization Settings, Credits Dashboard)