// Village page, in two sections:
//   Stations  – unlock recipes (e.g. the Workbench). Click a built station to open its tab on
//               the page that uses it (Workbench -> Crafting › Workbench).
//   Buildings – produce resources on their own over time (e.g. the Well), or house villagers
//               (Huts: build as many as you like, each costs more).
// Each appears once you've had any of its materials. Click to build it instantly.
// Once you have villagers, a line on top shows how many are idle and where the others work.

import { getStation } from "../data/stations.js";
import { getBuilding } from "../data/buildings.js";
import { getItem } from "../data/items.js";
import { getPage } from "../data/pages.js";
import { routeHref } from "../router.js";
import { state, onChange } from "../game/state.js";
import { visibleStations, visibleBuildings, isNew, markViewed } from "../game/discovery.js";
import { build, canBuild, isBuilt, builtCount, buildCost } from "../game/village.js";
import { productionProgress, onProduced } from "../game/production.js";
import { WORK_SPOTS, villagerCount, idleCount } from "../game/villagers.js";
import { showGains } from "../ui/pop.js";
import { costHtml, updateCost } from "../ui/costList.js";
import { iconHtml } from "../ui/format.js";

const SECTIONS = [
  { type: "station", title: "Stations", visible: visibleStations, get: getStation },
  { type: "building", title: "Buildings", visible: visibleBuildings, get: getBuilding },
];

export function renderVillage(container) {
  const newThisVisit = new Set(); // "type:id" shown with a "New" badge during this visit
  let layoutKey = null; // what was last drawn; null so the first update always draws
  let villagersKey = null;

  container.addEventListener("click", (event) => {
    if (event.target.closest(".info-btn")) return event.preventDefault(); // "?" only shows info
    const card = event.target.closest(".action-card[data-id]");
    if (card) build(thingFor(card));
  });

  function update() {
    const key = SECTIONS.map((s) => s.visible().map((t) => `${t.id}:${builtCount(t.id)}`).join()).join("|");
    if (key !== layoutKey) {
      layoutKey = key;
      villagersKey = null;
      SECTIONS.forEach(({ type, visible }) => {
        visible().filter((t) => !isBuilt(t.id) && isNew(type, t.id)).forEach((t) => newThisVisit.add(`${type}:${t.id}`));
      });
      container.innerHTML = `<div class="villagers-line"></div>${sectionsHtml(newThisVisit)}`;
      SECTIONS.forEach(({ type, visible }) => markViewed(type, visible()));
    }

    // Redraw the villagers line only when it changes, so its links don't flicker.
    const vKey = `${villagerCount()}:${JSON.stringify(state.workers)}`;
    if (vKey !== villagersKey) {
      villagersKey = vKey;
      container.querySelector(".villagers-line").innerHTML = villagersHtml();
    }

    container.querySelectorAll(".action-card[data-id]").forEach((card) => {
      const thing = thingFor(card);
      card.classList.toggle("locked", !canBuild(thing));
      updateCost(card, buildCost(thing));
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
    if (card) showGains(card, gains);
  });

  update();
  animate();
  const stopListening = onChange(update);

  return () => {
    stopListening();
    stopProduced();
    cancelAnimationFrame(frame);
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

// "👤 4 villagers · 1 idle   🌳 Tree 2  🟠 Copper Rock 1" (each place links to its page).
function villagersHtml() {
  const total = villagerCount();
  if (!total) return "";
  const jobs = Object.entries(state.workers).map(([key, count]) => {
    const { node, page, tab } = WORK_SPOTS[key];
    const icon = node.icon ? iconHtml(node) : getPage(page).icon;
    return `<a class="job-chip" href="${routeHref(page, tab, "village")}">${icon} ${node.name} <b>${count}</b></a>`;
  });
  return `
    <div class="villagers">
      <span class="villagers-count">👤 ${total} villager${total === 1 ? "" : "s"} · <b>${idleCount()}</b> idle</span>
      ${jobs.length ? jobs.join("") : `<span class="villagers-hint">Send them to work with + on the Plains, trees and rocks.</span>`}
    </div>
  `;
}

// "?" in the corner: hover to see what a station unlocks, or what a building produces.
function infoHtml(thing) {
  let title = "Unlocks";
  let text = thing.unlocks;
  if (thing.houses) {
    title = "Houses";
    text = `👤 ${thing.houses} villagers, who can gather for you. Each Hut costs more than the last.`;
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
  if (isBuilt(thing.id) && !thing.repeatable) {
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
  const count = builtCount(thing.id); // repeatable buildings (Huts) can already have some
  return `
    <button class="action-card" data-type="${type}" data-id="${thing.id}">
      ${isNewThing && !count ? `<span class="new-tag">New</span>` : ""}
      <span class="action-icon">${thing.icon}</span>
      <span class="action-name">${thing.name}${count ? ` <span class="owned-count">×${count}</span>` : ""}</span>
      ${infoHtml(thing)}
      ${costHtml(buildCost(thing))}
      <span class="build-tag">${count ? "Build another" : "Build"}</span>
    </button>
  `;
}
