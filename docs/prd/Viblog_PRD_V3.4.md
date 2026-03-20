# Viblog PRD V3.4

**Version:** 3.4 | **Status:** Draft
**Owner:** CAO | **Updated:** 2026-03-20

---

## 1. Executive Summary

### The Insight

> **Viblog doesn't need to make money. Viblog IS your proof of capability. The capability you prove WITH Viblog makes money.**

**Research-Backed Positioning:**

| Finding | Source | Viblog Implication |
|---------|--------|-------------------|
| AI tools cause 19% initial productivity drop | METR Study 2024 | Quantified learning curve = differentiation |
| AGENTS.md adopted by Linux Foundation | Agentic AI Foundation | Cross-platform agent config is standardizing |
| "Proof of work" products exist but fragmented | BragDoc, Codeboards, MindSkill | Market validates need, no complete solution |
| Vibe Coding workflow is emerging pattern | Deep Research 2026 | Standardized process = teachable skill |

### One-Liner

**Viblog - Your Vibe Coding Growth Platform**

- **Public Layer:** Prove your capability to the world
- **Private Layer:** Accelerate your growth with AI-native tools

---

## 2. Problem Definition

### Background

**Industry Reality:**
- Vibe Coding is mainstream - developers spend 4-8 hours daily in Claude Code, Cursor, Windsurf
- AI tools have a learning curve - METR study shows 19% productivity drop initially
- No standardized way to measure Vibe Coding proficiency
- Session data is ephemeral - development journey is lost

**User Reality:**
- Developer finishes project with code on GitHub but no proof of HOW they worked
- Claims like "I built this in 3 hours with AI" are unverifiable
- No way to demonstrate AI collaboration skill to employers/investors
- No personal growth tracking for Vibe Coding skills

### Core Problem Statement

> Vibe Coders **cannot prove their AI collaboration capability**, and **cannot systematically improve it**, because **no platform addresses both verification AND growth**.

### Problem Decomposition

| Type | Gap | Impact | Viblog Solution |
|------|-----|--------|-----------------|
| **Proof Gap** | No way to prove AI collaboration skill | Cannot demonstrate capability | Public Profile + Dashboard |
| **Growth Gap** | No structured improvement path | Stuck at current skill level | Private Tools + Insights |
| **Visibility Gap** | Session data lost after completion | Cannot show development process | Session Timeline |
| **Quantification Gap** | No standardized efficiency metrics | Cannot benchmark progress | Efficiency Metrics |
| **Configuration Gap** | Agent configs scattered | Cannot optimize workflow | Agent Team Manager |

### Competitive Landscape

| Product | Category | Shows | Missing | Viblog Advantage |
|---------|----------|-------|---------|------------------|
| **BragDoc** | Portfolio | Badges, certificates | Development process | Session timeline, metrics |
| **Codeboards.io** | Portfolio | GitHub activity | AI collaboration context | Vibe Coding focus |
| **MindSkill.md** | Skill tracking | Learning progress | Real development data | Live session sync |
| **GitHub** | Code hosting | Commits, PRs | HOW you coded | AI collaboration visibility |
| **LinkedIn** | Professional | Work history | Real capability | Verified metrics |
| **Cursor Stats** | IDE Plugin | Local metrics | No public proof, no growth tools | Public + Private layers |

**Market Gap:** No product combines **proof of capability** with **growth acceleration** for Vibe Coders.

---

## 3. Product Strategy

### Positioning

| Element | Definition |
|---------|------------|
| Product Type | **Dual-Layer Growth Platform for Vibe Coders** |
| One-Liner | **Viblog - Prove Your Capability, Accelerate Your Growth** |
| Core Value | **Public:** Make AI collaboration visible, verifiable, provable<br>**Private:** Optimize workflow, accelerate learning, deploy everywhere |
| Not | Knowledge management, blog platform, community, learning platform |

