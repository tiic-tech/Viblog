# Interface Contract

> **Version:** 1.0
> **Updated:** 2026-03-20
> **Purpose:** Define shared API and data contracts between Backend and Frontend

---

## Principle

**Interface-First Development:**
1. Define interface here first
2. Both teams review
3. Implement to contract
4. Integration test verifies

---

## API Endpoints

### Authentication

#### POST /api/auth/login

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null",
    "avatar_url": "string | null",
    "created_at": "string"
  },
  "token": "string"
}
```

**Status Codes:**
- 200: Success
- 401: Invalid credentials
- 400: Validation error

---

#### POST /api/auth/register

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "user": { /* User object */ },
  "token": "string"
}
```

---

### Vibe Sessions

#### GET /api/vibe-sessions

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status`: string (optional) - Filter by status
- `limit`: number (optional, default: 20)
- `offset`: number (optional, default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "title": "string",
      "status": "draft | active | published | archived",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

---

#### POST /api/vibe-sessions/publish-article

**Request:**
```json
{
  "session_id": "string",
  "title": "string",
  "content_markdown": "string",
  "visibility": "public | private | unlisted"
}
```

**Response:**
```json
{
  "article_id": "string",
  "slug": "string",
  "status": "published",
  "visibility": "public | private | unlisted",
  "published_at": "string"
}
```

---

## Shared Types

### User

```typescript
interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
```

### VibeSession

```typescript
interface VibeSession {
  id: string
  user_id: string
  title: string
  status: 'draft' | 'active' | 'published' | 'archived'
  created_at: string
  updated_at: string
}
```

### Article

```typescript
interface Article {
  id: string
  slug: string
  title: string
  content_html: string
  content_markdown: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'unlisted'
  author_id: string
  vibe_session_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}
```

### Fragment Types

```typescript
type FragmentType =
  | 'user_prompt'
  | 'ai_response'
  | 'code_block'
  | 'file_content'
  | 'command_output'
  | 'error_log'
  | 'system_message'
  | 'external_link'
```

---

## Change Log

| Date | Change | Decision | Impact |
|------|--------|----------|--------|
| 2026-03-20 | Defined visibility semantics | ISSUE-003 | Backend only |
| 2026-03-20 | Aligned fragment_type enum | ISSUE-002 | Both teams |

---

## Change Request Process

1. **Propose Change** → Add to SHARED_ISSUES.md
2. **Impact Analysis** → Which team affected?
3. **Approval** → If both teams, CAO may be needed
4. **Update** → Modify this document
5. **Implement** → Both teams implement

---

**Document Version:** 1.0
**Owners:** Backend + Frontend (shared)