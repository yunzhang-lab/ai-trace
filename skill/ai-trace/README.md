# ai-trace Skill

> status: staging

本目录是单一 `ai-trace` Skill 的运行与交付真身。

## 1. 当前判断

1. 当前把稳定 `specs/` 随 Skill 分发。
1.1 `specs/` 是用户下载 Skill 后可直接查看的规范真相源。  
1.2 未确认规范仍留在仓库一级 `drafts/`。  
1.3 阶段过程文档仍留在仓库一级 `phases/`。

2. 当前代码直接在 Skill 内开发与验证。
2.1 `bin/` 是后端 CLI 真身。  
2.2 `ui/` 是前端 H5 真身。  
2.3 验收即验收本目录，不再维护第二套应用代码环境。

## 2. 目录含义

1. `SKILL.md`
1.1 Agent 加载时阅读的主说明。

2. `guides/`
2.1 已实现能力的说明层。  
2.2 负责讲“怎么理解、怎么使用、当前做到哪里”。

3. `specs/`
3.1 已确认契约与界面规范层。  
3.2 负责讲“字段、边界、结构是什么”。

4. `bin/`
4.1 Skill 对外命令入口与 Python 标准库实现。

5. `ui/`
5.1 Skill 自带 H5 静态界面。

6. `examples/`
6.1 最小使用示例。

## 3. 当前引用

1. 总入口：[README.md](/README.md)
2. 阶段路线：[phases/ROADMAP.md](/phases/ROADMAP.md)
3. 说明入口：[guides/README.md](./guides/README.md)
4. 规范入口：[specs/README.md](./specs/README.md)
5. CLI 入口：[bin/main.py](./bin/main.py)
6. H5 入口：[ui/index.html](./ui/index.html)
