# Viblog PRD V3

**Version:** 3.0 | **Status:** Draft
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
| **Output Barrier** | Blog writing takes 2-4 hours | Developers choose not to write | AI auto-generation |
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
| **Dual-Layer Format** | Human-readable + AI-consumable | Markdown + Structured JSON |
| **MCP-Native** | Seamless integration with development tools | viblog-mcp-server |
| **Knowledge ROI** | Quantified value of personal knowledge | Analytics dashboard |

### AI Role Definition
| Level | Description | This Product |
|-------|-------------|--------------|
| Copilot | AI assists, human decides | Content refinement, formatting |
| Agent | AI executes, human reviews | Session sync, draft generation, decision extraction |
| System Brain | AI decides autonomously | No - User controls all publish decisions |

**AI Position:** Agent-level for knowledge pipeline, Copilot-level for content creation.

### Value Proposition
| Stakeholder | Value |
|-------------|-------|
| Developer (Producer) | Zero-effort knowledge asset creation + Personal brand building |
| Developer (Consumer) | Discover curated development knowledge + Learn from others' decisions |
| System | Accumulates structured development knowledge |
| Data Flywheel | More sessions → Better decisions → More knowledge → More users → More sessions |

### Competitive Landscape

| Product | Solves | Viblog Relation |
|---------|--------|-----------------|
| Claude Code | Coding efficiency | **Complement** - We use their runtime |
| Cursor | IDE experience | **Complement** - We use their environment |
| Devin | Task execution | **Complement** - Different layer |
| Notion/Medium | Content publishing | **Disrupt** - AI-Native, not manual |
| Obsidian | Personal notes | **Disrupt** - Auto-generated, not manual |

**Key Insight:**
> We don't compete with Claude Code on **coding**
> We compete with Notion/Medium on **knowledge management**
> With an AI-Native advantage they cannot replicate

---

## 3. Core Features

### Feature Matrix
| Feature | Priority | AI Role | User Control | Rationale |
|---------|----------|---------|--------------|-----------|
| MCP Session Sync | P0 | Agent | Semi-auto | Knowledge data pipeline |
| Decision Graph Extraction | P0 | Agent | Semi-auto | Core differentiation |
| AI Draft Generation | P0 | Agent | Semi-auto | Content creation |
| Dual-Layer Publishing | P0 | Agent | Semi-auto | AI-Native format |
| Knowledge Retrieval | P1 | Copilot | Manual | Reuse value |
| Personal Knowledge ROI | P1 | Copilot | Manual | Value visualization |
| Community Feed | P1 | Copilot | Manual | Distribution |
| LLM Configuration | P1 | None | Manual | User infrastructure |
| Subscription System | P2 | None | Manual | Monetization |

### Core Loop (P0)

