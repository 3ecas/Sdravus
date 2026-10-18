// Village stations: built once, each unlocks a group of recipes (e.g. the Workbench).
// skill: the skill page whose recipes it unlocks; the station is a tab on that page.
// (Buildings like the Well, which produce resources over time, are in buildings.js.)
// A station shows up in the Village once you've had any of its materials.

export const STATIONS = [
  {
    id: "workbench",
    name: "Workbench",
    icon: "🪚",
    skill: "crafting",
    seconds: 20,
    cost: [
      { item: "logs", amount: 25 },
      { item: "twine", amount: 4 },
      { item: "flint", amount: 4 },
    ],
    unlocks: "Planks, bowls and other wooden things",
  },
  {
    id: "campfire",
    name: "Campfire",
    icon: "🔥",
    skill: "cooking",
    seconds: 15,
    cost: [
      { item: "branch", amount: 10 },
      { item: "flint", amount: 6 },
      { item: "logs", amount: 12 },
    ],
    unlocks: "Cooking: roasted berries, tea, stew",
  },
  {
    id: "furnace",
    name: "Furnace",
    icon: "🧱",
    skill: "smithing",
    seconds: 30,
    cost: [
      { item: "stone", amount: 30 },
      { item: "clay", amount: 15 },
      { item: "logs", amount: 10 },
    ],
    unlocks: "Smithing: charcoal, stone bricks, metal bars",
  },
  {
    id: "anvil",
    name: "Anvil",
    icon: "⚒️",
    skill: "smithing",
    seconds: 40,
    cost: [
      { item: "stone_bricks", amount: 12 },
      { item: "bronze_bar", amount: 8 },
    ],
    unlocks: "Smithing: metal tools",
  },
];

export function getStation(id) {
  return STATIONS.find((station) => station.id === id);
}
