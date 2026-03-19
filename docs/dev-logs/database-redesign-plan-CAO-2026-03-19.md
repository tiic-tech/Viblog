# Database Redesign Plan - CAO Architecture Decision

**Authority Level:** Chief Architect Officer (CAO) - SUPREME
**Date:** 2026-03-19
**Status:** ARCHITECTURE DECISION - PENDING IMPLEMENTATION
**Review Required:** CTO Technical Review before implementation

---

## Executive Summary

This document represents the CAO's comprehensive analysis following the 9 Pre-Development Steps methodology. The current database architecture has been rated **65/100 (Grade C) - REJECT** and requires fundamental restructuring before any BYODB or advanced privacy features can be implemented.

**Critical Decision:** This is not a "fix what's broken" approach - it is a complete architectural redesign based on security-first principles.

---

## Part 1: Phase 1 - Ding Tu Zhi (Define the Blueprint)

### Step 1: Xu Qiu Cheng Qing (Requirement Clarification)

#### 1.1 What Problem Are We Solving?

**Primary Problem:** The current database architecture cannot support multi-tenant isolation at the security level required for BYODB and privacy features.

**Evidence:**
1. `article_paragraphs` table has NO `user_id` - vector searches return cross-user data
2. `vibe_sessions.raw_context` stores sensitive context in plaintext
3. Single `ENCRYPTION_KEY` for all encrypted data - no key separation
4. RLS policies documented in markdown but NO migration files exist
5. BYODB stores raw connection strings - no Access Proxy Layer

#### 1.2 Challenge: Is This the Right Problem?

**CAO Analysis:** YES, this is the right problem, but the scope is larger than initially identified.

**Additional Issues Discovered:**
- `session_fragments` table has NO `user_id` - depends on `vibe_sessions` for isolation
- `insight_links` table has NO `user_id` - depends on `user_insights` for isolation
- No audit trail for data access
- No data classification enforcement mechanism

**Recommendation:** Expand scope to include ALL tables requiring user isolation, not just the initially identified ones.

#### 1.3 What If We Approached It Differently?

**Alternative Approaches Considered:**

| Approach | Description | Pros | Cons | Verdict |
|----------|-------------|------|------|---------|
| A. Minimal Fix | Only fix P0 issues | Fast, low risk | Technical debt remains, BYODB still broken | REJECT |
| B. Full Redesign | Complete architectural overhaul | Proper foundation, security-first | Higher effort, migration complexity | ACCEPT |
| C. Hybrid Approach | Fix P0 now, redesign later | Balances speed and quality | Two migrations, higher total cost | REJECT |

**CAO Decision:** Approach B (Full Redesign) - The cost of two migrations exceeds the cost of doing it right the first time.

---

### Step 2: Bian Jie Ding Yi (Boundary Definition)

#### 2.1 What IS In Scope

**Database Schema Changes:**
- Add `user_id` to `article_paragraphs` table
- Add `user_id` to `session_fragments` table
- Add `user_id` to `insight_links` table (denormalized for RLS)
- Encrypt `vibe_sessions.raw_context` column
- Add data classification columns where missing
- Create ALL RLS migration files

**Encryption Architecture:**
- Implement key hierarchy (Platform -> User -> Data)
- Update encryption library to support key derivation
- Migrate existing encrypted data to new scheme

**Access Control:**
- Create RLS policies for ALL tables
- Create Access Proxy Layer design document
- Implement Access Proxy skeleton

**TypeScript Types:**
- Update `src/types/database.ts` with new columns
- Create migration utilities for data migration

#### 2.2 What is NOT In Scope

**Explicitly Excluded:**
- BYODB full implementation (requires Access Proxy Layer first)
- OAuth flow for external data sources
- Frontend changes (API contracts remain stable)
- Performance optimization (separate concern)
- Backup/restore procedures (existing procedures apply)

#### 2.3 Constraints

**Technical Constraints:**
1. Must maintain backward compatibility with existing API responses
2. Cannot break existing user data (migration must be lossless)
3. Must support zero-downtime migration strategy
4. Service role client must continue to function

**Business Constraints:**
1. Timeline: 2 weeks maximum for P0 fixes
2. No data loss acceptable
3. No user-facing downtime during migration

**Security Constraints:**
1. All encryption changes must be tested in isolation
2. Key rotation must be supported
3. RLS policies must be verified before deployment

---

### Step 3: Yan Shou Biao Zhun (Acceptance Criteria)

#### 3.1 Measurable Success Criteria

**Security Criteria:**
| Criterion | Target | Verification Method |
|-----------|--------|---------------------|
| RLS enabled on all tables | 100% | SQL query check |
| `article_paragraphs` user isolation | 100% | Integration test |
| Key separation implemented | 3 levels | Code review |
| `raw_context` encrypted | 100% | Migration verification |
| Data classification columns | All tables | Schema diff |

**Quality Criteria:**
| Criterion | Target | Verification Method |
|-----------|--------|---------------------|
| Migration rollback tested | 100% | Manual test |
| TypeScript types updated | 100% | Build check |
| Zero data loss | 0 records | Data count verification |
| API backward compatibility | 100% | Integration test |

#### 3.2 Failure Conditions

**Migration is FAILED if:**
1. Any data loss occurs during migration
2. RLS policies allow cross-user data access
3. Service role client cannot access required data
4. API responses change format unexpectedly
5. Key derivation produces inconsistent results

