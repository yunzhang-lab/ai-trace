# 共通提取规范 (Extraction Common)

> status: approved
> updated_at: 2026-06-21
> format: 通用规则与工具方法
> parent_spec: 待 Phase 3+ 细化的 Agent Discovery 规范

本文件归纳了所有支持的 Agent（Claude Code、Codex、QwenPaw、Antigravity）在数据扫描与提取时**共用的规则与工具方法**。被 `AGENT_DISCOVERY_SPEC.md` 与 `PHYSICAL_STRUCTURES.md` 共同引用。

---

## 1. 会话数统计 (Session Count)

- **目标**：确定某个 Agent 记录的会话总数量。
- **通用步骤**：
  1. 定位该 Agent 的主数据源文件（例如 `history.jsonl`、`session_index.jsonl` 或 SQLite 表）。
  2. 逐行解析 JSON，提取 `sessionId`（或等效字段 `id`）。
  3. 放入 **Set 集合** 去重。
  4. 集合长度即为会话总数。
- **示例代码 (Python)**：
  ```python
  import json
  session_ids = set()
  with open('path/to/history.jsonl') as f:
      for line in f:
          data = json.loads(line)
          session_ids.add(data.get('sessionId') or data.get('id'))
  print('会话总数:', len(session_ids))
  ```

---

## 2. 工作区发现 (Workspace Discovery)

- **目标**：列举某个 Agent 曾经交互过的全部工作区（项目）。
- **通用步骤**：
  1. 使用与会话统计相同的数据源。
  2. 提取 `project` 或 `cwd` 字段（工作目录的绝对路径）。
  3. 对路径做标准化处理（解析符号链接、去除尾部斜杠）。
  4. 使用 **Set 集合** 去重，得到唯一工作区列表。
- **特殊情况**：如果 Agent 在 `workspaces/` 目录下按子文件夹存储（例如 QwenPaw），直接列出子目录名即可。

---

## 3. 路径脱敏规则 (Path Masking)

- **目标**：确保导出的 JSON / YAML 数据不暴露用户的绝对家目录。
- **规则**：将路径中匹配 `$HOME`（或 `Path.home()` 的值）的前缀部分替换为 `~`。
- **实现代码 (Python)**：
  ```python
  from pathlib import Path
  home = str(Path.home())
  def mask_path(p: str) -> str:
      return p.replace(home, '~') if p.startswith(home) else p
  ```
- 在持久化或对外发布数据前，对所有可能包含绝对路径的字段统一调用 `mask_path`。

---

## 4. 工作区模式推断 (Multi-Space vs Single-Space)

- **多工作区 (multi-space)**：会话数据源中引用了**多个不同的项目路径**。
- **单工作区 (single-space)**：所有会话都指向**同一个项目/工作区路径**。
- **未知 (unknown)**：数据不足，无法判断。

---

> 以上规则刻意保持**技术无关性**，适用于当前及未来新增的任何 Agent。各 Agent 特有的细节差异（如 SQLite Schema 区别等），后续按阶段进入本目录下的正式规范。
