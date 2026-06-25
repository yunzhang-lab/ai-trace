# specs/flows

> status: active

本目录存放稳定流程规范，描述能力之间如何流转。

## 1. 职责

1. 定义流程节点。
1.1 例如 `scan -> candidate -> register -> agent_card`

2. 定义状态流转。
2.1 状态  
2.2 动作  
2.3 输入输出  
2.4 执行方  
2.5 审计要求

3. 连接前端、后端与数据规范。
3.1 前端发起动作  
3.2 后端执行写盘  
3.3 数据结构由 `specs/data/` 或垂直能力目录定义

## 2. 推荐文件形态

1. `SCAN_REGISTER_FLOW.md`
1.1 人读流程解释。

2. `scan_register.flow.json`
2.1 机器可读流程节点、状态、动作与引用的 schema。

## 3. 阶段关系

1. Phase 只决定何时解锁流程。
2. `specs/flows/` 定义已确认流程本身。
3. 未确认流程先留在 `drafts/specs/flow/`。
