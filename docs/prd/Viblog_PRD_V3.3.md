# Viblog PRD V3.3

**Version:** 3.3 | **Status:** Draft
**Owner:** CAO | **Updated:** 2026-03-20

---

## 1. Problem Definition

### Background
- **Industry Context:** Vibe Coding (AI-assisted development) is mainstream. Developers spend 4-8 hours daily in Claude Code, Cursor, Copilot sessions.
- **Current Reality:** When a developer finishes a project, they have:
  - Code on GitHub (shows what they built)
  - Commits history (shows when they worked)
  - **But no proof of HOW they worked with AI**
- **The Gap:** No way to prove Vibe Coding proficiency.

### Core Problem Statement
> Vibe Coders **cannot prove their AI collaboration capability**, because **session data is ephemeral, efficiency metrics don't exist, and no standardized verification system exists**.

### Problem Decomposition

| Type | Gap | Impact | Viblog Solution |
|------|-----|--------|-----------------|
| **Proof Gap** | No way to prove AI collaboration skill | Cannot demonstrate capability to employers/investors | Verified Dashboard |
| **Visibility Gap** | Session data lost after completion | Cannot show development process | Session Timeline |
| **Quantification Gap** | No standardized efficiency metrics | Cannot compare or benchmark | Efficiency Metrics |
| **Credibility Gap** | Self-reported claims are not trusted | Claims like "I built this in 3 hours" are unverifiable | Cryptographic Proof |

### Target User Persona

**Primary:** Vibe Coders who need to prove their capability

| Segment | Need | Viblog Value |
|---------|------|--------------|
| Job Seekers | Demonstrate AI proficiency | Verified Dashboard + Portfolio |
| Freelancers | Win projects with proven speed | Project Timeline + Metrics |
| Founders | Show execution capability to investors | Product Showcase |
| Content Creators | Build credibility in AI-native dev | Public Profile |

**Secondary:** People who evaluate Vibe Coders

| Segment | Need | Viblog Value |
|---------|------|--------------|
| Employers | Verify candidate claims | Verifiable Dashboard |
| Investors | Assess execution capability | Product Timeline |
| Clients | Evaluate freelancer efficiency | Historical Metrics |

---

## 2. Product Strategy

### Positioning

| Element | Definition |
|---------|------------|
| Product Type | **Verified Capability Profile for Vibe Coders** |
| One-Liner | **Viblog - Your Vibe Coding Capability Archive** |
| Core Value | Make your AI collaboration capability **visible, verifiable, provable** |
| Not | Knowledge management platform, blog platform, community |

### What Viblog Is NOT

| Not This | Because |
|----------|---------|
| Knowledge Management | That's Obsidian/Notion |
| Blog Platform | That's Medium/Substack |
| Code Hosting | That's GitHub |
| Community Platform | That's Discord/Reddit |
| Learning Platform | That's Coursera/Udemy |

**Viblog is a verification tool. It proves. It doesn't manage, host, or teach.**

### Competitive Landscape

| Product | Shows | Missing | Viblog Fills |
|---------|-------|---------|--------------|
| GitHub | Code, commits | HOW you coded | AI collaboration process |
| LinkedIn | Work history | Real capability | Verified efficiency metrics |
| Portfolio | End results | Development journey | Session timeline |
| Resume | Claims | Proof | Cryptographic verification |

### Value Proposition

