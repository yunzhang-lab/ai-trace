# ai-trace Skill

> status: staging

本目录是未来单一 `ai-trace` Skill 的交付落点。

## 1. 当前判断

1. 当前不把 `specs/` 整体复制进 Skill。
1.1 `specs/` 是公开仓规范真相源。  
1.2 Skill 只按需引用已确认规范。  
1.3 Phase 5 再决定哪些规范需要随包分发。

2. 当前不把 `apps/cli/` 整体搬进 Skill。
2.1 `apps/cli/` 是开发与验证实现区。  
2.2 Skill 未来只吸收稳定后的可分发执行代码。  
2.3 Phase 2-3 仍以 `apps/cli/` 为真实入口。

## 2. 未来目录含义

1. `SKILL.md`
1.1 Agent 加载时阅读的主说明。

2. `bin/`
2.1 未来 Skill 对外命令入口。

3. `src/`
3.1 未来 Skill 自带执行代码。

4. `examples/`
4.1 最小使用示例。

## 3. 当前引用

1. 总入口：[README.md](/README.md)
2. 阶段路线：[phases/ROADMAP.md](/phases/ROADMAP.md)
3. 规范入口：[specs/README.md](/specs/README.md)
4. CLI 开发入口：[apps/cli/main.py](/apps/cli/main.py)
