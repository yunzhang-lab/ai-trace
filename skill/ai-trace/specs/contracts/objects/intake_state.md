# Intake State Contract

> status: approved
> updated_at: 2026-06-27
> layer: contracts/objects

`Intake State` 是 Phase 2 已落地的待接入决策对象，用于保存“已忽略”的轻量状态。

---

## 1. 数据契约 (JSON Schema)

详见独立文件：[intake_state.schema.json](./intake_state.schema.json)

---

## 2. 对象语义

Phase 2 当前只落盘一种显式决策：`skipped`。

因此：
- `未注册`：运行时推导，不落盘。
- `已注册`：以 `registered_agents.json` 或 `spaces.json` 的事实为准。
- `已忽略`：落入 `intake_status.json`。

该对象当前服务于两个待接入弹窗：
- Agent 待接入弹窗
- Spaces 待接入弹窗

---

## 3. 存储与流转契约

| 数据类型 | 路径 |
| --- | --- |
| 真实决策文件（私有） | `~/.ai-trace/data/registry/intake_status.json` |

当前不要求维护公开 Mock 版 `intake_status.json`。

---

## 4. 关联规范
- [card.md](./card.md)
- [space.md](./space.md)
- [dashboard.md](../../surfaces/dashboard.md)
