# Viblog - Application Flow Document

## 1. Overview

This document describes every page, navigation path, and user interaction in the Viblog application.

---

## 2. User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEW USER JOURNEY                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Landing Page → Register → Onboarding → Dashboard → Create Project →        │
│       ↓                    (5 steps)      ↓              ↓                  │
│    [Public Feed]                  [Welcome Blog]   [Write Article]          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        RETURNING USER JOURNEY                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Landing Page → Login → Dashboard → Continue Writing / View Stats            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          VISITOR JOURNEY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Landing Page → Browse Feed → View Article → View Author Profile            │
│                     ↓              ↓                ↓                       │
│               [Filter/Sort]   [Star/Share]    [See All Articles]            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Page Inventory

### 3.1 Public Pages (No Auth Required)

| Route | Page Name | Description |
|-------|-----------|-------------|
| `/` | Landing / Public Feed | Homepage with trending articles |
| `/article/[id]` | Article Detail | Full article view |
| `/@[username]` | User Profile | Public profile with articles |
| `/login` | Login | Authentication page |
| `/register` | Register | New user registration |
| `/forgot-password` | Password Reset | Password recovery flow |

### 3.2 Protected Pages (Auth Required)

| Route | Page Name | Description |
|-------|-----------|-------------|
| `/onboarding` | Onboarding | 5-step setup wizard |
| `/dashboard` | Dashboard | Personal management center |
| `/dashboard/projects` | Projects | Project list management |
| `/dashboard/projects/new` | New Project | Create project form |
| `/dashboard/projects/[id]` | Project Detail | Single project view |
| `/dashboard/articles` | Articles | All articles list |
| `/dashboard/articles/new` | New Article | Article editor |
| `/dashboard/articles/[id]/edit` | Edit Article | Article editor |
| `/dashboard/settings` | Settings | User preferences |

---

## 4. Detailed Flow Diagrams

### 4.1 Registration Flow

```
┌──────────────┐
│ Landing Page │
│     "/"      │
└──────┬───────┘
       │ Click "Get Started" or "Sign Up"
       ▼
┌──────────────┐
│  Register    │
│ "/register"  │
└──────┬───────┘
       │
       │ Input: Email, Password, Username
       │
       ├──────────────────┬────────────────────┐
       │                  │                    │
       ▼                  ▼                    ▼
  [Valid Input]    [Email Exists]      [Weak Password]
       │                  │                    │
       │                  ▼                    ▼
       │           Error: "Email        Error: "Password
       │           already registered"  must be 8+ chars"
       │                  │                    │
       │                  └───────┬────────────┘
       │                          │
       ▼                          ▼
  Submit Form ◄───────────── Retry Input
       │
       │ API: POST /api/auth/register
       │
       ├──────────────┬────────────────┐
       │              │                │
       ▼              ▼                ▼
   [Success]    [Network Error]  [Validation Error]
       │              │                │
       │              ▼                ▼
       │         Show toast      Show error
       │         "Connection     message
       │         failed"
       │
       ▼
  Create Session
       │
       ▼
  Redirect to "/onboarding"
```

### 4.2 Onboarding Flow

