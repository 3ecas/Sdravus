// Game-wide settings.

export const GAME_NAME = "Sdravus";
export const MAX_LEVEL = 100;

// Level curve: cheap early levels, steep late ones.
// Level 2 needs `first` XP; every level after needs `growth` times the previous one.
// With 28 and 1.15: Lv 2 = 28 XP, Lv 3 = 60, Lv 10 = 470, Lv 50 ≈ 176K, Lv 90 ≈ 47M,
// Lv 100 ≈ 191M total (a few minutes per early level, ~20 min to Lv 10, ~14 h to Lv 50,
// ~600+ hours to Lv 100).
// (Action XP should follow the guide in CLAUDE.md: ~1 XP at Lv 1, ~6.6% more per level.)
export const XP_CURVE = { first: 28, growth: 1.15 };
export const DEFAULT_PAGE = "village";
export const BACKPACK_SLOTS = 16; // slots in the Gear page backpack
export const TOOL_BELT_SLOTS = 6; // slots in the Gear page tool belt
export const LEVEL_BONUS_EVERY = 20; // gathering gives +1 item per cycle for every 20 levels in the skill
