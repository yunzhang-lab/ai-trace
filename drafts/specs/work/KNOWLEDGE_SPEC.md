# Knowledge 规范 (SPEC)

> 这是从 `CONTENT_MODEL_SPEC.md` 中拆解出的子规范。

## 1. 定位

知识 (`Knowledge`) 默认公有为主，用于存放经过提炼和验证的可复用知识、方法论、规则。

## 2. 必须包含的基础字段

每个 Knowledge 对象必须包含标准的元数据：

```yaml
id: knowledge-domain-20260524-001
type: knowledge
schema_version: 1.0
content_version: 1
status: queued
reliability: medium
source_type: conversation
source_agent: codex
created_at: 2026-05-24T10:00:00+08:00
tags: []
contains_secrets: false
```

## 3. Knowledge 特有的筛选与过滤字段

除了基础字段外，Knowledge 还必须支持以下字段用于筛选：

- `domain`：所属业务域或技术域（如 `frontend`, `auth`, `database`）
- `type`：知识类型（如 `snippet`, `architecture`, `guideline`）
- `status`：生命周期状态（`draft` / `candidate` / `approved` 等）
- `reliability`：可靠程度（`low` / `medium` / `high` / `confirmed`）
- `source`：原始来源（对话 ID 或文档路径）
- `last_reviewed_at`：最后人工复核时间

## 4. 存储格式

- 文本沉淀类：Markdown + YAML Frontmatter
- 文件命名：必须带时间戳或 hash，避免并发写入覆盖（例：`knowledge-frontend-20260524-abc.md`）