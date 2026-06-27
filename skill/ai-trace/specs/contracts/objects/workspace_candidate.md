# Workspace Candidate Contract

> status: approved
> updated_at: 2026-06-25
> layer: contracts/objects

`Workspace Candidate` (工作区候选) 是系统在 **Phase 2** 扩展的最小工作区发现边界。
它仅仅代表通过浅层扫描或目录遍历发现的“可能存在 Agent 痕迹”的项目文件夹，**不对会话内容、索引长度等做深入分析**。

---

## 1. 数据契约 (JSON Schema)

详见独立文件：[workspace_candidate.schema.json](./workspace_candidate.schema.json)

### JSON 示例

```json
{
  "workspace_id": "ws-1a2b3c",
  "agent_id": "codex",
  "workspace_name": "ai-trace-open",
  "workspace_path_masked": "~/Projects/code/ai-trace-open",
  "status": "candidate",
  "detected_markers": ["~/.codex/sessions/ai-trace-open"]
}
```

---

## 2. 存储与流转契约

| 数据类型 | 路径 |
| --- | --- |
| Mock 汇总列表（开源） | `skill/ai-trace/mock/data/registry/workspace_candidates.json` |
| 真实数据列表（私有） | `~/.ai-trace/data/registry/workspace_candidates.json` |

在 Phase 2，该列表主要作为实例上下文与来源辅助对象，服务 `Agents` 注册确认与后续空间归属判断。
它不承担已注册事实，也不承担 `Spaces` 声明事实。
