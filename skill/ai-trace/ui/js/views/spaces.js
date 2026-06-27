// ============================================================
// Spaces View — Manage + Intake Modal
// ============================================================

let spacesFilter = 'all';
let spaceIntakeFilter = 'pending';
let pendingSpaceId = null;
const purposeTagColors = {
  '工程': 'green',
  '配置': 'blue',
  '文档': 'violet',
  '未声明': 'gray'
};
window.purposeTagColors = purposeTagColors;

function canEditSpaces() {
  if (typeof canWriteSpaces === 'function') return canWriteSpaces();
  return false;
}

function getSpaceIntakeStatus(space) {
  return space.intake_status || 'unregistered';
}

function getManagedSpaces() {
  return (appData.spaces || []).filter(space => getSpaceIntakeStatus(space) === 'registered');
}

function getPendingSpaces() {
  return (appData.spaces || []).filter(space => getSpaceIntakeStatus(space) !== 'registered');
}

function openSpaceModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeSpaceModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

function renderSpaceCard(space) {
  const tagColor = purposeTagColors[space.purpose_tag] || 'gray';
  const writable = canEditSpaces();
  const agentsHtml = (space.agent_ids || []).map(id => `
    <div class="space-agent-row">
      <span class="space-agent-name">${id}</span>
      <span class="badge badge-sm blue">关联</span>
    </div>`).join('');
  const scanTime = space.last_scan ? relativeTime(space.last_scan) : '—';

  return `
    <div class="space-card" data-space-id="${space.space_id}">
      <div class="space-card-header">
        <div class="space-card-left">
          <span class="space-icon">📁</span>
          <div class="space-card-info">
            <strong class="space-path">${space.path_masked}</strong>
            <span class="space-scan-time">last scan ${scanTime}</span>
          </div>
        </div>
        <div class="space-card-right">
          <span class="purpose-tag badge badge-sm ${tagColor}">${space.purpose_tag}</span>
          <span class="chevron">›</span>
        </div>
      </div>
      <div class="space-card-body">
        <div class="space-section">
          <div class="space-section-title">用途声明</div>
          <div class="space-purpose-row">
            <input class="space-purpose-input" type="text" value="${space.purpose || ''}" placeholder="输入该目录的用途说明…" data-space-id="${space.space_id}" ${writable ? '' : 'disabled'}>
            <span class="space-visibility-label">AI 可见性</span>
            <select class="space-visibility-select" data-space-id="${space.space_id}" ${writable ? '' : 'disabled'}>
              <option value="all" ${space.visibility === 'all' ? 'selected' : ''}>全部 Agent</option>
              <option value="none" ${space.visibility === 'none' ? 'selected' : ''}>不对外</option>
            </select>
          </div>
        </div>
        ${space.agent_ids?.length ? `
        <div class="space-section">
          <div class="space-section-title">关联 Agent (${space.agent_ids.length})</div>
          <div class="space-agents-list">${agentsHtml}</div>
        </div>` : ''}
      </div>
      <div class="space-card-footer">
        <span>${space.agent_count} 个 Agent</span>
        ${writable ? '<span class="ok-text">可编辑</span>' : '<span class="warn-text">仅 Live 可编辑</span>'}
      </div>
    </div>`;
}

