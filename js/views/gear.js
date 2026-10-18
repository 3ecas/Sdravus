// Gear page: equipment slots arranged like a body on the left, backpack slots on the right,
// and a tool belt underneath.
// The backpack will hold food and supplies for fights you can't leave early.
// The tool belt will hold key tools: axes, pickaxes, fishing rods...

import { BACKPACK_SLOTS, TOOL_BELT_SLOTS } from "../config.js";
import { GEAR_SLOTS } from "../data/gear.js";

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
      <div class="tool-belt">${emptySlotsHtml(TOOL_BELT_SLOTS)}</div>
    </section>
  `;
}

function gearSlotHtml(slot) {
  return `
    <div class="gear-slot" style="grid-area:${slot.id}" title="${slot.name}: empty">
      <div class="slot-box"><span class="gear-hint">${slot.icon}</span></div>
      <span class="gear-name">${slot.name}</span>
    </div>
  `;
}

function emptySlotsHtml(count) {
  return Array.from({ length: count }, () => `<div class="slot-box" title="Empty"></div>`).join("");
}
