# Viblog MCP Service - Design Document

## Document Information
- **Version:** 1.0
- **Created:** 2026-03-15
- **Status:** Draft for Review
- **Author:** Viblog Team

---

## 1. Overview

### 1.1 Vision

Viblog MCP Service 是 Viblog 的核心基础设施，实现 **AI-Native** 博客体验：

```
AI-Native Definition:
"Not just AI writing blogs for you, but AI growing blogs from your coding sessions"
```

### 1.2 Core Values

| Value | Description |
|-------|-------------|
| **Record** | Capture the authentic vibe coding context |
| **Share** | Transform experiences into beautiful content |
| **Grow** | Build a personal knowledge base that evolves |

### 1.3 Design Philosophy

```
传统博客：记录 → 分享 → 结束

Viblog AI-Native：
  记录 → 分享 → 学习 → 进化 → 应用 → 再记录
         ↑_______________________________|
                    成长飞轮
```

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│         Claude Code / Codex / OpenClaw / Cursor / Windsurf       │
│                     (MCP Client / Host)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ JSON-RPC 2.0 over HTTP/SSE
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Viblog MCP Server                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Layer 1: 数据采集 (Data Collection)                             │
│  ├── create_vibe_session                                         │
│  ├── append_session_context                                      │
│  └── upload_session_context                                      │
│                                                                   │
│  Layer 2: 结构化处理 (Structured Processing)                     │
│  ├── generate_structured_context                                 │
│  └── update_structured_context                                   │
│                                                                   │
│  Layer 3: 内容生成 (Content Generation)                          │
│  ├── generate_article_draft                                      │
│  ├── update_article_draft                                        │
│  └── merge_sessions_to_article                                   │
│                                                                   │
│  Layer 4: 发布管理 (Publish Management)                          │
│  ├── publish_article                                             │
│  ├── get_session_status                                          │
│  └── list_user_sessions                                          │
│                                                                   │
│  Layer 5: 智能学习与成长 (Intelligent Learning & Growth)         │
│  ├── learn_from_articles                                         │
│  ├── analyze_project_health                                      │
│  ├── create_project_assistant                                    │
│  ├── get_growth_metrics                                          │
│  └── check_content_freshness                                     │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Viblog Backend (Supabase)                    │
│  ├── vibe_sessions                                               │
│  ├── session_context_fragments                                   │
│  ├── articles                                                    │
│  └── knowledge_graph                                             │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
[Session 发生]
     │
     ▼
[原始数据采集] ←─ create_vibe_session, append/upload_session_context
     │
     ▼
[结构化处理] ←─ generate_structured_context (Opus 分析提取)
     │
     ▼
[内容生成] ←─ generate_article_draft
     │
     ▼
[发布] ←─ publish_article
     │
     ▼
