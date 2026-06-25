# Agent Candidate / Agent Card SPEC

> updated_at: 2026-06-18  
> status: working-draft  
> phase: Phase 2  
> scope: `Scan -> Register`

## 1. 目的

`Agent Card` 用于描述一个已经被用户确认接入的本地 Agent 实体。  
它是扫描候选 `agent_candidates.json` 进入注册阶段后的首个稳定对象。

当前阶段只定义**最小可注册字段**，不预设完整能力画像。

## 2. 生命周期

```text
scan candidate -> register form -> agent card draft -> registered agent card
```

## 3. Agent Candidate 字段

`Agent Candidate` 是 `scan` 的输出对象，存放在：

- `~/.ai-trace/data/registry/agent_candidates.json`
- `mock/data/registry/agent_candidates.json`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `candidate_id` | string | 是 | 扫描候选 ID，例如 `candidate-codex`。 |
| `agent_id` | string | 是 | 系统稳定 ID，例如 `codex`、`claude`。 |
| `product` | string | 是 | 产品名，如 `Codex`、`Claude Code`。 |
| `suggested_alias` | string | 是 | 系统建议显示别名，注册时可改为 `alias`。 |
| `root_path` | string | 是 | 私有真实根路径；公开 Mock 可使用相对样例路径。 |
| `root_path_masked` | string | 是 | 脱敏展示路径。 |
| `status` | enum | 是 | 固定为 `candidate`。 |
| `workspace_mode` | enum | 是 | `single-space` / `multi-space` / `unknown`。 |
| `session_source_type` | enum | 是 | `session_index` / `session_dir` / `workspace_dir` / `unknown`。 |
| `session_count` | number | 是 | 扫描阶段发现的会话数量。 |
| `workspace_count` | number | 是 | 扫描阶段发现的工作区数量。 |
| `session_index_path` | string/null | 否 | 私有索引文件路径或候选会话源路径。 |
| `detected_markers` | string[] | 是 | 扫描时发现的结构标记。 |
| `sample_workspaces` | string[] | 是 | 私有真实工作区路径样例。 |
| `sample_workspaces_masked` | string[] | 是 | 脱敏工作区路径样例。 |
| `selected_workspace` | string/null | 否 | 默认选中的真实工作区。 |
| `notes` | string | 否 | 扫描或注册前备注。 |

## 4. Agent Card 字段

`Agent Card` 是 `register` 的输出对象，存放在：

- `~/.ai-trace/data/agents/<agent_id>.json`

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `agent_id` | string | 是 | 系统稳定 ID，例如 `codex`、`claude`。 |
| `candidate_id` | string | 是 | 扫描候选 ID，用于追溯注册来源。 |
| `product` | string | 是 | 产品名，如 `Codex`、`Claude Code`。 |
| `alias` | string | 是 | 用户确认的显示别名，可在 H5 中调整。 |
| `workspace_mode` | enum | 是 | `single-space` / `multi-space` / `unknown`。 |
| `selected_workspace` | string | 否 | 用户在注册时指定的默认工作区。 |
| `selected_workspace_masked` | string | 否 | 默认工作区的脱敏展示路径。 |
| `root_path_private` | string | 是 | 私有真实根路径，仅私有区保存。 |
| `root_path_masked` | string | 是 | 脱敏展示路径，供 H5 与公开讨论使用。 |
| `session_source_type` | enum | 是 | `session_index` / `session_dir` / `workspace_dir` / `unknown`。 |
| `session_index_path` | string/null | 否 | 私有索引文件路径。 |
| `session_count` | number | 是 | 注册时继承的会话数量。 |
| `workspace_count` | number | 是 | 注册时继承的工作区数量。 |
| `notes` | string | 否 | 用户在注册弹窗中补充的备注。 |
| `status` | enum | 是 | `registered` / `disabled`。 |
| `detected_markers` | string[] | 是 | 扫描时发现的结构标记。 |
| `created_at` | datetime | 是 | 注册记录创建时间。 |
| `updated_at` | datetime | 是 | 最近更新时间。 |

## 5. 前端核心字段

Agents 界面当前必须可直接使用以下字段：

- `product`
- `alias`
- `workspace_mode`
- `selected_workspace`
- `root_path_masked`
- `notes`
- `status`
- `detected_markers`

## 6. 注册流程口径

Phase 2 的注册流程分为两层：

- H5：展示候选、填写别名/工作区/备注、生成注册预览与队列事件。
- CLI：执行真实写盘，生成 `Agent Card` 与 `registered_agents.json`。

本地 API 写入留到 Phase 3，不进入 Phase 2 验收。

## 7. 当前不包含的内容

以下内容当前阶段不进入 `Agent Card`：

- 长期偏好
- 能力评分
- 复杂角色画像
- 统一 Skills 绑定
- 审计外链

这些内容待后续阶段稳定后再补充。
