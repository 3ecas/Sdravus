// Renders the center view: a "← back" link (when you came from another page), the page
// header, then the page's own content.

import { GAME_NAME } from "../config.js";
import { getPageView } from "../views/index.js";
import { getPage } from "../data/pages.js";

const viewEl = document.getElementById("view");
const topbarTitleEl = document.getElementById("topbarTitle");

let cleanupView = null;

export function renderPage(page, route = {}) {
  if (cleanupView) cleanupView();

  topbarTitleEl.textContent = page.name;
  document.title = `${page.name} · ${GAME_NAME}`;

  viewEl.style.setProperty("--accent", page.color);
  const from = route.from && getPage(route.from);
  viewEl.innerHTML = `
    ${from ? `<a class="back-link" href="#${from.id}">← ${from.name}</a>` : ""}
    <div class="view-header">
      <div class="view-icon">${page.icon}</div>
      <div class="view-title"><h1>${page.name}</h1></div>
    </div>
    <div class="view-body" id="viewBody"></div>
  `;

  const render = getPageView(page.id);
  cleanupView = render(document.getElementById("viewBody"), page, route) || null;
}
