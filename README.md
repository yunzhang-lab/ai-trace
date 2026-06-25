# ai-trace-open

> 多 Agent 协作信息治理与归一化系统公开仓。

## 1. 仓库作用

`ai-trace-open` 用于定义多 Agent 信息治理的公开规范、阶段路线、执行入口与脱敏 Mock 数据。

当前主轴：

`Scan -> Register -> Index -> Mark -> Extract -> Review -> Sync -> Audit`

公开仓不保存真实私有路径、密钥、原始日志或未脱敏会话。

## 2. 顶级目录

当前公开仓保持 7 个顶级目录：

1. `phases/`：路线图、阶段目标、计划、状态、验收。
2. `specs/`：已确认的字段、对象、能力与接口规范。
3. `drafts/`：未确认草案、提案与中间稿。
4. `discussions/`：讨论留痕、共识沉淀与归档。
5. `apps/`：CLI、H5 展示工作台与应用层代码。
6. `mock/`：公开结构化 Mock 数据与 Mock Agent 原生根。
7. `skill/`：未来单一 `ai-trace` Skill 交付落点。

## 3. 统一入口

1. 总入口：[README.md](/README.md)
2. 阶段入口：[phases/ROADMAP.md](/phases/ROADMAP.md)
3. 规范入口：[specs/README.md](/specs/README.md)
4. 后端入口：`python3 apps/cli/main.py <subcommand>`
5. 前端入口：[apps/dashboard/index.html](/apps/dashboard/index.html)

## 4. 层级关系

1. `phases/` 负责“什么时候做、做到哪里、是否验收”。
2. `specs/` 负责“稳定规范是什么”。
3. `drafts/templates/` 暂存尚未 Promote 的模板设想。
4. `drafts/` 负责“尚未确认的草案和磨合内容”。
5. `apps/cli/` 负责执行与落盘。
6. `apps/dashboard/` 负责展示与动作发起。
7. `mock/agent_roots/` 承接公开 Mock Agent 原生输入根。
8. `skill/ai-trace/` 承接未来可分发 Skill 包。

## 5. 私有区关系

真实治理数据默认位于 `~/.ai-trace/`。

当前只确认：

1. `~/.ai-trace/data/` 是私有结构化脚本产物根目录。
2. `mock/data/` 是公开 Mock 结构化数据根目录。
3. 私有目录按阶段增量解锁，不提前设计完整目录树。
