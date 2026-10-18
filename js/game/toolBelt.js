// Tool Belt rules: tools are moved from the stash onto the belt to be used,
// and moved back to the stash when unequipped. Skills use the best equipped tool of a type.

import { getItem } from "../data/items.js";
import { state, itemCount, addItem, removeItem, notify } from "./state.js";

export function hasToolEquipped(itemId) {
  return state.toolBelt.includes(itemId);
}

// The best (highest tier) equipped tool of a type ("axe", "pickaxe"), or null.
export function bestTool(type) {
  return state.toolBelt
    .filter(Boolean)
    .map(getItem)
    .filter((item) => item.tool?.type === type)
    .sort((a, b) => b.tool.tier - a.tool.tier)[0] || null;
}

export function hasToolTier(type, tier) {
  const tool = bestTool(type);
  return Boolean(tool) && tool.tool.tier >= tier;
}

export function freeToolSlot() {
  return state.toolBelt.indexOf(null); // -1 if the belt is full
}

export function equipTool(itemId) {
  const slot = freeToolSlot();
  if (slot === -1 || itemCount(itemId) < 1) return;
  removeItem(itemId, 1);
  state.toolBelt[slot] = itemId;
  notify();
}

export function unequipTool(slot) {
  const itemId = state.toolBelt[slot];
  if (!itemId) return;
  state.toolBelt[slot] = null;
  addItem(itemId, 1);
  notify();
}
