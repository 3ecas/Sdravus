// Gathering from nodes (trees for Lumberjack, rocks for Mining...): each cycle gives the
// node's item and XP in the skill, plus a chance at the place's rare finds. A node can
// need a tool on the Tool Belt (Flint Axe, Flint Pickaxe...) and a skill level.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, addXp, skillXp } from "./state.js";
import { hasToolEquipped } from "./toolBelt.js";
import { levelFromXp } from "./xp.js";

export function gatherActionId(skill, node) {
  return `${skill}:${node.id}`;
}

export function hasToolFor(node) {
  return !node.tool || hasToolEquipped(node.tool);
}

export function hasLevelFor(skill, thing) {
  return levelFromXp(skillXp(skill)) >= thing.level;
}

export function canGather(skill, node) {
  return hasToolFor(node) && hasLevelFor(skill, node);
}

export function isGathering(skill, node) {
  return activeActionId() === gatherActionId(skill, node);
}

// Click a node: start gathering from it, or stop if already gathering from it.
//   verb: for the activity bar ("Chopping", "Mining")
//   tab:  the page tab it's on (e.g. the mining site), so the activity bar links back to it
//   rare: [{ item, chance }] bonus finds rolled on every cycle
export function toggleGather(skill, node, { verb, tab = null, rare = [] }) {
  if (isGathering(skill, node)) return stopAction();
  if (!canGather(skill, node)) return;

  startAction(gatherActionId(skill, node), node.seconds * 1000, () => {
    if (!canGather(skill, node)) {
      stopAction(); // tool was taken off the belt
      return [];
    }
    const gains = [{ item: node.item, amount: 1 }];
    rare.forEach(({ item, chance }) => {
      if (Math.random() < chance) gains.push({ item, amount: 1 });
    });
    gains.forEach(({ item, amount }) => addItem(item, amount));
    addXp(skill, node.xp);
    return gains;
  }, { verb, name: node.name, icon: node.icon, page: skill, tab });
}
