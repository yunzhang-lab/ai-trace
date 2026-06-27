# Scan & Register Capability 扫描与注册能力 (Mapping Layer)

> phase: Phase 2 (Active)
> layer: guides (Skill Hub)
> scope: System Core
> updated_at: 2026-06-27

本文件定义系统最基础的扫描探测 (`Scan`) 与本地注册 (`Register`) 能力边界，并作为该能力在 `skill/ai-trace/` 内各类物理落点的总映射枢纽。

---

## 1. 能力实体映射关系 (Asset Mapping)

| 资产维度 | 物理落点 / 规范文件 | 职责说明 |
| --- | --- | --- |
| **代码入口 (Code)** | `bin/main.py scan`<br/>`bin/main.py register`<br/>`bin/main.py serve` | CLI 负责扫描、注册与最小本地服务入口。 |
| **数据落点 (Data)** | 候选：`skill/ai-trace/mock/data/registry/agent_candidates.json`<br/>已注册：`skill/ai-trace/mock/data/registry/registered_agents.json`<br/>工作区候选：`skill/ai-trace/mock/data/registry/workspace_candidates.json` | Phase 2 期间写入或读取的 Mock 数据源。真实应用时对应 `~/.ai-trace/data/registry/`。 |
| **UI 面板 (Surface)** | `ui/` -> `/agents` 路由<br/>规范：[`specs/surfaces/dashboard.md`](../specs/surfaces/dashboard.md) | H5 面板负责 Agent 卡片工作台、右侧索引摘要抽屉与待接入弹窗。 |
| **契约规范 (Specs)** | **对象**：[`candidate.schema.json`](../specs/contracts/objects/candidate.schema.json), [`card.schema.json`](../specs/contracts/objects/card.schema.json), [`intake_state.schema.json`](../specs/contracts/objects/intake_state.schema.json) <br/> **规则**：[`scan_rules.md`](../specs/contracts/cli/scan_rules.md)<br/> **流程**：[`specs/flows/scan_register.md`](../specs/flows/scan_register.md) | 保证接口一致性、数据落盘校验规则与阶段流转的硬性契约。 |

---

## 2. 能力定义与边界

### 2.1 扫描探测能力 (Scan Capability)
**能力目标**：主动探测当前运行环境，发现已安装但尚未被系统纳管的合法 AI Agent 实例。

**注册单元统一口径**：
- 系统当前以 **workspace 实例** 作为注册与比对单元。
- **单实例产品**：注册对象等于产品根目录。
- **多实例产品**：注册对象等于具体 `workspaces/...` 实例路径。
- 因此 `selected_workspace_masked` 是唯一注册主键；`root_path_masked` 只用于说明来源工具根。

### 2.2 本地注册能力 (Register Capability)
**能力目标**：将一个通过 Scan 探测到的 `Candidate`，经过用户确认后，固化为系统长期追踪的 `Registered Agent` 实例。

**核心原则**：
- **确认驱动**：系统不可静默批量注册。
- **实例唯一性**：Register 必须绑定到 `selected_workspace_masked`，而不是仅绑定到产品根路径。
- **私有区写盘**：所有真相数据必须写入 `~/.ai-trace/`。

### 2.3 H5 展示口径 (Agent Surface)
Phase 2 当前 `/agents` 采用“卡片工作台 + 右侧索引摘要抽屉”的最小展示模式：
- 卡片只负责识别已注册实例，不承载细节字段。
- 右侧抽屉只展示索引摘要与实例关键信息。
- 待接入实例统一收进弹窗，不与主工作台并排铺开。
- `Agents / Spaces` 侧栏数字只允许使用已接入事实；没有稳定统计时宁可不展示。
- 卡片时间后续统一取真实 Agent 原生最近活动时间，不再使用扫描时间占位。

### 2.4 待接入状态能力 (Intake Decision)
Phase 2 当前支持最小接入决策：
- `未注册`：运行时推导，不单独落盘。
- `已注册`：以 `registered_agents.json` 或 `spaces.json` 的事实为准。
- `已忽略`：单独写入 `intake_status.json`，用于从待接入列表中隐藏。

待接入列表因此必须做三层合并：
1. 当前扫描结果。
2. 已注册事实。
3. 已忽略决策。

---

## 3. 能力约束表

| 能力特性 | 强制要求 (Must) | 禁止行为 (Must Not) |
| --- | --- | --- |
| 注册主键 | 统一使用 `selected_workspace_masked` | 禁止仅按 `root_path_masked` 判定注册 |
| 数据可见性 | 返回脱敏后的候选信息用于展示 | 严禁展示或缓存原生会话日志 |
| 待接入过滤 | 运行时合并扫描/注册/忽略三层结果 | 禁止把 `skipped` 直接写回扫描候选文件 |
