// Village page, in two sections:
//   Stations  – built once, unlock recipes (e.g. the Workbench). Click a built station to open
//               its tab on the skill page that uses it (Workbench -> Crafting › Workbench).
//   Buildings – built once, then produce resources on their own (e.g. the Chicken Coop).
//               A built Well is clicked like a tree: fill the empty buckets in your stash.
// Each appears once you've had any of its materials. Click to build.

import { getStation } from "../data/stations.js";
import { getBuilding } from "../data/buildings.js";
import { getItem } from "../data/items.js";
import { getPage } from "../data/pages.js";
import { routeHref } from "../router.js";
import { onChange } from "../game/state.js";
import { visibleStations, visibleBuildings, isNew, markViewed } from "../game/discovery.js";
import { toggleBuild, buildActionId, canBuild, isBuilt, toggleDraw, drawActionId, canDraw, emptyBucket, bucketFill } from "../game/village.js";
import { itemCount } from "../game/state.js";
import { activeActionId } from "../game/actions.js";
import { productionProgress, onProduced } from "../game/production.js";
import { bindActionCards, showPop } from "../ui/actionCards.js";
import { costHtml, updateCost } from "../ui/costList.js";
import { iconHtml, formatSeconds } from "../ui/format.js";

const SECTIONS = [
  { type: "station", title: "Stations", visible: visibleStations, get: getStation },
  { type: "building", title: "Buildings", visible: visibleBuildings, get: getBuilding },
];

export function renderVillage(container) {
  const newThisVisit = new Set(); // "type:id" shown with a "New" badge during this visit
  let layoutKey = null; // what was last drawn; null so the first update always draws

  container.addEventListener("click", (event) => {
    if (event.target.closest(".info-btn")) return event.preventDefault(); // "?" only shows info
    const drawCard = event.target.closest("[data-draw]");
    if (drawCard) return toggleDraw(getBuilding(drawCard.dataset.draw));
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

    container.querySelectorAll("[data-draw]").forEach((card) => {
      const building = getBuilding(card.dataset.draw);
      const active = activeActionId() === drawActionId(building);
      card.classList.toggle("locked", !canDraw(building) && !active);
      const bucket = emptyBucket();
      const { water, capacity } = bucketFill();
      card.querySelector(".needs-tool").hidden = Boolean(bucket);
      card.querySelector(".water-fill").textContent = bucket ? `${water}/${capacity} · ${itemCount(bucket)} empty` : "no empty bucket";
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

// "?" in the corner: hover to see what a station unlocks, or what a building produces.
function infoHtml(thing) {
  let title = "Unlocks";
  let text = thing.unlocks;
  if (thing.draw) {
    title = "Draw water";
    text = `Each trip pours ${thing.draw.amount} water into an empty bucket from your stash. A full bucket becomes a Bucket of Water, then the next one is filled. A Wooden Bucket holds 5.`;
  } else if (thing.produces) {
    const { item, amount, seconds } = thing.produces;
    title = "Produces";
    text = `${getItem(item).icon} ${amount} ${getItem(item).name} every ${seconds}s`;
  }
  return `
    <span class="info-btn" tabindex="0" aria-label="Info">?
      <span class="info-pop">
        <span class="info-pop-title">${title}</span>
        <span class="info-pop-text">${text}</span>
      </span>
    </span>
  `;
}

function cardHtml(type, thing, isNewThing) {
  if (isBuilt(thing.id) && thing.skill) {
    // A built station: opens its tab on its skill page.
    return `
      <a class="action-card built open" href="${routeHref(thing.skill, thing.id, "village")}">
        <span class="action-icon">${thing.icon}</span>
        <span class="action-name">${thing.name}</span>
        ${infoHtml(thing)}
        <span class="open-tag" title="Open in ${getPage(thing.skill).name}">Open ›</span>
      </a>
    `;
  }
  if (isBuilt(thing.id) && thing.draw) {
    // A built Well: click to fill empty buckets ("💧 2/5 · 3 empty" = the bucket being filled).
    const { amount, seconds } = thing.draw;
    const bucket = getItem("wooden_bucket");
    return `
      <button class="action-card" data-draw="${thing.id}" data-action="${drawActionId(thing)}">
        <span class="action-icon">${thing.icon}</span>
        <span class="action-name">${thing.name}</span>
        ${infoHtml(thing)}
        <span class="action-meta">
          <span>${formatSeconds(seconds)}</span>
          <span>+${amount} ${getItem("water").icon}</span>
        </span>
        <span class="water-line" title="Water in the bucket being filled · empty buckets left">${getItem("water").icon} <span class="water-fill"></span></span>
        <span class="action-progress"><span class="action-progress-fill"></span></span>
        <span class="needs-tool" title="Needs an empty ${bucket.name} in the stash">${iconHtml(bucket)}</span>
      </button>
    `;
  }
  if (isBuilt(thing.id)) {
    // A built building keeps working: show the bar toward its next delivery.
    const producing = thing.produces
      ? `<span class="action-progress"><span class="action-progress-fill"></span></span>`
      : `<span class="built-tag">Built ✓</span>`;
    return `
      <div class="action-card built" ${thing.produces ? `data-produce="${thing.id}"` : ""}>
        <span class="action-icon">${thing.icon}</span>
        <span class="action-name">${thing.name}</span>
        ${infoHtml(thing)}
        ${producing}
      </div>
    `;
  }
  return `
    <button class="action-card" data-type="${type}" data-id="${thing.id}" data-action="${buildActionId(thing)}">
      ${isNewThing ? `<span class="new-tag">New</span>` : ""}
      <span class="action-icon">${thing.icon}</span>
      <span class="action-name">${thing.name}</span>
      ${infoHtml(thing)}
      ${costHtml(thing.cost)}
      <span class="action-meta">
        <span>${thing.seconds}s</span>
        <span>Build</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
    </button>
  `;
}
