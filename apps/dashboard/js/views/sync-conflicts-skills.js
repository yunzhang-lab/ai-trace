function renderSync() {
  const target = document.getElementById("sync-list");
  if (!target) return;
  target.innerHTML = `
    <article class="item">
      <div class="item-top">
        <strong>Placeholder</strong>
        <span class="badge amber">Phase 4+</span>
      </div>
      <p>Flow 审核台会在 Candidate 和 Queue 真正落地后点亮。当前阶段只做扫描与注册，不提供同步写入动作。</p>
    </article>
  `;
}

function renderConflicts() {
  const target = document.getElementById("conflict-list");
  if (!target) return;
  target.innerHTML = `
    <article class="item">
      <div class="item-top">
        <strong>Placeholder</strong>
        <span class="badge amber">Phase 4+</span>
      </div>
      <p>Conflicts 依赖 Review / Sync / Audit 闭环，当前先保留位置，不挂真实数据源。</p>
    </article>
  `;
}

function renderSkills() {
  const listTarget = document.getElementById("skill-list");
  const tableTarget = document.getElementById("skill-table");
  
  if (listTarget) {
    listTarget.innerHTML = `
      <article class="item">
        <div class="item-top">
          <strong>Placeholder</strong>
          <span class="badge amber">Phase 5+</span>
        </div>
        <p>Skills 只在稳定流程闭环后再正式点亮。当前阶段不继续扩充超前 Skill 体系。</p>
      </article>
    `;
  }

  if (tableTarget) {
    tableTarget.innerHTML = `
      <thead><tr><th>产品</th><th>入口</th><th>接入方式</th></tr></thead>
      <tbody>
        <tr><td>QwenPaw</td><td>私有入口</td><td>后续按稳定流程接入。</td></tr>
        <tr><td>Codex</td><td>AGENTS.md</td><td>当前优先实现 scan 与 index。</td></tr>
        <tr><td>Claude Code</td><td>CLAUDE.md</td><td>后续补接标记与提炼协作。</td></tr>
      </tbody>
    `;
  }
}
