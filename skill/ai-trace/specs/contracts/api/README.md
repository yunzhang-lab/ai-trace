# specs/contracts/api

> status: phase-2-minimal

本目录记录当前已确认的最小本地 API 口径。

## 1. 当前口径

1. Phase 2 已允许最小本地 API。
1.1 Dashboard 不再只读静态 Mock；当前允许读取本地 `/api/*`。
1.2 前端支持 `Live / Mock` 显式模式，并允许开发态 `Auto` 回退。
1.3 真实扫描与注册仍由 `skill/ai-trace/bin/` 执行。

2. Phase 2 API 只服务最小闭环。
2.1 只覆盖 `Scan / Register / Space`。
2.2 不代表 Phase 3 的完整索引 API 已解锁。

## 2. 当前接口

1. `GET /api/registry/candidates`
2. `GET /api/registry/registered`
3. `GET /api/registry/workspaces`
4. `GET /api/registry/spaces`
5. `POST /api/registry/spaces`
6. `POST /api/registry/register`

## 3. 暂未承诺

1. `POST /api/scan` 当前作为开发态辅助接口存在，但不是 Phase 2 验收必需接口。
2. 统一的 Session / Index / Mark API 留到 Phase 3。
3. Mock / Real 的完整中台化切换不在当前阶段承诺。