```
┌─────────────────────────────────────────────────────────────────────┐
│   VALUE CHAIN                                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Before Viblog:                                                    │
│   "I'm good at Vibe Coding" → No proof → No trust                  │
│                                                                     │
│   With Viblog:                                                      │
│   "I'm good at Vibe Coding" →                                       │
│   → Viblog Profile (verified data) →                               │
│   → Trust → Opportunity                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Features

### Feature Matrix

| Feature | Priority | Purpose | User Value |
|---------|----------|---------|------------|
| MCP Session Sync | P0 | Data collection | Zero-effort recording |
| Efficiency Dashboard | P0 | Quantification | Prove capability |
| Public Profile | P0 | Visibility | Share with one link |
| Session Timeline | P0 | Process showcase | Show the journey |
| Product Showcase | P1 | Outcome display | What you built |
| Article Generation | P1 | Insight sharing | Thought leadership |
| Verification Badge | P2 | Credibility | Third-party trust |

### Core Loop

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG CORE LOOP                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Vibe Coding]                                                     │
│        │                                                            │
│        ▼                                                            │
│   [MCP Auto-Sync] ──► Session Storage                              │
│        │                                                            │
│        ▼                                                            │
│   [Metrics Calculation]                                             │
│   ├── Time efficiency                                               │
│   ├── Token efficiency                                              │
│   ├── Iteration count                                               │
│   └── Agent stack usage                                             │
│        │                                                            │
│        ▼                                                            │
│   [Profile Generation]                                              │
│   ├── Dashboard (numbers)                                           │
│   ├── Timeline (journey)                                            │
│   └── Products (outcomes)                                           │
│        │                                                            │
│        ▼                                                            │
│   [Share] ──► One Link to Prove Everything                         │
│        │                                                            │
│        ▼                                                            │
│   [Opportunity] ──► Job/Project/Investment                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Feature Specifications

### 4.1 MCP Session Sync (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | Automatic, on session activity |
| Input | Session fragments from Claude Code, Cursor, Windsurf |
| Processing | OpenAI-format storage, metrics extraction |
| Output | Stored session + calculated metrics |
| User Action | None required (fully automatic) |

**What Gets Recorded:**

| Data | Purpose |
|------|---------|
| Timestamps | Time tracking |
| Token usage | Efficiency calculation |
| Tool calls | Agent stack analysis |
| Code changes | Product tracking |
| Iterations | Quality metrics |

### 4.2 Efficiency Dashboard (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User views profile |
| Input | Aggregated session data |
| Processing | Calculate metrics, compare benchmarks |
| Output | Visual dashboard with key numbers |

**Core Metrics:**

| Metric | Definition | Benchmark |
|--------|------------|-----------|
| **Velocity** | Features per week | Industry avg: 2-3 |
| **Efficiency** | Time to completion vs complexity | Lower is better |
| **Token Economy** | Output tokens / Input tokens | Higher is better |
| **Iteration Ratio** | Changes / Initial output | Lower is better |
| **Cache Efficiency** | Cached tokens / Total input | Higher is better |

**Dashboard Mockup:**

```
┌─────────────────────────────────────────────────────────────────────┐
│   YOUR VIBE CODING DASHBOARD                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  VELOCITY                                      Top 15%       │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  4.2 features/week  ████████████████░░░░░  Industry: 2.8   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  EFFICIENCY                                    Top 10%       │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  Avg: 2.3h/feature  ████████████████████░░  Industry: 4.1h │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  TOKEN ECONOMY                                 Top 20%       │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  Output/Input: 0.42  ██████████████░░░░░░░  Industry: 0.31 │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  AGENT STACK                                                │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  Primary: Claude Code ████████████████████ 92%             │  │
│   │  Secondary: Cursor    ████████░░░░░░░░░░░░ 35%             │  │
│   │                                                             │  │
│   │  Agents Used: CAO, CTO, CUIO, architect, planner            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  CUMULATIVE                                                 │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  127 sessions · 2,340 hours · 45M tokens · 89 products      │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Public Profile (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User shares profile link |
| Input | User's public data settings |
| Processing | Generate public view |
| Output | Shareable profile page |

**Profile URL:** `viblog.dev/@username` or `username.viblog.dev`

**Profile Mockup:**

```
┌─────────────────────────────────────────────────────────────────────┐
│   @username                                                         │
│   Vibe Coder · AI-Native Developer                                  │
│   viblog.dev/@username                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  VERIFIED METRICS                                            │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  127 sessions  │  2,340 hours  │  45M tokens  │  89 products │  │
│   │                                                             │  │
│   │  Efficiency: Top 10%  │  Velocity: Top 15%                  │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  TECH STACK                                                  │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  TypeScript · Next.js · React · Supabase · Claude Code      │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  PRODUCTS                                                    │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │                                                             │  │
│   │  ┌───────────┐  ┌───────────┐  ┌───────────┐              │  │
│   │  │ Viblog    │  │ App #2    │  │ App #3    │              │  │
│   │  │ ───────── │  │ ───────── │  │ ───────── │              │  │
│   │  │ 127h      │  │ 45h       │  │ 23h       │              │  │
│   │  │ 18 iter.  │  │ 12 iter.  │  │ 8 iter.   │              │  │
│   │  │ Live →    │  │ MVP       │  │ Draft     │              │  │
│   │  └───────────┘  └───────────┘  └───────────┘              │  │
│   │                                                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  RECENT ACTIVITY                                             │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  2026-03-20 · Completed Viblog PRD V3.3                     │  │
│   │  2026-03-19 · Shipped MCP publish_article                   │  │
│   │  2026-03-18 · Fixed session fragment alignment              │  │
│   │  ...                                                       │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  VERIFIED BY VIBLOG ✓                                        │  │
│   │  Data integrity verified on 2026-03-20                      │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.4 Session Timeline (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User views session history |
| Input | Stored sessions |
| Processing | Group by project/product |
| Output | Visual timeline |

**Timeline Mockup:**

```
┌─────────────────────────────────────────────────────────────────────┐
│   DEVELOPMENT TIMELINE                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   2026-03-20                                                        │
│   ├── 09:00 ──► Started Viblog PRD V3.3                            │
│   │           Agent: CAO, planner                                   │
│   │           Tokens: 125K in, 45K out                              │
│   │                                                                 │
│   ├── 14:30 ──► Completed PRD draft                                 │
│   │           Iterations: 3                                         │
│   │           Duration: 5.5h                                        │
│   │                                                                 │
│   └── 16:00 ──► Published to Profile                                │
│                                                                     │
│   2026-03-19                                                        │
│   ├── 10:00 ──► Implemented publish_article MCP tool               │
│   │           Agent: CTO, code-reviewer                             │
│   │           Tokens: 89K in, 32K out                               │
│   │                                                                 │
│   └── 15:00 ──► Tests passing (203/203)                            │
│               Duration: 5h                                          │
│                                                                     │
│   ...                                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.5 Product Showcase (P1)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User links sessions to a product |
| Input | Session group + product metadata |
| Processing | Aggregate metrics, generate card |
| Output | Product showcase card |

**Product Card Data:**

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  status: 'idea' | 'draft' | 'mvp' | 'live';

  // Aggregated from sessions
  total_hours: number;
  total_sessions: number;
  total_iterations: number;
  total_tokens: { input: number; output: number };

  // Links
  github_url?: string;
  live_url?: string;

  // Timeline
  started_at: string;
  last_updated: string;
}
```

### 4.6 Article Generation (P1)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User requests article from session |
| Input | Session ID or Product ID |
| Processing | LLM generates structured article |
| Output | Markdown article |

**Purpose:** Thought leadership content for profile visitors.

**Note:** This is secondary. The core is the Dashboard and Profile. Article is a nice-to-have for content creators.

### 4.7 Verification Badge (P2)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User requests verification |
| Input | Profile data + external proof |
| Processing | Third-party verification process |
| Output | Verified badge on profile |

**Verification Types:**

| Type | Proof Required |
|------|---------------|
| GitHub Connected | OAuth verification |
| Domain Verified | DNS verification |
| Employer Verified | Work email verification |
| Metrics Verified | Cryptographic hash of session data |

---

## 5. Data Model

### Core Entities

| Entity | Purpose | Visibility |
|--------|---------|------------|
| `user` | Account | Private (L3) |
| `vibe_session` | Session container | Private (L2) |
| `session_fragment` | OpenAI-format messages | Private (L2) |
| `product` | Session group | User choice (L0/L1) |
| `profile` | Public profile data | Public (L0) |
| `metrics_cache` | Calculated metrics | Private (L2) |

### Session Fragment Schema (OpenAI-Aligned)

```typescript
interface SessionFragment {
  id: string;
  session_id: string;

