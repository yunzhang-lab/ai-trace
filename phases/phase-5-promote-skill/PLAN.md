# Phase 5 Plan: Promote / Skill

> updated_at: 2026-06-21
> phase_status: direction-defined
> model_status: current-proposed-5-phase-model
> scope: 稳定模板 Promote、迁移工具、Skill 正式化

## 1. 目标

### 1.1 阶段定位

Phase 5 负责把前面阶段稳定下来的对象与流程，升级为正式资产。

### 1.2 本阶段要达成的结果

- 稳定对象具备正式模板落点方案
- 有最小可用的迁移工具
- 有最小可用的 Skill 正式化方案

## 2. 计划安排

### 2.1 核心安排

- 判断哪些对象已达到稳定标准
- 设计 Promote 规则与迁移工具
- 梳理适合正式 Skill 化的动作、流程与入口
- 将前序阶段能力评估并打包为单一稳定 `ai-trace` Skill

## 3. 代码判断

| 判断 | 结论 |
| --- | --- |
| 是否需要代码 | 需要 |
| 代码作用 | 迁移稳定模板、封装 Promote 工具、形成 Skill 正式交付能力 |
| 代码重点 | Promote Tooling、Migration Tooling、Skill Packaging |

## 4. 前端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要前端 | 需要 |
| 能力定位 | 展示稳定成果、展示 Skill 入口、提供迁移与 Promote 说明 |
| 菜单层级 | `Skills` 点亮，`Wiki / Profile` 成果页完善 |

### 4.1 前端菜单层级建议

| 一级菜单 | Phase 5 状态 | 当前能力 |
| --- | --- | --- |
| `Home` | Active | 展示全局成熟度与阶段结果 |
| `Agents` | Active | 继续保留来源入口 |
| `Wiki` | Active | 展示稳定沉淀成果 |
| `Profile` | Active | 展示稳定对象归口 |
| `Flow` | Active | 展示 Promote 与治理链路概览 |
| `Skills` | Active | 展示 Skill 成果、使用说明与正式入口 |

## 5. 后端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要后端代码 | 需要 |
| 主要命令 | `promote / migrate / skill` |
| 主要作用 | 将稳定对象升级为模板，提供迁移与 Skill 正式化工具 |

### 5.1 后端当前能力建议

- Promote 稳定模板
- 模板迁移与升级
- Skill 封装与发布辅助
- 版本与来源追溯保持可解释
- 将稳定能力收口为职责清晰的单一 `ai-trace` Skill

## 6. 交付判断

### 6.1 主要产物

- 阶段目录模板：本目录 `TEMPLATE.md`
- 推荐补充：`Promote Rule`
- 推荐补充：`Migration Spec`
- 推荐补充：`Skill Packaging Note`

### 6.2 DoD

- 只有稳定对象模板才允许建立正式模板落点
- 有最小可用的迁移工具
- 有最小可用的 Skill 正式化方案
- Promote 规则可解释、可追溯

## 7. 当前不做什么

- 不把未稳定对象提前放入正式模板落点
- 不把 Phase 4 候选直接伪装成正式标准
- 不要求一次性完成完整 Skill 插件化生态
