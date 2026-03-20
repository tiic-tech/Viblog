# ADR-006: Viblog V3.4 Gap Resolution Plan

> **Status:** Proposed
> **Created:** 2026-03-20
> **Authority:** CAO + CTO + CUIO Joint Analysis
> **Related:** ADR-005 (Session Fragment OpenAI Format)

---

## 1. Context

Viblog经历了两个开发阶段：
- **MVP Phase (Phase 1-9):** 基础文章系统、用户认证、公开页面
- **MCP Service Phase (Phase 10-11):** MCP Server、7个工具实现

现在需要基于PRD V3.4进行架构重塑。

---

## 2. Gap Analysis Summary

### 2.1 Overall Assessment

| Layer | PRD V3.4 Requirement | Current State | Completion |
|-------|---------------------|---------------|------------|
| Foundation | MCP + OpenAI Format + Metrics | MCP ✅, OpenAI 🟡, Metrics ❌ | 40% |
| Public Layer | Dashboard + Profile + Timeline | Profile 🟡, Others ❌ | 15% |
| Private Layer | Agent + Workflow + Insights | All ❌ | 0% |

### 2.2 Critical Gaps

| Gap | Impact | Source | Priority |
|-----|--------|--------|----------|
| SessionFragment not OpenAI format | Blocks multi-platform support | CTO | P0 |
| Metrics Engine missing | Blocks Efficiency Dashboard | CAO/CTO | P0 |
| article_paragraphs no user_id | Security risk | CTO | P0 |
| No session_fragments API tests | Regression risk | CTO | P1 |
| Missing UI components | Blocks Public Layer | CUIO | P0 |

---

## 3. Component Analysis

### 3.1 Components to Keep (可沿用)

| Component | Status | Action |
|-----------|--------|--------|
| `vibe_sessions` table | ✅ Ready | Add products relationship |
| MCP Server (7 tools) | ✅ Complete (203 tests) | Update OpenAI format output |
| `profiles` table | ✅ Ready | Extend for public metrics |
| `projects` table | ✅ Ready | Map to products concept |
| Article CRUD | ✅ Complete | Keep as-is |
| Public Profile UI | 🟡 Partial | Extend with metrics |
| Dashboard UI framework | 🟡 Partial | Rebuild for Efficiency Dashboard |
| Design System tokens | ✅ Excellent | A-grade, ready to use |

### 3.2 Components to Modify (需调整)

| Component | Current | Target | Action |
|-----------|---------|--------|--------|
| `session_fragments` schema | Custom format | OpenAI format | Execute ADR-005 migration |
| `profiles` | Basic fields | Add public_metrics_enabled, show_velocity, etc. | Schema extension |
| MCP Server output | Simplified format | OpenAI ContentBlock[] | Update tool handlers |
| Dashboard page | Articles/Projects list | Efficiency metrics | New components |

### 3.3 Components to Create (需新建)

**Database Tables:**

| Table | Priority | Purpose |
|-------|----------|---------|
| `metrics_cache` | P0 | Store calculated efficiency metrics |
| `agent_configs` | P1 | Agent Team Manager settings |
| `workflows` | P1 | Workflow Library templates |
| `workflow_steps` | P1 | Workflow step definitions |
| `growth_insights` | P2 | Growth Insights data |

**API Routes:**

| Route | Priority | Purpose |
|-------|----------|---------|
| `/api/metrics/calculate` | P0 | Trigger metrics calculation |
| `/api/metrics/dashboard` | P0 | Get dashboard data |
| `/api/products/[id]/showcase` | P0 | Product showcase management |
| `/api/agent-configs/` | P1 | Agent config CRUD |
| `/api/workflows/` | P1 | Workflow CRUD |

**UI Components:**

| Component | Priority | Purpose |
|-----------|----------|---------|
| `EfficiencyDashboard` | P0 | Core dashboard with metrics |
| `MetricsCard` | P0 | Individual metric display |
| `GrowthTrajectoryChart` | P0 | METR learning curve |
| `SessionTimeline` | P0 | Session history view |
| `ProductShowcase` | P0 | Product cards with metrics |
| `AgentTeamManager` | P1 | Agent configuration UI |
| `WorkflowLibrary` | P1 | Workflow browsing UI |
| `GrowthInsightsPanel` | P2 | Insights display |

