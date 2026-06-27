# 阶段确认浓缩版

> updated_at: 2026-06-21
> status: approved
> participants: [Codex, Human]
> location: `discussions/stage_confirmation_brief.md`
> purpose: 用最短版本确认阶段边界，避免在实现前继续扩散

当前建议按 5 个阶段推进，但**此版本仍待用户最终确认**：

**Phase 1 骨架收口**：只确认总入口、路线图、公私边界、6 个公开根目录，不定义私有仓具体目录，不扩对象模板。  
**Phase 2 Scan / Register**：只做本地 Agent 扫描、候选生成、用户注册确认、Agent Card 与映射，H5 只点亮 `Home / Agents`。  
**Phase 3 Index / Mark**：只做最小会话索引与显式标签标记；字段仅 `agent_id / session_id / title / updated_at / cwd / folder_path / bookmark_state`；H5 只读展示，不做手工改标记。  
**Phase 4 Extract / Review / Sync / Audit**：只在此阶段定义 `candidate`、审核动作、同步与审计闭环，以及相关私有结构。  
**Phase 5 Promote / Skill**：再定义稳定模板正式落点、迁移工具与 Skill 正式化。

总原则：

1. 总纲只定目标与边界。
2. 路线图决定阶段解锁。
3. 阶段 SPEC 再定目录、文件、格式与实现。
4. 未进入相邻阶段的内容，一律只保留方向，不提前锁死。

## 待拍板的确认项

1. 是否正式采用以上 5 阶段结构。
2. 是否确认 `Phase 2` 正式停在 `Scan -> Register`。
3. 是否确认 `Phase 3` 正式停在最小 `Index -> Mark` 只读闭环。
4. 是否确认不额外插入 `Phase 3.5` 过渡阶段。

## 建议 DoD 与不做什么

### Phase 1

DoD：

- 6 个公开根目录明确
- 总纲、路线图、对齐工作台、讨论区职责分离明确

不做什么：

- 不定义私有仓具体目录
- 不扩远期对象模板

### Phase 2

DoD：

- 能扫描本地 Agent 并生成候选
- 能完成注册确认、Agent Card 与映射
- H5 只点亮 `Home / Agents`

不做什么：

- 不定义会话索引格式
- 不进入 Bookmark 写入机制
- 不进入 Candidate / Audit / Sync 实现

### Phase 3

DoD：

- 能生成最小会话索引
- 能识别显式标签标记
- H5 只读展示最小会话视图与标记状态

不做什么：

- 不提取工具子命令与文件列表
- 不做 H5 手工改标记
- 不引入本地 API 服务

### Phase 4

DoD：

- 至少跑通一条 `标记 -> 候选 -> 审核 -> 同步 -> 审计` 链路
- 审核动作与审计回流闭环明确

不做什么：

- 不提前 Promote 稳定模板
- 不提前做 Skill 正式资产化

### Phase 5

DoD：

- 稳定模板才允许建立正式落点
- 迁移工具与 Skill 正式化方案具备最小可用性

不做什么：

- 不回头把前序阶段未确认内容伪装成正式模板
