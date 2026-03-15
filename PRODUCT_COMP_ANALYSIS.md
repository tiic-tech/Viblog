# Viblog - Competitive Analysis Report

## 文档信息
- **功能**: 竞品分析报告，深度拆解竞品的产品设计和技术实现
- **作用**: 产品差异化决策的依据，指导功能设计和视觉设计
- **职责**: 明确"我们与竞品的差异在哪里"，产出可执行的技术方案
- **阅读时机**: 按需阅读 - 当需要进行竞品分析或差异化设计时

---

## 0. Competitive Analysis Workflow (CRITICAL - MUST FOLLOW)

### 0.1 ⚠️ WARNING - READ BEFORE EXECUTION ⚠️

**This workflow was created due to repeated serious errors that caused:**
- Session rollbacks and data loss
- Wasted API calls (firecrawl/exa free tier limits)
- Broken workflow requiring re-exploration
- Significant productivity loss

**The following errors MUST NEVER happen again:**
1. ❌ Playwright exploration too shallow (only 2 layers, missing important pages)
2. ❌ Calling glm-5 for visual analysis (TEXT-ONLY model, causes input errors)
3. ❌ Step 1 and Step 2 not decoupled (data lost when rollback triggered)

---

### 0.2 Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPETITIVE ANALYSIS WORKFLOW                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐    │
│  │   STEP 1     │         │   STEP 2     │         │   STEP 3     │    │
│  │  Web Scraping │───────▶│ Screenshots  │─────────▶│Visual Analysis│   │
│  │  (firecrawl, │  MUST   │  (Playwright) │  STOP   │(image-analyzer)│  │
│  │     exa)     │  SAVE   │              │  REPORT │              │    │
│  └──────────────┘         └──────────────┘         └──────────────┘    │
│         │                        │                        │             │
│         │   ⚠️ DECOUPLE          │   ⚠️ USER              │             │
│         │   Step 1→2             │   CONFIRM              │             │
│         ▼                        ▼                        ▼             │
│  ┌────────────────┐       ┌────────────────┐      ┌────────────────┐   │
│  │ SAVE TO *.md   │       │ DEEP EXPLORE   │      │ PARALLEL AGENTS│   │
│  │ BEFORE STEP 2  │       │ ALL LAYERS     │      │ ONE IMG/AGENT  │   │
│  └────────────────┘       └────────────────┘      └────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                        STEP 4                                  │      │
│  │              Comprehensive Analysis Report                     │      │
│  │                    (glm-5 orchestrates)                        │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                        STEP 5                                  │      │
│  │              Update IMPLEMENTATION_PLAN & CHANGELOG            │      │
│  │                    (Self-check, then report)                   │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 0.3 MANDATORY RULES - MUST FOLLOW EXACTLY

#### 🔴 RULE 1: Step 1 MUST Save Data Before Step 2

```
Step 1 完成 firecrawl + exa 原始数据爬取后，必须将获得的数据落入 *.md 文档
与后续步骤解耦，防止重复爬取
```

**Required Action:**
1. Complete all firecrawl/exa scraping
2. **IMMEDIATELY** write results to `.comp_product_assets/[category]/[product]-scraped.md`
3. Only after saving, proceed to Step 2

**Why:** If Step 2 triggers rollback, Step 1 data is preserved

---

#### 🔴 RULE 2: Playwright MUST Deep Explore

```
Playwright 必须深度探索一个产品
在各个层级的典型交互页面必须至少有一张截图
产品详细页面最好是 full size
```

**Minimum Exploration Depth:**
- Homepage (hero, navigation, featured content)
- User profile pages (self + other users)
- Detail pages (product/article/shot)
- Search/filter pages
- Settings/preferences
- AI features (if any)
- Mobile responsive views

**Required Screenshots:**
- At least 5-8 screenshots per product
- Full-page screenshots for important pages
- Detail shots for key UI components

---

#### 🔴 RULE 3: STOP After Playwright - User Confirmation Required

```
Step 2 Playwright 深度探索，截图完成后
必须停止任务，向我汇报进度
问询我是否调用 Agent，使用 image-analyzer skill 进行视觉理解
```

**Required Report Format:**
```
📊 Playwright Exploration Complete

Product: [Product Name]
Screenshots Captured: [X] screenshots
- screenshot_1.png - [Description]
- screenshot_2.png - [Description]
- ...

Pages Explored:
- Homepage ✓
- User Profile ✓
- Detail Page ✓
- Settings ✓
- AI Features ✓/✗

Ready for Step 3 (Visual Analysis)?

Please confirm: Should I proceed with image-analyzer-kimi agents?
```

**⚠️ NEVER proceed to Step 3 without user confirmation**

---

#### 🔴 RULE 4: Parallel Agents for Visual Analysis

```
视觉理解阶段，必须调用多个 agent 平行处理
每个 agent 一张，减少模型 api 负荷，同时提高分析效率
```

**Implementation:**
```markdown
# CORRECT: Parallel agents, one image per agent
Launch 5 agents in parallel:
- Agent 1: image-analyzer-kimi on screenshot_1.png
- Agent 2: image-analyzer-kimi on screenshot_2.png
- Agent 3: image-analyzer-kimi on screenshot_3.png
- Agent 4: image-analyzer-kimi on screenshot_4.png
- Agent 5: image-analyzer-kimi on screenshot_5.png

# WRONG: Single agent processing all images
# WRONG: glm-5 analyzing images directly
```

---

#### 🔴 RULE 5: Comprehensive Report After Visual Analysis

```
视觉理解完全完成之后
汇总所有得到的情报，进行最终的竞品分析报告撰写
```

**Report Structure:**
1. Web scraping summary (from Step 1 saved file)
2. Screenshot inventory (from Step 2)
3. Visual analysis findings (from Step 3 agents)
4. 5-dimension scoring (IA, Visual, Flow, Features, Tech)
5. Design tokens extraction
6. Patterns for Viblog (Adopt/Adapt/avoid)

---

#### 🔴 RULE 6: Self-Update and Report

```
完成竞品分析报告后，自行检查 IMPLEMENTATION_PLAN.md, CHANGELOG.md
进行 Update。完成后向我汇报
```