  // OpenAI-compatible
  role: 'user' | 'assistant' | 'tool' | 'developer' | 'system';
  content: ContentBlock[];
  tool_calls?: ToolCall[];

  // Metadata
  metadata: {
    timestamp: string;
    message_id?: string;
    tokens?: TokenCount;
  };

  created_at: string;
}
```

### Metrics Cache Schema

```typescript
interface MetricsCache {
  user_id: string;

  // Aggregated metrics
  total_sessions: number;
  total_hours: number;
  total_tokens_input: number;
  total_tokens_output: number;
  total_products: number;

  // Calculated metrics
  avg_velocity: number;          // features/week
  avg_efficiency: number;        // hours/feature
  token_economy: number;         // output/input ratio
  iteration_ratio: number;       // changes/initial
  cache_efficiency: number;      // cached/total

  // Percentile rankings
  velocity_percentile: number;
  efficiency_percentile: number;
  economy_percentile: number;

  // Updated timestamp
  calculated_at: string;
}
```

### Product Schema

```typescript
interface Product {
  id: string;
  user_id: string;

  name: string;
  description: string;
  status: 'idea' | 'draft' | 'mvp' | 'live';

  // Aggregated from sessions
  session_ids: string[];
  total_hours: number;
  total_iterations: number;
  total_tokens_input: number;
  total_tokens_output: number;

  // External links
  github_url?: string;
  live_url?: string;

