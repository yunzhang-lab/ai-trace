# Discussions Directory Guidelines

> updated_at: 2026-06-27
> status: active
> readers: All Agents (Antigravity, Codex, Claude Code, etc.), Humans

本目录（`discussions/`）是多 Agent 与人类用户协作的唯一讨论留痕归口。  
当前要求很简单：**讨论要分类、要注册、要标状态、要能归档追溯。**

---

## 1. 文件夹职责

### 1.1 根目录

根目录只保留当前仍有效的规范入口文件（即本文件）。

### 1.2 `archive/`

`archive/` 用于存放：

- 已被新共识替代的历史提案
- 已完成阶段性使命、不再作为当前讨论入口的专题
- 仍需保留追溯价值的旧讨论

---

## 2. 讨论区索引与状态注册

| 文件 | 类型 | 位置 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| [README.md](/discussions/README.md) | 规范/索引 | `discussions/` | `active` | 讨论区规范与索引入口 |
| [coordination_summary.md](/discussions/archive/coordination_summary.md) | 共识总结 | `archive/` | `archived` | 早期流程优先与阶段边界共识，已被 README+ROADMAP 覆盖 |
| [goals_and_questions.md](/discussions/archive/goals_and_questions.md) | 问题归口 | `archive/` | `archived` | 用户历史问题与早期回应，结论已沉淀到 ROADMAP 和 specs |
| [topic_proposal_stage_confirmation.md](/discussions/archive/topic_proposal_stage_confirmation.md) | 专题提案 | `archive/` | `archived` | 阶段确认讨论稿，结论已被 ROADMAP 吸收 |
| [stage_confirmation_brief.md](/discussions/archive/stage_confirmation_brief.md) | 浓缩提案 | `archive/` | `archived` | 旧 5 阶段浓缩版，Phase 5 已取消 |
| [proposal_phases_specs_split.md](/discussions/archive/proposal_phases_specs_split.md) | 历史提案 | `archive/` | `archived` | 拆分 phases/specs 提案，已被 skill/ai-trace/specs 方案替代 |
| [phase-2-doc-spec-frontend-cleanup.md](/discussions/archive/phase-2-doc-spec-frontend-cleanup.md) | 执行记录 | `archive/` | `archived` | Phase 2 清理记录，引用的旧目录已不存在 |
| [topic_proposal_flow_first_staging.md](/discussions/archive/topic_proposal_flow_first_staging.md) | 历史提案 | `archive/` | `archived` | 已被新的阶段确认讨论稿替代 |

---

## 3. 创建与修改规则

### 3.1 创建新讨论时必须做的事

1. 在文件头部写元数据
2. 在本文件索引表中注册
3. 标明类型、位置、状态

### 3.2 修改已有讨论时必须做的事

1. 更新 `updated_at`
2. 如果讨论状态变了，同步更新索引表
3. 如果讨论已完成且被新共识替代，移入 `archive/`

### 3.3 禁止的事

- 直接删除历史讨论
- 直接抹去已形成的历史判断
- 不更新索引表就新建或移动讨论文件

---

## 4. 文档头部元数据

讨论区文档建议统一保留：

```markdown
> updated_at: YYYY-MM-DD
> status: [active | in-discussion | proposed | aligned | approved | archived]
> participants: [Agent names, Human]
> location: discussions/[path].md
```

---

## 5. 生命周期

```text
discussions/ 根目录
    ├── 当前有效规范入口（README.md）
    └── archive/  已归档的历史讨论与提案
```
