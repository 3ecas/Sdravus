// Gear panel: equipment slots arranged like a body (head on top, hands at the sides, legs below).

import { GEAR_SLOTS } from "../data/gear.js";

export function gearPanelHtml() {
  return `
    <section class="panel gear-panel">
      <h2 class="panel-title">Gear</h2>
      <div class="gear-grid">${GEAR_SLOTS.map(slotHtml).join("")}</div>
    </section>
  `;
}

function slotHtml(slot) {
  return `
    <div class="gear-slot" style="grid-area:${slot.id}" title="${slot.name}: empty">
      <div class="gear-box"><span class="gear-hint">${slot.icon}</span></div>
      <span class="gear-name">${slot.name}</span>
    </div>
  `;
}
