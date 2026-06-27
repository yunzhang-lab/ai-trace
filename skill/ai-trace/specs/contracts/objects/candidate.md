# Agent Candidate Contract

> status: approved
> updated_at: 2026-06-27
> layer: contracts

`Agent Candidate` 是扫描脚本输出的候选对象，代表在本地已检测到某 Agent 实例，但尚未由用户确认注册。

---

## 1. 数据契约 (JSON Schema)

详见独立文件：[candidate.schema.json](./candidate.schema.json)

字段定义、必填项、类型约束与枚举值均以 JSON Schema 为准，本文不重复维护字段字典，避免 MD 与 Schema 双写漂移。

---

## 2. 注册单元口径

Phase 2 当前统一采用“**workspace 实例**”作为注册与比对单元。

- **主键字段**：`selected_workspace_masked`
- **单实例产品**：`selected_workspace_masked = root_path_masked`
  - 例如 `Claude Code -> ~/.claude`
  - 例如 `Codex -> ~/.codex`
- **多实例产品**：`selected_workspace_masked = 具体 workspace 路径`
  - 例如 `QwenPaw / default -> ~/.qwenpaw/workspaces/default`

字段语义：
- `agent_root`：当前被展示与管理的实例名，用于界面展示。
- `root_path_masked`：工具根目录，用于说明该实例来自哪个产品根。
- `selected_workspace_masked`：真实注册对象，也是已注册/未注册比对主键。

---

## 3. 存储与流转契约

| 数据类型 | 路径 |
| --- | --- |
| 真实数据落点（私有写盘） | `~/.ai-trace/data/registry/agent_candidates.json` |
| Mock 数据映射（开源展示） | `skill/ai-trace/mock/data/registry/agent_candidates.json` |

```bash
# 生成真实候选数据的 CLI 契约
python3 skill/ai-trace/bin/main.py scan

# 生成 Mock 候选数据的 CLI 契约
python3 skill/ai-trace/bin/main.py scan --mock
```

---

## 4. 关联规范
- [card.md](./card.md)
- [dashboard.md](../../surfaces/dashboard.md)
