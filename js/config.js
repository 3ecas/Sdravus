// Game-wide settings.

export const GAME_NAME = "Sdravus";
export const MAX_LEVEL = 100;

// Level curve: cheap early levels, steep late ones.
// Level 2 needs `first` XP; every level after needs `growth` times the previous one.
// With 10 and 1.14: Lv 10 = 161 XP, Lv 50 = 44K, Lv 90 = 8.3M, Lv 100 = 30.7M total.
// (Action XP should follow the guide in CLAUDE.md: ~1 XP at Lv 1, ~6.6% more per level.)
export const XP_CURVE = { first: 10, growth: 1.14 };
export const DEFAULT_PAGE = "village";
export const BACKPACK_SLOTS = 16; // slots in the Gear page backpack
export const TOOL_BELT_SLOTS = 6; // slots in the Gear page tool belt
