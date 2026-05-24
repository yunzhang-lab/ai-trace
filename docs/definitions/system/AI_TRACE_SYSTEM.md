# 1. 系统目标与总架构

> updated_at: 2026-05-24  
> status: discussion-draft

## 1.1 系统目标

本系统用于解决多 Agent 协作中的信息不一致问题，包括：

- 同一 Agent 不同对话的信息冲突。
- 同一对话不同时间的信息变化。
- 不同 Agent 之间的认知差异。
- H5 人工操作后的状态不一致。
- 私有记忆、共享知识、项目进度和审计记录之间的来源不清。

核心目标：

- 可持续：长期可维护，不依赖单次长对话。
- 可溯源：每个共享对象都能回到来源。
- 可审计：关键操作知道谁、何时、为何、改了什么。
- 可进化：偏好、知识、教训可升级、废弃、合并、回滚。

## 1.2 三层架构

```text
Agent 私有区
  ↓
提炼与同步区 ~/.ai-trace
  ↓
视图与操作层 Obsidian / H5
```

### Agent 私有区

保存各产品自己的原生数据。

包括：

- 原始对话。
- 临时缓存。
- 运行配置。
- 工具结果。
- 私有记忆。
- 私有偏好、教训、身份文件。

示例：

- `/Users/fengye/.qwenpaw/workspaces/default`
- `/Users/fengye/.codex`
- `/Users/fengye/.claude`

### 提炼与同步区

路径：`/Users/fengye/.ai-trace`

只保存经过提炼、脱敏、结构化后的对象。

包括：

- Manifest。
- Registry。
- Candidate。
- Approved 内容。
- Conflict。
- Audit。
- Handoff。
- Status。

### 视图与操作层

Obsidian 和 H5 读取同一份 `.ai-trace` 文件。

- Obsidian：Wiki 阅读、链接、人工编辑。
- H5：办公空间、筛选、审核、冲突处理、操作闭环。

## 1.3 共享真相源

共享真相源以 `~/.ai-trace` 为核心，由以下内容共同组成：

- Manifest：项目、对象集合或系统级索引。
- Registry：Agent、项目、对象注册信息。
- Approved 内容：经过审核或授权写入的共享对象。
- Audit 日志：关键操作记录。

局部 Agent 记忆可以存在，但必须让位于共享区中的全局真相。

## 1.4 不直接进入共享区的内容

原则上不直接进入共享区：

- Agent 原始对话。
- 临时缓存。
- 未经提炼的思维链。
- token、API Key、密码。
- 私密路径。
- 全量工具输出。
- 未脱敏数据。
- 未确认猜测。

这些内容可以作为来源引用，但不复制为共享事实。

## 1.5 总体工作流

```text
Raw Input
  ↓
Extract Candidate
  ↓
Normalize Object
  ↓
Sanitize
  ↓
Deduplicate
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

## 1.6 系统本质

这套系统不是单纯“存记忆”，而是建立多 Agent 可持续协作的信息治理机制。

它通过内容结构化、权限分层、审计留痕、冲突裁决和 H5 闭环操作，让不同 Agent 在长期工作中逐步对齐到同一套可追溯、可演化的共享事实源。

