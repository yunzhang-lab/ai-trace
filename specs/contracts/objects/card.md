# Agent Card Contract

> status: approved
> updated_at: 2026-06-24
> layer: contracts

`Agent Card` 是系统认定的最终身份实体，记录了 Agent 在本地的物理映射。

---

## 1. 数据契约 (JSON Schema)

详见独立文件：[card.schema.json](./card.schema.json)

字段定义、必填项、类型约束与枚举值均以 JSON Schema 为准，本文不重复维护字段字典，避免 MD 与 Schema 双写漂移。

---

## 2. 存储与流转契约

| 数据类型 | 路径 |
| --- | --- |
| 单个 Card（私有） | `~/.ai-trace/data/agents/<agent_id>.json` |
| 注册汇总列表（私有） | `~/.ai-trace/data/registry/registered_agents.json` |
| Mock 汇总列表（开源） | `mock/data/registry/registered_agents.json` |

```bash
# 生成真实 Agent Card 的 CLI 契约
python3 apps/cli/main.py register --candidate-id candidate-claude --alias "My Claude"
```

---

## 3. 关联规范
- [candidate.md](./candidate.md)
