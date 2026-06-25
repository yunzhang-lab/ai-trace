# 模板回收草案

> updated_at: 2026-06-18  
> status: working-draft  
> scope: Phase 4+ objects

本文件用于接收从 `templates/` 打回草稿区的超前内容。

## 背景

当前已确认采用“流程优先”和“近细远粗”原则：

- Phase 2 / 3 只锁定 `Scan / Register / Index / Mark`
- `Project / Preference / Governance / Audit` 等对象的最终模板不应过早 Promote 到 `templates/`

因此，原先放在 `templates/` 的知识卡、画像域、治理域模板与虚构案例，统一退回草稿区，等待后续阶段再细化。

## 当前回收内容

### 知识卡模板草案

- `id`: `knowledge-xxx`
- `title`: 知识标题
- `category`: 分类
- `scope`: 公开 / 私有 / 待导入
- `source`: 来源说明
- `tags`: 标签
- `summary`: 简述

### 示例知识卡草案

- `id`: `knowledge-demo-001`
- `title`: 导入后可见的分类示例
- `category`: 项目 / 偏好 / 冲突 / 决策
- `scope`: 示例
- `source`: 仅示意，不含真实路径
- `summary`: 展示导入后如何按对象类型浏览知识

### 画像域模板说明草案

- 偏好（Preference）与教训（Lesson）的公开模板暂不发布。
- Phase 2 / 3 仅保留字段讨论，不形成正式模板目录。
- 真实偏好与原始教训继续只保留在私有区。

### 治理域模板说明草案

- `decision / conflict / audit` 只保留为后续对象模型方向。
- 当前阶段不发布正式公开模板。
- 审计记录的最终 JSON/YAML 结构待进入 Sync / Audit 阶段后再锁定。