function renderSpaces() {
  const grid = document.getElementById('spaces-grid');
  const note = document.getElementById('spaces-subview-note');
  const openBtn = document.getElementById('spaces-pending-open');
  if (!grid) return;
  if (note) note.textContent = '默认查看已注册空间；待接入与已忽略项统一收进弹窗。';

  const pendingCount = getPendingSpaces().filter(space => getSpaceIntakeStatus(space) === 'unregistered').length;
  if (openBtn) openBtn.textContent = `待接入空间 ${pendingCount > 0 ? `(${pendingCount})` : ''}`;

  let spaces = getManagedSpaces();
  if (spacesFilter !== 'all') {
    spaces = spaces.filter(space => space.purpose_tag === spacesFilter);
  }

  if (spaces.length === 0) {
    grid.innerHTML = '<div class="empty-text">暂无已注册空间</div>';
  } else {
    grid.innerHTML = spaces.map(renderSpaceCard).join('');
    grid.querySelectorAll('.space-card-header').forEach(header => {
      header.addEventListener('click', () => header.closest('.space-card')?.classList.toggle('expanded'));
    });
    grid.querySelectorAll('.space-purpose-input').forEach(input => {
      input.addEventListener('blur', () => saveSpaceCard(input.dataset.spaceId));
    });
    grid.querySelectorAll('.space-visibility-select').forEach(select => {
      select.addEventListener('change', () => saveSpaceCard(select.dataset.spaceId));
    });
  }
  renderSpaceIntakeModal();
}

function renderSpaceIntakeRow(space) {
  const status = getSpaceIntakeStatus(space);
  const primaryAction = status === 'skipped'
    ? `<button class="tool" type="button" data-space-reset="${space.space_id}">恢复待处理</button>`
    : `<button class="tool primary" type="button" data-space-register="${space.space_id}" ${canEditSpaces() ? '' : 'disabled'}>接入</button>`;
  const secondaryAction = status === 'skipped' ? '' : `<button class="tool" type="button" data-space-skip="${space.space_id}">暂不接入</button>`;
  return `
    <div class="intake-row">
      <div class="intake-main">
        <div class="manage-card-title"><span class="space-icon-sm">📁</span><strong>${space.path_masked}</strong></div>
        <div class="intake-meta"><span>${space.purpose_tag}</span><span>${space.agent_count} Agent</span><span>${space.last_scan ? relativeTime(space.last_scan) : '—'}</span></div>
      </div>
      <div class="intake-actions">
        <span class="status-badge ${(status === 'skipped' ? 'path-error' : 'unregistered')}">${status === 'skipped' ? '已忽略' : '未注册'}</span>
        ${primaryAction}
        ${secondaryAction}
      </div>
    </div>`;
}

function renderSpaceIntakeModal() {
  const host = document.getElementById('space-intake-list');
  if (!host) return;
  const items = getPendingSpaces().filter(space => {
    const status = getSpaceIntakeStatus(space);
    if (spaceIntakeFilter === 'skipped') return status === 'skipped';
    return status === 'unregistered';
  });
  host.innerHTML = items.length ? items.map(renderSpaceIntakeRow).join('') : '<div class="empty-text">当前筛选下没有待接入空间</div>';
  host.querySelectorAll('[data-space-register]').forEach(btn => btn.addEventListener('click', () => openSpaceRegisterModal(btn.dataset.spaceRegister)));
  host.querySelectorAll('[data-space-skip]').forEach(btn => btn.addEventListener('click', () => updateSpaceIntakeStatus(btn.dataset.spaceSkip, 'skipped')));
  host.querySelectorAll('[data-space-reset]').forEach(btn => btn.addEventListener('click', () => updateSpaceIntakeStatus(btn.dataset.spaceReset, 'unregistered')));
}

function openSpaceRegisterModal(spaceId) {
  const space = (appData.spaces || []).find(item => item.space_id === spaceId);
  if (!space) return;
  pendingSpaceId = spaceId;
  const info = document.getElementById('space-register-info');
  if (info) {
    info.innerHTML = `
      <div class="reg-info-grid">
        <span class="reg-key">space</span><span class="reg-val"><code>${space.path_masked}</code></span>
        <span class="reg-key">当前标签</span><span class="reg-val">${space.purpose_tag}</span>
        <span class="reg-key">关联 Agent</span><span class="reg-val">${space.agent_count || 0}</span>
      </div>`;
  }
  document.getElementById('space-form-purpose').value = space.purpose || '';
  document.getElementById('space-form-purpose-tag').value = space.purpose_tag || '未声明';
  document.getElementById('space-form-visibility').value = space.visibility || 'all';
  openSpaceModal('space-register-modal');
}