**Update Checklist:**
- [ ] IMPLEMENTATION_PLAN.md - Mark step as Completed, add key findings
- [ ] CHANGELOG.md - Add analysis entry with score and findings
- [ ] Report to user with summary

---

### 0.4 Model Responsibilities

| Model | Role | Capabilities | CRITICAL NOTE |
|-------|------|--------------|---------------|
| **glm-5** | Main Orchestrator | Agent coordination, complex reasoning, report writing | ⚠️ **NO VISION** - TEXT ONLY |
| **kimi-k2.5** | Deep Vision Analysis | Complex UI screenshots, design specs, architecture diagrams | ✅ Use via image-analyzer-kimi skill |
| **qwen3.5-plus** | Quick Vision Analysis | Simple images, OCR, quick scans | ✅ Use via image-analyzer-qwen skill |

**⚠️ CRITICAL WARNING:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ⚠️ NEVER use glm-5 for visual analysis ⚠️                    │
│                                                                 │
│   glm-5 is a TEXT-ONLY model with NO vision capabilities       │
│                                                                 │
│   Calling glm-5 on images will cause:                          │
│   - Input processing errors                                     │
│   - Session rollback required                                   │
│   - Data loss from previous steps                               │
│   - Wasted API calls                                            │
│                                                                 │
│   ✅ ALWAYS use image-analyzer-* skills for vision:             │
│      - image-analyzer-kimi: Deep analysis (PREFERRED)           │
│      - image-analyzer-qwen: Quick analysis                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 0.5 Step-by-Step Workflow (DETAILED)

#### Step 1: Web Scraping (DO FIRST - SAVE BEFORE NEXT STEP)

**Purpose:** Gather raw web content and documentation

**Tools:**
- `mcp__firecrawl__firecrawl_scrape` - Single page scraping
- `mcp__firecrawl__firecrawl_map` - Discover URLs on a site
- `mcp__exa-web-search__web_search_exa` - Web search for content
- `mcp__exa-web-search__get_code_context_exa` - Code/technical content

**⚠️ MANDATORY SAVE STEP:**
```
1. Use firecrawl_map to discover key pages
2. Use firecrawl_scrape to extract content from each page
3. Use exa web_search for additional context
4. ⚠️ SAVE results to .comp_product_assets/[category]/[product]-scraped.md
5. ONLY THEN proceed to Step 2
```

**Output:** Raw web content saved to `.comp_product_assets/[category]/[product]-scraped.md`

---

#### Step 2: Screenshot Capture (AFTER Step 1 SAVED)

**Purpose:** Capture visual UI for analysis

**Tools:**
- `mcp__plugin_playwright_playwright__browser_navigate` - Navigate to URL
- `mcp__plugin_playwright_playwright__browser_snapshot` - Accessibility snapshot
- `mcp__plugin_playwright_playwright__browser_take_screenshot` - Visual screenshot
- `mcp__plugin_playwright_playwright__browser_click` - Navigate deeper
- `mcp__plugin_playwright_playwright__browser_close` - Close when done

**⚠️ DEEP EXPLORATION REQUIRED:**
```
1. Navigate to target URL (Homepage)
2. Explore ALL navigation options
3. Visit user profile pages
4. Visit detail/product pages
5. Check for AI features
6. Check settings/preferences
7. Test mobile viewport
8. Take screenshots at EACH layer
9. Resize images if needed (<500KB)
```

**⚠️ STOP AND REPORT:**
```
After Playwright exploration complete:
1. Close browser
2. List all screenshots captured
3. Report to user with format in Rule 3
4. WAIT for user confirmation before Step 3
```

**Output:** Screenshots in `.comp_product_assets/[category]/[product]_snapshot/`

---

#### Step 3: Visual Analysis (USER CONFIRMED - USE SKILLS)

**Purpose:** Extract design patterns and specifications from screenshots

**⚠️ ONLY START AFTER USER CONFIRMS**

**TOOL SELECTION:**

| Scenario | Use This Skill | Why |
|----------|----------------|-----|
| Complex UI screenshots | `image-analyzer-kimi` | Detailed measurements, design tokens |
| Simple diagrams | `image-analyzer-qwen` | Faster, sufficient detail |
| Architecture diagrams | `image-analyzer-kimi` | Need structure understanding |
| OCR / text extraction | `image-analyzer-qwen` | Quick text reading |

**⚠️ PARALLEL EXECUTION REQUIRED:**
```markdown
# Launch multiple agents in ONE message
Agent 1: Skill "image-analyzer-kimi" with args "screenshot_1.png"
Agent 2: Skill "image-analyzer-kimi" with args "screenshot_2.png"
Agent 3: Skill "image-analyzer-kimi" with args "screenshot_3.png"
...
```

**Output:** Analysis in `.comp_product_assets/[category]/[product]-analysis_kimi.md`

---

#### Step 4: Comprehensive Report (AFTER ALL VISUAL ANALYSIS)

**Purpose:** Synthesize all findings into actionable report

**Process:**
1. glm-5 reads all collected materials:
   - Scraped web content (Step 1 - from saved file)
   - Screenshots metadata (Step 2)
   - Visual analysis results (Step 3 - from all agents)
2. glm-5 writes comprehensive analysis report
3. Score each dimension (1-5) with justification
4. Extract design tokens and patterns
5. Document technical translations

**Output:** Final report `.comp_product_assets/[category]/[product]-analysis.md`

---

#### Step 5: Update Documents & Report (FINAL)

**Purpose:** Update tracking documents and notify user

**Update Checklist:**
- [ ] `IMPLEMENTATION_PLAN.md` - Mark step Completed, add key findings summary
- [ ] `CHANGELOG.md` - Add entry with score and key takeaways

**Report Format:**
```
✅ Competitive Analysis Complete

Product: [Product Name]
Score: [X]/25
Key Findings:
- Finding 1
- Finding 2
- Finding 3

Documents Updated:
- IMPLEMENTATION_PLAN.md ✓
- CHANGELOG.md ✓

Ready for next analysis or synthesis phase.
```

---

### 0.6 Common Mistakes - NEVER REPEAT

