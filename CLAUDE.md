## Project Overview

**Viblog** - An AI-Native Blogging Platform for Vibe Coders.

**Mission:** Help Vibe Coders effortlessly capture, share, and grow from their AI-assisted development experiences.

**Core Values:**
- Record - Capture the authentic vibe coding context
- Share - Transform experiences into beautiful content
- Grow - Build a personal knowledge base

## Documentation

This project uses 9 core documents:

### 必读文档 (每会话必读)

| 文档 | 功能 | 阅读顺序 |
|------|------|----------|
| `DEVELOPLOG.md` | 项目历史、教训、坏案例 | **1 - 首先阅读** |
| `CHANGELOG.md` | 最新变更、当前版本状态 | **2 - 其次阅读** |
| `IMPLEMENTATION_PLAN.md` | 当前任务、下一步工作 | **3 - 第三阅读** |

### 按需阅读文档 (根据任务需要)

| 文档 | 功能 | 阅读时机 |
|------|------|----------|
| `PRD.md` | 产品定位、用户故事、功能范围 | 需要了解产品决策时 |
| `PRODUCT_COMP_ANALYSIS.md` | 竞品分析、差异化设计 | 需要竞品分析或差异化设计时 |

**🔴 CRITICAL: 竞品分析工作流 (MUST READ `PRODUCT_COMP_ANALYSIS.md` Section 0)**

当执行竞品分析时，**必须严格遵循 `PRODUCT_COMP_ANALYSIS.md` 中的 Section 0 工作流**：

**👉 推荐：使用 `competitive-analyzer` agent 自动执行完整工作流**

```
Step 1: Web Scraping (firecrawl, exa) → ⚠️ SAVE TO *.md BEFORE STEP 2
Step 2: Screenshots (Playwright)     → ⚠️ DEEP EXPLORE, THEN STOP & REPORT
Step 3: Visual Analysis              → ⚠️ USER CONFIRM, PARALLEL AGENTS
Step 4: Comprehensive Report         → glm-5 整合撰写
Step 5: Update Docs & Report         → IMPLEMENTATION_PLAN + CHANGELOG
```

**🔴 6条强制规则 (违反将导致工作流中断):**

| 规则 | 内容 | 违反后果 |
|------|------|----------|
| **RULE 1** | Step 1完成后必须立即保存到*.md文件 | 数据丢失需重新爬取 |
| **RULE 2** | Playwright必须深度探索所有层级，5-8+截图 | 分析不完整 |
| **RULE 3** | Step 2完成后必须停止，向用户汇报，等待确认 | 工作流中断 |
| **RULE 4** | 视觉理解必须用多个agent平行处理，每agent一张图 | 效率低下 |
| **RULE 5** | 所有视觉分析完成后，汇总撰写最终报告 | 信息不完整 |
| **RULE 6** | 完成报告后自行更新IMPLEMENTATION_PLAN和CHANGELOG | 进度追踪丢失 |

**⚠️ 绝对禁止:**
```
❌ glm-5 直接进行视觉分析 (TEXT-ONLY模型，会导致输入错误)
❌ Playwright只探索2层就结束 (必须深度探索所有典型页面)
❌ Step 1数据不保存直接进入Step 2 (回滚导致数据丢失)
❌ 视觉分析不等待用户确认 (破坏工作流)
```

**✅ 正确的视觉分析方法:**
```
使用 image-analyzer-kimi skill (kimi-k2.5模型)
使用 image-analyzer-qwen skill (qwen3.5-plus模型)
glm-5 只负责协调和报告撰写，绝不直接分析图片
```
| `TECH_STACK.md` | 技术选型、依赖版本 | 需要了解技术细节时 |
| `FRONTEND_GUIDELINES.md` | 视觉设计、组件规范 | 需要了解 UI 规范时 |
| `BACKEND_STRUCTURE.md` | 数据库结构、API 端点 | 需要了解后端实现时 |
| `APP_FLOW.md` | 页面结构、用户流程 | 需要了解用户流程时 |

