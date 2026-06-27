# Dashboard Surface (H5 操作面)

> status: approved
> updated_at: 2026-06-27
> layer: surfaces

本文件定义 Dashboard 前端页面的全局路由总纲，以及各路由节点所挂载的核心能力与数据契约映射。

> [!IMPORTANT]
> Phase 2 当前已允许使用最小本地 API。
> 当前前端支持显式 `Live / Mock` 模式。
> 当前 `/api/*` 只服务 `Scan -> Register -> Space`，不代表 Phase 3 的完整索引 API 已解锁。

---

## 1. 全局路由总纲 (Global Routing)

前端采用 SPA 架构，侧边栏与一级路由保持稳定不变。

| 一级路由路径 | 侧边栏菜单名 | 阶段状态 | 挂载的核心能力 |
| --- | --- | --- | --- |
| `/home` | Home | Phase 2 Active | 展示当前阶段、数据通道、空间与 Agent 摘要 |
| `/spaces` | Spaces | Phase 2 Active | 展示本机一级空间、用途声明、待接入空间 |
| `/agents` | Agents | Phase 2 Active | 已注册实例管理、待接入候选弹窗 |
| `/sessions` | Sessions | Locked / P3+ | 仅显示锁定态，不开放真实路由 |
| `/settings` | Settings | Reserved | 仅显示占位，不承载真实配置写入 |

---

## 2. 局部能力映射 (Local Capabilities)

### 2.1 `/spaces`

**界面职责**：
默认展示已注册空间管理页；未注册与已忽略空间统一进入待接入弹窗。

**侧栏数字口径**：
- `Spaces` 侧栏数字只允许使用已接入声明事实，例如已写入 `spaces.json` 的数量。
- 如果当前没有稳定的已接入统计，则不展示数字。
- 禁止直接使用扫描候选数、待接入数或 Mock 占位数冒充侧栏数字。

**Phase 2 待接入口径**：
- `未注册`：扫描结果中存在，但既不在已声明事实，也不在已忽略决策中。
- `已忽略`：存在于 `intake_status.json` 的跳过决策中。
- `已注册`：已经写入 `spaces.json` 的声明事实。

### 2.2 `/agents`

**界面职责**：
默认展示已注册 Agent 的卡片工作台；点击卡片后，在右侧抽屉查看索引摘要。未注册与已忽略 Agent 统一进入待接入弹窗。

**侧栏数字口径**：
- `Agents` 侧栏数字只允许使用已注册实例数。
- 如果当前没有稳定的已注册统计，则不展示数字。
- 禁止直接使用候选数、待接入数或扫描命中数冒充已接入数量。

**卡片展示口径**：
- 主标题优先显示 `alias`；没有别名时显示实例名。
- 次标题只显示产品类型，例如 `QwenPaw`、`Claude Code`。
- 卡片中间区域只保留视觉占位，不再展示地址、工作区或索引文案。
- 卡片底部只保留：最近活跃时间、会话数。
- 时间字段后续统一读取真实 Agent 原生数据中的最近会话时间或最近活动时间，不再使用前端生成时间、页面刷新时间或扫描时间冒充。

**右侧摘要口径**：
- 右侧抽屉展示：类型、地址、工作区、会话数、最近活跃时间、索引状态。
- Phase 2 的 `索引状态` 仅为摘要占位，不展开会话列表、筛选器或全文处理。

**注册主键口径**：
前端不得再以 `root_path_masked` 作为注册判定主键，而应统一以 `selected_workspace_masked` 作为实例主键：
- 单实例产品：`selected_workspace_masked = root_path_masked`
- 多实例产品：`selected_workspace_masked = 具体 workspace 路径`

**Phase 2 Mock 数据源落点**：
| 读取目标 | 路径 |
| --- | --- |
| 候选列表 | `skill/ai-trace/mock/data/registry/agent_candidates.json` |
| 已注册列表 | `skill/ai-trace/mock/data/registry/registered_agents.json` |
| 实例上下文 | `skill/ai-trace/mock/data/registry/workspace_candidates.json` |

**Phase 2 当前 Live API 路由**：
| API 路径 | 请求方法 | 对应的数据源落点 |
| --- | --- | --- |
| `/api/registry/candidates` | GET | `registry/agent_candidates.json` |
| `/api/registry/registered` | GET | `registry/registered_agents.json` |
| `/api/registry/workspaces` | GET | `registry/workspace_candidates.json` |
| `/api/registry/spaces` | GET | `registry/spaces.json` |
| `/api/registry/register` | POST | 触发最小注册写盘 |
| `/api/registry/agents/intake` | POST | 记录 `skipped` 决策 |
| `/api/registry/spaces/intake` | POST | 记录 `skipped` 决策 |

**待接入过滤口径**：
待接入列表不是直接读取扫描 JSON，而是运行时合并三层结果：
1. 扫描结果：当前发现了哪些实例。
2. 已注册事实：哪些实例已经注册成功。
3. 已忽略决策：哪些实例被用户标记为暂不接入。

因此待接入弹窗只保留两个 Tab：
- `未注册`
- `已忽略`

---

## 3. 关联规范
- 扫描与注册流转规则：[scan_register.md](../flows/scan_register.md)
- Agent 实例契约：[candidate.md](../contracts/objects/candidate.md), [card.md](../contracts/objects/card.md)
- 空间与待接入契约：[space.md](../contracts/objects/space.md), [intake_state.md](../contracts/objects/intake_state.md)
