// Buildings that produce resources (like the Well) do it on their own, every few seconds,
// alongside whatever the player is doing. Runs while the game is open.

import { BUILDINGS } from "../data/buildings.js";
import { addItem, notify } from "./state.js";
import { isBuilt } from "./village.js";

const TICK_MS = 250;
const elapsed = {}; // building id -> ms since its last delivery
const producedListeners = new Set();
let last = performance.now();

export function startProduction() {
  setInterval(tick, TICK_MS);
}

// 0 to 1: how close a building is to its next delivery.
export function productionProgress(building) {
  return Math.min((elapsed[building.id] || 0) / (building.produces.seconds * 1000), 1);
}

// Call fn(buildingId, gains) whenever a building delivers. Returns a function that stops listening.
export function onProduced(fn) {
  producedListeners.add(fn);
  return () => producedListeners.delete(fn);
}

function tick() {
  const now = performance.now();
  const dt = now - last;
  last = now;
  let changed = false;

  for (const building of BUILDINGS) {
    if (!building.produces || !isBuilt(building.id)) continue;
    const { item, amount, seconds } = building.produces;
    elapsed[building.id] = (elapsed[building.id] || 0) + dt;

    // A loop, so deliveries missed while the tab was in the background still count.
    while (elapsed[building.id] >= seconds * 1000) {
      elapsed[building.id] -= seconds * 1000;
      addItem(item, amount);
      producedListeners.forEach((fn) => fn(building.id, [{ item, amount }]));
      changed = true;
    }
  }

  if (changed) notify();
}
