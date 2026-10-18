// Recipes for skills that make things (Crafting, Cooking...).
// skill: which skill page it shows on and gives XP to; level is that skill's level.
// station: null = by hand, or the Village station needed (e.g. "workbench").
// inputs are used up each time.
// repeat: false crafts one at a time (tools: you only need one).
// A recipe shows up once you've had any of its inputs (and its station is built).

export const RECIPES = [
  // By hand
  {
    id: "twine",
    name: "Twine",
    skill: "crafting",
    station: null,
    level: 1,
    xp: 5,
    seconds: 2,
    inputs: [{ item: "fiber", amount: 3 }],
    output: { item: "twine", amount: 1 },
    repeat: true,
  },
  {
    id: "flint_axe",
    name: "Flint Axe",
    skill: "crafting",
    station: null,
    level: 1,
    xp: 15,
    seconds: 4,
    inputs: [
      { item: "branch", amount: 1 },
      { item: "flint",  amount: 1 },
      { item: "twine",  amount: 1 },
    ],
    output: { item: "flint_axe", amount: 1 },
    repeat: false,
  },
  {
    id: "flint_pickaxe",
    name: "Flint Pickaxe",
    skill: "crafting",
    station: null,
    level: 1,
    xp: 15,
    seconds: 4,
    inputs: [
      { item: "branch", amount: 1 },
      { item: "flint",  amount: 2 },
      { item: "twine",  amount: 1 },
    ],
    output: { item: "flint_pickaxe", amount: 1 },
    repeat: false,
  },

  // Workbench
  {
    id: "planks",
    name: "Planks",
    skill: "crafting",
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
    skill: "crafting",
    station: "workbench",
    level: 5,
    xp: 20,
    seconds: 5,
    inputs: [{ item: "logs", amount: 3 }],
    output: { item: "wooden_bowl", amount: 1 },
    repeat: true,
  },

  // Campfire (Cooking)
  {
    id: "roasted_berries",
    name: "Roasted Berries",
    skill: "cooking",
    station: "campfire",
    level: 1,
    xp: 6,
    seconds: 3,
    inputs: [{ item: "berries", amount: 2 }],
    output: { item: "roasted_berries", amount: 1 },
    repeat: true,
  },
  {
    id: "flower_tea",
    name: "Flower Tea",
    skill: "cooking",
    station: "campfire",
    level: 3,
    xp: 12,
    seconds: 4,
    inputs: [
      { item: "water",  amount: 1 },
      { item: "flower", amount: 1 },
    ],
    output: { item: "flower_tea", amount: 1 },
    repeat: true,
  },
  {
    id: "berry_stew",
    name: "Berry Stew",
    skill: "cooking",
    station: "campfire",
    level: 5,
    xp: 25,
    seconds: 6,
    inputs: [
      { item: "berries",     amount: 3 },
      { item: "water",       amount: 1 },
      { item: "wooden_bowl", amount: 1 },
    ],
    output: { item: "berry_stew", amount: 1 },
    repeat: true,
  },

  // Furnace (Smithing)
  {
    id: "charcoal",
    name: "Charcoal",
    skill: "smithing",
    station: "furnace",
    level: 1,
    xp: 6,
    seconds: 4,
    inputs: [{ item: "logs", amount: 2 }],
    output: { item: "charcoal", amount: 1 },
    repeat: true,
  },
  {
    id: "stone_bricks",
    name: "Stone Bricks",
    skill: "smithing",
    station: "furnace",
    level: 3,
    xp: 10,
    seconds: 5,
    inputs: [
      { item: "stone",    amount: 2 },
      { item: "charcoal", amount: 1 },
    ],
    output: { item: "stone_bricks", amount: 1 },
    repeat: true,
  },
];

export function getRecipe(id) {
  return RECIPES.find((recipe) => recipe.id === id);
}
