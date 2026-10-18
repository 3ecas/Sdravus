// Village page. Stations (like the Workbench) are built once and unlock crafting recipes.
// A station appears once you've had any of its materials. Click to build.
// (Buildings that produce resources over time, like a Well or Cow Pen, will get their own section.)

import { getStation } from "../data/stations.js";
import { onChange } from "../game/state.js";
import { visibleStations, isNew, markViewed } from "../game/discovery.js";
import { toggleBuild, buildActionId, canBuild, isBuilt } from "../game/village.js";
import { bindActionCards } from "../ui/actionCards.js";
import { costHtml, updateCost } from "../ui/costList.js";

export function renderVillage(container) {
  const newThisVisit = new Set();
  let layoutKey = null; // what was last drawn; null so the first update always draws

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".action-card");
    if (card && card.dataset.id) toggleBuild(getStation(card.dataset.id));
  });

  function update() {
    const stations = visibleStations();
    const key = stations.map((s) => `${s.id}:${isBuilt(s.id)}`).join();
    if (key !== layoutKey) {
      layoutKey = key;
      stations.filter((s) => !isBuilt(s.id) && isNew("station", s.id)).forEach((s) => newThisVisit.add(s.id));
      container.innerHTML = stations.length
        ? `
          <section class="craft-section">
            <h2 class="panel-title">Stations</h2>
            <div class="action-grid">${stations.map((s) => stationCardHtml(s, newThisVisit.has(s.id))).join("")}</div>
          </section>
        `
        : `<p class="craft-hint">Nothing to build yet. Gather materials to discover what you can build.</p>`;
      markViewed("station", stations);
    }

    container.querySelectorAll(".action-card:not(.built)").forEach((card) => {
      const station = getStation(card.dataset.id);
      card.classList.toggle("locked", !canBuild(station) && !card.classList.contains("active"));
      updateCost(card, station.cost);
    });
  }

  update();
  const stopListening = onChange(update);
  const unbindCards = bindActionCards(container);

  return () => {
    stopListening();
    unbindCards();
  };
}

function stationCardHtml(station, isNewStation) {
  if (isBuilt(station.id)) {
    return `
      <div class="action-card built">
        <span class="action-icon">${station.icon}</span>
        <span class="action-name">${station.name}</span>
        <span class="station-unlocks">${station.unlocks}</span>
        <span class="built-tag">Built ✓</span>
      </div>
    `;
  }
  return `
    <button class="action-card" data-id="${station.id}" data-action="${buildActionId(station)}">
      ${isNewStation ? `<span class="new-tag">New</span>` : ""}
      <span class="action-icon">${station.icon}</span>
      <span class="action-name">${station.name}</span>
      <span class="station-unlocks">${station.unlocks}</span>
      ${costHtml(station.cost)}
      <span class="action-meta">
        <span>${station.seconds}s</span>
        <span>Build</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
    </button>
  `;
}
