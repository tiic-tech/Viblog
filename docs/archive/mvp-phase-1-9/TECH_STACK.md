# Viblog - Technology Stack Document

## 1. Overview

This document defines the exact versions of every package, dependency, API, and tool used in the Viblog project. **No ambiguity allowed.**

---

## 2. Runtime Environment

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 20.11.0 LTS | Required for development |
| pnpm | 8.15.1 | Package manager (preferred over npm/yarn) |
| TypeScript | 5.3.3 | Strict mode enabled |

---

## 3. Core Framework

### 3.1 Frontend Framework

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.1.0 | React framework with App Router |
| react | 18.2.0 | UI library |
| react-dom | 18.2.0 | React DOM renderer |

### 3.2 Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*.supabase.co', 'avatars.githubusercontent.com'],
  },
  experimental: {
    serverActions: true,
  },
}
```

---

## 4. Styling & UI

### 4.1 CSS Framework

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | 3.4.1 | Utility-first CSS |
| postcss | 8.4.35 | CSS processor |
| autoprefixer | 10.4.17 | Vendor prefixes |

### 4.2 Component Library

| Package | Version | Purpose |
|---------|---------|---------|
| @radix-ui/react-dialog | 1.0.5 | Modal component |
| @radix-ui/react-dropdown-menu | 2.0.6 | Dropdown component |
| @radix-ui/react-select | 2.0.0 | Select component |
| @radix-ui/react-tabs | 1.0.4 | Tabs component |
| @radix-ui/react-toast | 1.1.5 | Toast notifications |
| @radix-ui/react-tooltip | 1.0.7 | Tooltip component |
| @radix-ui/react-avatar | 1.0.4 | Avatar component |
| @radix-ui/react-checkbox | 1.0.4 | Checkbox component |
| @radix-ui/react-label | 2.0.2 | Label component |
| @radix-ui/react-slot | 1.0.2 | Slot component |
| @radix-ui/react-switch | 1.0.3 | Switch component |
| class-variance-authority | 0.7.0 | Variant styling |
| clsx | 2.1.0 | Class merging |
| tailwind-merge | 2.2.1 | Tailwind class merging |
| lucide-react | 0.323.0 | Icon library |

### 4.3 Animation

| Package | Version | Purpose |
|---------|---------|---------|
| framer-motion | 11.0.8 | Animation library |

---

## 5. Forms & Validation

### 5.1 Form Management

| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | 7.50.1 | Form state management |
| @hookform/resolvers | 3.3.4 | Form resolvers |

### 5.2 Validation

| Package | Version | Purpose |
|---------|---------|---------|
| zod | 3.22.4 | Schema validation |

---

## 6. Backend & Database

### 6.1 Supabase Client

| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | 2.39.7 | Supabase client |
| @supabase/ssr | 0.1.0 | SSR support for Supabase |

### 6.2 Supabase Configuration

```typescript
// Environment Variables Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 6.3 Database Schema Version

| Migration | Version | Description |
|-----------|---------|-------------|
| 001_initial | 1.0.0 | Initial schema with profiles, projects, articles |

---

## 7. Authentication

### 7.1 Auth Provider

**Supabase Auth** - Built into @supabase/supabase-js

Features used:
- Email/Password authentication
- Session management
- Password reset
- Row Level Security (RLS)

### 7.2 Auth Configuration

```typescript
// Auth settings in Supabase Dashboard
{
  "enable_signup": true,
  "email_confirm": false,  // MVP: no email confirmation
  "secure_password_change": true,
  "min_password_length": 8
}
```

---

## 8. Editor

### 8.1 Rich Text Editor

| Package | Version | Purpose |
|---------|---------|---------|
| @tiptap/react | 2.2.3 | Tiptap React bindings |
| @tiptap/starter-kit | 2.2.3 | Tiptap starter extensions |
| @tiptap/extension-placeholder | 2.2.3 | Placeholder extension |
| @tiptap/extension-image | 2.2.3 | Image support |
| @tiptap/extension-link | 2.2.3 | Link support |
| @tiptap/extension-code-block-lowlight | 2.2.3 | Code highlighting |
| lowlight | 3.1.0 | Syntax highlighting |

---

## 9. Utilities

### 9.1 Date & Time

| Package | Version | Purpose |
|---------|---------|---------|
| date-fns | 3.3.1 | Date manipulation |

### 9.2 ID Generation

| Package | Version | Purpose |
|---------|---------|---------|
| nanoid | 5.0.5 | Unique ID generation |

### 9.3 Markdown