  // Timestamps
  started_at: string;
  last_updated: string;
  created_at: string;
}
```

---

## 6. Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG ARCHITECTURE                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Claude Code / Cursor / Windsurf]                                 │
│            │                                                        │
│            ▼                                                        │
│   ┌─────────────────┐                                               │
│   │ MCP Server      │  Session sync, OpenAI format conversion      │
│   │ (viblog-mcp)    │                                               │
│   └────────┬────────┘                                               │
│            │                                                        │
│            ▼                                                        │
│   ┌─────────────────┐                                               │
│   │ API Layer       │  Session CRUD, Metrics calculation           │
│   │ (Next.js)       │  Profile generation                          │
│   └────────┬────────┘                                               │
│            │                                                        │
│            ▼                                                        │
│   ┌─────────────────┐                                               │
│   │ Supabase        │  vibe_session, session_fragments             │
│   │                 │  products, metrics_cache                      │
│   └─────────────────┘                                               │
│                                                                     │
│   ┌─────────────────┐                                               │
│   │ Profile View    │  Public profile pages                        │
│   │ (Next.js SSR)   │  SEO optimized                               │
│   └─────────────────┘                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| MCP Server | TypeScript | Session sync |
| API Layer | Next.js App Router | CRUD operations |
| Database | Supabase (PostgreSQL) | Data storage |
| Cache | Supabase (calculated column) | Metrics |
| Profile View | Next.js SSR | Public profiles |

---

## 7. Success Metrics

### Product Success (Not Business)

| Metric | Target | Why |
|--------|--------|-----|
| Active Users (You) | 1 (you) | First user is the target |
| Sessions Synced | 100+ | Proof of usage |
| Profile Views | 50+ | Proof of value |
| Opportunities | 1+ | Job offer, project, investment interest |

### Metric Quality

| Metric | Target | Why |
|--------|--------|-----|
| Sync Success Rate | 99% | Reliability |
| Metrics Accuracy | 95%+ | Trustworthiness |
| Profile Load Time | <1s | User experience |

---

## 8. What We Cut

### Removed from V3.2

| Feature | Why Removed |
|---------|-------------|
| Canvas Editor | Over-engineered, Markdown sufficient |
| Decision Graph | Nice-to-have, not core to proving capability |
| Community Feed | Not needed for personal archive |
| Subscription System | Open source, no need to charge |
| Dual-Layer Publishing | Simplified to single Markdown output |

### Simplified

| V3.2 Feature | V3.3 Feature |
|--------------|--------------|
| Canvas + Markdown | Markdown only |
| Decision Graph extraction | Simple metrics calculation |
| Community platform | Personal profile only |
| BYOK + Subscription | BYOK only |

---

## 9. Implementation Roadmap

### Phase 0: Foundation (1 week)
- [ ] Database schema update
- [ ] MCP server OpenAI format output
- [ ] Basic session storage

### Phase 1: Core (2 weeks)
- [ ] Metrics calculation
- [ ] Dashboard UI
- [ ] Profile page generation
- [ ] Session timeline view

### Phase 2: Polish (1 week)
- [ ] Product grouping
- [ ] Article generation
- [ ] Profile customization
- [ ] SEO optimization

### Phase 3: Launch
- [ ] Open source release
- [ ] Documentation
- [ ] Personal usage
- [ ] Gather feedback

---

## 10. References

| Doc | Purpose |
|-----|---------|
| `docs/architecture/ADR-001` | Database Multi-Tenant Isolation |
| `docs/architecture/ADR-002` | Business Model & Data Access |
| `docs/architecture/ADR-003` | MCP Commercial Architecture |
| `docs/architecture/ADR-005` | Session Fragment OpenAI Format |
| `docs/specifications/MCP_SERVICE_DESIGN.md` | MCP technical design |

---

## Appendix: Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| V1.0 | 2026-03-20 | Initial lean template PRD |
| V2.0 | 2026-03-20 | Added AI-Native definition, Dual-Layer |
| V3.0 | 2026-03-20 | Knowledge Asset Platform, Decision Graph |
| V3.1 | 2026-03-20 | Added Canvas Editor |
| V3.2 | 2026-03-20 | OpenAI Format alignment |
| V3.3 | 2026-03-20 | **Repositioned as Capability Archive** |

---

**Document Version:** 3.3
**Status:** Draft - Ready for Discussion
**Key Changes from V3.2:**
1. **New positioning:** Vibe Coder's Verified Capability Archive
2. **Core value:** Prove capability, not manage knowledge
3. **Simplified features:** Cut Canvas, Decision Graph, Community
4. **Clear target:** One user (you) with one goal (prove capability)
5. **Success metric:** Opportunities created, not user count
6. **Open source model:** Tool for yourself, proof for others