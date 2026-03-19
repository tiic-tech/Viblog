# Database Architecture Technical Review

**Date:** 2026-03-19
**Reviewer:** Chief Technology Officer Agent
**Context:** Review based on ChatGPT architecture consultation discussion
**Platform:** Viblog

---

## Executive Summary

**Overall Score:** 65/100 (Grade C)

**Verdict:** Significant architectural gaps exist. Not ready for production-scale multi-tenant deployment. Requires substantial rework before implementing BYODB and advanced privacy features.

**Key Finding:** The current architecture provides basic user isolation via RLS but lacks critical security infrastructure: no Access Proxy Layer, incomplete data classification, shared embeddings in article_paragraphs, and single-key encryption model. The BYODB implementation stores raw connection strings rather than implementing a secure data access abstraction.

---

## Score Breakdown

| Metric | Score | Weight | Issue Summary |
|--------|-------|--------|---------------|
| Architecture Alignment | 6/10 | Critical | Basic RLS but missing Access Proxy Layer |
| Code Quality | 7/10 | High | Good encryption implementation, clean code |
| Performance Impact | 6/10 | High | Missing indexes, potential N+1 in graph queries |
| Security Posture | 5/10 | Critical | Shared embeddings, single encryption key, no key separation |
| Test Coverage | 5/10 | High | Encryption tested, but no RLS/permission tests |
| Error Handling | 7/10 | Medium | Good try/catch, but silent failures in some paths |
| Maintainability | 7/10 | High | Clean module separation, needs better documentation |
| Scalability | 5/10 | Medium | No Access Proxy will limit horizontal scaling |
| Documentation | 6/10 | Low | RLS policies in markdown, not enforced in migrations |
| Technical Debt | 5/10 | Medium | BYODB design incomplete, privacy_level not enforced |

---

## ChatGPT Discussion Key Recommendations vs Current State

### 1. Multi-Tenant Isolation Strategy

| Recommendation | Current State | Gap |
|---------------|---------------|-----|
| RLS enabled on all tables | Documented but **no migration files** | Critical |
| Access Proxy Layer | **Not implemented** | Critical |
| Per-user role separation | Partial (service role bypasses RLS) | High |
| Data classification (L1/L2/L3) | `privacy_level` fields exist but **not enforced** | Medium |

### 2. BYODB Architecture

| Recommendation | Current State | Gap |
|---------------|---------------|-----|
| Data Source Plugin abstraction | **Stores raw connection strings** | Critical |
| OAuth/scoped tokens instead of secret_key | **Asks for raw credentials** | Critical |
| Access Proxy for external DB access | **Not implemented** | Critical |

### 3. Security Model

| Recommendation | Current State | Gap |
|---------------|---------------|-----|
| Key separation architecture | **Single ENCRYPTION_KEY for all users** | Critical |
| Embeddings isolated per user | `article_paragraphs` **lacks user_id** | Critical |
| Raw context encrypted | `vibe_sessions.raw_context` **plaintext** | High |

---

## Critical Issues (P0 - Blocking)

### Issue 1: Missing RLS Migration Files

**Severity:** P0 - Blocks secure multi-tenant deployment
**Metric:** Security Posture (5/10)

**Problem:**
RLS policies are documented in markdown files but no actual migration SQL files exist. Cannot verify RLS is actually enabled on the database.

**Impact:**
- Service role client bypasses all security
- User data could be exposed
- Cannot implement proper multi-tenancy

**Fix Required:**
Create migration files that:
1. Enable RLS on all tables
2. Create policies matching documentation
3. Add verification queries

---

### Issue 2: Shared Embeddings in article_paragraphs

**Severity:** P0 - Data isolation violation
**File:** `src/types/database.ts:60-95`

**Problem:**
```typescript
article_paragraphs: {
  Row: {
    article_id: string
    content: string
    embedding: string | null  // NO user_id field!
  }
}
```

**Impact:**
- Vector similarity searches may return other users' content
- Cannot enforce privacy in semantic search
- RLS cannot be applied (no user_id to filter)

**Fix Required:**
```sql
ALTER TABLE article_paragraphs
ADD COLUMN user_id UUID REFERENCES profiles(id);

CREATE INDEX idx_article_paragraphs_user ON article_paragraphs(user_id);

ALTER TABLE article_paragraphs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access paragraphs via their articles"
  ON article_paragraphs FOR SELECT
  USING (article_id IN (
    SELECT id FROM articles WHERE user_id = auth.uid()
  ));
```

---

### Issue 3: Single Encryption Key

**Severity:** P0 - Key separation violation
**File:** `src/lib/encryption.ts:17-29`

**Problem:**
All encrypted data uses a single `ENCRYPTION_KEY`. Compromise of this key exposes all user data.

**Impact:**
- No defense in depth
- Cannot implement per-user data isolation at encryption level
- BYODB becomes meaningless (platform can decrypt everything)

**Fix Required:**
Implement key hierarchy:
```
Platform Master Key (ENCRYPTION_KEY env)
    |
    +-> User Derivation Keys (per-user, via HKDF)
            |
            +-> Data Encryption Keys (per-purpose)
```

---

## Gap Analysis vs ChatGPT Recommendations

### Missing Component 1: Access Proxy Layer (CRITICAL)

**Recommendation from ChatGPT:**
> "Access Proxy Layer (mandatory) - prevents direct DB access"

**Current Architecture:**
```
MCP Server -> API Routes -> Supabase (direct access)
                              |
                              v
                          RLS (bypassed by service role)
```

**Recommended Architecture:**
```
MCP Server -> Access Proxy -> Data Source Abstraction
                |
                +-> Permission Verification
                +-> Privacy Level Enforcement
                +-> Audit Logging
                |
                v
            Platform DB or User DB (via secure connector)
```

