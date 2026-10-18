// XP needed for each level (RuneScape-style curve: level 2 at 83 XP), capped at MAX_LEVEL.

import { MAX_LEVEL } from "../config.js";

const XP_TABLE = buildXpTable();

function buildXpTable() {
  const table = [0, 0]; // table[level] = total XP needed to reach that level
  let points = 0;
  for (let level = 1; level < MAX_LEVEL; level++) {
    points += Math.floor(level + 300 * Math.pow(2, level / 7));
    table[level + 1] = Math.floor(points / 4);
  }
  return table;
}

export function xpForLevel(level) {
  return XP_TABLE[level];
}

export function levelFromXp(xp) {
  let level = 1;
  while (level < MAX_LEVEL && xp >= XP_TABLE[level + 1]) level++;
  return level;
}

// Level, XP needed for the next level, and % progress through the current level.
export function levelProgress(xp) {
  const level = levelFromXp(xp);
  if (level >= MAX_LEVEL) return { level, next: xp, percent: 100 };

  const start = XP_TABLE[level];
  const next = XP_TABLE[level + 1];
  return { level, next, percent: ((xp - start) / (next - start)) * 100 };
}