[成长循环] ←─ learn_from_articles, analyze_project_health, etc.
```

---

## 3. MCP Tools Specification

### 3.1 Layer 1: Data Collection

#### 3.1.1 create_vibe_session

**Purpose:** 创建新的 Vibe Coding Session

**Trigger:** 用户开始一个新的 vibe coding session，想要记录

**Parameters:**
```typescript
{
  project_name: string;           // 必填：项目名称
  session_type?: "coding" | "debugging" | "learning" | "exploration";
  tags?: string[];                // 可选标签
  auto_capture?: boolean;         // 是否自动捕获后续操作
}
```

**Returns:**
```typescript
{
  session_id: string;
  created_at: string;
  status: "active";
}
```

---

#### 3.1.2 append_session_context

**Purpose:** 增量追加 session 数据

**Trigger:** 在 session 过程中逐步上传数据

**Parameters:**
```typescript
{
  session_id: string;
  context_type: "conversation" | "code_snippet" | "file_change" | "command" | "document";

  content: {
    // === conversation ===
    role?: "user" | "assistant";
    message?: string;
    timestamp?: string;

    // === code_snippet ===
    language?: string;
    code?: string;
    file_path?: string;
    description?: string;

    // === file_change ===
    action?: "create" | "modify" | "delete";
    diff?: string;

    // === command ===
    command?: string;
    output?: string;
    exit_code?: number;

    // === document ===
    document_type?: "markdown" | "json" | "yaml";
    purpose?: string;
  };

  metadata?: {
    importance?: "critical" | "high" | "medium" | "low";
    auto_generated?: boolean;
  };
}
```

---

#### 3.1.3 upload_session_context

**Purpose:** 批量上传完整原始上下文

**Trigger:** session 结束时一次性上传所有数据

**Parameters:**
```typescript
{
  session_id: string;

  raw_context: {
    project_info: {
      name: string;
      tech_stack?: string[];
      description?: string;
    };

    conversation: Array<{
      role: "user" | "assistant";
      content: string;
      timestamp: string;
      attachments?: string[];
    }>;

    code_changes: Array<{
      file_path: string;
      action: "create" | "modify" | "delete";
      diff?: string;
      final_content?: string;
    }>;

    commands_run: Array<{
      command: string;
      output?: string;
      success: boolean;
      timestamp: string;
    }>;

    documents_referenced?: Array<{
      path: string;
      type: string;
      relevance?: string;
    }>;
  };

  metadata?: {
    duration_minutes?: number;
    outcome?: "success" | "partial" | "failed";
    key_learnings?: string[];
  };
}
```

---

### 3.2 Layer 2: Structured Processing

#### 3.2.1 generate_structured_context

**Purpose:** 从原始数据生成结构化 JSON（默认第一步）

**Execution Logic:**
1. 读取 session 原始数据
2. 使用 Opus 模型分析提取
3. 输出结构化 JSON

**Parameters:**
```typescript
{
  session_id: string;
  format?: "standard" | "detailed" | "compact";
  focus_areas?: ("problem" | "solution" | "code" | "learnings" | "decisions")[];
  custom_prompt?: string;
}
```

**Returns - StructuredVibeContext:**
```typescript
{
  session_id: string;

  // 核心问题
  problem: {
    summary: string;              // 一句话问题描述
    context: string;              // 背景上下文
    constraints?: string[];       // 约束条件
  };

  // 解决方案
  solution: {
    approach: string;             // 解决思路
    steps: Array<{
      order: number;
      action: string;
      code_snippet?: string;
      reasoning?: string;
    }>;
    alternative_approaches?: string[];
  };

  // 关键代码
  key_code: Array<{
    purpose: string;
    language: string;
    code: string;
    file_path?: string;
    explanation: string;
  }>;

  // 关键决策
  decisions: Array<{
    decision: string;
    reasoning: string;
    alternatives_considered?: string[];
  }>;

  // 学到的东西
  learnings: Array<{
    category: "technique" | "pattern" | "tool" | "concept" | "pitfall";
    content: string;
    code_example?: string;
  }>;

  // 元数据
  metadata: {
    tech_stack: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    time_spent_minutes?: number;
    tags: string[];
  };
}
```

---

#### 3.2.2 update_structured_context

**Purpose:** 手动更新结构化数据

**Trigger:** 用户想手动调整/补充结构化内容

**Parameters:**
```typescript
{
  session_id: string;
  structured_data: Partial<StructuredVibeContext>;
  merge_mode?: "replace" | "append" | "merge";
}
```

---

### 3.3 Layer 3: Content Generation

#### 3.3.1 generate_article_draft

**Purpose:** 从结构化数据生成文章草稿

**Parameters:**
```typescript
{
  session_id: string;
  article_style?: "tutorial" | "case_study" | "tips" | "deep_dive" | "quick_note";
  target_audience?: "beginner" | "intermediate" | "advanced";
  include_sections?: ("problem" | "solution" | "code" | "learnings" | "next_steps")[];
  tone?: "casual" | "professional" | "educational";
  custom_instructions?: string;
}
```

---

#### 3.3.2 update_article_draft

**Purpose:** 更新草稿内容

**Parameters:**
```typescript
{
  draft_id: string;
  content: {
    title?: string;
    markdown?: string;
    json_content?: object;  // AI-consumable version
  };
  preserve_version?: boolean;
}
```

---

#### 3.3.3 merge_sessions_to_article

**Purpose:** 从多个 session 合并生成文章

**Trigger:** 跨多个 session 生成综合性文章

**Parameters:**
```typescript
{
  session_ids: string[];
  merge_strategy: "chronological" | "thematic" | "problem_solution";
  article_focus?: string;
}
```

---

### 3.4 Layer 4: Publish Management

#### 3.4.1 publish_article

**Purpose:** 发布文章

**Parameters:**
```typescript
{
  draft_id: string;
  publish_options: {
    visibility: "public" | "private" | "unlisted";
    publish_as_dual_format: boolean;  // Markdown + JSON
    generate_social_snippets?: boolean;
    notify_subscribers?: boolean;
  };
}
```

---

#### 3.4.2 get_session_status

**Purpose:** 获取 session 状态和追溯

**Parameters:**
```typescript
{
  session_id: string;
  include_trace?: boolean;
}
```

**Returns:**
```typescript
{
  session_id: string;
  created_at: string;
  current_stage: "raw" | "structured" | "draft" | "published";

  trace?: {
    raw_context_size: number;
    structured_at?: string;
    draft_created_at?: string;
    published_at?: string;
    published_article_id?: string;
  };
}
```

---

#### 3.4.3 list_user_sessions

**Purpose:** 列出用户的 sessions

**Parameters:**
```typescript
{
  status?: "raw" | "structured" | "draft" | "published";
  date_range?: { from: string; to: string };
  tags?: string[];
  limit?: number;
}
```

---

### 3.5 Layer 5: Intelligent Learning & Growth

#### 3.5.1 learn_from_articles

**Purpose:** 从文章中学习，提取可复用模式

**Core Capabilities:** 搜索、读取、分析、提取、结构化输出

**Parameters:**
```typescript
{
  search_scope: {
    user_articles?: boolean;
    community_articles?: boolean;
    specific_tags?: string[];
    date_range?: { from: string; to: string };
  };

  learning_goal:
    | "extract_patterns"
    | "extract_insights"
    | "extract_decisions"
    | "extract_mistakes"
    | "extract_best_practices"
    | "generate_agents_skills"
    | "summarize_evolution"
    | "find_knowledge_gaps";

  query: string;  // 自然语言查询

  output_format?: "structured" | "actionable" | "config_files";
}
```

**Returns:**
```typescript
{
  matched_articles: Array<{
    article_id: string;
    title: string;
    relevance_score: number;
    key_excerpts: string[];
  }>;

  patterns: Array<{
    pattern_name: string;
    description: string;
    code_example?: string;
    source_articles: string[];
    applicability: string;
  }>;

  actionable_output?: {
    agents_to_create?: AgentConfig[];
    skills_to_create?: SkillConfig[];
    hooks_to_add?: HookConfig[];
    claude_md_updates?: string;
  };

  knowledge_graph_updates?: {
    new_connections: Array<{ from: string; to: string; relation: string }>;
    confidence_boost: Array<{ topic: string; new_level: number }>;
  };
}
```

---

#### 3.5.2 analyze_project_health

**Purpose:** 分析项目的 vibe coding 历史，诊断健康度

**Parameters:**
```typescript
{
  project_name: string;

  analysis_dimensions: Array<
    | "code_quality_trend"
    | "problem_frequency"
    | "technology_evolution"
    | "time_efficiency"
    | "learning_velocity"
  >;

  time_range?: { from: string; to: string };
}
```

**Returns:**
```typescript
{
  overall_score: number;  // 0-100

  dimensions: {
    code_quality: {
      score: number;
      trend: "improving" | "stable" | "declining";
      issues: Array<{
        type: string;
        frequency: number;
        recent_occurrences: string[];
      }>;
    };

    problem_patterns: {
      recurring_problems: Array<{
        problem: string;
        occurrence_count: number;
        first_seen: string;
        last_seen: string;
        suggested_fix: string;
      }>;
      new_problems_trend: number;
    };

    technology_health: {
      current_stack: string[];
      deprecated_usage: Array<{ tech: string; alternative: string }>;
      adoption_suggestions: Array<{ tech: string; reason: string }>;
    };

    learning_metrics: {
      sessions_per_week: number;
      avg_session_value: number;
      knowledge_retention: number;
      skill_growth: Array<{ skill: string; level_before: number; level_after: number }>;
    };
  };

  recommendations: Array<{
    priority: "high" | "medium" | "low";
    category: string;
    action: string;
    expected_impact: string;
    related_articles: string[];
  }>;
}
```

---

#### 3.5.3 create_project_assistant

**Purpose:** 创建项目专属的 AI 知识助手

**Parameters:**
```typescript
{
  project_name: string;

  assistant_type:
    | "onboarding"
    | "debugging"
    | "architecture"
    | "code_review"
    | "learning";

  knowledge_sources: {
    include_all_user_articles: boolean;
    specific_sessions?: string[];
    include_community_articles?: string[];
  };

  custom_instructions?: string;
}
```

**Capabilities:**
- `answer_project_question(query)` - 基于项目历史回答问题
- `suggest_code(context, intent)` - 代码建议
- `diagnose_issue(error, context)` - 问题诊断
- `recommend_learning()` - 学习推荐
- `export_as_claude_md()` - 导出为 CLAUDE.md
- `export_as_mcp_prompt()` - 导出为 MCP Prompt

---

#### 3.5.4 get_growth_metrics

**Purpose:** 获取用户的成长数据

**Parameters:**
```typescript
{
  time_range?: { from: string; to: string };
  granularity?: "day" | "week" | "month";
}
```

**Returns:**
```typescript
{
  skill_tree: {
    skills: Array<{
      name: string;
      category: string;
      level: 1 | 2 | 3 | 4 | 5;
      experience_points: number;
      sessions_contribution: string[];
    }>;
    categories: Array<{
      name: string;
      total_skills: number;
      avg_level: number;
    }>;
  };

  growth_curve: Array<{
    date: string;
    sessions_count: number;
    problems_solved: number;
    new_patterns_learned: number;
    knowledge_retention_score: number;
  }>;

  milestones: Array<{
    date: string;
    milestone: string;
    article_id: string;
    impact: string;
  }>;

  community_comparison: {
    percentile: number;
    top_skills: string[];
    areas_to_improve: string[];
  };
}
```

---

#### 3.5.5 check_content_freshness

**Purpose:** 检测文章内容是否过时

**Parameters:**
```typescript
{
  article_id?: string;
  check_types: Array<
    | "deprecated_code"
    | "outdated_practice"
    | "new_alternatives"
    | "broken_links"
    | "version_compatibility"
  >;
}
```

**Returns:**
```typescript
{
  articles_needing_update: Array<{
    article_id: string;
    title: string;
    issues: Array<{
      type: string;
      location: string;
      current_content: string;
      issue: string;
      suggestion: string;
      severity: "critical" | "moderate" | "minor";
    }>;
    related_new_articles: string[];
  }>;

  batch_update_suggestions: Array<{
    pattern: string;
    affected_articles: string[];
    suggested_fix: string;
  }>;
}
```

---

## 4. Database Schema

### 4.1 Core Tables

```sql
-- Vibe Coding Sessions
CREATE TABLE vibe_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  project_name TEXT NOT NULL,
  session_type TEXT DEFAULT 'coding',
  tags TEXT[] DEFAULT '{}',

  -- 当前阶段
  stage TEXT DEFAULT 'raw'
    CHECK (stage IN ('raw', 'structured', 'draft', 'published')),

  -- 原始上下文 (JSONB)
  raw_context JSONB DEFAULT '{}',

  -- 结构化数据 (JSONB)
  structured_context JSONB,

  -- 元数据
  metadata JSONB DEFAULT '{}',

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 追溯链
  published_article_id UUID REFERENCES articles
);

