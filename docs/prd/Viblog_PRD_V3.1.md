# Viblog PRD V3.1

**Version:** 3.1 | **Status:** Draft
**Owner:** CAO | **Updated:** 2026-03-20

---

## 1. Problem Definition

### Background
- **Industry Context:** Agentic coding is mainstream. 60% of developer work involves AI, but 0% can be fully delegated (Anthropic 2026 Report). Engineers are becoming orchestrators, not just implementers.
- **Current Flow (As-Is):** Session ends → Decisions scattered → Knowledge lost → Cannot retrieve past solutions → Manual blog writing takes 2-4 hours → Most developers choose "not to write."
- **Structural Problem:** Developer knowledge assets (decisions, patterns, insights) cannot be systematically captured, accumulated, or monetized.

### Core Problem Statement
> Developer knowledge assets **cannot be systematically captured, accumulated, or monetized**, because **session decisions are unstructured, retrieval is impossible, and content creation is too time-consuming**.

### Problem Decomposition
| Type | Gap | Impact | Viblog Solution |
|------|-----|--------|-----------------|
| **Knowledge Loss** | Decisions/insights not structured | Re-solve similar problems repeatedly | Decision Graph extraction |
| **Output Barrier** | Blog writing takes 2-4 hours | Developers choose not to write | AI auto-generation + Canvas Editor |
| **Expression Limit** | Linear text cannot express decision process | Knowledge context lost | Node + Edge Canvas |
| **Asset Absence** | Experience scattered, unaccumulated | No personal knowledge system | Personal Knowledge Base |
| **Value Gap** | Technical content hard to monetize | No incentive to share | Community + Subscription |

### Market Reality (Why This Matters)

**From Anthropic 2026 Agentic Coding Report:**
> "Engineers use AI in 60% of work but can fully delegate 0% of tasks"

**Implication:**
- Human oversight is **always required**
- Engineers are becoming **orchestrators**, not implementers
- The skill shift is from "writing code" to "managing AI output"

**Opportunity:**
> Claude Code/Cursor solve **coding efficiency** (Level 1-2)
> Viblog solves **knowledge asset management** (Level 3-4)

---

## 2. Product Strategy

### Positioning
| Element | Definition |
|---------|------------|
| Product Type | **Knowledge Asset Platform for Developers** |
| Target User | Vibe Coders using Claude Code, Cursor, Windsurf |
| JTBD | Transform every coding session into systematic, retrievable, monetizable knowledge |
| Not Competing With | Claude Code, Cursor, Devin (they solve coding, we solve knowledge) |

### AI-Native Definition (Core Differentiation)

Viblog is AI-Native because:

| Pillar | Definition | Implementation |
|--------|------------|----------------|
| **Session-Originated** | Knowledge grows from coding sessions, not blank pages | MCP sync → Structured fragments |
| **Decision-First** | Capture "why," not just "what" | Decision Graph extraction |
| **Canvas-Native** | Node + Edge visualization, not linear text | Article Canvas Editor |
| **Dual-Layer Format** | Human-readable + AI-consumable | Markdown + Structured JSON |
| **MCP-Native** | Seamless integration with development tools | viblog-mcp-server |
| **Knowledge ROI** | Quantified value of personal knowledge | Analytics dashboard |

### AI Role Definition
| Level | Description | This Product |
|-------|-------------|--------------|
| Copilot | AI assists, human decides | Content refinement, formatting |
| Agent | AI executes, human reviews | Session sync, draft generation, decision extraction, canvas auto-layout |
| System Brain | AI decides autonomously | No - User controls all publish decisions |

**AI Position:** Agent-level for knowledge pipeline, Copilot-level for content creation.

### Value Proposition
| Stakeholder | Value |
|-------------|-------|
| Developer (Producer) | Zero-effort knowledge asset creation + Visual decision expression + Personal brand building |
| Developer (Consumer) | Discover curated development knowledge + Understand decision process, not just outcome |
| System | Accumulates structured development knowledge with decision context |
| Data Flywheel | More sessions → Better decisions → More knowledge → More users → More sessions |

### Competitive Landscape

