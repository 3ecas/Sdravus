// Lumberjack rules: chopping a tree gives its item and XP each cycle.
// Each tree needs a tool (e.g. a Stone Axe) in the stash.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, addXp, skillXp, itemCount } from "./state.js";
import { levelFromXp } from "./xp.js";

const SKILL = "lumberjack";

export function chopActionId(tree) {
  return `${SKILL}:${tree.id}`;
}

export function hasToolFor(tree) {
  return !tree.tool || itemCount(tree.tool) > 0;
}

export function canChop(tree) {
  return hasToolFor(tree) && levelFromXp(skillXp(SKILL)) >= tree.level;
}

export function isChopping(tree) {
  return activeActionId() === chopActionId(tree);
}

// Click a tree: start chopping it, or stop if already chopping it.
export function toggleChop(tree) {
  if (isChopping(tree)) return stopAction();
  if (!canChop(tree)) return;

  startAction(chopActionId(tree), tree.seconds * 1000, () => {
    addItem(tree.item, 1);
    addXp(SKILL, tree.xp);
    return [{ item: tree.item, amount: 1 }];
  });
}
