# Agent Card Contract

> status: approved
> updated_at: 2026-06-27
> layer: contracts

`Agent Card` 是系统认定的最终身份实体，记录了 Agent 实例在本地的注册映射。

---

## 1. 数据契约 (JSON Schema)

详见独立文件：[card.schema.json](./card.schema.json)

字段定义、必填项、类型约束与枚举值均以 JSON Schema 为准，本文不重复维护字段字典，避免 MD 与 Schema 双写漂移。

---

## 2. 注册主键口径

`Agent Card` 当前不再以工具根目录作为注册主键，而是统一以 `selected_workspace_masked` 作为注册实例主键。

- **单实例产品**：`selected_workspace_masked` 与 `root_path_masked` 相同。
- **多实例产品**：`selected_workspace_masked` 指向具体实例路径。

因此：
- `root_path_masked`：表示来源工具根，例如 `~/.qwenpaw`
- `selected_workspace_masked`：表示真实被注册对象，例如 `~/.qwenpaw/workspaces/default`

---

## 3. 存储与流转契约

| 数据类型 | 路径 |
| --- | --- |
| 单个 Card（私有） | `~/.ai-trace/data/agents/<agent_id>.json` |
| 注册汇总列表（私有） | `~/.ai-trace/data/registry/registered_agents.json` |
| Mock 汇总列表（开源） | `skill/ai-trace/mock/data/registry/registered_agents.json` |

```bash
# 生成真实 Agent Card 的 CLI 契约
python3 skill/ai-trace/bin/main.py register --candidate-id candidate-claude --alias "My Claude"
```

---

## 4. 关联规范
- [candidate.md](./candidate.md)
