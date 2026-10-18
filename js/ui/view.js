// Renders the center view: the page header, then the page's own content.

import { GAME_NAME, MAX_LEVEL } from "../config.js";
import { getPageView } from "../views/index.js";
import { onChange, skillXp } from "../game/state.js";
import { levelProgress } from "../game/xp.js";

const viewEl = document.getElementById("view");
const topbarTitleEl = document.getElementById("topbarTitle");

let currentPage = null;
let cleanupView = null;

export function renderPage(page) {
  if (cleanupView) cleanupView();
  currentPage = page;

  topbarTitleEl.textContent = page.name;
  document.title = `${page.name} · ${GAME_NAME}`;

  viewEl.style.setProperty("--accent", page.color);
  viewEl.innerHTML = `
    ${headerHtml(page)}
    <div class="view-body" id="viewBody"></div>
  `;
  updateLevel();

  const render = getPageView(page.id);
  cleanupView = render(document.getElementById("viewBody"), page) || null;
}

// Keep the level and XP in the header up to date.
onChange(updateLevel);

function updateLevel() {
  if (!currentPage || !currentPage.skill) return;

  const xp = skillXp(currentPage.id);
  const { level, next, percent } = levelProgress(xp);

  viewEl.querySelector(".lvl-num").textContent = level;
  viewEl.querySelector(".xp-text").textContent = `${xp} / ${next} XP`;
  viewEl.querySelector(".xp-fill").style.width = `${percent}%`;
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
        <span class="lvl-text">Level <span class="lvl-num">1</span> <small>/ ${MAX_LEVEL}</small></span>
        <span class="xp-text"></span>
      </div>
      <div class="xp-bar"><div class="xp-fill"></div></div>
    </div>
  `;
}
