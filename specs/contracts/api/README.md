# specs/contracts/api

> status: phase-3-reserved

本目录预留 API 契约。

## 1. 当前口径

1. Phase 2 不强制引入本地 API。
1.1 Dashboard 可以直接读取 `mock/data/` 完成扫描与注册的可视化展示。
1.2 真实扫描与注册仍由 `apps/cli/` 执行。

2. Phase 3 再引入统一 `/api/*`。
2.1 Mock / Real 数据源切换下沉到后端或中间件。
2.2 Dashboard 不再直接关心真实路径。

## 2. 预留接口方向

1. `GET /api/registry/candidates`
2. `GET /api/registry/registered`
3. `POST /api/scan`
4. `POST /api/register`
