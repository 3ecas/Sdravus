// Village rules: build stations (unlock recipes) and buildings (produce resources) with
// materials. Building takes a few seconds, like other actions.
// Buildings with `draw` (the Well) are worked like a gathering node: draw water from it with a
// bucket on the Tool Belt; each trip gives the bucket's capacity.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { state, hasItems, removeItem, addItem } from "./state.js";
import { hasToolTier, bestTool } from "./toolBelt.js";

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

export function canDraw(building) {
  const { toolType, toolTier } = building.draw;
  return isBuilt(building.id) && hasToolTier(toolType, toolTier);
}

// How much one trip gives: the best bucket's capacity.
export function drawAmount(building) {
  return bestTool(building.draw.toolType)?.tool.yield || 0;
}

// Click the built Well: start drawing water, or stop if already drawing.
export function toggleDraw(building) {
  const id = drawActionId(building);
  if (activeActionId() === id) return stopAction();
  if (!canDraw(building)) return;

  const { item, seconds, verb } = building.draw;
  startAction(id, seconds * 1000, () => {
    if (!canDraw(building)) {
      stopAction(); // bucket was taken off the belt
      return [];
    }
    const amount = drawAmount(building);
    addItem(item, amount);
    return [{ item, amount }];
  }, { verb, name: building.name, icon: building.icon, page: "village" });
}