| Product | Solves | Viblog Relation |
|---------|--------|-----------------|
| Claude Code | Coding efficiency | **Complement** - We use their runtime |
| Cursor | IDE experience | **Complement** - We use their environment |
| Devin | Task execution | **Complement** - Different layer |
| Notion/Medium | Content publishing | **Disrupt** - AI-Native + Canvas, not linear text |
| Obsidian | Personal notes | **Disrupt** - Auto-generated + Visual, not manual |
| Dify/Flowise | Workflow builder | **Inspire** - Canvas pattern, but for knowledge not workflows |

**Key Insight:**
> We don't compete with Claude Code on **coding**
> We compete with Notion/Medium on **knowledge management**
> With Canvas + AI-Native advantages they cannot replicate

---

## 3. Core Features

### Feature Matrix
| Feature | Priority | AI Role | User Control | Rationale |
|---------|----------|---------|--------------|-----------|
| MCP Session Sync | P0 | Agent | Semi-auto | Knowledge data pipeline |
| Decision Graph Extraction | P0 | Agent | Semi-auto | Core differentiation |
| Article Canvas Editor | P0 | Agent | Manual | Visual knowledge expression |
| Canvas Auto-Layout | P0 | Agent | Semi-auto | From decisions to visual |
| AI Draft Generation | P0 | Agent | Semi-auto | Content creation |
| Dual-Layer Publishing | P0 | Agent | Semi-auto | AI-Native format |
| Canvas ↔ Markdown Sync | P1 | Agent | Auto | Dual mode access |
| Knowledge Retrieval | P1 | Copilot | Manual | Reuse value |
| Personal Knowledge ROI | P1 | Copilot | Manual | Value visualization |
| Community Feed | P1 | Copilot | Manual | Distribution |
| LLM Configuration | P1 | None | Manual | User infrastructure |
| Subscription System | P2 | None | Manual | Monetization |

### Core Loop (P0)

