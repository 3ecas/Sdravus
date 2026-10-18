// Mining sites: places you mine, each with its own rocks (a tab on the Mining page).
// Sites unlock with Mining level. Inside a site you pick a rock and always get its ore.
// Each hit also has a small chance of the site's rare find (gems get better deeper down).
//
// site.level: Mining level needed to mine there.
// rock: level (Mining level), tool (pickaxe tier needed on the Tool Belt; better pickaxes also
//       mine faster), xp and seconds per hit, item it gives.
//       XP follows the guide in CLAUDE.md (~x1.066 per level), scaled up for slower rocks.
// rare: [{ item, chance }] rolled on every hit at the site (0.02 = 2%).

// Pickaxe tier needed. Iron and deeper need Bronze (tier 2) for now; raise these when
// Iron and better pickaxes exist.
const FLINT = { toolType: "pickaxe", toolTier: 1 };
const BRONZE = { toolType: "pickaxe", toolTier: 2 };

export const MINING_SITES = [
  {
    id: "quarry",
    name: "Quarry",
    icon: "🏔️",
    level: 1,
    rocks: [
      { id: "rock",   name: "Rock",        icon: "⛰️", level: 1, ...FLINT, xp: 1, seconds: 5, item: "stone" },
      { id: "copper", name: "Copper Rock", icon: "🟠", level: 3, ...FLINT, xp: 2, seconds: 5, item: "copper_ore" },
      { id: "tin",    name: "Tin Rock",    icon: "⚪", level: 5, ...FLINT, xp: 3, seconds: 5, item: "tin_ore" },
      { id: "clay",   name: "Clay Pit",    icon: "🏺", level: 8, ...FLINT, xp: 2, seconds: 5, item: "clay" },
    ],
    rare: [{ item: "quartz", chance: 0.02 }],
  },
  {
    id: "hillside",
    name: "Hillside",
    icon: "⛰️",
    level: 15,
    rocks: [
      { id: "iron", name: "Iron Rock", icon: "🟤", level: 15, ...BRONZE, xp: 3, seconds: 5, item: "iron_ore" },
      { id: "coal", name: "Coal Rock", icon: "⬛", level: 30, ...BRONZE, xp: 8, seconds: 6, item: "coal" },
    ],
    rare: [{ item: "sapphire", chance: 0.015 }],
  },
  {
    id: "old_mine",
    name: "Old Mine",
    icon: "🕳️",
    level: 40,
    rocks: [
      { id: "silver",  name: "Silver Rock",  icon: "🔘", level: 40, ...BRONZE, xp: 15, seconds: 6, item: "silver_ore" },
      { id: "mithril", name: "Mithril Rock", icon: "🔵", level: 45, ...BRONZE, xp: 21, seconds: 6, item: "mithril_ore" },
    ],
    rare: [{ item: "emerald", chance: 0.012 }],
  },
  {
    id: "deep_cave",
    name: "Deep Cave",
    icon: "🦇",
    level: 55,
    rocks: [
      { id: "gold",    name: "Gold Rock",    icon: "🟡", level: 55, ...BRONZE, xp: 40, seconds: 7, item: "gold_ore" },
      { id: "adamant", name: "Adamant Rock", icon: "🟢", level: 60, ...BRONZE, xp: 54, seconds: 7, item: "adamant_ore" },
    ],
    rare: [{ item: "ruby", chance: 0.01 }],
  },
  {
    id: "starfall_crater",
    name: "Starfall Crater",
    icon: "☄️",
    level: 80,
    rocks: [
      { id: "fallen_star", name: "Fallen Star", icon: "🌟", level: 85, ...BRONZE, xp: 320, seconds: 8, item: "star_ore" },
    ],
    rare: [{ item: "diamond", chance: 0.008 }],
  },
];