-- Session 上下文片段（支持增量追加）
CREATE TABLE session_context_fragments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES vibe_sessions NOT NULL,
  fragment_type TEXT NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_vibe_sessions_user ON vibe_sessions(user_id);
CREATE INDEX idx_vibe_sessions_stage ON vibe_sessions(stage);
CREATE INDEX idx_vibe_sessions_project ON vibe_sessions(project_name);
CREATE INDEX idx_session_fragments_session ON session_context_fragments(session_id);
```

### 4.2 Growth Tables

```sql
-- 用户技能树
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INT DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  experience_points INT DEFAULT 0,
  contributing_sessions TEXT[] DEFAULT '{}',
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, skill_name)
);

-- 知识图谱
CREATE TABLE knowledge_graph (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  topic TEXT NOT NULL,
  connections JSONB DEFAULT '[]',  -- [{topic, relation, strength}]
  confidence_level INT DEFAULT 1,
  source_articles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 成长里程碑
CREATE TABLE growth_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  milestone_type TEXT NOT NULL,
  milestone_name TEXT NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  article_id UUID REFERENCES articles,
  metadata JSONB DEFAULT '{}'
);
```

---

## 5. Usage Scenarios

### 5.1 Scenario A: Default Flow (JSON First)

```
1. create_vibe_session("viblog-mcp-design")
   → session_id: "abc-123"

