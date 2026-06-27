function renderDesks() {
  const target = document.getElementById("desk-list");
  if (!target) return;
  const agents = appData.registeredAgents || [];
  if (agents.length === 0) {
    target.innerHTML = `<div class="empty-state">暂无已注册的 Agent，请前往 Agents 面板操作。</div>`;
    return;
  }
  target.innerHTML = agents.map(agent => {
    // 生成一些默认的视觉属性，因为注册文件里没有保存 color/screen
    const hash = (agent.agent_id || "").split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const colors = ["#00FFCC", "#00E5FF", "#B388FF"];
    const color = colors[hash % colors.length];
    const screen = "#1a2a3a";
    
    return `
    <article class="desk" style="--accent:${color};--screen:${screen}">
      <div class="desk-top">
        <div class="desk-name">
          <strong>${agent.alias || agent.product}</strong>
          <span>${agent.workspace_mode} · ${agent.selected_workspace ? agent.selected_workspace.split('/').pop() : 'N/A'}</span>
        </div>
        <span class="badge ${getBadgeColor(agent.status || 'working')}">${agent.status || 'working'}</span>
      </div>
      <div class="monitor" title="Ready"></div>
      <div class="desk-foot">
        <span>${agent.session_count || 0} sessions</span>
        <span>0 sync</span>
      </div>
    </article>
  `}).join("");
}

function renderActivity() {
  const target = document.getElementById("activity-list");
  if (!target) return;
  target.innerHTML = appData.activity.map(item => `
    <article class="item">
      <div class="item-top">
        <strong>${item.title}</strong>
        <span class="badge blue">${item.meta}</span>
      </div>
      <p>${item.summary}</p>
    </article>
  `).join("");
}
