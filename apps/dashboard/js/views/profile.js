let activeProfileType = "preference";

function profileMatches(item) {
  const searchInput = document.getElementById("profile-search");
  const scopeSelect = document.getElementById("profile-scope");
  const statusSelect = document.getElementById("profile-status");
  const domainSelect = document.getElementById("profile-domain");
  
  const q = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const scope = scopeSelect ? scopeSelect.value : "all";
  const status = statusSelect ? statusSelect.value : "all";
  const domain = domainSelect ? domainSelect.value : "all";
  
  if (item.type !== activeProfileType) return false;
  if (scope !== "all" && item.scope !== scope) return false;
  if (status !== "all" && item.status !== status) return false;
  if (domain !== "all" && item.domain !== domain) return false;
  if (!q) return true;
  
  return [item.title, item.summary, item.source, item.domain, item.scope].join(" ").toLowerCase().includes(q);
}

function renderProfile() {
  const target = document.getElementById("profile-list");
  if (!target) return;

  const filtered = appData.profile.filter(profileMatches);
  target.innerHTML = `
    <article class="item">
      <div class="item-top">
        <strong>Placeholder</strong>
        <span class="badge amber">Phase 4+</span>
      </div>
      <p>Profile 依赖稳定的候选提炼、审核策略和公开边界，当前阶段仅保留交互骨架，不挂真实数据源。</p>
      <div class="path">draft profiles loaded: ${filtered.length}</div>
    </article>
  `;
}

function initProfileControls() {
  document.querySelectorAll("#profile-type button").forEach(button => {
    button.addEventListener("click", () => {
      activeProfileType = button.dataset.type;
      document.querySelectorAll("#profile-type button").forEach(node => node.classList.toggle("active", node === button));
      renderProfile();
    });
  });
  
  ["profile-search", "profile-scope", "profile-status", "profile-domain"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", renderProfile);
  });
}
