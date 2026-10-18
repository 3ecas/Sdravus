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
  {
    id: "chicken_coop",
    name: "Chicken Coop",
    icon: "🐔",
    seconds: 20,
    cost: [
      { item: "oak_planks", amount: 6 },
      { item: "planks",     amount: 4 },
      { item: "twine",      amount: 4 },
    ],
    produces: { item: "egg", amount: 1, seconds: 30 },
  },
  {
    id: "cow_pen",
    name: "Cow Pen",
    icon: "🐄",
    seconds: 30,
    cost: [
      { item: "oak_planks",   amount: 12 },
      { item: "stone_bricks", amount: 6 },
      { item: "twine",        amount: 6 },
    ],
    produces: { item: "milk", amount: 1, seconds: 45 },
  },
];

export function getBuilding(id) {
  return BUILDINGS.find((building) => building.id === id);
}