| Mistake | Consequence | Correct Approach |
|---------|-------------|------------------|
| Using glm-5 for vision | Input errors, rollback, data loss | Use image-analyzer-* skills |
| Not saving Step 1 data | Re-scraping needed, wasted API calls | Save to *.md immediately |
| Shallow Playwright explore | Incomplete analysis | Explore ALL layers, 5-8+ screenshots |
| Skipping user report | Broken workflow | STOP and report after Step 2 |
| Sequential skill calls | Slow, inefficient | Parallel agents, one image each |
| Not updating docs | Tracking lost | Update IMPLEMENTATION_PLAN + CHANGELOG |

---

### 0.7 Quick Reference Commands

```bash
# Step 1: Web scraping + SAVE
mcp__firecrawl__firecrawl_scrape(url, formats=["markdown"])
mcp__exa-web-search__web_search_exa(query, numResults=5)
# ⚠️ THEN SAVE TO *.md FILE

# Step 2: Deep Playwright exploration
mcp__plugin_playwright_playwright__browser_navigate(url)
mcp__plugin_playwright_playwright__browser_click(...)  # Navigate deeper
mcp__plugin_playwright_playwright__browser_take_screenshot(type="png")
# ⚠️ STOP AND REPORT TO USER

# Step 3: Visual analysis (AFTER USER CONFIRM)
# Launch parallel agents, one per image:
Skill(skill="image-analyzer-kimi", args="/path/to/screenshot_1.png")
Skill(skill="image-analyzer-kimi", args="/path/to/screenshot_2.png")
# ...

# Step 4: Report (glm-5 handles this)
Read all collected materials
Write comprehensive analysis

# Step 5: Update docs
Edit IMPLEMENTATION_PLAN.md
Edit CHANGELOG.md
Report to user
```

---

## 1. Analysis Framework

### 1.1 Analysis Dimensions

| Dimension | Description | Output |
|-----------|-------------|--------|
| **Information Architecture (IA)** | Product structure, navigation, information hierarchy | Structure diagram |
| **Visual Design System** | Colors, typography, components, animations | Design tokens |
| **Interaction Flow** | Core user flows, interaction patterns | Flow diagrams |
| **Feature Matrix** | Feature comparison, differentiation points | Feature table |
| **Technical Implementation** | Tech stack, architecture patterns | Tech recommendations |

### 1.2 Detailed Evaluation Criteria

#### 1.2.1 Information Architecture (IA)

**评估目标：** 理解产品的信息组织方式和导航结构

| 评估项 | 说明 | 观察要点 |
|--------|------|----------|
| **层级深度** | 信息层级是否合理 | 3层以内为佳，超过5层为差 |
| **导航清晰度** | 导航是否直观易懂 | 主导航、面包屑、侧边栏的一致性 |
| **分类逻辑** | 内容分类是否合理 | 用户心智模型匹配度 |
| **搜索发现** | 搜索和发现机制 | 全局搜索、标签系统、推荐入口 |
| **URL结构** | URL是否语义化 | RESTful、可读性、分享友好 |

**评分标准 (1-5)：**
- **5分：** 层级清晰(≤3层)，导航直观，分类符合心智模型，搜索强大
- **4分：** 层级合理(≤4层)，导航清晰，分类较好
- **3分：** 层级可接受(≤5层)，导航基本可用
- **2分：** 层级过深，导航有困惑
- **1分：** 信息混乱，导航难以理解

---

#### 1.2.2 Visual Design System

**评估目标：** 提取可复用的视觉设计模式

| 评估项 | 说明 | 观察要点 |
|--------|------|----------|
| **色彩系统** | 主色、辅色、语义色 | 色彩数量、对比度、深色模式 |
| **排版系统** | 字体、字号、行高 | 字体栈、响应式排版、阅读舒适度 |
| **组件规范** | 按钮、卡片、表单 | 一致性、复用性、可扩展性 |
| **间距系统** | margin、padding | 间距比例、网格系统 |
| **动效设计** | 过渡、动画 | 流畅度、目的性、性能影响 |
| **图标系统** | 图标风格、使用场景 | 一致性、可识别性 |

**评分标准 (1-5)：**
- **5分：** 完整设计系统，视觉一致性强，动效精致
- **4分：** 设计系统较完整，视觉一致性较好
- **3分：** 基本视觉规范，有一定一致性
- **2分：** 视觉较混乱，一致性差
- **1分：** 无设计系统，视觉混乱

**设计Token提取模板：**
```css
/* Colors */
--primary: #xxx;
--secondary: #xxx;
--background: #xxx;
--foreground: #xxx;
--accent: #xxx;
--muted: #xxx;

/* Typography */
--font-sans: "xxx", sans-serif;
--font-mono: "xxx", monospace;
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;

/* Spacing */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;

/* Radius */
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 1rem;
```

---

#### 1.2.3 Interaction Flow

**评估目标：** 理解核心用户旅程和交互模式

| 评估项 | 说明 | 观察要点 |
|--------|------|----------|
| **注册流程** | 注册步骤、验证方式 | 步骤数、第三方登录、引导 |
| **核心操作** | 主要功能的操作路径 | 点击次数、操作复杂度 |
| **错误处理** | 错误提示、恢复机制 | 提示清晰度、容错性 |
| **反馈机制** | 操作反馈、进度展示 | 即时反馈、加载状态 |
| **快捷操作** | 键盘快捷键、批量操作 | 效率提升、高级功能 |

**评分标准 (1-5)：**
- **5分：** 流程极简，交互流畅，错误处理完善
- **4分：** 流程简洁，交互顺畅，错误处理较好
- **3分：** 流程可接受，交互基本顺畅
- **2分：** 流程繁琐，交互有卡点
- **1分：** 流程混乱，交互困难

**流程图符号说明：**
```
[矩形] = 页面/状态
(圆角) = 操作/动作
<菱形> = 判断/分支
--> = 流程方向
```

---

#### 1.2.4 Feature Matrix

**评估目标：** 对比功能特性，找出差异化机会