### Dual-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG DUAL-LAYER ARCHITECTURE                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  PUBLIC LAYER - PROVE                                        │  │
│   │  ═════════════════════                                       │  │
│   │                                                              │  │
│   │  Profile Dashboard ───► Show verified metrics               │  │
│   │  Session Timeline ───► Show development journey             │  │
│   │  Product Showcase ───► Show outcomes                        │  │
│   │  Articles ───────────► Share insights                       │  │
│   │                                                              │  │
│   │  Goal: One link to prove your Vibe Coding capability        │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  PRIVATE LAYER - GROW                                        │  │
│   │  ═════════════════════                                       │  │
│   │                                                              │  │
│   │  Agent Team Manager ─► Configure your AI assistants         │  │
│   │  Workflow Library ───► Reuse proven patterns                │  │
│   │  Growth Insights ────► Track your improvement               │  │
│   │  Cross-Platform Sync ─► Deploy configs everywhere           │  │
│   │                                                              │  │
│   │  Goal: Accelerate your Vibe Coding skill development        │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  DATA FOUNDATION                                             │  │
│   │  ════════════════                                            │  │
│   │                                                              │  │
│   │  MCP Session Sync ────► Auto-capture everything             │  │
│   │  OpenAI Format Storage ─► Industry-standard data            │  │
│   │  Metrics Engine ──────► Calculate efficiency                │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Value Proposition by Layer

**Public Layer - "Prove"**

| User Segment | Need | Viblog Value |
|--------------|------|--------------|
| Job Seekers | Demonstrate AI proficiency | Verified Dashboard + Portfolio |
| Freelancers | Win projects with proven speed | Project Timeline + Metrics |
| Founders | Show execution capability | Product Showcase |
| Content Creators | Build credibility | Public Profile + Articles |

**Private Layer - "Grow"**

| User Segment | Need | Viblog Value |
|--------------|------|--------------|
| Learners | Improve AI collaboration skill | Growth Insights + Benchmarks |
| Power Users | Optimize workflow | Agent Team Manager |
| Teams | Standardize practices | Workflow Library |
| Multi-Platform Users | Consistent experience | Cross-Platform Sync |

---

## 4. Core Features

### Feature Matrix

| Layer | Feature | Priority | Purpose | User Value |
|-------|---------|----------|---------|------------|
| Foundation | MCP Session Sync | P0 | Data collection | Zero-effort recording |
| Foundation | OpenAI Format Storage | P0 | Data standardization | Interoperability |
| Foundation | Metrics Engine | P0 | Quantification | Benchmarkable data |
| **Public** | Efficiency Dashboard | P0 | Visibility | Prove capability |
| **Public** | Public Profile | P0 | Shareability | One-link proof |
| **Public** | Session Timeline | P0 | Process showcase | Show the journey |
| **Public** | Product Showcase | P1 | Outcome display | What you built |
| **Public** | Article Publishing | P1 | Thought leadership | Share insights |
| **Private** | Agent Team Manager | P1 | Configuration | Optimize AI workflow |
| **Private** | Workflow Library | P1 | Reusability | Learn from patterns |
| **Private** | Growth Insights | P2 | Self-improvement | Track progress |
| **Private** | Cross-Platform Sync | P2 | Consistency | Deploy everywhere |

### Core Loop

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG CORE LOOP                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Vibe Coding Session]                                             │
│        │                                                            │
│        ▼                                                            │
│   [MCP Auto-Sync] ──► OpenAI-Format Storage                        │
│        │                                                            │
│        ├─────────────────────────────────────────┐                  │
│        │                                         │                  │
│        ▼                                         ▼                  │
│   [PUBLIC LAYER]                          [PRIVATE LAYER]           │
│        │                                         │                  │
│        ├── Dashboard                            ├── Growth Insights │
│        ├── Profile                              ├── Agent Config    │
│        ├── Timeline                             ├── Workflows      │
│        └── Products                             └── Benchmarks      │
│        │                                         │                  │
│        ▼                                         ▼                  │
│   [Prove to World]                        [Accelerate Growth]       │
│        │                                         │                  │
│        └─────────────────────────────────────────┘                  │
│                              │                                      │
│                              ▼                                      │
│                    [Better Vibe Coder]                              │
│                              │                                      │
│                              ▼                                      │
│                    [More Opportunities]                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Feature Specifications

### 5.1 MCP Session Sync (P0 - Foundation)

| Attribute | Specification |
|-----------|---------------|
| Trigger | Automatic, on session activity |
| Input | Session fragments from Claude Code, Cursor, Windsurf |
| Processing | OpenAI-format storage, metrics extraction |
| Output | Stored session + calculated metrics |
| User Action | None required (fully automatic) |

**Cross-Platform Support:**

