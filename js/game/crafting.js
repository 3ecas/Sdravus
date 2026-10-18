// Making things from recipes (Crafting, Cooking, Smithing): click a recipe to use up its
// inputs and get its output instantly. Needs the recipe's station built (if it has one).

import { addItem, removeItem, hasItems, notify } from "./state.js";
import { isBuilt } from "./village.js";

export function hasStationFor(recipe) {
  return !recipe.station || isBuilt(recipe.station);
}

export function canCraft(recipe) {
  return hasStationFor(recipe) && hasItems(recipe.inputs);
}

// Make one. Returns what was gained (empty if it couldn't be made).
export function craft(recipe) {
  if (!canCraft(recipe)) return [];
  recipe.inputs.forEach(({ item, amount }) => removeItem(item, amount));
  addItem(recipe.output.item, recipe.output.amount);
  notify();
  return [recipe.output];
}
