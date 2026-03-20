# Frontend Implementation Plan

> **Version:** 2.0
> **Updated:** 2026-03-20
> **Authority:** CAO Architecture Decision ADR-006
> **Phase:** Phase 0 - Foundation
> **PRD:** V3.4 Dual-Layer Architecture

---

## Overview

This plan covers frontend implementation aligned with PRD V3.4 Dual-Layer Architecture:
- **Foundation Layer:** Metrics visualization infrastructure
- **Public Layer:** Efficiency Dashboard + Profile + Timeline + Product Showcase
- **Private Layer:** Agent Manager UI + Workflow Library UI + Growth Insights UI

**Worktree:** `.claude/worktrees/frontend`
**Branch:** `feature/phase0-frontend`

---

## Gap Analysis Summary

Based on CUIO analysis (ADR-006):

| Component | Current State | Required | Gap |
|-----------|---------------|----------|-----|
| Design System | ✅ A-grade (8px grid, tokens) | Ready to use | None |
| Efficiency Dashboard | ❌ Missing | P0 Critical | 100% |
| Session Timeline | ❌ Missing | P0 Critical | 100% |
| Product Showcase | ❌ Missing | P0 Critical | 100% |
| Public Profile | 🟡 Basic | Enhanced with metrics | 60% |
| Agent Team Manager | ❌ Missing | P1 | 100% |
| Workflow Library | ❌ Missing | P1 | 100% |
| Growth Insights | ❌ Missing | P2 | 100% |

---

## Phase 0: Foundation (1 week)

**Goal:** Prepare frontend infrastructure for metrics visualization

### Sprint 0.1: Chart Library Integration

**Priority:** P0 (Critical - Blocks all visualizations)

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Install Recharts library | 1h | Pending | React-native, accessible |
| Create base chart components | 4h | Pending | Line, Bar, Area |
| Design chart theme | 2h | Pending | Match design tokens |
| Create chart wrapper component | 2h | Pending | Responsive, loading states |
| Write chart component tests | 2h | Pending | Snapshot tests |

**Deliverables:**
- [ ] Recharts integrated
- [ ] Base chart components ready
- [ ] Theme matches design system

### Sprint 0.2: Metrics Data Layer

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Create metrics API client | 2h | Pending | Fetch/transform functions |
| Create metrics hooks | 4h | Pending | useMetrics, useDashboard |
| Implement data caching | 2h | Pending | React Query / SWR |
| Create mock data for development | 2h | Pending | Testing without backend |

**Deliverables:**
- [ ] Metrics data layer functional
- [ ] Hooks for data fetching
- [ ] Caching implemented

---

## Phase 1: Public Layer (2 weeks)

**Goal:** Implement "Prove" layer UI components

### Sprint 1.1: Efficiency Dashboard UI

**Priority:** P0 (Core feature)

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design dashboard layout | 4h | Pending | Grid system, responsive |
| Create EfficiencyDashboard component | 6h | Pending | Container component |
| Create MetricsCard component | 4h | Pending | Individual metric display |
| Create GrowthTrajectoryChart component | 6h | Pending | METR learning curve |
| Create VelocityChart component | 4h | Pending | Features/week over time |
| Create EfficiencyChart component | 4h | Pending | Hours/feature over time |
| Create TokenEconomyChart component | 4h | Pending | Output/input ratio |
| Implement dashboard filtering | 4h | Pending | Date range, project filter |
| Write dashboard tests | 4h | Pending | Component tests |

**Deliverables:**
- [ ] EfficiencyDashboard component complete
- [ ] All chart components functional
- [ ] Responsive design implemented

### Sprint 1.2: Session Timeline UI

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design timeline layout | 4h | Pending | Vertical timeline |
| Create SessionTimeline component | 6h | Pending | Timeline container |
| Create SessionCard component | 4h | Pending | Individual session display |
| Create SessionGroup component | 4h | Pending | Group sessions by date |
| Implement timeline filtering | 4h | Pending | By project, status, date |
| Create session detail view | 4h | Pending | Full session content |
| Implement timeline export UI | 2h | Pending | Export buttons |
| Write timeline tests | 4h | Pending | Component tests |

**Deliverables:**
- [ ] SessionTimeline component complete
- [ ] Filtering and grouping working
- [ ] Export functionality ready

### Sprint 1.3: Product Showcase UI

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design showcase layout | 4h | Pending | Card grid |
| Create ProductShowcase component | 6h | Pending | Showcase container |
| Create ProductCard component | 4h | Pending | Product with metrics |
| Create ProductDetail component | 4h | Pending | Full product view |
| Implement showcase management | 4h | Pending | Add/remove products |
| Create visibility controls UI | 2h | Pending | Public/private toggle |
| Write showcase tests | 4h | Pending | Component tests |

**Deliverables:**
- [ ] ProductShowcase component complete
- [ ] Product cards with metrics
- [ ] Management UI functional

### Sprint 1.4: Public Profile Enhancement

**Priority:** P0

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Enhance ProfilePage component | 4h | Pending | Add metrics section |
| Create ProfileMetrics component | 4h | Pending | Public metrics display |
| Create ProfileSettings component | 4h | Pending | Visibility controls |
| Create ProfileBadge component | 2h | Pending | Verification badges |
| Implement profile preview | 2h | Pending | See as public |
| Write profile tests | 4h | Pending | Component tests |

**Deliverables:**
- [ ] Enhanced profile page
- [ ] Public metrics display
- [ ] Visibility controls functional

---

## Phase 2: Private Layer (2 weeks)

**Goal:** Implement "Grow" layer UI components

### Sprint 2.1: Agent Team Manager UI

