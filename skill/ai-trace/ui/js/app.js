// ============================================================
// AI Trace — app.js
// 全局模式、数据加载、视图路由
// ============================================================

const MODE_STORAGE_KEY = 'ai-trace-mode';
let activeView = 'office';
let APP_MODE = (() => {
  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY) || 'live';
    return stored === 'mock' ? 'mock' : 'live';
  } catch (_) {
    return 'live';
  }
})();
let activeDataSource = 'Unknown';
let activeSourceDetail = {};

const DATA_SOURCES = {
  candidates: {
    live: '/api/registry/candidates',
    mock: '../../mock/data/registry/agent_candidates.json'
  },
  registered: {
    live: '/api/registry/registered',
    mock: '../../mock/data/registry/registered_agents.json'
  },
  workspaces: {
    live: '/api/registry/workspaces',
    mock: '../../mock/data/registry/workspace_candidates.json'
  },
  spaces: {
    live: '/api/registry/spaces',
    mock: '../../mock/data/registry/spaces.json'
  }
};

async function fetchOne(url, label) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return { source: label, data };
    }
  } catch (_) {}
  return { source: 'None', data: null };
}

async function fetchSource(key) {
  const src = DATA_SOURCES[key];
  if (!src) return { source: 'None', data: null };
  if (APP_MODE === 'mock') return fetchOne(src.mock, 'Mock Data');
  return fetchOne(src.live, 'Live API');
}

function canWriteRegistry() {
  if (APP_MODE !== 'live') return false;
  return activeSourceDetail.candidates === 'Live API' && activeSourceDetail.registered === 'Live API';
}

function canWriteSpaces() {
  if (APP_MODE !== 'live') return false;
  return activeSourceDetail.spaces === 'Live API';
}

window.canWriteRegistry = canWriteRegistry;
window.canWriteSpaces = canWriteSpaces;
window.getAppMode = () => APP_MODE;
window.getActiveDataSource = () => activeDataSource;

async function loadData() {
  const [cRes, rRes, wRes, sRes] = await Promise.all([
    fetchSource('candidates'),
    fetchSource('registered'),
    fetchSource('workspaces'),
    fetchSource('spaces')
  ]);

  activeSourceDetail = {
    candidates: cRes.source,
    registered: rRes.source,
    workspaces: wRes.source,
    spaces: sRes.source,
  };

  appData.agentCandidates = (cRes.data?.candidates) || [];
  appData.registeredAgents = (rRes.data?.agents) || [];
  appData.workspaceCandidates = Array.isArray(wRes.data) ? wRes.data : [];
  appData.spaces = (sRes.data?.spaces) || [];

  const sources = Object.values(activeSourceDetail).filter(source => source !== 'None');
  if (sources.length === 0) {
    activeDataSource = 'Empty';
  } else if (sources.includes('Live API')) {
    activeDataSource = 'Live API';
  } else {
    activeDataSource = 'Mock Data';
  }

  updateDataIndicators();
}

function updateDataIndicators() {
  const badge = document.getElementById('data-source-badge');
  if (badge) {
    badge.textContent = activeDataSource;
    badge.className = 'badge ' + (
      activeDataSource === 'Live API' ? 'green' :
      activeDataSource === 'Mock Data' ? 'amber' : 'gray'
    );
  }

  ['api-dot', 'agents-api-dot'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'api-dot ' + (activeDataSource === 'Live API' ? 'live' : 'offline');
  });

  const apiLabel = document.getElementById('api-label');
  if (apiLabel) {
    apiLabel.textContent = canWriteRegistry() ? 'API 已连接' : 'Mock 模式';
  }
}

function setMode(mode) {
  APP_MODE = mode === 'mock' ? 'mock' : 'live';
  try {
    localStorage.setItem(MODE_STORAGE_KEY, APP_MODE);
  } catch (_) {}
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === APP_MODE);
  });
  loadData().then(renderAll);
}

function initModeToggle() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === APP_MODE);
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });
}

function switchView(view) {
  if (!view) return;
  activeView = view;

  document.querySelectorAll('.view').forEach(node => {
    const isActive = node.id === view;
    node.classList.toggle('hidden', !isActive);
    if (isActive) setTimeout(() => { node.style.opacity = 1; }, 10);
    else node.style.opacity = 0;
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });

  if (appTitles[view]) {
    document.getElementById('eyebrow').textContent = appTitles[view][0];
    document.getElementById('page-title').textContent = appTitles[view][1];
    document.getElementById('page-subtitle').textContent = appTitles[view][2];
  }
}

function setEl(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '—';
}

function relativeTime(isoStr) {
  if (!isoStr) return '—';
  const diff = Date.now() - new Date(isoStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min}min ago`;
  const h = Math.floor(min / 60);
  return `${h}h ago`;
}
window.relativeTime = relativeTime;

function maxIso(values) {
  const filtered = values.filter(Boolean);
  if (filtered.length === 0) return null;
  return filtered.sort().at(-1);
}

function updateCounts() {
  const candidates = appData.agentCandidates || [];
  const spaces = appData.spaces || [];
  const registeredAgents = candidates.filter(c => c.intake_status === 'registered').length;
  const pendingAgents = candidates.filter(c => c.intake_status === 'unregistered').length;
  const registeredSpaces = spaces.filter(s => s.intake_status === 'registered').length;
  const failed = candidates.filter(c => c.status === 'failed' || c.status === 'path_error').length;
  const latestCandidateScan = maxIso(candidates.map(c => c.scanned_at));
  const latestSpaceScan = maxIso(spaces.map(s => s.last_scan));

  setEl('spaces-count', spaces.length);
  setEl('agents-count', candidates.length);
  setEl('home-spaces-total', spaces.length);
  setEl('home-spaces-declared', registeredSpaces);
  setEl('home-agents-total', candidates.length);
  setEl('home-agents-registered', registeredAgents);
  setEl('home-agents-unregistered', pendingAgents);
  setEl('sb-spaces-total', spaces.length);
  setEl('sb-spaces-declared', registeredSpaces);
  setEl('sb-spaces-scan', latestSpaceScan ? relativeTime(latestSpaceScan) : '—');
  setEl('sb-agents-total', candidates.length);
  setEl('sb-agents-registered', registeredAgents);
  setEl('sb-agents-failed', failed || 0);
  setEl('sb-agents-scan', latestCandidateScan ? relativeTime(latestCandidateScan) : '—');
}

function renderAll() {
  updateCounts();
  if (typeof renderHomeView === 'function') renderHomeView();
  if (typeof renderSpaces === 'function') renderSpaces();
  if (typeof renderAgents === 'function') renderAgents();
}

async function boot() {
  document.querySelectorAll('.nav-btn:not([disabled])').forEach(button => {
    button.addEventListener('click', () => switchView(button.dataset.view));
  });

  initModeToggle();
  document.querySelectorAll('[data-close-modal]').forEach(node => {
    node.addEventListener('click', () => {
      const modal = document.getElementById(node.dataset.closeModal);
      if (!modal) return;
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    });
  });

  await loadData();
  renderAll();

  if (typeof initAgentControls === 'function') initAgentControls();
  if (typeof initSpacesControls === 'function') initSpacesControls();
}

document.addEventListener('DOMContentLoaded', boot);
