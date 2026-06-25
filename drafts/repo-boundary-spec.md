# 仓库边界与目录规范

> updated_at: 2026-06-18  
> status: working-draft  
> scope: `ai-trace-open` / `~/.ai-trace`

## 1. 目的

这份文档用来统一两个仓库的职责边界，避免内容、规范、代码和运行态混写。

- `ai-trace-open` 负责公开规范、抽象结构、示例、模板和演示。
- `~/.ai-trace` 负责真实运行数据、原始会话、私有原件和敏感路径。

默认流向是：

```text
private workspace -> public repo
```

即先在私有区产生真实内容，再提炼、脱敏、抽象为公开规范或示例。

---

## 2. 两个仓库的职责

### 2.1 私有区 `~/.ai-trace`

私有区用于承载真实运行数据与原始材料，包含但不限于：

- 原始会话
- 私有草稿
- 敏感路径
- 私有项目原件
- 私有知识原件
- 候选提炼结果
- 注册扫描结果
- 审计输入

私有区原则：

- 保存真实内容。
- 保留原始上下文。
- 不放公开规范正文。
- 不放公开仓库应承载的案例与模板。

### 2.2 公开仓 `ai-trace-open`

公开仓用于承载公开规范、抽象结构和演示内容，包含但不限于：

- 目录定义
- 对象模型
- 流程契约
- H5 / UI 骨架
- 知识库模板与案例
- 代码骨架与导入示例
- 协作约定与映射逻辑

公开仓原则：

- 不保存真实私有原件。
- 不保存真实私有路径。
- 不保存原始对话全文。
- 不保存敏感凭证。
- 不作为真实运行态工作区。

---

## 3. 公开仓内部的分类方案

公开仓 `ai-trace-open` 不追求一次性收得只剩极少目录，而是采用**渐进收口**：

### 3.1 仓库功能层

公开仓先稳定为 4 个功能层：

1. `docs/`：规范、路线图、对齐说明、协作协议。
2. `knowledge/`：公开知识库骨架，只放模板、案例和分类说明。
3. `apps/cli/`：公开代码骨架，只放脚本、适配层、后台逻辑和示例。
4. `apps/dashboard/`：前端 H5 / UI 可视化演示层。

### 3.2 对象语义层

`profile / work / governance / runtime / flow` 更适合作为对象语义层。它们可以在当前阶段继续存在，但后续新增稳定定义应逐步收敛到 `docs/definitions/`，而不是继续扩展成新的顶层体系。

### 3.3 模板与案例的放置原则

- 模板不再单独作为公开仓顶层目录。
- 模板优先跟随对象语义目录或 `knowledge/` 存放。
- 案例保持虚构、脱敏、可演示，不承载真实路径与真实原件。

### 3.4 语义下放与迁移规则

- **对象规范 (Specs)**：原有目录中的设计规范，统一迁移或收敛到 `docs/definitions/`。
- **对象模板与案例 (Templates & Cases)**：模板与案例优先跟随 `knowledge/` 或对象语义目录存放，不再分散为新的顶层目录。
- **代码入口与逻辑**：脚本和后台逻辑统一收口到 `apps/cli/`，内部再分层。

---

## 4. 私有区到公开仓的流转原则

1. 私有区先产生原始会话、日志和对象候选。
2. 只对被标记的会话或对象做提炼。
3. 提炼结果经过脱敏与抽象后进入公开仓。
4. 公开仓只接收规范、模板、示例、索引和抽象对象。
5. 公开仓成熟后，可反向优化私有结构，但不能覆盖私有原件。

---

## 5. 推荐的私有区目录角色

建议私有区保持以下角色：

- `agents/`
- `projects/`
- `knowledge/`
- `reports/`
- `sessions/` 或 `flow/`
- `candidates/`
- `audit/`
- `conflicts/`
- `handoff/`
- `archive/`

---

## 6. 渐进收口后的公开仓目录树

在当前阶段，公开仓 `ai-trace-open` 的推荐目录结构如下：

