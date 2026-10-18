// Village buildings: built once, then they produce resources on their own over time,
// even while you're doing something else. (Stations, which unlock recipes, are in stations.js.)
// A building shows up in the Village once you've had any of its materials.

export const BUILDINGS = [
  {
    id: "well",
    name: "Well",
    icon: "🪣",
    seconds: 15,
    cost: [
      { item: "flint",  amount: 8 },
      { item: "planks", amount: 4 },
      { item: "twine",  amount: 3 },
    ],
    produces: { item: "water", amount: 1, seconds: 10 },
  },
];

export function getBuilding(id) {
  return BUILDINGS.find((building) => building.id === id);
}
