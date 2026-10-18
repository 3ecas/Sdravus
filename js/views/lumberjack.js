// Lumberjack page: click a tree to start chopping, click again to stop.

import { TREES, getTree } from "../data/trees.js";
import { getItem } from "../data/items.js";
import { onChange, itemCount } from "../game/state.js";
import { actionProgress } from "../game/actions.js";
import { toggleChop, isChopping } from "../game/lumberjack.js";
import { formatCount } from "../ui/format.js";

export function renderLumberjack(container) {
  container.innerHTML = `
    <div class="action-grid">${TREES.map(treeCardHtml).join("")}</div>
  `;

  const cards = [...container.querySelectorAll(".action-card")];
  cards.forEach((card) => {
    card.addEventListener("click", () => toggleChop(getTree(card.dataset.id)));
  });

  const lastCounts = {};

  // Runs whenever the game state changes.
  function update() {
    cards.forEach((card) => {
      const tree = getTree(card.dataset.id);
      const chopping = isChopping(tree);
      const count = itemCount(tree.item);
      lastCounts[tree.item] = count;

      card.classList.toggle("active", chopping);
      card.querySelector(".action-status").textContent = chopping ? "Chopping…" : "Click to chop";
      card.querySelector(".item-count").textContent = formatCount(count);
      card.title = `${getItem(tree.item).name} owned: ${count.toLocaleString()}`;
    });
  }

  // Shows "+1 Logs" over the tree when a chop finishes.
  function popGains() {
    cards.forEach((card) => {
      const tree = getTree(card.dataset.id);
      const before = lastCounts[tree.item] || 0;
      const gained = itemCount(tree.item) - before;
      if (gained > 0 && isChopping(tree)) showPop(card, `+${gained} ${getItem(tree.item).icon}`);
    });
  }

  // Smoothly fills the progress bar of the tree being chopped.
  let frame;
  function animate() {
    cards.forEach((card) => {
      const fill = card.querySelector(".action-progress-fill");
      const progress = isChopping(getTree(card.dataset.id)) ? actionProgress() : 0;
      fill.style.width = `${progress * 100}%`;
    });
    frame = requestAnimationFrame(animate);
  }

  const stopListening = onChange(() => {
    popGains();
    update();
  });
  update();
  animate();

  // Called when leaving the page.
  return () => {
    stopListening();
    cancelAnimationFrame(frame);
  };
}

function treeCardHtml(tree) {
  return `
    <button class="action-card" data-id="${tree.id}">
      <span class="action-icon">${tree.icon}</span>
      <span class="action-name">${tree.name}</span>
      <span class="action-meta">+${tree.xp} XP · ${tree.seconds}s</span>
      <span class="action-status">Click to chop</span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
      <span class="item-count">0</span>
    </button>
  `;
}

function showPop(card, text) {
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = text;
  card.appendChild(pop);
  pop.addEventListener("animationend", () => pop.remove());
}
