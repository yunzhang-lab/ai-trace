# ai-trace-open

> 多 Agent 信息归一化系统的公开讨论仓库

这个仓库只放可公开讨论、可开源、可审阅的子集：

- `docs/`：系统规范、内容模型、Agent 规范、流程规范、对齐工作台
- `dashboards/`：H5 / 本地演示页

不放这些内容：

- 原始对话
- 私有项目文件
- 私有知识碎片
- 私有报告流水
- 私有身份 / 偏好 / 教训原件

## 核心目标

1. 说明内容如何设计和处理：
   - 原始日志如何粗加工、归并、提炼、审核、归档
   - 偏好、教训、知识、项目、决策、冲突如何分层

2. 说明后台和知识库如何配合：
   - H5 只发起动作，不直接改共享真相源
   - 规范文件默认公有，但除主控 Agent 外只读
   - Knowledge / Project / Audit / Conflict / Decision 的统一视图和审计链

## 入口

- `docs/INDEX.md`
- `docs/ALIGNMENT.md`
- `docs/AI_TRACE_SYSTEM.md`
- `docs/CONTENT_MODEL_SPEC.md`
- `docs/AGENT_SPEC.md`
- `docs/INFORMATION_FLOW_SPEC.md`

