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

## 8. Technical Decisions

### 8.1 MCP Protocol
- **Transport:** HTTP/SSE (for remote access)
- **Protocol Version:** 2025-11-25
- **Message Format:** JSON-RPC 2.0

### 8.2 AI Model Routing
- **Opus:** Structure extraction, complex analysis
- **Sonnet:** Content generation, learning tasks
- **Haiku:** Quick operations, formatting

### 8.3 Data Storage
- **Primary:** Supabase PostgreSQL
- **JSONB:** Flexible schema for context data
- **Full-text Search:** Supabase pg_trgm for article search

---

## 9. Open Questions

1. **Rate Limiting:** How to handle high-frequency `append_session_context` calls?
2. **Privacy:** How to handle community article search while respecting privacy?
3. **Model Selection:** Should user be able to choose which model processes their data?
4. **Caching:** How to cache `learn_from_articles` results for common queries?

---

## 10. References

- [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [Claude Code MCP Integration](https://code.claude.com/docs/en/mcp)
- [Claude Code Analysis](./.comp_product_assets/ai-coding-tools/claude-code-analysis.md)

---

**Document Status:** Ready for Review

**Next Steps:**
1. User reviews and approves design
2. Begin Layer 1 implementation
3. Create database migrations
4. Build MCP Server scaffold