// Saves progress (skill XP, items, tool belt, built stations/buildings, discoveries) in the browser's
// localStorage, and loads it on startup.

import { ITEMS } from "../data/items.js";
import { getStation } from "../data/stations.js";
import { getBuilding } from "../data/buildings.js";
import { state, onChange } from "./state.js";

const SAVE_KEY = "sdravus-save";
const SAVE_VERSION = 1;

// Old id -> new id, so progress carries over when something is renamed.
const RENAMED_SKILLS = { exploring: "foraging" };
const RENAMED_ITEMS = { pebble: "flint" };

export function loadGame() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(SAVE_KEY));
  } catch {
    return; // No access to storage, or a broken save: start fresh.
  }
  if (!data || data.version !== SAVE_VERSION) return;

  // Only copy known skills and valid numbers, so an old or edited save can't break the game.
  for (const [oldId, skill] of Object.entries(data.skills || {})) {
    const id = RENAMED_SKILLS[oldId] || oldId;
    if (state.skills[id] && isCount(skill.xp)) state.skills[id].xp = Math.max(state.skills[id].xp, skill.xp);
  }
  for (const [oldId, count] of Object.entries(data.items || {})) {
    const id = RENAMED_ITEMS[oldId] || oldId;
    if (ITEMS[id] && isCount(count)) state.items[id] = (state.items[id] || 0) + count;
  }
  (data.toolBelt || []).forEach((id, slot) => {
    if (slot < state.toolBelt.length && ITEMS[id]?.tool) state.toolBelt[slot] = id;
  });
  // ("stations" is the older name for "built")
  for (const id of Object.keys(data.built || data.stations || {})) {
    if (getStation(id) || getBuilding(id)) state.built[id] = true;
  }
  for (const oldId of Object.keys(data.seen || {})) {
    const id = RENAMED_ITEMS[oldId] || oldId;
    if (ITEMS[id]) state.seen[id] = true;
  }
  for (const key of Object.keys(data.viewed || {})) state.viewed[key] = true;

  // Anything you own now counts as seen (also covers saves from before discovery existed).
  Object.keys(state.items).forEach((id) => (state.seen[id] = true));
  state.toolBelt.forEach((id) => id && (state.seen[id] = true));
}

export function saveGame() {
  const { skills, items, toolBelt, built, seen, viewed } = state;
  const data = { version: SAVE_VERSION, skills, items, toolBelt, built, seen, viewed };
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
