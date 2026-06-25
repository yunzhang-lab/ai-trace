# Bookmark Rule SPEC

> updated_at: 2026-06-21  
> status: working-draft  
> phase: Phase 3  
> scope: `Mark`

## 1. 目的

`Bookmark Rule` 用于约束哪些会话进入后续提炼流程。  
当前阶段必须坚持“显式标记优先”，不引入复杂语义自动分类。

## 2. 标记来源

当前优先支持以下来源：

1. **对话内显式标签**
   - 例如：`#bookmark`
   - 例如：`#preference`
   - 例如：`#knowledge`

以下来源保留为后续增强候选，不作为当前阶段默认承诺：

2. **H5 人工标记**
   - 用户在会话索引列表中手动勾选或切换状态

## 3. 状态定义

| 状态 | 说明 |
| --- | --- |
| `unmarked` | 未标记，不进入提炼 |
| `bookmarked` | 已标记，允许进入候选提炼 |
| `queued` | 已进入待处理队列 |
| `extracted` | 已完成候选提炼 |

## 4. 标签规则

- `#bookmark`：通用提炼入口
- `#preference`：优先导向偏好候选
- `#knowledge`：优先导向知识候选
- `#lesson`：优先导向教训候选
- 允许多个标签共存

## 5. 当前禁止事项

当前阶段禁止：

- 根据语义模型自动判断“值得提炼”
- 默认扫描全部对话正文
- 根据长对话长度自动升级为标记
- 在未授权 Agent 上建立标记索引

## 6. 当前前端行为

H5 第一版当前只需要支持：

- 展示当前 `bookmark_state`
- 展示 `bookmark_tags`

以下能力保留为后续增强候选，不作为当前阶段默认要求：

- 手工切换 `unmarked <-> bookmarked`
- 将已标记条目推入后续队列
