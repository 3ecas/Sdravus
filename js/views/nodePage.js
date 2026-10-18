// Page for a gathering skill with nodes to click (Lumberjack: trees, Mining: rocks).
// Nodes are grouped into places (Mining: sites like the Quarry). With `tabs: true` each
// place is a tab (#mining/quarry); otherwise the single place's nodes are shown directly.
// Click a node to start, click again to stop. A node you can't use yet is greyed out with
// the tool it needs crossed out (top-right) and/or the level needed (top-left).
// The time shown is with your best tool on the belt.
//
// nodePage("mining", MINING_SITES, { verb: "Mining", tabs: true }) returns the render function.
// A place is { id, name, icon, level, nodes (or rocks), rare: [{ item, chance }] }.

import { getItem, toolForTier } from "../data/items.js";
import { onChange } from "../game/state.js";
import { toggleGather, gatherActionId, hasToolFor, hasLevelFor, gatherSeconds } from "../game/gathering.js";
import { routeHref } from "../router.js";
import { bindActionCards } from "../ui/actionCards.js";
import { iconHtml, formatSeconds } from "../ui/format.js";

export function nodePage(skill, places, { verb, tabs = false }) {
  return (container, page, route) => {
    const place = places.find((p) => p.id === route.tab) || places[0];
    const nodes = place.nodes || place.rocks;
    const getNode = (id) => nodes.find((node) => node.id === id);

    container.innerHTML = `
      ${tabs ? tabsHtml(skill, places, place, route.from) : ""}
      ${hasLevelFor(skill, place)
        ? `${rareHtml(place)}<div class="action-grid">${nodes.map((n) => nodeCardHtml(skill, n)).join("")}</div>`
        : `<p class="craft-hint">Reach ${page.name} level ${place.level} to work at the ${place.name}.</p>`}
    `;

    const cards = [...container.querySelectorAll(".action-card")];
    cards.forEach((card) => {
      card.addEventListener("click", () =>
        toggleGather(skill, getNode(card.dataset.id), { verb, tab: tabs ? place.id : null, rare: place.rare })
      );
    });

    function update() {
      cards.forEach((card) => {
        const node = getNode(card.dataset.id);
        const hasTool = hasToolFor(node);
        const hasLevel = hasLevelFor(skill, node);
        card.classList.toggle("locked", !(hasTool && hasLevel));
        card.querySelector(".needs-tool")?.toggleAttribute("hidden", hasTool);
        card.querySelector(".needs-level").hidden = hasLevel;
        card.querySelector(".node-time").textContent = formatSeconds(gatherSeconds(node));
      });
    }

    update();
    const stopListening = onChange(update);
    const unbindCards = bindActionCards(container);

    return () => {
      stopListening();
      unbindCards();
    };
  };
}

function tabsHtml(skill, places, active, from) {
  return `
    <nav class="tabs">
      ${places.map((p) => `
        <a class="tab${p === active ? " active" : ""}${hasLevelFor(skill, p) ? "" : " unbuilt"}" href="${routeHref(skill, p.id, from)}">
          <span>${p.icon}</span>${p.name}
          ${hasLevelFor(skill, p) ? "" : `<span class="tab-level">Lv ${p.level}</span>`}
        </a>
      `).join("")}
    </nav>
  `;
}

// "Rare finds here: 💠 Quartz"
function rareHtml(place) {
  if (!place.rare?.length) return "";
  const list = place.rare.map(({ item }) => `${getItem(item).icon} ${getItem(item).name}`).join(", ");
  return `<p class="craft-hint place-note">Rare finds here: ${list}</p>`;
}

function nodeCardHtml(skill, node) {
  const tool = node.toolType ? toolForTier(node.toolType, node.toolTier) : null;
  return `
    <button class="action-card" data-id="${node.id}" data-action="${gatherActionId(skill, node)}">
      <span class="needs-level left" title="Needs level ${node.level}" hidden>Lv ${node.level}</span>
      <span class="action-icon">${iconHtml(node)}</span>
      <span class="action-name">${node.name}</span>
      <span class="action-meta">
        <span class="node-time">${formatSeconds(node.seconds)}</span>
        <span>+${node.xp} XP</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
      ${tool ? `<span class="needs-tool" title="Needs a ${tool.name} or better on the Tool Belt">${iconHtml(tool)}</span>` : ""}
    </button>
  `;
}
