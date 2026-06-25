# 目标路线图

> 当前路线图按真实流程推进，而不是按抽象对象分类推进。  
> 当前系统主轴统一为：  
> `Scan -> Register -> Index -> Mark -> Extract -> Review -> Sync -> Audit`
>
> 说明：当前文中的 **5 阶段结构是建议版**，用于阶段确认讨论与后续 SPEC 收口。  
> 在用户最终确认前，应视为“当前推荐推进模型”，**不视为已经最终拍板**。

## 1. 路线图职责

本文件的职责不是提前设计完整系统，而是定义：

- 当前总目标
- 阶段推进顺序
- 每个阶段允许定义到什么精度
- 每个阶段才允许决定哪些目录、文件、格式与能力

一句话原则：

> **阶段是细节解锁器。**  
> 总纲只定义边界，路线图决定“什么时候才能把细节写下来”。

阶段目标与任务拆解见：

- [phase-1-foundation/README.md](/phases/phase-1-foundation/README.md)
- [phase-2-scan-register/README.md](/phases/phase-2-scan-register/README.md)
- [phase-3-index-mark/README.md](/phases/phase-3-index-mark/README.md)
- [phase-4-extract-review-sync-audit/README.md](/phases/phase-4-extract-review-sync-audit/README.md)
- [phase-5-promote-skill/README.md](/phases/phase-5-promote-skill/README.md)

当前按“每阶段一个文件夹”组织在 `phases/` 下；每个阶段内部包含 `README.md`、`PLAN.md`、`TEMPLATE.md`，需要验收的阶段补充 `ACCEPTANCE.md`。

## 2. 推进原则

| 原则 | 说明 |
| --- | --- |
| 流程优先 | 先锁定真实数据流，再决定目录、字段、前后端落点。 |
| 近细远粗 | 当前阶段与下一阶段写细、写准；中远期只保留方向与边界。 |
| 阶段解锁 | 目录、文件、载体、交互能力，只能在相邻阶段正式定义。 |
| 公开先行 | 公开仓先定义契约、代码骨架与展示入口，再反哺私有工作区。 |
| 双仓同阶段 | 公开仓与私有仓共用同一套阶段主轴，不各自再造独立路线。 |
| 私有增量落地 | 私有仓现在只定一级原则；具体目录和落点只在对应阶段增量定义。 |
| Skill 单体化 | 当前只规划一个 `ai-trace` Skill；Phase 5 再决定正式打包边界。 |
| 只读展示 | H5 负责展示与动作发起，不承担真相源职责。 |
| 定向提炼 | 不做全量全文提炼，只处理已授权且被标记的会话。 |

## 3. 当前总目标

`ai-trace-open` 当前目标不是统一所有对话，而是先定义一套面向多 Agent 的最小闭环：

1. 扫描本地 Agent
2. 生成注册候选
3. 建立 Agent Card 与私有路径映射
4. 只对已授权 Agent 建立会话索引
5. 只对已标记会话进入后续提炼

## 4. 全局只允许预设的内容

以下内容属于跨阶段稳定边界，可以在总纲中长期存在：

- 公开仓当前只承认 `phases / specs / drafts / discussions / apps / mock / skill` 7 个顶级根目录
- 公开仓不保存真实私有数据、敏感路径、原始会话原文
- 原始会话保留在各 Agent 原生目录
- H5 不是真相源
- 数据流采用“线性主干 + 受控分支 + 审计回流”
- 强结构对象优先按 `JSON / JSONL / SQLite / 轻数据库` 思路设计
- 语义沉淀内容优先按 `Markdown / Wiki` 思路设计

同时确认以下双仓与 Skill 口径：

- 公开仓与私有仓共用同一套 5 阶段主轴
- 公开仓负责定义系统总纲、阶段目标、稳定规范、展示口径与入口骨架
- 私有仓负责真实路径、真实数据、真实索引、真实队列与真实审计
- 私有仓一级原则可以先定义，但完整目录树不能提前设计
- Skill 能力按阶段解锁，当前保持单一 `ai-trace` Skill 方向

除此之外，不应在总纲中提前锁定更多目录、文件和实现细节。

## 5. 阶段解锁规则（按当前建议版）

### Phase 2 允许定义

- 扫描候选的输入输出
- 注册确认的输入输出
- Agent Card 最小字段
- 扫描命令入口
- H5 的 `Home / Agents` 展示与注册交互
- 私有区中与“注册、映射、队列”直接相关的最小落点
- `~/.ai-trace/data/` 作为结构化脚本产物一级根
- 公开仓 `mock/data/` 作为 Mock 结构化数据一级根
- 与 `Scan / Register` 直接相关的 `ai-trace` Skill 能力边界

### Phase 3 允许定义

- 会话索引最小字段
- Bookmark / Mark 最小规则
- Phase 3 所需的私有索引落点
- H5 的最小会话只读视图
- Mock / Real 数据切换方式
- 与 `Index / Mark` 直接相关的 `ai-trace` Skill 能力边界

