let activeView = "office";
let currentMode = localStorage.getItem("ai-trace-mode") || "mock";

// ============================================================
// 数据加载策略：双模式切换 (Mock / Real)
// ============================================================

const DATA_SOURCES = {
  mock: {
    candidates: [
      "../../mock/data/registry/agent_candidates.json",
      "/mock/data/registry/agent_candidates.json",
    ],
    registered: [
      "../../mock/data/registry/registered_agents.json",
      "/mock/data/registry/registered_agents.json",
    ],
  },
  real: {
    // Phase 3 开启 serve 后的后端 API 路径
    apiCandidates: ["/api/registry/candidates"],
    apiRegistered: ["/api/registry/registered"],
  }
};

async function fetchWithFallback(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {
      // 忽略错误，继续尝试下一个路径
    }
  }
  return null;
}

async function loadData() {
  let candidatesUrls = [];
  let registeredUrls = [];

  if (currentMode === "real") {
    candidatesUrls = DATA_SOURCES.real.apiCandidates;
    registeredUrls = DATA_SOURCES.real.apiRegistered;
  } else {
    candidatesUrls = DATA_SOURCES.mock.candidates;
    registeredUrls = DATA_SOURCES.mock.registered;
  }

  // 加载 candidates
  const candidatesData = await fetchWithFallback(candidatesUrls);
  if (candidatesData && Array.isArray(candidatesData.candidates)) {
    appData.agentCandidates = candidatesData.candidates;
    console.info(
      `[ai-trace] ${currentMode} candidates loaded: ${candidatesData.candidates.length} items` +
      (candidatesData.generated_at ? ` (生成于 ${candidatesData.generated_at})` : "")
    );
  } else {
    appData.agentCandidates = [];
    console.warn(`[ai-trace] ${currentMode} candidates 数据加载失败，已置空。`);
  }

  // 加载 registered
  const registeredData = await fetchWithFallback(registeredUrls);
  if (registeredData && Array.isArray(registeredData.agents)) {
    appData.registeredAgents = registeredData.agents;
    console.info(`[ai-trace] ${currentMode} registered loaded: ${registeredData.agents.length} items`);
  } else {
    appData.registeredAgents = [];
    console.warn(`[ai-trace] ${currentMode} registered 数据加载失败，已置空。`);
  }
}

// ============================================================
// 视图路由
// ============================================================

function renderSubnav() {
  const target = document.getElementById("subnav");
  if (!target || !appSubnavs[activeView]) return;
  target.innerHTML = appSubnavs[activeView].map((item, index) => (
    `<button class="${index === 0 ? "active" : ""}">${item}</button>`
  )).join("");
}

function switchView(view) {
  activeView = view;

  document.querySelectorAll(".view").forEach(node => {
    if (node.id === view) {
      node.classList.remove("hidden");
      setTimeout(() => node.style.opacity = 1, 10);
    } else {
      node.classList.add("hidden");
      node.style.opacity = 0;
    }
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });

  if (appTitles[view]) {
    document.getElementById("eyebrow").textContent = appTitles[view][0];
    document.getElementById("page-title").textContent = appTitles[view][1];
    document.getElementById("page-subtitle").textContent = appTitles[view][2];
  }

  renderSubnav();
}

// ============================================================
// 统计数字更新
// ============================================================

function updateCounts() {
  const agentsCountEl = document.getElementById("agents-count");
  const statCandidates = document.getElementById("stat-candidates-count");
  const statRegistered = document.getElementById("stat-registered-count");
  const statSessions = document.getElementById("stat-sessions-total");

  const candidates = appData.agentCandidates || [];
  const registered = appData.registeredAgents || [];
  const totalSessions = candidates.reduce((sum, c) => sum + (c.session_count || 0), 0);

  if (agentsCountEl) agentsCountEl.textContent = candidates.length;
  if (statCandidates) statCandidates.textContent = candidates.length;
  if (statRegistered) statRegistered.textContent = registered.length;
  if (statSessions) statSessions.textContent = totalSessions;
}

// ============================================================
// 启动
// ============================================================

async function boot() {
  // 绑定导航
  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  // 初始化 Mode Selector 状态
  const mockBtn = document.getElementById("mode-mock");
  const realBtn = document.getElementById("mode-real");
  if (mockBtn && realBtn) {
    if (currentMode === "real") {
      mockBtn.classList.remove("active");
      realBtn.classList.add("active");
    } else {
      mockBtn.classList.add("active");
      realBtn.classList.remove("active");
    }

    const handleModeSwitch = async (mode) => {
      if (currentMode === mode) return;
      currentMode = mode;
      localStorage.setItem("ai-trace-mode", mode);

      if (mode === "real") {
        mockBtn.classList.remove("active");
        realBtn.classList.add("active");
      } else {
        mockBtn.classList.add("active");
        realBtn.classList.remove("active");
      }

      // 重新加载并渲染
      await loadData();
      renderDesks();
      renderActivity();
      renderAgents();
      renderWiki();
      renderProfile();
      renderSync();
      renderSkills();
      updateCounts();
    };

    mockBtn.addEventListener("click", () => handleModeSwitch("mock"));
    realBtn.addEventListener("click", () => handleModeSwitch("real"));
  }

  // 加载数据
  await loadData();

  // 渲染各视图
  renderSubnav();
  renderDesks();
  renderActivity();
  renderAgents();
  renderWiki();
  renderProfile();
  renderSync();
  renderSkills();
  updateCounts();

  // 初始化控件
  initAgentControls();
  initProfileControls();
}

document.addEventListener("DOMContentLoaded", boot);
