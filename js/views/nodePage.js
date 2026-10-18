// Page for a gathering skill with nodes to click (Lumberjack: trees, Mining: rocks).
// Nodes are grouped into places (Mining: sites like the Quarry). With `tabs: true` each
// place is a tab (#mining/quarry); otherwise the single place's nodes are shown directly.
// Click a node to start, click again to stop. A node you can't use yet is greyed out with
// the missing tool crossed out (top-right) and/or the level needed (top-left).
//
// nodePage("mining", MINING_SITES, { verb: "Mining", tabs: true }) returns the render function.
// A place is { id, name, icon, level, nodes (or rocks), rare: [{ item, chance }] }.

import { getItem } from "../data/items.js";
import { onChange } from "../game/state.js";
import { toggleGather, gatherActionId, hasToolFor, hasLevelFor } from "../game/gathering.js";
import { routeHref } from "../router.js";
import { bindActionCards } from "../ui/actionCards.js";

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
        </a>
      `).join("")}
    </nav>
  `;
}

// "Rare finds here: 💎 Uncut Gem"
function rareHtml(place) {
  if (!place.rare?.length) return "";
  const list = place.rare.map(({ item }) => `${getItem(item).icon} ${getItem(item).name}`).join(", ");
  return `<p class="craft-hint place-note">Rare finds here: ${list}</p>`;
}

function nodeCardHtml(skill, node) {
  const tool = node.tool ? getItem(node.tool) : null;
  return `
    <button class="action-card" data-id="${node.id}" data-action="${gatherActionId(skill, node)}">
      <span class="needs-level left" title="Needs level ${node.level}" hidden>Lv ${node.level}</span>
      <span class="action-icon">${node.icon}</span>
      <span class="action-name">${node.name}</span>
      <span class="action-meta">
        <span>${node.seconds}s</span>
        <span>+${node.xp} XP</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
      ${tool ? `<span class="needs-tool" title="Needs ${tool.name} on the Tool Belt">${tool.icon}</span>` : ""}
    </button>
  `;
}
