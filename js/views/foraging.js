// Foraging page: area cards with a picture of the place. Click an area to find one random
// item there. The "?" shows what can be found. Villagers can forage there too ("− 👤 +").

import { AREAS, getArea } from "../data/areas.js";
import { getItem } from "../data/items.js";
import { gather } from "../game/gathering.js";
import { onChange } from "../game/state.js";
import { spotKey } from "../game/villagers.js";
import { showGains } from "../ui/pop.js";
import { workersHtml, updateWorkers, handleWorkerClick, startWorkerVisuals } from "../ui/workers.js";

export function renderForaging(container) {
  container.innerHTML = `<div class="area-grid">${AREAS.map(areaCardHtml).join("")}</div>`;

  container.querySelectorAll(".area-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".info-btn")) return; // "?" only shows the list
      if (handleWorkerClick(event)) return;
      showGains(card, gather(getArea(card.dataset.id)));
    });
  });

  const update = () => updateWorkers(container);
  update();
  const stopListening = onChange(update);
  const stopVisuals = startWorkerVisuals(container);
  return () => {
    stopListening();
    stopVisuals();
  };
}

function areaCardHtml(area) {
  return `
    <div class="area-card" role="button" tabindex="0" data-id="${area.id}" data-spot="${spotKey("foraging", area.id)}">
      <div class="area-bg" style="background-image:url('${area.image}')"></div>
      <span class="info-btn" tabindex="0" aria-label="What can be found here">?
        <span class="info-pop">
          <span class="info-pop-title">Can be found</span>
          ${findsListHtml(area)}
        </span>
      </span>
      <div class="area-footer">
        <div class="area-footer-row">
          <div>
            <span class="area-name">${area.name}</span>
            <span class="area-hint">Click to forage</span>
          </div>
          ${workersHtml()}
        </div>
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
