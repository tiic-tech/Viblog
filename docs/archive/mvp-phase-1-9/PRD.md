# Viblog - Product Requirements Document (PRD)

## 1. Executive Summary

### 1.1 Product Vision

**Viblog** is an AI-Native blogging platform designed exclusively for Vibe Coders - developers who use AI assistants to write code. Our mission is to help Vibe Coders effortlessly capture, share, and grow from their AI-assisted development experiences.

### 1.2 Product Statement

> "Every Vibe Coder can effortlessly transform their daily vibe coding journey into shareable experiences and continuous growth."

### 1.3 Target Users

| Segment | Description | Primary Needs |
|---------|-------------|---------------|
| **Primary** | Developers using AI-assisted coding (Claude Code, Cursor, Codex) | Record prompts, share experiences, build portfolio |
| **Secondary** | Job seekers in AI industry | Demonstrate AI proficiency, showcase projects |
| **Tertiary** | AI learning enthusiasts | Track learning progress, share knowledge |

---

## 2. Core Principles

### 2.1 The Three Pillars

1. **Record** - Capture the authentic vibe coding context (prompts, AI responses, final output)
2. **Share** - Transform experiences into beautiful, shareable content
3. **Grow** - Build a personal knowledge base that reflects your thinking DNA

### 2.2 Design Philosophy

- **Beautiful** - Display vibe coding achievements like art pieces
- **Effortless** - Minimal friction from coding to blogging
- **Personal** - Each user owns their data, LLM, and database

---

## 3. User Stories

### 3.1 Authentication & Onboarding

**US-001: User Registration**
```
As a new user
I want to register with email and password
So that I can create my Viblog account
```
**Acceptance Criteria:**
- [ ] Email validation with proper error messages
- [ ] Password strength requirements (min 8 chars, 1 number, 1 special)
- [ ] Username uniqueness check
- [ ] Welcome email sent on successful registration

**US-002: Onboarding Flow**
```
As a new user
I want a guided 5-step setup process
So that I can configure my preferences before starting
```
**Acceptance Criteria:**
- [ ] Step 1: Select LLM provider, enter API key (masked)
- [ ] Step 2: Configure database (Supabase/ClickHouse/SQLite)
- [ ] Step 3: Configure vibe coding platform
- [ ] Step 4: Select how they heard about Viblog
- [ ] Step 5: Auto-generate welcome blog post
- [ ] Progress indicator visible throughout
- [ ] Skip option available (minimum required fields only)

### 3.2 Project Management

**US-003: Create Project**
```
As a Vibe Coder
I want to create a new project bucket
So that I can organize my articles by project
```
**Acceptance Criteria:**
- [ ] Project name (required, max 50 chars)
- [ ] Project description (optional, max 500 chars)
- [ ] Project icon/emoji (optional)
- [ ] Created projects appear in timeline view
- [ ] Project card shows article count

**US-004: Edit/Delete Project**
```
As a project owner
I want to edit or delete my projects
So that I can manage my project organization
```
**Acceptance Criteria:**
- [ ] Edit: name, description, icon
- [ ] Delete: confirmation dialog, articles reassigned or archived
- [ ] Changes reflected immediately in UI

### 3.3 Article Management

**US-005: Create Article**
```
As a Vibe Coder
I want to write a new article
So that I can share my vibe coding experience
```
**Acceptance Criteria:**
- [ ] Rich text editor with markdown support
- [ ] Title field (required, max 100 chars)
- [ ] Content field (required)
- [ ] Cover image upload (optional)
- [ ] Project assignment (optional)
- [ ] Auto-save draft every 30 seconds
- [ ] Manual save draft option

**US-006: Article Metadata**
```
As an author
I want to add vibe coding metadata to my article
So that readers understand my development context
```
**Acceptance Criteria:**
- [ ] Platform field (Claude Code/Cursor/Codex/Trae/Other)
- [ ] Duration field (in minutes)
- [ ] Model field (dropdown or custom input)
- [ ] Original prompt field (optional, for MCP integration)
- [ ] AI response summary field (optional)

**US-007: Publish Article**
```
As an author
I want to publish my article with visibility settings
So that I can control who sees my content
```
**Acceptance Criteria:**
- [ ] Visibility: Public / Private / Unlisted
- [ ] Pricing: Free / Paid (with price input)
- [ ] Publish timestamp recorded
- [ ] Published articles appear in public feed (if public)
- [ ] Notification sent to followers (future feature)

**US-008: Edit/Delete Article**
```
As an author
I want to edit or delete my published articles
So that I can update or remove content
```
**Acceptance Criteria:**
- [ ] Edit preserves original publish date
- [ ] Delete: soft delete with confirmation
- [ ] Deleted articles removed from public view immediately

### 3.4 Public Discovery