```text
ai-trace-open/
  ├── docs/                        # 1. 规范与对齐方案
  │     ├── INDEX.md               # 全局文档索引
  │     ├── definitions/           # 稳定规范法典
  │     │     ├── system/          # 系统架构 Spec
  │     │     ├── content/         # 内容模型 Spec
  │     │     ├── agent/           # Agent 注册边界 Spec
  │     │     ├── flow/            # 信息流转与提炼 Spec
  │     │     └── interface/       # 动作手册 (SKILL.md)
  │     ├── roadmap/               # 路线图
  │     └── coordination/          # Agent 协作磨合区
  ├── knowledge/                   # 2. 知识库骨架与案例
  │     ├── templates/             # 知识卡/知识条目模板
  │     ├── cases/                 # 虚构案例
  │     └── imports/               # 导入规则说明
  ├── code/                        # 3. 逻辑代码与自动化工具
  │     ├── scripts/               # CLI / ETL / 扫描脚本
  │     ├── backend/               # 后台逻辑 / 队列消费 / 状态执行
  │     ├── adapters/              # 导入导出映射层
  │     ├── shared/                # 公共工具 / Schema
  │     └── examples/              # 导入与适配示例
  └── apps/dashboard/                  # 4. 前端展示层
        └── h5-demo/               # H5 静态可视化演示入口
```

---

## 7. 代码执行与入口约定 (Code Execution & Entrypoint)

为了避免后台脚本杂乱无章、多入口并发冲突，代码层采用**分层入口**，而不是把所有东西都堆在根目录。

### 7.1 代码职责分层

- `scripts/`：CLI 脚本、ETL、扫描、导出、批处理任务。
- `backend/`：后台逻辑、状态变更、队列消费、动作执行。
- `adapters/`：公开仓与私有区之间的导入/导出映射层。
- `shared/`：通用函数、Schema、路径/文本归一化工具。
- `examples/`：示例输入输出与演示代码。
- `tests/`：后续如需补测试，再放这里。

### 7.2 入口约束

- `apps/cli/` 根目录可以保留兼容入口，但新实现应迁入上述子目录。
- `scripts/` 是首选的 CLI / ETL / 扫描入口层。
- `backend/` 是首选的状态变更 / 队列消费 / 执行层。
- `adapters/` 是首选的数据映射与跨区转换层。
- 若需要统一对外入口，可在后续补一个轻量 `code/cli.py`，但不强制。

### 7.3 使用示例

- `python apps/cli/scripts/extract_codex_sessions.py`
- `python -m code.scripts.extract_codex_sessions`
- 后续若存在统一入口，再由 `cli.py` 分发子命令

### 7.4 前端代码入口

- 前端静态工作台以 `apps/dashboard/index.html` 为可视化主入口。
- 所有视图渲染（`office.js`、`wiki.js` 等）和数据装载均由该 HTML 页面统一引导和加载。

---

## 8. 规范、案例与实际内容界限 (Boundary between Specs, Cases, and Content)

为了防止两仓职责混淆，各文件属性定义如下：

| 文件属性 | 定义与内容范围 | 物理存放路径 |
| :--- | :--- | :--- |
| **规范 (Specs)** | 全局规则、字段 Schema 约定、协议文档（文字与字段定义）。 | `ai-trace-open/docs/` |
| **模版 (Templates)**| 留空 frontmatter 和关键字段的 Markdown/JSON 结构。 | `ai-trace-open/knowledge/` 或对象语义目录下 |
| **案例 (Cases)** | 使用虚构数据填充的范例文件，用以向 Agent 演示字段用法。 | `ai-trace-open/knowledge/` 下的 `cases/` 或示例文件 |
| **演示数据 (Mock Data)**| 供 H5 网页离线展示用的全脱敏假数据（如 `mock-data.js`）。 | `ai-trace-open/apps/dashboard/js/data/` |
| **实际内容 (Real Content)**| 真实的开发目录路径、原始会话、敏感项目、个人偏好、真实审计日志。| 严格存储在 `~/.ai-trace/` 内，禁止提交至公开仓。 |

