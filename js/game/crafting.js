// Rules for making things from recipes (Crafting, Cooking...): use up the inputs to make the
// output, and give XP in the recipe's skill. Needs that skill's level and the station (if any).
// Repeats until out of materials, except recipes with repeat: false (tools) which make one.

import { startAction, stopAction, activeActionId } from "./actions.js";
import { addItem, removeItem, hasItems, addXp, skillXp } from "./state.js";
import { levelFromXp } from "./xp.js";
import { isBuilt } from "./village.js";
import { getItem } from "../data/items.js";

const VERBS = { crafting: "Crafting", cooking: "Cooking", smithing: "Smithing" };

export function craftActionId(recipe) {
  return `${recipe.skill}:${recipe.id}`;
}

export function hasLevelFor(recipe) {
  return levelFromXp(skillXp(recipe.skill)) >= recipe.level;
}

export function hasStationFor(recipe) {
  return !recipe.station || isBuilt(recipe.station);
}

export function canCraft(recipe) {
  return hasStationFor(recipe) && hasLevelFor(recipe) && hasItems(recipe.inputs);
}

export function isCrafting(recipe) {
  return activeActionId() === craftActionId(recipe);
}

// Click a recipe: start making it, or stop if already making it.
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
    addXp(recipe.skill, recipe.xp);

    if (!recipe.repeat || !canCraft(recipe)) stopAction();
    return [recipe.output];
  }, {
    verb: VERBS[recipe.skill] || "Making",
    name: recipe.name,
    icon: getItem(recipe.output.item).icon,
    page: recipe.skill,
    tab: recipe.station || "hand",
  });
}
