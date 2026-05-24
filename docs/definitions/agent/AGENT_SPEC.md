# 3. Agent 注册、权限与生命周期

> updated_at: 2026-05-24  
> status: discussion-draft

## 3.1 基本原则

每个 Agent 都必须注册，形成明确身份、职责和权限边界。

普通 Agent 不直接修改全局真相源。除非拥有主控权限，否则只能写入候选区、交接区或同步队列。

## 3.2 基础目录

```text
.ai-trace/agents/{agent_id}/
  CARD.md
  STATUS.json
  SYNC_POLICY.md
```

全局注册：

```text
.ai-trace/registry/
.ai-trace/registry.json
```

## 3.3 Agent 类型与权限

| 类型 | 代表 | 权限 |
| --- | --- | --- |
| 主控型 | QwenPaw / 江玉 | 可读写、审核、裁决、回滚 |
| 执行型 | Codex | 可写 candidate / handoff，不可直接写 approved |
| 分析型 | Claude Code | 可提炼建议，不可裁决 |
| 临时工具型 | ETL / 专项工具 | 只读最小上下文，原则上不可写共享区 |

## 3.4 Agent Card

`CARD.md` 用于让其他 Agent 和 H5 理解此 Agent。

最小字段：

```yaml
id:
name:
type:
permission:
private_root:
native_entry:
shared_scope:
write_policy:
status_file:
updated_at:
```

正文包含：

- 职责。
- 能力。
- 禁止事项。
- 启动读取顺序。
- 退出产出要求。

## 3.5 Agent Status

`STATUS.json` 表示当前状态，不承担长期记忆。

字段：

```json
{
  "agent_id": "codex",
  "state": "idle",
  "current_project": "ai-trace",
  "current_task": "",
  "last_seen_at": "2026-05-24T10:00:00+08:00",
  "last_output": "",
  "pending_sync": 0,
  "blocked_by": []
}
```

状态枚举：

- `idle`
- `working`
- `blocked`
- `handoff-needed`
- `review-needed`
- `offline`

## 3.6 Agent 启动流程

Agent 启动时必须执行：

1. 读取系统 Manifest 或 `docs/INDEX.md`。
2. 读取自己的 `STATUS.json`。
3. 检查 `conflicts/`。
4. 检查 `handoff/`。
5. 确认当前任务上下文。
6. 读取任务相关项目 Manifest。
7. 读取 `SKILL.md` 中的动作规则。

## 3.7 Agent 退出流程

Agent 退出或任务结束时必须执行：

1. 更新 `STATUS.json`。
2. 写 handoff 摘要。
3. 输出 candidate 对象。
4. 记录 audit 或 audit candidate。
5. 标记 `blocked` / `done` / `review-needed`。

结束摘要必须包含：

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
```

## 3.8 原生入口

### QwenPaw

入口：

- `MEMORY.md`
- `AGENTS.md`

职责：

- 完整长期记忆。
- 主控审核。
- 私有教训提炼。
- 共享真相源维护。

### Codex

入口：

- 项目或工作区 `AGENTS.md`

职责：

- 实现、验证、交付。
- 输出候选对象和 handoff。
- 不直接写 approved。

### Claude Code

入口：

- 用户级或项目级 `CLAUDE.md`

职责：

- 文档分析。
- 方案整理。
- 候选知识、候选决策、候选教训。

