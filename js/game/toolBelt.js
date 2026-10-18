// Tool Belt rules: tools are moved from the stash onto the belt to be used,
// and moved back to the stash when unequipped.

import { state, itemCount, addItem, removeItem, notify } from "./state.js";

export function hasToolEquipped(itemId) {
  return state.toolBelt.includes(itemId);
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