| 评估项 | 说明 | 观察要点 |
|--------|------|----------|
| **核心功能** | 产品主要功能 | 功能完整度、独特性 |
| **辅助功能** | 增值功能 | 实用性、差异化 |
| **集成能力** | 第三方集成 | API、Webhook、插件 |
| **自定义能力** | 配置、扩展 | 主题、模板、自定义字段 |
| **协作功能** | 多人协作 | 权限、评论、版本控制 |

**评分标准 (1-5)：**
- **5分：** 功能全面，有独特创新，集成丰富
- **4分：** 功能较全面，有一定特色
- **3分：** 功能基本满足需求
- **2分：** 功能有缺失
- **1分：** 功能严重不足

---

#### 1.2.5 Technical Implementation

**评估目标：** 推断技术栈和架构模式

| 评估项 | 说明 | 推断方法 |
|--------|------|----------|
| **前端框架** | 使用的JS框架 | 查看DOM结构、bundle分析 |
| **UI组件库** | 组件库选择 | class命名、组件特征 |
| **状态管理** | 数据流管理 | React DevTools、网络请求 |
| **后端架构** | API设计 | 请求格式、响应结构 |
| **部署方式** | 托管平台 | 响应头、CDN特征 |
| **性能优化** | 加载、渲染优化 | Lighthouse、网络瀑布图 |

**评分标准 (1-5)：**
- **5分：** 技术栈先进，架构清晰，性能优秀
- **4分：** 技术栈较新，架构合理，性能良好
- **3分：** 技术栈可接受，架构一般
- **2分：** 技术栈过时，架构有问题
- **1分：** 技术债务严重

**技术栈推断工具：**
- Wappalyzer (浏览器插件)
- Chrome DevTools → Network
- Lighthouse 性能报告
- View Source 分析

---

### 1.3 Analysis Method

For each product:
1. **Landscape scan** - Understand the product at a high level
2. **Deep dive** - Analyze specific dimensions in detail
3. **Pattern extraction** - Identify reusable patterns
4. **Gap analysis** - Find opportunities for differentiation

### 1.4 Scoring Summary Template

```markdown
## [Product Name] - Scoring Summary

| Dimension | Score | Key Findings |
|-----------|-------|--------------|
| Information Architecture | X/5 | [Top 2-3 findings] |
| Visual Design System | X/5 | [Top 2-3 findings] |
| Interaction Flow | X/5 | [Top 2-3 findings] |
| Feature Matrix | X/5 | [Top 2-3 findings] |
| Technical Implementation | X/5 | [Top 2-3 findings] |
| **Total** | **XX/25** | |

### Applicable Patterns for Viblog
1. [Pattern to adopt]
2. [Pattern to adapt]
3. [Anti-pattern to avoid]
```

---

## 2. Traditional Blogging Platforms

### 2.1 Notion

**Analysis Date:** Pending

**Product Category:** All-in-one workspace / Blog

**Key Characteristics:**
- Block-based content editor
- Database-like organization
- Multi-purpose (notes, docs, wikis, blogs)

**Analysis Focus:**
- [ ] Content creation flow
- [ ] Publishing workflow
- [ ] Content organization
- [ ] Reader experience
- [ ] API/Integration capabilities

**Detailed Analysis:** (To be completed)

---

### 2.2 Medium

**Analysis Date:** Pending

**Product Category:** Blogging platform

**Key Characteristics:**
- Simple, distraction-free writing
- Built-in audience network
- Monetization via Partner Program

**Analysis Focus:**
- [ ] Writing experience
- [ ] Publication workflow
- [ ] Recommendation algorithm
- [ ] Reader engagement features
- [ ] Monetization model

**Detailed Analysis:** (To be completed)

---

### 2.3 Substack

**Analysis Date:** Pending

**Product Category:** Newsletter / Blog platform

**Key Characteristics:**
- Email-first distribution
- Subscription model
- Writer-focused monetization

**Analysis Focus:**
- [ ] Subscription flow
- [ ] Email integration
- [ ] Monetization features
- [ ] Reader relationship management

**Detailed Analysis:** (To be completed)

---

## 3. AI Coding Tools

### 3.1 Cursor

**Analysis Date:** Pending

**Product Category:** AI-powered IDE

**Key Characteristics:**
- VS Code fork with AI integration
- Context-aware code suggestions
- Chat-based coding assistance

**Analysis Focus:**
- [ ] Session recording capabilities
- [ ] Context capture mechanisms
- [ ] Export/sharing features
- [ ] MCP integration potential
- [ ] User workflow patterns

**Detailed Analysis:** (To be completed)

---

### 3.2 Claude Code

**Analysis Date:** 2026-03-15

**Product Category:** AI coding assistant

**Key Characteristics:**
- CLI-based AI assistant
- MCP server integration (reference implementation)
- Session-based interactions
- Tool use capabilities
- Multi-surface architecture (Terminal, VS Code, Desktop, Web, JetBrains)

**Cached Analysis:** `.comp_product_assets/ai-coding-tools/claude-code-analysis.md`

---

#### 3.2.1 Scoring Summary

| Dimension | Score | Key Findings |
|-----------|-------|--------------|
| Information Architecture | 5/5 | Multi-surface architecture with shared context |
| Visual Design System | 3/5 | Terminal-focused, minimal (intentional) |
| Interaction Flow | 5/5 | Natural language → Actions pipeline |
| Feature Matrix | 5/5 | MCP integration is the killer feature |
| Technical Implementation | 5/5 | JSON-RPC 2.0 protocol, session-based |
| **Total** | **23/25** | **Reference implementation for AI-native tools** |

---

#### 3.2.2 MCP Protocol Analysis (Critical for Viblog)

**Architecture:**
```
Claude Code Host
├── MCP Client Manager (coordinates connections)
├── Core Engine (shared across surfaces)
├── Tools Layer (file, bash, grep, etc.)
└── Memory System (CLAUDE.md + auto memory)
        │
        │ JSON-RPC 2.0
        ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  MCP Server   │  │  MCP Server   │  │  MCP Server   │
│  (Filesystem) │  │   (GitHub)    │  │  (Viblog)     │
└───────────────┘  └───────────────┘  └───────────────┘
```