### MVP 文档归档

MVP 阶段的文档已归档到 `mvp_docs/` 文件夹，供历史参考。

---

### Session Startup Checklist

**第一步：文档导航扫描 (每次会话必须)**

执行 `head -15 *.md` 快速扫描所有文档头部，建立文档导航：

```bash
head -15 DEVELOPLOG.md CHANGELOG.md IMPLEMENTATION_PLAN.md PRD.md PRODUCT_COMP_ANALYSIS.md TECH_STACK.md FRONTEND_GUIDELINES.md BACKEND_STRUCTURE.md APP_FLOW.md
```

**目的：**
1. 通过每个文档的"文档信息"部分，快速了解各文档功能
2. 根据当前任务，判断需要深入阅读哪些文档
3. 建立上下文导航，避免遗漏关键信息

**第二步：深入阅读 (根据任务需要)**

根据扫描结果和当前任务，选择深入阅读：

| 任务类型 | 推荐深入阅读 |
|----------|-------------|
| 了解项目状态 | `DEVELOPLOG.md` → `CHANGELOG.md` → `IMPLEMENTATION_PLAN.md` |
| 产品功能开发 | `PRD.md` + 任务相关技术文档 |
| 竞品分析 | `PRODUCT_COMP_ANALYSIS.md` → `PRD.md` |
| 前端开发 | `FRONTEND_GUIDELINES.md` → `APP_FLOW.md` |
| 后端开发 | `BACKEND_STRUCTURE.md` → `TECH_STACK.md` |
| 技术决策 | `TECH_STACK.md` + `BACKEND_STRUCTURE.md` |

**第三步：验证环境**
- [ ] Verify environment variables are set

---

### Document Responsibilities

| Document | Purpose | Update Timing | Content |
|----------|---------|---------------|---------|
| **IMPLEMENTATION_PLAN.md** | Implementation plan | When designing plans | Phase→Step tasks, technical details, dependencies, current status |
| **CHANGELOG.md** | Change log | After each Step completion | Added/Changed/Fixed/Deprecated (Keep a Changelog format) |
| **DEVELOPLOG.md** | Development log | After each Phase completion | What I Did/What Went Well/What Could Be Better/Bad Cases |
| **PRODUCT_COMP_ANALYSIS.md** | Competitive analysis | When analyzing competitors | Product analysis, differentiation opportunities |

### Update Priority

**When designing a plan:** Update `IMPLEMENTATION_PLAN.md` first

**When completing a Step:** Update `CHANGELOG.md`

**When completing a Phase:** Update `DEVELOPLOG.md`

**CRITICAL: Document Boundaries**
- NEVER mix Progress Tracking in CHANGELOG.md (belongs in IMPLEMENTATION_PLAN.md)
- NEVER mix Urgent Tasks in DEVELOPLOG.md (belongs in IMPLEMENTATION_PLAN.md)
- NEVER mix Session Logs in CHANGELOG.md (belongs in DEVELOPLOG.md)

## Critical Rules

### 1. Code Organization

- Many small files over few large files
- High cohesion, low coupling
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### 2. Code Style

- No emojis in code, comments, or documentation
- Immutability always - never mutate objects or arrays
- No console.log in production code
- Proper error handling with try/catch
- Input validation with Zod or similar

### 3. Testing

- TDD: Write tests first
- 80% minimum coverage
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows

### 4. Security

- No hardcoded secrets
- Environment variables for sensitive data
- Validate all user inputs
- Parameterized queries only
- CSRF protection enabled

## File Structure

```
src/
|-- app/              # Next.js app router
|-- components/       # Reusable UI components
|-- hooks/            # Custom React hooks
|-- lib/              # Utility libraries
|-- types/            # TypeScript definitions
```

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# Required
DATABASE_URL=
API_KEY=

