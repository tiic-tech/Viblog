# Viblog - Application Flow Document

## 文档信息
- **功能**: 应用流程文档，定义所有页面、导航和用户交互流程
- **作用**: 产品设计和开发的导航地图，确保流程一致性
- **职责**: 明确"用户如何使用产品"，覆盖所有用户旅程
- **阅读时机**: 按需阅读 - 当需要了解页面结构、用户流程或 MCP 集成流程时

---

## 1. Overview

This document describes every page, navigation path, and user interaction in the Viblog application, with emphasis on the new MCP-driven workflow.

---

## 2. User Journey Map

### 2.1 MCP User Journey (Primary)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MCP-INTEGRATED USER JOURNEY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Daily Coding Session                                                        │
│       ↓                                                                      │
│  MCP auto-calls update_vibe_coding_history()                                │
│       ↓                                                                      │
│  Draft Bucket generated (metadata, code, problems)                          │
│       ↓                                                                      │
│  Developer adds "Human Touch" (reflections/insights)                        │
│       ↓                                                                      │
│  Click "Generate Article"                                                    │
│       ↓                                                                      │
│  Viblog AI combines metadata + human input → Draft article                  │
│       ↓                                                                      │
│  Developer reviews & edits                                                   │
│       ↓                                                                      │
│  Publish → Dual-layer format (Markdown + JSON)                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Traditional User Journey (Fallback)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TRADITIONAL USER JOURNEY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Landing Page → Register → Onboarding → Dashboard →                         │
│       ↓                    (5 steps)      ↓                                 │
│  [Public Feed]                  [Welcome Blog]   [Write Article manually]   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Page Inventory

### 3.1 Public Pages (No Auth Required)

| Route | Page Name | Description |
|-------|-----------|-------------|
| `/` | Landing / Public Feed | Homepage with Pinterest-style article cards |
| `/article/[id]` | Article Detail | Full article view (Markdown) |
| `/article/[id]/json` | Article JSON View | Structured AI-consumable format |
| `/@[username]` | User Profile | Public profile with articles |
| `/login` | Login | Authentication page |
| `/register` | Register | New user registration |
| `/forgot-password` | Password Reset | Password recovery flow |

### 3.2 Protected Pages (Auth Required)

| Route | Page Name | Description |
|-------|-----------|-------------|
| `/onboarding` | Onboarding | 5-step setup wizard |
| `/dashboard` | Dashboard | Personal management center |
| `/dashboard/draft-buckets` | Draft Buckets | MCP-generated content drafts |
| `/dashboard/draft-buckets/[id]` | Draft Bucket Detail | Review and generate article |
| `/dashboard/projects` | Projects | Project list management |
| `/dashboard/articles` | Articles | All articles list |
| `/dashboard/articles/new` | New Article | Article editor |
| `/dashboard/articles/[id]/edit` | Edit Article | Article editor |
| `/dashboard/settings` | Settings | User preferences |
| `/dashboard/mcp-setup` | MCP Setup | MCP configuration guide |

---

## 4. Detailed Flow Diagrams

### 4.1 MCP Session to Article Flow (New)

