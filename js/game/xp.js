// XP needed for each level, from XP_CURVE in config.js, capped at MAX_LEVEL.

import { MAX_LEVEL, XP_CURVE } from "../config.js";

const XP_TABLE = buildXpTable();

function buildXpTable() {
  const table = [0, 0]; // table[level] = total XP needed to reach that level
  let step = XP_CURVE.first; // XP from one level to the next
  for (let level = 2; level <= MAX_LEVEL; level++) {
    table[level] = table[level - 1] + Math.round(step);
    step *= XP_CURVE.growth;
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
