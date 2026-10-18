// Foraging page: area cards with a picture of the place. Click an area to find one random
// item there. The "?" shows what can be found.

import { AREAS, getArea } from "../data/areas.js";
import { getItem } from "../data/items.js";
import { gather } from "../game/gathering.js";
import { showGains } from "../ui/pop.js";

export function renderForaging(container) {
  container.innerHTML = `<div class="area-grid">${AREAS.map(areaCardHtml).join("")}</div>`;

  container.querySelectorAll(".area-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".info-btn")) return; // "?" only shows the list
      showGains(card, gather(getArea(card.dataset.id)));
    });
  });
}

function areaCardHtml(area) {
  return `
    <div class="area-card" role="button" tabindex="0" data-id="${area.id}">
      <div class="area-bg" style="background-image:url('${area.image}')"></div>
      <span class="info-btn" tabindex="0" aria-label="What can be found here">?
        <span class="info-pop">
          <span class="info-pop-title">Can be found</span>
          ${findsListHtml(area)}
        </span>
      </span>
      <div class="area-footer">
        <span class="area-name">${area.name}</span>
        <span class="area-hint">Click to forage</span>
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
