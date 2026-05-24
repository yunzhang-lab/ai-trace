# 4. 信息流转、冲突、审计与 H5 操作闭环

> updated_at: 2026-05-24  
> status: discussion-draft

## 4.1 标准信息流

```text
Raw Input
  ↓
Extract Candidate
  ↓
Normalize Object
  ↓
Sanitize 脱敏
  ↓
Deduplicate 去重
  ↓
Conflict Check
  ↓
sync/queue
  ↓
H5 / 主控审核
  ↓
approved / rejected / private / conflict
  ↓
更新 Manifest / Registry / Audit
```

## 4.2 提炼对象

原始对话和工具日志可以提炼为：

- `preference_candidate`
- `lesson_candidate`
- `knowledge_candidate`
- `project_update`
- `decision_candidate`
- `conflict_candidate`
- `status_update`
- `handoff`
- `audit_event`

提炼后必须保留来源引用：

```yaml
source_type:
source_agent:
source_product:
source_session_id:
source_log_path:
source_message_ref:
extracted_at:
extractor:
```

## 4.3 脱敏检查

进入共享区前必须检查：

- Token。
- API Key。
- 密码。
- 私密路径。
- 全量原始对话。
- 未经提炼的思维链。
- 个人隐私。
- 平台运行配置。

命中敏感内容时：

- 默认 `blocked`。
- 只允许保留脱敏摘要。
- Audit 中记录触发了脱敏，但不记录敏感原文。

## 4.4 去重规则

候选对象进入 `sync/queue` 前必须去重。

去重参考：

- `type`
- `normalized_content_hash`
- `source_agent`
- `target`
- `tags`
- `semantic_key`

重复对象不直接丢弃，应标记：

```yaml
duplicate_of:
deduplicated_at:
```

## 4.5 冲突机制

冲突不直接覆盖，而是生成 Conflict 对象。

冲突类型：

| 类型 | 示例 |
| --- | --- |
| `direct_conflict` | 用户偏好前后矛盾 |
| `stale_conflict` | 旧信息过期 |
| `context_conflict` | 不同场景下规则不同 |
| `agent_conflict` | 不同 Agent 记录不一致 |
| `duplicate_conflict` | 重复沉淀 |
| `schema_conflict` | 字段结构不兼容 |
| `permission_conflict` | Agent 越权写入 |

冲突优先级：

1. 用户明确确认。
2. H5 / 主控 accepted 决策。
3. Approved 内容。
4. Manifest / Registry。
5. Agent 当前 Status。
6. Agent 私有记忆。
7. 原始日志。

## 4.6 Audit

所有关键操作都必须写 Audit。

Audit 解决：

- 谁改了。
- 什么时候改的。
- 为什么改。
- 改了什么。
- 能否回滚。

Audit 字段：

```yaml
audit_id: audit-20260524-001
actor: h5
action: approve
target_id: preference-codex-20260524-001
before_hash: xxx
after_hash: yyy
reason: 用户确认
created_at: 2026-05-24T10:30:00+08:00
reversible: true
```

Audit 存储：

```text
audit/YYYY-MM-DD.jsonl
```

## 4.7 版本与回滚

所有可变对象必须支持版本概念。

字段：

```yaml
content_version:
supersedes:
superseded_by:
deleted_at:
archived_at:
```

H5 的 `edit` 不直接覆盖旧对象，应生成新 revision。

H5 的 `delete` 默认软删除，进入 `archive/`。

H5 的 `rollback` 必须写 Audit，并恢复指定版本或生成新的恢复版本。

## 4.8 H5 操作闭环

H5 不是单纯展示层，而是事实变更入口。每个按钮必须对应明确的底层动作。

| H5 操作 | 底层结果 |
| --- | --- |
| `approve` | 移入 approved，更新 Manifest，写 Audit |
| `reject` | 移入 rejected，写 Audit |
| `private` | 移入 private，不进入共享真相源 |
| `conflict` | 移入 conflicts，生成冲突对象 |
| `edit` | 生成新 revision，写 Audit |
| `merge` | 合并对象，旧对象标记 superseded |
| `rollback` | 恢复指定版本，写 Audit |
| `delete` | 软删除，进入 archive |

## 4.9 H5 一级菜单

建议 H5 一级菜单：

- `Office`：办公空间，看 Agent 在干什么。
- `Wiki`：共享文档、项目、知识、决策。
- `Memory`：偏好、知识、教训筛选。
- `Sync`：同步审核队列。
- `Conflicts`：冲突处理。
- `Audit`：操作审计。
- `Skills`：共享动作手册。

## 4.10 H5 二级页面

`Office`：

- `Live Floor`
- `Agent Detail`
- `Handoff`

`Wiki`：

- `System`
- `Projects`
- `Knowledge`
- `Decisions`
- `Lessons`

`Memory`：

- `Preferences`
- `Knowledge Review`
- `Lessons`
- `Raw Links`

`Sync`：

- `Queue`
- `Approved`
- `Rejected`
- `Private`

`Conflicts`：

- `Open`
- `Reviewing`
- `Resolved`

`Audit`：

- `Timeline`
- `Object History`
- `Rollback`

`Skills`：

- `Shared Skill`
- `Install Notes`
- `Output Templates`

