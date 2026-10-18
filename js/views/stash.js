// Stash page: a searchable, sortable grid of owned items on the left, and gear slots on the right.

import { ITEMS } from "../data/items.js";
import { onChange, itemCount } from "../game/state.js";
import { formatCount, escapeHtml } from "../ui/format.js";
import { gearPanelHtml } from "./gear.js";

// Remembered while the game is open, so leaving and coming back keeps your choice.
const view = {
  search: "",
  sortBy: "name", // "name" or "count"
  ascending: true, // name: A→Z / Z→A, count: Less→More / More→Less
};

const SORT_LABELS = {
  name: { true: "A → Z", false: "Z → A" },
  count: { true: "Less → More", false: "More → Less" },
};

export function renderStash(container) {
  container.innerHTML = `
    <div class="stash-layout">
      <section class="panel stash-panel">
        <h2 class="panel-title">Stash</h2>
        <div class="stash-toolbar">
          <input class="stash-search" type="search" placeholder="Search items…" value="${escapeHtml(view.search)}" />
          <button class="sort-btn" data-sort="name"></button>
          <button class="sort-btn" data-sort="count"></button>
        </div>
        <div class="stash-items"></div>
      </section>
      ${gearPanelHtml()}
    </div>
  `;

  const searchEl = container.querySelector(".stash-search");
  const sortButtons = [...container.querySelectorAll(".sort-btn")];
  const itemsEl = container.querySelector(".stash-items");

  searchEl.addEventListener("input", () => {
    view.search = searchEl.value;
    updateItems();
  });

  // Clicking the active sort flips its direction; clicking the other one switches to it.
  sortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sortBy = btn.dataset.sort;
      if (view.sortBy === sortBy) view.ascending = !view.ascending;
      else Object.assign(view, { sortBy, ascending: true });
      updateButtons();
      updateItems();
    });
  });

  function updateButtons() {
    sortButtons.forEach((btn) => {
      const sortBy = btn.dataset.sort;
      const active = view.sortBy === sortBy;
      btn.classList.toggle("active", active);
      btn.textContent = SORT_LABELS[sortBy][active ? view.ascending : true];
    });
  }

  function updateItems() {
    const owned = Object.keys(ITEMS).filter((id) => itemCount(id) > 0);

    if (!owned.length) {
      itemsEl.innerHTML = `<p class="stash-empty">Your stash is empty. Gather or craft something to fill it.</p>`;
      return;
    }

    const query = view.search.trim().toLowerCase();
    const shown = sortItems(owned.filter((id) => ITEMS[id].name.toLowerCase().includes(query)));

    itemsEl.innerHTML = shown.length
      ? `<div class="stash-grid">${shown.map(cellHtml).join("")}</div>`
      : `<p class="stash-empty">No items match “${escapeHtml(view.search.trim())}”.</p>`;
  }

  updateButtons();
  updateItems();
  return onChange(updateItems);
}

function sortItems(ids) {
  const byName = (a, b) => ITEMS[a].name.localeCompare(ITEMS[b].name);
  const byCount = (a, b) => itemCount(a) - itemCount(b) || byName(a, b);
  const compare = view.sortBy === "count" ? byCount : byName;
  const sorted = [...ids].sort(compare);
  return view.ascending ? sorted : sorted.reverse();
}

function cellHtml(id) {
  const item = ITEMS[id];
  const count = itemCount(id);
  return `
    <div class="stash-cell" title="${item.name}: ${count.toLocaleString()}">
      <div class="stash-box">
        <span class="stash-icon">${item.icon}</span>
        <span class="item-count">${formatCount(count)}</span>
      </div>
      <span class="stash-name">${item.name}</span>
    </div>
  `;
}
