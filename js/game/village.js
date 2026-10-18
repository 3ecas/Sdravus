// Village rules: build stations with materials. Building takes a few seconds, like other actions.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { state, hasItems, removeItem } from "./state.js";

export function isBuilt(stationId) {
  return Boolean(state.stations[stationId]);
}

export function buildActionId(station) {
  return `village:${station.id}`;
}

export function canBuild(station) {
  return !isBuilt(station.id) && hasItems(station.cost);
}

export function isBuilding(station) {
  return activeActionId() === buildActionId(station);
}

// Click a station: start building it, or stop if already building it.
export function toggleBuild(station) {
  if (isBuilding(station)) return stopAction();
  if (!canBuild(station)) return;

  startAction(buildActionId(station), station.seconds * 1000, () => {
    stopAction(); // built once, then done
    if (!canBuild(station)) return [];
    station.cost.forEach(({ item, amount }) => removeItem(item, amount));
    state.stations[station.id] = true;
    return [];
  });
}
