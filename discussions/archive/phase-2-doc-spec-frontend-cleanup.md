# Phase 2 文档、规范与前端数据收口建议

> created_at: 2026-06-24
> updated_at: 2026-06-24
> status: in-progress
> scope: Phase 2 Scan / Register
> executor: Antigravity
> 7.1 第一优先级：✅ 已完成（2026-06-24）

## 1. 总结论

1. Phase 2 当前最大问题不是继续补功能，而是边界开始变乱。
1.1 阶段目录承载了过多稳定规范。  
1.2 前端目录仍保留了自带数据源。  
1.3 字段规范、前端能力、注册流程需要上收到统一规范层。

2. 建议将“阶段过程”和“稳定规范”分开。
2.1 `phases/phase-*` 只记录阶段计划、状态、验收。  
2.2 明确字段、对象、前端能力等稳定规范应进入 `specs/`。  
2.3 `apps/dashboard/` 不再维护 mock 数据。

## 2. 当前主要问题

### 2.1 阶段目录承载过多稳定规范

当前 Phase 2 目录中包含：

- `PLAN.md`
- `STATUS_REPORT.md`
- `ACCEPTANCE.md`
- `AGENT_SUPPORT_LIST.md`
- `EXTRACTION_COMMON.md`
- `FRONTEND_REGISTRATION_ALIGNMENT.md`
- `TEMPLATE.md`

其中 `FRONTEND_REGISTRATION_ALIGNMENT.md` 已经不只是阶段过程文档，而是在定义：

- 前端字段映射
- 注册流程
- 视觉状态
- Mock / Real 数据口径

这些内容更像稳定规范，不应长期留在阶段目录里。

### 2.2 字段规范仍散落

当前与 Agent 字段相关的内容散落在：

- `drafts/specs/content/AGENT_CARD_SPEC.md`
- `specs/agents/AGENT_DISCOVERY_SPEC.md`
- `phases/phase-2-scan-register/FRONTEND_REGISTRATION_ALIGNMENT.md`
- `apps/cli/scripts/register_agent.py`
- `apps/dashboard/js/views/agents.js`

这会导致后续出现多份字段口径：

- Candidate 字段
- Agent Card 字段
- 前端展示字段
- CLI 输出字段

建议统一到 `specs/`。

### 2.3 `apps/dashboard/js/data/` 不应保留 mock 数据

当前存在：

- `apps/dashboard/js/data/mock-data.js`

虽然其中 Phase 2 的 `agentCandidates` 和 `registeredAgents` 已经清空，但它仍包含：

- Home 示例数据
- Wiki 示例数据
- Profile 示例数据
- Flow / Sync 示例数据
- Skills 示例数据

这会带来两个问题：

1. `apps/dashboard/` 又变成第二个数据源。
2. 未点亮阶段的内容会在前端里继续膨胀。

建议：

- `apps/dashboard/` 只负责展示逻辑
- 公开 mock 数据只放 `mock/data/`
- `apps/dashboard/js/data/` 应删除或降级为极小的 UI 配置，不再放业务数据

## 3. 建议的目标结构

### 3.1 稳定规范层

建议新增：

```text
specs/
```

建议首批文件：

```text
specs/AGENT_REGISTRATION_SPEC.md
specs/interface/H5_PHASE_CAPABILITY_SPEC.md
```

或者更细拆为：

```text
specs/registry/AGENT_CANDIDATE_SPEC.md
specs/registry/AGENT_CARD_SPEC.md
specs/interface/H5_PHASE_CAPABILITY_SPEC.md
```

### 3.2 Phase 2 阶段目录

Phase 2 目录建议只保留过程性文件：

```text
phases/phase-2-scan-register/README.md
phases/phase-2-scan-register/PLAN.md
phases/phase-2-scan-register/STATUS_REPORT.md
phases/phase-2-scan-register/ACCEPTANCE.md
phases/phase-2-scan-register/TEMPLATE.md
```

谨慎保留：

```text
phases/phase-2-scan-register/AGENT_SUPPORT_LIST.md
phases/phase-2-scan-register/EXTRACTION_COMMON.md
```

建议迁出：

```text
phases/phase-2-scan-register/FRONTEND_REGISTRATION_ALIGNMENT.md
```

### 3.3 Mock 数据层

公开 mock 数据统一放：

```text
mock/data/
```

当前 Phase 2 使用：

```text
mock/data/registry/agent_candidates.json
mock/data/registry/registered_agents.json
```

不建议再维护：

```text
apps/dashboard/js/data/mock-data.js
apps/dashboard/data/
```

## 4. Agent 字段规范建议

### 4.1 Agent Candidate

`Agent Candidate` 是扫描输出对象。

建议归属：

```text
specs/registry/AGENT_CANDIDATE_SPEC.md
```

核心字段：

