// Every item the player can own. description is shown in the item's right-click menu.

export const ITEMS = {
  // Found while exploring
  branch:  { name: "Branch",      icon: "🥢", description: "A sturdy stick. Good for handles." },
  pebble:  { name: "Pebble",      icon: "🪨", description: "A small stone with a sharp edge." },
  fiber:   { name: "Plant Fiber", icon: "🌿", description: "Tough grass. Twist it into twine." },
  berries: { name: "Berries",     icon: "🫐", description: "Wild berries. A small snack." },
  flower:  { name: "Flower",      icon: "🌼", description: "A pretty wildflower. Might be useful for potions." },

  // Gathered with tools
  logs: { name: "Logs", icon: "🪵", description: "Freshly chopped wood." },

  // Crafted
  twine:     { name: "Twine",     icon: "🧶", description: "Twisted fiber for tying things together." },
  stone_axe: { name: "Stone Axe", icon: "🪓", description: "A simple axe. Lets you chop trees." },
};

export function getItem(id) {
  return ITEMS[id];
}
