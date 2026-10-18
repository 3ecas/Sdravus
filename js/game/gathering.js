// Gathering from nodes (trees for Lumberjack, rocks for Mining...): each cycle gives the
// node's item and XP in the skill. A node can need a tool on the Tool Belt (Flint Axe,
// Flint Pickaxe...) and a skill level.

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

export function canGather(skill, node) {
  return hasToolFor(node) && levelFromXp(skillXp(skill)) >= node.level;
}

export function isGathering(skill, node) {
  return activeActionId() === gatherActionId(skill, node);
}

// Click a node: start gathering from it, or stop if already gathering from it.
// verb is for the activity bar ("Chopping", "Mining").
export function toggleGather(skill, node, verb) {
  if (isGathering(skill, node)) return stopAction();
  if (!canGather(skill, node)) return;

  startAction(gatherActionId(skill, node), node.seconds * 1000, () => {
    if (!canGather(skill, node)) {
      stopAction(); // tool was taken off the belt
      return [];
    }
    addItem(node.item, 1);
    addXp(skill, node.xp);
    return [{ item: node.item, amount: 1 }];
  }, { verb, name: node.name, icon: node.icon, page: skill });
}
