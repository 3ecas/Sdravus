// Village buildings: built once, then they produce resources on their own over time,
// even while you're doing something else. (Stations, which unlock recipes, are in stations.js.)
// The Well is different: it doesn't produce on its own. You draw water from it (an action
// like chopping), which needs a bucket on the Tool Belt; each trip gives the bucket's capacity.
// A building shows up in the Village once you've had any of its materials.

export const BUILDINGS = [
  {
    id: "well",
    name: "Well",
    icon: "🪣",
    seconds: 30,
    cost: [
      { item: "stone", amount: 30 },
      { item: "planks", amount: 10 },
      { item: "twine", amount: 5 },
    ],
    draw: { item: "water", toolType: "bucket", toolTier: 1, seconds: 5, verb: "Drawing water" },
  },
  {
    id: "chicken_coop",
    name: "Chicken Coop",
    icon: "🐔",
    seconds: 45,
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
    seconds: 60,
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
