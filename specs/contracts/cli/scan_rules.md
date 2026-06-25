# Supported Agents Discovery List (支持的 Agent 发现清单)

> phase: Phase 2
> status: approved
> updated_at: 2026-06-21

为了让扫描脚本 [scan_agents.py](/apps/cli/scripts/scan_agents.py) 具备确定性的探测规则，本文件明确了系统当前支持的 AI Agent 列表、默认路径以及识别特征。

---

## 1. 支持的 Agent 列表与特征配置

为了便于 CLI 扫描脚本直接反序列化，我们将探测规则独立为 JSON 配置契约：
[scan_config.json](./scan_config.json)

CLI 执行扫描时，应读取该配置文件作为扫描种子。

---

## 2. 规则推导说明

扫描脚本在探测上述目录时，需遵循以下规则逻辑：

### 2.1 路径存在判定
*   如果探测到预设的默认根路径存在，则标记该 Agent 为“已安装候选” (`candidate`)。

### 2.2 工作区模式推导 (Workspace Mode Inference)
*   **multi-space** (多空间)：如果 Agent 原生索引或特征目录中包含多个不同工作区路径（例如 Codex 元数据中记录了多个项目的 `cwd`）。
*   **single-space** (单空间)：如果 Agent 数据仅绑定在单一工程根路径，或没有跨项目会话。
*   **unknown**：无法探测到足够的工作区历史痕迹。

### 2.3 会话源类型推导 (Session Source Type)
*   `session_index`：存在全局会话索引索引（如 Codex 的 `session_index.jsonl`）。
*   `session_dir`：无全局索引文件，但有会话日志文件夹（如 `sessions/` 目录存放原生 rollout 流水）。
*   `workspace_dir`：没有专门的会话目录，需要通过工作区扫描反推。

---

## 3. 代码实现指导

开发 `main.py scan` 时，扫描模块应当：
1.  读取此清单配置作为预设输入。
2.  遍历清单中的“默认私有根路径”。
3.  匹配“核心特征文件”，若有任一匹配成功，则生成对应的 `AgentCandidate` 对象。
4.  将路径脱敏（隐藏 `/Users/xxx`）后，写入 `agent_candidates.json`。
