// Crafting recipes.
// inputs are used up each craft. repeat: false crafts one at a time (tools: you only need one).

export const RECIPES = [
  {
    id: "twine",
    name: "Twine",
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
];

export function getRecipe(id) {
  return RECIPES.find((recipe) => recipe.id === id);
}
