// Mining sites: places you mine, each with its own rocks (a tab on the Mining page).
// You pick a rock and always get its ore. Each hit also has a small chance of a rare find.
//
// site.level: Mining level needed to mine there.
// rock: level (Mining level), tool (needed on the Tool Belt), xp and seconds per hit, item it gives.
// rare: [{ item, chance }] rolled on every hit at the site (0.02 = 2%).

const PICKAXE = "flint_pickaxe";

export const MINING_SITES = [
  {
    id: "quarry",
    name: "Quarry",
    icon: "🏔️",
    level: 1,
    rocks: [
      { id: "rock",   name: "Rock",        icon: "⛰️", level: 1, tool: PICKAXE, xp: 10, seconds: 4, item: "stone" },
      { id: "copper", name: "Copper Rock", icon: "🟠", level: 3, tool: PICKAXE, xp: 14, seconds: 4, item: "copper_ore" },
      { id: "tin",    name: "Tin Rock",    icon: "⚪", level: 5, tool: PICKAXE, xp: 16, seconds: 4, item: "tin_ore" },
    ],
    rare: [{ item: "uncut_gem", chance: 0.02 }],
  },
];