**Priority:** P1

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design agent manager layout | 4h | Pending | List + detail view |
| Create AgentTeamManager component | 6h | Pending | Container component |
| Create AgentConfigCard component | 4h | Pending | Individual config |
| Create AgentConfigEditor component | 6h | Pending | Config form |
| Create AGENTS.md preview | 4h | Pending | Export preview |
| Implement config export | 4h | Pending | Download AGENTS.md |
| Write agent manager tests | 4h | Pending | Component tests |

**Deliverables:**
- [ ] AgentTeamManager component complete
- [ ] Config editor functional
- [ ] Export to AGENTS.md working

### Sprint 2.2: Workflow Library UI

**Priority:** P1

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design workflow library layout | 4h | Pending | Grid + detail view |
| Create WorkflowLibrary component | 6h | Pending | Container component |
| Create WorkflowCard component | 4h | Pending | Individual workflow |
| Create WorkflowEditor component | 6h | Pending | Workflow builder |
| Create WorkflowExecutor component | 4h | Pending | Step execution UI |
| Implement workflow templates | 4h | Pending | Pre-built workflows |
| Write workflow tests | 4h | Pending | Component tests |

**Deliverables:**
- [ ] WorkflowLibrary component complete
- [ ] Workflow editor functional
- [ ] Execution UI working

### Sprint 2.3: Growth Insights UI

**Priority:** P2

| Task | Est. Hours | Status | Notes |
|------|------------|--------|-------|
| Design insights panel layout | 4h | Pending | Sidebar/modal |
| Create GrowthInsightsPanel component | 6h | Pending | Container component |
| Create InsightCard component | 4h | Pending | Individual insight |
| Create InsightHistory component | 4h | Pending | Past insights |
| Implement insight refresh | 2h | Pending | Regenerate UI |
| Write insights tests | 4h | Pending | Component tests |

**Deliverables:**
- [ ] GrowthInsightsPanel component complete
- [ ] Insight display functional
- [ ] History view working

---

## Component Architecture

### Directory Structure

```
src/components/
├── dashboard/
│   ├── EfficiencyDashboard.tsx
│   ├── MetricsCard.tsx
│   ├── GrowthTrajectoryChart.tsx
│   ├── VelocityChart.tsx
│   ├── EfficiencyChart.tsx
│   └── TokenEconomyChart.tsx
│
├── timeline/
│   ├── SessionTimeline.tsx
│   ├── SessionCard.tsx
│   ├── SessionGroup.tsx
│   └── SessionDetail.tsx
│
├── showcase/
│   ├── ProductShowcase.tsx
│   ├── ProductCard.tsx
│   └── ProductDetail.tsx
│
├── profile/
│   ├── ProfilePage.tsx
│   ├── ProfileMetrics.tsx
│   ├── ProfileSettings.tsx
│   └── ProfileBadge.tsx
│
├── agent-manager/
│   ├── AgentTeamManager.tsx
│   ├── AgentConfigCard.tsx
│   ├── AgentConfigEditor.tsx
│   └── AgentsMdPreview.tsx
│
├── workflows/
│   ├── WorkflowLibrary.tsx
│   ├── WorkflowCard.tsx
│   ├── WorkflowEditor.tsx
│   └── WorkflowExecutor.tsx
│
├── insights/
│   ├── GrowthInsightsPanel.tsx
│   ├── InsightCard.tsx
│   └── InsightHistory.tsx
│
└── charts/
    ├── ChartWrapper.tsx
    ├── LineChart.tsx
    ├── BarChart.tsx
    └── AreaChart.tsx
```

---

## Quality Gates

### Design Review (CUIO) - 16 Metrics

| Metric | Target | Weight |
|--------|--------|--------|
| Visual Hierarchy | Grade A | 9 points |
| Component Design | Grade A | 9 points |
| Premium Feel | Grade A | 9 points |
| Responsive Design | Grade A | 9 points |
| Accessibility | WCAG 2.1 AA | 9 points |
| Motion Design | Smooth, purposeful | 9 points |
| Typography | Clear hierarchy | 9 points |
| Color System | Consistent | 9 points |
| Spacing System | 8px grid | 9 points |
| Interaction Feedback | Immediate, clear | 9 points |
| Error States | Clear, actionable | 9 points |
| Loading States | Informative | 9 points |
| Empty States | Helpful, engaging | 9 points |
| Dark Mode | Complete | 9 points |
| Mobile Experience | Optimized | 9 points |
| Real-World Interaction | Tested | 9 points |

**Pass Threshold:** Grade A (110-129 points)

---

## Design Specifications

| Document | Feature | Status |
|----------|---------|--------|
| Design System Tokens | Foundation | ✅ Ready |
| 8px Grid System | Layout | ✅ Ready |
| `docs/specifications/DUAL_READING_STRUCTURE.md` | Article reading UX | Reference |
| `docs/specifications/IMMERSIVE_EXPERIENCE_DESIGN.md` | Immersive mode | Reference |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Design system fragmentation | Medium | Medium | Regular CUIO reviews |
| Chart performance with large datasets | Medium | Medium | Virtualization, pagination |
| Component reusability | Low | Medium | Component audit |
| Responsive edge cases | Medium | Low | Mobile-first approach |

---

## References

| Document | Purpose |
|----------|---------|
| `PRD_TRACK.md` | Current PRD requirements |
| `docs/architecture/ADR-006` | Gap Resolution Plan |
| `IMPLEMENTING_STATUS.md` | Task status tracking |
| `docs/specifications/` | Feature specifications |

---

**Document Version:** 2.0
**Last Updated:** 2026-03-20
**Authority:** ADR-006 Gap Resolution Plan