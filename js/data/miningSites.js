// Mining sites: places you mine, each with its own rocks (a tab on the Mining page).
// A site needs a pickaxe of at least its toolTier on the Tool Belt. Inside a site you pick a
// rock and always get its ore; better pickaxes give more per click. Each click also has a
// small chance of the site's rare find (gems get better deeper down).
//
// Tiers: 1 Flint, 2 Bronze, 3 Iron, 4 Steel, 5 Mithril, 6 Adamant, 7 Starsteel.
// rare: [{ item, chance }] rolled on every click at the site (0.02 = 2%).

const site = (toolTier, data) => ({
  ...data,
  toolTier,
  rocks: data.rocks.map((rock) => ({ ...rock, toolType: "pickaxe", toolTier })),
});

export const MINING_SITES = [
  site(1, {
    id: "quarry",
    name: "Quarry",
    icon: "🏔️",
    rocks: [
      { id: "rock",   name: "Rock",        icon: "⛰️", item: "stone" },
      { id: "copper", name: "Copper Rock", icon: "🟠", item: "copper_ore" },
      { id: "tin",    name: "Tin Rock",    icon: "⚪", item: "tin_ore" },
      { id: "clay",   name: "Clay Pit",    icon: "🏺", item: "clay" },
    ],
    rare: [{ item: "quartz", chance: 0.02 }],
  }),
  site(2, {
    id: "hillside",
    name: "Hillside",
    icon: "⛰️",
    rocks: [
      { id: "iron", name: "Iron Rock", icon: "🟤", item: "iron_ore" },
      { id: "coal", name: "Coal Rock", icon: "⬛", item: "coal" },
    ],
    rare: [{ item: "sapphire", chance: 0.015 }],
  }),
  site(3, {
    id: "old_mine",
    name: "Old Mine",
    icon: "🕳️",
    rocks: [
      { id: "silver",  name: "Silver Rock",  icon: "🔘", item: "silver_ore" },
      { id: "mithril", name: "Mithril Rock", icon: "🔵", item: "mithril_ore" },
    ],
    rare: [{ item: "emerald", chance: 0.012 }],
  }),
  site(4, {
    id: "deep_cave",
    name: "Deep Cave",
    icon: "🦇",
    rocks: [
      { id: "gold",    name: "Gold Rock",    icon: "🟡", item: "gold_ore" },
      { id: "adamant", name: "Adamant Rock", icon: "🟢", item: "adamant_ore" },
    ],
    rare: [{ item: "ruby", chance: 0.01 }],
  }),
  site(6, {
    id: "starfall_crater",
    name: "Starfall Crater",
    icon: "☄️",
    rocks: [
      { id: "fallen_star", name: "Fallen Star", icon: "🌟", item: "star_ore" },
    ],
    rare: [{ item: "diamond", chance: 0.008 }],
  }),
];
