# Mock Data Layer

## 1. 目录职责

1. `mock/` 是公开仓内的统一 Mock 总入口。
1.1 当前正式启用 `mock/data/` 与 `mock/agent_roots/`
1.2 未来若需要 Mock Markdown / Wiki 内容，再单独讨论 `mock/content/`

2. `mock/data/` 用于承接结构化 Mock 数据。
2.1 目录结构尽量镜像真实私有结构化数据层
2.2 当前优先对齐 `registry/`、`agents/`、`index/` 等子目录

3. `mock/agent_roots/` 用于承接公开 Mock Agent 原生输入根。
3.1 对应真实环境中的 `~/.codex`、`~/.claude`、`~/.qwenpaw` 等原生目录
3.2 只放脱敏测试数据，不放真实日志
3.3 只模拟扫描识别所需结构，不复制真实缓存、密钥、模型、截图或大体量二进制文件

## 2.1 当前 Mock Agent Roots

1. `mock/agent_roots/codex/`
1.1 对齐 `config.toml`、`session_index.jsonl`、`history.jsonl`、`sessions/YYYY/MM/DD/*.jsonl`、`archived_sessions/`、`memories/`、`rules/`

2. `mock/agent_roots/claude/`
2.1 对齐 `history.jsonl`、`sessions/*.json`、`projects/<encoded-workspace>/*.jsonl`、`projects/<encoded-workspace>/memory/`、`session-env/`

3. `mock/agent_roots/qwenpaw/`
3.1 对齐 `config.json`、`settings.json`、`workspaces/<workspace>/chats.json`、`skill_pool/`

4. `mock/agent_roots/antigravity/`
4.1 对齐 `bin/agentapi`、`conversations/*.pb`、`brain/<session>/.system_generated/{logs,messages,tasks}`、`brain/<session>/browser/`

## 3. 当前口径

1. 私有真实结构化数据：
1.1 `~/.ai-trace/data/`

2. 公开 Mock 结构化数据：
2.1 `mock/data/`

3. H5 公开静态读取源：
3.1 当前直接读取 `mock/data/`
3.2 不再维护 `apps/dashboard/data/` 这类第二静态来源

4. Dashboard 壳层展示配置：
4.1 `apps/dashboard/js/config/app-shell-data.js`
4.2 只放 UI 占位、菜单与非真相源展示内容