### 3.4 Components to Remove (需移除)

**None required** - Current components can be extended or repurposed.

---

## 4. Decision

### 4.1 Architecture Decisions

1. **Execute ADR-005:** Migrate `session_fragments` to OpenAI format
2. **Build Metrics Engine:** Create calculation service with caching
3. **Keep `projects` table:** Map to PRD `products` concept semantically
4. **Extend profiles:** Add public metrics visibility controls

### 4.2 Implementation Order

```
Phase 0: Foundation (1-2 weeks)
├── P0: ADR-005 Execution (session_fragments migration)
├── P0: Metrics Engine Implementation
├── P0: Security Fix (article_paragraphs user_id)
└── P1: API Test Coverage

Phase 1: Public Layer (2 weeks)
├── P0: Efficiency Dashboard UI
├── P0: Public Profile Enhancement
├── P0: Session Timeline View
└── P0: Product Showcase

Phase 2: Private Layer (2 weeks)
├── P1: Agent Team Manager
├── P1: Workflow Library
└── P2: Growth Insights
```

---

## 5. Technical Decisions

### 5.1 Metrics Engine Architecture

```
┌─────────────────────────────────────────────┐
│  Metrics Engine                             │
├─────────────────────────────────────────────┤
│                                             │
│  Sessions ──► Calculator ──► Cache         │
│                              │              │
│                              ▼              │
│                         Dashboard API       │
│                                             │
└─────────────────────────────────────────────┘
```

**Metrics to Calculate:**
- Velocity: features/week
- Efficiency: hours/feature
- Token Economy: output/input ratio
- Iteration Ratio: revisions/initial
- Cache Efficiency: cached/total
- AI Leverage: generated/manual lines

### 5.2 SessionFragment Migration Strategy

```
Step 1: Create session_fragments_v2 with OpenAI schema
Step 2: Keep old table for backward compatibility
Step 3: Update MCP Server to output OpenAI format
Step 4: Migrate historical data
Step 5: Verify and switch over
Step 6: Remove old table (after 90 days)
```

### 5.3 Chart Library Decision

**Recommendation:** Recharts
- React-native, accessible
- Good documentation
- Matches existing tech stack

---

## 6. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data loss during migration | High | Medium | Backup first, batch migration, keep old table 90 days |
| Metrics calculation performance | Medium | Medium | Async worker, incremental updates |
| OpenAI format incompatibility | Medium | Low | Validate in MCP Server first |
| Dashboard refactor breaks existing | Low | Low | Feature flag, gradual rollout |

---

## 7. Consequences

### Positive
- Clear roadmap for PRD V3.4 alignment
- Existing components can be reused
- Design system ready for use

### Negative
- Significant migration work required
- Metrics Engine needs new development
- Test coverage gaps need addressing

### Risks
- SessionFragment migration complexity
- Performance optimization needed for metrics

---

## 8. Action Items

| Action | Owner | Priority | Due |
|--------|-------|----------|-----|
| Approve ADR-005 | CAO | P0 | Immediate |
| Create ADR-007 (Metrics Engine) | CAO | P0 | Day 1 |
| Execute session_fragments migration | Backend | P0 | Week 1 |
| Implement Metrics Engine | Backend | P0 | Week 1-2 |
| Fix article_paragraphs security | Backend | P0 | Week 1 |
| Build Efficiency Dashboard UI | Frontend | P0 | Week 2-3 |
| Add API test coverage | Backend | P1 | Week 2 |

---

## 9. References

- PRD V3.4: `docs/prd/Viblog_PRD_V3.4.md`
- ADR-005: `docs/architecture/ADR-005-Session-Fragment-OpenAI-Format.md`
- CAO Gap Analysis: Full report in agent output
- CTO Gap Analysis: Full report in agent output
- CUIO Gap Analysis: Full report in agent output

---

**Document Version:** 1.0
**Created:** 2026-03-20
**Status:** Proposed - Awaiting Approval