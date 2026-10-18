// Gear page: equipment slots arranged like a body on the left, backpack slots on the right,
// and the Tool Belt underneath.
// The backpack will hold food and supplies for fights you can't leave early.
// The Tool Belt holds key tools (axes, pickaxes, fishing rods...). Right-click a tool to unequip it.

import { BACKPACK_SLOTS } from "../config.js";
import { GEAR_SLOTS } from "../data/gear.js";
import { getItem } from "../data/items.js";
import { state, onChange } from "../game/state.js";
import { unequipTool } from "../game/toolBelt.js";
import { openContextMenu } from "../ui/contextMenu.js";
import { iconHtml } from "../ui/format.js";

export function renderGear(container) {
  container.innerHTML = `
    <div class="panel-row">
      <section class="panel gear-panel">
        <h2 class="panel-title">Gear</h2>
        <div class="gear-grid">${GEAR_SLOTS.map(gearSlotHtml).join("")}</div>
      </section>
      <section class="panel backpack-panel">
        <h2 class="panel-title">Backpack</h2>
        <div class="backpack-grid">${emptySlotsHtml(BACKPACK_SLOTS)}</div>
      </section>
    </div>
    <section class="panel tool-belt-panel">
      <h2 class="panel-title">Tool Belt</h2>
      <div class="tool-belt"></div>
    </section>
  `;

  const beltEl = container.querySelector(".tool-belt");

  beltEl.addEventListener("contextmenu", (event) => {
    const slot = event.target.closest("[data-slot]");
    if (!slot || !state.toolBelt[slot.dataset.slot]) return;
    event.preventDefault();
    openContextMenu(event.clientX, event.clientY, [
      { label: "Unequip", onClick: () => unequipTool(Number(slot.dataset.slot)) },
    ]);
  });

  function updateBelt() {
    beltEl.innerHTML = state.toolBelt.map(toolSlotHtml).join("");
  }

  updateBelt();
  return onChange(updateBelt);
}

function gearSlotHtml(slot) {
  return `
    <div class="gear-slot" style="grid-area:${slot.id}" title="${slot.name}: empty">
      <div class="slot-box"><span class="gear-hint">${slot.icon}</span></div>
      <span class="gear-name">${slot.name}</span>
    </div>
  `;
}

function toolSlotHtml(itemId, index) {
  if (!itemId) return `<div class="slot-box" data-slot="${index}" title="Empty"></div>`;
  const item = getItem(itemId);
  return `
    <div class="slot-box filled" data-slot="${index}" title="${item.name}">
      <span class="slot-icon">${iconHtml(item)}</span>
    </div>
  `;
}

function emptySlotsHtml(count) {
  return Array.from({ length: count }, () => `<div class="slot-box" title="Empty"></div>`).join("");
}
