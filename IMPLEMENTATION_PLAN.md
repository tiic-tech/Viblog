# IMPLEMENTATION_PLAN

> **Version:** 3.0
> **Updated:** 2026-03-19
> **Authority:** CAO Architecture Decision ADR-002
> **Phase:** Phase 0 - Technical Foundation

---

## Document Navigation

| Document | Purpose | Status |
|----------|---------|--------|
| `PRD.md` | Product Requirements | ✅ Updated 2026-03-19 |
| `TECH_STACK.md` | Technology Choices | 📋 Needs Update |
| `IMPLEMENTATION_PLAN.md` | Development Tasks | ✅ Active |
| `CHANGELOG.md` | Change History | ✅ Updated 2026-03-19 |
| `DEVELOPLOG.md` | Development Log | ✅ Updated 2026-03-19 |
| `APP_FLOW.md` | User Flows | 📋 Needs Update |
| `BACKEND_STRUCTURE.md` | Backend Architecture | 📋 Needs Update |
| `FRONTEND_GUIDELINES.md` | UI/UX Guidelines | 📋 Needs Update |
| `PRODUCT_COMP_ANALYSIS.md` | Competitive Analysis | 📋 Needs Update |
| `CLAUDE.md` | Project Instructions | ✅ Active |

---

## Previous Archive

Full IMPLEMENTATION_PLAN content archived to: `mcp_service_phase_docs/IMPLEMENTATION_PLAN.md`

---

## Architecture Overview

### Data Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│   DATA LAYER ARCHITECTURE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   L0 Public Articles                                            │
│   ├── User-published content                                    │
│   ├── Human access: All users                                   │
│   └── LLM access: Subscription required                         │
│                                                                 │
│   L1 Private Articles                                           │
│   ├── Unpublished drafts                                        │
│   ├── Human access: Owner only                                  │
│   └── LLM access: Owner's LLM only                              │
│                                                                 │
│   L2 Development Data                                           │
│   ├── Sessions, insights, annotations                           │
│   ├── Human access: Owner only                                  │
│   └── LLM access: Owner's LLM only                              │
│                                                                 │
│   L3 Identity Data                                              │
│   ├── Account, API keys, DB connections                         │
│   ├── Human access: Owner only                                  │
│   └── LLM access: Not allowed                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI Access Permission Matrix

| Data Layer | Free User LLM (Trial) | Free User LLM (Official) | Subscriber LLM | Platform LLM |
|------------|----------------------|-------------------------|----------------|--------------|
| L0 Public Articles | Allowed | Not Allowed | Allowed | Allowed |
| L1 Private Articles | Allowed | Allowed | Allowed | Requires Auth |
| L2 Development Data | Allowed | Allowed | Allowed | Not Allowed |
| L3 Identity Data | Not Allowed | Not Allowed | Not Allowed | Not Allowed |

---

## Phase Roadmap

### Phase 0: Technical Foundation (Week 1-2)

**Goal:** Establish multi-tenant data isolation foundation

**Sprint 0.1: Database Schema Migration**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Add user_id to all tenant tables | P0 | 4h | Pending |
| Create RLS policies for all tables | P0 | 8h | Pending |
| Migrate article_paragraphs schema | P0 | 2h | Pending |
| Create migration scripts (6 files) | P0 | 4h | Pending |
| Write migration rollback scripts | P0 | 2h | Pending |
| Test RLS policies with multiple users | P0 | 4h | Pending |

**Sprint 0.2: Security Hardening**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Implement encryption key separation | P0 | 4h | Pending |
| Add audit logging for data access | P1 | 4h | Pending |
| Create API key secure storage | P0 | 4h | Pending |
| Security review with security-reviewer | P0 | 2h | Pending |

**Deliverables:**
- [ ] All tables have user_id column
- [ ] RLS policies enforce tenant isolation
- [ ] Encryption keys separated by user
- [ ] Audit logging functional

---

### Phase 1: Data Management Core (Week 3-6)

