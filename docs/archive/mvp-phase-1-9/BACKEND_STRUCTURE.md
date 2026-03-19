# Viblog - Backend Structure Document

## 1. Overview

This document defines the database schema, API endpoints, and backend logic for Viblog.

---

## 2. Database Architecture

### 2.1 Database Provider

**Supabase PostgreSQL** - Managed PostgreSQL with built-in auth and real-time capabilities.

### 2.2 Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  auth.users (Supabase managed)                              │
│       │                                                     │
│       │ 1:1                                                 │
│       ▼                                                     │
│  public.profiles ─────────┬──────────────┐                  │
│       │                   │              │                  │
│       │ 1:N               │ 1:N          │                  │
│       ▼                   ▼              ▼                  │
│  public.projects     public.articles  public.user_settings  │
│       │                                                     │
│       │ 1:N                                                 │
│       ▼                                                     │
│  public.articles                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema

### 3.1 Profiles Table

```sql
-- Extends Supabase auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  github_username TEXT,
  twitter_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Index for username lookups
CREATE INDEX profiles_username_idx ON public.profiles(username);

-- Index for public profile queries
CREATE INDEX profiles_created_at_idx ON public.profiles(created_at DESC);
```

### 3.2 Projects Table

```sql
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  is_public BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
  CONSTRAINT description_length CHECK (char_length(description) <= 500),
  UNIQUE(user_id, slug)
);

-- Indexes
CREATE INDEX projects_user_id_idx ON public.projects(user_id);
CREATE INDEX projects_created_at_idx ON public.projects(created_at DESC);
CREATE INDEX projects_slug_idx ON public.projects(slug);
```

### 3.3 Articles Table

```sql
CREATE TABLE public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,

  -- Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,

  -- Vibe Coding Metadata
  vibe_platform TEXT,
  vibe_duration_minutes INTEGER,
  vibe_model TEXT,
  vibe_prompt TEXT,
  vibe_ai_response TEXT,

  -- Publishing
  status TEXT DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'private' NOT NULL CHECK (visibility IN ('public', 'private', 'unlisted')),
  is_premium BOOLEAN DEFAULT false NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,

  -- Engagement
  stars_count INTEGER DEFAULT 0 NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  published_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT published_has_content CHECK (status != 'published' OR content IS NOT NULL),
  UNIQUE(user_id, slug)
);

-- Indexes
CREATE INDEX articles_user_id_idx ON public.articles(user_id);
CREATE INDEX articles_project_id_idx ON public.articles(project_id);
CREATE INDEX articles_status_idx ON public.articles(status);
CREATE INDEX articles_visibility_idx ON public.articles(visibility);
CREATE INDEX articles_published_at_idx ON public.articles(published_at DESC);
CREATE INDEX articles_stars_count_idx ON public.articles(stars_count DESC);
CREATE INDEX articles_created_at_idx ON public.articles(created_at DESC);

-- Full-text search index
CREATE INDEX articles_content_search_idx ON public.articles USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));
```

### 3.4 User Settings Table

```sql
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- LLM Configuration
  llm_provider TEXT,
  llm_api_key_encrypted TEXT,
  llm_model TEXT,

  -- Database Configuration
  database_type TEXT CHECK (database_type IN ('supabase', 'clickhouse', 'sqlite', 'none')),
  database_url_encrypted TEXT,

  -- Vibe Platforms
  vibe_platforms JSONB DEFAULT '[]'::jsonb,

  -- Discovery
  discovery_source TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index
CREATE INDEX user_settings_user_id_idx ON public.user_settings(user_id);
```

### 3.5 Stars Table (Engagement)

```sql
CREATE TABLE public.stars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, article_id)
);

CREATE INDEX stars_user_id_idx ON public.stars(user_id);
CREATE INDEX stars_article_id_idx ON public.stars(article_id);
```

---

## 4. Row Level Security (RLS)

### 4.1 Profiles RLS

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 4.2 Projects RLS

```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- View public projects or own projects
CREATE POLICY "Projects are viewable by owner or if public"
  ON public.projects FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

-- Users manage their own projects
CREATE POLICY "Users can manage own projects"
  ON public.projects FOR ALL
  USING (user_id = auth.uid());
```

### 4.3 Articles RLS

```sql
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- View published public articles or own articles
CREATE POLICY "Articles are viewable if public or owned"
  ON public.articles FOR SELECT
  USING (
    (status = 'published' AND visibility = 'public')
    OR user_id = auth.uid()
  );

-- Users manage their own articles
CREATE POLICY "Users can manage own articles"
  ON public.articles FOR ALL
  USING (user_id = auth.uid());
```

### 4.4 User Settings RLS

```sql
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Only owner can view/modify settings
CREATE POLICY "Users can manage own settings"
  ON public.user_settings FOR ALL
  USING (user_id = auth.uid());
```

