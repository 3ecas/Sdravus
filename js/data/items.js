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

  // Crafted
  twine:     { name: "Twine",     icon: "🧶" },
  stone_axe: { name: "Stone Axe", icon: "🪓", tool: true },
};

export function getItem(id) {
  return ITEMS[id];
}
