# 2. 内容模型与分类

> updated_at: 2026-05-24  
> status: discussion-draft

## 2.1 基本原则

共享内容不直接保存原始对话，而是沉淀为结构化对象。

对象必须回答：

- 它是什么类型。
- 谁产生的。
- 来源在哪里。
- 是否可靠。
- 是否脱敏。
- 当前状态是什么。
- 是否可进入共享真相源。

## 2.2 九类对象

| 类型 | 说明 | 默认归属 |
| --- | --- | --- |
| `Identity` | 用户、Agent、项目身份 | 私有为主，公有存卡片 |
| `Preference` | 用户偏好、输出偏好、工具偏好 | 私有 + 公有 |
| `Lesson` | 经验教训、踩坑总结 | 私有 + 公有 |
| `Project` | 项目信息、目录、状态、规范 | 公有 |
| `Knowledge` | 可复用知识、方法论、规则 | 公有为主 |
| `Decision` | 已确认决策 | 公有 |
| `Conflict` | 待裁决冲突 | 公有 |
| `Audit` | 操作审计记录 | 公有 |
| `Status` | Agent / Project 当前状态 | 公有快照 |

## 2.3 对象基础字段

所有对象至少包含：

```yaml
id: preference-codex-20260524-001
type: preference
schema_version: 1.0
content_version: 1
status: queued
reliability: medium
source_type: conversation
source_agent: codex
source_path:
source_ref:
created_at: 2026-05-24T10:00:00+08:00
updated_at:
expired_at:
tags: []
contains_secrets: false
```

建议状态：

- `draft`
- `candidate`
- `queued`
- `approved`
- `rejected`
- `private`
- `conflict`
- `superseded`
- `archived`
- `deleted`

建议可靠性：

- `low`
- `medium`
- `high`
- `confirmed`

## 2.4 存储格式

| 内容 | 格式 |
| --- | --- |
| 纯数据类 | `.json` |
| 文本沉淀类 | Markdown + YAML Frontmatter |
| 审计类 | `.jsonl` 或 `.json` |
| 状态快照 | `.json` |
| 事件流 | `.jsonl` |

文件命名必须带时间戳或 hash，避免多 Agent 并发写入覆盖。

示例：

```text
preference-codex-20260524-001.md
audit-20260524-103000-a8f3.json
event-20260524.jsonl
```

## 2.5 公私边界

### Identity

完整身份、人格、`SOUL` 类文件默认私有。

公有层只保存：

- Agent Card。
- Agent 能力。
- Agent 权限。
- Agent 当前状态。
- Agent 私有目录指针。

### Preference

偏好通常有私有和公有两层。

- 私有偏好：某个 Agent 观察到的局部偏好。
- 公有偏好：经审核后所有 Agent 应遵守的稳定偏好。

偏好必须筛选：

- `scope`
- `domain`
- `status`
- `reliability`
- `source_agent`
- `reviewer`

### Lesson

教训分三层：

- 私有教训。
- 候选教训。
- 公有验证教训。

私有教训如果已整合，必须备注：

```yaml
sync_status: merged_to_shared
candidate_id:
shared_id:
integrated_at:
integrated_to:
reviewer:
```

### Project

项目默认公有。

共享区不一定保存实体文件，但必须保存：

- 项目索引。
- 真实路径。
- 当前状态。
- 负责人。
- 参与 Agent。
- 决策。
- 交接。

### Knowledge

知识默认公有为主，但需要筛选。

筛选字段：

- `domain`
- `type`
- `status`
- `reliability`
- `source`
- `last_reviewed_at`

### Audit

Audit 是系统级对象，不应私有化。

所有关键操作都必须写 Audit。

## 2.6 Approved 内容

`approved` 代表已进入共享真相源，但不一定必须集中存到一个目录。

两种可选方案：

- 集中式：`sync/approved/` 保存所有已批准对象。
- 分类型：批准后进入 `projects/`、`knowledge/`、`lessons/`、`decisions/` 等目标目录。

建议 v1 使用分类型，`sync/approved/` 只保留审核记录或链接。

