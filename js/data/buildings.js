// Village buildings: built once (instantly), then they produce resources on their own over time,
// even while you're doing something else. (Stations, which unlock recipes, are in stations.js.)
// A building shows up in the Village once you've had any of its materials.

export const BUILDINGS = [
  {
    id: "well",
    name: "Well",
    icon: "🪣",
    cost: [
      { item: "stone", amount: 30 },
      { item: "planks", amount: 10 },
      { item: "twine", amount: 5 },
    ],
    produces: { item: "water", amount: 1, seconds: 10 },
  },
  {
    id: "chicken_coop",
    name: "Chicken Coop",
    icon: "🐔",
    cost: [
      { item: "oak_planks", amount: 20 },
      { item: "planks", amount: 15 },
      { item: "twine", amount: 8 },
    ],
    produces: { item: "egg", amount: 1, seconds: 30 },
  },
  {
    id: "cow_pen",
    name: "Cow Pen",
    icon: "🐄",
    cost: [
      { item: "oak_planks", amount: 40 },
      { item: "stone_bricks", amount: 20 },
      { item: "twine", amount: 12 },
    ],
    produces: { item: "milk", amount: 1, seconds: 45 },
  },
];

export function getBuilding(id) {
  return BUILDINGS.find((building) => building.id === id);
}
