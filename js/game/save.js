// Saves progress (skill XP, items, tool belt) in the browser's localStorage, and loads it on startup.

import { ITEMS } from "../data/items.js";
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
}

export function saveGame() {
  const data = { version: SAVE_VERSION, skills: state.skills, items: state.items, toolBelt: state.toolBelt };
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
