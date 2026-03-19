# ADR-004: Agent Team Architecture Redesign

> **Status:** Proposed
> **Created:** 2026-03-19
> **Authority:** CAO (Chief Architect Officer)
> **Related:** ADR-001, ADR-002, ADR-003

---

## Context

After reviewing the current Agent definitions and workflows, several critical issues were identified:

### Issue 1: Responsibility Overlap

Three levels of "Challenge Before Implement" authority:
- CAO (Level 4)
- CTO (Level 3)
- architect (Level 2)

This creates confusion about who should challenge and when.

### Issue 2: Overly Complex Agent Descriptions

| Agent | Lines | Problem |
|-------|-------|---------|
| CAO | 307 | Too long, hard to grasp core purpose |
| CTO | 670 | Excessive detail, repetitive with CAO |
| CUIO | 848 | Overly prescriptive workflow |
| develop_reviewer | ~500 | 8-step mandatory sequence impractical |

### Issue 3: Impractical Workflows

- 8-step mandatory sequences for reviewers
- Requires SequentialThinking, TaskCreate before actual work
- Real development cannot follow these rigid processes

### Issue 4: Redundant Hierarchy

Three architecture levels (CAO → CTO → architect) with overlapping responsibilities.

---

## Decision

### 1. Simplify to Two-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│   SIMPLIFIED AGENT HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   EXECUTIVE LAYER (Strategic)                                   │
│   ===========================                                   │
│   CAO - Chief Architect Officer                                 │
│   ├── Final architecture authority                              │
│   ├── Strategic decisions                                       │
│   └── Challenge Before Implement (ONLY ONE)                     │
│                                                                 │
│   OPERATIONAL LAYER (Execution)                                 │
│   ==============================                                │
│   CTO - Implementation Quality                                  │
│   CUIO - Visual Excellence                                      │
│                                                                 │
│   SPECIALIST LAYER (Domain Experts)                             │
│   =================================                             │
│   planner, architect, code-reviewer, security-reviewer,         │
│   database-reviewer, tdd-guide, e2e-runner                      │
│                                                                 │
│   PUBLISHER LAYER (Documentation)                               │
│   =================================                             │
│   develop_reviewer, design_reviewer                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Clear Responsibility Boundaries

| Agent | ONE Core Responsibility | Invokes |
|-------|------------------------|---------|
| CAO | Architecture decisions & challenges | CTO, CUIO for approval |
| CTO | Implementation quality (10 metrics) | Specialists for deep analysis |
| CUIO | Visual quality (15 metrics) | design_reviewer for audit |
| architect | System design & ADRs | None (reports to CAO) |
| planner | Task breakdown | None |
| develop_reviewer | Engineering documentation | None |
| design_reviewer | Design documentation | None |

### 3. Simplified Agent Descriptions

**Principle:** Each agent definition should be:
- Maximum 100 lines
- One clear purpose
- Simple invocation trigger
- No mandatory multi-step sequences

### 4. Practical Workflows

Replace rigid sequences with simple triggers:

**Before Implementation:**
```
User Request → CAO Challenge (if architectural) → Proceed
```

**After Implementation:**
```
Code Complete → commit → (develop_reviewer || design_reviewer) → done
```

**Before Merge:**
```
PR Ready → CTO Review (Grade A) → Merge
```

---

## Agent Role Redefinition

### CAO (Chief Architect Officer)

**Purpose:** Strategic architecture authority

**Core Philosophy:** "你负责边界和验收，AI负责提需求"

**Trigger:**
- New architectural decisions
- Technology choices
- Security implications

**Output:** ADR document or approval

---

### CTO (Chief Technology Officer)

**Purpose:** Implementation quality gate

**Focus:** 10 Technical Metrics

**Trigger:**
- Before merge
- After major features
- Technical debt assessment

**Output:** Grade A/B/C/D/F decision

---

### CUIO (Chief UI Officer)

**Purpose:** Visual excellence gate

**Focus:** 15 Design Metrics

**Trigger:**
- After UI changes
- Before production release

**Output:** Grade A/B/C/D/F decision

---

### architect

**Purpose:** System design & ADR creation

**Trigger:**
- Complex feature planning
- Architecture documentation needed

**Relationship:** Reports to CAO for strategic decisions

---

### develop_reviewer

**Purpose:** Document engineering implementation

**Simplified Workflow:**
1. Read git commits
2. Write development log
3. Done

**No mandatory SequentialThinking or TaskCreate**

---

### design_reviewer

**Purpose:** Document design analysis

**Simplified Workflow:**
1. Capture screenshots
2. Analyze against CUIO metrics
3. Write design review
4. Done

---

## Consequences

### Positive

1. Clear responsibility boundaries
2. No confusion about who challenges
3. Practical, executable workflows
4. Faster development cycles
5. Easier agent invocation decisions

### Negative

1. Less prescriptive workflows (may miss edge cases)
2. Relies more on agent judgment

### Mitigation

- CAO provides strategic oversight
- Quality gates (CTO/CUIO) catch issues
- ADRs document decisions

---

## Implementation Plan

1. Rewrite all agent definitions (max 100 lines each)
2. Update CLAUDE.md with simplified workflow
3. Remove redundant "Challenge Before Implement" from CTO and architect
4. Simplify develop_reviewer and design_reviewer workflows
5. Update CHANGELOG.md

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| CAO | Chief Architect Officer | 2026-03-19 | Proposed |

---

**Document Version:** 1.0
**Last Updated:** 2026-03-19