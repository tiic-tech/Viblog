# Viblog PRD V1

**Version:** 1.0 | **Status:** Draft
**Owner:** CAO | **Updated:** 2026-03-20

---

## 1. Problem Definition

### Background
- **Industry Context:** AI-assisted coding (Vibe Coding) is becoming mainstream. Developers spend hours in Claude Code, Cursor, Copilot sessions daily.
- **Current Flow (As-Is):** Session context is lost after coding ends. Developers manually write blogs or documentation to share knowledge.
- **Structural Problem:** No bridge exists between development sessions and content creation. The value generated during vibe coding is ephemeral.

### Core Problem Statement
> After a vibe coding session, developers cannot **preserve and share their learning**, because **session context is scattered and manual content creation is time-consuming**.

### Problem Decomposition
| Type | Gap | Impact |
|------|-----|--------|
| Functional | No automatic session-to-content pipeline | Knowledge loss after each session |
| Cognitive | Manual blog writing requires context reconstruction | 2-4 hours per article |
| Efficiency | Session data unstructured | Cannot find previous solutions |
| Data | No unified storage for development context | No personal knowledge base |

---

## 2. Product Strategy

### Positioning
| Element | Definition |
|---------|------------|
| Target User | Vibe Coders using Claude Code, Cursor, OpenClaw |
| JTBD | Transform development sessions into valuable content automatically |
| Current Alternative | Manual copy-paste to Notion/blogs, or lose the knowledge |

### AI Role Definition
| Level | Description | This Product |
|-------|-------------|--------------|
| Copilot | AI assists, human decides | Yes - Content generation suggestions |
| Agent | AI executes, human reviews | Yes - MCP sync, draft generation |
| System Brain | AI decides autonomously | No - User controls publish |

**AI Position:** Agent-level for data sync and draft generation, Copilot-level for content refinement.

### Value Proposition
| Stakeholder | Value |
|-------------|-------|
| User | Zero-effort content creation from coding sessions |
| System | Accumulates structured vibe coding knowledge |
| Data | More sessions → Better drafts → More users → More sessions |

---

## 3. Core Features

### Feature Matrix
| Feature | Priority | AI Involvement | User Control |
|---------|----------|----------------|--------------|
| MCP Session Sync | P0 | Agent (Auto) | Semi-auto |
| AI Draft Generation | P0 | Agent (Auto) | Semi-auto |
| Article Publishing | P0 | None | Manual |
| Personal Knowledge Base | P1 | Copilot | Manual |
| Community Feed | P1 | Copilot (Discovery) | Manual |
| LLM Configuration | P1 | None | Manual |
| Subscription System | P2 | None | Manual |

### Feature Specs

#### MCP Session Sync (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User initiates via Claude Code MCP tool |
| Input | Session fragments (prompts, responses, code, outputs) |
| Processing | MCP server → API → Supabase storage |
| Output | Structured vibe_session with fragments |
| Failure | Queue retry, user notified |
| Edge Cases | Large sessions chunked, duplicates detected |

#### AI Draft Generation (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User requests draft from session |
| Input | vibe_session ID, optional preferences |
| Processing | User's LLM → Session context → Markdown draft |
| Output | Article draft in vibe_session |
| Failure | Fallback to template, user edits manually |
| Edge Cases | Empty session → Prompt user for more context |

#### Article Publishing (P0)

| Attribute | Specification |
|-----------|---------------|
| Trigger | User clicks publish |
| Input | Draft content, visibility setting |
| Processing | Markdown → HTML, generate slug, update status |
| Output | Published article URL |
| Failure | Save as draft, show error |
| Edge Cases | Duplicate title → Auto-append timestamp |

---

## 4. AI System Design

### Capability Breakdown
| Capability | Implementation | Fallback |
|------------|----------------|----------|
| Perception | Parse session fragments into structured data | Template-based extraction |
| Reasoning | User LLM generates coherent narrative | Template-based draft |
| Memory | Session storage + article history | None (stateless fallback) |
| Action | Create draft, publish article | Manual user action |

### Prompt Strategy
| Component | Approach |
|-----------|----------|
| System Prompt | "You are a technical writer transforming coding sessions into blog posts" |
| Context Injection | Session fragments + user preferences |
| Few-shot | None (V1), future: learn from user's published style |

### Human-in-the-Loop
| Decision Point | Level | Rationale |
|----------------|-------|-----------|
| Session Sync | Semi-auto | User initiates, AI executes |
| Draft Generation | Semi-auto | AI creates, user reviews/edits |
| Publishing | Manual | User must approve public content |
| LLM Selection | Manual | User configures own API |

---

## 5. Data Model

### Core Entities
| Entity | Owner | AI Generated | Shared |
|--------|-------|--------------|--------|
| vibe_session | User | Partial (AI extracts insights) | No |
| session_fragment | User | No | No |
| article | User | Yes (draft content) | If published |
| user | User | No | No |

### Data Layers
| Layer | Definition | Human Access | LLM Access |
|-------|------------|--------------|------------|
| L0 Public Articles | Published content | All | Subscriber only |
| L1 Private Articles | Drafts | Owner | Owner's LLM |
| L2 Session Data | Raw sessions | Owner | Owner's LLM |
| L3 Identity | Account, API keys | Owner | None |

### Data Flow
```
Claude Code → MCP Server → API → Supabase (L2)
                                        ↓
User LLM → Draft Generation → Supabase (L1)
                                        ↓
User Publish → Supabase (L0) → Community Feed
```

### Security
- **Multi-tenant:** Row Level Security (RLS) on all tables
- **Isolation:** user_id column on all data tables
- **Privacy:** L3 data never exposed to any LLM

---

## 6. Success Metrics

### Outcome Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 1,000 by month 6 | Supabase auth |
| Published Articles | 500 by month 6 | Database count |
| Weekly Active Syncs | 100+ sessions | MCP logs |

### AI-Specific Metrics
| Metric | Target | Failure Threshold |
|--------|--------|-------------------|
| Sync Success Rate | 99% | <95% triggers investigation |
| Draft Acceptance Rate | 70% (user publishes without major rewrite) | <50% triggers prompt review |
| Generation Latency P95 | <10s | >30s triggers optimization |
| User Satisfaction | NPS >50 | NPS <30 triggers UX review |

### Conversion Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Trial-to-Paid | 10% | Subscription data |
| Churn Rate | <5%/month | Subscription data |

---

## 7. Constraints & Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| LLM API cost overrun | Medium | High | User provides own API key |
| MCP adoption slow | Medium | High | Clear onboarding, documentation |
| Content quality issues | Medium | Medium | Edit UI, draft preview |
| Privacy concerns | Low | High | Clear data ownership, RLS |

### Hard Constraints
- **Cost:** User bears LLM API costs (BYOK - Bring Your Own Key)
- **Latency:** MCP sync <5s, Draft generation <15s
- **Privacy:** L3 data never accessible to any LLM

### Out of Scope (V1)
- Platform LLM (user provides own)
- BYODB (Bring Your Own Database)
- Mobile native apps
- OAuth for external data sources

---

## References

| Doc | Location |
|-----|----------|
| Architecture | `docs/architecture/ADR-001` through `ADR-004` |
| Implementation | `plans/BACKEND_IMPLEMENTATION_PLAN.md` |
| Interface | `docs/INTERFACE_CONTRACT.md` |
| MCP Design | `docs/specifications/MCP_SERVICE_DESIGN.md` |

---

**Document Version:** 1.0
**Status:** Draft - Awaiting Review