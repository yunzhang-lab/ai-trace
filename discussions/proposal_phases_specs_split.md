# 建议讨论：拆分 `phases/` 与 `specs/`

> created_at: 2026-06-24
> status: proposal

## 1. 建立两个一级目录

建议新增两个顶级目录：

```text
phases/
specs/
```

`phases/` 负责阶段推进过程：

```text
phases/ROADMAP.md
phases/phase-1-foundation/
phases/phase-2-scan-register/
...
```

每个阶段只保留：

```text
README.md
PLAN.md
STATUS_REPORT.md
ACCEPTANCE.md
```

`specs/` 负责实际交付规范：

```text
specs/
  data/
  frontend/
  backend/
  agents/
  content/
```

## 2. `specs/` 划分是否合理

当前划分基本合理，但建议先保持克制，不要过早拆太细。

- `data/`：JSON、registry、candidate、card、index 等结构化数据
- `frontend/`：H5 菜单、阶段能力、视觉状态
- `backend/`：CLI 命令、脚本输入输出、执行边界
- `agents/`：Codex、Claude、QwenPaw、Antigravity 接入规则
- `content/`：Markdown / Wiki / 后续提炼内容规范

## 3. Phase 2 哪些应进入 `specs/`

Phase 2 中已经稳定的内容应迁入 `specs/`：

```text
specs/data/AGENT_CANDIDATE_SPEC.md
specs/data/AGENT_CARD_SPEC.md
specs/backend/CLI_SCAN_REGISTER_SPEC.md
specs/frontend/H5_PHASE_CAPABILITY_SPEC.md
specs/agents/AGENT_DISCOVERY_SPEC.md
```

Phase 2 目录只保留阶段过程，不再承载字段规范、前端能力规范、脚本规范。

## 4. 哪些讨论可以关闭

可关闭或归档：

- 阶段目录是否需要每阶段文件夹
- `~/.ai-trace/data/` 是否作为结构化数据根
- `mock/data/` 是否作为公开 mock 根
- `apps/dashboard/data` 是否保留
- Phase 2 是否需要验收表
- `ALIGNMENT.md` 是否继续承载大而全设计

仍需继续讨论：

- `phases/` 和 `specs/` 是否立即升为顶级目录
- `specs/` 最终分类
- Phase 2 Real 模式是否进入验收
- 超阶段代码如何标记与封存
