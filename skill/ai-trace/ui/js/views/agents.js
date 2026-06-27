// ============================================================
// Agents View — Card Workbench + Intake Modal
// ============================================================

let agentsSearch = '';
let selectedAgentCandidateId = null;
let agentIntakeFilter = 'pending';
let pendingRegisterId = null;

const STATUS_CONFIG = {
  registered: { label: '已注册', cls: 'registered' },
  unregistered: { label: '未注册', cls: 'unregistered' },
  skipped: { label: '已忽略', cls: 'path-error' },
  failed: { label: '需关注', cls: 'failed' },
  path_error: { label: '路径错误', cls: 'path-error' },
};

function getAgentIcon(product) {
  const icons = {
    'Codex': '⚡', 'Claude Code': '🤖',
    'QwenPaw': '🐾', 'Antigravity': '🚀',
    'cursor': '✦', 'windsurf': '〰'
  };
  return icons[product] || '◆';
}

function canOpenRegister() {
  if (typeof canWriteRegistry === 'function') return canWriteRegistry();
  return false;
}

function getWorkspaceContext(candidate) {
  const workspace = candidate.selected_workspace_masked;
  if (!workspace) return '—';
  const root = candidate.root_path_masked || '';
  if (root && workspace.startsWith(root + '/')) return workspace.slice(root.length + 1);
  return workspace;
}

function getWorkspaceOptions(candidate) {
  const masked = candidate.sample_workspaces_masked || [];
  if (masked.length > 0) return masked;
  if (candidate.selected_workspace_masked) return [candidate.selected_workspace_masked];
  return [];
}

function getRegisteredCard(candidate) {
  return (appData.registeredAgents || []).find(card =>
    (card.product || '') === (candidate.product || '')
    && (card.selected_workspace_masked || '') === (candidate.selected_workspace_masked || '')
  ) || null;
}

function getDisplayName(candidate) {
  const card = getRegisteredCard(candidate);
  return card?.alias || candidate.suggested_alias || candidate.agent_root || candidate.product;
}

function getProductLabel(candidate) {
  return candidate.product || 'Unknown';
}

function getInstanceLabel(candidate) {
  const display = getDisplayName(candidate);
  const product = getProductLabel(candidate);
  return display === product ? '' : product;
}

function getCandidateStatus(candidate) {
  return candidate.intake_status || 'unregistered';
}

function needsAttention(candidate) {
  return ['failed', 'path_error'].includes(candidate.status);
}

function getManageCandidates() {
  return (appData.agentCandidates || []).filter(candidate => getCandidateStatus(candidate) === 'registered');
}

function getPendingCandidates() {
  return (appData.agentCandidates || []).filter(candidate => getCandidateStatus(candidate) !== 'registered');
}

function getAgentIndexStatus(candidate) {
  if ((candidate.session_count || 0) > 0) return '待索引';
  return '未发现会话';
}

function getAgentSummaryStatus(candidate) {
  return getCandidateStatus(candidate) === 'registered' ? '已注册' : '未注册';
}

function getOverviewAgents() {
  let items = getManageCandidates();
  if (agentsSearch) {
    const q = agentsSearch.toLowerCase();
    items = items.filter(candidate =>
      (candidate.product || '').toLowerCase().includes(q) ||
      (getDisplayName(candidate) || '').toLowerCase().includes(q) ||
      (candidate.agent_root || '').toLowerCase().includes(q) ||
      (candidate.root_path_masked || '').toLowerCase().includes(q) ||
      (getWorkspaceContext(candidate) || '').toLowerCase().includes(q)
    );
  }
  items.sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));
  return items;
}

