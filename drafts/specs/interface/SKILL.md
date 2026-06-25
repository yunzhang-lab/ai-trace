# 5. SKILL.md - Agent 动作手册

> updated_at: 2026-05-24  
> status: discussion-draft  
> purpose: 给 Agent 执行动作用，不写理念，只写步骤

## 1. 启动读什么

按顺序读取：

1. `~/ .ai-trace/docs/INDEX.md`
2. `~/ .ai-trace/docs/AI_TRACE_SYSTEM_V2.md`
3. `~/ .ai-trace/docs/CONTENT_MODEL_SPEC.md`
4. `~/ .ai-trace/docs/AGENT_SPEC.md`
5. `~/ .ai-trace/docs/INFORMATION_FLOW_SPEC.md`
6. 自己的 `agents/<agent_id>/CARD.md`
7. 自己的 `agents/<agent_id>/STATUS.json`
8. 当前项目 Manifest

## 2. 写入写哪里

| 内容 | 写入位置 |
| --- | --- |
| 项目进度候选 | `candidates/` 或 `sync/queue/` |
| 交接 | `handoff/` |
| 偏好候选 | `sync/queue/` |
| 教训候选 | `sync/queue/` |
| 知识候选 | `sync/queue/` |
| 冲突候选 | `conflicts/` |
| 状态 | `agents/<agent_id>/STATUS.json` |
| 审计 | `audit/YYYY-MM-DD.jsonl` 或 audit candidate |

普通 Agent 不直接写 approved。

## 3. 候选对象字段

```yaml
id:
type:
schema_version: 1.0
content_version: 1
status: queued
reliability:
source_type:
source_agent:
source_product:
source_log_path:
source_ref:
target:
policy: auto | review | private | blocked
risk: low | medium | high
contains_secrets: false
created_at:
summary:
```

## 4. 脱敏规则

写入共享区前检查：

- token。
- API Key。
- 密码。
- 私密路径。
- 原始完整对话。
- 未经提炼的思维链。
- 平台运行配置。

发现敏感信息时：

- 不写原文。
- 写脱敏摘要。
- 标记 `contains_secrets: true`。
- `policy` 设为 `blocked` 或 `review`。

## 5. 冲突处理规则

发现不一致时：

1. 不直接覆盖。
2. 生成 `conflict_candidate`。
3. 写入 `conflicts/` 或 `sync/queue/`。
4. 标明冲突类型。
5. 标明来源双方。
6. 等待 H5 / 主控裁决。

## 6. 退出交接规则

任务结束时输出：

```yaml
agent:
project:
task:
changed:
verified:
risks:
handoff:
sync_candidates:
conflicts:
source_logs:
status: done | blocked | review-needed
```

并更新：

```text
agents/<agent_id>/STATUS.json
```

## 7. 禁止事项

- 不同步完整原始对话。
- 不同步密钥、token、运行配置。
- 不把未验证猜测写成共享事实。
- 不让单个 Agent 私有记忆覆盖共享真相源。
- 不直接删除共享对象，只能软删除或生成删除请求。

