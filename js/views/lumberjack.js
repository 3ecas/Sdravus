// Lumberjack page: click a tree to start chopping, click again to stop.
// A tree you don't have the tool for shows what you need.

import { TREES, getTree } from "../data/trees.js";
import { getItem } from "../data/items.js";
import { onChange } from "../game/state.js";
import { toggleChop, chopActionId, hasToolFor } from "../game/lumberjack.js";
import { bindActionCards } from "../ui/actionCards.js";

export function renderLumberjack(container) {
  container.innerHTML = `<div class="action-grid">${TREES.map(treeCardHtml).join("")}</div>`;

  const cards = [...container.querySelectorAll(".action-card")];
  cards.forEach((card) => {
    card.addEventListener("click", () => toggleChop(getTree(card.dataset.id)));
  });

  function update() {
    cards.forEach((card) => {
      card.classList.toggle("locked", !hasToolFor(getTree(card.dataset.id)));
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

function treeCardHtml(tree) {
  const tool = tree.tool ? getItem(tree.tool) : null;
  return `
    <button class="action-card" data-id="${tree.id}" data-action="${chopActionId(tree)}">
      <span class="action-icon">${tree.icon}</span>
      <span class="action-name">${tree.name}</span>
      <span class="action-meta">
        <span>${tree.seconds}s</span>
        <span>+${tree.xp} XP</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
      ${tool ? `<span class="needs-tool">Needs ${tool.icon} ${tool.name}</span>` : ""}
    </button>
  `;
}
