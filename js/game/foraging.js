// Foraging rules: each cycle in an area finds a random item and gives XP.
// Higher Foraging levels find more of it (+1 every 20 levels).

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, addXp, skillXp } from "./state.js";
import { levelFromXp } from "./xp.js";
import { levelBonus } from "./gathering.js";

const SKILL = "foraging";

export function forageActionId(area) {
  return `${SKILL}:${area.id}`;
}

export function canForage(area) {
  return levelFromXp(skillXp(SKILL)) >= area.level;
}

export function isForaging(area) {
  return activeActionId() === forageActionId(area);
}

// Click an area: start foraging there, or stop if already foraging there.
export function toggleForage(area) {
  if (isForaging(area)) return stopAction();
  if (!canForage(area)) return;

  startAction(forageActionId(area), area.seconds * 1000, () => {
    const item = rollFind(area.finds);
    const amount = 1 + levelBonus(SKILL);
    addItem(item, amount);
    addXp(SKILL, area.xp);
    return [{ item, amount }];
  }, { verb: "Foraging", name: area.name, icon: "🧺", page: SKILL });
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
