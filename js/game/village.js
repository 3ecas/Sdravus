// Village rules: build stations (unlock recipes) and buildings (produce resources) with
// materials. Building takes a few seconds, like other actions.
// Buildings with `draw` (the Well) are worked like a gathering node: draw water into the buckets
// in your stash, 2 per trip, until they're all full.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { state, hasItems, removeItem, addItem, itemCount } from "./state.js";
import { ITEMS } from "../data/items.js";

export function isBuilt(id) {
  return Boolean(state.built[id]);
}

export function buildActionId(thing) {
  return `village:${thing.id}`;
}

export function canBuild(thing) {
  return !isBuilt(thing.id) && hasItems(thing.cost);
}

export function isBuilding(thing) {
  return activeActionId() === buildActionId(thing);
}

// Click a station or building: start building it, or stop if already building it.
export function toggleBuild(thing) {
  if (isBuilding(thing)) return stopAction();
  if (!canBuild(thing)) return;

  startAction(buildActionId(thing), thing.seconds * 1000, () => {
    stopAction(); // built once, then done
    if (!canBuild(thing)) return [];
    thing.cost.forEach(({ item, amount }) => removeItem(item, amount));
    state.built[thing.id] = true;
    return [];
  }, { verb: "Building", name: thing.name, icon: thing.icon, page: "village" });
}

export function drawActionId(building) {
  return `village:draw:${building.id}`;
}

// How much water all your buckets (in the stash) can hold, e.g. 2 Wooden Buckets = 10.
export function waterCapacity() {
  return Object.entries(ITEMS)
    .filter(([, item]) => item.bucket)
    .reduce((sum, [id, item]) => sum + itemCount(id) * item.bucket.capacity, 0);
}

export function hasBucket() {
  return waterCapacity() > 0;
}

// Room left in your buckets.
export function waterRoom(building) {
  return Math.max(waterCapacity() - itemCount(building.draw.item), 0);
}

export function canDraw(building) {
  return isBuilt(building.id) && waterRoom(building) > 0;
}

// Click the built Well: start drawing water, or stop if already drawing.
// Each trip fills the current bucket by `amount`, moving on to the next bucket when one is full.
export function toggleDraw(building) {
  const id = drawActionId(building);
  if (activeActionId() === id) return stopAction();
  if (!canDraw(building)) return;

  const { item, amount, seconds, verb } = building.draw;
  startAction(id, seconds * 1000, () => {
    const poured = Math.min(amount, waterRoom(building));
    if (poured > 0) addItem(item, poured);
    if (waterRoom(building) === 0) stopAction(); // every bucket is full
    return poured > 0 ? [{ item, amount: poured }] : [];
  }, { verb, name: building.name, icon: building.icon, page: "village" });
}
