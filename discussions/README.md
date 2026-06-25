# Discussions Directory Guidelines

> updated_at: 2026-06-21
> status: active
> readers: All Agents (Antigravity, Codex, Claude Code, etc.), Humans

本目录（`discussions/`）是多 Agent 与人类用户协作的唯一讨论留痕归口。  
当前要求很简单：**讨论要分类、要注册、要标状态、要能归档追溯。**

---

## 1. 文件夹职责

当前讨论区采用“根目录 + 归档目录”的最小结构：

### 1.1 根目录

根目录保留以下内容：

- 当前仍在使用的讨论规范
- 当前仍有效的共识总结
- 当前仍活跃的问题归口
- 正在推进中的专题提案

### 1.2 `archive/`

`archive/` 用于存放：

- 已被新共识替代的历史提案
- 已完成阶段性使命、不再作为当前讨论入口的专题
- 仍需保留追溯价值的旧讨论

一句话规则：

> 不同文件夹代表不同讨论状态与用途。  
> 当前有效的放根目录；历史归档的放 `archive/`。

---

## 2. 讨论区索引与状态注册

本文件同时作为讨论区索引。  
任何讨论文档新建、状态变化、归档，都必须在下表更新。

| 文件 | 类型 | 位置 | 状态 | 是否完成本轮讨论 | 说明 |
| --- | --- | --- | --- | --- | --- |
| [README.md](/discussions/README.md) | 规范/索引 | `discussions/` | `active` | 是 | 讨论区规范与索引入口 |
| [coordination_summary.md](/discussions/coordination_summary.md) | 共识总结 | `discussions/` | `approved` | 是 | 当前流程优先与阶段边界的归口总结 |
| [goals_and_questions.md](/discussions/goals_and_questions.md) | 问题归口 | `discussions/` | `aligned` | 否 | 保留用户历史问题与早期回应，不视为已结束议题 |
| [topic_proposal_stage_confirmation.md](/discussions/topic_proposal_stage_confirmation.md) | 专题提案 | `discussions/` | `approved` | 是 | 用于重新确认阶段本身、DoD 与阶段解锁边界 |
| [stage_confirmation_brief.md](/discussions/stage_confirmation_brief.md) | 浓缩提案 | `discussions/` | `approved` | 是 | 当前建议版 5 阶段的浓缩确认稿，已由用户最终拍板 |
| [archive/topic_proposal_flow_first_staging.md](/discussions/archive/topic_proposal_flow_first_staging.md) | 历史提案 | `discussions/archive/` | `archived` | 是 | 已被新的阶段确认讨论稿替代，保留追溯用途 |

### 状态说明

- `active`：当前正在执行的规范或入口文档
- `in-discussion`：仍在讨论中的议题
- `proposed`：已提出但尚未最终拍板
- `aligned`：主要方向已对齐，但仍保留追溯或补充空间
- `approved`：已形成当前正式共识
- `archived`：已被新共识替代，转入归档区

### 完成判定

`是否完成本轮讨论` 只回答一个问题：

- 这个文件是否已经完成它当前这一轮的讨论使命？

不是问“整个主题未来还会不会再变化”。  
如果旧提案已经完成历史使命，即使主题未来还会继续演进，也应标记为完成并视情况归档。

---

## 3. 创建与修改规则

### 3.1 创建新讨论时必须做的事

1. 在文件头部写元数据
2. 在本文件索引表中注册
3. 标明类型、位置、状态、是否完成本轮讨论

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
    ├── 当前有效共识与进行中提案
    ├── 达成阶段结论后，相关 SPEC 进入 drafts/specs/
    └── 被新共识替代后，历史讨论移入 discussions/archive/
```

通过这套规则，讨论区不再只是“放文件的地方”，而是：

- 有分类
- 有索引
- 有完成状态
- 有归档路径
