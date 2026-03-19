# ADR-002: Business Model and Data Access Architecture

> **Status:** Approved
> **Created:** 2026-03-19
> **Authority:** CAO (Chief Architect Officer)
> **Related:** ADR-001 (Database Multi-Tenant Isolation), ADR-003 (MCP Layer 5 Commercial Architecture)

---

## Context

Viblog needs a clear business model and data access architecture that:

1. Ensures user data sovereignty
2. Provides clear value proposition for subscription
3. Enables sustainable commercial operation
4. Maintains user trust

---

## Decision

### 1. Data Layer Architecture

| Layer | Name | Description | Human Access | LLM Access |
|-------|------|-------------|--------------|------------|
| L0 | Public Articles | User-published content | All users | Subscription required |
| L1 | Private Articles | Unpublished drafts | Owner only | Owner's LLM only |
| L2 | Development Data | Sessions, insights, annotations | Owner only | Owner's LLM only |
| L3 | Identity Data | Account, API keys, DB connections | Owner only | Not allowed |

### 2. Commercial Model

| Phase | Period | Features | Price |
|-------|--------|----------|-------|
| Trial | 0-6 months | All features unlocked | Free |
| Official | 6+ months | Basic features | Free |
| Subscription | 6+ months | Full LLM access | $9.9/month |
| Early Bird | First 1000 | Full LLM access | $4.9/month (permanent) |

### 3. LLM Access Control

| User Type | L0 | L1 | L2 | L3 |
|-----------|----|----|----|----|
| Trial User | Full | Owner only | Owner only | Blocked |
| Free Official | Blocked | Owner only | Owner only | Blocked |
| Subscriber | Full | Owner only | Owner only | Blocked |
| Platform LLM | Full | Requires auth | Blocked | Blocked |

---

## Consequences

### Positive

- Clear value proposition for subscription
- User data sovereignty maintained
- Sustainable business model
- User trust through transparency

### Negative

- Complexity in permission management
- Need for Access Proxy Layer
- Trial-to-paid conversion risk

---

## Mitigation Strategies

1. **Permission complexity:** Access Proxy Layer abstraction
2. **Trial conversion:** Clear value demonstration during trial
3. **User trust:** Transparent data access policies

---

## Related Documents

- **ADR-001:** Database Multi-Tenant Isolation Redesign
- **ADR-003:** MCP Layer 5 Commercial Architecture
- **PRD v2.0:** `PRD.md`
- **IMPLEMENTATION_PLAN v3.0:** `IMPLEMENTATION_PLAN.md`

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| CAO | Chief Architect Officer | 2026-03-19 | Approved |

---

**Document Version:** 1.0
**Last Updated:** 2026-03-19