```
┌─────────────────┐
│   Onboarding    │
│  "/onboarding"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Step 1/5     │
│   LLM Config    │
├─────────────────┤
│ - Provider      │
│   [OpenAI]      │
│   [Anthropic]   │
│   [Google]      │
│   [Custom]      │
│ - API Key       │
│   [••••••••]    │
│                 │
│ [Skip] [Next →] │
└────────┬────────┘
         │ Click "Next" or "Skip"
         ▼
┌─────────────────┐
│    Step 2/5     │
│  Database Config│
├─────────────────┤
│ - Type          │
│   [Supabase]    │
│   [ClickHouse]  │
│   [SQLite]      │
│   [None/Skip]   │
│ - Connection    │
│   URL/Config    │
│                 │
│ [Back] [Next →] │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Step 3/5     │
│ Vibe Platform   │
├─────────────────┤
│ - Platform      │
│   [Claude Code] │
│   [Cursor]      │
│   [Codex]       │
│   [Trae]        │
│   [Other]       │
│                 │
│ [Back] [Next →] │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Step 4/5     │
│  Discovery      │
├─────────────────┤
│ "How did you    │
│  find us?"      │
│                 │
│ [Twitter/X]     │
│ [GitHub]        │
│ [Friend]        │
│ [Search]        │
│ [Other]         │
│                 │
│ [Back] [Next →] │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Step 5/5     │
│  Welcome Blog   │
├─────────────────┤
│ "Generating     │
│  your first     │
│  blog post..."  │
│                 │
│ [████████░░]    │
│     80%         │
│                 │
│ [Back] [Finish] │
└────────┬────────┘
         │ Click "Finish"
         ▼
┌─────────────────┐
│   Dashboard     │
│  "/dashboard"   │
│                 │
│ "Welcome to     │
│  Viblog!"       │
└─────────────────┘
```

### 4.3 Article Creation Flow

```
┌──────────────────┐
│    Dashboard     │
│   "/dashboard"   │
└────────┬─────────┘
         │ Click "New Article" or
         │       "Write" button
         ▼
┌──────────────────┐
│   New Article    │
│ "/dashboard/     │
│  articles/new"   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│           Article Editor              │
├──────────────────────────────────────┤
│                                      │
│  Title: [___________________]        │
│                                      │
│  Project: [Select Project ▼]         │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │     Rich Text Editor           │  │
│  │     (Markdown supported)       │  │
│  │                                │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  ─── Vibe Coding Metadata ───        │
│  Platform: [Claude Code ▼]           │
│  Duration: [___] minutes             │
│  Model:    [Opus 4.6 ▼]              │
│                                      │
│  Cover Image: [Upload]               │
│                                      │
│  ─── Actions ───                     │
│  [Save Draft]  [Preview]  [Publish]  │
│                                      │
└──────────────────┬───────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
  [Save Draft] [Preview]  [Publish]
       │           │           │
       ▼           │           ▼
  Auto-save      │    ┌─────────────────┐
  to drafts      │    │ Publish Modal   │
  (30s interval) │    ├─────────────────┤
       │           │    │ Visibility:     │
       ▼           │    │ ○ Public        │
  Toast:          │    │ ○ Private       │
  "Draft saved"   │    │ ○ Unlisted      │
       │           │    │                 │
       │           │    │ Pricing:        │
       │           │    │ ○ Free          │
       │           │    │ ○ Paid $[__.__] │
       │           │    │                 │
       │           │    │ [Cancel][Publish]│
       │           │    └────────┬────────┘
       │           │             │
       │           ▼             ▼
       │     Preview Page   Publish Success
       │     (new tab)      Toast + Redirect
       │           │        to Article View
       │           │
       └───────────┴───────────────────────┘
```

### 4.4 Public Article Discovery Flow

```
┌──────────────────────┐
│   Landing / Feed     │
│        "/"           │
├──────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐│
│  │Card│ │Card│ │Card││  ← Trending Articles
│  │ 1  │ │ 2  │ │ 3  ││
│  └────┘ └────┘ └────┘│
│                      │
│  ─── Filters ───     │
│  [Platform ▼]        │
│  [Model ▼]           │
│  [Duration Range]    │
│                      │
│  ─── Sort ───        │
│  ○ Trending          │
│  ○ Recent            │
│  ○ Most Starred      │
│                      │
│  [Load More...]      │
└──────────┬───────────┘
           │
           │ Click on Card
           ▼
┌──────────────────────┐
│   Article Detail     │
│ "/article/[id]"      │
├──────────────────────┤
│  ┌──────────────────┐│
│  │   Cover Image    ││
│  └──────────────────┘│
│                      │
│  Title               │
│  by @username        │
│                      │
│  Platform | Duration │
│  Model    | Stars    │
│                      │
│  ─── Content ───     │
│  [Full Article...]   │
│                      │
│  ─── Actions ───     │
│  [⭐ Star] [Share]   │
│                      │
│  ─── Author ───      │
│  [Avatar] @username  │
│  [View Profile]      │
└──────────────────────┘
```

