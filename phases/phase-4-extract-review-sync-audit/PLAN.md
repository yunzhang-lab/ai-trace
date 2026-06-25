# Phase 4 Plan: Extract / Review / Sync / Audit

> updated_at: 2026-06-21
> phase_status: direction-defined
> model_status: current-proposed-5-phase-model
> scope: `Extract -> Review -> Sync -> Audit`

## 1. 目标

### 1.1 阶段定位

Phase 4 开始从“索引和标记”进入“提炼和治理闭环”。

### 1.2 本阶段要达成的结果

- 已标记会话能形成候选
- 候选能进入审核
- 审核结果能进入同步和审计链

## 2. 计划安排

### 2.1 核心安排

- 定义 `Candidate` 结构与来源追溯关系
- 定义 `approve / reject / private / merge` 审核动作
- 建立同步队列与审计留痕
- 跑通一条 `标记 -> 候选 -> 审核 -> 同步 -> 审计` 链路
- 保持 Phase 4 只定义候选、同步、审计直接相关的私有结构
- Skill 仍以单编排能力为主，不在本阶段正式拆分

## 3. 代码判断

| 判断 | 结论 |
| --- | --- |
| 是否需要代码 | 需要 |
| 代码作用 | 候选提炼、审核动作消费、同步落盘、审计追加 |
| 代码重点 | 提炼管线、审核状态流转、队列消费、审计日志 |

## 4. 前端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要前端 | 需要 |
| 能力定位 | 展示候选、支持审核动作入口、展示同步与审计状态 |
| 菜单层级 | `Flow` 正式点亮，`Profile` 开始进入成果归口 |

### 4.1 前端菜单层级建议

| 一级菜单 | Phase 4 状态 | 当前能力 |
| --- | --- | --- |
| `Home` | Active | 延续总览 |
| `Agents` | Active | 延续映射与来源入口 |
| `Wiki` | Active | 展示已提炼来源关联 |
| `Flow` | Active-Full | 候选列表、审核动作、同步状态、审计入口 |
| `Profile` | Active | 展示对象归口与审核后成果入口 |
| `Skills` | Placeholder | 标注 `P5+` |

## 5. 后端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要后端代码 | 需要 |
| 主要命令 | `extract / review / sync / audit` |
| 主要作用 | 提炼候选、消费审核动作、执行真实同步、保留审计留痕 |

### 5.1 后端当前能力建议

- Candidate 生成
- Review 状态流转
- Sync Queue 消费
- Audit Log 追加
- 来源到候选到稳定对象的追溯链
- 与 Phase 4 无关的 Promote / Skill 正式化能力继续延后

## 6. 交付判断

### 6.1 主要产物

- 阶段目录模板：本目录 `TEMPLATE.md`
- 推荐补充：`Candidate Schema`
- 推荐补充：`Review Action Spec`
- 推荐补充：`Sync Queue Spec`
- 推荐补充：`Audit Log Spec`

### 6.2 DoD

- Candidate 结构稳定
- 审核动作链路可执行
- Sync 队列能消费真实动作
- Audit 链路能追加关键留痕
- 至少一条端到端真实链路跑通

## 7. 当前不做什么

- 不提前 Promote 稳定模板
- 不把候选直接当正式模板
- 不承诺全自动审核
- 不承诺重型数据库或向量库方案
