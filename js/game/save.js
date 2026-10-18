// Saves progress (skill XP and items) in the browser's localStorage, and loads it on startup.

import { state, onChange } from "./state.js";

const SAVE_KEY = "sdravus-save";
const SAVE_VERSION = 1;

export function loadGame() {
  let data;
  try {
    data = JSON.parse(localStorage.getItem(SAVE_KEY));
  } catch {
    return; // No access to storage, or a broken save: start fresh.
  }
  if (!data || data.version !== SAVE_VERSION) return;

  // Only copy known skills and valid numbers, so an old or edited save can't break the game.
  for (const [id, skill] of Object.entries(data.skills || {})) {
    if (state.skills[id] && isCount(skill.xp)) state.skills[id].xp = skill.xp;
  }
  for (const [id, count] of Object.entries(data.items || {})) {
    if (isCount(count)) state.items[id] = count;
  }
}

export function saveGame() {
  const data = { version: SAVE_VERSION, skills: state.skills, items: state.items };
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
