# 用户历史目标、疑问与 Agent 回应归口 (User Goals, Questions & Agent Responses)

> updated_at: 2026-06-18  
> status: aligned  
> participants: Human, Antigravity  
> location: `discussions/goals_and_questions.md`  

本文档专门用于记录人类用户提出的历史目标、设计疑问，以及 Agent（Antigravity）对应的架构回应和对齐方案。通过将用户想法和 Agent 的设计方案严格拆开呈现，实现问题溯源与方案演进的可审计性。

---

## 1. 物理存储边界与私有区规范 (Repo Boundaries & Private Area)

### 用户想法与疑问 (User's Thoughts & Questions)
*   **问题 1**：临时缓存还是私有文件夹还是公有？
*   **问题 2**：有约定私有文件夹的规范吗？这属于哪个模块？

### Agent 回应与对齐方案 (Agent's Responses)
*   **物理职责划分**：
    - **公有仓 (`ai-trace-open`)**：仅存放抽象规范（Templates）、代码逻辑（Code）、脱敏后的 Mock 展示数据，以及无敏感信息的战略文档（Docs/Discussions），绝对不包含任何真实路径和敏感会话。
    - **私有区 (`~/.ai-trace/`)**：本地存储真实数据，包括会话原始日志、个人偏好、教训、敏感项目及私有配置。
*   **私有规范归口**：
    - 在 [repo-boundary-spec.md](/drafts/repo-boundary-spec.md) 中详细约定了私有工作区目录规范，这属于“数据存储与安全治理”模块。
    - 私有区包括：`sessions/`（原始备份）、`candidates/`（初加工草稿）、`registry/`（Agent 注册配置）、`sync/queue/`（动作指令队列）等。

---

## 2. 路线图重组与交付阶段顺序 (Roadmap Restructuring)

### 用户想法与疑问 (User's Thoughts & Questions)
*   **问题 1**：工作台和路线图是否需要重新来？
*   **问题 2**：从更多角度思考一下，路线图、阶段的顺序是否需要重新调整？

### Agent 回应与对齐方案 (Agent's Responses)
*   **敏捷路线图重组**：
    - 对 [ROADMAP.md](/phases/ROADMAP.md) 进行了彻底重写。
    - 将整体演进重组为 5 个依次推进的阶段：`Phase 1: 物理收缩与双仓分立` ➡️ `Phase 2: 本地发现与卡片注册` ➡️ `Phase 3: 标记会话与只读呈现` ➡️ `Phase 4: 提炼加工与冲突归口` ➡️ `Phase 5: 多 Agent 协作与自动 Skill`。
    - 这理顺了“物理规范先行 ➡️ 建立实体卡 ➡️ 接入只读视图 ➡️ 数据分析提炼 ➡️ 自动技能封装”的依赖关系。

---

## 3. 本地 AI 实体扫描发现与注册机制 (Local Scan & Registration)

### 用户想法与疑问 (User's Thoughts & Questions)
*   **问题 1**：第一个能力是不是得先扫码本地有哪些 Agent？比如哪些是单空间（单项目），哪些是多空间的？然后对这些才能进行注册？
*   **问题 2**：是不是先通过我们注册的会自动生成对话索引与文件夹？前端负责展示，后端是脚本，前后端分离？
*   **问题 3**：之前的阶段里提到的 Agent 卡片（Agent Card）等内容，应该放在哪个阶段？

### Agent 回应与对齐方案 (Agent's Responses)
*   **扫描作为启动依赖**：
    - 完全对齐该想法。在 Phase 2 中，首要任务就是由 Codex 执行 `python3 apps/cli/main.py scan` 扫描本机 AI 常用路径。
    - 扫描时会识别 Agent 的工作空间类型：**单空间工作区**（Cursor 等在单项目内产生会话）和**多空间工作区**（如 Cline 在全局产生的会话），进而输出候选清单 `agent_candidates.json`。
*   **前后端分离注册流**：
    - 前端 H5 仅通过候选清单展示有哪些“可注册 Agent”；用户选择并确认后，后台 Codex 脚本负责将该 Agent 写入私有区 `registry/` 并创建对应的会话存储子目录。
    - 写入后，自动解析对应 AI 软件的历史会话数据库，为其生成初步的本地 `session_index` 索引文件。
*   **Agent 卡片定位**：
    - Agent 卡片（包含 Agent 偏好、适用范围等描述）作为 Phase 2 的核心输出，其字段规范草拟在 `drafts/specs/` 下，最终批准发布至 `templates/profile/`。

---

## 4. 提炼加工与多 Agent 审批流 (Refinement & Approval Workflow)

### 用户想法与疑问 (User's Thoughts & Questions)
*   **问题 1**：提炼加工的内容很多，有知识库等。进度追踪，未来把多个 Agent 的审批放进来，这属于提炼加工吗？
*   **问题 2**：如果希望把 2 个会话 ID 的内容进行汇总，使用新的会话 ID，这属于哪个阶段的内容？

### Agent 回应与对齐方案 (Agent's Responses)
*   **加工与审批的阶段归口**：
    - **提炼加工**属于 Phase 4 的内容。
    - **多 Agent 审批与进度追踪**（例如解决多个 Agent 修改同一份 Wiki 或教训时的冲突与人工审批）由于技术复杂度极高，归入 Phase 5（深度协作层），属于提炼加工的高级进阶功能。
*   **会话合并归口**：
    - “把 2 个会话 ID 汇总生成新 ID（Session Merger）” 属于 Phase 4（内容提炼与加工）的数据整理层。
    - 其逻辑是通过分析两个会话中讨论的同一项目或技术线，将核心结论合并，提取出公共的知识与经验，生成指向新会话 ID 的 Consolidated Record。

---

## 5. 渐进式迭代原则 (Progressive Elaboration)

### 用户想法与疑问 (User's Thoughts & Questions)
*   **问题 1**：那些所有 Agent 都需要的统一规范应该在哪个阶段？
*   **问题 2**：是否可以把先实现的写细，慢慢的再补充？毕竟不可能预设所有。

### Agent 回应与对齐方案 (Agent's Responses)
*   **基础通用规范前置**：
    - 诸如 Agent 协作分工守则（`drafts/README.md`）、双仓隔离边界与升级规范（`drafts/repo-boundary-spec.md`）等所有 Agent 均需遵守的元规范，全部作为 Phase 1 的核心产物，在前置阶段就必须讨论对齐完毕。
*   **前细后粗，渐进明细**：
    - 强烈赞同“不预设所有”。项目将路线图的前期阶段（Phase 1, Phase 2）定义的非常具体（包含具体的输入输出 JSON/YAML 路径与命令行指令），但对 Phase 4、Phase 5 等中后期阶段，仅勾勒粗略目标。
    - 这种设计避免了在没跑通本地数据读取时进行盲目的空中楼阁设计，允许根据前期的真实开发反馈进行敏捷的迭代和补充。
