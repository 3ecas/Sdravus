// Recipes: click a recipe to make it instantly, if you have the inputs (and its station).
// skill: which page it shows on (Crafting, Cooking, Smithing).
// station: null = by hand, or the Village station needed (e.g. "workbench").
// inputs are used up each time. The FIRST input is the main ingredient: having it is
// what reveals the recipe (so common things like charcoal don't reveal every bar).
// A recipe shows up once you've had any of its inputs (and its station is built).

export const RECIPES = [
  // By hand
  {
    id: "twine",
    name: "Twine",
    skill: "crafting",
    station: null,
    inputs: [{ item: "fiber", amount: 3 }],
    output: { item: "twine", amount: 1 },
  },
  {
    id: "flint_axe",
    name: "Flint Axe",
    skill: "crafting",
    station: null,
    inputs: [
      { item: "branch", amount: 1 },
      { item: "flint",  amount: 1 },
      { item: "twine",  amount: 1 },
    ],
    output: { item: "flint_axe", amount: 1 },
  },
  {
    id: "flint_pickaxe",
    name: "Flint Pickaxe",
    skill: "crafting",
    station: null,
    inputs: [
      { item: "branch", amount: 1 },
      { item: "flint",  amount: 2 },
      { item: "twine",  amount: 1 },
    ],
    output: { item: "flint_pickaxe", amount: 1 },
  },

  // Workbench
  {
    id: "planks",
    name: "Planks",
    skill: "crafting",
    station: "workbench",
    inputs: [{ item: "logs", amount: 2 }],
    output: { item: "planks", amount: 1 },
  },
  {
    id: "wooden_bowl",
    name: "Wooden Bowl",
    skill: "crafting",
    station: "workbench",
    inputs: [{ item: "logs", amount: 3 }],
    output: { item: "wooden_bowl", amount: 1 },
  },
  {
    id: "wooden_handle",
    name: "Wooden Handle",
    skill: "crafting",
    station: "workbench",
    inputs: [{ item: "logs", amount: 1 }],
    output: { item: "wooden_handle", amount: 1 },
  },
  {
    id: "oak_planks",
    name: "Oak Planks",
    skill: "crafting",
    station: "workbench",
    inputs: [{ item: "oak_logs", amount: 2 }],
    output: { item: "oak_planks", amount: 1 },
  },

  // Campfire (Cooking)
  {
    id: "roasted_berries",
    name: "Roasted Berries",
    skill: "cooking",
    station: "campfire",
    inputs: [{ item: "berries", amount: 2 }],
    output: { item: "roasted_berries", amount: 1 },
  },
  {
    id: "flower_tea",
    name: "Flower Tea",
    skill: "cooking",
    station: "campfire",
    inputs: [
      { item: "water",  amount: 1 },
      { item: "flower", amount: 1 },
    ],
    output: { item: "flower_tea", amount: 1 },
  },
  {
    id: "berry_stew",
    name: "Berry Stew",
    skill: "cooking",
    station: "campfire",
    inputs: [
      { item: "berries",     amount: 3 },
      { item: "water",       amount: 1 },
      { item: "wooden_bowl", amount: 1 },
    ],
    output: { item: "berry_stew", amount: 1 },
  },

  // Furnace (Smithing)
  {
    id: "charcoal",
    name: "Charcoal",
    skill: "smithing",
    station: "furnace",
    inputs: [{ item: "logs", amount: 2 }],
    output: { item: "charcoal", amount: 1 },
  },
  {
    id: "stone_bricks",
    name: "Stone Bricks",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "stone",    amount: 2 },
      { item: "charcoal", amount: 1 },
    ],
    output: { item: "stone_bricks", amount: 1 },
  },
  {
    id: "bronze_bar",
    name: "Bronze Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "copper_ore", amount: 1 },
      { item: "tin_ore",    amount: 1 },
      { item: "charcoal",   amount: 1 },
    ],
    output: { item: "bronze_bar", amount: 1 },
  },
  {
    id: "iron_bar",
    name: "Iron Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "iron_ore", amount: 1 },
      { item: "charcoal", amount: 1 },
    ],
    output: { item: "iron_bar", amount: 1 },
  },
  {
    id: "steel_bar",
    name: "Steel Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "iron_ore", amount: 1 },
      { item: "coal", amount: 2 },
    ],
    output: { item: "steel_bar", amount: 1 },
  },
  {
    id: "silver_bar",
    name: "Silver Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "silver_ore", amount: 1 },
      { item: "charcoal", amount: 1 },
    ],
    output: { item: "silver_bar", amount: 1 },
  },
  {
    id: "mithril_bar",
    name: "Mithril Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "mithril_ore", amount: 1 },
      { item: "coal", amount: 3 },
    ],
    output: { item: "mithril_bar", amount: 1 },
  },
  {
    id: "gold_bar",
    name: "Gold Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "gold_ore", amount: 1 },
      { item: "charcoal", amount: 1 },
    ],
    output: { item: "gold_bar", amount: 1 },
  },
  {
    id: "adamant_bar",
    name: "Adamant Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "adamant_ore", amount: 1 },
      { item: "coal", amount: 4 },
    ],
    output: { item: "adamant_bar", amount: 1 },
  },
  {
    id: "starsteel_bar",
    name: "Starsteel Bar",
    skill: "smithing",
    station: "furnace",
    inputs: [
      { item: "star_ore", amount: 1 },
      { item: "coal", amount: 5 },
    ],
    output: { item: "starsteel_bar", amount: 1 },
  },

  // Anvil (Smithing)
  {
    id: "bronze_axe",
    name: "Bronze Axe",
    skill: "smithing",
    station: "anvil",
    inputs: [
      { item: "bronze_bar",    amount: 2 },
      { item: "wooden_handle", amount: 1 },
    ],
    output: { item: "bronze_axe", amount: 1 },
  },
  {
    id: "bronze_pickaxe",
    name: "Bronze Pickaxe",
    skill: "smithing",
    station: "anvil",
    inputs: [
      { item: "bronze_bar",    amount: 2 },
      { item: "wooden_handle", amount: 1 },
    ],
    output: { item: "bronze_pickaxe", amount: 1 },
  },
  {
    id: "iron_axe",
    name: "Iron Axe",
    skill: "smithing",
    station: "anvil",
    inputs: [
      { item: "iron_bar",      amount: 3 },
      { item: "wooden_handle", amount: 1 },
    ],
    output: { item: "iron_axe", amount: 1 },
  },
  {
    id: "iron_pickaxe",
    name: "Iron Pickaxe",
    skill: "smithing",
    station: "anvil",
    inputs: [
      { item: "iron_bar",      amount: 3 },
      { item: "wooden_handle", amount: 1 },
    ],
    output: { item: "iron_pickaxe", amount: 1 },
  },
  {
    id: "steel_axe",
    name: "Steel Axe",
    skill: "smithing",
    station: "anvil",
    inputs: [
      { item: "steel_bar",     amount: 4 },
      { item: "wooden_handle", amount: 1 },
    ],
    output: { item: "steel_axe", amount: 1 },
  },
  {
    id: "steel_pickaxe",
    name: "Steel Pickaxe",
    skill: "smithing",
    station: "anvil",
    inputs: [
      { item: "steel_bar",     amount: 4 },
      { item: "wooden_handle", amount: 1 },
    ],
    output: { item: "steel_pickaxe", amount: 1 },
  },
];

export function getRecipe(id) {
  return RECIPES.find((recipe) => recipe.id === id);
}