**Key MCP Primitives:**
- **Tools**: Executable functions (`tools/call`)
- **Resources**: Data sources (`resources/read`)
- **Prompts**: Templates (`prompts/get`)

**Viblog MCP Tools Design:**
```json
{
  "tools": [
    {"name": "create_draft_bucket", "description": "Create draft from session"},
    {"name": "update_draft_bucket", "description": "Update existing draft"},
    {"name": "publish_article", "description": "Publish draft to blog"},
    {"name": "get_user_articles", "description": "List user's articles"}
  ]
}
```

---

#### 3.2.3 Session Recording Pattern

```typescript
interface SessionRecord {
  id: string;
  timestamp: Date;
  projectPath: string;

  context: {
    claudeMdContent: string;
    gitBranch: string;
    recentFiles: string[];
  };

  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;

  actions: Array<{
    type: "read" | "write" | "bash" | "grep";
    target: string;
    result: string;
  }>;

  outcomes: {
    filesChanged: string[];
    commandsRun: string[];
  };
}
```

**Viblog Translation:** This maps directly to the **Draft Bucket** system.

---

#### 3.2.4 Patterns for Viblog

**Patterns to Adopt:**
- [x] **MCP Protocol** - Core integration layer
- [x] **Session Recording** - Capture coding sessions for article generation
- [x] **CLAUDE.md Pattern** - Persistent instructions per project
- [x] **Multi-surface Continuity** - Draft Bucket from multiple entry points

**Patterns to Adapt:**
- [ ] **Auto Memory** - Learn from published articles
- [ ] **Hooks System** - Automate publishing workflows

**Anti-patterns to Avoid:**
- [ ] Terminal-only interface (Viblog needs rich visual presentation)
- [ ] No export formats (Viblog must support Markdown, JSON, HTML)

---

#### 3.2.5 Technical Translation

**Draft Bucket Schema:**
```sql
CREATE TABLE draft_buckets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  session_context JSONB NOT NULL,
  raw_content JSONB NOT NULL,
  generated_draft JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3.3 Windsurf

**Analysis Date:** Pending

**Product Category:** AI-powered IDE

**Key Characteristics:**
- AI-native IDE
- Flow state for deep work
- Multi-file editing

**Analysis Focus:**
- [ ] Session persistence
- [ ] Context sharing
- [ ] Code history tracking

**Detailed Analysis:** (To be completed)

---

## 4. Code Sharing Platforms

### 4.1 GitHub Gist

**Analysis Date:** Pending

**Product Category:** Code snippet sharing

**Key Characteristics:**
- Simple code sharing
- Version history
- Public/private options

**Analysis Focus:**
- [ ] Sharing workflow
- [ ] Embedding capabilities
- [ ] API access

**Detailed Analysis:** (To be completed)

---

### 4.2 Stack Overflow

**Analysis Date:** Pending

**Product Category:** Q&A platform

**Key Characteristics:**
- Question-answer format
- Reputation system
- Code formatting

**Analysis Focus:**
- [ ] Knowledge sharing patterns
- [ ] Content organization
- [ ] Community engagement

**Detailed Analysis:** (To be completed)

---

## 5. Visual Design References

### 5.1 Pinterest

**Analysis Date:** Pending

**Product Category:** Visual discovery engine

**Key Characteristics:**
- Masonry grid layout
- Image-centric cards
- Infinite scroll
- Collections/Boards organization

**Analysis Focus:**
- [ ] Card design patterns
- [ ] Grid layout implementation
- [ ] Image loading optimization
- [ ] Interaction animations
- [ ] Responsive behavior

**Detailed Analysis:** (To be completed)

---

### 5.2 Dribbble

**Analysis Date:** Pending

**Product Category:** Design showcase

**Key Characteristics:**
- High-quality visual content
- Shot-based sharing
- Designer portfolios

**Analysis Focus:**
- [ ] Visual hierarchy
- [ ] Card hover effects
- [ ] Portfolio presentation
- [ ] Interaction polish

**Detailed Analysis:** (To be completed)

---

### 5.3 Behance

**Analysis Date:** Pending

**Product Category:** Creative portfolio

**Key Characteristics:**
- Project-based presentation
- Multi-image projects
- Creative community

**Analysis Focus:**
- [ ] Project page layout
- [ ] Content organization
- [ ] Navigation patterns

**Detailed Analysis:** (To be completed)

---

### 5.4 Awwwards

**Analysis Date:** Pending

**Product Category:** Web design awards

**Key Characteristics:**
- Premium design showcase
- Cutting-edge interactions
- High-end visual presentation

**Analysis Focus:**
- [ ] Premium visual patterns
- [ ] Animation techniques
- [ ] Navigation innovation
- [ ] Typography usage

**Detailed Analysis:** (To be completed)

---

## 6. Comprehensive Synthesis (Step 9.9)

### 6.1 Score Summary Matrix

**Analysis Completion Date:** 2026-03-15

| Product | Category | IA | Visual | Flow | Features | Tech | Total | Key Takeaway |
|---------|----------|-----|--------|------|----------|------|-------|--------------|
| **Cursor IDE** | AI Coding | 5 | 4 | 5 | 5 | 5 | **24/25** | Reference for AI-native IDE |
| **Notion** | Traditional Blog | 5 | 5 | 5 | 4 | 5 | **24/25** | Reference for AI-native content creation |
| **Claude Code** | AI Coding | 5 | 3 | 5 | 5 | 5 | **23/25** | Reference for MCP protocol |
| **Pinterest** | Visual Design | 4 | 5 | 5 | 4 | 4 | **22/25** | Reference for visual-first feeds |
| **Dribbble** | Visual Design | 5 | 5 | 4 | 4 | 4 | **22/25** | Reference for premium visual design |
| **Awwwards** | Visual Design | 5 | 5 | 4 | 4 | 4 | **22/25** | Reference for premium award platforms |
| **Medium** | Traditional Blog | 4 | 4 | 5 | 4 | 4 | **21/25** | Reference for reading experience |

**Average Score: 22.7/25** (Reference quality analyses)

---

### 6.2 Feature Comparison Matrix (Comprehensive)

| Feature | Viblog | Claude Code | Cursor | Notion | Medium | Pinterest | Dribbble | Awwwards |
|---------|--------|-------------|--------|--------|--------|-----------|----------|----------|
| **MCP Integration** | Planned | Yes | Yes | - | - | - | - | - |
| **Session Recording** | Planned | Partial | Partial | - | - | - | - | - |
| **AI Content Generation** | Planned | Yes | Yes | Yes | - | - | - | - |
| **Code Snippets (Rich)** | Yes | Yes | Yes | Yes | Limited | - | - | - |
| **Masonry/Card Grid** | Planned | - | - | - | - | Yes | Yes | Yes |
| **Dark Mode** | Yes | - | Yes | Yes | No | No | No | Yes |
| **Dual Format (Human+AI)** | Planned | - | - | Yes | - | - | - | - |
| **Progress Indicator** | Planned | - | - | - | Yes | - | - | - |
| **Reading Typography** | Planned | - | - | Yes | Yes | - | - | - |
| **Hover Interactions** | Planned | - | - | - | - | Yes | Yes | Yes |
| **Awards/Scoring System** | - | - | - | - | - | - | - | Yes |
| **Marketplace/Services** | - | - | - | - | - | - | Yes | Yes |
| **Multi-surface Access** | Planned | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Team/Enterprise** | - | - | Yes | Yes | - | Yes | Yes | Yes |
| **API Access** | Planned | MCP | MCP | Yes | Limited | - | - | - |

---

### 6.3 5 Key Differentiation Opportunities

#### Opportunity 1: MCP-Native Blogging Platform (P0 - Critical)

**Gap Identified:** No blogging platform currently offers native MCP integration.

**Competitive Analysis Evidence:**
- Claude Code (23/25) and Cursor (24/25) both scored highest in Features due to MCP support
- MCP enables seamless session-to-article transformation
- Viblog can be the **first mover** in this space

**Implementation Strategy:**
```typescript
// Viblog MCP Tools Architecture
const viblogMCPTools = {
  // Layer 1: Data Collection
  create_vibe_session: "Capture coding session context",
  append_session_context: "Add metadata to ongoing session",
  upload_session_context: "Upload external context files",

  // Layer 2: Content Generation
  generate_article_draft: "Transform session into article draft",
  merge_sessions_to_article: "Combine multiple sessions",

  // Layer 3: Publishing
  publish_article: "Publish with dual-layer format",
  get_user_articles: "Retrieve user's published content"
};
```

**Success Metric:** First blog platform with Claude Code + Cursor native integration.

---

#### Opportunity 2: Session-to-Article Automation (P0 - Critical)

**Gap Identified:** No platform automatically transforms coding sessions into blog content.

**Competitive Analysis Evidence:**
- Claude Code has session recording but no export to blog
- Cursor has session persistence but no content generation
- Notion has AI generation but requires manual input

**Viblog Solution:**
```
Daily Coding Session
        ↓