| Package | Version | Purpose |
|---------|---------|---------|
| react-markdown | 9.0.1 | Markdown rendering |
| remark-gfm | 4.0.0 | GitHub Flavored Markdown |

---

## 10. Development Tools

### 10.1 Linting & Formatting

| Package | Version | Purpose |
|---------|---------|---------|
| eslint | 8.56.0 | Linting |
| eslint-config-next | 14.1.0 | Next.js ESLint config |
| prettier | 3.2.5 | Code formatting |
| prettier-plugin-tailwindcss | 0.5.11 | Tailwind class sorting |

### 10.2 Type Checking

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5.3.3 | Type system |
| @types/node | 20.11.16 | Node types |
| @types/react | 18.2.55 | React types |
| @types/react-dom | 18.2.19 | React DOM types |

---

## 11. Testing (Future Phase)

### 11.1 Unit Testing

| Package | Version | Purpose |
|---------|---------|---------|
| vitest | 1.2.2 | Test runner |
| @testing-library/react | 14.2.1 | React testing |

### 11.2 E2E Testing

| Package | Version | Purpose |
|---------|---------|---------|
| @playwright/test | 1.41.2 | E2E testing |

---

## 12. Deployment

### 12.1 Hosting Platform

**Vercel** - Primary deployment target

### 12.2 Environment Variables

```bash
# Required in Production
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://viblog.app
```

### 12.3 Vercel Configuration

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

---

## 13. Package.json Template

```json
{
  "name": "viblog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "3.3.4",
    "@radix-ui/react-avatar": "1.0.4",
    "@radix-ui/react-checkbox": "1.0.4",
    "@radix-ui/react-dialog": "1.0.5",
    "@radix-ui/react-dropdown-menu": "2.0.6",
    "@radix-ui/react-label": "2.0.2",
    "@radix-ui/react-select": "2.0.0",
    "@radix-ui/react-slot": "1.0.2",
    "@radix-ui/react-switch": "1.0.3",
    "@radix-ui/react-tabs": "1.0.4",
    "@radix-ui/react-toast": "1.1.5",
    "@radix-ui/react-tooltip": "1.0.7",
    "@supabase/ssr": "0.1.0",
    "@supabase/supabase-js": "2.39.7",
    "@tiptap/extension-code-block-lowlight": "2.2.3",
    "@tiptap/extension-image": "2.2.3",
    "@tiptap/extension-link": "2.2.3",
    "@tiptap/extension-placeholder": "2.2.3",
    "@tiptap/react": "2.2.3",
    "@tiptap/starter-kit": "2.2.3",
    "class-variance-authority": "0.7.0",
    "clsx": "2.1.0",
    "date-fns": "3.3.1",
    "framer-motion": "11.0.8",
    "lucide-react": "0.323.0",
    "nanoid": "5.0.5",
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "7.50.1",
    "react-markdown": "9.0.1",
    "remark-gfm": "4.0.0",
    "tailwind-merge": "2.2.1",
    "zod": "3.22.4"
  },
  "devDependencies": {
    "@types/node": "20.11.16",
    "@types/react": "18.2.55",
    "@types/react-dom": "18.2.19",
    "autoprefixer": "10.4.17",
    "eslint": "8.56.0",
    "eslint-config-next": "14.1.0",
    "postcss": "8.4.35",
    "prettier": "3.2.5",
    "prettier-plugin-tailwindcss": "0.5.11",
    "tailwindcss": "3.4.1",
    "typescript": "5.3.3"
  },
  "packageManager": "pnpm@8.15.1"
}
```

---

## 14. Version Lock Reasoning

### Why These Specific Versions?

| Package | Reasoning |
|---------|-----------|
| Next.js 14.1.0 | Latest stable with App Router, server actions |
| React 18.2.0 | Stable, compatible with all our dependencies |
| TypeScript 5.3.3 | Latest stable, improved type inference |
| Tailwind 3.4.1 | Latest stable with new features |
| Supabase JS 2.39.7 | Latest with SSR support |
| Framer Motion 11.0.8 | Latest with improved performance |

---

## 15. Dependency Update Policy

### Update Frequency

| Type | Frequency | Process |
|------|-----------|---------|
| Security patches | Immediately | `pnpm update --latest` |
| Minor versions | Monthly | Review changelog, test |
| Major versions | Quarterly | Full regression test |

### Breaking Changes Protocol

1. Create new branch: `chore/upgrade-[package]`
2. Update package
3. Run full test suite
4. Manual QA of affected features
5. PR with detailed changelog notes

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13