**Goal:** Enable MCP service sync and AI auto-blogging

**Sprint 1.1: MCP Service Integration**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design MCP sync protocol | P0 | 4h | Pending |
| Implement session sync endpoint | P0 | 8h | Pending |
| Create insight extraction pipeline | P0 | 8h | Pending |
| Build annotation storage system | P1 | 6h | Pending |
| Write MCP service tests | P0 | 4h | Pending |

**Sprint 1.2: AI Auto-Blogging**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design blog generation prompt | P0 | 4h | Pending |
| Implement session-to-article pipeline | P0 | 8h | Pending |
| Create draft editing interface | P0 | 6h | Pending |
| Build publish workflow | P0 | 4h | Pending |
| Write E2E tests for auto-blogging | P0 | 4h | Pending |

**Sprint 1.3: Public Article Feed**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design public article schema | P0 | 4h | Pending |
| Implement article feed API | P0 | 6h | Pending |
| Build feed UI component | P0 | 6h | Pending |
| Add search and filtering | P1 | 4h | Pending |
| Write API integration tests | P0 | 4h | Pending |

**Deliverables:**
- [ ] MCP service syncs development sessions
- [ ] AI generates blog post drafts from sessions
- [ ] Users can edit and publish articles
- [ ] Published articles appear in public feed

---

### Phase 2: User LLM Configuration (Week 7-10)

**Goal:** Enable users to configure their own LLM for data access

**Sprint 2.1: LLM Provider Settings**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design LLM configuration schema | P0 | 4h | Pending |
| Implement provider adapters (Anthropic, OpenAI) | P0 | 8h | Pending |
| Create API key encryption and storage | P0 | 6h | Pending |
| Build settings UI page | P0 | 6h | Pending |
| Test connection functionality | P0 | 4h | Pending |

**Sprint 2.2: AI Access Proxy Layer**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design access proxy architecture | P0 | 4h | Pending |
| Implement permission checking middleware | P0 | 8h | Pending |
| Create data access abstraction layer | P0 | 8h | Pending |
| Build context builder for LLM | P0 | 6h | Pending |
| Write proxy layer tests | P0 | 4h | Pending |

**Sprint 2.3: Permission Enforcement**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Implement trial period detection | P0 | 2h | Pending |
| Create subscription status checker | P0 | 4h | Pending |
| Build LLM access gate | P0 | 6h | Pending |
| Add permission error handling | P0 | 4h | Pending |
| Write permission tests | P0 | 4h | Pending |

**Deliverables:**
- [ ] Users can configure their own LLM API
- [ ] Access proxy layer enforces permissions
- [ ] Trial users have full LLM access
- [ ] Official free users have restricted LLM access

---

### Phase 3: Subscription System (Week 11-14)

**Goal:** Implement monetization and subscription management

**Sprint 3.1: Subscription Plans**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design subscription schema | P0 | 4h | Pending |
| Integrate payment provider (Stripe) | P0 | 8h | Pending |
| Create subscription UI | P0 | 6h | Pending |
| Implement early bird pricing | P0 | 4h | Pending |
| Write subscription tests | P0 | 4h | Pending |

**Sprint 3.2: Permission Upgrade**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Implement subscription status webhook | P0 | 4h | Pending |
| Create permission upgrade flow | P0 | 6h | Pending |
| Build subscription management page | P0 | 6h | Pending |
| Add subscription status indicators | P1 | 4h | Pending |
| Write upgrade flow tests | P0 | 4h | Pending |

**Sprint 3.3: Trial Period Management**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Implement trial period timer | P0 | 4h | Pending |
| Create trial expiration warnings | P0 | 4h | Pending |
| Build transition to official flow | P0 | 6h | Pending |
| Add early bird countdown | P1 | 4h | Pending |
| Write trial management tests | P0 | 4h | Pending |

