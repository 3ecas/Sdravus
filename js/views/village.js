// Village page, in two sections:
//   Stations  – built once, unlock crafting recipes (e.g. the Workbench).
//   Buildings – built once, then produce resources on their own (e.g. the Well).
// Each appears once you've had any of its materials. Click to build.

import { getStation } from "../data/stations.js";
import { getBuilding } from "../data/buildings.js";
import { getItem } from "../data/items.js";
import { onChange } from "../game/state.js";
import { visibleStations, visibleBuildings, isNew, markViewed } from "../game/discovery.js";
import { toggleBuild, buildActionId, canBuild, isBuilt } from "../game/village.js";
import { productionProgress, onProduced } from "../game/production.js";
import { bindActionCards, showPop } from "../ui/actionCards.js";
import { costHtml, updateCost } from "../ui/costList.js";

const SECTIONS = [
  { type: "station", title: "Stations", visible: visibleStations, get: getStation },
  { type: "building", title: "Buildings", visible: visibleBuildings, get: getBuilding },
];

export function renderVillage(container) {
  const newThisVisit = new Set(); // "type:id" shown with a "New" badge during this visit
  let layoutKey = null; // what was last drawn; null so the first update always draws

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".action-card[data-id]");
    if (card) toggleBuild(thingFor(card));
  });

  function update() {
    const key = SECTIONS.map((s) => s.visible().map((t) => `${t.id}:${isBuilt(t.id)}`).join()).join("|");
    if (key !== layoutKey) {
      layoutKey = key;
      SECTIONS.forEach(({ type, visible }) => {
        visible().filter((t) => !isBuilt(t.id) && isNew(type, t.id)).forEach((t) => newThisVisit.add(`${type}:${t.id}`));
      });
      container.innerHTML = sectionsHtml(newThisVisit);
      SECTIONS.forEach(({ type, visible }) => markViewed(type, visible()));
    }

    container.querySelectorAll(".action-card[data-id]").forEach((card) => {
      const thing = thingFor(card);
      card.classList.toggle("locked", !canBuild(thing) && !card.classList.contains("active"));
      updateCost(card, thing.cost);
    });
  }

  // Fill each built building's bar toward its next delivery.
  let frame;
  function animate() {
    container.querySelectorAll("[data-produce]").forEach((card) => {
      const fill = card.querySelector(".action-progress-fill");
      fill.style.width = `${productionProgress(getBuilding(card.dataset.produce)) * 100}%`;
    });
    frame = requestAnimationFrame(animate);
  }

  const stopProduced = onProduced((buildingId, gains) => {
    const card = container.querySelector(`[data-produce="${buildingId}"]`);
    if (card) gains.forEach(({ item, amount }, i) => showPop(card, `+${amount} ${getItem(item).icon}`, i));
  });

  update();
  animate();
  const stopListening = onChange(update);
  const unbindCards = bindActionCards(container);

  return () => {
    stopListening();
    stopProduced();
    cancelAnimationFrame(frame);
    unbindCards();
  };
}

function thingFor(card) {
  return SECTIONS.find((s) => s.type === card.dataset.type).get(card.dataset.id);
}

function sectionsHtml(newKeys) {
  const html = SECTIONS.map(({ type, title, visible }) => {
    const things = visible();
    if (!things.length) return "";
    return `
      <section class="craft-section">
        <h2 class="panel-title">${title}</h2>
        <div class="action-grid">${things.map((t) => cardHtml(type, t, newKeys.has(`${type}:${t.id}`))).join("")}</div>
      </section>
    `;
  }).join("");
  return html || `<p class="craft-hint">Nothing to build yet. Gather materials to discover what you can build.</p>`;
}

// What it does, shown under the name: what a station unlocks, or what a building produces.
function purposeHtml(thing) {
  if (thing.produces) {
    const { item, amount, seconds } = thing.produces;
    return `<span class="station-unlocks">Produces ${getItem(item).icon} ${amount} ${getItem(item).name} every ${seconds}s</span>`;
  }
  return `<span class="station-unlocks">${thing.unlocks}</span>`;
}

function cardHtml(type, thing, isNewThing) {
  if (isBuilt(thing.id)) {
    // A built building keeps working: show the bar toward its next delivery.
    const producing = thing.produces
      ? `<span class="action-progress"><span class="action-progress-fill"></span></span>`
      : `<span class="built-tag">Built ✓</span>`;
    return `
      <div class="action-card built" ${thing.produces ? `data-produce="${thing.id}"` : ""}>
        <span class="action-icon">${thing.icon}</span>
        <span class="action-name">${thing.name}</span>
        ${purposeHtml(thing)}
        ${producing}
      </div>
    `;
  }
  return `
    <button class="action-card" data-type="${type}" data-id="${thing.id}" data-action="${buildActionId(thing)}">
      ${isNewThing ? `<span class="new-tag">New</span>` : ""}
      <span class="action-icon">${thing.icon}</span>
      <span class="action-name">${thing.name}</span>
      ${purposeHtml(thing)}
      ${costHtml(thing.cost)}
      <span class="action-meta">
        <span>${thing.seconds}s</span>
        <span>Build</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
    </button>
  `;
}
