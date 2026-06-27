# 目标路线图

> status: active
> updated_at: 2026-06-27
> main_flow: `Scan -> Register -> Index -> Mark -> Extract -> Review -> Sync -> Audit`

本文件只定义阶段顺序、边界和解锁规则。具体进度见 [PROGRESS.md](/PROGRESS.md)，未确认计划见 [drafts/plans/](/drafts/plans/)。

## 1. 推进原则

| 原则 | 说明 |
| --- | --- |
| 流程优先 | 先锁定真实数据流，再决定目录、字段、前后端落点。 |
| 近细远粗 | 当前阶段写细，中远期只保留方向。 |
| 阶段解锁 | 目录、文件、载体、交互能力按阶段增量确认。 |
| 公开先行 | 公开仓先定义契约、代码骨架与展示入口。 |
| Skill 随阶段增长 | 每个 Phase 末尾同步封装已完成能力，不单列最终 Skill 阶段。 |
| 只读展示 | H5 负责展示与动作发起，不承担真相源职责。 |

## 2. 全局边界

1. 公开仓只承认 `phases / drafts / discussions / agent_roots / skill` 5 个核心顶级目录。
1.1 根目录可保留 `README.md`、`PROGRESS.md`、`AGENTS.md` 等入口文件。
1.2 稳定规范内聚到 `skill/ai-trace/specs/`。
1.3 未确认计划进入 `drafts/plans/`。
1.4 未确认规范进入 `drafts/specs/`。

2. 公开仓不保存真实私有路径、密钥、原始日志或未脱敏会话。

3. 私有真实数据默认位于 `~/.ai-trace/`。
3.1 结构化脚本产物根：`~/.ai-trace/data/`
3.2 公开 Mock 数据根：`skill/ai-trace/mock/data/`

## 3. 阶段总表

| 阶段 | 目标 | 允许解锁 | 完成标准 |
| --- | --- | --- | --- |
| Phase 1：骨架收口 | 明确仓库结构与公私边界。 | 顶层结构、入口口径。 | 仓库入口、草稿层、讨论层、Skill 层分离。 |
| Phase 2：Scan / Register | 锁定 Agent 扫描、空间发现与注册。 | 候选字段、注册字段、空间字段、最小 API、`Home / Spaces / Agents`、Phase 2 Skill 同步。 | 能识别本地 Agent 与本机一级空间，并将 Scan/Register/Spaces 同步到 `skill/ai-trace`。 |
| Phase 3：Index / Mark | 建立接入确认、索引、标记和健康检查。 | 授权/登录、Session Index、Bookmark Rule、健康检查、Phase 3 Skill 同步。 | 能看到已授权 Agent 的会话列表、标记状态和基础健康状态。 |
| Phase 4：Extract / Review / Sync / Audit | 建立小循环与大循环。 | Candidate、Review、Sync、Audit、Phase 4 Skill 同步。 | 跑通标记到审核的小循环，以及同步、审计、回流的大循环。 |

## 4. 解锁规则

1. Phase 2 只解锁：
1.1 扫描发现与候选生成
1.2 注册确认与 Agent Card 写盘
1.3 本机一级空间的浅层发现与归属提示
1.4 `Home / Spaces / Agents` 的 H5 展示与注册交互
1.5 最小本地 API 与 `Live / Mock` 数据回退
1.6 `~/.ai-trace/data/registry` 与 Mock 同构数据
1.7 Scan/Register/Spaces 的阶段封装

2. Phase 3 只解锁：
2.1 接入授权/登录确认
2.2 会话索引最小字段
2.3 Bookmark / Mark 最小规则
2.4 最小会话只读视图
2.5 路径、数据、服务健康检查
2.6 Index/Mark 的阶段封装

3. Phase 4 只解锁：
3.1 Candidate 结构
3.2 Review / Sync / Audit 状态流
3.3 审核、冲突、候选管理界面
3.4 小循环与大循环闭环
3.5 闭环能力的阶段封装

## 5. 不提前锁定

1. Project / Knowledge / Preference / Governance 最终模板。
2. 完整 `Flow / Wiki / Skills` 正式对象模型。
3. Skill 插件化细节。
4. 全自动审核与同步策略。
5. 独立数据库、中台、知识库或向量库选型。
