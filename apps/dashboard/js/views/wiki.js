function renderWiki() {
  const tableTarget = document.getElementById("wiki-table");
  const menuTarget = document.getElementById("menu-map");
  const previewTarget = document.getElementById("knowledge-preview");
  
  if (tableTarget) {
    tableTarget.innerHTML = `
      <tbody>
        <tr>
          <td>
            <strong>Placeholder</strong><br>
            <span class="path">Wiki 在 Phase 3 之后点亮，等待会话索引、标记规则与稳定导入字段。</span>
          </td>
        </tr>
      </tbody>
    `;
  }
  
  if (menuTarget) {
    menuTarget.innerHTML = appData.menu.slice(0, 3).map(item => `
      <div class="menu-card">
        <strong>${item.top}</strong>
        ${item.subs.map(sub => `<span>${sub}</span>`).join("")}
      </div>
    `).join("");
  }

  if (previewTarget) {
    previewTarget.innerHTML = appData.knowledgePreview.slice(0, 2).map(item => `
      <div class="menu-card">
        <strong>${item.title}</strong>
        <span>${item.summary}</span>
      </div>
    `).join("");
  }
}
