# ADR-003: MCP Layer 5 Commercial Architecture

> **Status:** Approved
> **Created:** 2026-03-19
> **Authority:** CAO (Chief Architect Officer)
> **Related:** ADR-002 (Business Model and Data Access Architecture)

---

## Context

Following ADR-002 which established the Data Layer Architecture (L0-L3) and AI Access Permission Matrix, we need to define the commercial model for MCP Layer 5 tools (Intelligent Learning & Growth).

**Key Questions:**
1. How to lock user LLM access permissions for "Growth Has Value"?
2. Should entire Layer 5 be subscription-only, or granular features?
3. What is the right balance between free value and subscription incentive?

---

## Decision

### 1. Permission at Data Source Level (Not Layer Level)

**Principle:** Lock access to `community_articles` data source, not entire tools.

**Rationale:**
- Users should always access their own data (FREE)
- Community data access is the premium value (SUBSCRIPTION)
- This creates a natural upgrade path: self-analysis → community comparison

### 2. Layer 5 Tool Permission Matrix

| Tool | Free User | Subscriber |
|------|-----------|------------|
| `learn_from_articles` | user_articles only | user + community |
| `analyze_project_health` | self analysis | + community comparison |
| `create_project_assistant` | user_articles | + community_articles |
| `get_growth_metrics` | self metrics | + community benchmark |
| `check_content_freshness` | FREE | FREE |
| `evaluate_article_value` | - | SUBSCRIPTION |
| `discover_content_opportunities` | - | SUBSCRIPTION |
| `track_similar_developers` | - | SUBSCRIPTION |

### 3. Value Proposition Design

**Free User Value:**
- "知道自己有什么" (Know what you have)
- Self-analysis, self-metrics, self-freshness check
- Full access to personal data

**Subscriber Value:**
- "知道自己在哪里，知道差距有多大，知道往哪里走"
- Community benchmarking
- Article value evaluation
- Content opportunity discovery
- Peer tracking

### 4. New Subscription-Only Tools

**evaluate_article_value:**
- Compare with community to assess uniqueness
- Identify improvement opportunities
- Value increase roadmap

**discover_content_opportunities:**
- Find content gaps in community
- Trend riding suggestions
- Unique angle recommendations

**track_similar_developers:**
- Find peers with similar skills
- Learn from their journeys
- Collective insights

---

## Implementation

### Permission Check Pattern

```typescript
// In every Layer 5 tool
if (usesCommunityData && !user.hasSubscription) {
  throw new PermissionError({
    code: "SUBSCRIPTION_REQUIRED",
    message: "Community data requires subscription",
    fallback: "Use self-only data",
    upgrade_url: "/pricing"
  });
}
```

### Subscription Status Check

```typescript
interface UserSubscription {
  isTrial: boolean;           // Trial period (0-6 months)
  trialEndDate?: Date;
  isSubscribed: boolean;      // Active subscription
  isEarlyBird: boolean;       // Early bird pricing
}

function hasLLMCommunityAccess(user: UserSubscription): boolean {
  // Trial users: Full access
  if (user.isTrial) return true;

  // Subscribers: Full access
  if (user.isSubscribed) return true;

  // Free official users: No community access
  return false;
}
```

---

## Consequences

### Positive

1. **Clear Upgrade Path:** Users experience value before paying
2. **Natural Lock:** Community data is clearly premium value
3. **User Trust:** Free users keep full control of own data
4. **Sustainable:** Clear monetization through community access

### Negative

1. **Complexity:** Need permission check in each tool
2. **UX Challenge:** Clear communication of free vs premium
3. **Conversion Risk:** Users may not see upgrade value

### Mitigation

1. Permission middleware in Access Proxy Layer
2. Clear UI indicators for [FREE] vs [SUBSCRIPTION]
3. Trial period gives full access to demonstrate value

---

## Related Documents

- **ADR-002:** Business Model and Data Access Architecture
- **PRD v2.0:** Product Requirements Document
- **IMPLEMENTATION_PLAN v3.0:** Implementation Roadmap
- **VIBLOG_MCP_SERVICE_DESIGN v5.0:** MCP Tool Specifications

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| CAO | Chief Architect Officer | 2026-03-19 | Approved |

---

**Document Version:** 1.0
**Last Updated:** 2026-03-19