function ensureSelectedAgent(items) {
  if (!items.length) {
    selectedAgentCandidateId = null;
    return null;
  }
  const current = items.find(item => item.candidate_id === selectedAgentCandidateId);
  if (current) return current;
  selectedAgentCandidateId = items[0].candidate_id;
  return items[0];
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function renderAgentDrawer(candidate) {
  const host = document.getElementById('agents-detail-drawer');
  if (!host) return;
  if (!candidate) {
    host.innerHTML = '<div class="panel drawer-panel"><div class="panel-body"><div class="empty-text">选择 1 张卡片后，在这里查看索引摘要。</div></div></div>';
    return;
  }

  host.innerHTML = `
    <div class="panel drawer-panel">
      <div class="panel-head">
        <h3>索引摘要</h3>
        <span>Phase 2 占位信息</span>
      </div>
      <div class="panel-body drawer-body">
        <div class="drawer-hero">
          <div>
            <div class="manage-card-title"><span class="agent-row-icon">${getAgentIcon(candidate.product)}</span><strong>${getDisplayName(candidate)}</strong></div>
            ${getInstanceLabel(candidate) ? `<div class="manage-card-subtitle">${getInstanceLabel(candidate)}</div>` : ''}
          </div>
          <span class="status-badge registered">${getAgentSummaryStatus(candidate)}</span>
        </div>
        <div class="drawer-grid">
          <span class="meta-key">类型</span><span class="meta-val">${getProductLabel(candidate)}</span>
          <span class="meta-key">地址</span><span class="meta-val"><code>${candidate.root_path_masked || '—'}</code></span>
          <span class="meta-key">工作区</span><span class="meta-val">${getWorkspaceContext(candidate)}</span>
          <span class="meta-key">会话数</span><span class="meta-val">${candidate.session_count || 0}</span>
          <span class="meta-key">最近扫描</span><span class="meta-val">${relativeTime(candidate.scanned_at || candidate.updated_at || candidate.created_at)}</span>
          <span class="meta-key">索引状态</span><span class="meta-val">${getAgentIndexStatus(candidate)}</span>
        </div>
        <div class="drawer-note">当前只展示索引摘要，不展开会话列表、索引筛选与全文处理。</div>
      </div>
    </div>`;
}

function renderAgentsOverview() {
  const panel = document.getElementById('agents-overview-panel');
  const openBtn = document.getElementById('agents-pending-open');
  if (!panel) return;

  const agents = getOverviewAgents();
  const pendingCount = getPendingCandidates().filter(item => getCandidateStatus(item) === 'unregistered').length;
  if (openBtn) openBtn.textContent = `待接入 Agent ${pendingCount > 0 ? `(${pendingCount})` : ''}`;

  if (agents.length === 0) {
    panel.innerHTML = '<div class="panel"><div class="panel-body"><div class="empty-text">暂无已注册 Agent，请从“待接入 Agent”开始。</div></div></div>';
    renderAgentDrawer(null);
    return;
  }

  const selected = ensureSelectedAgent(agents);
  const cards = agents.map(agent => {
    const hash = (agent.agent_id || '').split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const colors = ['#14734f', '#0d8295', '#6651a5', '#a06400'];
    const screens = ['#355f58', '#22485c', '#4f456f', '#5c4c24'];
    const accent = colors[hash % colors.length];
    const screen = screens[hash % screens.length];
    const activeCls = agent.candidate_id === selected?.candidate_id ? ' desk-selected' : '';
    return `
      <article class="desk desk-clickable${activeCls}" data-agent-card="${agent.candidate_id}" style="--accent:${accent};--screen:${screen}">
        <div class="desk-top">
          <div class="desk-name">
            <strong>${getDisplayName(agent)}</strong>
            <span>${getProductLabel(agent)}</span>
          </div>
          <span class="badge green">active</span>
        </div>
        <div class="monitor" aria-hidden="true"></div>
        <div class="desk-foot">
          <span>${relativeTime(agent.scanned_at || agent.updated_at || agent.created_at)}</span>
          <span>${agent.session_count || 0} sessions</span>
        </div>
      </article>`;
  }).join('');

  panel.innerHTML = `
    <div class="metrics metrics-overview">
      <div class="metric"><span>在线席位</span><strong>${agents.length}</strong></div>
      <div class="metric"><span>待接入</span><strong>${pendingCount}</strong></div>
      <div class="metric"><span>当前阶段</span><strong class="metric-text">Phase 2</strong></div>
    </div>
    <div class="agents-workbench">
      <div class="panel">
        <div class="panel-head">
          <h3>Agent Live Floor</h3>
          <span>点击卡片查看索引摘要</span>
        </div>
        <div class="panel-body office">
          <div class="desks">${cards}</div>
        </div>
      </div>
      <div id="agents-detail-drawer"></div>
    </div>`;

  panel.querySelectorAll('[data-agent-card]').forEach(node => {
    node.addEventListener('click', () => {
      selectedAgentCandidateId = node.dataset.agentCard;
      renderAgentsOverview();
    });
  });

  renderAgentDrawer(selected);
}

function renderAgentIntakeRow(candidate) {
  const status = getCandidateStatus(candidate);
  const context = getWorkspaceContext(candidate);
  const warning = needsAttention(candidate) && candidate.error_message ? `<div class="row-error">${candidate.error_message}</div>` : '';
  const primaryAction = status === 'skipped'
    ? `<button class="tool" type="button" data-agent-reset="${candidate.candidate_id}">恢复待处理</button>`
    : `<button class="tool primary" type="button" data-agent-register="${candidate.candidate_id}" ${canOpenRegister() ? '' : 'disabled'}>接入</button>`;
  const secondaryAction = status === 'skipped'
    ? ''
    : `<button class="tool" type="button" data-agent-skip="${candidate.candidate_id}">暂不接入</button>`;
  return `
    <div class="intake-row">
      <div class="intake-main">
        <div class="manage-card-title"><span class="agent-row-icon">${getAgentIcon(candidate.product)}</span><strong>${getDisplayName(candidate)}</strong></div>
        ${getInstanceLabel(candidate) ? `<div class="manage-card-subtitle">${getInstanceLabel(candidate)}</div>` : ''}
        <div class="intake-meta"><code>${candidate.root_path_masked || '—'}</code><span>${context}</span><span>${candidate.session_count || 0} sessions</span></div>
        ${warning}
      </div>
      <div class="intake-actions">
        <span class="status-badge ${(STATUS_CONFIG[status] || STATUS_CONFIG.unregistered).cls}">${(STATUS_CONFIG[status] || STATUS_CONFIG.unregistered).label}</span>
        ${primaryAction}
        ${secondaryAction}
      </div>
    </div>`;
}

function renderAgentIntakeModal() {
  const host = document.getElementById('agent-intake-list');
  if (!host) return;
  const items = getPendingCandidates().filter(candidate => {
    const status = getCandidateStatus(candidate);
    if (agentIntakeFilter === 'skipped') return status === 'skipped';
    return status === 'unregistered';
  });
  host.innerHTML = items.length ? items.map(renderAgentIntakeRow).join('') : '<div class="empty-text">当前筛选下没有待处理 Agent</div>';

  host.querySelectorAll('[data-agent-register]').forEach(btn => {
    btn.addEventListener('click', () => openRegisterModal(btn.dataset.agentRegister));
  });
  host.querySelectorAll('[data-agent-skip]').forEach(btn => {
    btn.addEventListener('click', () => updateAgentIntakeStatus(btn.dataset.agentSkip, 'skipped'));
  });
  host.querySelectorAll('[data-agent-reset]').forEach(btn => {
    btn.addEventListener('click', () => updateAgentIntakeStatus(btn.dataset.agentReset, 'unregistered'));
  });
}

async function updateAgentIntakeStatus(candidateId, status) {
  if (!canOpenRegister()) {
    alert('当前不是可写的 Live API 状态，无法更新接入状态。');
    return;
  }
  try {
    const res = await fetch('/api/registry/agents/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_id: candidateId, status })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || '状态更新失败');
    await loadData();
    renderAll();
    renderAgentIntakeModal();
  } catch (error) {
    alert('Agent 状态更新失败: ' + error.message);
  }
}

function openRegisterModal(candidateId) {
  const candidate = (appData.agentCandidates || []).find(c => c.candidate_id === candidateId);
  if (!candidate) return;
  pendingRegisterId = candidateId;

  const info = document.getElementById('register-info');
  const aliasInput = document.getElementById('agent-form-alias');
  const workspaceSelect = document.getElementById('agent-form-workspace');
  const notesInput = document.getElementById('agent-form-notes');
  const confirmBtn = document.getElementById('agent-form-confirm');
  if (info) {
    info.innerHTML = `
      <div class="reg-info-grid">
        <span class="reg-key">agent_root</span><span class="reg-val">${candidate.agent_root || candidate.product}</span>
        <span class="reg-key">地址</span><span class="reg-val"><code>${candidate.root_path_masked}</code></span>
        <span class="reg-key">工作区</span><span class="reg-val">${getWorkspaceContext(candidate)}</span>
      </div>`;
  }
  if (aliasInput) aliasInput.value = candidate.suggested_alias || candidate.product;
  if (notesInput) notesInput.value = candidate.notes || '';
  if (workspaceSelect) {
    const options = getWorkspaceOptions(candidate);
    workspaceSelect.innerHTML = options.map(item => `<option value="${item}" ${item === candidate.selected_workspace_masked ? 'selected' : ''}>${item}</option>`).join('');
  }
  if (confirmBtn) confirmBtn.disabled = !canOpenRegister();
  openModal('agent-register-modal');
}

function closeRegisterModal() {
  pendingRegisterId = null;
  closeModal('agent-register-modal');
}

async function confirmRegistration() {
  if (!pendingRegisterId) return;
  if (!canOpenRegister()) {
    alert('当前不是可写的 Live API 状态，无法真实注册。');
    return;
  }
  const candidate = (appData.agentCandidates || []).find(c => c.candidate_id === pendingRegisterId);
  if (!candidate) return;

  const alias = document.getElementById('agent-form-alias')?.value.trim() || candidate.suggested_alias || candidate.product;
  const workspace = document.getElementById('agent-form-workspace')?.value || candidate.selected_workspace_masked || '';
  const notes = document.getElementById('agent-form-notes')?.value.trim() || '';
  const confirmBtn = document.getElementById('agent-form-confirm');
  if (confirmBtn) {
    confirmBtn.textContent = '接入中…';
    confirmBtn.disabled = true;
  }

  try {
    const res = await fetch('/api/registry/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_id: candidate.candidate_id, alias, workspace, notes })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || 'Registration failed');
    closeRegisterModal();
    await loadData();
    renderAll();
    renderAgentIntakeModal();
  } catch (err) {
    alert('注册失败: ' + err.message);
  } finally {
    if (confirmBtn) {
      confirmBtn.textContent = '确认注册';
      confirmBtn.disabled = !canOpenRegister();
    }
  }
}

async function rescanFromIntake() {
  if (!canOpenRegister()) {
    alert('当前不是可写的 Live API 状态，无法执行真实扫描。');
    return;
  }
  try {
    const res = await fetch('/api/scan', { method: 'POST' });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || '扫描失败');
    await loadData();
    renderAll();
    renderAgentIntakeModal();
  } catch (error) {
    alert('重新扫描失败: ' + error.message);
  }
}

function renderHomeView() {
  const spacesList = document.getElementById('home-spaces-list');
  if (spacesList) {
    const spaces = appData.spaces || [];
    const registeredSpaces = spaces.filter(space => space.intake_status === 'registered');
    if (registeredSpaces.length === 0) {
      spacesList.innerHTML = '<div class="empty-text">未发现已注册空间</div>';
    } else {
      spacesList.innerHTML = registeredSpaces.slice(0, 4).map(space => `
        <div class="home-space-row">
          <span class="space-icon-sm">📁</span>
          <span class="home-space-path">${space.path_masked}</span>
          <span class="badge badge-sm ${(window.purposeTagColors?.[space.purpose_tag]) || 'gray'}">${space.purpose_tag}</span>
          <span class="home-space-agents">${space.agent_count} Agent</span>
        </div>`).join('');
    }
  }

  const pendingList = document.getElementById('home-pending-agents');
  if (pendingList) {
    const pending = (appData.agentCandidates || []).filter(c => getCandidateStatus(c) === 'unregistered');
    if (pending.length === 0) {
      pendingList.innerHTML = '<div class="empty-text success-text">✓ 当前没有待接入 Agent</div>';
    } else {
      pendingList.innerHTML = pending.slice(0, 5).map(candidate => `
        <div class="home-pending-row">
          <span class="agent-row-icon-sm">${getAgentIcon(candidate.product)}</span>
          <span class="home-pending-name">${candidate.agent_root || candidate.product}</span>
          <code class="home-pending-path">${candidate.root_path_masked}</code>
          <button class="row-action-btn primary small" ${canOpenRegister() ? '' : 'disabled'} data-home-open-agents="true">待接入</button>
        </div>`).join('');
      pendingList.querySelectorAll('[data-home-open-agents]').forEach(btn => {
        btn.addEventListener('click', () => {
          switchView('agents');
          openModal('agent-intake-modal');
          renderAgentIntakeModal();
        });
      });
    }
  }
}

function renderAgents() {
  renderAgentsOverview();
  renderAgentIntakeModal();
}

function initAgentControls() {
  const searchInput = document.getElementById('agents-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      agentsSearch = searchInput.value;
      renderAgentsOverview();
    });
  }

  document.getElementById('agents-pending-open')?.addEventListener('click', () => {
    openModal('agent-intake-modal');
    renderAgentIntakeModal();
  });
  document.getElementById('agent-intake-close')?.addEventListener('click', () => closeModal('agent-intake-modal'));
  document.getElementById('agent-intake-rescan')?.addEventListener('click', rescanFromIntake);
  document.querySelectorAll('#agent-intake-tabs .filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      agentIntakeFilter = tab.dataset.filter;
      document.querySelectorAll('#agent-intake-tabs .filter-tab').forEach(node => node.classList.toggle('active', node === tab));
      renderAgentIntakeModal();
    });
  });

  document.getElementById('agent-register-close')?.addEventListener('click', closeRegisterModal);
  document.getElementById('agent-form-cancel')?.addEventListener('click', closeRegisterModal);
  document.getElementById('agent-form-confirm')?.addEventListener('click', confirmRegistration);
}
