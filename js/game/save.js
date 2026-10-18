// Saves progress (skill XP, items, tool belt, built stations/buildings, discoveries) in the browser's
// localStorage, and loads it on startup.

import { ITEMS } from "../data/items.js";
import { getStation } from "../data/stations.js";
import { getBuilding } from "../data/buildings.js";
import { state, onChange } from "./state.js";

const SAVE_KEY = "sdravus-save";
const SAVE_VERSION = 6; // 6: Bucket of Water (water is kept in buckets). 2: new XP scale (actions give ~1 XP early). 3-4: no-XP test versions (no skills, built counts). 5: XP is back

// Old id -> new id, so progress carries over when something is renamed.
const RENAMED_SKILLS = { exploring: "foraging" };
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
  // Version 1 saves earned ~10x more XP per action, so scale it down to keep progress fair.
  const xpScale = data.version < 2 ? 0.1 : 1;

  // Only copy known skills and valid numbers, so an old or edited save can't break the game.
  for (const [oldId, skill] of Object.entries(data.skills || {})) {
    const id = RENAMED_SKILLS[oldId] || oldId;
    if (state.skills[id] && isCount(skill.xp)) {
      state.skills[id].xp = Math.max(state.skills[id].xp, Math.round(skill.xp * xpScale));
    }
  }
  for (const [oldId, count] of Object.entries(data.items || {})) {
    const id = renamedItem(oldId);
    if (id === "water") continue; // loose water is gone: it's kept in buckets now
    if (ITEMS[id] && isCount(count)) state.items[id] = (state.items[id] || 0) + count;
  }
  (data.toolBelt || []).forEach((oldId, slot) => {
    const id = renamedItem(oldId);
    if (slot < state.toolBelt.length && ITEMS[id]?.tool) state.toolBelt[slot] = id;
    else if (ITEMS[id]) state.items[id] = (state.items[id] || 0) + 1; // no longer a tool (e.g. buckets): back to the stash
  });
  // ("stations" is the older name for "built"; versions 3-4 stored counts instead of true)
  for (const id of Object.keys(data.built || data.stations || {})) {
    if (getStation(id) || getBuilding(id)) state.built[id] = true;
  }
  if (isCount(data.wellFill)) state.wellFill = data.wellFill;
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
  const { skills, items, toolBelt, built, wellFill, seen, viewed } = state;
  const data = { version: SAVE_VERSION, skills, items, toolBelt, built, wellFill, seen, viewed };
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
