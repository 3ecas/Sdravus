// Village stations: built once, each unlocks a group of crafting recipes (e.g. the Workbench).
// (Buildings like the Well, which produce resources over time, are in buildings.js.)
// A station shows up in the Village once you've had any of its materials.

export const STATIONS = [
  {
    id: "workbench",
    name: "Workbench",
    icon: "🪚",
    seconds: 10,
    cost: [
      { item: "logs",  amount: 6 },
      { item: "twine", amount: 2 },
      { item: "flint", amount: 2 },
    ],
    unlocks: "Planks, bowls and other wooden things",
  },
];

export function getStation(id) {
  return STATIONS.find((station) => station.id === id);
}