2. upload_session_context(session_id, raw_context)
   → 原始数据上传完成

3. generate_structured_context(session_id)
   → 自动分析提取，生成结构化 JSON

4. generate_article_draft(session_id, { style: "tutorial" })
   → 生成草稿

5. publish_article(draft_id)
   → 发布
```

### 5.2 Scenario B: Incremental Upload

```
1. create_vibe_session("debug-auth-issue")

2. append_session_context(session_id, { type: "conversation", ... })
   append_session_context(session_id, { type: "code_snippet", ... })
   append_session_context(session_id, { type: "file_change", ... })
   → 逐步追加

3. generate_structured_context(session_id)

4. update_structured_context(session_id, {
     learnings: [{ category: "pitfall", content: "..." }]
   })

5. generate_article_draft(session_id, { style: "case_study" })
```

### 5.3 Scenario C: Learning from Articles

```
User: "我想做一个新的 MCP Server 项目，帮我配置 agents 和 skills"

Viblog executes:
1. learn_from_articles({
     query: "MCP Server 开发最佳实践",
     learning_goal: "generate_agents_skills"
   })

2. Returns:
   - 建议的 CLAUDE.md 配置
   - 推荐的 MCP tools 列表
   - 相关文章中的坑点提醒
```

### 5.4 Scenario D: Project Health Check

```
1. analyze_project_health({
     project_name: "viblog",
     analysis_dimensions: ["problem_frequency", "learning_velocity"]
   })