# Optional
DEBUG=false
```

## Available Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Create implementation plan
- `/code-review` - Review code quality
- `/build-fix` - Fix build errors

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require review
- All tests must pass before merge

---

## Development Workflow Rules

### Agent & Skill Usage

**MUST proactively use appropriate agents and skills:**

| Scenario | Agent/Skill | Trigger |
|----------|-------------|---------|
| Complex feature planning | `planner` agent | Before implementation |
| Code quality check | `code-reviewer` agent | After writing code |
| TDD development | `tdd-guide` agent / `/tdd` | When writing features |
| Security analysis | `security-reviewer` agent | Before commits |
| Build errors | `build-error-resolver` agent | When build fails |
| E2E testing | `e2e-runner` agent | Critical user flows |
| Database operations | `database-reviewer` agent | SQL/migrations |
| Documentation | `doc-updater` agent | After changes |
| **Competitive analysis** | **`competitive-analyzer` agent** | **When analyzing competitor products** |
| **Step completion blog** | **`develop_reviewer` agent** | **After each Step is committed** |

---

### 🔴 CRITICAL: Mandatory Step Completion Blog (NEW)

**After completing ANY Step and committing to git, you MUST:**

1. **Invoke `develop_reviewer` agent** to help create a Viblog blog post
2. **Blog must contain two sections:**
   - **Engineering Development Record** - What was built, technical approach, challenges
   - **User Experience Testing** - Playwright testing of deployed features, screenshots, feedback
3. **Publish the blog on Viblog** before moving to the next Step

**Standard Workflow:**
```
Complete Step → Update CHANGELOG.md → Commit to Git →
Invoke develop_reviewer agent → Publish Blog to Viblog →
Update IMPLEMENTATION_PLAN.md → Proceed to Next Step
```

**Why This Matters:**
- Viblog is its own first user - dogfooding is essential
- Step-level documentation is more granular than Phase-level DEVELOPLOG.md
- Real-world UX testing catches issues early
- Creates content habit and demonstrates platform value

**Blog Post Format:**
```
Title: [Step X.Y] Feature Name - Development Log

Content:
- What I Built
- Technical Details
- Challenges & Solutions
- User Experience Testing (with screenshots)
- Recommendations
```

---

### 🔴 Competitive Analysis Workflow (CRITICAL - READ BEFORE EXECUTION)

**When performing competitive analysis, MUST use `competitive-analyzer` agent OR follow these rules:**

#### Model Capabilities (CRITICAL)

| Model | Vision? | CRITICAL NOTE |
|-------|---------|---------------|
| **glm-5** | ❌ **NO** | TEXT-ONLY - NEVER use for images |
| **kimi-k2.5** | ✅ YES | Use via `image-analyzer-kimi` skill |
| **qwen3.5-plus** | ✅ YES | Use via `image-analyzer-qwen` skill |

```
┌─────────────────────────────────────────────────────────────────┐
│   ⚠️ NEVER use glm-5 for visual analysis ⚠️                    │
│   glm-5 is TEXT-ONLY - will cause input errors and rollbacks   │
│   ✅ ALWAYS use image-analyzer-kimi or image-analyzer-qwen     │
└─────────────────────────────────────────────────────────────────┘
```

#### 6 MANDATORY RULES

| Rule | Requirement | Consequence of Violation |
|------|-------------|--------------------------|
| **RULE 1** | Save Step 1 data to *.md BEFORE Step 2 | Data loss on rollback |
| **RULE 2** | Playwright deep explore (5-8+ screenshots) | Incomplete analysis |
| **RULE 3** | STOP after Playwright, wait for user confirm | Broken workflow |
| **RULE 4** | Parallel agents + vision models only | Errors & rollback |
| **RULE 5** | Report only after ALL visual analysis | Incomplete report |
| **RULE 6** | Update IMPLEMENTATION_PLAN + CHANGELOG | Lost tracking |

**Full workflow:** See `PRODUCT_COMP_ANALYSIS.md` Section 0

---

### Context Management

**MUST manage context length proactively:**

1. **Read CHANGELOG.md** at the start of each session
2. **Update CHANGELOG.md** after completing tasks
3. **Use `/compact`** when context approaches limits
4. **Save session state** before major context switches

### Development Isolation

**Use isolation modes appropriately:**

| Mode | When to Use |
|------|-------------|
| `/sandbox` | Testing uncertain code, experiments |
| `git worktree` | Parallel feature development |
| `claude --worktrees` | Multiple independent features |

**Worktree workflow:**
```bash
# Create worktree for new feature
git worktree add .claude/worktrees/feature-name -b feature/feature-name