**US-009: Browse Public Articles**
```
As a visitor
I want to browse trending public articles
So that I can discover interesting vibe coding experiences
```
**Acceptance Criteria:**
- [ ] Card-based layout (3-section: tags, image, description)
- [ ] Sort by: Trending / Recent / Most Starred
- [ ] Filter by: Platform / Model / Duration range
- [ ] Infinite scroll or pagination
- [ ] Card shows: Star count, Price (if paid)

**US-010: View Article Detail**
```
As a visitor
I want to read a full article
So that I can learn from the author's experience
```
**Acceptance Criteria:**
- [ ] Full content with proper formatting
- [ ] Metadata displayed (platform, duration, model)
- [ ] Author profile link
- [ ] Related articles suggestion
- [ ] Star button (if logged in)
- [ ] Purchase button (if paid article)

**US-011: View User Profile**
```
As a visitor
I want to view a Vibe Coder's profile
So that I can see all their public work
```
**Acceptance Criteria:**
- [ ] User info: avatar, name, bio, stats
- [ ] All public articles (card layout)
- [ ] Project list (if public)
- [ ] Follow button (future feature)

### 3.5 Personal Dashboard

**US-012: Timeline View**
```
As a logged-in user
I want to see my projects and articles in a timeline
So that I can track my development journey
```
**Acceptance Criteria:**
- [ ] Timeline organized by date (newest first)
- [ ] Projects shown as expandable buckets
- [ ] Articles nested under projects
- [ ] Date markers for each entry
- [ ] Quick actions: edit, delete, publish

---

## 4. Success Criteria

### 4.1 MVP Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| User Registration | 100 users in first month | Database count |
| Article Creation | 3+ articles per active user | Average per user |
| Publish Rate | 60% of drafts published | Draft-to-publish ratio |
| Public Engagement | 10+ stars per article average | Star count average |
| Retention | 40% weekly active return | DAU/WAU ratio |

### 4.2 Quality Metrics

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| Mobile Responsiveness | 100% functional on mobile |
| Accessibility | WCAG 2.1 AA compliant |
| Uptime | 99.5% |

---

## 5. Scope Definition

### 5.1 In Scope (MVP)

| Feature | Priority | Notes |
|---------|----------|-------|
| User Registration/Login | P0 | Email + password |
| Onboarding Flow | P0 | 5-step guided setup |
| Project CRUD | P0 | Basic management |
| Article CRUD | P0 | Rich text editing |
| Draft Auto-save | P0 | Every 30 seconds |
| Publish with Visibility | P0 | Public/Private/Unlisted |
| Public Article Feed | P0 | Card layout, trending |
| User Profile Page | P0 | Public articles list |
| Personal Dashboard | P0 | Timeline + Project view |
| Mobile Responsive | P0 | All pages |

### 5.2 Out of Scope (MVP)

| Feature | Reason | Planned Phase |
|---------|--------|---------------|
| MCP Integration | Complex, requires separate development | Phase 2 |
| AI-assisted Writing | Requires MCP integration first | Phase 2 |
| Third-party OAuth | Not critical for MVP | Phase 2 |
| Paid Article Transactions | Payment system complexity | Phase 3 |
| Comments System | Engagement feature | Phase 3 |
| Follow/Followers | Social features | Phase 3 |
| Email Notifications | Infrastructure requirement | Phase 3 |
| Multi-language Support | Localization effort | Phase 3 |

### 5.3 Future Considerations

- Cross-platform publishing (Xiaohongshu, WeChat, LinkedIn)
- MCP adapters for Cursor, Codex, Trae
- AI-powered content generation
- Plugin system for custom platforms
- PWA mobile app
- Team/organization accounts

---

## 6. Non-Functional Requirements

### 6.1 Performance

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- API Response Time: < 500ms (p95)

### 6.2 Security

- All API keys encrypted at rest
- HTTPS enforced
- CSRF protection
- Rate limiting on auth endpoints
- Input validation on all forms

### 6.3 Scalability

- Serverless architecture (Vercel)
- Database connection pooling
- Static asset CDN delivery

---

## 7. Constraints & Assumptions

### 7.1 Constraints

- Users provide their own LLM API keys
- Users configure their own database connections
- No centralized LLM/database provided by platform
- Must work without MCP in MVP phase

### 7.2 Assumptions

- Users are familiar with API key management
- Users understand basic database concepts
- Target users have stable internet connection
- Primary language is English/Chinese

---

## 8. Dependencies

### 8.1 External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Supabase | Auth, Database, Storage | Selected |
| Vercel | Hosting, Deployment | Selected |

### 8.2 Development Dependencies

- Node.js 20+
- pnpm (package manager)
- GitHub (version control)

---

## 9. Glossary

| Term | Definition |
|------|------------|
| Vibe Coder | Developer who uses AI assistants for coding |
| Vibe Record | Raw capture of prompt + AI response + output |
| Project Bucket | Container for organizing articles by project |
| Star | User appreciation metric |
| Paid Article | Premium content requiring purchase |

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13
**Author:** Viblog Team