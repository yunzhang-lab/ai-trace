# skill/ai-trace/ui

> status: active

本目录存放 H5 静态展示工作台。

## 1. 当前入口

1. [index.html](/skill/ai-trace/ui/index.html)
1.1 前端展示入口。

2. 本地预览建议启动 Skill 服务：
2.1 `python3 skill/ai-trace/bin/main.py serve`
2.2 访问 `http://127.0.0.1:8787/ui/index.html`
2.3 不建议直接双击 `index.html`，浏览器可能拦截本地 JSON 读取，导致 Mock 数据显示为 0。

## 2. 当前结构

1. `css/`
1.1 页面样式。

2. `js/`
2.1 页面逻辑、视图模块与轻量 UI 配置。

## 3. 边界

1. 不承载业务 Mock 数据真相源。
2. 不直接写私有仓。
3. Phase 2 只读取 `skill/ai-trace/mock/data/` 做静态展示。
