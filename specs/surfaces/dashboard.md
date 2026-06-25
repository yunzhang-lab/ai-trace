# Dashboard Surface (H5 操作面)

> status: approved
> updated_at: 2026-06-24
> layer: surfaces

本文件定义 Dashboard 前端页面的**全局路由总纲**，以及各路由节点所挂载的核心能力与数据契约映射。

> [!IMPORTANT]
> Dashboard 能力分阶段接入数据源。
> Phase 2 为了尽快完成可视化闭环，允许静态读取 `mock/data/`。
> Phase 3 再引入统一 `/api/*` 接口，将 Mock / Real 切换下沉到后端或中间件。

---

## 1. 全局路由总纲 (Global Routing)

前端采用 SPA (Single Page Application) 架构，侧边栏与一级路由保持稳定不变。所有业务能力均以“挂载 (Mount)”的形式接入对应的路由节点。

| 一级路由路径 | 侧边栏菜单名 | 阶段状态 | 挂载的核心能力 |
| --- | --- | --- | --- |
| `/home` | Home | Phase 2+ | Dashboard 概览、全局状态墙 |
| `/agents` | Agents | Phase 2+ | 扫描 (Scan)、注册 (Register)、Agent 管理 |
| `/wiki` | Wiki | Phase 3+ | 知识图谱、Project/Decision 索引 |
| `/flow` | Flow | Phase 4+ | 动作流转、日志审计 (Audit) |
| `/settings` | Settings | Phase 2+ | 全局配置 (Mock开关等) |

---

## 2. 局部能力映射 (Local Capabilities)

### 2.1 `/agents` (Agent 注册与管理)

**界面指责**：
展示扫描候选列表（`candidates`）、展示已注册卡片（`registered`），并提供注册转化表单。

**数据契约引用**：
为了保证系统字段口径绝对唯一，前端 H5 展示所使用的任何字段，必须严格遵循数据对象契约，不再单独定义字段字典：
- **候选对象**：遵循 [candidate.schema.json](../contracts/objects/candidate.schema.json)
- **已注册卡片**：遵循 [card.schema.json](../contracts/objects/card.schema.json)

**Phase 2 数据源落点**：
| 读取目标 | 路径 |
| --- | --- |
| 候选列表 | `mock/data/registry/agent_candidates.json` |
| 已注册列表 | `mock/data/registry/registered_agents.json` |

**Phase 3+ API 路由预留**：
| API 路径 | 请求方法 | 对应的数据源落点 |
| --- | --- | --- |
| `/api/registry/candidates` | GET | `registry/agent_candidates.json` |
| `/api/registry/registered` | GET | `registry/registered_agents.json` |

说明：扫描与注册按钮可以在 Phase 2 先作为 CLI 指引或动作占位；真正由 H5 调用本地 API 执行写盘，留到 Phase 3。

**视觉状态约定**：
- **`candidate`**: 青色 badge + 可点击的 "Register" 按钮。
- **`registered`**: 绿色 badge + 禁用的 "Register" 按钮。

### 2.2 `/wiki` & `/flow` (占位说明)

**界面指责**：
向用户透出未来能力，占位符设计。
**视觉状态约定**：
- 显示锁定态 (Locked) 或灰色占位图。
- 标记 `P3+` / `P4+` 标签，提醒用户相关能力尚未解锁。

---

## 3. 关联规范
- 扫描与注册流转规则：[scan_register.md](../flows/scan_register.md)
