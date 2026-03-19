# Phase 12 Planning - Draft Bucket System

## Overview

**Goal:** Implement session-to-draft workflow for content creation

**Estimated Effort:** 1-2 weeks

**Dependencies:** Phase 11 completion (quality improvements) - COMPLETE

**Current Status:** Planning - 2026-03-19

---

## Backend Track

### Step 12.1.B: Draft Bucket Data Model

**Deliverable:** Database schema and API for draft management

**Tasks:**
- [ ] Create `draft_buckets` table
  - [ ] Link to vibe_sessions
  - [ ] Draft status (raw, structured, ready, published)
  - [ ] Version history
- [ ] Create draft management API
  - [ ] POST /api/drafts - Create draft from session
  - [ ] GET /api/drafts - List user drafts
  - [ ] GET /api/drafts/[id] - Get draft detail
  - [ ] PATCH /api/drafts/[id] - Update draft content
  - [ ] DELETE /api/drafts/[id] - Delete draft
  - [ ] POST /api/drafts/[id]/versions - Create version

**Database Schema:**
```sql
CREATE TABLE draft_buckets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_id UUID REFERENCES vibe_sessions(id),
  title TEXT NOT NULL,
  content TEXT,
  structured_context JSONB,
  status TEXT DEFAULT 'raw' CHECK (status IN ('raw', 'structured', 'ready', 'published')),
  article_id UUID REFERENCES articles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE draft_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES draft_buckets(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  content TEXT,
  structured_context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draft_id, version_number)
);

-- RLS Policies
ALTER TABLE draft_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_versions ENABLE ROW LEVEL SECURITY;
```

---

### Step 12.2.B: Draft API Implementation

**Deliverable:** RESTful API endpoints for draft management

**API Endpoints:**

1. **POST /api/drafts**
   - Create draft from session or scratch
   - Auto-generate title from session context
   - Support MCP API Key authentication

2. **GET /api/drafts**
   - List user drafts with pagination
   - Filter by status
   - Sort by updated_at

3. **GET /api/drafts/[id]**
   - Get draft with all versions
   - Include linked session info

4. **PATCH /api/drafts/[id]**
   - Update content
   - Change status
   - Auto-save support

5. **DELETE /api/drafts/[id]**
   - Soft delete or hard delete
   - Cascade to versions

---

## Frontend Track

### Step 12.1.F: Draft List Page

**Deliverable:** UI for viewing and managing draft list

**Tasks:**
- [ ] Create `/dashboard/drafts` page
- [ ] Draft card component
- [ ] Status badges (raw, structured, ready, published)
- [ ] Filter and sort controls
- [ ] Empty state design

**Design:**
- Grid layout with draft cards
- Each card shows: title, status, updated_at, preview
- Actions: Edit, Delete, Publish
- Filter tabs by status

---

### Step 12.2.F: Draft Editor Page

**Deliverable:** Rich text editor for draft content

**Tasks:**
- [ ] Create `/dashboard/drafts/[id]/edit` page
- [ ] Integrate Split Pane Editor
- [ ] Auto-save indicator
- [ ] Version history sidebar
- [ ] Status workflow buttons

**Features:**
- Split pane with preview
- Auto-save every 30 seconds
- Manual save button
- Version history with diff view
- Status transitions: raw → structured → ready → published

---

## MCP Integration

### New MCP Tools for Draft Management

**Tools to add:**

1. `list_drafts` - List user's drafts
2. `get_draft` - Get draft content
3. `create_draft` - Create draft from session
4. `update_draft` - Update draft content
5. `publish_draft` - Publish draft to article

---

## Parallel Development Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│   PHASE 12 PARALLEL DEVELOPMENT                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   BACKEND WORKTREE              FRONTEND WORKTREE              │
│   ================             =================               │
│   - Database migrations         - Draft list page              │
│   - API endpoints               - Draft editor page            │
│   - MCP tools                   - Status workflow UI           │
│   - Unit tests                  - E2E tests                    │
│                                                                 │
│   Timeline: Week 1              Timeline: Week 1-2             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Success Criteria

- [ ] Draft buckets table created with RLS
- [ ] All 5 API endpoints functional
- [ ] Draft list page responsive
- [ ] Draft editor with auto-save
- [ ] MCP tools working from Claude Code
- [ ] 80%+ test coverage
- [ ] E2E tests for draft workflow

---

**Document Version:** 1.0
**Created:** 2026-03-19
**Author:** Claude (CTO Agent)