| Platform | Status | Integration Method |
|----------|--------|-------------------|
| Claude Code | ✅ Active | viblog-mcp-server |
| Cursor | Planned | Extension API |
| Windsurf | Planned | Extension API |
| Copilot | Planned | VS Code extension |
| OpenAI Codex | Planned | API integration |

**What Gets Recorded:**

| Data | Purpose | Format |
|------|---------|--------|
| Timestamps | Time tracking | ISO 8601 |
| Token usage | Efficiency calculation | OpenAI format |
| Tool calls | Agent stack analysis | OpenAI tool_call |
| Code changes | Product tracking | file_content block |
| Reasoning blocks | Decision analysis | OpenAI reasoning |
| Iterations | Quality metrics | Sequence tracking |

### 5.2 Efficiency Dashboard (P0 - Public)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User views profile |
| Input | Aggregated session data |
| Processing | Calculate metrics, compare benchmarks |
| Output | Visual dashboard with key numbers |

**Core Metrics:**

| Metric | Definition | Calculation | Benchmark |
|--------|------------|-------------|-----------|
| **Velocity** | Features per week | Sessions / Weeks | Industry: 2-3 |
| **Efficiency** | Time to completion | Hours / Feature | Lower is better |
| **Token Economy** | Output efficiency | Output tokens / Input tokens | Higher is better |
| **Iteration Ratio** | Quality indicator | Revisions / Initial output | Lower is better |
| **Cache Efficiency** | Cost optimization | Cached tokens / Total input | Higher is better |
| **AI Leverage** | AI contribution | Generated lines / Manual lines | Higher is better |

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
│   │                                                             │  │
│   │  Your growth: +0.8 vs last month                           │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  EFFICIENCY                                    Top 10%       │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  Avg: 2.3h/feature  ████████████████████░░  Industry: 4.1h │  │
│   │                                                             │  │
│   │  Learning curve: 127h invested → Now 48% faster             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  TOKEN ECONOMY                                 Top 20%       │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  Output/Input: 0.42  ██████████████░░░░░░░  Industry: 0.31 │  │
│   │                                                             │  │
│   │  Cache savings: $127 this month                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  AGENT STACK                                                │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │  Primary: Claude Code ████████████████████ 92%             │  │
│   │  Secondary: Cursor    ████████░░░░░░░░░░░░ 35%             │  │
│   │                                                             │  │
│   │  Top Agents: CAO, CTO, planner, code-reviewer               │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  GROWTH TRAJECTORY                                          │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │                                                             │  │
│   │  Week 1    Week 4    Week 8    Week 12   Now               │  │
│   │    ▁        ▂        ▄        ▆         █                  │  │
│   │   -19%     -8%       +12%      +24%     +31%               │  │
│   │                                                             │  │
│   │  You've crossed the AI learning curve (METR baseline)       │  │
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

### 5.3 Public Profile (P0 - Public)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User shares profile link |
| Input | User's public data settings |
| Processing | Generate public view |
| Output | Shareable profile page |

**Profile URL:** `viblog.dev/@username` or custom domain

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
│   │                                                             │  │
│   │  Growth: +31% vs baseline (learning curve crossed)          │  │
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
│   │  │ 31% ↑     │  │ 18% ↑     │  │ 12% ↑     │              │  │
│   │  │ Live →    │  │ MVP       │  │ Draft     │              │  │
│   │  └───────────┘  └───────────┘  └───────────┘              │  │
│   │                                                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  VERIFIED BY VIBLOG ✓                                        │  │
│   │  Data integrity verified on 2026-03-20                      │  │
│   │  Based on 127 sessions of development data                   │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.4 Agent Team Manager (P1 - Private)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User opens settings |
| Input | Current CLAUDE.md / AGENTS.md config |
| Processing | Parse, validate, visualize |
| Output | Configurable agent definitions |

**Research Insight:** AGENTS.md is now cross-platform standard (Linux Foundation Agentic AI Foundation). Viblog can be the central configuration hub.

**Agent Configuration Schema:**

```typescript
interface AgentConfig {
  id: string;
  name: string;
  role: 'executive' | 'specialist' | 'publisher';

  // Capabilities
  tools: string[];
  model_preference: string;

  // Behavior
  triggers: string[];
  auto_invoke: boolean;

  // Limits
  max_tokens?: number;
  timeout?: number;

  // Cross-platform deployment
  platforms: ('claude-code' | 'cursor' | 'windsurf' | 'copilot')[];
}
```

**UI Mockup:**

