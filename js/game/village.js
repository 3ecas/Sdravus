// Village rules: build stations (unlock recipes) and buildings (produce resources) instantly,
// by paying their materials.

import { state, hasItems, removeItem, notify } from "./state.js";

export function isBuilt(id) {
  return builtCount(id) > 0;
}

export function builtCount(id) {
  return Number(state.built[id]) || 0;
}

export function canBuild(thing) {
  return !isBuilt(thing.id) && hasItems(thing.cost);
}

export function build(thing) {
  if (!canBuild(thing)) return false;
  thing.cost.forEach(({ item, amount }) => removeItem(item, amount));
  state.built[thing.id] = builtCount(thing.id) + 1;
  notify();
  return true;
}
