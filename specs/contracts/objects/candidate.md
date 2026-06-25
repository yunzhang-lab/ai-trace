# Agent Candidate Contract

> status: approved
> updated_at: 2026-06-24
> layer: contracts

`Agent Candidate` 是扫描脚本输出的候选对象，代表在本地已检测到某 Agent 物理存在，但尚未由用户确认注册。

---

## 1. 数据契约 (JSON Schema)

详见独立文件：[candidate.schema.json](./candidate.schema.json)

字段定义、必填项、类型约束与枚举值均以 JSON Schema 为准，本文不重复维护字段字典，避免 MD 与 Schema 双写漂移。

---

## 2. 存储与流转契约

| 数据类型 | 路径 |
| --- | --- |
| 真实数据落点（私有写盘） | `~/.ai-trace/data/registry/agent_candidates.json` |
| Mock 数据映射（开源展示） | `mock/data/registry/agent_candidates.json` |

```bash
# 生成真实候选数据的 CLI 契约
python3 apps/cli/main.py scan

# 生成 Mock 候选数据的 CLI 契约
python3 apps/cli/main.py scan --mock
```

---

## 3. 关联规范
- [card.md](./card.md)
- [dashboard.md](../../surfaces/dashboard.md)