2. Returns:
   - 发现：最近 3 次遇到相同的 React 性能问题
   - 建议：学习 React.memo 正确用法
   - 推荐：重读自己的 Article #12
```

### 5.5 Scenario E: Team Knowledge Transfer

```
create_project_assistant({
  project_name: "viblog",
  assistant_type: "onboarding",
  knowledge_sources: {
    include_all_user_articles: true
  }
})

// 新成员可以问：
// "这个项目的认证是怎么实现的？"
// "为什么选择 Supabase？"
// "之前遇到过什么大坑？"

// 助手基于团队的 vibe coding 历史回答
```

---

## 6. AI-Native Differentiation

| Aspect | Traditional Blog | Viblog AI-Native |
|--------|------------------|------------------|
| **Content** | Static | Dynamic, auto-detect outdated |
| **Reading** | Passive | Active learning recommendations |
| **Structure** | Isolated articles | Knowledge graph connections |
| **Lifecycle** | Record → End | Record → Share → Learn → Evolve |
| **Discovery** | User finds content | Content finds user |
| **Knowledge** | Accumulation | Evolution |
| **Feedback** | None | Growth visualization |
| **Creation** | One-time | Continuous iteration |

---

## 7. Implementation Priority

### Phase 1: Core MCP Tools (MVP)
- [ ] Layer 1: Data Collection (3 tools)
- [ ] Layer 2: Structured Processing (2 tools)
- [ ] Layer 3: Content Generation (3 tools)
- [ ] Layer 4: Publish Management (3 tools)

### Phase 2: Growth Features
- [ ] Layer 5: learn_from_articles
- [ ] Layer 5: analyze_project_health
- [ ] Layer 5: get_growth_metrics

### Phase 3: Advanced Growth
- [ ] Layer 5: create_project_assistant
- [ ] Layer 5: check_content_freshness
- [ ] Knowledge Graph integration
- [ ] Skill Tree visualization

---

## 8. Technical Decisions (Updated 2026-03-16)

### 8.1 Hybrid Data Architecture

**Decision from Brainstorming:** Data is split between user database and platform database.

```
User Database (Supabase/Local)          Viblog Platform Database
├── vibe_sessions (raw session)         ├── published_articles (public copy)
├── session_fragments                   ├── public_knowledge_nodes
├── articles (draft/private)            └── global_search_index
└── knowledge_graph (personal)

Core Principle:
- Private data stays in user database
- Published content syncs to platform with user authorization
- Platform data is a copy; user can revoke sync anytime
```

**Implementation:**
- User's Supabase instance stores all raw sessions and drafts
- On publish, user authorizes sync of article summary to platform
- Platform maintains search index and public knowledge graph
- Revocation removes platform copy, preserves user's original

### 8.2 Model Routing Strategy

**Decision from Brainstorming:** Local-first with platform fallback.

```
Strategy: local_first

MCP Tool                  Model Required         Routing
─────────────────────────────────────────────────────────
generate_structured_context  Opus/Sonnet        Local → Fallback
generate_article_draft       Sonnet             Local → Fallback
learn_from_articles          Sonnet             Local → Fallback
analyze_project_health       Opus               Local → Fallback

