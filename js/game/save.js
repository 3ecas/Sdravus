// Saves progress (items, tool belt, built stations/buildings, discoveries) in the browser's
// localStorage, and loads it on startup.

import { ITEMS } from "../data/items.js";
import { getStation } from "../data/stations.js";
import { getBuilding } from "../data/buildings.js";
import { state, onChange } from "./state.js";

const SAVE_KEY = "sdravus-save";
const SAVE_VERSION = 3; // 3: no XP or levels (older saves keep everything except XP)

// Old id -> new id, so progress carries over when something is renamed.
const RENAMED_ITEMS = { pebble: "flint", stone_axe: "flint_axe", stone_pickaxe: "flint_pickaxe", uncut_gem: "quartz" };
const renamedItem = (id) => RENAMED_ITEMS[id] || id;

export function loadGame() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(SAVE_KEY));
  } catch {
    return; // No access to storage, or a broken save: start fresh.
  }
  if (!data || !data.version || data.version > SAVE_VERSION) return;

  // Only copy known ids and valid numbers, so an old or edited save can't break the game.
  for (const [oldId, count] of Object.entries(data.items || {})) {
    const id = renamedItem(oldId);
    if (ITEMS[id] && isCount(count)) state.items[id] = (state.items[id] || 0) + count;
  }
  (data.toolBelt || []).forEach((oldId, slot) => {
    const id = renamedItem(oldId);
    if (slot < state.toolBelt.length && ITEMS[id]?.tool) state.toolBelt[slot] = id;
  });
  // ("stations" is the older name for "built"; older saves stored true instead of a count)
  for (const [id, count] of Object.entries(data.built || data.stations || {})) {
    if (getStation(id) || getBuilding(id)) state.built[id] = count === true ? 1 : Number(count) || 0;
  }
  for (const oldId of Object.keys(data.seen || {})) {
    const id = renamedItem(oldId);
    if (ITEMS[id]) state.seen[id] = true;
  }
  for (const key of Object.keys(data.viewed || {})) {
    const [type, id] = key.split(":"); // e.g. "recipe:stone_axe" -> "recipe:flint_axe"
    state.viewed[`${type}:${renamedItem(id)}`] = true;
  }

  // Anything you own now counts as seen (also covers saves from before discovery existed).
  Object.keys(state.items).forEach((id) => (state.seen[id] = true));
  state.toolBelt.forEach((id) => id && (state.seen[id] = true));
}

export function saveGame() {
  const { items, toolBelt, built, seen, viewed } = state;
  const data = { version: SAVE_VERSION, items, toolBelt, built, seen, viewed };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked (e.g. private mode): keep playing without saving.
  }
}

// Save after every change, and once more when the page is closed.
export function startAutoSave() {
  onChange(saveGame);
  window.addEventListener("pagehide", saveGame);
}

function isCount(value) {
  return Number.isFinite(value) && value >= 0;
}
