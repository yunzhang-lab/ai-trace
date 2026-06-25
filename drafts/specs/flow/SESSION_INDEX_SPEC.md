# Session Index SPEC

> updated_at: 2026-06-18  
> status: working-draft  
> phase: Phase 3  
> scope: `Index -> Mark`

## 1. 目的

`Session Index` 用于给已授权 Agent 生成最小会话目录索引。  
当前阶段仅追求“可列出、可定位、可标记”，不承担全文提炼。

## 2. 最小原则

- 仅为已授权 Agent 建立索引
- 仅提取最小元数据
- 不做复杂语义总结
- 不默认提炼全文

## 3. 字段定义

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `agent_id` | string | 是 | 所属 Agent ID。 |
| `session_id` | string | 是 | 会话稳定 ID。 |
| `thread_name` | string | 否 | 会话标题或线程名。 |
| `updated_at` | datetime | 是 | 最近更新时间。 |
| `cwd` | string | 否 | 执行工作区真实路径。 |
| `cwd_masked` | string | 否 | 脱敏后的展示路径。 |
| `folder_path` | string | 否 | 会话所属物理目录。 |
| `folder_path_masked` | string | 否 | 脱敏后的目录路径。 |
| `rollout_file` | string | 否 | 原始日志文件名。 |
| `message_count` | integer | 否 | 估算的消息轮数。 |
| `bookmark_state` | enum | 是 | `unmarked` / `bookmarked` / `queued` / `extracted`。 |
| `bookmark_tags` | string[] | 是 | 显式标记标签列表。 |
| `source_scope` | string | 是 | 一般为 `private workspace`。 |

## 4. 当前前端需要的字段

Phase 3 的 H5 会话只读页当前至少依赖：

- `session_id`
- `thread_name`
- `updated_at`
- `cwd_masked`
- `folder_path_masked`
- `bookmark_state`
- `bookmark_tags`
- `message_count`

## 5. 当前不包含的内容

当前阶段不强制进入：

- 完整消息正文缓存
- 会话摘要
- 项目归属推断
- 跨会话合并关系
- 候选对象统计
