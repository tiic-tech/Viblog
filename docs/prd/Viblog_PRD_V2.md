# Viblog PRD V2

**Version:** 2.0 | **Status:** Draft
**Owner:** CAO | **Updated:** 2026-03-20

---

## 1. Problem Definition

### Background
- **Industry Context:** Vibe Coding (AI-assisted development) is mainstream. Developers spend 4-8 hours daily in Claude Code, Cursor, Copilot sessions.
- **Current Flow (As-Is):** Session ends → Context scattered across tools → Knowledge lost → Manually reconstruct for blog/docs.
- **Structural Problem:** No bridge exists between development sessions and persistent knowledge. The value generated during vibe coding is ephemeral.

### Core Problem Statement
> The value of a vibe coding session **expires when the session ends**, because **session context is scattered and manual reconstruction is time-prohibitive**.

### Problem Decomposition
| Type | Gap | Impact |
|------|-----|--------|
| Functional | No session-to-content pipeline | Knowledge lost daily |
| Cognitive | Manual reconstruction from scattered context | 2-4 hours per article |
| Efficiency | Session data unstructured, non-retrievable | Cannot find previous solutions |
| Data | No unified storage for vibe coding context | No personal knowledge base |
| Distribution | Content locked in one format | Cannot serve AI consumers |

---

## 2. Product Strategy

### Positioning
| Element | Definition |
|---------|------------|
| Target User | Dual-track: A2A Users (Vibe Coders) + Human Readers |
| JTBD | Transform ephemeral coding sessions into persistent, shareable knowledge |
| Current Alternative | Manual copy-paste, Notion/Obsidian, or lose the knowledge |

### AI-Native Definition (Core Differentiation)

Viblog is AI-Native because:

| Pillar | Definition | Implementation |
|--------|------------|----------------|
| **Session-Originated Content** | Content grows from coding sessions, not blank pages | MCP sync → Structured fragments |
| **Dual-Layer Format** | Human-readable + AI-consumable | Markdown + Structured JSON |
| **MCP as Entry Point** | Seamless integration with development tools | viblog-mcp-server |
| **LLM-Optimized Output** | Token-efficient, structured for AI consumption | JSON metadata, semantic indexing |

### AI Role Definition
| Level | Description | This Product |
|-------|-------------|--------------|
| Copilot | AI assists, human decides | Content refinement, formatting |
| Agent | AI executes, human reviews | Session sync, draft generation |
| System Brain | AI decides autonomously | No - User controls all publish decisions |

**AI Position:** Agent-level for data pipeline, Copilot-level for content creation.

### Value Proposition
| Stakeholder | Value |
|-------------|-------|
| A2A User (Producer) | Zero-effort content creation from coding sessions |
| Human Reader (Consumer) | Discover curated vibe coding knowledge |
| System | Accumulates structured development knowledge |
| Data Flywheel | More sessions → Better drafts → More users → More sessions |

---

## 3. Core Features

### Feature Matrix
| Feature | Priority | AI Role | User Control | Rationale |
|---------|----------|---------|--------------|-----------|
| MCP Session Sync | P0 | Agent | Semi-auto | Core data pipeline |
| Dual-Layer Publishing | P0 | Agent | Semi-auto | Core differentiation |
| AI Draft Generation | P0 | Agent | Semi-auto | Content creation |
| Community Feed | P1 | Copilot | Manual | Distribution |
| Personal Knowledge Base | P1 | Copilot | Manual | Retrieval |
| LLM Configuration | P1 | None | Manual | User infrastructure |
| Subscription System | P2 | None | Manual | Monetization |

### Core Loop (P0)

