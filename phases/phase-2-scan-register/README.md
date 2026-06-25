# Phase 2 Folder: Scan / Register

> updated_at: 2026-06-24
> phase_status: planned
> model_status: current-proposed-5-phase-model
> folder_role: 本阶段目录入口

本目录用于承接 Phase 2 的阶段规划与模板。
所有涉及稳定规范的文件均已迁出到 `specs/` 体系。

- [PLAN.md](/phases/phase-2-scan-register/PLAN.md)
  当前阶段目标、任务、代码作用、前端能力、后端能力与 DoD。
- [ACCEPTANCE.md](/phases/phase-2-scan-register/ACCEPTANCE.md)
  当前阶段验收表，区分已完成、部分完成与未完成项目。
- [STATUS_REPORT.md](/phases/phase-2-scan-register/STATUS_REPORT.md)
  当前状态报告。
- [TEMPLATE.md](/phases/phase-2-scan-register/TEMPLATE.md)
  后续若补充扫描、注册相关的**阶段管理子文档**，可复用此模板。

## 相关核心规范 (已迁入 `specs/`)
- [scan_register.md](../../specs/capabilities/scan_register.md) (能力层)
- [scan_register.md](../../specs/flows/scan_register.md) (流程层)
- [dashboard.md](../../specs/surfaces/dashboard.md) (操作面层)
- [candidate.md](../../specs/contracts/objects/candidate.md) (契约层)
- [card.md](../../specs/contracts/objects/card.md) (契约层)
- [scan_rules.md](../../specs/contracts/cli/scan_rules.md) (契约层)
- [extract_rules.md](../../specs/contracts/cli/extract_rules.md) (契约层)

---

本阶段核心判断：

- 需要真实代码
- 代码作用是扫描本地 Agent、生成候选、完成注册映射
- 前端重点是 `Home / Agents`
- 后端重点是 `scan` 与注册结果落盘
- 私有结构化数据当前统一收口到 `~/.ai-trace/data/`
- 公开 Mock 结构化数据当前统一收口到 `mock/data/`