```
┌─────────────────────────────────────────────────────────────────┐
│   VIBLOG KNOWLEDGE ASSET LOOP                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Claude Code ──► MCP Sync ──► Session Storage                 │
│        │                    │                                   │
│        │                    ▼                                   │
│        │         Decision Graph Extraction                      │
│        │              (Why did I do this?)                      │
│        │                    │                                   │
│        │         ┌──────────┴──────────┐                        │
│        │         ▼                     ▼                        │
│        │   Knowledge Base        Draft Generation               │
│        │   (Retrieval)                │                         │
│        │         │                    ▼                         │
│        │         │              User Edit                       │
│        │         │                    │                         │
│        │         │                    ▼                         │
│        │         │         Dual-Layer Publish                   │
│        │         │           │         │                        │
│        │         │           ▼         ▼                        │
│        │         │       Markdown    JSON                      │
│        │         │           │         │                        │
│        │         │           ▼         ▼                        │
│        │         │       Human      AI/LLM                      │
│        │         │       Readers    Consumers                   │
│        │         │                                               │
│        │         └────────── Knowledge ROI ◄────────────────────┤
│        │                    (Value量化)                          │
│        │                                                       │
│        └────────────── Better Decisions ───────────────────────┘
│                      (下次做得更好)                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
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

#### Decision Graph Extraction (P0) - NEW

| Attribute | Specification |
|-----------|---------------|
| Trigger | After session sync completes |
| Input | Session fragments (prompts, responses, code changes, errors) |
| Processing | User's LLM extracts: decision, reasoning, alternatives, outcome, confidence |
| Output | `decision_graph` with structured decisions |
| Failure | Log warning, mark session as "unprocessed" |
| JSON Structure | `{ decision_id, decision, reasoning, alternatives[], outcome, confidence, related_fragments[] }` |

**Why This Matters:**
> "Why did I use useEffect instead of server action?"
> "What was the alternative I considered?"
> "What was the outcome?"

This is the **scarce asset** ChatGPT correctly identified.

#### AI Draft Generation (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User requests draft from session |
| Input | `vibe_session` ID + `decision_graph`, optional style preferences |
| Processing | User's LLM → Session + Decisions → Structured draft |
| Output | Article draft with: title, sections, key decisions highlighted |
| Failure | Fallback to template-based extraction |
| Edge Cases | Empty session → Prompt for context; Short session → Combine recent sessions |

#### Dual-Layer Publishing (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User publishes article |
| Input | Draft markdown, decision_graph metadata |
| Processing | 1. Generate Markdown (human-readable) 2. Generate JSON (AI-consumable with decisions) |
| Output | Dual format stored in L0 (public) or L1 (private) |
| Failure | Save as draft, display error, allow retry |
| JSON Structure | `{ article_id, title, summary, key_decisions[], code_snippets[], lessons_learned[], related_topics[] }` |

#### Knowledge Retrieval (P1) - NEW

| Attribute | Specification |
|-----------|---------------|
| Trigger | User searches personal knowledge base |
| Input | Query (natural language) |
| Processing | Vector search over decision_graph + articles |
| Output | Relevant past decisions, code patterns, articles |
| Use Case | "How did I solve authentication last time?" |

#### Personal Knowledge ROI (P1) - NEW

| Attribute | Specification |
|-----------|---------------|
| Trigger | User views dashboard |
| Input | User's sessions, decisions, articles, views |
| Processing | Calculate: sessions processed, decisions extracted, articles published, views received |
| Output | Knowledge asset metrics: sessions synced, decisions captured, articles published, community reach |
| Display | Dashboard with trend visualization |

---

## 4. AI System Design

### Capability Breakdown
| Capability | Implementation | Fallback |
|------------|----------------|----------|
| Perception | Parse fragments into: prompt/response/code/output/error | Regex-based extraction |
| Reasoning | Extract decisions: what/why/alternatives/outcome | Template-based extraction |
| Memory | Short-term: current session; Long-term: decision_graph + articles | None (stateless) |
| Action | Create draft, publish article, retrieve knowledge | Manual user action |

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

**Draft Generation Prompt:**
```
System: You are a technical writer. Transform this coding session into a blog post.

Requirements:
1. Highlight key decisions and reasoning
2. Include code snippets with context
3. Structure for readability (headings, lists)
4. Preserve technical accuracy

Session: {session_data}
Decisions: {decision_graph}
```

### Human-in-the-Loop
| Decision Point | Level | Rationale |
|----------------|-------|-----------|
| Session Sync | Semi-auto | User initiates, AI executes |
| Decision Extraction | Auto | User can review/edit later |
| Draft Generation | Semi-auto | AI creates, user must review |
| Dual-Layer Format | Auto | No user decision needed |
| Publishing | Manual | User approves all public content |
| Visibility Setting | Manual | User controls access |

---

## 5. Data Model

### Core Entities
| Entity | Owner | AI Generated | Visibility |
|--------|-------|--------------|------------|
| `vibe_session` | User | Partial | Private (L2) |
| `session_fragment` | User | No | Private (L2) |
| `decision_graph` | User | Yes (AI) | Private (L2) |
| `article` | User | Yes (draft) | User choice (L0/L1) |
| `article_json` | System | Yes | Same as article |
| `user` | User | No | Private (L3) |

### Decision Graph Schema (NEW)
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

### Data Layers
| Layer | Definition | Human Access | LLM Access |
|-------|------------|--------------|------------|
| L0 | Public Articles (Markdown + JSON) | All users | Subscriber LLM |
| L1 | Private Articles | Owner | Owner LLM |
| L2 | Session Data + Decision Graph | Owner | Owner LLM |
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
                              [Knowledge Retrieval]
                                        │
                                        ▼
[Draft Generation] ◄── Session + Decisions
     │
     ▼
[User Edit]
     │
     ▼
[Dual-Layer Publish] ──► Supabase L0/L1
     │
     ▼
[Community Feed] ──► Human Readers + AI Consumers
```

