// Renders the center view: the page header, then the page's own content.

import { GAME_NAME, MAX_LEVEL } from "../config.js";
import { getPageView } from "../views/index.js";

const viewEl = document.getElementById("view");
const topbarTitleEl = document.getElementById("topbarTitle");

export function renderPage(page) {
  topbarTitleEl.textContent = page.name;
  document.title = `${page.name} · ${GAME_NAME}`;

  viewEl.style.setProperty("--accent", page.color);
  viewEl.innerHTML = `
    ${headerHtml(page)}
    <div class="view-body" id="viewBody"></div>
  `;

  const render = getPageView(page.id);
  render(document.getElementById("viewBody"), page);
}

function headerHtml(page) {
  return `
    <div class="view-header">
      <div class="view-icon">${page.icon}</div>
      <div class="view-title">
        <h1>${page.name}</h1>
        ${page.skill ? levelHtml() : ""}
      </div>
    </div>
  `;
}

// Level and XP, shown right under the page title for skills.
function levelHtml() {
  return `
    <div class="view-level">
      <div class="level-row">
        <span class="lvl-text">Level 1 <small>/ ${MAX_LEVEL}</small></span>
        <span class="xp-text">0 / 83 XP</span>
      </div>
      <div class="xp-bar"><div class="xp-fill" style="width:0%"></div></div>
    </div>
  `;
}
