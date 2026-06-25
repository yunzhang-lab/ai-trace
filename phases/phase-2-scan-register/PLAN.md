# Phase 2 Plan: Scan / Register

> updated_at: 2026-06-21
> phase_status: planned
> model_status: current-proposed-5-phase-model
> scope: `Scan -> Register`

## 1. 目标

### 1.1 阶段定位

Phase 2 的核心不是进入会话内容，而是先把“本地 Agent 能否接入系统”这件事做实。

### 1.2 本阶段要达成的结果

- 能发现本机已有 Agent
- 能把扫描结果变成可确认的候选
- 能完成注册确认并形成稳定映射
- 能为 Phase 3 准备可用的授权 Agent 列表

## 2. 计划安排

### 2.1 扫描层

- 定义本机已知 Agent 根路径扫描规则
- 识别 Agent 产品、工作区模式、会话源类型与可用标记
- 输出扫描候选结果，例如 `agent_candidates.json`

### 2.2 注册层

- 设计注册确认输入输出，例如 `agents.json`
- 定义 `Agent Card` 最小字段
- 定义与注册、映射、队列预览直接相关的最小私有落点
- 确认 `~/.ai-trace/data/` 为结构化数据一级根
- 当前只解锁 `data/registry/` 与 `data/agents/`
- 不扩展与 Phase 2 无关的私有全局目录

### 2.3 展示层

- 实现 `python3 apps/cli/main.py scan` 作为真实入口
- 准备注册确认链路所需的最小后端与展示数据
- 让 H5 的 `Home / Agents` 能读取并展示结果
- 只开放与 `Scan / Register` 相关的 `ai-trace` Skill 能力边界

## 3. 代码判断

| 判断 | 结论 |
| --- | --- |
| 是否需要代码 | 需要 |
| 代码作用 | 发现本地 Agent、标准化候选、生成注册结果、输出脱敏展示数据 |
| 代码重点 | 扫描逻辑、候选生成、注册映射、私有路径脱敏 |

## 4. 前端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要前端 | 需要 |
| 能力定位 | 展示流程、展示候选、发起注册确认、展示映射结果 |
| 菜单层级 | 只点亮 `Home / Agents`；其余一级菜单保持占位 |

### 4.1 前端菜单层级建议

| 一级菜单 | Phase 2 状态 | 当前能力 |
| --- | --- | --- |
| `Home` | Active | 展示主流程、边界说明、当前阶段进度 |
| `Agents` | Active | 展示候选、注册表单、已注册映射、队列预览 |
| `Wiki` | Placeholder | 标注 `P3+` |
| `Profile` | Placeholder | 标注 `P4+` |
| `Flow` | Placeholder | 标注 `P3+ / P4+` |
| `Skills` | Placeholder | 标注 `P5+` |

## 5. 后端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要后端代码 | 需要 |
| 主要命令 | `python3 apps/cli/main.py scan` |
| 主要作用 | 发现 Agent、归一候选、输出注册输入数据 |

### 5.1 后端当前能力建议

- 扫描已知 Agent 根路径
- 判断 `workspace_mode`
- 判断 `session_source_type`
- 生成候选列表
- 生成脱敏展示数据包
- 生成已注册映射结果
- 将私有仓真实输出控制在 `data/registry/` 与 `data/agents/` 等 Phase 2 最小落点

## 6. 交付判断

### 6.1 主要产物

- 能力规范：[scan_register.md](/specs/capabilities/scan_register.md)
- 流程规范：[scan_register.md](/specs/flows/scan_register.md)
- Candidate 契约：[candidate.md](/specs/contracts/objects/candidate.md)
- Candidate Schema：[candidate.schema.json](/specs/contracts/objects/candidate.schema.json)
- Agent Card 契约：[card.md](/specs/contracts/objects/card.md)
- Agent Card Schema：[card.schema.json](/specs/contracts/objects/card.schema.json)
- Dashboard 操作面：[dashboard.md](/specs/surfaces/dashboard.md)
- CLI 扫描规则：[scan_rules.md](/specs/contracts/cli/scan_rules.md)
- CLI 扫描配置：[scan_config.json](/specs/contracts/cli/scan_config.json)
- Mock 数据：[agent_candidates.json](/mock/data/registry/agent_candidates.json) 与 [registered_agents.json](/mock/data/registry/registered_agents.json)
- CLI 实现：[scan_agents.py](/apps/cli/scripts/scan_agents.py) 与 [register_agent.py](/apps/cli/scripts/register_agent.py)

后续每个阶段都必须在本节列出实际交付产物，并指向稳定规范、Mock 数据或实现文件的真实链接。

### 6.2 DoD

- 能识别本地 Agent 根路径
- 能判断 `workspace_mode`
- 能判断会话源类型
- 能输出候选卡片数据
- 能完成用户确认注册
- 能生成最小 Agent Card 与注册映射
- H5 `Home / Agents` 可展示 Phase 2 所需信息

### 6.3 验收入口

- 当前阶段验收统一见 [ACCEPTANCE.md](/phases/phase-2-scan-register/ACCEPTANCE.md)
- 前端字段、注册流程与视觉状态见 [dashboard.md](/specs/surfaces/dashboard.md)

## 7. 当前不做什么（Phase 2 明确排除）

以下功能在 Phase 2 中**完全不实现**，但前端可在卡片上保留视觉占位（如灰色图标 + 标注 `P3+`），以便后续阶段直接激活：

| 功能 | 排除原因 | 规划阶段 |
| --- | --- | --- |
| 会话列表 / 会话标题索引 | 需读取大量 JSONL/SQLite，属于 Extract 阶段核心 | Phase 3 |
| 会话筛选 | 依赖会话索引字段与状态稳定 | Phase 3 |
| 会话索引是否沉淀为长期数据 | 需要先确认最小索引字段、刷新策略与保留策略 | Phase 3 |
| Agent 文件夹标题索引 | 依赖会话索引完成后才有意义 | Phase 3 |
| 跳转查看 Agent 记忆文件内容 | 路径可预留，内容读取放 Phase 3 | Phase 3 |
| 跳转查看 Agent 偏好文件内容 | 同上 | Phase 3 |
| Agent 在线 / 活跃状态实时检测 | 需要进程探测或 socket，属于运行时能力 | Phase 3/4 |
| 知识图谱可视化 | 依赖会话内容提炼和关系构建完成 | Phase 4+ |
| 本地 API 服务 (`/api/scan` 等) | 超出当前阶段，Codex 可按需补充 | Phase 3 |
| 私有仓完整目录树定义 | 不提前设计，等实际写入需求出现 | Phase 3+ |
| Candidate 提炼 / 审核页 | 不进入 H5 会话详情 | Phase 3 |

---

## 8. 与 Phase 3 的边界

1. Phase 2 不进入会话索引与会话详情。
1.1 不做 Session Index  
1.2 不做 Bookmark 写入  
1.3 不做记忆/偏好内容浏览

2. Phase 2 不进入真实模式 API 打通。
2.1 `python3 apps/cli/main.py serve` 留给 Phase 3  
2.2 `/api/registry/candidates` 与 `/api/registry/registered` 留给 Phase 3
