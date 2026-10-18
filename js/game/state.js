// The player's progress: items in the stash, tools on the Tool Belt, what's built in the
// Village, where villagers work, and what they've discovered.
// Anything that changes state calls notify() so the screen can update.

import { TOOL_BELT_SLOTS } from "../config.js";

export const state = {
  items: {},
  toolBelt: Array(TOOL_BELT_SLOTS).fill(null), // item id per slot, or null if empty
  built: {},  // station or building id -> how many are built (stations: 1)
  workers: {}, // work spot key ("lumberjack:tree") -> villagers working there
  seen: {},   // item id -> true once ever owned (reveals recipes, stations and buildings)
  viewed: {}, // "recipe:id" / "station:id" / "building:id" -> true once shown (for "New" badges)
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
