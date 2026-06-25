function renderDesks() {
  const target = document.getElementById("desk-list");
  if (!target) return;
  target.innerHTML = appData.agents.map(agent => `
    <article class="desk" style="--accent:${agent.color};--screen:${agent.screen}">
      <div class="desk-top">
        <div class="desk-name">
          <strong>${agent.name}</strong>
          <span>${agent.type} · ${agent.project}</span>
        </div>
        <span class="badge ${getBadgeColor(agent.status)}">${agent.status}</span>
      </div>
      <div class="monitor" title="${agent.task}"></div>
      <div class="desk-foot">
        <span>${agent.task}</span>
        <span>${agent.pending} sync</span>
      </div>
    </article>
  `).join("");
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
