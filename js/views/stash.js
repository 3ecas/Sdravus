// Stash page: a grid of every item the player owns.

import { ITEMS } from "../data/items.js";
import { onChange, itemCount } from "../game/state.js";

export function renderStash(container) {
  function update() {
    const owned = Object.keys(ITEMS).filter((id) => itemCount(id) > 0);

    container.innerHTML = owned.length
      ? `<div class="stash-grid">${owned.map(cellHtml).join("")}</div>`
      : `<p class="stash-empty">Your stash is empty. Gather or craft something to fill it.</p>`;
  }

  update();
  return onChange(update);
}

function cellHtml(id) {
  const item = ITEMS[id];
  const count = itemCount(id);
  return `
    <div class="stash-cell" title="${item.name}: ${count.toLocaleString()}">
      <div class="stash-box">
        <span class="stash-icon">${item.icon}</span>
        <span class="stash-count">${formatCount(count)}</span>
      </div>
      <span class="stash-name">${item.name}</span>
    </div>
  `;
}

// 950 -> "950", 12500 -> "12.5K", 3000000 -> "3M", so big numbers fit the small box.
function formatCount(count) {
  if (count < 10000) return String(count);
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count);
}