```
┌─────────────────────────────────────────────────────────────────────┐
│   VIBLOG KNOWLEDGE ASSET LOOP V3.1                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Claude Code ──► MCP Sync ──► Session Storage                     │
│        │                    │                                       │
│        │                    ▼                                       │
│        │         Decision Graph Extraction                          │
│        │              (Why did I do this?)                          │
│        │                    │                                       │
│        │                    ▼                                       │
│        │         Canvas Auto-Layout                                 │
│        │         (自动生成画布骨架)                                  │
│        │                    │                                       │
│        │         ┌──────────┴──────────┐                            │
│        │         ▼                     ▼                            │
│        │   Canvas Editor         Markdown Editor                    │
│        │   (Node+Edge)           (Linear Text)                      │
│        │         │                     │                            │
│        │         └──────────┬──────────┘                            │
│        │                    │                                       │
│        │                    ▼                                       │
│        │              User Refinement                               │
│        │              (调整/补充节点)                                │
│        │                    │                                       │
│        │                    ▼                                       │
│        │         Dual-Layer Publish                                 │
│        │           │         │                                      │
│        │           ▼         ▼                                      │
│        │     Canvas JSON   Markdown                                 │
│        │     (交互版)      (阅读版)                                 │
│        │           │         │                                      │
│        │           ▼         ▼                                      │
│        │     Interactive   Human Readers                            │
│        │     Canvas View   (传统阅读)                               │
│        │                                                                       │
│        └────────────── Knowledge ROI ◄────────────────────────────────┤
│                     (价值量化)                                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Feature Specs

#### MCP Session Sync (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User invokes via Claude Code MCP tool |
| Input | Session fragments: prompts, responses, code, outputs, errors |
| Processing | MCP server validates → API → Supabase (L2) |
| Output | Structured `vibe_session` with `session_fragments` |
| Failure | Queue retry (3x), log error, notify user |
| Edge Cases | Large sessions (>1MB) chunked; duplicates filtered by hash |

#### Decision Graph Extraction (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | After session sync completes |
| Input | Session fragments (prompts, responses, code changes, errors) |
| Processing | User's LLM extracts: decision, reasoning, alternatives, outcome, confidence |
| Output | `decision_graph` with structured decisions |
| Failure | Log warning, mark session as "unprocessed" |
| JSON Structure | `{ decision_id, decision, reasoning, alternatives[], outcome, confidence, related_fragments[] }` |

#### Article Canvas Editor (P0) - NEW

| Attribute | Specification |
|-----------|---------------|
| Trigger | User creates/edits article |
| Input | Decision graph (optional), manual node creation |
| Processing | React Flow engine renders Node + Edge canvas |
| Output | `article_canvas` with nodes and edges |
| Node Types | `problem`, `decision`, `code`, `insight`, `output` |
| Edge Types | `because`, `but`, `therefore`, `alternative`, `implements` |
| Features | Drag-drop, zoom, pan, connect/disconnect, edit inline |
| Failure | Auto-save draft, restore from last state |
| Edge Cases | Empty canvas → Show template nodes; Too many nodes → Suggest grouping |

**Canvas Node Schema:**
```typescript
interface ArticleNode {
  id: string
  type: 'problem' | 'decision' | 'code' | 'insight' | 'output'
  position: { x: number, y: number }
  data: {
    title: string
    content: string
    code?: string
    language?: string
    metadata?: {
      confidence?: number
      source_fragment?: string
      created_at?: string
    }
  }
}
```

**Canvas Edge Schema:**
```typescript
interface ArticleEdge {
  id: string
  source: string
  target: string
  type: 'because' | 'but' | 'therefore' | 'alternative' | 'implements'
  label?: string
}
```

#### Canvas Auto-Layout (P0) - NEW

| Attribute | Specification |
|-----------|---------------|
| Trigger | User clicks "Generate from Session" or "Generate from Decisions" |
| Input | `vibe_session` or `decision_graph` |
| Processing | Algorithm maps decisions → nodes, relationships → edges, applies layout |
| Output | Pre-populated canvas with connected nodes |
| Layout Algorithm | Dagre (hierarchical) or ELK (more advanced) |
| Failure | Show empty canvas with instruction |
| Edge Cases | No decisions → Generate problem node only; Many decisions → Group by topic |

**Auto-Layout Logic:**
```
Decision Graph                      Canvas
─────────────────────────────────────────────────────
Problem                           → Problem Node
Decision                          → Decision Node
Decision.reasoning                → Edge (because)
Decision.alternatives             → Edge (alternative)
Code snippet                      → Code Node
Outcome                           → Output Node
Confidence                        → Node metadata
```

#### Canvas ↔ Markdown Sync (P1) - NEW

| Attribute | Specification |
|-----------|---------------|
| Trigger | User switches mode or enables sync |
| Input | Canvas state OR Markdown content |
| Processing | Bidirectional conversion maintaining semantic equivalence |
| Canvas → Markdown | Traverse nodes top-to-bottom, generate sections |
| Markdown → Canvas | Parse headers → nodes, lists → edges |
| Output | Synchronized dual representation |
| Failure | Show diff, allow manual resolution |
| Edge Cases | Complex canvas → Simplified Markdown; Rich Markdown → Basic canvas |

**Canvas → Markdown Conversion:**
```markdown
## 问题
[Problem Node content]

## 决策
### 决策1: [Decision Node title]
**因为:** [because edge content]
**但考虑:** [but edge content]
**因此:** [therefore edge content]

## 代码
```[language]
[Code Node content]
```

## 结果
[Output Node content]
```

#### AI Draft Generation (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User requests draft from session/decisions |
| Input | `vibe_session` ID + `decision_graph`, optional style preferences |
| Processing | User's LLM → Session + Decisions → Structured draft |
| Output | Article draft OR Canvas skeleton (user choice) |
| Failure | Fallback to template-based extraction |
| Edge Cases | Empty session → Prompt for context; Short session → Combine recent sessions |

#### Dual-Layer Publishing (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User publishes article |
| Input | Canvas state + Decision metadata |
| Processing | 1. Generate Canvas JSON (interactive) 2. Generate Markdown (readable) 3. Generate HTML snapshot (SEO) |
| Output | Triple format in L0 (public) or L1 (private) |
| Failure | Save as draft, display error, allow retry |
| Canvas JSON | `{ canvas_id, nodes[], edges[], viewport{}, metadata{} }` |

---

## 4. AI System Design

### Capability Breakdown
| Capability | Implementation | Fallback |
|------------|----------------|----------|
| Perception | Parse fragments into: prompt/response/code/output/error | Regex-based extraction |
| Reasoning | Extract decisions: what/why/alternatives/outcome | Template-based extraction |
| Memory | Short-term: current session; Long-term: decision_graph + articles | None (stateless) |
| Action | Create draft, generate canvas, publish article, retrieve knowledge | Manual user action |
| Visualization | Map decisions → canvas layout | Empty canvas template |

### Prompt Strategy

**Decision Extraction Prompt:**
```
System: You are a technical knowledge extractor. Analyze the coding session and extract key decisions.

