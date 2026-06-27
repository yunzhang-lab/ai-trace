# specs

> status: active
> updated_at: 2026-06-27

`specs/` 是系统的实际交付规范层，并且当前作为 `skill/ai-trace` 的正式随包分发内容存在。这里不按领域对象分类，而是按系统表达层严格划分为 4 个维度，确保能力归能力、契约归契约、流程归流程、界面归界面。

## 1. 核心分层设计

### 1.1 `guides/` (说明层)
定义系统有哪些核心能力，及其准入边界。
- **职责**：说明某项能力（如扫描、注册）“是什么、不是什么”。
- **产物形态**：散文式的 `*.md`，说明设计原则与边界。

### 1.2 `contracts/` (契约层)
定义系统所有强一致性的输入输出契约。
- **职责**：字段 Schema、CLI 命令行入参、数据源路径映射约定。
- **产物形态**：嵌入标准 JSON Schema 的 `*.md` 或单独的 `.json` 文件。
- **示例**：
  - [candidate.md](./contracts/objects/candidate.md)
  - [card.md](./contracts/objects/card.md)
  - [space.md](./contracts/objects/space.md)
  - [intake_state.md](./contracts/objects/intake_state.md)
  - [scan_rules.md](./contracts/cli/scan_rules.md)
  - [extract_rules.md](./contracts/cli/extract_rules.md)

### 1.3 `flows/` (流程层)
定义状态的流转与执行时序。
- **职责**：动作的先后顺序、状态机转移路径（如 `Scan -> Register`）。
- **产物形态**：包含 Mermaid 图的 `*.md` 或单独的流转图定义。
- **示例**：[scan_register.md](./flows/scan_register.md)

### 1.4 `surfaces/` (操作面层)
定义系统能力如何向上层（人/Agent）透出。
- **职责**：前端 H5 的一级菜单与按钮、CLI 总体使用手册、单一 Skill 的暴露边界。
- **产物形态**：UI/UX 指南、功能开启清单等 `*.md`。
- **示例**：[dashboard.md](./surfaces/dashboard.md)

---

## 2. 与其他目录的配合关系

1. **与 `phases/` 的配合**：
   - `phases/` 回答：“当前阶段允许解锁哪些能力？”
   - `PROGRESS.md` 回答：“具体子能力做到哪里？是否验收？”
   - `specs/` 回答：“注册能力长什么样？字段是什么？”
2. **与 `drafts/` 的配合**：
   - 未确认计划进入 `drafts/plans/`。
   - 未确认规范进入 `drafts/specs/`。
3. **与 `skill/ai-trace` 的配合**：
   - `skill/ai-trace/bin/` 与 `skill/ai-trace/ui/` 严格遵循 `specs/` 的定义进行编码实现。
4. **与 `SKILL.md` 的配合**：
   - `skill/ai-trace/SKILL.md` 负责给 Agent 暴露入口与阶段边界。
   - `skill/ai-trace/specs/` 负责随 Skill 一起分发稳定规范本体，而不是仅作为外部引用。

---

## 3. 私有仓与公开仓数据镜像规范

1. **私有真实数据根**：`~/.ai-trace/data/`
2. **Skill 自带 Mock 数据根**：`skill/ai-trace/mock/data/`
3. 从 `data/` 以下保持同构，例如：
   - 私有：`~/.ai-trace/data/registry/agent_candidates.json`
   - 公开：`skill/ai-trace/mock/data/registry/agent_candidates.json`