```
┌─────────────────────────────────────────────────────────────────────┐
│   AGENT TEAM MANAGER                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  EXECUTIVE LAYER                                            │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │                                                             │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│   │  │ CAO         │  │ CTO         │  │ CUIO        │        │  │
│   │  │ ─────────── │  │ ─────────── │  │ ─────────── │        │  │
│   │  │ Architecture│  │ Quality     │  │ Design      │        │  │
│   │  │             │  │             │  │             │        │  │
│   │  │ ✅ Active   │  │ ✅ Active   │  │ ✅ Active   │        │  │
│   │  │ 92% used    │  │ 87% used    │  │ 45% used    │        │  │
│   │  └─────────────┘  └─────────────┘  └─────────────┘        │  │
│   │                                                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  SPECIALIST LAYER                                           │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │                                                             │  │
│   │  planner · architect · code-reviewer · security-reviewer   │  │
│   │  database-reviewer · tdd-guide · e2e-runner                │  │
│   │                                                             │  │
│   │  [+ Add Agent]  [Import from Library]  [Export Config]     │  │
│   │                                                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  CROSS-PLATFORM DEPLOYMENT                                  │  │
│   │  ─────────────────────────────────────────────────────────  │  │
│   │                                                             │  │
│   │  ☑ Claude Code  ☑ Cursor  ☐ Windsurf  ☐ Copilot          │  │
│   │                                                             │  │
│   │  [Deploy to Selected Platforms]                            │  │
│   │                                                             │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.5 Workflow Library (P1 - Private)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User browses workflows |
| Input | Community + personal workflows |
| Processing | Index, search, recommend |
| Output | Actionable workflow templates |

**Workflow Schema:**

```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;

  // Workflow definition
  steps: WorkflowStep[];

  // Metadata
  category: 'feature' | 'bugfix' | 'refactor' | 'docs' | 'test';
  tags: string[];

  // Stats
  usage_count: number;
  success_rate: number;
  avg_time: number;

  // Author
  author_id?: string;
  is_public: boolean;
}

interface WorkflowStep {
  order: number;
  agent: string;
  action: string;
  expected_output: string;
}
```

**Workflow Categories:**

| Category | Example Workflows |
|----------|-------------------|
| Feature | "New API endpoint", "React component", "Auth flow" |
| Bugfix | "Debug and fix", "Performance issue", "Security vulnerability" |
| Refactor | "Module extraction", "TypeScript migration", "Code cleanup" |
| Docs | "API documentation", "README update", "Changelog entry" |
| Test | "Unit test suite", "E2E test", "Integration test" |

### 5.6 Growth Insights (P2 - Private)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User views growth dashboard |
| Input | Historical session data |
| Processing | Trend analysis, benchmark comparison |
| Output | Actionable insights |

**Insight Types:**

| Type | Example |
|------|---------|
| **Trend** | "Your velocity increased 15% this month" |
| **Benchmark** | "You're in top 10% for token efficiency" |
| **Learning** | "You crossed the AI learning curve at session #47" |
| **Recommendation** | "Consider using planner agent more - 23% faster completion" |
| **Anomaly** | "Unusual iteration count on last project - investigate?" |

**METR Baseline Integration:**

```
┌─────────────────────────────────────────────────────────────────────┐
│   YOUR AI LEARNING CURVE                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Productivity                                                      │
│   ▲                                                                 │
│   │                            ┌───────                            │
│   │                         ┌──┘                                   │
│   │                      ┌─┘                                       │
│   │                   ┌──┘                                         │
│   │   Baseline ──────┼─────────────────────────────               │
│   │                ┌─┘                                            │
│   │             ┌──┘      ↑ You are here (session 127)            │
│   │          ┌──┘          +31% above baseline                     │
│   │       ┌──┘                                                   │
│   │    ┌──┘                                                      │
│   │ ──┘   Learning Phase (METR: -19% avg)                        │
│   └───────────────────────────────────────────────────► Sessions  │
│         1    20    40    60    80   100   127                     │
│                                                                     │
│   Key Insights:                                                     │
│   • Learning phase ended at session 47                             │
│   • Breakthrough: Started using CAO for planning                   │
│   • Current trajectory: +5% per month                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Data Model

### Core Entities