update_vibe_coding_history() [MCP Tool]
        ↓
Draft Bucket (auto-populated)
        ↓
Developer adds: "Today's insights"
        ↓
generate_article_draft() [MCP Tool]
        ↓
Review & Edit
        ↓
Publish (Dual-layer: Markdown + JSON)
```

**Differentiation:** 10x faster content creation for developers.

---

#### Opportunity 3: Dual-Layer Content Format (P0 - Critical)

**Gap Identified:** All platforms optimize for human readers only. None optimize for AI agents.

**Competitive Analysis Evidence:**
- Notion has block-based content but closed API
- Medium has excellent reading experience but no AI layer
- All platforms treat code as secondary content

**Viblog Solution:**
```json
{
  "article": {
    "human_readable": {
      "format": "markdown",
      "content": "# Article Title\n\nHuman-focused narrative..."
    },
    "ai_readable": {
      "format": "json",
      "summary": "Brief overview for AI consumption",
      "key_decisions": [
        {"decision": "Use PostgreSQL", "reason": "ACID compliance needed"}
      ],
      "code_snippets": [
        {"purpose": "Auth middleware", "code": "...", "language": "typescript"}
      ],
      "lessons_learned": ["Always validate tokens before decode"],
      "related_topics": ["authentication", "security", "jwt"]
    }
  }
}
```

**Success Metric:** Articles consumable by AI tools with <5% information loss.

---

#### Opportunity 4: Pinterest-Style Article Cards (P1 - High)

**Gap Identified:** Developer blogs lack visual appeal compared to design platforms.

**Competitive Analysis Evidence:**
- Pinterest (22/25) - Best masonry grid, card hover effects
- Dribbble (22/25) - Premium feel with whitespace, hover animations
- Awwwards (22/25) - High-end typography and visual polish

**Visual Specifications Extracted:**
```css
/* Article Card - Synthesized from Dribbble + Pinterest + Awwwards */
.article-card {
  /* From Dribbble: Premium feel */
  border-radius: 12px;
  background: white;
  overflow: hidden;

  /* Hover effect: Dribbble + Pinterest */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 24px -8px rgba(0, 0, 0, 0.1),
    0 4px 8px -2px rgba(0, 0, 0, 0.05);
}

/* Grid layout: Pinterest-inspired masonry */
.article-grid {
  columns: 4 280px;
  column-gap: 24px;
}

/* Whitespace: Dribbble philosophy */
.section-gap {
  margin: 60px 0; /* Premium breathing room */
}
```

**Success Metric:** Visual quality score ≥ Dribbble (22/25).

---

#### Opportunity 5: AI-Native Reading Experience (P1 - High)

**Gap Identified:** Medium's reading experience is best-in-class for text, but lacks code optimization.

**Competitive Analysis Evidence:**
- Medium (21/25) - Best reading typography: 21px Georgia, 1.6 line-height, 680px width
- Progress bar indicator improves UX
- Estimated read time is useful

**Viblog Enhancement for Developers:**
```css
/* Reading experience: Medium-inspired + Code-optimized */
.reader-content {
  /* From Medium Analysis */
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 21px;
  line-height: 1.6;
  max-width: 680px;
  margin: 0 auto;

  /* Viblog enhancement: Code blocks */
  --code-font: 'JetBrains Mono', 'Fira Code', monospace;
  --code-bg: #1e1e1e; /* VS Code dark */
}