---

### Missing Component 2: Data Classification Standard

**Recommendation from ChatGPT:**
> "Data Classification (L1: public/computable, L2: business, L3: sensitive)"

**Current State:** PARTIAL

| Level | Definition | Implementation |
|-------|------------|----------------|
| L1 (Public) | Public profiles, published articles | Partially via `visibility` field |
| L2 (Business) | Drafts, projects, insights | Missing classification |
| L3 (Sensitive) | API keys, raw_context | Stored encrypted but no classification tag |

**Required Schema Addition:**
```sql
ALTER TABLE user_insights ADD COLUMN data_classification TEXT
  DEFAULT 'L2' CHECK (data_classification IN ('L1', 'L2', 'L3'));
```

---

### Missing Component 3: Key Separation Architecture

**Recommendation from ChatGPT:**
> "Key Separation - platform DB access should not equal decryption capability"

**Current State:**
```typescript
process.env.ENCRYPTION_KEY  // Single key for ALL encrypted data
```

**Required Architecture:**
```typescript
// Key hierarchy implementation needed
platform_master_key     -> Platform operations
user_key_derivation    -> Per-user data encryption (derived from user secret)
session_key           -> Temporary session data
```

---

## Security Model Findings

### Embedding Isolation Gap

| Table | Has user_id | Isolation Status |
|-------|-------------|------------------|
| `article_paragraphs.embedding` | NO | **CRITICAL: SHARED** |
| `user_insights.embedding` | YES | Isolated |
| `external_links.embedding` | YES | Isolated |

**Risk:** Vector similarity searches (`/api/v1/ai/vectors/[store]/search`) may return results from other users.

---

### Vibe Sessions raw_context Protection

**Finding:** STORED UNENCRYPTED

```typescript
vibe_sessions: {
  Row: {
    raw_context: Json | null  // Contains sensitive coding context - NOT ENCRYPTED
  }
}
```

**Risk Assessment:**
- `raw_context` likely contains code snippets, AI responses, potentially secrets
- Stored as plaintext JSON
- Only protected by RLS (which service role bypasses)

---

## Implementation Roadmap

### Phase 1: Security Foundation (Week 1-2) - P0

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Create RLS migration files | P0 | 2 days | `supabase/migrations/*` |
| Add user_id to article_paragraphs | P0 | 1 day | Migration + Types |
| Implement key hierarchy | P0 | 3 days | `src/lib/encryption/*` |
| Create RLS test suite | P1 | 2 days | `src/lib/supabase/rls.test.ts` |

### Phase 2: Access Proxy (Week 3-4) - P0/P1

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Design Access Proxy architecture | P0 | 2 days | `docs/ACCESS_PROXY.md` |
| Implement Access Proxy core | P0 | 3 days | `src/lib/access-proxy/*` |
| Integrate with API routes | P0 | 2 days | `src/app/api/**` |
| Add audit logging | P1 | 2 days | `src/lib/audit/*` |

### Phase 3: Data Classification (Week 5-6) - P1

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Define classification standard | P1 | 1 day | `docs/DATA_CLASSIFICATION.md` |
| Add classification columns | P1 | 2 days | Migration files |
| Implement privacy filtering | P1 | 2 days | `src/lib/access-proxy/*` |
| Update API routes | P1 | 2 days | `src/app/api/**` |

### Phase 4: BYODB Redesign (Week 7-8) - P2

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Design Data Source Plugin API | P2 | 3 days | `docs/BYODB_PLUGIN.md` |
| Implement OAuth flow | P2 | 3 days | `src/lib/data-sources/*` |
| Migrate existing BYODB users | P2 | 2 days | Migration script |

---

## Recommendations Priority

| Priority | Issue | Impact | Effort |
|----------|-------|--------|--------|
| P0 | Create RLS migration files | Data exposure risk | 2 days |
| P0 | Add user_id to article_paragraphs | Cross-user data leak | 1 day |
| P0 | Implement key hierarchy | Single point of failure | 3 days |
| P1 | Create RLS test suite | Verify security assumptions | 2 days |
| P1 | Define data classification standard | Foundation for privacy features | 1 day |
| P1 | Implement Access Proxy Layer | Required for BYODB security | 5 days |
| P2 | Encrypt raw_context | Protect sensitive session data | 2 days |
| P2 | Redesign BYODB as Data Source Plugin | Better UX and security | 8 days |

---

## Decision Matrix

```
[ ] Grade A or above --> APPROVE for merge
[ ] Grade B --> CONDITIONAL APPROVE (fix P0 first)
[X] Grade C or below --> REJECT, needs rework
```

**Decision:** REJECT - Major architectural changes required before BYODB implementation

**Rationale:**
The current architecture has critical gaps in multi-tenant security. The missing RLS migrations, shared embeddings, and single encryption key create unacceptable risk. These must be addressed before implementing BYODB features. The Access Proxy Layer is not optional for a platform that will store user database credentials.

---

## Technical Debt Summary

| Debt | Severity | Payoff Plan |
|------|----------|-------------|
| Missing RLS migrations | Critical | Phase 1 |
| Shared article_paragraphs embeddings | Critical | Phase 1 |
| Single encryption key | Critical | Phase 1 |
| No Access Proxy Layer | High | Phase 2 |
| No data classification standard | Medium | Phase 3 |
| BYODB stores raw credentials | Medium | Phase 4 |
| raw_context unencrypted | Medium | Phase 2 |

---

**Document Version:** 1.0
**Next Review:** After Phase 1 completion
**Related:** `docs/dev-logs/system-review-2026-03-19.md`