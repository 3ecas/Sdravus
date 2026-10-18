// Every item the player can own. tool: true means it can go on the Tool Belt.

export const ITEMS = {
  // Found while foraging
  branch:  { name: "Branch",      icon: "🥢" },
  flint:   { name: "Flint",       icon: "🪨" },
  fiber:   { name: "Plant Fiber", icon: "🌿" },
  berries: { name: "Berries",     icon: "🫐" },
  flower:  { name: "Flower",      icon: "🌼" },

  // Gathered with tools
  logs: { name: "Logs", icon: "🪵" },

  // Produced by village buildings
  water: { name: "Water", icon: "💧" },

  // Crafted
  twine:       { name: "Twine",       icon: "🧶" },
  stone_axe:   { name: "Stone Axe",   icon: "🪓", tool: true },
  planks:      { name: "Planks",      icon: "🟫" },
  wooden_bowl: { name: "Wooden Bowl", icon: "🥣" },

  // Cooked
  roasted_berries: { name: "Roasted Berries", icon: "🍢" },
  flower_tea:      { name: "Flower Tea",      icon: "🍵" },
  berry_stew:      { name: "Berry Stew",      icon: "🍲" },
};

export function getItem(id) {
  return ITEMS[id];
}
