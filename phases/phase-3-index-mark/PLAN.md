# Phase 3 Plan: Index / Mark

> updated_at: 2026-06-21
> phase_status: planned
> model_status: current-proposed-5-phase-model
> scope: `Index -> Mark`

## 1. 目标

### 1.1 阶段定位

Phase 3 不做复杂提炼，而是把已授权 Agent 的会话先变成“可列出、可定位、可标记”的最小索引。

### 1.2 本阶段要达成的结果

- 已授权 Agent 具备最小会话索引
- 显式标签能控制哪些会话进入后续流程
- H5 能只读展示最小会话视图
- Phase 4 能拿到稳定的索引与标记入口

## 2. 计划安排

### 2.1 索引层

- 为已授权 Agent 定义最小 `Session Index` 字段
- 实现 `index` 入口，输出最小会话索引结构
- 提取最小元数据，例如 `agent_id / session_id / title / updated_at / cwd / folder_path / bookmark_state`
- 判断会话索引是否需要沉淀为长期数据，明确刷新策略、保留策略与私有落点

### 2.2 标记层

- 定义显式标签扫描规则，例如 `#bookmark`
- 建立最小 `bookmark_state` 与 `bookmark_tags` 表达方式
- 明确哪些标记会进入后续提炼
- 保持私有仓扩展只落在索引与标记直接相关的最小结构

### 2.3 展示层

- 定义 Phase 3 所需的最小私有索引落点
- 打通 H5 Mock / Real 数据切换
- 点亮 H5 `Wiki / Flow` 的最小只读视图
- 只增加与 `Index / Mark` 直接相关的 `ai-trace` Skill 能力边界

## 3. 代码判断

| 判断 | 结论 |
| --- | --- |
| 是否需要代码 | 需要 |
| 代码作用 | 为已授权 Agent 建索引、扫描显式标签、输出只读展示数据 |
| 代码重点 | 会话枚举、最小元数据提取、标记解析、数据注入 |

## 4. 前端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要前端 | 需要 |
| 能力定位 | 只读展示会话列表、详情与标记状态 |
| 菜单层级 | 在 `Home / Agents` 基础上新增 `Wiki / Flow` 的最小只读能力 |

### 4.1 前端菜单层级建议

| 一级菜单 | Phase 3 状态 | 当前能力 |
| --- | --- | --- |
| `Home` | Active | 延续 Phase 2 的总览能力 |
| `Agents` | Active | 延续注册结果与映射展示 |
| `Wiki` | Active | 展示最小会话索引列表与详情 |
| `Flow` | Active-Minimal | 展示 `bookmark_state` 与标记状态视图 |
| `Profile` | Placeholder | 标注 `P4+` |
| `Skills` | Placeholder | 标注 `P5+` |

## 5. 后端能力

| 项目 | 当前判断 |
| --- | --- |
| 是否需要后端代码 | 需要 |
| 主要命令 | `python3 apps/cli/main.py index` |
| 主要作用 | 提取最小会话元数据、解析显式标记、输出真实索引数据 |

### 5.1 后端当前能力建议

- 只为已授权 Agent 建索引
- 只提取最小会话元数据
- 只解析显式标签
- 输出 `session_index.json` 或等价结构
- 为 H5 提供 Mock / Real 可切换的数据包
- 不扩展到 candidate / sync / audit 的私有目录

## 6. 交付判断

### 6.1 主要产物

- 阶段目录模板：本目录 `TEMPLATE.md`
- 草稿 Spec：`drafts/specs/flow/SESSION_INDEX_SPEC.md`
- 草稿 Spec：`drafts/specs/flow/BOOKMARK_RULE_SPEC.md`
- 推荐补充：`Session Linkage`

### 6.2 DoD

- 能看到已授权 Agent 的会话列表
- 能看到会话 ID、时间、工作区与目录关联
- 能识别显式标签标记
- 能展示 `bookmark_state`
- H5 最小只读视图可工作
- 能基于最小字段完成会话筛选
- 能明确索引是临时缓存还是沉淀数据
- Mock / Real 数据切换链路可用

## 7. 当前不做什么

- 不提取工具子命令
- 不提取文件列表
- 不做复杂语义总结
- 不做全文搜索工作台
- 不做多会话自动归并
- 不引入本地 API 服务
- 不要求 H5 作为当前阶段主要写入入口
- 不提前固化 Skill 分发形态；当前保持单一 `ai-trace` Skill 方向
