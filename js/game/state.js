// The player's progress: skill XP, items in the stash, tools on the Tool Belt,
// village stations, and what they've discovered.
// Anything that changes state calls notify() so the screen can update.

import { MAX_LEVEL, TOOL_BELT_SLOTS } from "../config.js";
import { PAGES } from "../data/pages.js";
import { xpForLevel } from "./xp.js";

export const state = {
  skills: Object.fromEntries(
    PAGES.filter((page) => page.skill).map((page) => [page.id, { xp: 0 }])
  ),
  items: {},
  toolBelt: Array(TOOL_BELT_SLOTS).fill(null), // item id per slot, or null if empty
  stations: {}, // station id -> true once built
  seen: {},     // item id -> true once ever owned (reveals recipes and stations)
  viewed: {},   // "recipe:id" / "station:id" -> true once shown to the player (for "New" badges)
};

const listeners = new Set();

// Call fn whenever state changes. Returns a function that stops listening.
export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notify() {
  listeners.forEach((fn) => fn());
}

export function addItem(id, amount = 1) {
  state.items[id] = (state.items[id] || 0) + amount;
  state.seen[id] = true;
}

export function removeItem(id, amount = 1) {
  state.items[id] = Math.max(itemCount(id) - amount, 0);
}

export function itemCount(id) {
  return state.items[id] || 0;
}

// True if the player owns at least `amount` of each item in a list like [{ item, amount }].
export function hasItems(list) {
  return list.every(({ item, amount }) => itemCount(item) >= amount);
}

export function addXp(skillId, amount) {
  const skill = state.skills[skillId];
  skill.xp = Math.min(skill.xp + amount, xpForLevel(MAX_LEVEL));
}

export function skillXp(skillId) {
  return state.skills[skillId].xp;
}