```
┌──────────────────────────────────────────────────────────────────┐
│                    CODING SESSION (External)                       │
│                                                                   │
│  Developer uses Claude Code/Cursor with Viblog MCP Server         │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ MCP: update_vibe_coding_history()
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                       VIBLOG BACKEND                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Receive session data (prompts, responses, code, timestamps)  │
│  2. Store in draft_buckets table                                  │
│  3. Extract metadata:                                             │
│     - Title suggestions                                           │
│     - Key code snippets                                           │
│     - Problems encountered                                        │
│     - Decisions made                                              │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     DRAFT BUCKET VIEW                              │
│                  "/dashboard/draft-buckets/[id]"                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ AI-Generated Content                                        │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ Title: [Suggested Title] or [Custom Title]                  │ │
│  │                                                             │ │
│  │ Key Code Snippets:                                          │ │
│  │ ┌─────────────────────────────────────────────────────────┐ │ │
│  │ │ // Code snippet 1                                        │ │ │
│  │ │ const result = await processData(input)                  │ │ │
│  │ └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │ Decisions Made:                                             │ │
│  │ • Decision 1: Reason...                                     │ │
│  │ • Decision 2: Reason...                                     │ │
│  │                                                             │ │
│  │ Problems Encountered:                                       │ │
│  │ • Problem 1: Solution...                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Human Touch (Your Input)                                    │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ Today's Reflections:                                        │ │
│  │ [________________________________________________________]  │ │
│  │ [________________________________________________________]  │ │
│  │                                                             │ │
│  │ Additional Notes:                                           │ │
│  │ [________________________________________________________]  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [Save Draft]  [Generate Article]  [Delete]                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                             │
                             │ Click "Generate Article"
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     ARTICLE GENERATION                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Viblog AI combines:                                              │
│  • Metadata (code, decisions, problems)                           │
│  • Human reflections                                              │
│  → Generates full article draft                                   │
│                                                                   │
│  Processing: [████████░░] 80%                                     │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     ARTICLE EDITOR                                 │
│              "/dashboard/articles/[id]/edit"                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Developer reviews and edits generated content                    │
│  - Full rich text editor                                          │
│  - Vibe coding metadata                                           │
│  - Cover image selection                                          │
│                                                                   │
│  [Save Draft]  [Preview]  [Publish]                               │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ Click "Publish"
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     DUAL-LAYER PUBLISH                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐    ┌────────────────────────────────┐  │
│  │   Markdown Version    │    │      JSON Version              │  │
│  │   (Human-readable)    │    │   (AI-consumable)              │  │
│  ├──────────────────────┤    ├────────────────────────────────┤  │
│  │                      │    │                                │  │
│  │  Full article        │    │  {                             │  │
│  │  content with        │    │    "article_id": "...",        │  │
│  │  formatting...       │    │    "title": "...",             │  │
│  │                      │    │    "summary": "...",           │  │
│  │                      │    │    "key_decisions": [...],     │  │
│  │                      │    │    "code_snippets": [...],     │  │
│  │                      │    │    "lessons_learned": [...]    │  │
│  │                      │    │  }                             │  │
│  └──────────────────────┘    └────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 MCP Setup Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                       MCP SETUP PAGE                               │
│                 "/dashboard/mcp-setup"                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: Choose Your Platform                                     │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │ Claude Code │  │   Cursor    │  │   Other     │               │
│  │    [✓]      │  │   [ ]       │  │   [ ]       │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                   │
│  Step 2: Copy MCP Configuration                                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ {                                                            │ │
│  │   "mcpServers": {                                            │ │
│  │     "viblog": {                                              │ │
│  │       "command": "npx",                                      │ │
│  │       "args": ["viblog-mcp-server"],                         │ │
│  │       "env": {                                               │ │
│  │         "VIBLOG_API_KEY": "your-api-key-here"               │ │
│  │       }                                                      │ │
│  │     }                                                        │ │
│  │   }                                                          │ │
│  │ }                                                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [Copy to Clipboard]                                              │
│                                                                   │
│  Step 3: Add to your MCP config file                              │
│                                                                   │
│  Claude Code: ~/.claude/config.json                               │
│  Cursor: Settings → MCP Servers                                   │
│                                                                   │
│  Step 4: Verify Connection                                        │
│                                                                   │
│  [Test Connection] → ✓ Connected!                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Public Feed Redesign

### 5.1 Pinterest-Style Card Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                       PUBLIC FEED (Redesigned)                     │
│                            "/"                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  [Logo] Viblog          [Search...]        [Sign In] [Write]│ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ─── Filters ───                                                  │
│  [Platform ▼] [Model ▼] [Duration] [Sort: Trending ▼]            │
│                                                                   │
│  ─── Masonry Grid ───                                             │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐      │
│  │  Cover   │  │  Cover   │  │    Cover     │  │  Cover   │      │
│  │  Image   │  │  Image   │  │    Image     │  │  Image   │      │
│  │          │  │          │  │              │  │          │      │
│  ├──────────┤  ├──────────┤  ├──────────────┤  ├──────────┤      │
│  │ Title    │  │ Title    │  │ Title        │  │ Title    │      │
│  │          │  │          │  │              │  │          │      │
│  │ @author  │  │ @author  │  │ @author      │  │ @author  │      │
│  │ ⭐ 42    │  │ ⭐ 28    │  │ ⭐ 156       │  │ ⭐ 67    │      │
│  └──────────┘  └──────────┘  └──────────────┘  └──────────┘      │
│                                                                   │
│  ┌────────────────┐  ┌──────────┐  ┌──────────┐                  │
│  │    Cover       │  │  Cover   │  │  Cover   │                  │
│  │    Image       │  │  Image   │  │  Image   │                  │
│  │                │  │          │  │          │                  │
│  │                │  │          │  │          │                  │
│  ├────────────────┤  ├──────────┤  ├──────────┤                  │
│  │ Title          │  │ Title    │  │ Title    │                  │
│  │                │  │          │  │          │                  │
│  │ @author        │  │ @author  │  │ @author  │                  │
│  │ ⭐ 89          │  │ ⭐ 34    │  │ ⭐ 201   │                  │
│  └────────────────┘  └──────────┘  └──────────┘                  │
│                                                                   │
│  [Load More...]                                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. State Transitions

### 6.1 Draft Bucket States

```
┌─────────────┐
│   RAW       │  ← Created by MCP session recording
└──────┬──────┘
       │
       │ User adds reflections
       ▼
┌─────────────┐
│   DRAFT     │  ← Ready for article generation
└──────┬──────┘
       │
       │ User clicks "Generate"
       ▼
┌─────────────┐
│  GENERATING │  ← AI creating article
└──────┬──────┘
       │
       │ Generation complete
       ▼
┌─────────────┐
│   ARTICLE   │  ← Article created, linked to bucket
│   DRAFT     │
└─────────────┘
```

---

## 7. API Endpoints for MCP

### 7.1 MCP-Related Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mcp/history` | Receive session data from MCP |
| GET | `/api/mcp/status` | Check MCP connection status |
| GET | `/api/draft-buckets` | List user's draft buckets |
| GET | `/api/draft-buckets/[id]` | Get draft bucket details |
| POST | `/api/draft-buckets/[id]/generate` | Generate article from bucket |
| PUT | `/api/draft-buckets/[id]` | Update draft bucket (add reflections) |
| DELETE | `/api/draft-buckets/[id]` | Delete draft bucket |

### 7.2 Dual-Layer Content Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/articles/[id]` | Get article (Markdown) |
| GET | `/api/public/articles/[id]/json` | Get article (JSON format) |

---

**Document Version:** 2.0
**Last Updated:** 2026-03-15
**Author:** Viblog Team