| 字段 | 说明 |
| --- | --- |
| `candidate_id` | 扫描候选 ID |
| `agent_id` | 稳定 Agent ID |
| `product` | 产品名称 |
| `suggested_alias` | 建议别名 |
| `root_path` | 私有真实根路径 |
| `root_path_masked` | 脱敏展示路径 |
| `status` | 固定为 `candidate` |
| `workspace_mode` | 工作区模式 |
| `session_source_type` | 会话源类型 |
| `session_count` | 会话数量 |
| `workspace_count` | 工作区数量 |
| `session_index_path` | 候选会话源路径 |
| `detected_markers` | 发现的特征标记 |
| `sample_workspaces` | 真实工作区样例 |
| `sample_workspaces_masked` | 脱敏工作区样例 |
| `selected_workspace` | 默认选中工作区 |
| `notes` | 备注 |

### 4.2 Agent Card

`Agent Card` 是注册确认后的对象。

建议归属：

```text
specs/registry/AGENT_CARD_SPEC.md
```

核心字段：

| 字段 | 说明 |
| --- | --- |
| `agent_id` | 稳定 Agent ID |
| `candidate_id` | 来源候选 ID |
| `product` | 产品名称 |
| `alias` | 用户确认别名 |
| `workspace_mode` | 工作区模式 |
| `selected_workspace` | 默认真实工作区 |
| `selected_workspace_masked` | 默认工作区脱敏展示路径 |
| `root_path_private` | 私有真实根路径 |
| `root_path_masked` | 脱敏展示路径 |
| `session_source_type` | 会话源类型 |
| `session_index_path` | 会话源路径 |
| `session_count` | 会话数量 |
| `workspace_count` | 工作区数量 |
| `notes` | 用户备注 |
| `status` | `registered` / `disabled` |
| `detected_markers` | 发现的特征标记 |
| `created_at` | 创建时间 |
| `updated_at` | 更新时间 |

## 5. 前端功能精简建议

### 5.1 Phase 2 前端应保留

Phase 2 的 H5 只需要围绕 `Home / Agents`：

- 展示扫描候选
- 展示已注册状态
- 展示注册预览
- 展示 Phase 2 边界
- 标记 `P3+ / P4+ / P5+` 占位

### 5.2 Phase 2 前端应精简

建议精简：

- `apps/dashboard/js/data/mock-data.js`
- 未点亮阶段的详细假数据
- Profile / Flow / Skills 的复杂示例数据
- 过多 P3+ 功能按钮
- 会让人误解为已经真实写盘的注册文案

### 5.3 Real 模式口径

当前 Real 模式没有后端 API。

建议：

- Phase 2 不验收 H5 Real 展示
- Phase 2 只验收 H5 Mock 展示和注册预览
- H5 Real 展示留给 Phase 3
- `/api/candidates` 和 `/api/registered` 留给 Phase 3

## 6. 注册流程口径

Phase 2 注册流程建议明确为两层：

1. H5 层
1.1 展示候选  
1.2 填写别名、工作区、备注  
1.3 生成注册预览和队列事件  
1.4 更新页面内状态

2. CLI 层
2.1 `python3 apps/cli/main.py scan` 生成候选  
2.2 `python3 apps/cli/main.py register` 执行真实写盘  
2.3 生成 `Agent Card`  
2.4 生成 `registered_agents.json`

Phase 2 不做：

- H5 直接写私有仓
- 本地 API 服务
- Real 模式数据展示

## 7. 建议处理顺序

### 7.1 第一优先级 ✅ 已完成（2026-06-24）

1. ✅ 新增 `specs/` — 已创建，包含 README.md
2. ✅ 将 `Agent Candidate / Agent Card` 字段规范迁入 `specs/` — 已创建 AGENT_CANDIDATE_SPEC.md 和 AGENT_CARD_SPEC.md
3. ✅ Phase 2 文档只引用统一规范 — README.md 已更新，FRONTEND_REGISTRATION_ALIGNMENT.md 已删除，内容迁入 specs/interface/H5_PHASE_CAPABILITY_SPEC.md

### 7.2 第二优先级

1. 将前端能力规范迁入 `specs/interface/H5_PHASE_CAPABILITY_SPEC.md`
2. 删除或迁出 `FRONTEND_REGISTRATION_ALIGNMENT.md`
3. 更新 `README.md`

### 7.3 第三优先级

1. 删除 `apps/dashboard/js/data/`
2. 前端只从 `mock/data/` 获取 Phase 2 mock 数据
3. 未点亮页面只保留最小占位

### 7.4 第四优先级

1. 更新 `ACCEPTANCE.md`
2. 验收项改为引用 `specs/`
3. Phase 2 只验收 Scan / Register / Mock 展示 / 注册预览

## 8. 建议最终口径

1. 阶段目录是过程。
1.1 用来写计划、状态、验收、阶段边界。

2. `specs/` 是稳定规范。
2.1 用来写字段、对象、前端能力、接口契约。

3. `mock/data/` 是公开 mock 数据。
3.1 供 H5 和测试读取。

4. `apps/dashboard/` 是展示层。
4.1 不承担数据源职责。

5. Phase 2 不做 Real API。
5.1 Real 模式留给 Phase 3。
