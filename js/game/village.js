// Village rules: build stations (unlock recipes) and buildings (produce resources, or house
// villagers) instantly, by paying their materials. Repeatable buildings (Huts) cost more each time.

import { state, hasItems, removeItem, notify } from "./state.js";

export function isBuilt(id) {
  return builtCount(id) > 0;
}

export function builtCount(id) {
  return Number(state.built[id]) || 0;
}

// What building it (again) costs right now: ×costGrowth for every one already built.
export function buildCost(thing) {
  if (!thing.repeatable) return thing.cost;
  const scale = (thing.costGrowth || 1) ** builtCount(thing.id);
  return thing.cost.map(({ item, amount }) => ({ item, amount: Math.ceil(amount * scale) }));
}

export function canBuild(thing) {
  return (thing.repeatable || !isBuilt(thing.id)) && hasItems(buildCost(thing));
}

export function build(thing) {
  if (!canBuild(thing)) return false;
  buildCost(thing).forEach(({ item, amount }) => removeItem(item, amount));
  state.built[thing.id] = builtCount(thing.id) + 1;
  notify();
  return true;
}