Token Consumption:
├── Default: User's local LLM (Claude Code/Cursor)
├── Fallback: User's Viblog API Key (when local insufficient)
└── Pro Users: Platform-provided model quota
```

**Implementation:**
```typescript
interface ModelRouterConfig {
  preferLocal: true;
  localModel: 'claude-opus' | 'claude-sonnet' | 'local-llm';
  fallbackToCloud: true;
  fallbackApiKey: string;  // User's Viblog API key
}
```

### 8.3 MCP Protocol
- **Transport:** stdio (CLI) + SSE (HTTP) for flexibility
- **Protocol Version:** 2025-11-25
- **Message Format:** JSON-RPC 2.0

### 8.4 Data Storage
- **Primary:** User's Supabase PostgreSQL
- **Platform:** Viblog Platform PostgreSQL (for published content)
- **JSONB:** Flexible schema for context data
- **Full-text Search:** Platform pg_trgm for public article search

---

## 9. Resolved Technical Questions (From Brainstorming)

### 9.1 Rate Limiting Implementation ✅

**Solution:** Client buffer + batch upload; Server queue + async processing.

**Client-Side:**
```typescript
interface BufferConfig {
  maxSize: 50;           // Max items before forced flush
  maxWaitMs: 5000;       // Max time before auto-flush (5 seconds)
  retryAttempts: 3;      // Retry count on failure
}

// Buffer accumulates append_session_context calls
// Flushes when: 50 items OR 5 seconds elapsed
```

**Server-Side:**
```typescript
interface RateLimitConfig {
  create_session: { limit: 10, window: '1h' };
  append_context: { limit: 1000, window: '1h' };
  upload_context: { limit: 50, window: '1h' };
  generate_draft: { limit: 20, window: '1h' };
}

// Heavy operations (generate_structured_context) go to queue
// Worker processes with concurrency: 5
```

### 9.2 Data Sync Protocol ✅

**Solution:** User-authorized sync with granular control.

```typescript
interface SyncGranularity {
  full: 'Complete article + metadata';
  summary_only: 'AI-generated summary only';
  ai_metadata_only: 'Structured JSON only, no content';
}

// Sync flow:
// 1. User publishes article
// 2. User selects sync granularity
// 3. Platform receives authorized copy
// 4. Search index updated
// 5. User can revoke sync anytime
```

**Conflict Resolution:**
- Last-Write-Wins for simple fields (timestamps, status)
- Merge Strategy for arrays (tags, snippets) - union with deduplication
- User Authority for human input fields (reflections, notes)

### 9.3 Draft Bucket Model ✅

**Decision:** Independent `draft_buckets` table (Option B).

**Rationale:**
- Clear separation: sessions = raw data, drafts = processed content
- Better query performance for draft management
- Enables multiple drafts per session
- Cleaner status workflow (raw → structured → draft → published)

---

## 10. AI-Data-Native Architecture (Added 2026-03-16)

### 10.1 Core Insight

**AI-Native = AI-Data-Native**

数据结构的设计才能将AI-Native彻底打通。关键问题：**如何设计数据Protocol，让AI访问Viblog时自动知道如何I/O？**

### 10.2 AI Data Requirements Matrix

| Data Type | A2A Scenario | Human Writing | Platform Monitoring | Storage Location | Tech Stack |
|-----------|--------------|---------------|---------------------|------------------|------------|
| **Structured Data** | MCP tool param parsing | Article JSON format | Statistics reports | User DB + Platform DB | JSON Schema |
| **Vector Embeddings** | Semantic retrieval learning | Annotation association recommendation | Similarity analysis | Platform DB | pgvector |
| **Knowledge Graph** | Association reasoning learning | Citation relationship discovery | Knowledge network analysis | User DB + Platform DB | Graph DB |
| **Behavioral Time Series** | User interest evolution | Personalized recommendation | Trend analysis | Platform DB | TimescaleDB |

### 10.3 AI Data Access Protocol Design

#### 10.3.1 Core Principles

**Principle 1: Authorized Access**
```
User chooses authorization → Clearly informed of trade-off → AI obtains access permission

Trade-off Examples:
├── Authorize insights access → AI recommendations more precise, but privacy partially exposed
├── Authorize session data → Earn credits, but data used for training
└── No authorization of any private data → Only use platform public data, limited experience
```

**Principle 2: Protocol Self-Description**
```
When AI accesses Viblog, it automatically obtains:
├── Accessible data list (based on authorization status)
├── Data Schema definitions
├── Access endpoints and authentication methods
└── Data usage constraints (read-only/read-write/training permission)
```

#### 10.3.2 AI-Data-Schema Interface

```typescript
// Metadata obtained when AI first accesses Viblog
interface AIDataSchema {
  version: "1.0";