### 4.5 Stars RLS

```sql
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;

-- Anyone can view stars
CREATE POLICY "Stars are viewable by everyone"
  ON public.stars FOR SELECT
  USING (true);

-- Authenticated users can star
CREATE POLICY "Authenticated users can star"
  ON public.stars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own stars
CREATE POLICY "Users can remove own stars"
  ON public.stars FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 5. Database Functions

### 5.1 Auto-update Timestamps

```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### 5.2 Create Profile on User Signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5.3 Update Article Stars Count

```sql
CREATE OR REPLACE FUNCTION public.handle_star_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.articles
    SET stars_count = stars_count + 1
    WHERE id = NEW.article_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.articles
    SET stars_count = stars_count - 1
    WHERE id = OLD.article_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_star_change
  AFTER INSERT OR DELETE ON public.stars
  FOR EACH ROW EXECUTE FUNCTION public.handle_star_change();
```

---

## 6. API Endpoints

### 6.1 API Structure

All API routes are under `/api/` using Next.js API Routes.

### 6.2 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/reset-password` | Request password reset |
| POST | `/api/auth/update-password` | Update password |

### 6.3 User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PATCH | `/api/user/profile` | Update current user profile |
| GET | `/api/user/settings` | Get user settings |
| PATCH | `/api/user/settings` | Update user settings |

### 6.4 Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/[id]` | Get project details |
| PATCH | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |

### 6.5 Article Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List user's articles |
| POST | `/api/articles` | Create new article |
| GET | `/api/articles/[id]` | Get article details |
| PATCH | `/api/articles/[id]` | Update article |
| DELETE | `/api/articles/[id]` | Delete article |
| POST | `/api/articles/[id]/publish` | Publish article |
| POST | `/api/articles/[id]/unpublish` | Unpublish article |

### 6.6 Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/articles` | List public articles (feed) |
| GET | `/api/public/articles/[slug]` | Get public article |
| GET | `/api/public/users/[username]` | Get public profile |
| GET | `/api/public/users/[username]/articles` | Get user's public articles |
| POST | `/api/public/articles/[id]/star` | Star an article |
| DELETE | `/api/public/articles/[id]/star` | Unstar an article |

---

## 7. API Request/Response Schemas

### 7.1 Create Article Request

```typescript
// POST /api/articles
interface CreateArticleRequest {
  title: string;           // Required, 1-100 chars
  content: string;         // Required
  excerpt?: string;        // Optional, auto-generated if not provided
  cover_image?: string;    // Optional URL
  project_id?: string;     // Optional UUID

  // Vibe metadata
  vibe_platform?: 'claude-code' | 'cursor' | 'codex' | 'trae' | 'other';
  vibe_duration_minutes?: number;
  vibe_model?: string;
  vibe_prompt?: string;
  vibe_ai_response?: string;

  // Publishing
  status?: 'draft' | 'published';
  visibility?: 'public' | 'private' | 'unlisted';
  is_premium?: boolean;
  price?: number;
}

interface CreateArticleResponse {
  id: string;
  slug: string;
  title: string;
  status: string;
  created_at: string;
}
```

### 7.2 List Articles Response

```typescript
// GET /api/articles
interface ListArticlesResponse {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string | null;
    status: 'draft' | 'published' | 'archived';
    visibility: 'public' | 'private' | 'unlisted';
    stars_count: number;
    views_count: number;
    published_at: string | null;
    created_at: string;
    project: {
      id: string;
      name: string;
    } | null;
  }>;
  total: number;
  page: number;
  per_page: number;
}
```

### 7.3 Public Feed Response

```typescript
// GET /api/public/articles
interface PublicFeedResponse {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string | null;
    stars_count: number;
    vibe_platform: string | null;
    vibe_duration_minutes: number | null;
    vibe_model: string | null;
    is_premium: boolean;
    price: number;
    published_at: string;
    author: {
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    };
  }>;
  total: number;
  page: number;
  per_page: number;
}
```

---

## 8. Error Handling

### 8.1 Error Response Format

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

### 8.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Permission denied |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 9. Storage

### 9.1 Supabase Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `avatars` | User avatars | Public read, authenticated write |
| `covers` | Article cover images | Public read, authenticated write |

### 9.2 Storage Policies

```sql
-- Avatars bucket policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars');

-- Covers bucket policies (similar structure)
```

---

## 10. Migration Files

### 10.1 Migration File Naming

```
supabase/migrations/
├── 20260313000000_initial_schema.sql
├── 20260313000001_rls_policies.sql
├── 20260313000002_functions.sql
└── 20260313000003_storage_buckets.sql
```

---

**Document Version:** 1.0
**Last Updated:** 2026-03-13