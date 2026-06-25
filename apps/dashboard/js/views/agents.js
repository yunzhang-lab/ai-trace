// ============================================================
// Agent Card 相关工具函数
// ============================================================

let activeAgentCandidateId = null;

function getAgentCandidateById(candidateId) {
  return (appData.agentCandidates || []).find(item => item.candidate_id === candidateId);
}

function ensureAgentState() {
  if (!Array.isArray(appData.registeredAgents)) appData.registeredAgents = [];
  if (!Array.isArray(appData.registrationQueue)) appData.registrationQueue = [];
}

/** 根据 product 返回 emoji 标识 */
function getAgentIcon(product) {
  const icons = {
    "Codex": "⚡",
    "Claude Code": "🤖",
    "QwenPaw": "🐾",
    "Antigravity": "🚀"
  };
  return icons[product] || "🔷";
}

/** 根据 workspace_mode 返回对应颜色 class */
function getWorkspaceModeBadge(mode) {
  if (mode === "multi-space") return "amber";
  if (mode === "single-space") return "green";
  return "violet";
}

/** 生成单个 Agent 候选卡片 HTML */
function renderCandidateCard(item, registeredAgent) {
  const isRegistered = Boolean(registeredAgent);
  const displayAlias = registeredAgent?.alias || item.suggested_alias || item.product;
  const statusColor = isRegistered ? "green" : "cyan";
  const statusLabel = isRegistered ? "已注册" : "候选";
  // 在线圆点：Phase 2 固定为离线占位
  const onlineDot = `<span class="agent-status-dot offline" title="在线状态检测 — Phase 3+"></span>`;
  const sessionLabel = item.session_count > 0
    ? `${item.session_count} 条会话`
    : `会话数待确认`;
  const workspaceLabel = item.workspace_count > 0
    ? `${item.workspace_count} 个工作区`
    : `工作区待发现`;

  // 记忆/偏好入口占位（P3+）
  const p3Links = `
    <div class="agent-card-p3-row">
      <button class="agent-p3-btn" disabled title="记忆文件浏览 — Phase 3+">
        📋 记忆文件 <span class="p3-tag">P3+</span>
      </button>
      <button class="agent-p3-btn" disabled title="偏好设置 — Phase 3+">
        ⚙️ 偏好文件 <span class="p3-tag">P3+</span>
      </button>
      <button class="agent-p3-btn" disabled title="会话索引 — Phase 3+">
        📂 会话索引 <span class="p3-tag">P3+</span>
      </button>
    </div>`;

  const registerBtn = isRegistered
    ? `<button class="mini accept" type="button" data-agent-register="${item.candidate_id}" style="opacity:0.55" disabled>已注册</button>`
    : `<button class="mini accept" type="button" data-agent-register="${item.candidate_id}">确认注册</button>`;

  return `
    <article class="agent-card" data-agent-id="${item.agent_id}">
      <div class="agent-card-header">
        <div class="agent-card-identity">
          <div class="agent-icon">${getAgentIcon(item.product)}</div>
          <div class="agent-card-title">
            <strong>${displayAlias}</strong>
            <span class="agent-product-name">${item.product}</span>
          </div>
        </div>
        <div class="agent-card-badges">
          ${onlineDot}
          <span class="badge ${statusColor}">${statusLabel}</span>
        </div>
      </div>

      <div class="agent-card-stats">
        <div class="agent-stat">
          <span class="agent-stat-label">会话</span>
          <strong class="agent-stat-value">${sessionLabel}</strong>
        </div>
        <div class="agent-stat">
          <span class="agent-stat-label">工作区</span>
          <strong class="agent-stat-value">${workspaceLabel}</strong>
        </div>
        <div class="agent-stat">
          <span class="agent-stat-label">模式</span>
          <strong class="agent-stat-value">
            <span class="badge ${getWorkspaceModeBadge(item.workspace_mode)} badge-sm">${item.workspace_mode}</span>
          </strong>
        </div>
      </div>

      <div class="agent-card-root">
        <span class="agent-root-label">根路径</span>
        <code class="agent-root-path">${item.root_path_masked}</code>
      </div>

      ${item.detected_markers && item.detected_markers.length ? `
        <div class="agent-card-markers">
          ${item.detected_markers.map(m => `<span class="marker-tag">${m}</span>`).join("")}
        </div>` : ""}

      ${p3Links}

      <div class="agent-card-actions">
        ${registerBtn}
      </div>
    </article>`;
}

// ============================================================
// 主渲染函数
// ============================================================

function renderAgents() {
  ensureAgentState();
  const gridTarget = document.getElementById("agents-card-grid");
  const queueTarget = document.getElementById("agents-queue-list");
  if (!gridTarget) return;

  const candidates = appData.agentCandidates || [];
  const registeredById = new Map((appData.registeredAgents || []).map(r => [r.agent_id, r]));

  if (candidates.length === 0) {
    const isRealMode = typeof currentMode !== "undefined" && currentMode === "real";
    const emptyTitle = isRealMode ? "真实数据 API 尚未开放" : "未读取到 Mock 扫描候选";
    const emptyHint = isRealMode
      ? "Phase 3 接入本地 API 后，此处会读取 /api/registry/candidates。"
      : "请从仓库根目录运行 python3 -m http.server 8787，并访问 /apps/dashboard/index.html。";
    gridTarget.innerHTML = `
      <div class="agent-empty-state">
        <div class="agent-empty-icon">🔍</div>
        <p>${emptyTitle}</p>
        <p class="path">${emptyHint}</p>
      </div>`;
  } else {
    gridTarget.innerHTML = candidates.map(item =>
      renderCandidateCard(item, registeredById.get(item.agent_id))
    ).join("");
  }

  // 注册队列面板
  if (queueTarget) {
    queueTarget.innerHTML = (appData.registrationQueue || []).map(item => `
      <article class="item">
        <div class="item-top">
          <strong>${item.action}</strong>
          <span class="badge amber">${item.status}</span>
        </div>
        <p>${item.payload.alias} → ${item.payload.product}</p>
        <div class="path">workspace ${item.payload.selected_workspace_masked || "未指定"} · ${item.generated_at}</div>
      </article>
    `).join("") || `
      <article class="item">
        <div class="item-top">
          <strong>暂无待写入事件</strong>
          <span class="badge blue">queue</span>
        </div>
        <p>注册表单提交后，先在这里生成队列事件预览，再由后端消费。</p>
      </article>`;
  }

  // 重新绑定注册按钮
  gridTarget.querySelectorAll("[data-agent-register]").forEach(button => {
    button.addEventListener("click", () => openAgentRegisterModal(button.dataset.agentRegister));
  });
}