# Work in isolated environment
cd .claude/worktrees/feature-name

# After completion, merge and clean up
git worktree remove .claude/worktrees/feature-name
```

### Environment Setup

**Use appropriate package managers:**

| Dependency Type | Tool | Command |
|-----------------|------|---------|
| Node.js packages | `pnpm` | `pnpm add package-name` |
| Python packages | `uv` | `uv add package-name` |
| System packages | `brew` | `brew install package-name` |
| Containerization | `docker` | `docker compose up` |

**Global dependencies via Homebrew:**
```bash
# Node.js
brew install node@20

# pnpm
brew install pnpm

# Python/uv
brew install python
brew install uv
```

### CI/CD Configuration

**Docker-based CI/CD setup:**
```bash
# Build
docker compose build

# Test
docker compose run --rm app pnpm test

# Deploy preparation
docker compose -f docker-compose.prod.yml up --build
```

---

## Step & Phase Completion Workflow

### After Completing Each Step:

1. **Update CHANGELOG.md**
   - Add entry to appropriate section (Added/Changed/Fixed)
   - Describe the change briefly
   - Commit with message: `docs: update CHANGELOG for Step X.Y`

2. **Update IMPLEMENTATION_PLAN.md**
   - Mark Step status as "Completed"
   - Update any relevant notes

### After Completing Each Phase:

1. **Update DEVELOPLOG.md**
   - Add "What I Did" section
   - Add "What Went Well" section
   - Add "What Could Be Better" section
   - Document any new Bad Cases if mistakes occurred

2. **Update IMPLEMENTATION_PLAN.md**
   - Mark Phase as "Completed"
   - Update current phase indicator

3. **Create PR and Merge**
   - Push branch to remote
   - Create PR with summary
   - Merge to main when approved

---

## Model Context Window Limits

**CRITICAL: Prevent context overflow by monitoring token usage.**

### Context Window Specifications (from official docs)

| Model | Max Context (tokens) | Available (50%) | Warning (90% of Available) |
|-------|---------------------|-----------------|---------------------------|
| **glm-5** | 131,072 (128K) | 65,536 (64K) | 58,982 (~59K) |
| **glm-4.7** | 131,072 (128K) | 65,536 (64K) | 58,982 (~59K) |
| **glm-4.6** | 131,072 (128K) | 65,536 (64K) | 58,982 (~59K) |
| **glm-4.5** | 98,304 (96K) | 49,152 (48K) | 44,237 (~44K) |
| **MiniMax-M2.5** | 200,000 (200K) | 100,000 (100K) | 90,000 (90K) |
| **qwen3.5-plus** | 131,072 (128K) | 65,536 (64K) | 58,982 (~59K) |

**Sources:**
- GLM: https://docs.z.ai/guides/overview/concept-param
- MiniMax: https://platform.minimax.io/docs/coding-plan/best-practices
- Qwen: https://qwenlm.github.io/blog/qwen2.5-turbo/

### Context Management Rules

**Available Context = 50% of Max Context Window**

Why 50%? Because:
1. System prompts consume ~10-15K tokens
2. Extended thinking reserves up to 32K tokens
3. Output generation needs headroom
4. Safety margin prevents abrupt truncation

### Step-Level Context Check Protocol

**After completing EACH Step (not Phase):**

1. **Check current token usage** via `~/.claude.json`:
   - Look for `lastTotalInputTokens` and `lastTotalOutputTokens`
   - Calculate: `current_usage = inputTokens + outputTokens`

2. **Compare against thresholds:**
   - If `current_usage >= Warning Threshold` (90% of Available):
     - STOP and execute Context Overflow Protocol

3. **Context Overflow Protocol:**
   a. Update CHANGELOG.md immediately:
      - Mark current step status
      - List completed files
      - Note any pending work
      - Add session notes for next session
   b. Commit all changes with message: `docs: context overflow - update CHANGELOG`
   c. **Auto-compact:** Execute `/strategic-compact` to compress context
   d. **Repeat compact** if still approaching threshold after first compression
   e. **Notify user for /clear** only when:
      - Multiple compacts failed to reduce context below threshold
      - AND CHANGELOG.md + git status provide complete recovery information:
        - All completed steps documented
        - All pending work clearly listed
        - File changes committed or staged
        - Next step clearly identified

### Token Usage Detection Method

Check `~/.claude.json` at project path:
```json
{
  "projects": {
    "/Volumes/Workspace/StartUp/TiicBlog": {
      "lastTotalInputTokens": XXXXX,
      "lastTotalOutputTokens": XXXXX,
      "lastModelUsage": {
        "glm-5[1m]": {
          "inputTokens": XXXXX,
          "outputTokens": XXXXX
        }
      }
    }
  }
}
```

**Calculation:** `total_tokens = lastTotalInputTokens + lastTotalOutputTokens`

---

## Context Compaction Strategy

**Compact at Phase boundaries, NOT Step boundaries:**

| Timing | Action | Reason |
|--------|--------|--------|
| After Step | Check tokens, update CHANGELOG if near limit | Preserve context for related steps |
| After Phase | Strategic compact | Phases are independent units |

**Why compact after Phase completion:**
- Steps within a Phase are tightly coupled
- Compacting mid-Phase loses shared context
- Phase boundaries are natural stopping points
- CHANGELOG.md preserves all progress details

**Compact trigger:** When a Phase is marked complete in CHANGELOG.md OR when approaching context limit

---

## Session Checklist

### At the start of each session (文档导航):
- [ ] Execute `head -15 *.md` to scan all document headers
- [ ] Identify which documents to read in depth based on current task
- [ ] Verify environment variables are set

### During development (按需深入阅读):
- [ ] Reference `PRD.md` when making product decisions
- [ ] Reference `PRODUCT_COMP_ANALYSIS.md` for competitive insights
- [ ] Reference `FRONTEND_GUIDELINES.md` for UI patterns
- [ ] Reference `BACKEND_STRUCTURE.md` for API/database questions
- [ ] Reference `DEVELOPLOG.md` "Bad Cases" to avoid repeat mistakes
- [ ] Use appropriate agents/skills proactively
- [ ] Monitor context length (check tokens after each Step)

### After completing each Step:
- [ ] Update `CHANGELOG.md` with changes
- [ ] Update `IMPLEMENTATION_PLAN.md` step status
- [ ] Check token usage in `~/.claude.json`
- [ ] If approaching 90% of Available Context:
  - [ ] Commit changes: `docs: step X.Y complete`
  - [ ] Execute `/strategic-compact` to compress context

### After completing each Phase:
- [ ] Update `DEVELOPLOG.md` with lessons learned
- [ ] Update `IMPLEMENTATION_PLAN.md` phase status
- [ ] Commit changes with conventional commits
- [ ] Note any blockers for next session

### At the end of each session:
- [ ] Ensure all completed steps are documented
- [ ] Ensure `IMPLEMENTATION_PLAN.md` reflects current state
- [ ] Commit all pending changes

---

## Quick Reference: Token Thresholds

| Model | Stop & Update CHANGELOG at |
|-------|---------------------------|
| glm-5 | ~59,000 tokens |
| MiniMax-M2.5 | ~90,000 tokens |
| qwen3.5-plus | ~59,000 tokens |

**Current session model:** Check your model and use the corresponding threshold.
