const appData = {
  agents: [
    { id: "qwenpaw", name: "QwenPaw", type: "候选 Agent", status: "working", color: "#14734f", screen: "#356b61", project: "scan", task: "等待注册规则确认", pending: 0, root: "private workspace / qwenpaw" },
    { id: "codex", name: "Codex", type: "扫描器", status: "working", color: "#0d8295", screen: "#2d6077", project: "phase-2", task: "实现 scan 与注册面板", pending: 0, root: "private workspace / codex" },
    { id: "claude-code", name: "Claude Code", type: "候选 Agent", status: "idle", color: "#6651a5", screen: "#50456f", project: "index", task: "等待索引规则阶段", pending: 0, root: "private workspace / claude" }
  ],
  agentCandidates: [],
  registeredAgents: [],
  registrationQueue: [],
  wiki: [
    { title: "流程优先总目标", type: "system", path: "phases/ROADMAP.md", summary: "当前只围绕 Scan / Register / Index / Mark 锁定近阶段目标。" }
  ],
  menu: [
    { top: "Home", subs: ["Desk", "Current Phase", "Recent Changes"] },
    { top: "Agents", subs: ["Candidates", "Register", "Mappings"] },
    { top: "Wiki", subs: ["Placeholder"] }
  ],
  knowledgePreview: [
    { title: "Agent Card", summary: "Phase 2 先锁定 Agent 候选卡和私有路径映射。" },
    { title: "Session Index", summary: "Phase 3 再点亮会话列表、文件夹关系和标记态。" }
  ],
  profile: [
    { type: "preference", title: "Obsidian 与 ai-trace 合一", domain: "workflow", scope: "global", status: "validated", confidence: "high", source: "user", summary: "共享区直接作为 Obsidian Vault，H5 也读取同一份文件，避免双写不一致。" },
    { type: "preference", title: "偏好必须可筛选", domain: "workflow", scope: "cross-agent", status: "candidate", confidence: "high", source: "user", summary: "偏好按范围、领域、状态、置信度、来源 Agent 筛选，避免长期记忆污染。" },
    { type: "preference", title: "沟通更偏讨论和落地", domain: "communication", scope: "global", status: "validated", confidence: "high", source: "profile", summary: "先讨论框架，再沉淀规范和 demo，避免过早碎片化。" },
    { type: "knowledge", title: "项目公共区保存索引而非实体", domain: "knowledge", scope: "global", status: "validated", confidence: "high", source: "project", summary: "实际代码和文档可以在外部路径，公共区维护 MANIFEST、进度和决策。" },
    { type: "knowledge", title: "H5 是 Wiki 的可视化前台", domain: "knowledge", scope: "global", status: "candidate", confidence: "medium", source: "demo", summary: "H5 不建立第二数据库，只读取 ai-trace 文件，展示办公空间、筛选和审核。" },
    { type: "knowledge", title: "Claude Code 用 CLAUDE.md 接入", domain: "execution", scope: "cross-agent", status: "candidate", confidence: "medium", source: "agent", summary: "Claude Code 的入口文件导入 ai-trace 规范和当前项目卡。" },
    { type: "lesson", title: "不要把完整对话当长期记忆", domain: "workflow", scope: "global", status: "validated", confidence: "high", source: "sync", summary: "原始日志只做证据源，长期继承依赖提炼对象。" },
    { type: "lesson", title: "私有教训要标记是否已整合", domain: "execution", scope: "cross-agent", status: "candidate", confidence: "high", source: "user", summary: "记录 candidate_id、shared_id、integrated_at、integrated_to，避免重复提炼。" },
    { type: "lesson", title: "冲突不能埋在项目正文里", domain: "workflow", scope: "global", status: "candidate", confidence: "medium", source: "conflict", summary: "路径、进度、偏好冲突要进入 conflicts/，让所有 Agent 都能看到。" }
  ],
  sync: [
    { id: "sync_001", title: "偏好筛选规则", type: "preference_candidate", agent: "qwenpaw", risk: "medium", target: "preferences/", summary: "将偏好按 scope/domain/status/confidence/source_agent/reviewer 管理。" },
    { id: "sync_002", title: "知识筛选规则", type: "knowledge_candidate", agent: "codex", risk: "medium", target: "knowledge/", summary: "知识按 domain/type/status/confidence/source/last_reviewed_at 管理。" },
    { id: "sync_003", title: "私有教训整合标记", type: "lesson_candidate", agent: "qwenpaw", risk: "low", target: "lessons/candidates/", summary: "私有教训应记录 integrated_at、integrated_to、reviewer。" },
    { id: "sync_004", title: "H5 一级菜单", type: "dashboard_update", agent: "codex", risk: "low", target: "process/INFORMATION_FLOW_SPEC.md", summary: "Office、Wiki、Profile、Sync、Conflicts、Skills 六个一级菜单。" },
    { id: "sync_005", title: "共享 skill 草案", type: "skill", agent: "codex", risk: "low", target: "knowledge/skills/ai-trace-collaboration/", summary: "让多个 Agent 使用同一套协作、同步、交接规范。" }
  ],
  conflicts: [
    { title: "README 中 daily/ 与实际 reports/daily 不一致", severity: "medium", status: "open", owner: "QwenPaw", summary: "需要更新入口文档，避免新 Agent 写错位置。" },
    { title: "偏好私有记录和共享记录谁为准", severity: "high", status: "reviewing", owner: "枫叶", summary: "建议优先级：用户确认 > shared validated > private profile > raw log。" }
  ],
  activity: [
    { title: "Phase 2", meta: "scan · register", summary: "当前先完成扫描候选、注册确认和 Agent Card 草案。" },
    { title: "Phase 3", meta: "index · mark", summary: "下一阶段只做最小会话索引和标记规则，不进入全文提炼。" },
    { title: "Templates", meta: "deferred", summary: "超前对象模板已打回 drafts/specs，等待后续阶段再 Promote。" }
  ],
  skills: [
    { title: "ai-trace-collaboration", status: "draft", summary: "定义 Agent 如何读取 ai-trace、判断公私边界、输出交接和同步候选。" },
    { title: "任务结束模板", status: "ready", summary: "agent/project/changed/verified/risks/handoff/sync_candidates/conflicts/source_logs。" },
    { title: "同步候选模板", status: "ready", summary: "id/type/source_agent/source_log_path/target/policy/status/risk/summary。" }
  ]
};

