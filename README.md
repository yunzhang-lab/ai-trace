# ai-trace-open

> 多 Agent 协作信息治理与归一化系统公开仓。

## 1. 仓库作用

`ai-trace-open` 用于定义多 Agent 信息治理的公开规范、阶段路线、执行入口与脱敏 Mock 数据。

当前主轴：

`Scan -> Register -> Index -> Mark -> Extract -> Review -> Sync -> Audit`

公开仓不保存真实私有路径、密钥、原始日志或未脱敏会话。

## 2. 顶级目录

当前公开仓保持 5 个核心顶级目录：

1. `phases/`：阶段定义、阶段边界、解锁规则。
2. `drafts/`：未确认计划、规范草案、提案与中间稿。
3. `discussions/`：讨论留痕、共识沉淀与归档。
4. `agent_roots/`：公开 Mock Agent 原生根案例。
5. `skill/`：单一 `ai-trace` Skill 运行与交付真身。

## 3. 统一入口

1. 总入口：[README.md](/README.md)
2. 进度入口：[PROGRESS.md](/PROGRESS.md)
3. 阶段入口：[phases/ROADMAP.md](/phases/ROADMAP.md)
4. 草案计划入口：[drafts/plans/](/drafts/plans/)
5. Skill 说明入口：[skill/ai-trace/guides/README.md](/skill/ai-trace/guides/README.md)
6. Skill 规范入口：[skill/ai-trace/specs/README.md](/skill/ai-trace/specs/README.md)
7. 后端入口：`python3 skill/ai-trace/bin/main.py <subcommand>`
8. 前端入口：[skill/ai-trace/ui/index.html](/skill/ai-trace/ui/index.html)

## 4. 层级关系

1. `PROGRESS.md` 负责“Step 数据流当前做到哪里”。
2. `phases/` 负责“Phase 阶段边界、阶段顺序、解锁规则，以及每个阶段引用哪些 Step”。
3. `drafts/plans/` 负责“未确认计划和阶段执行草案”。
4. `drafts/specs/` 负责“未确认规范草案”。
5. `skill/ai-trace/guides/` 负责“已实现能力的说明、使用方式与当前边界”。
6. `skill/ai-trace/specs/` 负责“已确认、可开发、随 Skill 分发的稳定规范”。
7. `skill/ai-trace/bin/` 负责执行与落盘。
8. `skill/ai-trace/ui/` 负责展示与动作发起。
9. `agent_roots/` 承接公开 Mock Agent 原生输入根案例。

## 5. 私有区关系

真实治理数据默认位于 `~/.ai-trace/`。

当前只确认：

1. `~/.ai-trace/data/` 是私有结构化脚本产物根目录。
2. `skill/ai-trace/mock/data/` 是随 Skill 分发的公开 Mock 结构化数据根目录。
3. 私有目录按阶段增量解锁，不提前设计完整目录树。
