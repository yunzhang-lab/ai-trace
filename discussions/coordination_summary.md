# Agent 协作讨论与对齐共识总结

> updated_at: 2026-06-18  
> status: approved  
> participants: [Antigravity, Codex, Human]
> location: `discussions/coordination_summary.md`  
> readers: Antigravity (IDE), Codex (CLI), Claude Code, Humans

本文档用于记录当前已达成的最新共识。  
当前共识已经从“角色优先”切换为“流程优先”，并正式采用“近细远粗”的阶段精度原则。

若与其他草稿或补充版本冲突，当前以 `README.md` 的用户确认口径为准。

## 1. 当前总目标

`ai-trace-open` 当前阶段的目标，不是统一所有对话，也不是提前发布完整对象模板，而是先定义一套真实数据流闭环：

`Scan -> Register -> Index -> Mark -> Extract -> Review -> Sync -> Audit`

公开仓承担：

- 流程契约
- 草稿规范
- CLI 骨架
- H5 展示与占位入口

私有区承担：

- 真实 Agent 根路径
- 真实会话数据
- 真实候选与审计记录

## 2. 当前已确认的约束

1. 公开仓不保存真实私有数据、敏感路径、会话原文。
2. 不做全量全文提炼，只处理已授权且被标记的会话。
3. 当前阶段先围绕 `Scan / Register / Index / Mark` 收口。
4. `Extract / Review / Sync / Audit` 保留为后续阶段方向，不提前锁定最终模板。
5. `templates/` 当前保持极简，不承载超前的 `work / profile / governance` 正式模板。

## 3. 用户新确认的系统裁决

以下内容已由用户后续明确确认，当前应视为高于旧草稿的裁决口径：

1. 数据流采用“**线性主干 + 受控分支 + 审计回流**”，不是完全直线，也不是自由分叉。
2. 文档不允许提前写死过细的远期实现、目录、算法或对象模板；只有流程所必需的边界和规范允许先定义。
3. 前后端代码能力必须随阶段推进，不需要现在定义，也不能现在定义；当前允许先定义规范，不允许借规范之名提前锁死代码能力。

## 4. 当前目录共识

当前公开仓只承认以下 6 个根目录：

1. `phases/`
2. `specs/`
3. `drafts/`
4. `discussions/`
5. `apps/`
6. `mock/`

其中：

- `phases/` 是阶段推进区
- `specs/` 是稳定规范区
- `drafts/` 是草稿规范区
- `discussions/` 是讨论留痕区
- `apps/` 是应用层代码区
- `mock/` 是公开 Mock 数据与 Mock Agent 输入根

## 5. 当前阶段精度原则

已确认采用：

> 越近的阶段，要求越精准；越远的阶段，只保留方向与边界。

这意味着：

- Phase 2 / Phase 3 要锁定输入输出、字段、DoD
- Phase 4 / Phase 5 只保留方向，不提前设计完整对象体系
- 规范可以先行，但代码能力不提前承诺
- 远期内容可以保留方向，但不能过细

## 6. 当前阶段重点

### Phase 2

- 扫描本地 Agent
- 生成 `agent_candidates.json`
- 用户确认注册
- 建立 `agents.json` 与 Agent Card

### Phase 3

- 仅对已授权 Agent 建立会话索引
- 定义最小 `Session Index`
- 建立简单 `Bookmark / Mark` 规则
- H5 提供只读列表与详情视图

## 7. 当前前后端共识

当前不再先写死角色分工，而是按流程反推能力分层：

- 脚本层：扫描、注册候选、索引、提炼、同步、审计
- 前端层：展示、注册管理、列表详情、审核动作入口
- 规范层：定义字段、状态、边界和落点
- 人工层：授权、审核、裁决、确认升级

并补充两条当前确认：

- 强结构、强筛选、强状态流转的数据，优先按 JSON / JSONL / SQLite / 轻数据库思路设计。
- 需要人工阅读、链接、沉淀语义的内容，优先按 Markdown / Wiki 思路设计。

## 8. 当前已确认的即时动作

1. 将 `templates/` 中超前模板打回 `drafts/specs/`
2. 更新 `phases/ROADMAP.md` 为流程优先与近细远粗口径
3. 更新 `drafts/alignment_proposal.md`，移除旧目录落点
4. 更新 H5，优先点亮 `Home` 与 `Agents`
5. 启动 `python3 apps/cli/main.py scan` 的实现