const appSubnavs = {
  office: ["Desk", "Current Phase", "Recent Changes"],
  agents: ["Candidates", "Register", "Mappings"],
  wiki: ["Placeholder"],
  profile: ["Placeholder"],
  sync: ["Placeholder"],
  skills: ["Placeholder"]
};

const appTitles = {
  office: ["Home · Desk", "AI 办公空间", "当前阶段只点亮 Desk 与 Agents，优先推进扫描、注册和最小索引闭环。"],
  agents: ["Agents · Register", "Agent 接入管理", "展示扫描候选、工作区模式和注册确认入口，为后续会话索引做准备。"],
  wiki: ["Wiki · Placeholder", "Wiki 占位页", "等待会话索引与稳定导入字段，当前阶段不挂真实数据源。"],
  profile: ["Profile · Placeholder", "Profile 占位页", "偏好与教训依赖后续提炼和审核阶段，当前仅保留位置。"],
  sync: ["Flow · Placeholder", "Flow 占位页", "审核、同步和队列动作待进入 Candidate 阶段后再点亮。"],
  skills: ["Skills · Placeholder", "Skills 占位页", "Skill 体系在稳定流程闭环后再正式点亮。"]
};

// Global helper for badge colors
const getBadgeColor = value => {
  if (["working", "validated", "low", "ready"].includes(value)) return "green";
  if (["review-needed", "candidate", "medium", "reviewing"].includes(value)) return "amber";
  if (["open", "high"].includes(value)) return "red";
  if (["idle"].includes(value)) return "blue";
  return "violet";
};
