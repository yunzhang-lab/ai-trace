# 多 Agent 信息归一化系统规范

> updated_at: 2026-05-24  
> status: discussion-draft  
> root: `/Users/fengye/.ai-trace`

这组文档用于讨论和落地多 Agent 长期协作的信息治理机制。目标不是“存更多记忆”，而是让记忆、项目、偏好、教训、冲突和人工操作都做到：

- 可持续
- 可溯源
- 可审计
- 可进化

## 文档结构

建议保留 5 个 Markdown 作为长期主规范：

1. `AI_TRACE_SYSTEM.md`
   系统目标、总架构、共享真相源和目录边界。

2. `CONTENT_MODEL_SPEC.md`
   9 类内容对象、基础字段、公私归属、命名与存储格式。

3. `AGENT_SPEC.md`
   Agent 类型、注册流程、权限边界、启动和退出动作。

4. `INFORMATION_FLOW_SPEC.md`
   原始输入如何提炼、脱敏、去重、冲突检查、进入审核和共享。

5. `SKILL.md`
   给 Agent 读的动作手册，只写启动读什么、写哪里、禁止什么、如何交接。

## 辅助文件

- `MULTI_AGENT_WIKI_SPEC.md`
  仅作为旧版索引和讨论入口，不再承载主规范正文。
- `ALIGNMENT.md`
  单文件对齐工作台。后续你输出场景，我先在这个文件里判断是否明确，再逐步把结论收敛进正式规范。

## 推荐目录

```text
.ai-trace/
  docs/
    INDEX.md
    ALIGNMENT.md
    AI_TRACE_SYSTEM.md
    CONTENT_MODEL_SPEC.md
    AGENT_SPEC.md
    INFORMATION_FLOW_SPEC.md
    SKILL.md
  registry/
  agents/
  candidates/
  sync/
    queue/
    approved/
    rejected/
    private/
  conflicts/
  audit/
  handoff/
  archive/
  knowledge/
  skills/
  dashboards/
```

## 本轮待讨论问题

- `approved` 是否单独作为目录，还是按内容类型回写到 `projects/`、`knowledge/`、`lessons/` 等目录。
- `Manifest` 是一个全局文件，还是每类对象各自有 Manifest。
- H5 操作是否允许直接写文件，还是先生成 patch / action log 由主控 Agent 执行。
- Audit 是否需要支持真实回滚，还是 v1 只保留 before/after hash 和 superseded 链路。
