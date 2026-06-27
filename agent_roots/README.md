# Agent Roots Case Layer

## 1. 目录职责

1. `agent_roots/` 是公开仓内的 Mock Agent 原生输入根案例区。
1.1 它只用于展示真实 Agent 根目录的大致文件结构。
1.2 它不随 `skill/ai-trace` 作为运行必需数据分发。

2. 结构化 Mock 数据已经进入 Skill：
2.1 `skill/ai-trace/mock/data/`
2.2 用户只下载 `skill/ai-trace/` 时，仍然可以用内置 Mock 数据调试。

3. `agent_roots/` 用于承接公开 Mock Agent 原生输入根。
3.1 对应真实环境中的 `~/.codex`、`~/.claude`、`~/.qwenpaw` 等原生目录
3.2 只放脱敏测试数据，不放真实日志
3.3 只模拟扫描识别所需结构，不复制真实缓存、密钥、模型、截图或大体量二进制文件

## 2.1 当前 Mock Agent Roots

1. `agent_roots/codex/`
1.1 对齐 `config.toml`、`session_index.jsonl`、`history.jsonl`、`sessions/YYYY/MM/DD/*.jsonl`、`archived_sessions/`、`memories/`、`rules/`

2. `agent_roots/claude/`
2.1 对齐 `history.jsonl`、`sessions/*.json`、`projects/<encoded-workspace>/*.jsonl`、`projects/<encoded-workspace>/memory/`、`session-env/`

3. `agent_roots/qwenpaw/`
3.1 对齐 `config.json`、`settings.json`、`workspaces/<workspace>/chats.json`、`skill_pool/`

4. `agent_roots/antigravity/`
4.1 对齐 `bin/agentapi`、`conversations/*.pb`、`brain/<session>/.system_generated/{logs,messages,tasks}`、`brain/<session>/browser/`

## 3. 当前口径

1. 私有真实结构化数据：
1.1 `~/.ai-trace/data/`

2. 公开 Mock 结构化数据：
2.1 `skill/ai-trace/mock/data/`

3. H5 公开静态读取源：
3.1 当前直接读取 `skill/ai-trace/mock/data/`
3.2 不再维护第二静态来源

4. Dashboard 壳层展示配置：
4.1 `skill/ai-trace/ui/js/config/app-shell-data.js`
4.2 只放 UI 占位、菜单与非真相源展示内容
