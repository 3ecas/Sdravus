// Exploring rules: each cycle in an area finds one random item and gives XP.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, addXp, skillXp } from "./state.js";
import { levelFromXp } from "./xp.js";

const SKILL = "exploring";

export function exploreActionId(area) {
  return `${SKILL}:${area.id}`;
}

export function canExplore(area) {
  return levelFromXp(skillXp(SKILL)) >= area.level;
}

export function isExploring(area) {
  return activeActionId() === exploreActionId(area);
}

// Click an area: start exploring it, or stop if already exploring it.
export function toggleExplore(area) {
  if (isExploring(area)) return stopAction();
  if (!canExplore(area)) return;

  startAction(exploreActionId(area), area.seconds * 1000, () => {
    const item = rollFind(area.finds);
    addItem(item, 1);
    addXp(SKILL, area.xp);
    return [{ item, amount: 1 }];
  });
}

// Picks one item, where a higher weight is more likely.
function rollFind(finds) {
  const total = finds.reduce((sum, find) => sum + find.weight, 0);
  let roll = Math.random() * total;
  for (const find of finds) {
    roll -= find.weight;
    if (roll < 0) return find.item;
  }
  return finds[finds.length - 1].item;
}