---

## 5. Navigation Structure

### 5.1 Main Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                               │
├─────────────────────────────────────────────────────────────┤
│  [Logo] Viblog                    [Search...]    [Actions]  │
│                                                             │
│  Actions (Logged Out):                                      │
│  [Sign In] [Get Started]                                    │
│                                                             │
│  Actions (Logged In):                                       │
│  [Write] [Notifications] [Avatar ▼]                         │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Dashboard Navigation

```
┌─────────────────────────────────────────────────────────────┐
│                     DASHBOARD LAYOUT                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────────────────────────┐   │
│  │ Sidebar  │  │              Main Content              │   │
│  │          │  │                                        │   │
│  │ Overview │  │                                        │   │
│  │ ───────  │  │                                        │   │
│  │ Projects │  │                                        │   │
│  │ Articles │  │                                        │   │
│  │ Drafts   │  │                                        │   │
│  │          │  │                                        │   │
│  │ Settings │  │                                        │   │
│  │          │  │                                        │   │
│  └──────────┘  └────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. State Transitions

### 6.1 Article States

```
┌─────────────┐
│   DRAFT     │  ← Initial state when created
└──────┬──────┘
       │
       │ User clicks "Publish"
       ▼
┌─────────────┐
│  PUBLISHED  │  ← Visible based on visibility setting
│             │
│  - Public   │  ← Appears in public feed
│  - Private  │  ← Only author can see
│  - Unlisted │  ← Only via direct link
└──────┬──────┘
       │
       │ User clicks "Unpublish" or "Edit"
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐ ┌─────────────┐
│    DRAFT    │ │  ARCHIVED   │
│ (Unpublish) │ │  (Deleted)  │
└─────────────┘ └─────────────┘
```

### 6.2 User States

```
┌─────────────┐
│   GUEST     │  ← Not logged in
└──────┬──────┘
       │
       │ Registers
       ▼
┌─────────────┐
│  PENDING    │  ← Email verification pending (future)
│ ONBOARDING  │  ← In 5-step setup
└──────┬──────┘
       │
       │ Completes onboarding
       ▼
┌─────────────┐
│   ACTIVE    │  ← Full access
└──────┬──────┘
       │
       │ Inactive for 90 days
       ▼
┌─────────────┐
│   DORMANT   │  ← Account still exists
└─────────────┘
```

---

## 7. Error Handling Flows

### 7.1 API Error Responses

| Error Code | User Message | Action |
|------------|--------------|--------|
| 400 | "Invalid input. Please check your data." | Stay on form, highlight errors |
| 401 | "Session expired. Please log in again." | Redirect to /login |
| 403 | "You don't have permission to do that." | Show toast, stay on page |
| 404 | "Page not found." | Show 404 page |
| 429 | "Too many requests. Please wait." | Show toast with countdown |
| 500 | "Something went wrong. Please try again." | Show toast, allow retry |

### 7.2 Network Error Flow

```
User Action
     │
     ▼
API Call
     │
     ├──────────────┬─────────────┐
     │              │             │
     ▼              ▼             ▼
 [Success]    [Timeout]     [Network Error]
     │              │             │
     ▼              ▼             ▼
 Continue     Retry (3x)    Show offline toast
                   │             │
                   ▼             ▼
              [Still Fail]  [Retry Button]
                   │
                   ▼
              Show error
              message
```

---

## 8. Responsive Behavior

### 8.1 Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640px - 1024px | Two column, sidebar collapsible |
| Desktop | > 1024px | Full layout, persistent sidebar |

### 8.2 Mobile Navigation

```
┌─────────────────────┐
│      Mobile Header   │
│  [☰]  Viblog  [👤]  │
├─────────────────────┤
│                     │
│    Main Content     │
│                     │
├─────────────────────┤
│    Bottom Nav Bar   │
│  [Home] [Search] [+] [Profile] [More] │
└─────────────────────┘
```

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13