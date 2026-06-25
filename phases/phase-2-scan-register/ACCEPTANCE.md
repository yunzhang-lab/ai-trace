# Phase 2 Acceptance: Scan / Register

> updated_at: 2026-06-23
> phase_status: in-review
> verdict: not-yet-complete

## 1. 验收规则

1. 本文件只负责回答一件事：
1.1 Phase 2 是否已经达到可验收状态

2. 状态口径统一为：
2.1 `done` = 已完成  
2.2 `partial` = 已有实现但未完全收口  
2.3 `pending` = 尚未完成

## 2. 验收表

| 项目 | 状态 | 验收说明 |
| --- | --- | --- |
| 本地 Agent 根路径扫描 | `done` | `scan` 已能识别多类 Agent 根路径 |
| `workspace_mode` 判断 | `done` | 扫描结果已包含该字段 |
| `session_source_type` 判断 | `done` | 扫描结果已包含该字段 |
| Candidate / Card 字段契约 | `done` | 已统一到 `specs/contracts/objects/` |
| 候选列表生成 | `partial` | 已能生成 `agent_candidates.json`，但真实默认链路验收仍未完全收口 |
| 注册确认写盘 | `partial` | 已能生成最小 Agent Card，但前端确认与默认链路验收仍未完成 |
| 注册汇总生成 | `partial` | 已能生成 `registered_agents.json`，但尚未形成完整受控消费链路 |
| 私有一级落点收口 | `done` | 已统一到 `~/.ai-trace/data/` |
| 公开 Mock 数据收口 | `done` | 已统一到 `mock/data/` |
| H5 Mock 展示 | `done` | `Home / Agents` 可读 Mock 数据 |
| H5 注册预览 | `done` | H5 可生成注册预览与队列事件，不承担真实写盘 |
| 前端视觉状态 | `done` | 已定义 `candidate` / `registered` / `partial` / `disabled` / `P3+` |
| H5 Real 展示 | `pending` | 已明确留到 Phase 3 API，不作为 Phase 2 必需验收项 |
| 文档状态表达统一 | `done` | 已拆分 `PLAN` / `STATUS_REPORT` / `ACCEPTANCE` / 前端对齐文档 |
| 阶段边界保持收口 | `done` | 未提前解锁 Phase 3+ 实现 |

## 3. 当前结论

1. Phase 2 主骨架已完成，但关键链路仍是部分完成。
1.1 扫描  
1.2 注册  
1.3 Mock 展示  
1.4 目录口径  
1.5 Candidate / Card 字段契约

2. Phase 2 还不能判定为完全完成。
2.1 Scan -> Register 的真实默认链路仍未完成最终验收  
2.2 文档还需要跟随最终验收继续微调

3. 当前建议结论：
3.1 保持 `not-yet-complete`
3.2 “H5 Real 展示” 已下放到 Phase 3，不阻塞 Phase 2 验收