### Security
- **Multi-tenant:** RLS on all tables via `user_id`
- **Isolation:** User can only access own L1/L2/L3 data
- **Privacy:** L3 never exposed to any LLM (including owner's)

---

## 6. Success Metrics

### Outcome Metrics (North Star)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Sessions Synced | 1,000+/month by month 6 | MCP logs |
| Decisions Extracted | 5,000+ by month 6 | Database count |
| Articles Published | 500+ by month 6 | Database count |
| Knowledge Retrievals | 500+/month by month 6 | API analytics |

### AI-Specific Metrics
| Metric | Target | Failure Threshold |
|--------|--------|-------------------|
| Sync Success Rate | 99% | <95% triggers investigation |
| Decision Extraction Quality | 80% user-approved | <60% triggers prompt review |
| Draft Acceptance Rate | 70% (minor edits only) | <50% triggers prompt review |
| Generation Latency P95 | <15s | >30s triggers optimization |

### Value Metrics (NEW)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Avg Decisions per User | 50+/month | Decision graph count |
| Knowledge Reuse Rate | 30% of users retrieve monthly | Retrieval logs |
| Article View Rate | 10 views/article average | Analytics |
| Conversion to Paid | 10% | Subscription data |

### Business Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 1,000 by month 6 | Supabase auth |
| Weekly Active Syncers | 30% of registered | MCP logs |

---

## 7. Constraints & Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MCP adoption slow | Medium | High | Clear docs, one-click setup, leverage Claude Code ecosystem |
| Decision extraction quality | Medium | High | Human-in-the-loop review, confidence scoring |
| LLM API cost for users | Medium | Medium | User provides own key (BYOK) |
| Content quality issues | Medium | Medium | Edit UI, preview, retry, decision highlighting |
| Privacy concerns | Low | High | Clear ownership, RLS, no L3 access |

### Hard Constraints
- **Cost:** User bears LLM API costs (BYOK model)
- **Latency:** MCP sync <5s, Decision extraction <10s, Draft generation <15s
- **Privacy:** L3 data never accessible to any LLM
- **Format:** All published content must have dual format

### Out of Scope (V1)
- Platform-provided LLM (BYOK only)
- BYODB (Bring Your Own Database)
- Mobile native apps
- Video/multimedia content
- Social distribution
- MCP Marketplace
- Agent Runtime (use Claude Code's)

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

---

## Appendix: V2 vs V3 Comparison

| Dimension | V2 | V3 |
|-----------|----|----|
| **Product Type** | Blog Platform | Knowledge Asset Platform |
| **Core Problem** | Session value lost | Knowledge cannot be captured/monetized |
| **Core Differentiation** | Dual-Layer Format | Decision Graph + Dual-Layer |
| **Key New Feature** | - | Decision Graph Extraction |
| **Key New Feature** | - | Knowledge Retrieval |
| **Key New Feature** | - | Personal Knowledge ROI |
| **Competitive Position** | vs Notion/Medium | Complement Claude Code, Disrupt Notion |
| **Data Model** | Session + Article | Session + Decision + Article |

---

**Document Version:** 3.0
**Status:** Draft - Ready for Discussion
**Key Changes from V2:**
1. Repositioned as Knowledge Asset Platform (not just Blog)
2. Added Decision Graph Extraction as P0 feature
3. Added Knowledge Retrieval as P1 feature
4. Added Personal Knowledge ROI metrics
5. Clarified complementary relationship with Claude Code/Cursor
6. Sharpened problem definition around knowledge monetization