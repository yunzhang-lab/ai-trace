# ai-trace Progress

> status: active
> updated_at: 2026-06-27
> purpose: Step 能力链进度看板

本文件是唯一进度看板。阶段边界见 [phases/ROADMAP.md](/phases/ROADMAP.md)，未确认计划见 [drafts/plans/](/drafts/plans/)，稳定开发规范见 [skill/ai-trace/specs/README.md](/skill/ai-trace/specs/README.md)。

## 1. 状态口径

| 状态 | 含义 |
| --- | --- |
| `✅` | 已完成 |
| `🚧` | 已有产物，未完全收口 |
| `📅` | 已规划，尚未实施 |
| `📝` | 草案或方向 |
| `⏳` | 尚未开始 |
| `-` | 不适用 |

## 2. Step 与 Phase 的分工

1. `Step`
1.1 `Step` 表示主数据流中的一个环节。  
1.2 `Step` 负责回答“数据从哪里来，流到哪里去，当前走到哪一步”。  
1.3 交互、服务、展示等实现内容可以围绕 `Step` 展开，但不改变 `Step` 作为数据流节点的定义。

2. `Phase`
2.1 `Phase` 表示当前阶段允许把哪些 `Step` 做到什么程度。  
2.2 `Phase` 负责回答“当前阶段允许解锁什么、沉淀哪些规范、哪些实现可以进入 Skill”。  
2.3 一个 `Phase` 可以引用多个 `Step`，但不直接代替 `Step` 的进度表达。

3. 当前口径
3.1 `PROGRESS.md` 按 `Step` 组织。  
3.2 `phases/` 按 `Phase` 组织。  
3.3 `Phase` 通过表格中的 `Phase` 列引用对应 `Step`。

## 3. 文件流转

> 层级关系详见 [README.md](/README.md)。

| 内容 | 未确认 | 确认后 |
| --- | --- | --- |
| 计划 | `drafts/plans/` | 本文件同步状态 |
| 规范 | `drafts/specs/` | `skill/ai-trace/specs/` |
| 功能说明 | `drafts/plans/` | `skill/ai-trace/guides/` |
| 实现 | - | `skill/ai-trace/bin/`、`ui/`、`mock/` |

## 4. Step 能力链

> Phase 1（骨架收口）已完成归档，不再跟踪。当前按阶段分表展示 Step 数据流进度。

### 4.1 Phase 2

| Step | 能力 | 简述 | 依赖 | 计划 | 草案规范 | 稳定规范 | 后端 | 前端 | 数据 | Skill 同步 | 验收 | 关联文档 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 扫描发现 | 发现本地 Agent 实例与来源根 | 无 | `✅` | `-` | `✅` | `✅` | `✅` | `✅` | `✅` | `✅` | [scan_rules.md](/skill/ai-trace/specs/contracts/cli/scan_rules.md), [scan-register.md](/skill/ai-trace/guides/scan-register.md) |
| 2 | 候选生成 | 输出可注册候选与实例上下文 | 1 | `✅` | `-` | `✅` | `✅` | `✅` | `✅` | `✅` | `✅` | [candidate.md](/skill/ai-trace/specs/contracts/objects/candidate.md), [agent_candidates.json](/skill/ai-trace/mock/data/registry/agent_candidates.json) |
| 3 | 注册纳管 | 候选转 Agent Card，并合并待接入/已忽略/已注册状态 | 2 | `✅` | `-` | `✅` | `✅` | `✅` | `🚧` | `✅` | `🚧` | [card.md](/skill/ai-trace/specs/contracts/objects/card.md), [register_agent.py](/skill/ai-trace/bin/commands/register_agent.py) |
| 4 | 空间发现 | 识别本机一级空间与浅层上下文，并提供接入管理 | 1 | `✅` | `-` | `✅` | `✅` | `✅` | `🚧` | `✅` | `🚧` | [workspace_candidate.md](/skill/ai-trace/specs/contracts/objects/workspace_candidate.md), [space.md](/skill/ai-trace/specs/contracts/objects/space.md), [workspace-discovery.md](/skill/ai-trace/guides/workspace-discovery.md) |
| 5 | Phase 2 封装 | 同步 Scan/Register/Spaces 到 Skill 真身 | 1-4 | `✅` | `-` | `✅` | `✅` | `✅` | `✅` | `✅` | `🚧` | [SKILL.md](/skill/ai-trace/SKILL.md), [dashboard.md](/skill/ai-trace/specs/surfaces/dashboard.md) |

### 4.2 Phase 3

| Step | 能力 | 简述 | 依赖 | 计划 | 草案规范 | 稳定规范 | 后端 | 前端 | 数据 | Skill 同步 | 验收 | 关联文档 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 6 | 接入授权/登录 | 确认可读取会话源 | 3 | `📝` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [phase-plans.md](/drafts/plans/phase-plans.md) |
| 7 | 会话索引 | 建立已授权会话索引 | 6 | `📅` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [SESSION_INDEX_SPEC.md](/drafts/specs/flow/SESSION_INDEX_SPEC.md) |
| 8 | 标记识别 | 识别 bookmark/mark | 7 | `📅` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [BOOKMARK_RULE_SPEC.md](/drafts/specs/flow/BOOKMARK_RULE_SPEC.md) |
| 9 | 健康检查 | 检查路径、数据、服务 | 6-8 | `📝` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [phase-plans.md](/drafts/plans/phase-plans.md) |
| 10 | Phase 3 封装 | 同步 Index/Mark 到 Skill | 6-9 | `📝` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [SKILL.md](/skill/ai-trace/SKILL.md), [drafts/specs/flow/](/drafts/specs/flow/) |

### 4.3 Phase 4

| Step | 能力 | 简述 | 依赖 | 计划 | 草案规范 | 稳定规范 | 后端 | 前端 | 数据 | Skill 同步 | 验收 | 关联文档 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11 | 小循环 | 标记到候选与审核 | 8 | `📝` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [flow/SPEC.md](/drafts/specs/flow/SPEC.md) |
| 12 | 大循环 | 同步、审计、回流 | 11 | `📝` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [flow/SPEC.md](/drafts/specs/flow/SPEC.md), [CONTENT_MODEL_SPEC.md](/drafts/specs/content/CONTENT_MODEL_SPEC.md) |
| 13 | Phase 4 封装 | 同步闭环能力到 Skill | 11-12 | `📝` | `📝` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | `⏳` | [SKILL.md](/skill/ai-trace/SKILL.md), [drafts/specs/](/drafts/specs/) |

## 4.4 Step 4 口径补充

1. `space` 优先指本机一级文件夹。
2. Agent 内部自带的 `workspaces/` 结构，不等同于本机一级空间。
3. Phase 2 只要求空间的浅层识别与归属提示，不要求深层目录治理。
4. `Spaces` 已确认为独立一级菜单，与 `Agents` 并列，定位为空间契约层（供 AI Agent 协作参考）。
5. `Agents` 当前采用卡片工作台 + 右侧索引摘要抽屉；待接入候选统一收进弹窗。
6. 一级菜单最终结构：`Home / Spaces / Agents / Sessions / Settings`。
7. `Agents / Spaces` 侧栏数字只允许使用已接入事实；没有稳定统计时不展示。
8. Agent 卡片时间字段后续统一取真实 Agent 原生最近活动时间，不再使用扫描时间占位。

## 5. 阶段封装检查项

阶段封装不新增业务能力，只检查本阶段已完成 `Step` 是否同步到 Skill 交付层。详细检查项见 [phase-plans.md](/drafts/plans/phase-plans.md) 第 5 节。
