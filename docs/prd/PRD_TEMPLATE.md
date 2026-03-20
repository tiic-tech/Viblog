# PRD Template

> **Version:** 1.0
> **Purpose:** Lean, precise PRD for AI-Native products
> **Lines:** ~100 (vs ~200 industry average)

---

## Template Analysis

### Original Template Strengths
1. Problem-first approach (Section 1)
2. AI-Native specific chapter (Section 4)
3. Evaluation metrics included
4. Core principles actionable

### Original Template Weaknesses
1. Too verbose (~200 lines)
2. Overlapping sections (Use Cases vs Features)
3. Duplicates Architecture docs content
4. Operational details (Rollout) not strategic
5. Meta section can be simplified

---

## Refined Template

```markdown
# [Product Name] PRD

**Version:** X.X | **Status:** Draft/Review/Final
**Owner:** [Name] | **Updated:** YYYY-MM-DD

---

## 1. Problem Definition

### Background
- **Industry Context:** [2-3 sentences]
- **Current Flow (As-Is):** [Brief description]
- **Structural Problem:** [Root cause, not symptoms]

### Core Problem Statement
> In [Context], users cannot [Goal], because [Blocking Factor].

### Problem Decomposition
| Type | Gap | Impact |
|------|-----|--------|
| Functional | [Missing capability] | [User impact] |
| Cognitive | [Mental load issue] | [User impact] |
| Efficiency | [Time/cost issue] | [Business impact] |
| Data | [Fragmentation issue] | [System impact] |

---

## 2. Product Strategy

### Positioning
| Element | Definition |
|---------|------------|
| Target User | [Primary persona] |
| JTBD | [Job To Be Done] |
| Current Alternative | [How users solve today] |

### AI Role Definition
| Level | Description | This Product |
|-------|-------------|--------------|
| Copilot | AI assists, human decides | [Yes/No] |
| Agent | AI executes, human reviews | [Yes/No] |
| System Brain | AI decides autonomously | [Yes/No] |

### Value Proposition
| Stakeholder | Value |
|-------------|-------|
| User | [Primary benefit] |
| System | [Efficiency/quality gain] |
| Data | [Flywheel effect] |

---

## 3. Core Features

### Feature Matrix
| Feature | Priority | AI Involvement | User Control |
|---------|----------|----------------|--------------|
| [Feature 1] | P0 | [Perception/Reasoning/Action] | [Auto/Semi-auto/Manual] |
| [Feature 2] | P1 | [AI role] | [Control level] |

### Feature Spec Template (per P0 feature)

#### [Feature Name]

| Attribute | Specification |
|-----------|---------------|
| Trigger | [What initiates] |
| Input | [Required data] |
| Processing | [AI + Logic flow] |
| Output | [Result format] |
| Failure | [Fallback behavior] |
| Edge Cases | [Known edge cases] |

---

## 4. AI System Design

### Capability Breakdown
| Capability | Implementation | Fallback |
|------------|----------------|----------|
| Perception | [How AI understands] | [If AI fails] |
| Reasoning | [How AI processes] | [If AI fails] |
| Memory | [Short/Long-term] | [If unavailable] |
| Action | [What AI executes] | [If AI fails] |

### Prompt Strategy
| Component | Approach |
|-----------|----------|
| System Prompt | [Core instruction] |
| Context Injection | [RAG/History/None] |
| Few-shot | [Examples/None] |

### Human-in-the-Loop
| Decision Point | Auto/Semi-auto/Manual | Rationale |
|----------------|----------------------|-----------|
| [Decision 1] | [Level] | [Why] |
| [Decision 2] | [Level] | [Why] |

---

## 5. Data Model

### Core Entities
| Entity | Owner | AI Generated | Shared |
|--------|-------|--------------|--------|
| [Entity 1] | [User/System] | [Yes/No] | [Yes/No] |
| [Entity 2] | [Owner] | [AI gen?] | [Shared?] |

### Data Flow
```
[Input Source] → [Processing] → [Storage] → [Output]
```

### Security
- **Multi-tenant:** [Strategy]
- **Isolation:** [RLS/Schema-based]
- **Privacy:** [User data handling]

---

## 6. Success Metrics

### Outcome Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| [North Star] | [Target value] | [How measured] |
| [Secondary 1] | [Target] | [Method] |

### AI-Specific Metrics
| Metric | Target | Failure Threshold |
|--------|--------|-------------------|
| Task Success Rate | [%] | [%] |
| Latency P95 | [ms] | [ms] |
| Retry Rate | [%] | [%] |
| User Satisfaction | [Score] | [Score] |

---

## 7. Constraints & Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | [H/M/L] | [H/M/L] | [Strategy] |
| [Risk 2] | [P] | [I] | [M] |

### Hard Constraints
- **Cost:** [Token/Compute limit]
- **Latency:** [Response time requirement]
- **Privacy:** [Compliance requirements]

---

## References

| Doc | Location |
|-----|----------|
| Architecture | `docs/architecture/ADR-XXX.md` |
| Implementation | `plans/BACKEND_IMPLEMENTATION_PLAN.md` |
| Interface | `docs/INTERFACE_CONTRACT.md` |
```

---

## Writing Rules

### Rule 1: System Behavior, Not UI

| Bad | Good |
|-----|------|
| User clicks button | System receives input |
| Page shows result | System returns structured output |

### Rule 2: AI is System Layer, Not Feature

PRD must answer:
- Where is AI in the stack?
- Can AI be swapped/replaced?
- What if AI fails?

### Rule 3: All AI Output Must Be Controllable

Every AI feature needs:
- Retry mechanism
- Edit capability
- Fallback behavior

### Rule 4: Explicit Automation Level

| Level | Description |
|-------|-------------|
| Auto | AI decides, user notified |
| Semi-auto | AI proposes, user confirms |
| Manual | User initiates, AI assists |

---

## What NOT to Include

| Content | Where It Belongs |
|---------|------------------|
| Technical architecture | ADR documents |
| Implementation tasks | IMPLEMENTATION_PLAN |
| API contracts | INTERFACE_CONTRACT |
| UI/UX specifications | Design Spec |
| Deployment strategy | Ops/DevOps docs |
| Future roadmap | Separate roadmap doc |

---

## Template Usage

1. **Copy** template to `docs/prd/[PRODUCT]_PRD.md`
2. **Fill** each section (skip if not applicable)
3. **Remove** this guide section
4. **Review** against Writing Rules
5. **Finalize** status to Final

---

**Document Version:** 1.0
**Created:** 2026-03-20