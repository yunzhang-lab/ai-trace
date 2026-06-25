# Phase 1 Plan: 骨架收口

> updated_at: 2026-06-21
> phase_status: completed
> model_status: current-proposed-5-phase-model
> scope: 仓库骨架、公私边界、文档职责分离

## 1. 目标

### 1.1 阶段定位

Phase 1 不是做完整功能，而是先把项目骨架收紧，避免后续阶段边界漂移。

### 1.2 本阶段要达成的结果

- 公开仓与私有区边界清楚
- 总纲、路线图、对齐工作台、讨论区职责清楚
- 后续阶段有统一入口，不再边做边改骨架

## 2. 计划安排

### 2.1 结构收口

- 将公开仓顶层收口为 `phases / specs / drafts / discussions / apps / mock` 六个根目录
- 明确未 Promote 的模板设想先进入 `drafts/templates/`

### 2.2 文档收口

- 将系统总入口收口到根 `README.md`
- 将阶段路线与解锁职责收口到 `phases/ROADMAP.md`
- 将跨阶段通用定义工作台下沉到 `drafts/ALIGNMENT.md`
- 将讨论索引、状态、归档规则收口到 `discussions/README.md`

### 2.3 边界收口

- 明确公开仓与 `~/.ai-trace` 的公私边界
- 明确前端和后端的统一入口口径
- 明确公有仓与私有仓共用同一套阶段主轴
- 明确私有仓现阶段只定一级原则，不定完整目录树
- 明确 Skill 在现阶段只定义角色边界，不提前固化完整分发包

## 3. 代码判断

| 判断 | 结论 |
| --- | --- |
| 是否需要代码 | 低优先级需要 |
| 代码角色 | 提供统一入口骨架与展示骨架，不承担真实业务闭环 |
| 代码重点 | `apps/cli/main.py` 入口骨架、H5 菜单壳与占位说明 |

## 4. 前端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要前端 | 需要最小壳层 |
| 能力定位 | 展示信息架构、边界说明、占位页面 |
| 菜单层级 | 只需要先定义一级菜单方向，不要求业务功能点亮 |

### 4.1 前端菜单判断

| 一级菜单 | Phase 1 状态 | 作用 |
| --- | --- | --- |
| `Home` | Placeholder | 展示系统目标与边界 |
| `Agents` | Placeholder | 预留 Agent 接入入口 |
| `Wiki` | Placeholder | 预留会话与沉淀入口 |
| `Profile` | Placeholder | 预留画像与对象归口 |
| `Flow` | Placeholder | 预留流程与状态入口 |
| `Skills` | Placeholder | 预留 Skill 入口 |

## 5. 后端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要后端代码 | 需要最小骨架 |
| 能力定位 | 统一真实执行入口，不做完整流程实现 |
| 主要作用 | 固定后续子命令归口、避免各阶段各写入口 |

### 5.1 后端最小能力

- 统一入口：`python3 apps/cli/main.py <subcommand>`
- 不要求完整子命令实现
- 不要求真实扫描、索引、提炼能力
- 不要求 Skill 插件化或正式打包

## 6. 交付判断

### 6.1 主要产物

- 总入口：`README.md`
- 路线图：`phases/ROADMAP.md`
- 对齐工作台：`drafts/ALIGNMENT.md`
- 讨论规范：`discussions/README.md`
- 私有仓一级原则口径
- Skill 角色边界口径

### 6.2 DoD

- 6 个公开根目录明确
- 总纲、路线图、对齐工作台、讨论区职责明确
- 公私边界明确
- 统一前后端入口口径明确

## 7. 当前不做什么

- 不定义私有仓具体目录名
- 不定义会话索引格式
- 不定义 Candidate / Review / Sync / Audit 具体结构
- 不提前设计远期对象模板
- 不提前承诺完整前后端能力
