// The player's progress: skill XP and items owned.
// Anything that changes state calls notify() so the screen can update.

import { MAX_LEVEL } from "../config.js";
import { PAGES } from "../data/pages.js";
import { xpForLevel } from "./xp.js";

export const state = {
  skills: Object.fromEntries(
    PAGES.filter((page) => page.skill).map((page) => [page.id, { xp: 0 }])
  ),
  items: {},
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
}

export function itemCount(id) {
  return state.items[id] || 0;
}

export function addXp(skillId, amount) {
  const skill = state.skills[skillId];
  skill.xp = Math.min(skill.xp + amount, xpForLevel(MAX_LEVEL));
}

export function skillXp(skillId) {
  return state.skills[skillId].xp;
}
