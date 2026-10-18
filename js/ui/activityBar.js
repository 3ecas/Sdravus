// Slim bar at the top showing what you're doing while you look at other pages,
// e.g. "🌳 Chopping Tree · Lumberjack", with a thin progress line. Click it to go back.
// Hidden when nothing is running, or when you're already on that page.

import { getPage } from "../data/pages.js";
import { activeActionInfo, actionProgress } from "../game/actions.js";
import { currentRoute, routeHref } from "../router.js";
import { iconHtml } from "./format.js";

const barEl = document.getElementById("activityBar");

export function startActivityBar() {
  let shownKey = null;

  function frame() {
    const info = activeActionInfo();
    const onThatPage = info && currentRoute().page === info.page;
    const show = info && !onThatPage;

    barEl.hidden = !show;
    if (show) {
      const key = `${info.verb}|${info.name}|${info.page}|${info.tab}`;
      if (key !== shownKey) {
        shownKey = key;
        render(info);
      }
      barEl.querySelector(".activity-fill").style.width = `${actionProgress() * 100}%`;
    } else {
      shownKey = null;
    }
    requestAnimationFrame(frame);
  }

  frame();
}

function render(info) {
  const page = getPage(info.page);
  barEl.style.setProperty("--accent", page.color);
  barEl.innerHTML = `
    <a class="activity-link" href="${routeHref(info.page, info.tab)}" title="Go to ${page.name}">
      <span class="activity-icon">${iconHtml(info)}</span>
      <span class="activity-text"><strong>${info.verb} ${info.name}</strong> · ${page.icon} ${page.name}</span>
      <span class="activity-go">›</span>
    </a>
    <span class="activity-track"><span class="activity-fill"></span></span>
  `;
}