| Entity | Purpose | Layer | Visibility |
|--------|---------|-------|------------|
| `user` | Account | Foundation | Private (L3) |
| `vibe_session` | Session container | Foundation | Private (L2) |
| `session_fragment` | OpenAI-format messages | Foundation | Private (L2) |
| `product` | Session group | Public | User choice (L0/L1) |
| `profile` | Public profile data | Public | Public (L0) |
| `metrics_cache` | Calculated metrics | Foundation | Private (L2) |
| `agent_config` | Agent definitions | Private | Private (L2) |
| `workflow` | Workflow templates | Private | User choice (L1/L2) |
| `growth_insight` | Generated insights | Private | Private (L2) |

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
    platform?: 'claude-code' | 'cursor' | 'windsurf';
  };

  created_at: string;
}

type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string }
  | { type: 'tool_call'; tool_call_id: string; name: string; arguments: string }
  | { type: 'tool_output'; text: string; metadata?: Record<string, any> }
  | { type: 'code'; language: string; code: string; file_path?: string };
```

### Agent Config Schema

```typescript
interface AgentConfig {
  id: string;
  user_id: string;

  // Definition
  name: string;
  role: 'executive' | 'specialist' | 'publisher';
  description: string;

  // Capabilities
  tools: string[];
  model_preference: string;

  // Behavior
  triggers: string[];
  auto_invoke: boolean;
  priority: number;

  // Constraints
  max_tokens?: number;
  timeout?: number;

  // Cross-platform
  platforms: {
    claude_code?: { enabled: boolean; config?: object };
    cursor?: { enabled: boolean; config?: object };
    windsurf?: { enabled: boolean; config?: object };
    copilot?: { enabled: boolean; config?: object };
  };

  // Metadata
  usage_count: number;
  last_used: string;
  created_at: string;
  updated_at: string;
}
```

### Workflow Schema

```typescript
interface Workflow {
  id: string;
  user_id?: string; // null for public workflows

  // Definition
  name: string;
  description: string;
  category: 'feature' | 'bugfix' | 'refactor' | 'docs' | 'test';
  tags: string[];

  // Steps
  steps: WorkflowStep[];

  // Stats
  usage_count: number;
  success_rate: number;
  avg_time_minutes: number;

  // Sharing
  is_public: boolean;
  author_name?: string;

  created_at: string;
  updated_at: string;
}