/* Token estimate for AI readers (unique to Viblog) */
.ai-read-time::before {
  content: "~" attr(data-tokens) " tokens";
  /* Display token count for AI consumption estimation */
}
```

**Success Metric:** Reading experience ≥ Medium (21/25) with code optimization.

---

### 6.4 Technical Implementation Recommendations

#### 6.4.1 MCP Server Architecture (From Claude Code + Cursor Analysis)

```
Viblog MCP Server
├── Transport Layer
│   ├── stdio (CLI integration)
│   ├── SSE (HTTP streaming)
│   └── Streamable HTTP (with OAuth)
├── Tools Layer
│   ├── create_vibe_session
│   ├── append_session_context
│   ├── generate_article_draft
│   └── publish_article
├── Resources Layer
│   ├── user_articles://
│   ├── draft_buckets://
│   └── published_content://
└── Prompts Layer
    ├── summarize_session
    └── suggest_article_structure
```

#### 6.4.2 Visual Design System (From Pinterest + Dribbble + Awwwards)

**Design Tokens:**
```css
/* Synthesized from 3 visual design platforms */
:root {
  /* From Dribbble: Pink accent, minimal usage */
  --accent-primary: #6366f1; /* Indigo - developer aesthetic */
  --accent-hover: #4f46e5;

  /* From Awwwards: Premium typography */
  --font-display: 'Inter', system-ui, sans-serif;
  --font-body: Georgia, serif; /* Medium-inspired reading */
  --font-code: 'JetBrains Mono', monospace;

  /* From Pinterest: Card grid system */
  --card-radius: 12px;
  --card-gap: 24px;
  --card-width-min: 280px;

  /* Whitespace philosophy (Dribbble) */
  --space-section: 60px;
  --space-component: 24px;
  --space-element: 12px;
}
```

#### 6.4.3 Reading Experience (From Medium + Notion Analysis)

**Typography System:**
```css
/* Article typography: Medium-inspired with code optimization */
.article-body {
  font-family: Georgia, serif;
  font-size: 21px;
  line-height: 1.6;
  max-width: 680px;
  color: #292929;
}

/* Code blocks: VS Code-inspired */
.article-body pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

/* Progress indicator: Medium pattern */
.reading-progress {
  position: fixed;
  top: 0;
  height: 3px;
  background: var(--accent-primary);
  z-index: 100;
}
```

#### 6.4.4 Card Interaction (From Pinterest + Dribbble Analysis)

**Hover Behavior:**
```typescript
// Card hover: Dribbble lift + Pinterest overlay
const ArticleCard = ({ article }) => {
  return (
    <article className="group relative rounded-xl overflow-hidden bg-white
                        transition-all duration-200 ease-out
                        hover:-translate-y-1 hover:shadow-xl">
      {/* Preview image: Pinterest-style */}
      <div className="aspect-[4/3] bg-gray-100">
        <img src={article.preview} className="w-full h-full object-cover" />
      </div>

      {/* Hover overlay: Pinterest pattern */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                      transition-all duration-200 opacity-0 group-hover:opacity-100">
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <button className="btn-primary">Read</button>
          <button className="btn-secondary">Save</button>
        </div>
      </div>

      {/* Attribution: Dribbble pattern */}
      <div className="p-3 flex items-center gap-2">
        <img src={article.author.avatar} className="w-6 h-6 rounded-full" />
        <span className="text-sm font-medium">{article.author.name}</span>
      </div>
    </article>
  );
};
```

---

### 6.5 Priority Implementation Roadmap

| Priority | Feature | Source Analysis | Estimated Effort |
|----------|---------|-----------------|------------------|
| **P0** | MCP Server (5 tools) | Claude Code + Cursor | 2 weeks |
| **P0** | Draft Bucket System | Claude Code session recording | 1 week |
| **P0** | Dual-Layer Content Format | Original innovation | 1 week |
| **P1** | Pinterest-style Card Grid | Pinterest + Dribbble | 1 week |
| **P1** | Article Card Hover Effects | Dribbble + Pinterest | 3 days |
| **P1** | Reading Typography System | Medium + Notion | 3 days |
| **P1** | Progress Indicator | Medium | 1 day |
| **P2** | Dark Mode Optimization | Cursor + Awwwards | 2 days |
| **P2** | Token Estimation Display | Original innovation | 1 day |

---

### 6.6 Key Takeaways from Competitive Analysis

#### For Product Strategy
1. **First-mover advantage** in MCP-native blogging (no competitors)
2. **Visual quality gap** exists - developer blogs lack Dribbble/Awwwards polish
3. **Session-to-article** is unexplored territory (10x faster content creation)
4. **Dual-layer content** enables AI-native consumption (unique to Viblog)

#### For Technical Implementation
1. **MCP Protocol** from Claude Code is battle-tested and documented
2. **Card interactions** from Pinterest/Dribbble are proven patterns
3. **Reading typography** from Medium is gold standard
4. **Dark mode** from Cursor/Awwwards is developer-preferred

#### For Visual Design
1. **12px border radius** for modern, premium feel (Dribbble)
2. **4:3 card aspect ratio** for code previews (Pinterest adaptation)
3. **60px section gaps** for breathing room (Dribbble philosophy)
4. **21px Georgia** for reading comfort (Medium)

---

## 7. Original Feature Comparison Matrix (Legacy)

| Feature | Viblog | Notion | Medium | Cursor | Claude Code | Pinterest |
|---------|--------|--------|--------|--------|-------------|-----------|
| MCP Integration | Planned | - | - | Yes | Yes | - |
| Session Recording | Planned | - | - | Partial | Partial | - |
| AI Content Generation | Planned | Yes | - | Yes | Yes | - |
| Code Snippets | Yes | Yes | Limited | Yes | Yes | - |
| Masonry Layout | Planned | - | - | - | - | Yes |
| Dark Mode | Yes | Yes | No | Yes | - | No |
| Dual Format | Planned | Yes | - | - | - | - |

---

## 7. Differentiation Opportunities

### 7.1 Technical Differentiation

| Opportunity | Description | Priority |
|-------------|-------------|----------|
| **MCP Integration** | First blog platform with native MCP support | P0 |
| **Session-to-Article** | Transform coding sessions into articles automatically | P0 |
| **Dual-Layer Content** | Human + AI consumable formats | P0 |
| **Draft Bucket System** | Bridge between coding and blogging | P1 |

### 7.2 Visual Differentiation

| Opportunity | Description | Priority |
|-------------|-------------|----------|
| **Pinterest-Style Cards** | Premium visual presentation | P0 |
| **Dark-First Design** | Optimized for developer aesthetic | P1 |
| **Smooth Animations** | High-end interaction polish | P1 |

---

## 8. Technical Implementation Recommendations

### 8.1 From MCP Tools Analysis

Based on Claude Code MCP patterns:

```typescript
// Recommended MCP tool structure
const updateVibeCodingHistoryTool = {
  name: "update_vibe_coding_history",
  description: "Record coding session data for article generation",
  inputSchema: {
    type: "object",
    properties: {
      session_data: { type: "object" },
      metadata: { type: "object" }
    },
    required: ["session_data"]
  }
};
```

### 8.2 From Pinterest Visual Analysis

Recommended card implementation:

```css
/* Pinterest-inspired masonry grid */
.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  grid-auto-rows: 10px;
}

