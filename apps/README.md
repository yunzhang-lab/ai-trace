# apps

> status: active

本目录承接公开仓内可运行或可展示的应用层能力。

## 1. 当前划分

1. `cli/`
1.1 CLI、扫描、注册、导出、后台任务与共享工具。

2. `dashboard/`
2.1 H5 静态展示工作台、页面脚本与样式。

## 2. 边界

1. `apps/cli/` 负责执行与落盘。
2. `apps/dashboard/` 负责展示与动作发起。
3. 结构化 Mock 数据仍统一来自 `mock/data/`。
4. Mock Agent 原生输入根仍统一来自 `mock/agent_roots/`。