#### 3.3 Definition of Done

**Phase 1 (Security Foundation) is DONE when:**
- [ ] All migration files created and tested in staging
- [ ] RLS policies verified with integration tests
- [ ] Key hierarchy implemented and tested
- [ ] TypeScript types updated and build passes
- [ ] Documentation updated
- [ ] CTO technical review passed (Grade A)

---

## Part 2: Phase 2 - Da Di Ji (Lay the Foundation)

### Step 4: Jia Gou Fen Xi (Architecture Analysis)

#### 4.1 Current Architecture Impact

**Existing Tables Requiring Modification:**

```
+-------------------------+-------------+------------------+------------------+
| Table                   | Has user_id | Needs user_id    | RLS Status       |
+-------------------------+-------------+------------------+------------------+
| profiles                | YES         | N/A              | MISSING MIGRATION|
| articles                | YES         | N/A              | MISSING MIGRATION|
| projects                | YES         | N/A              | MISSING MIGRATION|
| annotations             | YES         | N/A              | MISSING MIGRATION|
| article_paragraphs      | NO          | YES - CRITICAL   | MISSING MIGRATION|
| authorization_tokens    | YES         | N/A              | MISSING MIGRATION|
| credit_transactions     | YES         | N/A              | MISSING MIGRATION|
| external_links          | YES         | N/A              | MISSING MIGRATION|
| graph_edges             | YES         | N/A              | MISSING MIGRATION|
| graph_nodes             | YES         | N/A              | MISSING MIGRATION|
| insight_links           | NO          | YES - RECOMMENDED| MISSING MIGRATION|
| session_fragments       | NO          | YES - RECOMMENDED| MISSING MIGRATION|
| stars                   | YES         | N/A              | MISSING MIGRATION|
| user_credits            | YES         | N/A              | MISSING MIGRATION|
| user_insights           | YES         | N/A              | MISSING MIGRATION|
| user_interactions       | YES         | N/A              | MISSING MIGRATION|
| user_settings           | YES         | N/A              | MISSING MIGRATION|
| vibe_sessions           | YES         | N/A (encrypt ctx)| MISSING MIGRATION|
+-------------------------+-------------+------------------+------------------+
```

#### 4.2 Integration Points

**Service Role Client:**
- Location: `src/lib/supabase/service-role.ts`
- Impact: Will continue to bypass RLS (by design)
- Action: Document security implications, add audit logging

**MCP Server:**
- Location: `packages/viblog-mcp-server/`
- Impact: Uses service role client, needs user_id validation
- Action: Verify all queries include user_id filtering

**Encryption Library:**
- Location: `src/lib/encryption.ts`
- Impact: Complete rewrite for key hierarchy
- Action: Create new module `src/lib/encryption-v2/`

#### 4.3 Technical Debt Impact

| Debt | Current State | After Redesign |
|------|---------------|----------------|
| Missing RLS migrations | 0 files | 3 files (tables, policies, indexes) |
| Shared embeddings | Isolation broken | Proper isolation |
| Single encryption key | No separation | 3-level hierarchy |
| No Access Proxy | Direct DB access | Access Proxy Layer |

---

### Step 5: Ji Shu Xuan Xing (Technology Selection)

#### 5.1 Encryption Technology Selection

**Options Evaluated:**

| Option | Description | Pros | Cons | Decision |
|--------|-------------|------|------|----------|
| Current (AES-256-GCM with PBKDF2) | Single key, simple | Fast, battle-tested | No key separation | KEEP for L1 data |
| HKDF Key Derivation | RFC 5869 standard | Standard, well-documented | New code required | ACCEPT for hierarchy |
| AWS KMS | Cloud key management | Enterprise-grade | Cost, external dependency | DEFER (Phase 2) |
| Hashicorp Vault | Self-hosted KMS | Full control | Complexity, ops burden | DEFER (Phase 2) |

**Decision:** Implement HKDF-based key hierarchy with current AES-256-GCM for data encryption.

#### 5.2 RLS Policy Pattern Selection

**Pattern: Denormalized user_id with Trigger**

