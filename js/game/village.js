// Village rules: build stations (unlock recipes) and buildings (produce resources) with
// materials. Building takes a few seconds, like other actions.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { state, hasItems, removeItem } from "./state.js";

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
  });
}