function closeSpaceRegisterModal() {
  pendingSpaceId = null;
  closeSpaceModal('space-register-modal');
}

async function updateSpaceIntakeStatus(spaceId, status) {
  if (!canEditSpaces()) {
    alert('当前不是可写的 Live API 状态，无法更新空间状态。');
    return;
  }
  try {
    const res = await fetch('/api/registry/spaces/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: spaceId, status })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || '状态更新失败');
    await loadData();
    renderAll();
  } catch (error) {
    alert('空间状态更新失败: ' + error.message);
  }
}

async function saveSpaceCard(spaceId) {
  if (!canEditSpaces()) return;
  const card = document.querySelector(`.space-card[data-space-id="${spaceId}"]`);
  if (!card) return;
  const current = (appData.spaces || []).find(item => item.space_id === spaceId);
  const purpose = card.querySelector('.space-purpose-input')?.value || '';
  const visibility = card.querySelector('.space-visibility-select')?.value || 'all';
  const purposeTag = current?.purpose_tag || '未声明';
  try {
    const res = await fetch('/api/registry/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: spaceId, purpose, visibility, purpose_tag: purposeTag })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || '保存失败');
    await loadData();
    renderAll();
  } catch (error) {
    alert('空间保存失败: ' + error.message);
  }
}

async function confirmSpaceRegistration() {
  if (!pendingSpaceId) return;
  if (!canEditSpaces()) {
    alert('当前不是可写的 Live API 状态，无法接入空间。');
    return;
  }
  const purpose = document.getElementById('space-form-purpose')?.value.trim() || '';
  const purposeTag = document.getElementById('space-form-purpose-tag')?.value || '未声明';
  const visibility = document.getElementById('space-form-visibility')?.value || 'all';
  try {
    const res = await fetch('/api/registry/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: pendingSpaceId, purpose, purpose_tag: purposeTag, visibility })
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || '接入失败');
    closeSpaceRegisterModal();
    await loadData();
    renderAll();
  } catch (error) {
    alert('空间接入失败: ' + error.message);
  }
}

async function rescanSpacesIntake() {
  if (!canEditSpaces()) {
    alert('当前不是可写的 Live API 状态，无法执行真实扫描。');
    return;
  }
  try {
    const res = await fetch('/api/scan', { method: 'POST' });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || '扫描失败');
    await loadData();
    renderAll();
  } catch (error) {
    alert('重新扫描失败: ' + error.message);
  }
}

function initSpacesControls() {
  document.querySelectorAll('#spaces-filter-tabs .filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      spacesFilter = tab.dataset.filter;
      document.querySelectorAll('#spaces-filter-tabs .filter-tab').forEach(node => node.classList.toggle('active', node === tab));
      renderSpaces();
    });
  });
  document.getElementById('spaces-pending-open')?.addEventListener('click', () => {
    openSpaceModal('space-intake-modal');
    renderSpaceIntakeModal();
  });
  document.getElementById('space-intake-close')?.addEventListener('click', () => closeSpaceModal('space-intake-modal'));
  document.getElementById('space-intake-rescan')?.addEventListener('click', rescanSpacesIntake);
  document.querySelectorAll('#space-intake-tabs .filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      spaceIntakeFilter = tab.dataset.filter;
      document.querySelectorAll('#space-intake-tabs .filter-tab').forEach(node => node.classList.toggle('active', node === tab));
      renderSpaceIntakeModal();
    });
  });
  document.getElementById('space-register-close')?.addEventListener('click', closeSpaceRegisterModal);
  document.getElementById('space-form-cancel')?.addEventListener('click', closeSpaceRegisterModal);
  document.getElementById('space-form-confirm')?.addEventListener('click', confirmSpaceRegistration);
}
