# Phase Plan Drafts

> status: draft
> updated_at: 2026-06-27
> purpose: 阶段计划草案归口

本文件承接未确认阶段计划。这里的内容不是稳定规范；确认进入开发后，应拆入 `skill/ai-trace/specs/`、`skill/ai-trace/guides/`、`skill/ai-trace/bin/`、`skill/ai-trace/ui/` 或 `skill/ai-trace/mock/`，并同步 [PROGRESS.md](/PROGRESS.md)。

## 1. Phase 1：骨架收口

1. 目标：
1.1 收口公开仓顶层结构
1.2 明确公私边界
1.3 固定总入口、阶段入口与 Skill 入口

2. 当前状态：
2.1 已完成
2.2 后续不再作为活跃计划展开

## 2. Phase 2：Scan / Register

1. 目标：
1.1 发现本机已有 Agent
1.2 生成候选列表
1.3 完成注册确认与映射
1.4 同步 Scan/Register 到 `skill/ai-trace`

2. Step：
2.1 扫描发现
2.2 候选生成
2.3 注册纳管
2.4 工作区发现
2.5 Phase 2 封装

3. 空间口径补充：
3.1 当前所说的 `space` 优先指本机一级文件夹，用于统一管理内容归属与协作路由。
3.2 Phase 2 先做到识别一级空间，并为 Agent 提供“内容应进入哪个一级空间”的最小判断。
3.3 更深层目录可视为 `subspace` 或进阶空间，暂不要求在 Phase 2 完成完整理解与管理。
3.4 Agent 内部自带的 `workspaces/` 结构，与本机一级空间不是同一概念；前者属于产品内部实例来源，后者属于本机协作空间。

4. 当前未完全验收：
4.1 Scan -> Register 默认真实闭环
4.2 注册确认字段完整入库
4.3 接口失败场景与错误语义
4.4 `SKILL.md` 暴露口径与实际能力完全对齐

## 3. Phase 3：Index / Mark

1. 目标：
1.1 确认已注册 Agent 是否可读取会话源
1.2 为已授权 Agent 建立最小会话索引
1.3 识别显式标签，例如 `#bookmark`
1.4 建立路径、数据、服务健康检查
1.5 同步 Index/Mark 到 `skill/ai-trace`

2. Step：
2.1 接入授权/登录
2.2 会话索引
2.3 标记识别
2.4 健康检查
2.5 Phase 3 封装

3. 暂不做：
3.1 全文搜索工作台
3.2 H5 手工修改标记状态
3.3 多会话自动归并

## 4. Phase 4：Extract / Review / Sync / Audit

1. 目标：
1.1 已标记会话形成候选并进入审核
1.2 审核结果进入同步和审计链
1.3 同步闭环能力到 `skill/ai-trace`

2. Step：
2.1 小循环：标记到候选与审核
2.2 大循环：同步、审计、回流
2.3 Phase 4 封装

3. 暂不做：
3.1 全自动同步
3.2 大规模知识库产品化
3.3 独立插件化发布策略

## 5. 阶段封装规则

阶段封装不是独立大阶段。每个 Phase 末尾都检查并同步：

1. 稳定规范是否进入 `skill/ai-trace/specs/`
2. 功能说明是否进入 `skill/ai-trace/guides/`
3. 后端是否进入 `skill/ai-trace/bin/`
4. 前端是否进入 `skill/ai-trace/ui/`
5. Mock 是否进入 `skill/ai-trace/mock/`
6. `SKILL.md` 是否暴露当前阶段能力
