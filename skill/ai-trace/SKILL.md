# ai-trace

> status: staging
> purpose: 单一 ai-trace Skill 的未来加载入口

## 1. 启动时先读

1. [README.md](/README.md)
1.1 当前公开仓总入口。

2. [phases/ROADMAP.md](/phases/ROADMAP.md)
2.1 当前阶段与能力解锁规则。

3. [specs/README.md](/specs/README.md)
3.1 稳定规范入口。

## 2. 当前允许能力

1. Phase 2 只允许：
1.1 `scan`  
1.2 `register`

2. Phase 3+ 能力只看路线图，不提前执行。

## 3. 当前调用入口

```bash
python3 apps/cli/main.py scan
python3 apps/cli/main.py register
```

## 4. 数据边界

1. 私有真实数据：
1.1 `~/.ai-trace/data/`

2. 公开 Mock 数据：
2.1 `mock/data/`

3. Mock Agent 原生输入根：
3.1 `mock/agent_roots/`

## 5. 禁止

1. 不提交真实私有路径。
2. 不提交原始会话日志。
3. 不越阶段执行未解锁能力。
4. 不直接改写审计真相源。
5. 不把未确认草案伪装成正式规范。