  // Data source definitions
  datasources: {
    name: string;           // Data source name
    location: "user_db" | "platform_db";
    access: "public" | "authorized" | "private";
    description: string;    // AI-understandable data description
  }[];

  // Structured data schemas
  schemas: {
    name: string;
    jsonSchema: JSONSchema;
    endpoints: {
      read: string;         // GET endpoint
      write?: string;       // POST endpoint (if write permission exists)
    };
  }[];

  // Vector retrieval interfaces
  vectorStores: {
    name: string;
    dimension: number;
    metric: "cosine" | "euclidean";
    searchEndpoint: string;
    description: string;
  }[];

  // Knowledge graph interfaces
  knowledgeGraphs: {
    name: string;
    nodeTypes: string[];
    edgeTypes: string[];
    queryEndpoint: string;
    description: string;
  }[];

  // Behavioral time series interfaces
  timeSeries: {
    name: string;
    metrics: string[];
    granularity: "hour" | "day" | "week";
    queryEndpoint: string;
    description: string;
  }[];

  // Authorization status
  authorization: {
    granted: string[];      // Authorized data sources
    pending: string[];      // Available but not authorized
    unavailable: string[];  // Not accessible
  };
}
```

#### 10.3.3 Example: AI Writing Article Data Access

```
AI Task: Help user write an article about "Embodied Intelligence"

Step 1: AI obtains AIDataSchema
├── Discovers available data sources:
│   ├── user_insights (authorized) ← User has authorized
│   ├── external_links (authorized) ← User has authorized
│   ├── published_articles (public) ← Platform public data
│   └── article_paragraphs (public) ← Vector retrieval
└── Discovers searchable vectors:
    ├── user_insights.embedding
    ├── article_paragraphs.embedding
    └── articles.content_embedding

Step 2: AI formulates data acquisition plan
├── Retrieve user insights about "Embodied Intelligence"
├── Retrieve user's related external links
├── Retrieve platform articles on related topics
└── Retrieve paragraphs from related articles

Step 3: AI executes queries
├── Vector retrieval: user_insights.embedding similarity > 0.8
├── Association query: insight_links → external_links
├── Vector retrieval: article_paragraphs similarity > 0.75
└── Structured query: published_articles where topic='Embodied Intelligence'

Step 4: AI generates article
├── Integrates user's insights
├── Cites external links (citation format)
├── References viewpoints from platform articles
└── Generates structured JSON content
```

### 10.4 Data Protocol Design Details

#### 10.4.1 Structured Data (JSON Schema)

**Scenario:** AI needs precise understanding of data semantics

**Storage Location:**
- User creation data → User DB
- Platform statistics data → Platform DB

**Tech Stack:**
- Schema definition: JSON Schema Draft 2020-12
- Validation: Zod / AJV
- Storage: PostgreSQL JSONB

**AI Access Method:**
```typescript
// AI reads structured data
GET /api/v1/ai/data/{schema_name}?filter={...}

// Returns data conforming to JSON Schema
{
  "$schema": "https://viblog.ai/schemas/article_insights.json",
  "data": [...]
}
```

#### 10.4.2 Vector Embeddings

**Scenario:** AI needs semantic retrieval and similarity matching

**Storage Location:** Mainly stored in Platform DB (for retrieval)

**Tech Stack:**
- Vector generation: OpenAI text-embedding-3-small
- Storage: PostgreSQL + pgvector
- Indexing: IVFFlat / HNSW

**AI Access Method:**
```typescript
// AI vector retrieval
POST /api/v1/ai/vectors/{store_name}/search
{
  "query": "Latest research on embodied intelligence",
  "k": 10,
  "threshold": 0.75
}

// Returns data IDs corresponding to similar vectors
{
  "results": [
    { "id": "uuid-1", "score": 0.92, "content_preview": "..." },
    ...
  ]
}
```

#### 10.4.3 Knowledge Graph

**Scenario:** AI needs to understand associations between data

**Storage Location:**
- User personal knowledge graph → User DB
- Platform global knowledge graph → Platform DB

**Tech Stack:**
- Graph database: Neo4j / RedisGraph / PostgreSQL + Apache AGE
- Query language: Cypher / GraphQL

**AI Access Method:**
```typescript
// AI graph query
POST /api/v1/ai/graph/{graph_name}/query
{
  "query": "MATCH (u:User)-[:WROTE]->(a:Article)-[:CITES]->(l:Link) WHERE u.id = $user_id RETURN a, l",
  "parameters": { "user_id": "..." }
}

