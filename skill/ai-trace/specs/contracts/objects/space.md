# Space Contract

> status: approved
> updated_at: 2026-06-27
> layer: contracts/objects

`Space` 是 Phase 2 已落地的空间声明对象，对应 `Spaces` 一级菜单中的真实管理实体。

---

## 1. 数据契约 (JSON Schema)

详见独立文件：[space.schema.json](./space.schema.json)

字段定义、必填项、类型约束与枚举值均以 JSON Schema 为准，本文不重复维护字段字典。

---

## 2. 对象语义

`Space` 与 `workspace_candidate` 不同：

- `workspace_candidate`：浅层候选上下文，偏向扫描发现。
- `space`：已经进入 `Spaces` 管理面的真实声明对象。

Phase 2 当前只要求：
- 识别本机一级空间。
- 允许填写用途与可见性。
- 记录与 Agent 的浅层归属关系。

不要求：
- 深层目录树建模。
- 文件级治理。
- 会话或索引闭环。

---

## 3. 存储与流转契约

| 数据类型 | 路径 |
| --- | --- |
| 真实数据列表（私有） | `~/.ai-trace/data/registry/spaces.json` |
| Mock 汇总列表（开源） | `skill/ai-trace/mock/data/registry/spaces.json` |

该对象由 `python3 skill/ai-trace/bin/main.py scan` 生成基础骨架，并可通过 H5 `/spaces` 页面补充 `purpose / purpose_tag / visibility`。

---

## 4. 关联规范
- [workspace_candidate.md](./workspace_candidate.md)
- [dashboard.md](../../surfaces/dashboard.md)
