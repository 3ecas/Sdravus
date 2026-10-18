// Page for a gathering skill with nodes to click (Lumberjack: trees, Mining: rocks).
// Click a node to start, click again to stop. A node you don't have the tool for is greyed
// out with the missing tool crossed out in the corner.
//
// nodePage("mining", ROCKS, { verb: "Mining" }) returns the page's render function.

import { getItem } from "../data/items.js";
import { onChange } from "../game/state.js";
import { toggleGather, gatherActionId, hasToolFor } from "../game/gathering.js";
import { bindActionCards } from "../ui/actionCards.js";

export function nodePage(skill, nodes, { verb }) {
  const getNode = (id) => nodes.find((node) => node.id === id);

  return (container) => {
    container.innerHTML = `<div class="action-grid">${nodes.map((n) => nodeCardHtml(skill, n)).join("")}</div>`;

    const cards = [...container.querySelectorAll(".action-card")];
    cards.forEach((card) => {
      card.addEventListener("click", () => toggleGather(skill, getNode(card.dataset.id), verb));
    });

    function update() {
      cards.forEach((card) => {
        card.classList.toggle("locked", !hasToolFor(getNode(card.dataset.id)));
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

function nodeCardHtml(skill, node) {
  const tool = node.tool ? getItem(node.tool) : null;
  return `
    <button class="action-card" data-id="${node.id}" data-action="${gatherActionId(skill, node)}">
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
