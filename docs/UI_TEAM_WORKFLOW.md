# UI TEAM 工作流程

**文档版本**: 1.0
**更新日期**: 2026-03-17

---

## 角色定义

### UI TEAM LEADER

**职责**: Viblog UI/UX 设计与实现的完全负责人

**工作空间**: `.claude/worktrees/frontend/`

**分支**: `feature/phase10-frontend`

---

## 团队成员

| Agent | 角色 | 用途 |
|-------|------|------|
| chief-ui-officer | 主要协调Agent | 设计质量把关、评审协调 |
| ui-concept-generator | 概念生成 | 生成 UI 设计概念 |
| ui-prompt-builder | 提示构建 | 构建设计实现提示 |
| design-reviewer | 设计评审 | 发布设计博客 |

---

## 工作原则

```
Think First → Plan Second → Implement Last
```

---

## 工作流程

### Step 完成流程

```
1. THINK
   ├── 分析需求
   ├── 理解 Effortel 设计模式
   └── 确认设计方向

2. PLAN
   ├── 制定 UI/UX 实现方案
   ├── 识别需要修改的文件
   └── 确认 CSS 值和组件结构

3. IMPLEMENT
   ├── 执行代码修改
   ├── 本地测试验证
   └── 确保视觉效果

4. REVIEW
   ├── 更新 CHANGELOG.md
   ├── Git commit
   └── 调用 design-reviewer 发布设计博客

5. UPDATE
   └── 更新相关文档
```

---

## Ground Truth

| 项目 | 内容 |
|------|------|
| **原型方案** | Code Gallery |
| **设计参考** | Effortel (22/25 score) |
| **竞品分析** | `.competitive-analysis/effortel-ui-ux-analysis.md` |
| **开发计划** | `docs/VIBLOG_CODE_GALLERY_UI_DEV_PLAN.md` |

---

## 当前状态

### Phase 1: Design Token Refinement ✅

- Border radius scale: 4px/8px/12px/16px
- Hero/Display line heights: 1.1/1.15
- Tag/Badge system tokens

### Phase 2: Card Component Polish ⏳

- 迁移 `rounded-2xl` → `rounded-xl`
- 添加 hover overlay 效果
- 16:10 aspect ratio 图片容器
- Outlined tag 组件

---

## 注意事项

1. **不调用 develop-reviewer** - 那是后端团队的事
2. **只调用 design-reviewer** - 发布设计博客
3. **chief-ui-officer 是主要协调者** - 重大设计决策需咨询
4. **Effortel 是参考不是复制** - 学习原则，保持独特性

---

**Mission**: 深度借鉴 Effortel 设计美学，打造独特的 Code Gallery 体验