### Phase 4 允许定义

- Candidate 结构
- Review / Sync / Audit 闭环
- 候选、同步、审计的私有目录结构
- H5 的审核、冲突、候选管理界面
- 与 `Extract / Review / Sync / Audit` 直接相关的 `ai-trace` Skill 能力边界

### Phase 5 允许定义

- 稳定模板 Promote 规则
- 迁移工具
- `ai-trace` Skill 正式封装与展示方式
- Skill 包中需要内置哪些代码、示例与规范引用

## 6. 当前建议阶段总表

| 阶段 | 精度 | 目标 | 允许解锁的内容 | 完成标准 |
| --- | --- | --- | --- | --- |
| **Phase 1：骨架收缩** | 已完成 | 根目录收缩并明确公私边界。 | 仓库顶层结构与入口口径。 | 仓库入口、讨论层、草稿层、代码层、展示层分离。 |
| **Phase 2：扫描与注册** | 极细 | 锁定 `Scan -> Register` 的输入输出。 | 候选字段、注册字段、Phase 2 私有落点、Home/Agents 交互。 | 能识别本地 Agent 根路径、工作区模式、会话源，并输出候选卡片。 |
| **Phase 3：索引与标记** | 极细 | 锁定 `Index -> Mark` 的最小字段与只读视图。 | Session Index、Bookmark Rule、Phase 3 私有索引落点、Wiki/Flow 最小视图。 | 能看到已授权 Agent 的会话列表、会话 ID、文件夹关联与标记状态。 |
| **Phase 4：提炼、审核、同步** | 中等 | 建立 `Extract -> Review -> Sync -> Audit` 闭环。 | Candidate、Sync、Audit 目录与状态流转。 | 至少跑通一条真实的“标记 -> 候选 -> 审核 -> 同步 -> 审计”链路。 |
| **Phase 5：模板 Promote 与 Skill 化** | 粗 | 将稳定规范 Promote 为正式模板，逐步封装 Skill。 | 稳定模板目录、迁移工具、Skill 正式封装。 | 只有进入稳定阶段的对象模板才允许建立正式模板落点。 |

补充说明：

- 当前表格描述的是建议采用的阶段切法与解锁边界
- “Phase 2 / Phase 3 写细，Phase 4 / Phase 5 保持方向性”这一精度原则已确认
- “是否正式按当前 5 阶段拍板”仍以后续阶段确认结果为准

## 7. Phase 2 当前边界

### 输入

- 本机已知 Agent 根路径，如 `~/.codex`、`~/.claude`、`~/.qwenpaw`
- 用户确认是否允许接入

### 输出

- `agent_candidates.json`
- `agents.json`
- Agent Card 草案字段

### Phase 2 当前一级落点

- 私有真实结构化数据统一进入 `~/.ai-trace/data/`
- 当前只正式解锁 `data/registry/` 与 `data/agents/`
- 公开仓 Mock 结构化数据统一进入 `mock/data/`

### 当前需要锁定的 SPEC

- [Agent Candidate](/specs/contracts/objects/candidate.md)
- [Agent Card](/specs/contracts/objects/card.md)
- [Dashboard Surface](/specs/surfaces/dashboard.md)

### 当前不解锁的内容

- 会话索引目录结构
- Bookmark 状态写入机制
- Candidate / Audit / Sync 复杂目录
- 本地 API 服务

## 8. Phase 3 当前边界

### 输入

- 已授权 `agents.json`
- 对应 Agent 的会话源数据

### 输出

- `session_index.json` 或等价的最小索引结构
- `bookmark` / `mark` 规则
- 只读会话详情数据源

### 当前需要锁定的 SPEC

- `Session Index`
- `Bookmark Rule`
- `Session Linkage`

### 当前默认判断

1. 第一版只提取最小会话元数据，不提取工具子命令和文件列表。
2. 第一版优先采用原始对话中的显式文本标签扫描，例如 `#bookmark`。
3. H5 第一版只读展示 `bookmark_state`，不承担人工翻转标记职责。
4. 第一版优先采用本地数据包注入方式，让 H5 在 Mock / Real 之间切换读取真实索引数据。

### 当前不解锁的内容

- 全文搜索工作台
- H5 手工修改标记状态
- 本地 API 动态注入
- 多会话自动归并

## 9. 当前不提前锁定的内容

以下内容统一保留方向，不作为近期阶段的正式定义：

- Project / Knowledge / Preference / Governance 最终模板
- 完整 `Flow / Wiki / Skills` 正式对象模型
- Skill 插件化细节
- 全自动化审核与同步策略
- 独立知识库/图库/向量库产品选型
- 独立数据库服务或专门中台能力

这些内容统一留在 `drafts/specs/` 或 `discussions/` 中继续讨论，待进入相邻阶段后再细化。