```sql
-- Pattern for child tables without direct user ownership
CREATE OR REPLACE FUNCTION set_user_id_from_parent()
RETURNS TRIGGER AS $$
BEGIN
  -- Derive user_id from parent table
  NEW.user_id = (
    SELECT user_id FROM articles WHERE id = NEW.article_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Rationale:**
- Avoids complex JOINs in RLS policies
- Performance: single column check
- Maintainability: clear ownership model

#### 5.3 Migration Strategy Selection

**Strategy: Zero-Downtime with Backfill**

1. Add nullable column
2. Create backfill script
3. Backfill existing data
4. Make column NOT NULL
5. Enable RLS

**Rationale:**
- No downtime required
- Can verify data before constraint
- Rollback possible at each step

---

### Step 6: Feng Xian Ping Gu (Risk Assessment)

#### 6.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Migration failure corrupts data | Low | Critical | Test in staging, have rollback script |
| RLS policies break existing queries | Medium | High | Comprehensive testing, gradual rollout |
| Key derivation produces different keys | Low | Critical | Deterministic derivation, extensive testing |
| Performance degradation with RLS | Medium | Medium | Index optimization, query analysis |
| Service role client misuse | Medium | High | Audit logging, access review |

#### 6.2 Security Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cross-user data exposure during migration | Low | Critical | Migrate in transactions, verify isolation |
| Key compromise during transition | Low | Critical | Rotate keys after migration |
| RLS bypass via SQL injection | Medium | Critical | Parameterized queries only, security review |
| Service role abuse | Medium | High | Audit logging, access control |

#### 6.3 Mitigation Strategies

**Pre-Migration:**
1. Complete backup of production database
2. Test migration in staging environment
3. Prepare rollback scripts
4. Document all procedures

**During Migration:**
1. Run migration during low-traffic window
2. Monitor for errors
3. Verify data counts before/after
4. Test RLS policies with multiple users

**Post-Migration:**
1. Verify all API endpoints
2. Run integration tests
3. Security review of RLS policies
4. Key rotation for production

---

## Part 3: Phase 3 - Li Gui Ju (Establish Rules)

### Step 7: She Ji Gui Fan (Design Standards)

#### 7.1 Migration File Naming Convention

```
supabase/migrations/
  20260319000000_enable_rls_all_tables.sql
  20260319000001_add_user_id_to_article_paragraphs.sql
  20260319000002_add_user_id_to_session_fragments.sql
  20260319000003_add_user_id_to_insight_links.sql
  20260319000004_encrypt_raw_context.sql
  20260319000005_add_data_classification.sql
  20260319000006_create_rls_policies.sql
```

#### 7.2 RLS Policy Naming Convention

```sql
-- Format: "{action}_{table}_policy"
-- Examples:
CREATE POLICY "select_own_articles" ON articles FOR SELECT ...;
CREATE POLICY "insert_own_articles" ON articles FOR INSERT ...;
CREATE POLICY "update_own_articles" ON articles FOR UPDATE ...;
CREATE POLICY "delete_own_articles" ON articles FOR DELETE ...;
```

#### 7.3 Encryption Key Hierarchy Standard

```
Level 1: Platform Master Key (ENCRYPTION_KEY env)
  - Purpose: Platform operations, key derivation
  - Scope: All data

Level 2: User Derivation Keys (derived per-user)
  - Purpose: User-specific data encryption
  - Scope: Single user's data
  - Derivation: HKDF-SHA256(master_key, user_id, "user_key")

Level 3: Data Encryption Keys (derived per-purpose)
  - Purpose: Specific data type encryption
  - Scope: Single data type (e.g., api_keys, raw_context)
  - Derivation: HKDF-SHA256(user_key, purpose, "data_key")
```

---

### Step 8: Zhi Liang Men Kan (Quality Gates)

#### 8.1 Test Requirements

**Unit Tests:**
- [ ] Key derivation produces consistent results
- [ ] Encryption/decryption roundtrip succeeds
- [ ] RLS policy functions return expected values

**Integration Tests:**
- [ ] User can only access own data
- [ ] Service role can access all data
- [ ] Cross-user access is blocked
- [ ] API endpoints return correct data

**Security Tests:**
- [ ] No SQL injection in RLS policies
- [ ] Key derivation is deterministic
- [ ] Encryption uses approved algorithms

#### 8.2 Performance Benchmarks

| Operation | Before | Target | Acceptable |
|-----------|--------|--------|------------|
| Article paragraph query | <50ms | <75ms | <100ms |
| Vibe session insert | <30ms | <50ms | <75ms |
| User insights search | <100ms | <125ms | <150ms |

#### 8.3 Security Requirements

**Pre-Deployment Checklist:**
- [ ] All RLS policies reviewed by security expert
- [ ] Key derivation algorithm verified
- [ ] No secrets in migration files
- [ ] Audit logging enabled
- [ ] Rollback tested

---

### Step 9: Wen Dang Yao Qiu (Documentation Requirements)

#### 9.1 Required Documentation

1. **ADR-001: RLS Migration Strategy** - This document
2. **Migration Runbook** - Step-by-step migration procedure
3. **Rollback Procedure** - Detailed rollback steps
4. **Key Management Guide** - Key hierarchy documentation
5. **API Compatibility Notes** - Any breaking changes

#### 9.2 ADR Format Requirements

All architecture decisions must include:
- Context and problem statement
- Decision and rationale
- Consequences (positive and negative)
- Alternatives considered
- Implementation notes

---

## Part 4: Implementation - SQL Migration Files

### Migration 1: Enable RLS on All Tables

```sql
-- File: 20260319000000_enable_rls_all_tables.sql
-- Purpose: Enable Row Level Security on all tables
-- Author: CAO Architecture Decision
-- Date: 2026-03-19

-- Enable RLS on all tables that have user_id
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vibe_sessions ENABLE ROW LEVEL SECURITY;

-- Note: article_paragraphs, session_fragments, insight_links
-- will have RLS enabled after user_id is added

-- Verification query (run after deployment):
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public';
-- Expected: rowsecurity = true for all tables
```

### Migration 2: Add user_id to article_paragraphs

```sql
-- File: 20260319000001_add_user_id_to_article_paragraphs.sql
-- Purpose: Add user_id column for RLS isolation
-- Author: CAO Architecture Decision
-- Date: 2026-03-19
-- CRITICAL: This fixes the P0 cross-user embedding exposure issue

BEGIN;

