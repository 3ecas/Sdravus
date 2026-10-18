// Page for clicking nodes to gather instantly (Lumberjack: trees, Mining: rocks).
// Nodes are grouped into places (Mining: sites like the Quarry). With `tabs: true` each
// place is a tab (#mining/quarry); otherwise the single place's nodes are shown directly.
// A place or node needs a tool of some tier on the Tool Belt; one you can't use yet is greyed
// out with that tool crossed out. Each card shows what one click gives with your best tool.
//
// nodePage("mining", MINING_SITES, { tabs: true }) returns the page's render function.
// A place is { id, name, icon, toolTier, nodes (or rocks), rare: [{ item, chance }] }.

import { getItem, toolForTier } from "../data/items.js";
import { onChange } from "../game/state.js";
import { gather, hasToolFor, gatherYield } from "../game/gathering.js";
import { hasToolTier } from "../game/toolBelt.js";
import { routeHref } from "../router.js";
import { showGains } from "../ui/pop.js";
import { iconHtml } from "../ui/format.js";

export function nodePage(skill, places, { tabs = false } = {}) {
  return (container, page, route) => {
    const place = places.find((p) => p.id === route.tab) || places[0];
    const nodes = place.nodes || place.rocks;
    const getNode = (id) => nodes.find((node) => node.id === id);
    let layoutKey = null;

    container.addEventListener("click", (event) => {
      const card = event.target.closest(".action-card");
      if (!card) return;
      showGains(card, gather(getNode(card.dataset.id), place.rare));
    });

    function update() {
      // Redraw when the tools on the belt change what's reachable; otherwise refresh numbers.
      const key = places.map(canReach).join() + nodes.map(hasToolFor).join();
      if (key !== layoutKey) {
        layoutKey = key;
        container.innerHTML = `
          ${tabs ? tabsHtml(skill, places, place, route.from) : ""}
          ${canReach(place)
            ? `${rareHtml(place)}<div class="action-grid">${nodes.map(nodeCardHtml).join("")}</div>`
            : `<p class="craft-hint">You need ${neededToolText(place)} on the Tool Belt to work at the ${place.name}.</p>`}
        `;
      }
      container.querySelectorAll(".action-card").forEach((card) => {
        const node = getNode(card.dataset.id);
        const usable = hasToolFor(node);
        card.classList.toggle("locked", !usable);
        card.querySelector(".needs-tool")?.toggleAttribute("hidden", usable);
        card.querySelector(".node-yield").textContent = `+${gatherYield(node)}`;
      });
    }

    update();
    return onChange(update);
  };
}

// Places without a tool tier (e.g. the Lumberjack trees list) are always reachable.
function canReach(place) {
  return !place.toolTier || hasToolTier("pickaxe", place.toolTier);
}

// "a Bronze Pickaxe or better", or a placeholder if that tier of pickaxe doesn't exist yet.
function neededToolText(place) {
  const tool = toolForTier("pickaxe", place.toolTier);
  return tool ? `a ${tool.name} or better` : "a stronger pickaxe (coming later)";
}

function tabsHtml(skill, places, active, from) {
  return `
    <nav class="tabs">
      ${places.map((p) => {
        const locked = !canReach(p);
        const tool = locked ? toolForTier("pickaxe", p.toolTier) : null;
        return `
          <a class="tab${p === active ? " active" : ""}${locked ? " unbuilt" : ""}" href="${routeHref(skill, p.id, from)}"
             ${locked ? `title="Needs ${neededToolText(p)}"` : ""}>
            <span>${p.icon}</span>${p.name}
            ${locked ? `<span class="tab-level">${tool ? iconHtml(tool) : "🔒"}</span>` : ""}
          </a>
        `;
      }).join("")}
    </nav>
  `;
}

// "Rare finds here: 💠 Quartz"
function rareHtml(place) {
  if (!place.rare?.length) return "";
  const list = place.rare.map(({ item }) => `${getItem(item).icon} ${getItem(item).name}`).join(", ");
  return `<p class="craft-hint place-note">Rare finds here: ${list}</p>`;
}

function nodeCardHtml(node) {
  const tool = node.toolType ? toolForTier(node.toolType, node.toolTier) : null;
  const item = getItem(node.item);
  return `
    <button class="action-card" data-id="${node.id}">
      <span class="action-icon">${iconHtml(node)}</span>
      <span class="action-name">${node.name}</span>
      <span class="action-meta center" title="Per click with your best tool">
        <span><span class="node-yield">+1</span> ${iconHtml(item)}</span>
      </span>
      ${tool ? `<span class="needs-tool" title="Needs a ${tool.name} or better on the Tool Belt">${iconHtml(tool)}</span>` : ""}
    </button>
  `;
}