```
┌─────────────────────────────────────────────────────────────┐
│   VIBLOG CORE LOOP                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Claude Code ──► MCP Sync ──► Session Storage             │
│        │                    │                               │
│        │                    ▼                               │
│        │              AI Draft Gen                          │
│        │                    │                               │
│        │                    ▼                               │
│        │              User Edit                             │
│        │                    │                               │
│        │                    ▼                               │
│        │         Dual-Layer Publish                         │
│        │           │         │                              │
│        │           ▼         ▼                              │
│        │       Markdown    JSON                             │
│        │           │         │                              │
│        │           ▼         ▼                              │
│        │       Human      AI/LLM                            │
│        │       Readers    Consumers                         │
│        │                                                   │
│        └────────────── Feedback Loop ──────────────────────┘
│                      (More sessions)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
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

#### Dual-Layer Publishing (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User publishes article |
| Input | Draft markdown, metadata |
| Processing | 1. Generate Markdown (human-readable) 2. Generate JSON (AI-consumable) |
| Output | Dual format stored in L0 (public) or L1 (private) |
| Failure | Save as draft, display error, allow retry |
| JSON Structure | `{ article_id, title, summary, key_decisions[], code_snippets[], lessons_learned[], related_topics[] }` |

#### AI Draft Generation (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User requests draft from session |
| Input | `vibe_session` ID, optional style preferences |
| Processing | User's LLM → Session fragments → Structured draft |
| Output | Article draft with suggested title, sections |
| Failure | Fallback to template-based extraction |
| Edge Cases | Empty session → Prompt user for context; Short session → Combine with recent sessions |

---

## 4. AI System Design

### Capability Breakdown
| Capability | Implementation | Fallback |
|------------|----------------|----------|
| Perception | Parse fragments into: prompt/response/code/output/error | Regex-based extraction |
| Reasoning | User LLM generates narrative from structured fragments | Template-based assembly |
| Memory | Short-term: current session; Long-term: session history | None (stateless) |
| Action | Create draft, publish article | Manual user action |

### Prompt Strategy
| Component | Approach |
|-----------|----------|
| System Prompt | "Transform vibe coding sessions into technical blog posts. Preserve key decisions, code changes, and lessons learned." |
| Context Injection | Full session fragments + user preferences |
| Few-shot | V1: None; V2: Learn from user's published articles |

### Human-in-the-Loop
| Decision Point | Level | Rationale |
|----------------|-------|-----------|
| Session Sync | Semi-auto | User initiates, AI executes |
| Draft Generation | Semi-auto | AI creates, user must review |
| Dual-Layer Format | Auto | No user decision needed |
| Publishing | Manual | User approves all public content |
| Visibility Setting | Manual | User controls access |

---

## 5. Data Model

### Core Entities
| Entity | Owner | AI Generated | Visibility |
|--------|-------|--------------|------------|
| `vibe_session` | User | Partial (insights) | Private (L2) |
| `session_fragment` | User | No | Private (L2) |
| `article` | User | Yes (draft) | User choice (L0/L1) |
| `article_json` | System | Yes | Same as article |
| `user` | User | No | Private (L3) |

### Data Layers
| Layer | Definition | Human Access | LLM Access |
|-------|------------|--------------|------------|
| L0 | Public Articles (Markdown + JSON) | All users | Subscriber LLM |
| L1 | Private Articles | Owner | Owner LLM |
| L2 | Session Data | Owner | Owner LLM |
| L3 | Identity, API Keys | Owner | None |

### Data Flow
```
[Claude Code] ──MCP──► [API] ──► [Supabase L2]
                                    │
                                    ▼
[User LLM] ◄──Session Context── [Draft Gen]
     │
     ▼
[Supabase L1] ──Publish──► [Supabase L0]
                              │
                              ▼
                         [Community Feed]
                              │
                              ▼
                         [Human Readers]
                         [AI Consumers]
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
| Articles Published | 500+ by month 6 | Database count |
| JSON API Requests | 1,000+/month | API analytics |

### AI-Specific Metrics
| Metric | Target | Failure Threshold |
|--------|--------|-------------------|
| Sync Success Rate | 99% | <95% triggers investigation |
| Draft Acceptance Rate | 70% (minor edits only) | <50% triggers prompt review |
| Generation Latency P95 | <10s | >30s triggers optimization |
| JSON Parsing Success | 95% | <90% triggers schema review |

### Business Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 1,000 by month 6 | Supabase auth |
| Weekly Active Syncers | 30% of registered | MCP logs |
| Trial-to-Paid Conversion | 10% | Subscription data |

---

## 7. Constraints & Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MCP adoption slow | Medium | High | Clear docs, one-click setup |
| LLM API cost for users | Medium | Medium | User provides own key (BYOK) |
| Content quality issues | Medium | Medium | Edit UI, preview, retry |
| JSON format drift | Low | Medium | Schema validation, versioning |
| Privacy concerns | Low | High | Clear ownership, RLS, no L3 access |

### Hard Constraints
- **Cost:** User bears LLM API costs (BYOK model)
- **Latency:** MCP sync <5s, Draft generation <15s
- **Privacy:** L3 data never accessible to any LLM
- **Format:** All published content must have dual format

### Out of Scope (V1)
- Platform-provided LLM (BYOK only)
- BYODB (Bring Your Own Database)
- Mobile native apps
- Video/multimedia content
- Social distribution
- MCP Marketplace

---

## References

| Doc | Purpose |
|-----|---------|
| `docs/architecture/ADR-001` | Database Multi-Tenant Isolation |
| `docs/architecture/ADR-002` | Business Model & Data Access |
| `docs/architecture/ADR-003` | MCP Commercial Architecture |
| `docs/specifications/MCP_SERVICE_DESIGN.md` | MCP technical design |
| `docs/INTERFACE_CONTRACT.md` | API contracts |

---

**Document Version:** 2.0
**Status:** Draft - Ready for Discussion