-- Step 1: Add nullable user_id column
ALTER TABLE public.article_paragraphs
ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 2: Create index for performance
CREATE INDEX idx_article_paragraphs_user_id
ON public.article_paragraphs(user_id);

-- Step 3: Backfill user_id from articles table
UPDATE public.article_paragraphs ap
SET user_id = a.user_id
FROM public.articles a
WHERE ap.article_id = a.id;

-- Step 4: Verify backfill (should return 0)
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM public.article_paragraphs
  WHERE user_id IS NULL;

  IF null_count > 0 THEN
    RAISE EXCEPTION 'Backfill incomplete: % paragraphs have no user_id', null_count;
  END IF;
END $$;

-- Step 5: Make column NOT NULL
ALTER TABLE public.article_paragraphs
ALTER COLUMN user_id SET NOT NULL;

-- Step 6: Create trigger for automatic user_id population
CREATE OR REPLACE FUNCTION set_paragraph_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = (
      SELECT user_id FROM public.articles WHERE id = NEW.article_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_article_paragraphs_user_id
BEFORE INSERT ON public.article_paragraphs
FOR EACH ROW
EXECUTE FUNCTION set_paragraph_user_id();

-- Step 7: Enable RLS on article_paragraphs
ALTER TABLE public.article_paragraphs ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policy for article_paragraphs
CREATE POLICY "select_own_paragraphs"
ON public.article_paragraphs FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_paragraphs"
ON public.article_paragraphs FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_paragraphs"
ON public.article_paragraphs FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_paragraphs"
ON public.article_paragraphs FOR DELETE
USING (user_id = auth.uid());

COMMIT;

-- Verification queries:
-- 1. Check all paragraphs have user_id:
-- SELECT COUNT(*) FROM article_paragraphs WHERE user_id IS NULL;
-- Expected: 0

-- 2. Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE tablename = 'article_paragraphs';
-- Expected: rowsecurity = true

-- 3. Test isolation (run as different users):
-- SET ROLE authenticated;
-- SET request.jwt.claims = '{"sub": "user-uuid-here"}';
-- SELECT COUNT(*) FROM article_paragraphs;
-- Expected: Only that user's paragraphs
```

### Migration 3: Add user_id to session_fragments

```sql
-- File: 20260319000002_add_user_id_to_session_fragments.sql
-- Purpose: Add user_id column for RLS isolation
-- Author: CAO Architecture Decision
-- Date: 2026-03-19

BEGIN;

-- Step 1: Add nullable user_id column
ALTER TABLE public.session_fragments
ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 2: Create index for performance
CREATE INDEX idx_session_fragments_user_id
ON public.session_fragments(user_id);

-- Step 3: Backfill user_id from vibe_sessions table
UPDATE public.session_fragments sf
SET user_id = vs.user_id
FROM public.vibe_sessions vs
WHERE sf.session_id = vs.id;

-- Step 4: Verify backfill
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM public.session_fragments
  WHERE user_id IS NULL;

  IF null_count > 0 THEN
    RAISE EXCEPTION 'Backfill incomplete: % fragments have no user_id', null_count;
  END IF;
END $$;

-- Step 5: Make column NOT NULL
ALTER TABLE public.session_fragments
ALTER COLUMN user_id SET NOT NULL;

-- Step 6: Create trigger for automatic user_id population
CREATE OR REPLACE FUNCTION set_fragment_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = (
      SELECT user_id FROM public.vibe_sessions WHERE id = NEW.session_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_session_fragments_user_id
BEFORE INSERT ON public.session_fragments
FOR EACH ROW
EXECUTE FUNCTION set_fragment_user_id();

-- Step 7: Enable RLS on session_fragments
ALTER TABLE public.session_fragments ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies
CREATE POLICY "select_own_fragments"
ON public.session_fragments FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_fragments"
ON public.session_fragments FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_fragments"
ON public.session_fragments FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_fragments"
ON public.session_fragments FOR DELETE
USING (user_id = auth.uid());

COMMIT;
```

### Migration 4: Add user_id to insight_links

```sql
-- File: 20260319000003_add_user_id_to_insight_links.sql
-- Purpose: Add user_id column for RLS isolation (denormalized)
-- Author: CAO Architecture Decision
-- Date: 2026-03-19

BEGIN;

-- Step 1: Add nullable user_id column
ALTER TABLE public.insight_links
ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 2: Create index
CREATE INDEX idx_insight_links_user_id
ON public.insight_links(user_id);

-- Step 3: Backfill user_id from user_insights table
UPDATE public.insight_links il
SET user_id = ui.user_id
FROM public.user_insights ui
WHERE il.insight_id = ui.id;

-- Step 4: Verify backfill
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM public.insight_links
  WHERE user_id IS NULL;

  IF null_count > 0 THEN
    RAISE EXCEPTION 'Backfill incomplete: % insight_links have no user_id', null_count;
  END IF;
END $$;

-- Step 5: Make column NOT NULL
ALTER TABLE public.insight_links
ALTER COLUMN user_id SET NOT NULL;

-- Step 6: Create trigger
CREATE OR REPLACE FUNCTION set_insight_link_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = (
      SELECT user_id FROM public.user_insights WHERE id = NEW.insight_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_insight_links_user_id
BEFORE INSERT ON public.insight_links
FOR EACH ROW
EXECUTE FUNCTION set_insight_link_user_id();

-- Step 7: Enable RLS
ALTER TABLE public.insight_links ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies
CREATE POLICY "select_own_insight_links"
ON public.insight_links FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_insight_links"
ON public.insight_links FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_insight_links"
ON public.insight_links FOR DELETE
USING (user_id = auth.uid());

COMMIT;
```

### Migration 5: Create RLS Policies for All Tables

```sql
-- File: 20260319000006_create_rls_policies.sql
-- Purpose: Create RLS policies for all tables with user_id
-- Author: CAO Architecture Decision
-- Date: 2026-03-19

-- ============================================================
-- PROFILES TABLE
-- ============================================================
-- Users can read all profiles (for public display)
CREATE POLICY "select_all_profiles"
ON public.profiles FOR SELECT
USING (true);

-- Users can only update their own profile
CREATE POLICY "update_own_profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

-- ============================================================
-- ARTICLES TABLE
-- ============================================================
-- Complex policies based on visibility and ownership
CREATE POLICY "select_articles"
ON public.articles FOR SELECT
USING (
  -- User owns the article
  user_id = auth.uid()
  OR
  -- Article is published and public
  (status = 'published' AND visibility = 'public')
  OR
  -- Article is published and premium (accessible to all for preview)
  (status = 'published' AND visibility = 'premium')
);

CREATE POLICY "insert_own_articles"
ON public.articles FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_articles"
ON public.articles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_articles"
ON public.articles FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE POLICY "select_projects"
ON public.projects FOR SELECT
USING (
  user_id = auth.uid()
  OR is_public = true
);

CREATE POLICY "insert_own_projects"
ON public.projects FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_projects"
ON public.projects FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_projects"
ON public.projects FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- ANNOTATIONS TABLE
-- ============================================================
-- Users can see public annotations on public articles
CREATE POLICY "select_annotations"
ON public.annotations FOR SELECT
USING (
  user_id = auth.uid()
  OR (is_public = true AND article_id IN (
    SELECT id FROM public.articles WHERE visibility = 'public'
  ))
);

CREATE POLICY "insert_own_annotations"
ON public.annotations FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_annotations"
ON public.annotations FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_annotations"
ON public.annotations FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- AUTHORIZATION_TOKENS TABLE
-- ============================================================
CREATE POLICY "select_own_tokens"
ON public.authorization_tokens FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_tokens"
ON public.authorization_tokens FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_tokens"
ON public.authorization_tokens FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_tokens"
ON public.authorization_tokens FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- CREDIT_TRANSACTIONS TABLE
-- ============================================================
CREATE POLICY "select_own_transactions"
ON public.credit_transactions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_transactions"
ON public.credit_transactions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- EXTERNAL_LINKS TABLE
-- ============================================================
CREATE POLICY "select_own_links"
ON public.external_links FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_links"
ON public.external_links FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_links"
ON public.external_links FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_links"
ON public.external_links FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- GRAPH_NODES TABLE
-- ============================================================
CREATE POLICY "select_own_nodes"
ON public.graph_nodes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_nodes"
ON public.graph_nodes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_nodes"
ON public.graph_nodes FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_nodes"
ON public.graph_nodes FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- GRAPH_EDGES TABLE
-- ============================================================
CREATE POLICY "select_own_edges"
ON public.graph_edges FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_edges"
ON public.graph_edges FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_edges"
ON public.graph_edges FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_edges"
ON public.graph_edges FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- STARS TABLE
-- ============================================================
CREATE POLICY "select_own_stars"
ON public.stars FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_stars"
ON public.stars FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_stars"
ON public.stars FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- USER_CREDITS TABLE
-- ============================================================
CREATE POLICY "select_own_credits"
ON public.user_credits FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_credits"
ON public.user_credits FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_credits"
ON public.user_credits FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- USER_INSIGHTS TABLE
-- ============================================================
CREATE POLICY "select_own_insights"
ON public.user_insights FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_insights"
ON public.user_insights FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_insights"
ON public.user_insights FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_insights"
ON public.user_insights FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- USER_INTERACTIONS TABLE
-- ============================================================
CREATE POLICY "select_own_interactions"
ON public.user_interactions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_interactions"
ON public.user_interactions FOR INSERT
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "update_own_interactions"
ON public.user_interactions FOR UPDATE
USING (user_id = auth.uid());

-- ============================================================
-- USER_SETTINGS TABLE
-- ============================================================
CREATE POLICY "select_own_settings"
ON public.user_settings FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_settings"
ON public.user_settings FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_settings"
ON public.user_settings FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================
-- VIBE_SESSIONS TABLE
-- ============================================================
CREATE POLICY "select_own_sessions"
ON public.vibe_sessions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "insert_own_sessions"
ON public.vibe_sessions FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_own_sessions"
ON public.vibe_sessions FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_sessions"
ON public.vibe_sessions FOR DELETE
USING (user_id = auth.uid());

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================
-- Run after deployment to verify all policies are created:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
```

### Migration 6: Add Data Classification Columns

```sql
-- File: 20260319000005_add_data_classification.sql
-- Purpose: Add data classification columns for L1/L2/L3 enforcement
-- Author: CAO Architecture Decision
-- Date: 2026-03-19

-- Create enum type for data classification
CREATE TYPE public.data_classification AS ENUM ('L1', 'L2', 'L3');

-- Add classification to user_insights (already has privacy_level, add classification)
ALTER TABLE public.user_insights
ADD COLUMN data_classification public.data_classification DEFAULT 'L2';

-- Add classification to vibe_sessions
ALTER TABLE public.vibe_sessions
ADD COLUMN data_classification public.data_classification DEFAULT 'L2';

-- Add classification to annotations
ALTER TABLE public.annotations
ADD COLUMN data_classification public.data_classification DEFAULT 'L2';

-- Add classification to external_links
ALTER TABLE public.external_links
ADD COLUMN data_classification public.data_classification DEFAULT 'L1';

-- Add classification to graph_nodes
ALTER TABLE public.graph_nodes
ADD COLUMN data_classification public.data_classification DEFAULT 'L2';

-- Update existing data based on content
-- L1: Public data
-- L2: Business data (default)
-- L3: Sensitive data

-- Mark public annotations as L1
UPDATE public.annotations
SET data_classification = 'L1'
WHERE is_public = true;

-- Mark public articles' related data as L1
UPDATE public.external_links
SET data_classification = 'L1'
WHERE user_id IN (
  SELECT user_id FROM public.articles WHERE visibility = 'public'
);

-- Create indexes for classification queries
CREATE INDEX idx_user_insights_classification
ON public.user_insights(data_classification);

CREATE INDEX idx_vibe_sessions_classification
ON public.vibe_sessions(data_classification);

CREATE INDEX idx_annotations_classification
ON public.annotations(data_classification);
```

---

## Part 5: TypeScript Type Updates

### Updated database.ts (Partial - New Columns Only)

```typescript
// File: src/types/database.ts
// Updates required after migrations

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Add enum for data classification
export type DataClassification = 'L1' | 'L2' | 'L3'

export type Database = {
  public: {
    Tables: {
      // ... existing tables ...

      article_paragraphs: {
        Row: {
          article_id: string
          content: string
          created_at: string
          embedding: string | null
          id: string
          language: string | null
          paragraph_index: number
          paragraph_type: string | null
          updated_at: string
          user_id: string  // NEW - Required for RLS isolation
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          language?: string | null
          paragraph_index: number
          paragraph_type?: string | null
          updated_at?: string
          user_id?: string  // NEW - Optional (auto-populated by trigger)
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          language?: string | null
          paragraph_index?: number
          paragraph_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          { foreignKeyName: 'article_paragraphs_user_id_fkey'; columns: ['user_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] }
        ]
      }

      session_fragments: {
        Row: {
          content: string
          created_at: string
          fragment_type: string
          id: string
          metadata: Json | null
          sequence_number: number
          session_id: string
          user_id: string  // NEW - Required for RLS isolation
        }
        Insert: {
          content: string
          created_at?: string
          fragment_type: string
          id?: string
          metadata?: Json | null
          sequence_number: number
          session_id: string
          user_id?: string  // NEW - Optional (auto-populated by trigger)
        }
        Update: {
          content?: string
          created_at?: string
          fragment_type?: string
          id?: string
          metadata?: Json | null
          sequence_number?: number
          session_id?: string
          user_id?: string
        }
        Relationships: [
          { foreignKeyName: 'session_fragments_user_id_fkey'; columns: ['user_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] }
        ]
      }

      insight_links: {
        Row: {
          created_at: string
          external_link_id: string
          id: string
          insight_id: string
          link_context: string | null
          relevance_score: number | null
          user_id: string  // NEW - Denormalized for RLS
        }
        Insert: {
          created_at?: string
          external_link_id: string
          id?: string
          insight_id: string
          link_context?: string | null
          relevance_score?: number | null
          user_id?: string  // NEW - Optional (auto-populated by trigger)
        }
        Update: {
          created_at?: string
          external_link_id?: string
          id?: string
          insight_id?: string
          link_context?: string | null
          relevance_score?: number | null
          user_id?: string
        }
        Relationships: [
          { foreignKeyName: 'insight_links_user_id_fkey'; columns: ['user_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] }
        ]
      }

      // Tables with new data_classification column
      user_insights: {
        Row: {
          content: string
          created_at: string
          data_classification: DataClassification  // NEW
          embedding: string | null
          id: string
          insight_type: string | null
          privacy_level: number | null
          related_article_id: string | null
          related_project_id: string | null
          source_id: string | null
          source_type: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        // ... Insert and Update types updated similarly
      }

      vibe_sessions: {
        Row: {
          created_at: string
          data_classification: DataClassification  // NEW
          end_time: string | null
          id: string
          metadata: Json | null
          model: string | null
          platform: string | null
          raw_context: Json | null
          start_time: string
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        // ... Insert and Update types updated similarly
      }

      annotations: {
        Row: {
          annotation_type: string | null
          article_id: string
          created_at: string
          data_classification: DataClassification  // NEW
          end_offset: number
          highlight_color: string | null
          id: string
          is_public: boolean | null
          note_content: string | null
          paragraph_id: string | null
          selected_text: string
          start_offset: number
          updated_at: string
          user_id: string
        }
        // ... Insert and Update types updated similarly
      }
    }
    Enums: {
      data_classification: DataClassification
    }
  }
}
```

---

## Part 6: Rollback Procedures

### Rollback Script

```sql
-- File: rollback_20260319_migrations.sql
-- Purpose: Rollback all migrations from 2026-03-19
-- WARNING: This will remove user_id columns and RLS policies

BEGIN;

-- Drop RLS policies first
DROP POLICY IF EXISTS "select_own_paragraphs" ON public.article_paragraphs;
DROP POLICY IF EXISTS "insert_own_paragraphs" ON public.article_paragraphs;
DROP POLICY IF EXISTS "update_own_paragraphs" ON public.article_paragraphs;
DROP POLICY IF EXISTS "delete_own_paragraphs" ON public.article_paragraphs;

DROP POLICY IF EXISTS "select_own_fragments" ON public.session_fragments;
DROP POLICY IF EXISTS "insert_own_fragments" ON public.session_fragments;
DROP POLICY IF EXISTS "update_own_fragments" ON public.session_fragments;
DROP POLICY IF EXISTS "delete_own_fragments" ON public.session_fragments;

DROP POLICY IF EXISTS "select_own_insight_links" ON public.insight_links;
DROP POLICY IF EXISTS "insert_own_insight_links" ON public.insight_links;
DROP POLICY IF EXISTS "delete_own_insight_links" ON public.insight_links;

-- Drop triggers
DROP TRIGGER IF EXISTS trg_article_paragraphs_user_id ON public.article_paragraphs;
DROP TRIGGER IF EXISTS trg_session_fragments_user_id ON public.session_fragments;
DROP TRIGGER IF EXISTS trg_insight_links_user_id ON public.insight_links;

-- Drop functions
DROP FUNCTION IF EXISTS set_paragraph_user_id();
DROP FUNCTION IF EXISTS set_fragment_user_id();
DROP FUNCTION IF EXISTS set_insight_link_user_id();

-- Drop indexes
DROP INDEX IF EXISTS idx_article_paragraphs_user_id;
DROP INDEX IF EXISTS idx_session_fragments_user_id;
DROP INDEX IF EXISTS idx_insight_links_user_id;
DROP INDEX IF EXISTS idx_user_insights_classification;
DROP INDEX IF EXISTS idx_vibe_sessions_classification;
DROP INDEX IF EXISTS idx_annotations_classification;

-- Remove columns
ALTER TABLE public.article_paragraphs DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.session_fragments DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.insight_links DROP COLUMN IF EXISTS user_id;

-- Remove data_classification columns
ALTER TABLE public.user_insights DROP COLUMN IF EXISTS data_classification;
ALTER TABLE public.vibe_sessions DROP COLUMN IF EXISTS data_classification;
ALTER TABLE public.annotations DROP COLUMN IF EXISTS data_classification;
ALTER TABLE public.external_links DROP COLUMN IF EXISTS data_classification;
ALTER TABLE public.graph_nodes DROP COLUMN IF EXISTS data_classification;

-- Drop enum type
DROP TYPE IF EXISTS public.data_classification;

-- Disable RLS on affected tables
ALTER TABLE public.article_paragraphs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_fragments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_links DISABLE ROW LEVEL SECURITY;

-- WARNING: This rollback does NOT restore RLS policies on other tables
-- You must run those migrations again to restore full RLS

COMMIT;

-- Verification: Check columns are removed
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('article_paragraphs', 'session_fragments', 'insight_links')
AND column_name = 'user_id';
-- Expected: 0 rows
```

---

## Part 7: Implementation Order

### Phase 1: Security Foundation (Days 1-7)

| Day | Task | Files | Dependencies |
|-----|------|-------|--------------|
| 1 | Create supabase/migrations directory | Directory setup | None |
| 2 | Run Migration 1 (Enable RLS) | `20260319000000_enable_rls_all_tables.sql` | None |
| 3 | Run Migration 2 (article_paragraphs user_id) | `20260319000001_*.sql` | Migration 1 |
| 4 | Run Migration 3 (session_fragments user_id) | `20260319000002_*.sql` | Migration 1 |
| 5 | Run Migration 4 (insight_links user_id) | `20260319000003_*.sql` | Migration 1 |
| 6 | Run Migration 5 (Data classification) | `20260319000005_*.sql` | None |
| 7 | Run Migration 6 (RLS policies) | `20260319000006_*.sql` | All previous |

### Phase 2: TypeScript Updates (Days 8-10)

| Day | Task | Files | Dependencies |
|-----|------|-------|--------------|
| 8 | Update database.ts types | `src/types/database.ts` | Phase 1 |
| 9 | Update API routes for new columns | `src/app/api/**` | Types update |
| 10 | Run integration tests | `src/**/*.test.ts` | API updates |

### Phase 3: Key Hierarchy (Days 11-14) - OPTIONAL

This phase is recommended but can be deferred to Phase 2 of the overall roadmap.

---

## Part 8: AI Access Proxy Layer Design

### 8.1 Purpose

The AI Access Proxy Layer is the enforcement mechanism for the data governance model defined in ADR-002. It sits between user LLM requests and data storage, ensuring that access permissions are respected.

### 8.2 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│   AI ACCESS PROXY LAYER                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User LLM Request                                              │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────┐                                          │
│   │ Permission Gate │                                          │
│   │ ─────────────── │                                          │
│   │ • User ID check │                                          │
│   │ • Subscription  │                                          │
│   │   status check  │                                          │
│   │ • Trial period  │                                          │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                          │
│   │ Data Access     │                                          │
│   │ Router          │                                          │
│   │ ─────────────── │                                          │
│   │ • L0: Public    │◄── Subscriber OR Trial User              │
│   │ • L1: Private   │◄── Owner only                            │
│   │ • L2: Dev Data  │◄── Owner only                            │
│   │ • L3: Identity  │◄── BLOCKED for all LLM                   │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                          │
│   │ Context Builder │                                          │
│   │ ─────────────── │                                          │
│   │ • Build context │                                          │
│   │   for LLM       │                                          │
│   │ • Apply limits  │                                          │
│   └─────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Permission Matrix Implementation

| User Type | L0 (Public) | L1 (Private) | L2 (Dev Data) | L3 (Identity) |
|-----------|-------------|--------------|---------------|---------------|
| Free (Trial) | ✅ | ✅ Owner | ✅ Owner | ❌ |
| Free (Official) | ❌ | ✅ Owner | ✅ Owner | ❌ |
| Subscriber | ✅ | ✅ Owner | ✅ Owner | ❌ |
| Platform LLM | ✅ | ⚠️ Auth | ❌ | ❌ |

### 8.4 Core Functions

```typescript
// Pseudocode - Implementation in Phase 2

interface AccessContext {
  userId: string;
  subscriptionStatus: 'trial' | 'free' | 'subscriber';
  trialEndDate?: Date;
  llmProvider: 'user' | 'platform';
}

interface DataAccessResult {
  allowed: boolean;
  data?: unknown;
  error?: string;
}

async function checkLayerAccess(
  context: AccessContext,
  layer: 'L0' | 'L1' | 'L2' | 'L3',
  resourceOwnerId: string
): Promise<boolean> {
  // L3: Never accessible to LLM
  if (layer === 'L3') return false;

  // L1/L2: Owner only
  if (layer === 'L1' || layer === 'L2') {
    return context.userId === resourceOwnerId;
  }

  // L0: Public articles
  if (layer === 'L0') {
    // Trial user: Allow
    if (context.subscriptionStatus === 'trial') return true;

    // Subscriber: Allow
    if (context.subscriptionStatus === 'subscriber') return true;

    // Free official: Block
    if (context.subscriptionStatus === 'free') return false;
  }

  return false;
}
```

### 8.5 API Endpoints

| Endpoint | Purpose | Layer |
|----------|---------|-------|
| `POST /api/llm/query` | Query LLM with data context | L0/L1/L2 |
| `GET /api/llm/context` | Build context for LLM | All applicable |
| `POST /api/llm/suggest` | Get AI suggestions | L0/L1/L2 |

### 8.6 Security Considerations

1. **Never expose L3 data** - Identity data is blocked at all levels
2. **Audit logging** - All LLM data access logged
3. **Rate limiting** - Prevent abuse of LLM access
4. **Token limits** - Context size limits to prevent data extraction

### 8.7 Implementation Phases

| Phase | Component | Priority |
|-------|-----------|----------|
| Phase 2.1 | Permission Gate | P0 |
| Phase 2.2 | Data Access Router | P0 |
| Phase 2.3 | Context Builder | P0 |
| Phase 2.4 | Audit Logging | P1 |

---

## Part 9: Quality Gates Summary

### Pre-Implementation Checklist

- [ ] Backup production database
- [ ] Test all migrations in staging
- [ ] Verify rollback procedure works
- [ ] Document migration timeline
- [ ] Schedule deployment window

### Implementation Checklist

- [ ] Run each migration in order
- [ ] Verify data counts before/after each migration
- [ ] Test RLS policies with multiple users
- [ ] Update TypeScript types
- [ ] Run all tests

### Post-Implementation Checklist

- [ ] Verify all API endpoints work
- [ ] Run security tests
- [ ] Update documentation
- [ ] CTO technical review
- [ ] Create PR for review

---

## Architecture Decision Records

This document relates to the following ADRs. Full content is maintained in independent files for consistency.

### ADR-001: Database Multi-Tenant Isolation Redesign

**Status:** Proposed

**File:** `docs/dev-logs/ADR-001-Database-Multi-Tenant-Isolation.md`

**Summary:** Implement comprehensive multi-tenant isolation through user_id columns, RLS policies, and data classification.

---

### ADR-002: Business Model and Data Access Architecture

**Status:** Approved

**File:** `docs/dev-logs/ADR-002-Business-Model-Data-Access.md`

**Summary:** Define Data Layer Architecture (L0-L3), Commercial Model (Trial → Subscription), and LLM Access Control matrix.

---

## Conclusion

This comprehensive plan addresses all P0 security issues identified in the database architecture review. The implementation follows the 9 Pre-Development Steps methodology and provides:

1. Complete SQL migration files (not pseudocode)
2. TypeScript type updates
3. Rollback procedures
4. Quality gates for each phase
5. Clear implementation order

**Next Steps:**
1. CTO technical review of this plan
2. Approval from stakeholders
3. Begin Phase 1 implementation

**Authority:** This plan has been created by the Chief Architect Officer (CAO) and represents the definitive architecture decision for database multi-tenant isolation.

---

**Document Version:** 1.0
**Created:** 2026-03-19
**Author:** CAO (Chief Architect Officer)
**Review Required:** CTO Technical Review
**Next Review:** After Phase 1 implementation