// Returns graph structure data
{
  "nodes": [...],
  "edges": [...]
}
```

#### 10.4.4 Behavioral Time Series

**Scenario:** AI needs to understand user interest evolution, platform trends

**Storage Location:** Platform DB

**Tech Stack:**
- Time series database: TimescaleDB / PostgreSQL + partitioned tables
- Querying: SQL window functions

**AI Access Method:**
```typescript
// AI time series query
GET /api/v1/ai/timeseries/{metric_name}?from=...&to=...&granularity=day

// Returns time series data
{
  "metric": "article_views",
  "data": [
    { "time": "2026-03-01", "value": 1523 },
    { "time": "2026-03-02", "value": 1687 },
    ...
  ]
}
```

### 10.5 AI Data Access Confirmation Design Decisions

#### Decision 1: Authorization Granularity ✅

**Principle:** First solve existence, then solve quality

**Solution:** Data source level authorization (MVP)
```
User-authorizable data sources:
├── user_insights → [ ] Authorize
├── external_links → [ ] Authorize
├── vibe_sessions → [ ] Authorize (contribute training data)
└── knowledge_graph → [ ] Authorize

Future iterations (based on user feedback):
├── Field-level authorization
└── Time-range authorization
```

#### Decision 2: AI Identity Authentication ✅

**Solution:** MCP tools carry authorization token

```
Workflow:
1. User applies for authorization token in Personal Settings
2. User confirms Apply → Token automatically fills MCP configuration
3. MCP tools automatically carry Token when called
4. Platform validates Token permissions then returns data

Default state: Token is empty → No authorization of any private data
```

**Token Design:**
```typescript
interface AuthorizationToken {
  token_id: string;
  user_id: string;
  granted_datasources: string[];  // Authorized data sources
  created_at: string;
  expires_at: string;
  last_used_at: string;
}
```

#### Decision 3: Data Desensitization Levels ✅

**Solution:** Three-level permissions, user-selectable

| Level | Name | Description | Risk |
|-------|------|-------------|------|
| 1 | Sensitive field desensitization | Default, sensitive fields (email, phone, etc.) desensitized | Low |
| 2 | Fully transparent | AI can access all raw data | Medium (requires confirmation) |
| 3 | Training authorization | Data can be used to train Viblog models | High (requires confirmation + credits) |

**UI Design:**
```
Personal Settings > AI Authorization
┌────────────────────────────────────────┐
│ Data Access Permissions                 │
│                                        │
│ [x] Authorize AI to access my insights │
│ [x] Authorize AI to access my external links │
│ [ ] Authorize AI to access my coding sessions │
│                                        │
│ Privacy Level:                         │
│ ○ Sensitive fields desensitized (default) │
│ ○ Fully transparent ⚠️ Risk warning    │
│ ○ Training authorization → +50 credits/month │
└────────────────────────────────────────┘
```

---

## 11. Open Questions (Remaining)

1. **Privacy:** How to handle community article search while respecting privacy?
   - Proposed: Opt-in for community search; default is private

2. **Caching:** How to cache `learn_from_articles` results for common queries?
   - Proposed: Redis cache with 1-hour TTL for common patterns

---

## 11. References

- [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Claude Code MCP Integration](https://code.claude.com/docs/en/mcp)
- [Claude Code Analysis](../.comp_product_assets/ai-coding-tools/claude-code-analysis.md)
- [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md) - Phase 10 detailed steps

---

**Document Version:** 3.0
**Updated:** 2026-03-16
**Status:** Approved for Implementation

**Key Decisions:**
1. Hybrid Data Architecture (User DB + Platform DB)
2. Local-first Model Routing with Platform Fallback
3. Client Buffer + Server Queue Rate Limiting
4. Independent Draft Buckets Table
5. User-Authorized Data Sync Protocol
6. **NEW: AI-Data-Native Architecture** - AIDataSchema, Authorization Token, Three-level Privacy
7. **NEW: Four Data Protocols** - Structured Data, Vector Embeddings, Knowledge Graph, Time Series