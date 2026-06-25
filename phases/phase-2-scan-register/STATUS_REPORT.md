# AI Trace Phase 2 状态报告

> updated_at: 2026-06-23
> phase_status: in-review

## 1. 当前结论

1. Phase 2 主骨架已经完成，但关键链路仍未完全验收。
1.1 扫描  
1.2 注册  
1.3 Mock 展示  
1.4 目录口径收口

2. Phase 2 尚未完全验收通过。
2.1 H5 Real 模式未完成  
2.2 Scan -> Register 真实默认链路仍未完成最终验收  
2.3 最终是否把 Real 模式视为 Phase 2 必需项，仍需裁决

## 2. 已完成

1. 目录口径已统一。
1.1 私有真实结构化数据：`~/.ai-trace/data/`  
1.2 公开 Mock 结构化数据：`mock/data/`

2. CLI 主链路已具备。
2.1 `python3 apps/cli/main.py scan`  
2.2 `python3 apps/cli/main.py register`

3. 扫描结果已能输出最小候选数据，但链路验收未完全收口。
3.1 Agent 产品  
3.2 `workspace_mode`  
3.3 `session_source_type`

4. 注册结果已能写入最小 Agent Card 与注册汇总，但仍缺默认链路与前端确认验收。

5. H5 Mock 模式已可展示 `Home / Agents` 所需信息。

6. 前端字段、注册流程与视觉状态已形成对齐文档。

7. Candidate / Card 字段契约已统一到 [specs/contracts/objects/](/specs/contracts/objects/)。

## 3. 未完成

1. H5 Real 模式未打通。
1.1 当前只保留 API 入口预期  
1.2 `serve` 留待 Phase 3

2. Scan -> Register 真实默认链路仍未完成最终验收。
2.1 候选生成已存在  
2.2 注册写盘已存在  
2.3 注册汇总已存在  
2.4 但三者尚未形成已验收的真实闭环

3. 阶段完成判定仍需以 [ACCEPTANCE.md](/phases/phase-2-scan-register/ACCEPTANCE.md) 最终勾选。

## 4. 当前边界

1. Phase 2 只处理：
1.1 扫描  
1.2 注册  
1.3 Mock 展示  
1.4 最小私有结构化数据落点

2. Phase 2 不处理：
2.1 Session Index  
2.2 Bookmark 写入  
2.3 会话详情浏览  
2.4 本地 API 服务

## 5. 相关文档

1. 规划入口：[PLAN.md](/phases/phase-2-scan-register/PLAN.md)
2. 验收入口：[ACCEPTANCE.md](/phases/phase-2-scan-register/ACCEPTANCE.md)
3. 前端注册对齐：[dashboard.md](/specs/surfaces/dashboard.md)
4. Agent 支持清单：[AGENT_SUPPORT_LIST.md](/phases/phase-2-scan-register/AGENT_SUPPORT_LIST.md)
