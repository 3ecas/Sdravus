// Gathering from nodes (trees for Lumberjack, rocks for Mining...): each cycle gives the
// node's item and XP in the skill, plus a chance at the place's rare finds. A node can
// need a tool of some tier on the Tool Belt (an axe, a pickaxe...) and a skill level.
// Every cycle takes the node's seconds (5s). Better tools and higher levels give more per cycle:
// the best equipped tool's yield, plus 1 for every LEVEL_BONUS_EVERY levels in the skill.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, addXp, skillXp } from "./state.js";
import { hasToolTier, bestTool } from "./toolBelt.js";
import { levelFromXp } from "./xp.js";
import { LEVEL_BONUS_EVERY } from "../config.js";

export function gatherActionId(skill, node) {
  return `${skill}:${node.id}`;
}

export function hasToolFor(node) {
  return !node.toolType || hasToolTier(node.toolType, node.toolTier);
}

// Extra items per cycle from your level in a skill (+1 at Lv 20, +2 at Lv 40...).
export function levelBonus(skill) {
  return Math.floor(levelFromXp(skillXp(skill)) / LEVEL_BONUS_EVERY);
}

// Items per cycle: your best tool's yield (1 without a tool) + the level bonus.
export function gatherYield(skill, node) {
  const toolYield = node.toolType ? bestTool(node.toolType)?.tool.yield || 1 : 1;
  return toolYield + levelBonus(skill);
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
    const gains = [{ item: node.item, amount: gatherYield(skill, node) }];
    rare.forEach(({ item, chance }) => {
      if (Math.random() < chance) gains.push({ item, amount: 1 });
    });
    gains.forEach(({ item, amount }) => addItem(item, amount));
    addXp(skill, node.xp);
    return gains;
  }, { verb, name: node.name, icon: node.icon, page: skill, tab });
}
