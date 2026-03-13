## Project Overview

**Viblog** - An AI-Native Blogging Platform for Vibe Coders.

**Mission:** Help Vibe Coders effortlessly capture, share, and grow from their AI-assisted development experiences.

**Core Values:**
- Record - Capture the authentic vibe coding context
- Share - Transform experiences into beautiful content
- Grow - Build a personal knowledge base

## Documentation

This project uses 7 core documents:
- `PRD.md` - Product Requirements Document
- `APP_FLOW.md` - Application Flow Document
- `TECH_STACK.md` - Technology Stack Document
- `FRONTEND_GUIDELINES.md` - Frontend Design Guidelines
- `BACKEND_STRUCTURE.md` - Backend Structure Document
- `IMPLEMENTATION_PLAN.md` - Implementation Plan
- `CHANGELOG.md` - Progress Tracking

**IMPORTANT:** Read `CHANGELOG.md` at the start of each session to understand current progress.

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

## Step Completion Workflow

**After completing each Step:**

1. **Update CHANGELOG.md**
   - Update the progress table
   - Add new features to "Added" section
   - Commit with message: `docs: update CHANGELOG for Step X.Y`

2. **Create PR**
   - Push branch to remote
   - Create PR with summary

3. **Merge to main** (when approved)
   - Merge PR
   - Push to main

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

**At the start of each session:**
- [ ] Read `CHANGELOG.md` for current progress
- [ ] Check `IMPLEMENTATION_PLAN.md` for next steps
- [ ] Verify environment variables are set

**During development:**
- [ ] Use appropriate agents/skills proactively
- [ ] Update `CHANGELOG.md` after milestones
- [ ] Monitor context length (check tokens after each Step)

**After completing each Step:**
- [ ] Check token usage in `~/.claude.json`
- [ ] If approaching 90% of Available Context:
  - [ ] Update CHANGELOG.md with current progress
  - [ ] Commit changes: `docs: context overflow - update CHANGELOG`
  - [ ] Execute `/strategic-compact` to compress context
  - [ ] Repeat compact if still above threshold
  - [ ] Only notify user for `/clear` when:
    - Multiple compacts failed, AND
    - CHANGELOG.md + git status enable full recovery

**At the end of each session:**
- [ ] Update `CHANGELOG.md` with progress
- [ ] Commit changes with conventional commits
- [ ] Note any blockers for next session

---

## Quick Reference: Token Thresholds

| Model | Stop & Update CHANGELOG at |
|-------|---------------------------|
| glm-5 | ~59,000 tokens |
| MiniMax-M2.5 | ~90,000 tokens |
| qwen3.5-plus | ~59,000 tokens |

**Current session model:** Check your model and use the corresponding threshold.
