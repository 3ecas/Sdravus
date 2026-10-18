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
    seconds: 10,
    cost: [
      { item: "logs",  amount: 6 },
      { item: "twine", amount: 2 },
      { item: "flint", amount: 2 },
    ],
    unlocks: "Planks, bowls and other wooden things",
  },
  {
    id: "campfire",
    name: "Campfire",
    icon: "🔥",
    skill: "cooking",
    seconds: 8,
    cost: [
      { item: "branch", amount: 5 },
      { item: "flint",  amount: 3 },
      { item: "logs",   amount: 3 },
    ],
    unlocks: "Cooking: roasted berries, tea, stew",
  },
];

export function getStation(id) {
  return STATIONS.find((station) => station.id === id);
}
