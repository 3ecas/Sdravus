// Lumberjack rules: chopping a tree gives its item and XP each cycle.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, addXp, skillXp } from "./state.js";
import { levelFromXp } from "./xp.js";

const SKILL = "lumberjack";

function actionId(tree) {
  return `${SKILL}:${tree.id}`;
}

export function canChop(tree) {
  return levelFromXp(skillXp(SKILL)) >= tree.level;
}

export function isChopping(tree) {
  return activeActionId() === actionId(tree);
}

// Click a tree: start chopping it, or stop if already chopping it.
export function toggleChop(tree) {
  if (isChopping(tree)) return stopAction();
  if (!canChop(tree)) return;

  startAction(actionId(tree), tree.seconds * 1000, () => {
    addItem(tree.item, 1);
    addXp(SKILL, tree.xp);
  });
}