---

## 9. 数据切换机制 (Data Switching Mechanism)

为了使同一套前端代码 `apps/dashboard/` 既能在开源状态下完美进行 Demo 展示，又能在本地安全运行，我们设计了**双模数据切换机制**：

### 9.1 静态 Demo 模式 (Mock Mode)
- **触发条件**：用户通过浏览器直接双击打开 `apps/dashboard/index.html`（采用 `file://` 协议），或本地 API 服务未启动。
- **数据加载**：页面默认加载并解析开源仓自带的 `js/data/mock-data.js`（全脱敏虚拟假数据），确保界面正常渲染，可供公开讨论和演示。

### 9.2 本地运行模式 (Real Mode)
为了载入本地 `~/.ai-trace/` 真实数据，提供两种无缝切换方式：
1. **纯静态文件切换 (Serverless Local Mode)**：
   - 本地 ETL 脚本跑完后，将脱敏的真实索引数据以 JS 全局变量形式，写出到 `apps/dashboard/js/data/real-data.js`（该文件已列入 `.gitignore`）。
   - 前端在 `index.html` 中同时引入该文件，并在 JS 初始化时进行检测：
     ```javascript
     if (typeof window.realDataInstance !== 'undefined') {
         // 自动切换为真实数据源
         appData = window.realDataInstance;
     } else {
         // 回退加载 mock-data.js 假数据
         appData = window.mockDataInstance;
     }
     ```
2. **本地服务切换 (API Service Mode)**：
   - 当启动本地服务（`python apps/cli/main.py serve`）时，前端检测到 API 通信畅通，则发起 Ajax 请求拉取数据，并动态覆写内存中的全局变量。

---

## 10. 规范与产出数据的持续升级机制 (Schema Upgrade & Migration)

随着规范的演进，开源仓定义的 Schema 可能会变更（例如为 Project 字段增加必填属性，或调整 Knowledge 结构）。为了不破坏用户本地私有数据，我们建立**规范版本与数据自动迁移机制**：

### 10.1 规范定义（开源）
- 在 `docs/definitions/` 中的所有对象 Schema 定义（如内容模型），均标注明确的 `schema_version: "X.Y"`。

### 10.2 数据存储（私有）
- 产出到 `~/.ai-trace/` 中的所有 Markdown 文件的 YAML Frontmatter，或 JSON 文件，必须强制写入生成时的版本：
  ```yaml
  id: proj-001
  type: project
  schema_version: "1.0"  # 表明此数据符合 1.0 版本的规范
  ```

### 10.3 自动迁移管道 (Auto-Migration System)
- **逻辑落地**：开源仓 `apps/cli/` 中保留数据升级迁移脚本库（如 `code/migrations/`）。
- **执行逻辑**：
  1. 每次用户在本地执行 `trace sync`、`trace etl` 或启动本地展示服务时，代码层会自动扫描私有区 `~/.ai-trace` 中的数据版本。
  2. 如果检测到本地文件的数据版本（如 `1.0`）低于开源代码当前的最新规范版本（如 `1.1`），主控程序会自动调用迁移脚本，对本地旧文件结构进行自动扩充或字段改写。
  3. 升级成功后，自动重写该文件的 `schema_version` 至 `1.1`。
  - **效果**：开源仓“规范与代码一处升级”，本地私有数据“自动静默演进”，杜绝了规范升级带来的数据损坏和程序崩溃。

---

## 11. 禁止事项

- 不在公开仓写真实私有路径。
- 不在公开仓写原始对话全文。
- 不在公开仓写敏感凭证。
- 不把私有运行态当作公开规范正文。
- 不让 H5 成为第二套真相源。

---

## 12. 后续扩展方向

- `thread / session` 解析可作为 `flow` 的子能力加入。
- `codex` 等 Agent 的会话索引可先落私有区，再按标记提炼。
- `knowledge / work / profile / runtime / governance / flow` 的对象定义，应继续收敛到 `docs/definitions/`。
- 这套边界规范后续可封装为 skill，供多个 Agent 复用。