**Deliverables:**
- [ ] Users can subscribe to unlock LLM access to public articles
- [ ] Payment integration functional
- [ ] Automatic permission upgrade on subscription
- [ ] Trial period management working

---

### Phase 4: Community & Growth (Week 15-18)

**Goal:** Enhance community features and user growth

**Sprint 4.1: Content Discovery**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Implement article recommendation | P1 | 8h | Pending |
| Build trending articles algorithm | P1 | 6h | Pending |
| Create tag-based discovery | P1 | 4h | Pending |
| Add author follow feature | P1 | 6h | Pending |
| Write discovery tests | P1 | 4h | Pending |

**Sprint 4.2: Growth Trajectory**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design growth metrics dashboard | P1 | 6h | Pending |
| Implement coding statistics | P1 | 8h | Pending |
| Create growth visualization | P1 | 6h | Pending |
| Build export functionality | P1 | 4h | Pending |
| Write growth feature tests | P1 | 4h | Pending |

**Sprint 4.3: Data Export**

| Task | Priority | Est. Hours | Status |
|------|----------|------------|--------|
| Design export format (JSON/Markdown) | P1 | 4h | Pending |
| Implement one-click export | P1 | 6h | Pending |
| Create export scheduling | P2 | 4h | Pending |
| Build export history | P2 | 4h | Pending |
| Write export tests | P1 | 4h | Pending |

**Deliverables:**
- [ ] Users can discover relevant content
- [ ] Growth trajectory visualization functional
- [ ] One-click data export working

---

## Critical Path

```
Phase 0 (Foundation)
    │
    ├── RLS Migration ──┬──► Phase 1 (MCP Service)
    │                   │
    └── Security ───────┘
                            │
                            ├── MCP Sync ──┬──► Phase 2 (LLM Config)
                            │              │
                            └── Auto-blog ─┘
                                                │
                                                ├── Provider Settings ──┬──► Phase 3 (Subscription)
                                                │                       │
                                                └── Access Proxy ───────┘
                                                                        │
                                                                        ├── Payment ──┬──► Phase 4 (Community)
                                                                        │             │
                                                                        └── Trial ────┘
```

---

## Quality Gates

### Technical Review (CTO)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Architecture Alignment | Grade A | Design review |
| Code Quality | Grade A | Code review |
| Security Posture | Grade A | Security audit |
| Test Coverage | 80%+ | Coverage report |

### Design Review (Chief UI Officer)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Visual Hierarchy | Grade A | Design audit |
| Component Design | Grade A | Component review |
| Premium Feel | Grade A | User testing |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| RLS policy complexity | Medium | High | Thorough testing, rollback scripts |
| LLM provider API changes | Low | Medium | Provider abstraction layer |
| Payment integration issues | Low | High | Stripe sandbox testing |
| Trial period conversion | Medium | Medium | Clear value proposition, early bird |

---

## Success Metrics

### Phase 0-1 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| RLS Policy Coverage | 100% tables | Database audit |
| MCP Sync Success Rate | 99%+ | Service logs |
| Auto-blog Quality | User satisfaction | Feedback |

### Phase 2-3 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| LLM Config Success | 95%+ | API tests |
| Subscription Conversion | 10% | Billing data |
| Churn Rate | <5%/month | Subscription data |

### Phase 4 Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 1,000+ by month 6 | Analytics |
| Public Articles | 500+ by month 6 | Database count |
| Weekly Active Users | 30% of registered | Analytics |

---

## References

- ADR-001: Database Multi-Tenant Isolation Redesign
- ADR-002: Viblog Business Model and Data Access Architecture
- ADR-003: MCP Layer 5 Commercial Architecture
- Database Redesign Plan: `docs/dev-logs/database-redesign-plan-CAO-2026-03-19.md`
- PRD Version 2.0: `PRD.md`
- MCP Service Design: `docs/VIBLOG_MCP_SERVICE_DESIGN.md`

---

**Document Version:** 3.0
**Last Updated:** 2026-03-19
**Next Review:** After Phase 0 completion