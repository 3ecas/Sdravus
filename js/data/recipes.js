// Crafting recipes.
// station: null = by hand, or the Village station needed (e.g. "workbench").
// level: Crafting level needed. inputs are used up each craft.
// repeat: false crafts one at a time (tools: you only need one).
// A recipe shows up once you've had any of its inputs (and its station is built).

export const RECIPES = [
  // By hand
  {
    id: "twine",
    name: "Twine",
    station: null,
    level: 1,
    xp: 5,
    seconds: 2,
    inputs: [{ item: "fiber", amount: 3 }],
    output: { item: "twine", amount: 1 },
    repeat: true,
  },
  {
    id: "stone_axe",
    name: "Stone Axe",
    station: null,
    level: 1,
    xp: 15,
    seconds: 4,
    inputs: [
      { item: "branch", amount: 1 },
      { item: "flint",  amount: 1 },
      { item: "twine",  amount: 1 },
    ],
    output: { item: "stone_axe", amount: 1 },
    repeat: false,
  },

  // Workbench
  {
    id: "planks",
    name: "Planks",
    station: "workbench",
    level: 1,
    xp: 8,
    seconds: 3,
    inputs: [{ item: "logs", amount: 2 }],
    output: { item: "planks", amount: 1 },
    repeat: true,
  },
  {
    id: "wooden_bowl",
    name: "Wooden Bowl",
    station: "workbench",
    level: 5,
    xp: 20,
    seconds: 5,
    inputs: [{ item: "logs", amount: 3 }],
    output: { item: "wooden_bowl", amount: 1 },
    repeat: true,
  },
];

export function getRecipe(id) {
  return RECIPES.find((recipe) => recipe.id === id);
}
