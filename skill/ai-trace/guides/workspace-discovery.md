# Workspace Discovery Capability (空间发现边界)

> phase: Phase 2 (Active)
> layer: guides
> scope: System Core
> updated_at: 2026-06-27

本文件定义系统在 Phase 2 的空间发现能力边界。当前优先识别本机一级文件夹，用于统一内容归属与协作路由；更深层目录属于后续增强能力。

---

## 1. 能力实体映射关系 (Asset Mapping)

| 资产维度 | 物理落点 / 规范文件 | 职责说明 |
| --- | --- | --- |
| **代码入口 (Code)** | 无独立 CLI 命令，依附于 `bin/main.py scan` 顺延输出。 | - |
| **数据落点 (Data)** | Mock：`skill/ai-trace/mock/data/registry/workspace_candidates.json`<br/>Real：`~/.ai-trace/data/registry/workspace_candidates.json` | 记录一级空间候选，以及必要的浅层上下文。 |
| **UI 面板 (Surface)** | `ui/` -> `/spaces` 路由<br/>辅助出现在 `/agents` 注册上下文中。 | `Spaces` 是独立一级菜单；`Agents` 只读取必要的空间上下文。 |
| **契约规范 (Specs)** | **对象**：[`workspace_candidate.schema.json`](../specs/contracts/objects/workspace_candidate.schema.json), [`space.schema.json`](../specs/contracts/objects/space.schema.json) | 空间候选与空间声明对象的标准字段格式。 |

---

## 2. 能力定义与边界

**核心原则**：
- **一级优先**：Phase 2 优先识别本机一级文件夹，回答“内容应进入哪个一级空间”。
- **浅层发现**：当前只做最小归属判断，不做深层目录树理解，不做跨层关系建模。
- **不碰会话**：空间发现本身不进入会话解析，不承担索引职责。
- **独立工作台**：在 Phase 2 UI 中，`Spaces` 已作为独立一级菜单存在；但它仍只承担空间契约层，而不进入深层治理。

## 3. 概念区分

- `space` 指本机一级文件夹，是面向协作与内容归属的空间。
- `subspace` 指更深层目录，属于后续增强能力。
- Agent 产品内部自带的 `workspaces/` 结构，不等同于本机一级空间。
- 对于多实例产品，内部 `workspaces/` 更接近实例来源；本机一级空间仍是外部协作空间。

## 4. 公私边界

- 私有真实数据允许保留 `workspace_path_private`，因为它服务本地真实映射。
- 公开 Mock 数据只允许保留脱敏字段，如 `workspace_path_masked`，不应保留私有绝对路径。
- Phase 2 中 `workspace_candidates.json` 用于空间候选展示与注册上下文，不承载深层空间治理。
