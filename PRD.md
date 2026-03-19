# PRD (Product Requirements Document)

> **Version:** 2.0
> **Updated:** 2026-03-19
> **Authority:** CAO Architecture Decision ADR-002

---

## Product Vision

**Viblog** - An AI-Native Blogging Platform for Vibe Coders.

**Mission:** Help every vibe coder manage their coding experience data, transform it into valuable content, and grow through community sharing.

**Core Value Proposition:** "Growth Has Value" (成长是有价值的)

---

## Value Proposition Statement

### For Vibe Coders

> After a day of vibe coding with Claude Code or OpenClaw, you shouldn't need to spend hours manually writing a blog post. Viblog's MCP service automatically syncs your development sessions and AI helps summarize them into polished blog posts - building your personal IP while you focus on coding.

### The Problem We Solve

| Pain Point | Solution |
|------------|----------|
| Claude Code session logs scattered everywhere | Structured storage via MCP service |
| Manual blog writing is time-consuming | AI auto-summarizes sessions into posts |
| Can't find previous solutions to similar problems | AI-powered retrieval from personal knowledge base |
| Want to learn from other vibe coders | Community sharing with AI-enhanced discovery |
| Personal growth not visible | Growth trajectory visualization |

---

## Business Model

### Phase 1: Data Management + Community Foundation

**Core Value:** Data management tool + AI auto-blogging

**User Value:**
- Structured storage of vibe coding data
- AI-powered automatic blog generation
- Personal knowledge base with AI retrieval
- Community content sharing

**Monetization:** Subscription unlocks LLM access to public articles

### Phase 2: Platform LLM + Specialized Capabilities (Future)

**Trigger:** Dynamic decision based on user base and content volume

**Core Value:** Platform-specialized LLM optimized for vibe coding context

**User Value:**
- More accurate article recommendations
- Deeper writing assistance
- Better code architecture suggestions

---

## Data Governance Model

### User Data Ownership

```
┌─────────────────────────────────────────────────────────────────┐
│   USER DATA OWNERSHIP                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User Owns:                                                    │
│   ├── raw_sessions (development session records)               │
│   ├── insights (AI-extracted insights)                         │
│   ├── drafts (work-in-progress content)                        │
│   ├── private_articles (unpublished articles)                  │
│   └── public_articles (published articles - user retains rights)│
│                                                                 │
│   Platform Holds:                                               │
│   └── public_articles (read-only copy for community access)    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Layer Architecture

| Layer | Definition | Human Access | LLM Access |
|-------|------------|--------------|------------|
| L0 Public Articles | User-published content | All users | Subscription required |
| L1 Private Articles | Unpublished drafts | Owner only | Owner's LLM only |
| L2 Development Data | Sessions, insights, annotations | Owner only | Owner's LLM only |
| L3 Identity Data | Account, API keys, DB connections | Owner only | No LLM access |

---

## AI Access Control

### User LLM vs Platform LLM

**User LLM:**
- User configures their own LLM API (Claude, OpenAI, etc.)
- User's LLM can access user's own data (L1, L2)
- User's LLM can access public articles (L0) with subscription
- User maintains full control

**Platform LLM (Phase 2):**
- Viblog-trained specialized model
- Requires explicit user authorization to access user data
- Cannot access L2 (development data) or L3 (identity data)

### AI Access Permission Matrix

| Data Layer | Free User LLM (Trial) | Free User LLM (Official) | Subscriber LLM | Platform LLM |
|------------|----------------------|-------------------------|----------------|--------------|
| L0 Public Articles | Allowed | Not Allowed | Allowed | Allowed |
| L1 Private Articles | Allowed | Allowed | Allowed | Requires Auth |
| L2 Development Data | Allowed | Allowed | Allowed | Not Allowed |
| L3 Identity Data | Not Allowed | Not Allowed | Not Allowed | Not Allowed |

---

## User Stories

### US-100: AI Auto-Blogging (Core Feature)

**As a** vibe coder
**I want** my development sessions automatically summarized into blog posts
**So that** I can build my personal IP without manual effort

**Acceptance Criteria:**
- MCP service syncs development sessions
- AI generates blog post draft from sessions
- User can edit and publish
- Published articles appear in public feed

### US-101: LLM Configuration

**As a** user
**I want** to configure my own LLM API
**So that** I can use AI to analyze my data

**Acceptance Criteria:**
- Settings page for LLM API configuration
- Support for multiple providers (Anthropic, OpenAI, etc.)
- API key encrypted storage
- Test connection functionality

### US-102: Subscription Management

**As a** user
**I want** to subscribe to unlock LLM access to public articles
**So that** I can learn from community content

**Acceptance Criteria:**
- Subscription plans displayed
- Payment integration
- Automatic permission upgrade
- Clear value proposition

### US-103: Data Export

**As a** user
**I want** to export all my data
**So that** I have full control over my content

**Acceptance Criteria:**
- One-click export
- All user data included
- Standard format (JSON/Markdown)

---

## Commercial Timeline

### Trial Period (0-6 months)

**Goal:** User acquisition + content accumulation

**Strategy:**
- All features unlocked
- User LLM can access all public articles
- Build user habit and value perception

**Actions:**
- Month 4: Start subscription preview
- Month 5: Early bird pricing announcement
- Month 6: Transition to official pricing

### Official Period (6+ months)

**Goal:** Subscription conversion

**Pricing:** $9.9/month

**Early Bird:** First 1000 subscribers get $4.9/month permanent

**Value Delivered:**
- LLM access to all public articles
- AI-powered content discovery
- Personalized recommendations

---

## Success Metrics

### Phase 1 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 1,000+ by month 6 | Analytics |
| Public Articles | 500+ by month 6 | Database count |
| Weekly Active Users | 30% of registered | Analytics |
| Session Syncs | 100+ per week | MCP service logs |

### Conversion Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Trial-to-Paid Conversion | 10% | Subscription data |
| Churn Rate | <5%/month | Subscription data |
| NPS Score | >50 | User surveys |

---

## Technical Requirements

### Security Requirements

- Row Level Security (RLS) on all tables
- Encryption for sensitive data
- API key secure storage
- Audit logging for data access

### Performance Requirements

- API response time < 200ms (P95)
- Page load time < 2s
- MCP sync latency < 5s

### Availability Requirements

- 99.9% uptime SLA for paid users
- 99% uptime for free users

---

## Out of Scope (Phase 1)

- BYODB (Bring Your Own Database) implementation
- Platform LLM training
- OAuth for external data sources
- Mobile native apps

---

## References

- ADR-001: Database Multi-Tenant Isolation Redesign (`docs/dev-logs/ADR-001-Database-Multi-Tenant-Isolation.md`)
- ADR-002: Business Model and Data Access Architecture (`docs/dev-logs/ADR-002-Business-Model-Data-Access.md`)
- ADR-003: MCP Layer 5 Commercial Architecture (`docs/dev-logs/ADR-003-MCP-Commercial-Architecture.md`)
- Database Redesign Plan: `docs/dev-logs/database-redesign-plan-CAO-2026-03-19.md`
- MCP Service Design: `docs/VIBLOG_MCP_SERVICE_DESIGN.md`

---

**Document Version:** 2.0
**Last Updated:** 2026-03-19
**Next Review:** After Phase 1 completion