For each significant decision, provide:
1. decision: What was decided
2. reasoning: Why this approach was chosen
3. alternatives: What other options were considered
4. outcome: Did it work or need revision
5. confidence: How certain (0-1)

Focus on architectural decisions, not trivial choices.
```

**Canvas Layout Prompt:**
```
System: You are a knowledge visualization designer. Transform decisions into a canvas layout.

For each decision:
1. Create appropriate node type (problem/decision/code/output)
2. Set meaningful positions (top-to-bottom, left-to-right for alternatives)
3. Connect with semantic edges (because/but/therefore/alternative)

Output valid node and edge arrays.
```

### Human-in-the-Loop
| Decision Point | Level | Rationale |
|----------------|-------|-----------|
| Session Sync | Semi-auto | User initiates, AI executes |
| Decision Extraction | Auto | User can review/edit later |
| Canvas Auto-Layout | Semi-auto | AI generates, user refines |
| Node/Edge Creation | Manual | User controls canvas structure |
| Draft Generation | Semi-auto | AI creates, user must review |
| Dual-Layer Format | Auto | No user decision needed |
| Publishing | Manual | User approves all public content |

---

## 5. Data Model

### Core Entities
| Entity | Owner | AI Generated | Visibility |
|--------|-------|--------------|------------|
| `vibe_session` | User | Partial | Private (L2) |
| `session_fragment` | User | No | Private (L2) |
| `decision_graph` | User | Yes (AI) | Private (L2) |
| `article` | User | Yes (draft) | User choice (L0/L1) |
| `article_canvas` | User | Partial (AI) | Same as article |
| `article_markdown` | System | Yes (AI) | Same as article |
| `user` | User | No | Private (L3) |

### Decision Graph Schema
```json
{
  "decision_id": "uuid",
  "session_id": "uuid",
  "decision": "Use useEffect with cleanup for WebSocket connection",
  "reasoning": "Need to handle connection lifecycle in React component",
  "alternatives": ["Server-sent events", "Custom hook", "SWR"],
  "outcome": "success",
  "confidence": 0.92,
  "code_snippet": "useEffect(() => { ... }, [])",
  "related_fragments": ["fragment_id_1", "fragment_id_2"],
  "created_at": "2026-03-20T10:00:00Z"
}
```

### Article Canvas Schema (NEW)
```json
{
  "canvas_id": "uuid",
  "article_id": "uuid",
  "nodes": [
    {
      "id": "node_1",
      "type": "problem",
      "position": { "x": 100, "y": 50 },
      "data": {
        "title": "WebSocket连接管理",
        "content": "React组件中的WebSocket需要在组件卸载时正确关闭",
        "metadata": {
          "source_decision": "decision_id_1"
        }
      }
    },
    {
      "id": "node_2",
      "type": "decision",
      "position": { "x": 100, "y": 200 },
      "data": {
        "title": "使用useEffect + cleanup",
        "content": "在useEffect中建立连接，返回cleanup函数关闭连接",
        "metadata": {
          "confidence": 0.92
        }
      }
    },
    {
      "id": "node_3",
      "type": "code",
      "position": { "x": 100, "y": 350 },
      "data": {
        "title": "实现代码",
        "code": "useEffect(() => {\n  const ws = new WebSocket(url);\n  return () => ws.close();\n}, []);",
        "language": "typescript"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "target": "node_2",
      "type": "because",
      "label": "React生命周期需要"
    },
    {
      "id": "edge_2",
      "source": "node_2",
      "target": "node_3",
      "type": "implements"
    }
  ],
  "viewport": { "x": 0, "y": 0, "zoom": 1 },
  "metadata": {
    "created_from": "decision_graph",
    "session_id": "uuid"
  }
}
```

### Data Layers
| Layer | Definition | Human Access | LLM Access |
|-------|------------|--------------|------------|
| L0 | Public Articles (Canvas + Markdown + HTML) | All users | Subscriber LLM |
| L1 | Private Articles | Owner | Owner LLM |
| L2 | Session Data + Decision Graph + Canvas Drafts | Owner | Owner LLM |
| L3 | Identity, API Keys | Owner | None |

### Data Flow
```
[Claude Code]
     │
     ▼ (MCP)
[Session Sync]
     │
     ├──► [Session Fragments] ──► Supabase L2
     │
     └──► [Decision Extraction] ──► Decision Graph ──► Supabase L2
                                        │
                                        ▼
                              [Canvas Auto-Layout]
                                        │
                                        ▼
                              [Canvas Editor]
                                        │
                                        ├──► Canvas JSON
                                        │
                                        └──► Markdown Sync
                                                  │
                                                  ▼
                                        [Dual-Layer Publish]
                                                  │
                                                  ▼
                                        Supabase L0/L1
                                                  │
                                                  ▼
                                        [Community Feed]
                                        ├── Canvas View (Interactive)
                                        └── Markdown View (Read)
```

---

## 6. UI/UX Design

### Canvas Node Types

```
┌─────────────────────────────────────────────────────────────────────┐
│   NODE TYPE DESIGN                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────┐                                          │
│   │ 🔴 PROBLEM          │  Color: Red/Orange                      │
│   │ ─────────────────── │  Usage: 遇到的问题                       │
│   │ 描述问题内容...      │  Shape: Rounded Rectangle               │
│   └─────────────────────┘                                          │
│                                                                     │
│   ┌─────────────────────┐                                          │
│   │ 🟡 DECISION         │  Color: Yellow/Gold                     │
│   │ ─────────────────── │  Usage: 做出的决策                       │
│   │ 决策内容及原因...    │  Shape: Diamond                         │
│   │ Confidence: 92%     │                                          │
│   └─────────────────────┘                                          │
│                                                                     │
│   ┌─────────────────────┐                                          │
│   │ 🟢 CODE             │  Color: Green                            │
│   │ ─────────────────── │  Usage: 代码实现                         │
│   │ ```typescript       │  Shape: Rectangle with code styling     │
│   │ const x = 1;        │                                          │
│   │ ```                 │                                          │
│   └─────────────────────┘                                          │
│                                                                     │
│   ┌─────────────────────┐                                          │
│   │ 🔵 INSIGHT          │  Color: Blue                             │
│   │ ─────────────────── │  Usage: 获得的洞见                       │
│   │ 学到了什么...        │  Shape: Parallelogram                   │
│   └─────────────────────┘                                          │
│                                                                     │
│   ┌─────────────────────┐                                          │
│   │ 🟣 OUTPUT           │  Color: Purple                           │
│   │ ─────────────────── │  Usage: 最终结果                         │
│   │ 结果描述...          │  Shape: Circle                          │
│   └─────────────────────┘                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Edge Types

```
┌─────────────────────────────────────────────────────────────────────┐
│   EDGE TYPE DESIGN                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ─── because ───►     实线箭头，表示因果关系                       │
│                                                                     │
│   - - but - - ►        虚线箭头，表示转折/限制                      │
│                                                                     │
│   ═══ therefore ═══►   粗实线，表示最终选择                         │
│                                                                     │
│   ... alternative ...  点线，表示备选方案                           │
│                                                                     │
│   ─── implements ───►  实线箭头，表示实现关系                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Editor Modes

```
┌─────────────────────────────────────────────────────────────────────┐
│   ARTICLE EDITOR                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Canvas Mode] [Markdown Mode]              ← Tab切换              │
│   ─────────────────────────────────────────────────────────────     │
│                                                                     │
│   Canvas Mode (默认):                                               │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  工具栏: [+Problem] [+Decision] [+Code] [+Insight] [+Output] │  │
│   │  ──────────────────────────────────────────────────────────  │  │
│   │                                                              │  │
│   │     ┌─────────┐                                             │  │
│   │     │ Problem │                                             │  │
│   │     └────┬────┘                                             │  │
│   │          │ because                                          │  │
│   │          ▼                                                  │  │
│   │     ┌─────────┐                                             │  │
│   │     │Decision │                                             │  │
│   │     └────┬────┘                                             │  │
│   │          │ implements                                       │  │
│   │          ▼                                                  │  │
│   │     ┌─────────┐                                             │  │
│   │     │  Code   │                                             │  │
│   │     └─────────┘                                             │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   Markdown Mode:                                                    │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  # 标题                                                      │  │
│   │                                                              │  │
│   │  ## 问题                                                     │  │
│   │  描述...                                                     │  │
│   │                                                              │  │
│   │  ## 决策                                                     │  │
│   │  因为...所以选择...                                          │  │
│   │                                                              │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   [保存草稿] [预览] [发布]                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### View Modes (Published Article)

