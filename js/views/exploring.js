// Exploring page: area cards with a picture of the place. Click to explore, click again to stop.
// The "?" shows what can be found there.

import { AREAS, getArea } from "../data/areas.js";
import { getItem } from "../data/items.js";
import { toggleExplore, exploreActionId } from "../game/exploring.js";
import { bindActionCards } from "../ui/actionCards.js";

export function renderExploring(container) {
  container.innerHTML = `<div class="area-grid">${AREAS.map(areaCardHtml).join("")}</div>`;

  container.querySelectorAll(".area-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".info-btn")) return; // "?" only shows the list
      toggleExplore(getArea(card.dataset.id));
    });
  });

  return bindActionCards(container);
}

function areaCardHtml(area) {
  return `
    <div class="area-card" role="button" tabindex="0" data-id="${area.id}" data-action="${exploreActionId(area)}">
      <div class="area-bg" style="background-image:url('${area.image}')"></div>
      <span class="info-btn" tabindex="0" aria-label="What can be found here">?
        <span class="info-pop">
          <span class="info-pop-title">Can be found</span>
          ${findsListHtml(area)}
        </span>
      </span>
      <div class="area-footer">
        <span class="area-name">${area.name}</span>
        <span class="action-meta">
          <span>${area.seconds}s</span>
          <span>+${area.xp} XP</span>
        </span>
        <span class="action-progress"><span class="action-progress-fill"></span></span>
      </div>
    </div>
  `;
}

// Items found in the area, A–Z.
function findsListHtml(area) {
  const items = area.finds
    .map(({ item }) => getItem(item))
    .sort((a, b) => a.name.localeCompare(b.name));
  return `<ul>${items.map((item) => `<li><span>${item.icon}</span>${item.name}</li>`).join("")}</ul>`;
}