interface WorkflowStep {
  order: number;
  agent: string;
  action: string;
  expected_output: string;
  estimated_minutes?: number;
}
```

---

## 7. Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG ARCHITECTURE                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Claude Code / Cursor / Windsurf / Copilot]                       │
│            │                                                        │
│            ▼                                                        │
│   ┌─────────────────┐                                               │
│   │ MCP Server      │  Session sync, OpenAI format conversion      │
│   │ (viblog-mcp)    │  Cross-platform config deployment            │
│   └────────┬────────┘                                               │
│            │                                                        │
│            ▼                                                        │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ API Layer (Next.js)                                          │  │
│   │ ───────────────────                                          │  │
│   │ • Session CRUD              • Agent config management       │  │
│   │ • Metrics calculation        • Workflow CRUD                │  │
│   │ • Profile generation         • Cross-platform sync          │  │
│   │ • Growth insights            • Article generation           │  │
│   └────────┬────────────────────────────────────────────────────┘  │
│            │                                                        │
│            ▼                                                        │
│   ┌─────────────────┐                                               │
│   │ Supabase        │  vibe_session, session_fragments             │
│   │                 │  products, metrics_cache                      │
│   │                 │  agent_configs, workflows                     │
│   └─────────────────┘                                               │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ PUBLIC VIEW (SSR)                                            │  │
│   │ ─────────────────                                            │  │
│   │ • Profile pages (SEO optimized)                             │  │
│   │ • Product showcases                                          │  │
│   │ • Public articles                                            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │ PRIVATE VIEW (Client)                                        │  │
│   │ ───────────────────                                          │  │
│   │ • Dashboard                                                  │  │
│   │ • Agent Team Manager                                         │  │
│   │ • Workflow Library                                           │  │
│   │ • Growth Insights                                            │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| MCP Server | TypeScript | Session sync, config deployment |
| API Layer | Next.js App Router | CRUD, metrics, sync |
| Database | Supabase (PostgreSQL) | Data storage |
| Public View | Next.js SSR | SEO profiles |
| Private View | React (Client) | Interactive dashboard |

---

## 8. Success Metrics

### Product Success

| Metric | Target | Why |
|--------|--------|-----|
| **First User** | You | First user is the primary target |
| Sessions Synced | 100+ | Proof of usage |
| Profile Views | 50+ | Proof of value |
| Opportunities | 1+ | Job offer, project, investment |

### Metric Quality

| Metric | Target | Why |
|--------|--------|-----|
| Sync Success Rate | 99% | Reliability |
| Metrics Accuracy | 95%+ | Trustworthiness |
| Profile Load Time | <1s | User experience |
| Config Sync Speed | <5s | Cross-platform UX |

### Growth Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Learning Curve Crossing | Session 50 | METR baseline |
| Efficiency Improvement | +20% | Demonstrable growth |
| Workflow Reuse | 10+ uses | Pattern adoption |
| Agent Optimization | 3+ configs tuned | Workflow mastery |

---

## 9. Implementation Roadmap

### Phase 0: Foundation (1 week)
- [ ] Database schema update (OpenAI format)
- [ ] MCP server OpenAI format output
- [ ] Basic session storage
- [ ] Metrics calculation engine

### Phase 1: Public Layer (2 weeks)
- [ ] Dashboard UI
- [ ] Profile page generation
- [ ] Session timeline view
- [ ] Product grouping

### Phase 2: Private Layer (2 weeks)
- [ ] Agent Team Manager UI
- [ ] Workflow Library UI
- [ ] Cross-platform config sync
- [ ] Growth Insights dashboard

### Phase 3: Launch
- [ ] Open source release
- [ ] Documentation
- [ ] Personal usage
- [ ] Gather feedback

---

## 10. What We Cut

### Removed from V3.3

| Feature | Why Removed |
|---------|-------------|
| Canvas Editor | Over-engineered, Markdown sufficient |
| Decision Graph | Not core to prove/grow mission |
| Community Feed | Personal tool, not social platform |
| Subscription System | Open source, proof for yourself |

### What Remains Simplified

| Feature | V3.3 Scope | V3.4 Scope |
|---------|------------|------------|
| Article Publishing | Markdown only | Markdown only |
| Profile | Public only | Public only |
| Metrics | Basic efficiency | + Growth trajectory, benchmarks |

---

## 11. References

| Doc | Purpose |
|-----|---------|
| `docs/architecture/ADR-001` | Database Multi-Tenant Isolation |
| `docs/architecture/ADR-002` | Business Model & Data Access |
| `docs/architecture/ADR-003` | MCP Commercial Architecture |
| `docs/architecture/ADR-005` | Session Fragment OpenAI Format |
| `docs/specifications/MCP_SERVICE_DESIGN.md` | MCP technical design |
| `docs/specifications/VIBLOG_PUBLISH_GUIDANCE.md` | Publishing workflow |

---

## Appendix: Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| V1.0 | 2026-03-20 | Initial lean template PRD |
| V2.0 | 2026-03-20 | Added AI-Native definition, Dual-Layer |
| V3.0 | 2026-03-20 | Knowledge Asset Platform, Decision Graph |
| V3.1 | 2026-03-20 | Added Canvas Editor |
| V3.2 | 2026-03-20 | OpenAI Format alignment |
| V3.3 | 2026-03-20 | Repositioned as Capability Archive |
| **V3.4** | **2026-03-20** | **Dual-Layer: Public (Prove) + Private (Grow)** |

---

## Appendix: Research Sources

| Topic | Source | Key Insight |
|-------|--------|-------------|
| AI Learning Curve | METR Study 2024 | 19% initial productivity drop |
| AGENTS.md Standard | Linux Foundation Agentic AI Foundation | Cross-platform agent config |
| Proof of Work Market | BragDoc, Codeboards, MindSkill | Fragmented solutions, no complete offering |
| Vibe Coding Workflow | Deep Research 2026 | Intent → Spec → Prompt → Generate → Review → Iterate → Ship |
| Reasoning Format | convert_ai_session.py v1.3.0 | Industry converging to OpenAI format |

---

**Document Version:** 3.4
**Status:** Draft - Ready for Implementation
**Key Changes from V3.3:**
1. **Dual-Layer Architecture:** Public (Prove) + Private (Grow)
2. **Agent Team Manager:** Central configuration hub for cross-platform deployment
3. **Workflow Library:** Reusable patterns for common tasks
4. **Growth Insights:** METR baseline integration, learning curve tracking
5. **Research-Backed:** Validated by market analysis and industry trends