```
┌─────────────────────────────────────────────────────────────────────┐
│   PUBLISHED ARTICLE VIEW                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   [Interactive Canvas] [Linear Markdown]    ← Reader切换            │
│   ─────────────────────────────────────────────────────────────     │
│                                                                     │
│   Interactive Canvas:                                               │
│   - 可缩放、可拖拽                                                  │
│   - 点击节点展开详情                                                │
│   - 鼠标悬停显示边说明                                              │
│   - 支持全屏模式                                                    │
│                                                                     │
│   Linear Markdown:                                                  │
│   - 传统阅读体验                                                    │
│   - 适合打印、导出                                                  │
│   - SEO友好                                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Technical Architecture

### Canvas Engine

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Canvas Engine | **React Flow** | Mature, open-source, active community |
| Layout Algorithm | **Dagre** or **ELK** | Hierarchical layout for decision trees |
| State Management | **Zustand** | Lightweight, canvas state management |
| Persistence | **Supabase** | Existing infrastructure |
| Collaboration | **Yjs** (P2) | CRDT-based real-time sync |

### Canvas Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│   CANVAS ARCHITECTURE                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────┐                                               │
│   │ Canvas Editor   │  ← React Flow                                 │
│   │ (React Flow)    │                                               │
│   └────────┬────────┘                                               │
│            │                                                         │
│            ▼                                                         │
│   ┌─────────────────┐                                               │
│   │ Canvas State    │  ← Zustand Store                              │
│   │ (Zustand)       │                                               │
│   └────────┬────────┘                                               │
│            │                                                         │
│            ▼                                                         │
│   ┌─────────────────┐     ┌─────────────────┐                      │
│   │ Canvas → MD     │ ←→  │ MD → Canvas     │                      │
│   │ Converter       │     │ Converter       │                      │
│   └────────┬────────┘     └────────┬────────┘                      │
│            │                       │                                 │
│            └───────────┬───────────┘                                │
│                        │                                            │
│                        ▼                                            │
│   ┌─────────────────────────────────┐                              │
│   │ Auto-Save                       │                              │
│   │ (Debounced → Supabase)          │                              │
│   └─────────────────────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Performance Considerations

| Scenario | Solution |
|----------|----------|
| Large canvas (>100 nodes) | Virtualization, grouping suggestion |
| Real-time collaboration | Yjs CRDT (P2) |
| Mobile rendering | Simplified view, touch gestures |
| SEO | Pre-rendered HTML snapshot |

---

## 8. Success Metrics

### Outcome Metrics (North Star)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Sessions Synced | 1,000+/month by month 6 | MCP logs |
| Decisions Extracted | 5,000+ by month 6 | Database count |
| Canvas Articles Published | 300+ by month 6 | Database count |
| Canvas Engagement | 50% readers use Canvas view | Analytics |
| Knowledge Retrievals | 500+/month by month 6 | API analytics |

### AI-Specific Metrics
| Metric | Target | Failure Threshold |
|--------|--------|-------------------|
| Sync Success Rate | 99% | <95% triggers investigation |
| Decision Extraction Quality | 80% user-approved | <60% triggers prompt review |
| Canvas Auto-Layout Acceptance | 70% (minor adjustments) | <50% triggers algorithm review |
| Draft Acceptance Rate | 70% (minor edits only) | <50% triggers prompt review |
| Generation Latency P95 | <15s | >30s triggers optimization |

### Canvas-Specific Metrics (NEW)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Avg Nodes per Article | 5-15 nodes | Database analysis |
| Canvas vs Markdown Preference | 60% Canvas | Editor mode tracking |
| Canvas View Engagement | 50% readers interact | Analytics |
| Canvas Completion Rate | 80% published articles have canvas | Database count |

### Business Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 1,000 by month 6 | Supabase auth |
| Weekly Active Syncers | 30% of registered | MCP logs |
| Trial-to-Paid Conversion | 10% | Subscription data |

---

## 9. Constraints & Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Canvas learning curve | Medium | Medium | Auto-layout, templates, dual mode |
| Canvas performance | Medium | Medium | React Flow optimization, virtualization |
| MCP adoption slow | Medium | High | Clear docs, one-click setup |
| Decision extraction quality | Medium | High | Human-in-the-loop review |
| Mobile canvas UX | High | Medium | Touch gestures, simplified view |
| SEO for canvas content | Medium | High | HTML snapshot, structured metadata |

### Hard Constraints
- **Cost:** User bears LLM API costs (BYOK model)
- **Latency:** MCP sync <5s, Decision extraction <10s, Canvas generation <15s
- **Privacy:** L3 data never accessible to any LLM
- **Format:** All published content must have Canvas + Markdown dual format
- **Mobile:** Canvas must be viewable on mobile (read-only minimum)

### Out of Scope (V1)
- Platform-provided LLM (BYOK only)
- BYODB (Bring Your Own Database)
- Mobile native apps
- Video/multimedia content
- Social distribution
- MCP Marketplace
- Agent Runtime (use Claude Code's)
- Real-time collaboration (P2)
- Custom node types (P2)

---

## 10. Implementation Roadmap

### Phase 1: Canvas Foundation (2 weeks)
- [ ] React Flow integration
- [ ] Core node types (problem, decision, code, insight, output)
- [ ] Core edge types (because, but, therefore, alternative, implements)
- [ ] Basic canvas editor (create, edit, delete, connect)
- [ ] Canvas state persistence

### Phase 2: AI Integration (2 weeks)
- [ ] Decision Graph extraction
- [ ] Canvas Auto-Layout from decisions
- [ ] Canvas ↔ Markdown sync
- [ ] Dual-layer publishing

### Phase 3: Polish & Launch (2 weeks)
- [ ] Canvas templates
- [ ] Mobile view optimization
- [ ] SEO (HTML snapshot)
- [ ] Performance optimization
- [ ] User testing & feedback

---

## References

| Doc | Purpose |
|-----|---------|
| `docs/architecture/ADR-001` | Database Multi-Tenant Isolation |
| `docs/architecture/ADR-002` | Business Model & Data Access |
| `docs/architecture/ADR-003` | MCP Commercial Architecture |
| `docs/specifications/MCP_SERVICE_DESIGN.md` | MCP technical design |
| `docs/INTERFACE_CONTRACT.md` | API contracts |
| Anthropic 2026 Agentic Coding Report | Industry trends validation |
| React Flow Documentation | Canvas engine reference |

---

## Appendix: Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| V1.0 | 2026-03-20 | Initial lean template PRD |
| V2.0 | 2026-03-20 | Added AI-Native definition, Dual-Layer, Core Loop |
| V3.0 | 2026-03-20 | Repositioned as Knowledge Asset Platform, added Decision Graph |
| V3.1 | 2026-03-20 | Added Canvas Editor, Node+Edge model, Canvas Auto-Layout |

---

**Document Version:** 3.1
**Status:** Draft - Ready for Discussion
**Key Changes from V3:**
1. Added Article Canvas Editor as P0 feature
2. Added Canvas Auto-Layout from Decision Graph
3. Added Canvas ↔ Markdown dual mode
4. Defined Node Types (problem/decision/code/insight/output)
5. Defined Edge Types (because/but/therefore/alternative/implements)
6. Added Canvas-specific data schemas
7. Added Canvas-specific metrics
8. Updated Core Loop with Canvas generation