// Village rules: build stations (unlock recipes) and buildings (produce resources) with
// materials. Building takes a few seconds, like other actions.
// Buildings with `draw` (the Well) are worked like a gathering node: pour water into the empty
// buckets in your stash, 2 per trip; a full bucket becomes a Bucket of Water.

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

// The empty bucket in the stash that gets filled next (e.g. "wooden_bucket"), or null.
export function emptyBucket() {
  return Object.keys(ITEMS).find((id) => ITEMS[id].bucket && itemCount(id) > 0) || null;
}

// The bucket being filled: { water, capacity }, e.g. 2 of 5.
export function bucketFill() {
  const id = emptyBucket();
  return { water: id ? state.wellFill : 0, capacity: id ? ITEMS[id].bucket.capacity : 0 };
}

export function canDraw(building) {
  return isBuilt(building.id) && Boolean(emptyBucket());
}

// Click the built Well: start drawing water, or stop if already drawing.
// Each trip pours `amount` water into the current empty bucket. When it's full it becomes a
// Bucket of Water and the rest goes into the next empty bucket; stops when none are left.
export function toggleDraw(building) {
  const id = drawActionId(building);
  if (activeActionId() === id) return stopAction();
  if (!canDraw(building)) return;

  const { amount, seconds, verb } = building.draw;
  startAction(id, seconds * 1000, () => {
    let water = amount;
    let poured = 0;
    const filled = {};
    while (water > 0 && emptyBucket()) {
      const bucketId = emptyBucket();
      const { capacity, fills } = ITEMS[bucketId].bucket;
      const pour = Math.min(water, capacity - state.wellFill);
      state.wellFill += pour;
      water -= pour;
      poured += pour;
      if (state.wellFill >= capacity) {
        removeItem(bucketId, 1);
        addItem(fills, 1);
        filled[fills] = (filled[fills] || 0) + 1;
        state.wellFill = 0;
      }
    }
    if (!emptyBucket()) {
      state.wellFill = 0;
      stopAction(); // every bucket is full
    }
    // "+2 💧" for the poured water, "+1 🪣" for each bucket that got full
    return [
      ...(poured ? [{ item: "water", amount: poured }] : []),
      ...Object.entries(filled).map(([item, n]) => ({ item, amount: n })),
    ];
  }, { verb, name: building.name, icon: building.icon, page: "village" });
}
