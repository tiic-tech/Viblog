# ADR-001: Database Multi-Tenant Isolation Redesign

> **Status:** Proposed
> **Created:** 2026-03-19
> **Authority:** CAO (Chief Architect Officer)
> **Related:** ADR-002 (Business Model and Data Access Architecture)

---

## Context

The current database architecture lacks proper multi-tenant isolation. Critical issues include:

1. `article_paragraphs` table has no `user_id`, allowing cross-user vector search results
2. RLS policies documented but not implemented in migrations
3. Single encryption key for all data
4. No Access Proxy Layer for BYODB security

---

## Decision

Implement comprehensive multi-tenant isolation through:

1. **Add `user_id` to all tables** lacking it (with automatic population triggers)
2. **Create RLS migration files** for all tables
3. **Add data classification columns** (L1/L2/L3)
4. **Implement key hierarchy for encryption** (Phase 2)

---

## Consequences

### Positive

- Proper data isolation between users
- Foundation for BYODB implementation
- Compliance-ready security posture
- Reduced risk of data exposure

### Negative

- Requires migration of existing data
- Potential performance impact from RLS checks
- Increased complexity in queries
- Service role must be carefully managed

---

## Alternatives Considered

| Alternative | Decision | Rationale |
|-------------|----------|-----------|
| Minimal fix only | Rejected | Ongoing security risk |
| Hybrid approach | Rejected | Higher total cost |
| Application-level filtering | Rejected | Insufficient for security |

---

## Implementation Notes

- Migrations must be run in order
- Backfill must complete before NOT NULL constraint
- Triggers ensure future data consistency
- Rollback script available for emergencies

---

## Related Documents

- **ADR-002:** Business Model and Data Access Architecture
- **Database Redesign Plan:** `docs/dev-logs/database-redesign-plan-CAO-2026-03-19.md`
- **PRD v2.0:** `PRD.md`

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| CAO | Chief Architect Officer | 2026-03-19 | Proposed |

---

**Document Version:** 1.0
**Last Updated:** 2026-03-19