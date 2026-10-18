// Crafting rules: use up a recipe's inputs to make its output.
// Repeats until out of materials, except recipes with repeat: false (tools) which make one.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, removeItem, hasItems, addXp, skillXp } from "./state.js";
import { levelFromXp } from "./xp.js";

const SKILL = "crafting";

export function craftActionId(recipe) {
  return `${SKILL}:${recipe.id}`;
}

export function hasLevelFor(recipe) {
  return levelFromXp(skillXp(SKILL)) >= recipe.level;
}

export function canCraft(recipe) {
  return hasLevelFor(recipe) && hasItems(recipe.inputs);
}

export function isCrafting(recipe) {
  return activeActionId() === craftActionId(recipe);
}

// Click a recipe: start crafting it, or stop if already crafting it.
export function toggleCraft(recipe) {
  if (isCrafting(recipe)) return stopAction();
  if (!canCraft(recipe)) return;

  startAction(craftActionId(recipe), recipe.seconds * 1000, () => {
    if (!canCraft(recipe)) {
      stopAction();
      return [];
    }

    recipe.inputs.forEach(({ item, amount }) => removeItem(item, amount));
    addItem(recipe.output.item, recipe.output.amount);
    addXp(SKILL, recipe.xp);

    if (!recipe.repeat || !canCraft(recipe)) stopAction();
    return [recipe.output];
  });
}