// ============================================================
// 注册 Modal 逻辑（保持原逻辑不变）
// ============================================================

function openAgentRegisterModal(candidateId) {
  const candidate = getAgentCandidateById(candidateId);
  if (!candidate) return;
  activeAgentCandidateId = candidateId;
  const modal = document.getElementById("agent-register-modal");
  const productEl = document.getElementById("agent-form-product");
  const aliasEl = document.getElementById("agent-form-alias");
  const workspaceEl = document.getElementById("agent-form-workspace");
  const notesEl = document.getElementById("agent-form-notes");
  const candidateIdEl = document.getElementById("agent-form-candidate-id");
  const metaEl = document.getElementById("agent-form-meta");
  if (!modal || !productEl || !aliasEl || !workspaceEl || !notesEl || !candidateIdEl || !metaEl) return;

  candidateIdEl.value = candidate.candidate_id;
  productEl.value = candidate.product;
  aliasEl.value = candidate.suggested_alias || candidate.product;
  notesEl.value = candidate.notes || "";

  const workspaceOptions = candidate.sample_workspaces_masked && candidate.sample_workspaces_masked.length
    ? candidate.sample_workspaces_masked
    : [candidate.root_path_masked];
  const defaultWorkspaceMasked = candidate.selected_workspace_masked
    || ((candidate.sample_workspaces || []).indexOf(candidate.selected_workspace) >= 0
      ? workspaceOptions[(candidate.sample_workspaces || []).indexOf(candidate.selected_workspace)]
      : workspaceOptions[0]);
  workspaceEl.innerHTML = workspaceOptions.map(item => `
    <option value="${item}" ${item === defaultWorkspaceMasked ? "selected" : ""}>${item}</option>
  `).join("");
  metaEl.innerHTML = `
    <div class="path">根路径 ${candidate.root_path_masked}</div>
    <div class="path">模式 ${candidate.workspace_mode} · 来源 ${candidate.session_source_type}</div>
    <div class="path">标记 ${(candidate.detected_markers || []).join(", ") || "none"}</div>
  `;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeAgentRegisterModal() {
  const modal = document.getElementById("agent-register-modal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  activeAgentCandidateId = null;
}

function submitAgentRegistration(event) {
  event.preventDefault();
  ensureAgentState();
  const candidate = getAgentCandidateById(activeAgentCandidateId);
  if (!candidate) return;

  const alias = document.getElementById("agent-form-alias").value.trim() || candidate.product;
  const selectedWorkspaceMasked = document.getElementById("agent-form-workspace").value || "";
  const notes = document.getElementById("agent-form-notes").value.trim();
  const selectedWorkspaceIndex = (candidate.sample_workspaces_masked || []).indexOf(selectedWorkspaceMasked);
  const selectedWorkspace = selectedWorkspaceIndex >= 0
    ? (candidate.sample_workspaces || [])[selectedWorkspaceIndex] || null
    : null;

  const registered = {
    agent_id: candidate.agent_id,
    candidate_id: candidate.candidate_id,
    product: candidate.product,
    alias,
    workspace_mode: candidate.workspace_mode,
    selected_workspace: selectedWorkspace,
    selected_workspace_masked: selectedWorkspaceMasked || null,
    root_path_private: candidate.root_path,
    root_path_masked: candidate.root_path_masked,
    session_source_type: candidate.session_source_type,
    session_index_path: candidate.session_index_path,
    session_count: candidate.session_count || 0,
    workspace_count: candidate.workspace_count || 0,
    notes,
    status: "registered",
    detected_markers: candidate.detected_markers,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const queueEvent = {
    id: `queue-${Date.now()}`,
    action: "register_agent",
    status: "queued",
    generated_at: new Date().toISOString(),
    payload: registered
  };

  appData.registrationQueue.unshift(queueEvent);
  appData.registeredAgents = appData.registeredAgents.filter(item => item.agent_id !== registered.agent_id);
  appData.registeredAgents.unshift(registered);
  renderAgents();
  if (typeof updateCounts === "function") updateCounts();
  closeAgentRegisterModal();
}

function initAgentControls() {
  const form = document.getElementById("agent-register-form");
  const closeButton = document.getElementById("agent-register-close");
  const cancelButton = document.getElementById("agent-form-cancel");
  if (form) form.addEventListener("submit", submitAgentRegistration);
  if (closeButton) closeButton.addEventListener("click", closeAgentRegisterModal);
  if (cancelButton) cancelButton.addEventListener("click", closeAgentRegisterModal);
  document.querySelectorAll("[data-close-agent-modal='true']").forEach(node => {
    node.addEventListener("click", closeAgentRegisterModal);
  });
}
