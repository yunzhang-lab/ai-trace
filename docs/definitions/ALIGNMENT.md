# 对齐工作台

> updated_at: 2026-05-24
> status: working-draft
> purpose: 把所有待对齐内容放在一个文件里逐步确认，避免在多个规范文件之间来回跳转

## 菜单

- [1. 内容总表](#1-内容总表)
- [2. 流程](#2-流程)
- [3. 附录](#3-附录)

## 1. 内容总表

### 1.1 体系与范围

| 项目 | 类型 | 范围 | 状态 | 是否确认 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 目标 | 体系目标 | 全局 | confirmed | 是 | 解决多 Agent 协作中的信息不一致 |
| 原则 | 体系原则 | 全局 | confirmed | 是 | 可持续、可溯源、可审计、可进化 |
| 真相源 | 存储原则 | shared | confirmed | 是 | `~/.ai-trace` 作为共享真相源 |
| 视图层 | 视图原则 | shared | confirmed | 是 | Obsidian / H5 读同一底层文件 |
| 规范文件 | 规则对象 | shared | confirmed | 是 | `SPEC` 默认公有；除主控 Agent 外只读 |
| `scope` | 元字段 | private/shared/hybrid | confirmed | 是 | 说明存放范围，不等于内容类型 |
| `status` | 元字段 | draft/candidate/approved/rejected/resolved/archived | confirmed | 是 | 说明对象生命周期阶段 |
| 流转链 | 对象链路 | private -> shared | confirmed | 是 | `lesson` 原始记录提炼为 `knowledge`，不单独维护公有 `lesson` 层 |
| 原始日志 | 输入来源 | private | confirmed | 是 | 原始对话、工具输出、会话记录先留私有区 |

### 1.2 内容总表

| 一级域 | 对象类型 | 说明 | 默认范围 | 是否确认 | 备注 |
| --- | --- | --- | --- | --- | --- |
| `profile/` | `preference` | 用户偏好、输出偏好、工具偏好 | hybrid | 是 | 可筛选 |
| `profile/` | `lesson` | 原始教训记录、踩坑片段 | private | 是 | 提炼后进 `knowledge` |
| `profile/` | `soul` | Agent 自我模型与身份姿态 | private | 是 | 仅私有 |
| `work/` | `project` | 项目信息、状态、规范 | shared | 是 | 项目公有 |
| `work/` | `knowledge` | 可复用知识、方法论、规则 | shared | 是 | 知识公有 |
| `governance/` | `decision` | 已确认决策 | shared | 是 | 保留裁决链 |
| `governance/` | `conflict` | 待裁决冲突 | shared | 是 | 保留判例 |
| `governance/` | `audit` | 操作审计记录 | shared | 是 | 追加式变更流 |
| `runtime/` | `agent` | Agent 注册与卡片 | private + shared | 是 | 共享保留卡片 |
| `runtime/` | `status` | Agent / Project 当前状态 | shared | 是 | 运行快照 |
| `runtime/` | `handoff` | 交接摘要 | private + shared | 是 | 项目可引用 |
| `runtime/` | `registry` | 注册与索引 | shared | 是 | 统一入口 |

### 1.3 字段约定

| 字段 | 取值 | 说明 | 是否确认 |
| --- | --- | --- | --- |
| `scope` | `private` / `shared` / `hybrid` | 存放范围 | 是 |
| `status` | `draft` / `candidate` / `approved` / `rejected` / `resolved` / `merged` / `archived` | 生命周期 | 是 |
| `type` | 上述对象类型集合 | 对象类别 | 是 |
| `object_id` | 唯一对象标识 | candidate / stable object 的唯一 ID | 是 |
| `source_session_id` | 会话标识 | 来源对话 | 是 |
| `source_message_ref` | 消息定位 | 来源片段 | 是 |
| `merged_from` | 源对象列表 | 归并来源 ID 列表 | 是 |
| `trace_chain` | 溯源链 | raw -> candidate -> merged/approved | 是 |

### 1.4 Agent 分层

| 类型 | 代表 | 权限边界 | 说明 | 是否确认 |
| --- | --- | --- | --- | --- |
| 主控型 | QwenPaw | 可读写、审核、裁决、回滚 | 长期记忆与控制塔维护 | 是 |
| 执行型 | Codex | 可写 candidate / handoff，不可直接写 approved | 负责实现与验证 | 是 |
| 分析型 | Claude Code | 可提炼建议，不可裁决 | 负责分析与整理 | 是 |
| 临时工具型 | 专项任务处理器 | 只读最小上下文，原则上不可写共享区 | 只做单任务 | 是 |

## 2. 流程

### 2.1 原始日志处理

| 步骤 | 输入 | 输出 | 说明 | 是否确认 |
| --- | --- | --- | --- | --- |
| 1. 采集 | 原始对话、工具输出、会话记录 | `raw log` | 先留私有区 | 是 |
| 2. 提取 | `raw log` | `candidate` | 抽出偏好、教训、知识、项目、决策、冲突 | 是 |
| 3. 归并 | 单次对话候选 | 单对话草稿 | 去重、补字段、统一命名 | 是 |
| 4. 跨对话合并 | 多次对话草稿 | 稳定对象 | 保留来源引用 | 是 |
| 5. 审核 | 稳定对象 | `approved` / `rejected` / `private` / `resolved` | 审核时必须追加 audit，写明人、时间、前后状态 | 是 |
| 6. 归档 | 被替代内容 | `archived` / `merged` | 保留历史；被合并对象标记 `merged` 或 `archived` | 是 |

### 2.2 两段对话如何提炼

| 场景 | 处理方式 | 产物 | 说明 | 是否确认 |
| --- | --- | --- | --- | --- |
| 同主题重复出现 | 比对来源后抽取共同结论 | `merged object` | 差异保留引用 | 是 |
| 同一事项判断不同 | 记录为冲突或候选冲突 | `conflict` / `decision candidate` | 不直接覆盖 | 是 |
| 一早一晚版本不同 | 按最新人工确认或最新 approved | 稳定对象更新版 | 旧版保留 `superseded` / `archived` | 是 |
| 原始观察 + 提炼结论 | 原始观察留私有，结论进共享 | `knowledge` / `preference` | 结论要能回到原片段 | 是 |
| 多个 candidate 归并成稳定对象 | 原始 candidate 标记 `merged` / `archived`，新对象记 `merged_from` | 稳定对象 + 溯源链 | 归并也写 audit | 是 |

### 2.3 粗加工原则

| 层级 | 目标 | 处理强度 | 产物 | 说明 | 是否确认 |
| --- | --- | --- | --- | --- | --- |
| `raw` | 保留原样 | 不加工 | 原始日志 | 原样保留 | 是 |
| `indexed` | 方便索引和回溯 | 粗加工 | 粗归并对象 | 剔杂项、补最小字段、留来源 | 是 |
| `curated` | 进入共享真相源 | 轻加工 | 稳定对象 | 保留可继承内容 | 是 |

粗加工只做这几件事：

- 去掉明显噪声和重复片段。
- 合并同一主题的分散片段。
- 保留原始来源，不做不可逆压缩。
- 不确定的地方保留回溯入口，回到原文再看。

### 2.4 周报机制

| 项目 | 来源 | 产物 | 说明 | 是否确认 |
| --- | --- | --- | --- | --- |
| 日摘要 | `audit log` / `raw log` | `daily digest` | 可选 | 否 |
| 周报 | `audit log` / `project status` / `approved objects` | `weekly report` | 建议保留 | 是 |
| 回看入口 | 周报引用 | 原始日志链接 | 可回原文 | 是 |

周报建议固定包含：

- 本周完成了什么。
- 偏好是否更新。
- 知识是否提炼。
- 冲突是否解决。
- 项目是否卡住。
- 下周做什么。

周报不是新的真相源，只是对已存在对象的汇总视图。

### 2.5 H5 Action

| 动作 | 输入 | 结果 | 说明 | 是否确认 |
| --- | --- | --- | --- | --- |
| H5 点击 `approve` / `reject` / `resolve` / `merge` / `archive` | 目标对象 + 操作意图 | `action json` 或本地动作事件 | H5 不直接改底层 Markdown，而是先生成动作请求 | 是 |
| 主控 Agent 执行动作 | `action json` / 动作事件 | 文件移动、状态修改、audit 追加 | 由主控或本地服务实际落盘，保证可审计 | 是 |
| 操作回执 | 执行结果 | H5 刷新状态 | 前端只展示执行结果和新状态，不承载最终真相 | 是 |

H5 的职责是“发起动作 + 展示结果”，不是直接改写共享真相源。

## 3. 附录

### A. 原始需求

| 项目 | 内容 |
| --- | --- |
| 场景 | 多 Agent 在同一台电脑上协作，需要把原始对话、偏好、知识、教训、项目、决策、冲突和审计统一管理 |
| 核心矛盾 | 同一 Agent 跨对话会变、不同 Agent 的认知不一致、H5 人工操作后状态可能不同步 |
| 目标 | 让内容可持续、可溯源、可审计、可进化 |
| 约束 | 原始日志不直接入共享区，敏感信息不进入共享真相源 |
| 视图诉求 | 希望有一个像办公室一样的 H5 / Wiki，可看到 Agent 在做什么，也可看到项目、同步、冲突和记忆筛选 |

### B. 现有分类目标

| 类型 | 目标 | 是否进入共享区 |
| --- | --- | --- |
| `Preference` | 管理偏好并可筛选 | 是 |
| `Lesson` | 原始教训记录，提炼后进入 `Knowledge` | 主要私有，提炼结果进入共享知识 |
| `Project` | 统一项目状态和真实路径指针 | 是 |
| `Knowledge` | 维护可复用知识和复核信息 | 是 |
| `Decision` | 保留已确认决策和裁决链 | 是 |
| `Conflict` | 保留冲突与处理结果 | 是 |
| `Audit` | 保留关键操作审计记录 | 是 |
| `Status` | 保留 Agent / Project 当前状态快照 | 是 |
| `Agent` / `SOUL` | 识别 Agent 及其身份模型 | 主要在私有区，公有只保留卡片或状态 | 部分 |

### C. 附录用途

附录用于保留原始需求语义和分类目标，方便后续审计：

- 判断压缩后的结论有没有丢边界。
- 判断分类是否覆盖原始需求。
- 判断正式规范是否需要继续收敛或补项。
- 作为其他 AI 审计时的参考基线。

### D. 给其他 AI 的审计提示词

```text
请审计 `/Users/fengye/Projects/code/ai-trace-open/docs/definitions/ALIGNMENT.md` 这份多 Agent 信息归一化对齐稿，重点检查它是否完整覆盖原始需求与现有分类目标：原始需求是多 Agent 在同一台电脑上协作，需要统一管理原始对话、偏好、知识、教训、项目、决策、冲突和审计，并希望有一个像办公室一样的 H5 / Wiki 能看到 Agent 在做什么、项目状态、同步、冲突和记忆筛选；现有分类目标是把内容归类为 `Preference / Lesson / Project / Knowledge / Decision / Conflict / Audit / Status / Agent / SOUL`，并讨论哪些进入共享区、哪些保留私有、哪些需要粗加工、提炼、归并和审计。审计时请同时参考主体与附录，重点指出是否存在遗漏、过度压缩、概念混淆、分类不完整、公私归属不清、原始日志提炼链不自洽、两段对话归并规则不完整、审计/周报/回溯不清，以及规范文件是否应默认放公有层供所有 Agent 读取；请优先给出可执行的修改建议，而不是只做摘要。
```
