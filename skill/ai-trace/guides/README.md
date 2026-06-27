# Skill Guides Hub (说明枢纽层)

> layer: guides
> scope: System Core

本目录是 `skill/ai-trace` 产品包内部所有说明文档的统一入口。
它负责解释已经落地的功能如何理解、如何使用、代码和规范分别在哪里。

## 目录索引

| 说明主题 | 说明 | 所属阶段 |
| --- | --- | --- |
| [scan-register](./scan-register.md) | 本地 Agent 探测与注册能力 | Phase 2 |
| [workspace-discovery](./workspace-discovery.md) | 工作区候选浅层扫描能力 | Phase 2 |
| `session-indexing` (占位) | 会话索引能力 | P3+ |
| `session-review` (占位) | 会话候选审核与状态扭转 | P3/P4+ |
| `skill-packager` (占位) | Skill 正式打包与发布能力 | P5+ |

---

**使用原则：**
- 当且仅当一项能力进入正式 `Phase` 且有了明确的 Code 和 Spec 落点后，才能在此处建立独立说明文件。
- 不在此处写大段的需求文档，只做映射与指路。
