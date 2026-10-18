// What the player knows about: recipes and stations appear once you've had any of
// their materials. Things not yet shown to the player count as "new" (menu dot + badge).

import { RECIPES } from "../data/recipes.js";
import { STATIONS } from "../data/stations.js";
import { state, notify } from "./state.js";
import { isBuilt } from "./village.js";

function hasSeenAny(list) {
  return list.some(({ item }) => state.seen[item]);
}

// Recipes you know about, whether or not their station is built yet.
export function knownRecipes() {
  return RECIPES.filter((recipe) => hasSeenAny(recipe.inputs));
}

// Known recipes you can see on the Crafting page (hand recipes + built stations).
export function visibleRecipes() {
  return knownRecipes().filter((recipe) => !recipe.station || isBuilt(recipe.station));
}

export function visibleStations() {
  return STATIONS.filter((station) => hasSeenAny(station.cost));
}

export function isNew(type, id) {
  return !state.viewed[`${type}:${id}`];
}

// Remember that these were shown, so they stop counting as new.
export function markViewed(type, things) {
  const fresh = things.filter((thing) => isNew(type, thing.id));
  fresh.forEach((thing) => (state.viewed[`${type}:${thing.id}`] = true));
  if (fresh.length) notify();
}

// Does this menu page have something new to look at?
export function pageHasNew(pageId) {
  if (pageId === "crafting") return visibleRecipes().some((recipe) => isNew("recipe", recipe.id));
  if (pageId === "village") {
    return visibleStations().some((station) => !isBuilt(station.id) && isNew("station", station.id));
  }
  return false;
}