.article-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

---

## 9. Next Steps

### 9.1 Immediate Analysis Tasks

- [ ] Complete Claude Code MCP analysis (highest priority)
- [ ] Complete Pinterest visual analysis
- [ ] Complete Cursor integration analysis

### 9.2 Analysis Output Integration

- [ ] Update FRONTEND_GUIDELINES.md with visual patterns
- [ ] Update BACKEND_STRUCTURE.md with MCP patterns
- [ ] Update IMPLEMENTATION_PLAN.md with feature priorities

---

## 10. Analysis Templates

### 10.1 Product Analysis Template (Detailed)

```markdown
## [Product Name] - Comprehensive Analysis

**Analysis Date:** YYYY-MM-DD
**Analyst Model:** [glm-5 / kimi-k2.5]
**Product Category:** [Category]
**Assets Cached:** [screenshot paths in .comp_product_assets/]

---

### 1. Information Architecture (X/5)

**Score Breakdown:**
- Hierarchy Depth: [Score]
- Navigation Clarity: [Score]
- Classification Logic: [Score]
- Search & Discovery: [Score]
- URL Structure: [Score]

**Key Findings:**
1. [Finding with screenshot reference]
2. [Finding with screenshot reference]
3. [Finding with screenshot reference]

**Structure Diagram:**
```
[ASCII diagram of IA structure]
```

---

### 2. Visual Design System (X/5)

**Design Tokens:**
```css
/* Extracted design tokens */
--primary: #xxx;
--font-main: xxx;
--spacing-unit: xxx;
```

**Key Findings:**
1. [Color system findings]
2. [Typography findings]
3. [Component patterns]

**Screenshots:**
- `visual-design/[product]-card-*.png`
- `visual-design/[product]-typography-*.png`

---

### 3. Interaction Flow (X/5)

**Core Flow Diagram:**
```
[ASCII flow diagram]
[Start] --> [Step 1] --> [Step 2] --> [End]
```

**Key Findings:**
1. [Flow efficiency]
2. [Error handling patterns]
3. [Feedback mechanisms]

---

### 4. Feature Matrix (X/5)

| Feature Category | Features | Viblog Relevance |
|------------------|----------|------------------|
| Core | [List] | [Adopt/Adapt/Skip] |
| Integration | [List] | [Adopt/Adapt/Skip] |
| Customization | [List] | [Adopt/Adapt/Skip] |

**Key Findings:**
1. [Unique features]
2. [Missing features]
3. [Differentiation opportunities]

---

### 5. Technical Implementation (X/5)

**Inferred Tech Stack:**
- Frontend: [Framework]
- UI Library: [Library]
- State Management: [Tool]
- Backend: [Inferred from API]
- Deployment: [Platform]

**Performance Metrics:**
- Lighthouse Score: XX
- FCP: X.XXs
- LCP: X.XXs

**Key Findings:**
1. [Architecture patterns]
2. [Performance optimizations]
3. [Technical debt signals]

---

### Summary

| Dimension | Score | Key Takeaway |
|-----------|-------|--------------|
| IA | X/5 | [One sentence] |
| Visual | X/5 | [One sentence] |
| Flow | X/5 | [One sentence] |
| Features | X/5 | [One sentence] |
| Tech | X/5 | [One sentence] |
| **Total** | **XX/25** | |

---

### Applicable to Viblog

**Patterns to Adopt:**
- [ ] [Pattern 1 - with implementation notes]
- [ ] [Pattern 2 - with implementation notes]

**Patterns to Adapt:**
- [ ] [Pattern 1 - how to modify for Viblog]
- [ ] [Pattern 2 - how to modify for Viblog]

**Anti-patterns to Avoid:**
- [ ] [Anti-pattern 1 - why to avoid]
- [ ] [Anti-pattern 2 - why to avoid]

---

### Technical Translation

**For MCP Implementation:**
```typescript
// Code example from analysis
```

**For Visual Design:**
```css
/* CSS example from analysis */
```

**For Interaction Flow:**
```typescript
// Flow implementation example
```
```

---

### 10.2 Quick Analysis Template (For Lower Priority Products)

```markdown
## [Product Name] - Quick Analysis

**Analysis Date:** YYYY-MM-DD
**Priority:** [Low/Medium]

### Quick Scores
| Dimension | Score | Notes |
|-----------|-------|-------|
| IA | X/5 | [Brief note] |
| Visual | X/5 | [Brief note] |
| Flow | X/5 | [Brief note] |
| Features | X/5 | [Brief note] |
| Tech | X/5 | [Brief note] |

### Top 3 Takeaways
1. [Takeaway]
2. [Takeaway]
3. [Takeaway]

### One Thing to Borrow
[Single most valuable pattern/feature]
```

---

**Document Version:** 3.0
**Last Updated:** 2026-03-15
**Author:** Viblog Team
**Completion:** Phase 9 Competitive Analysis Complete (7 products analyzed)