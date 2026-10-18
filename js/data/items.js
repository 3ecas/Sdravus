// Every item the player can own. tool: true means it can go on the Tool Belt.

export const ITEMS = {
  // Found while foraging
  branch:  { name: "Branch",      icon: "🥢" },
  flint:   { name: "Flint",       icon: "🔺" },
  fiber:   { name: "Plant Fiber", icon: "🌿" },
  berries: { name: "Berries",     icon: "🫐" },
  flower:  { name: "Flower",      icon: "🌼" },

  // Gathered with tools
  logs: { name: "Logs", icon: "🪵" },

  // Mined
  stone:       { name: "Stone",       icon: "🪨" },
  copper_ore:  { name: "Copper Ore",  icon: "🟠" },
  tin_ore:     { name: "Tin Ore",     icon: "⚪" },
  clay:        { name: "Clay",        icon: "🏺" },
  iron_ore:    { name: "Iron Ore",    icon: "🟤" },
  coal:        { name: "Coal",        icon: "⬛" },
  silver_ore:  { name: "Silver Ore",  icon: "🔘" },
  mithril_ore: { name: "Mithril Ore", icon: "🔵" },
  gold_ore:    { name: "Gold Ore",    icon: "🟡" },
  adamant_ore: { name: "Adamant Ore", icon: "🟢" },
  star_ore:    { name: "Star Ore",    icon: "🌟" },

  // Gems (rare finds while mining)
  quartz:   { name: "Quartz",   icon: "💠" },
  sapphire: { name: "Sapphire", icon: "🔷" },
  emerald:  { name: "Emerald",  icon: "❇️" },
  ruby:     { name: "Ruby",     icon: "♦️" },
  diamond:  { name: "Diamond",  icon: "💎" },

  // Produced by village buildings
  water: { name: "Water", icon: "💧" },

  // Crafted
  twine:       { name: "Twine",       icon: "🧶" },
  flint_axe:     { name: "Flint Axe",     icon: "🪓", tool: true },
  flint_pickaxe: { name: "Flint Pickaxe", icon: "⛏️", tool: true },
  planks:      { name: "Planks",      icon: "🟫" },
  wooden_bowl: { name: "Wooden Bowl", icon: "🥣" },

  // Cooked
  roasted_berries: { name: "Roasted Berries", icon: "🍢" },
  flower_tea:      { name: "Flower Tea",      icon: "🍵" },
  berry_stew:      { name: "Berry Stew",      icon: "🍲" },

  // Furnace (Smithing)
  charcoal:     { name: "Charcoal",     icon: "⚫" },
  stone_bricks: { name: "Stone Bricks", icon: "🧱" },
  bronze_bar:    { name: "Bronze Bar",    icon: "🥉" },
  iron_bar:      { name: "Iron Bar",      icon: "🔩" },
  steel_bar:     { name: "Steel Bar",     icon: "⚙️" },
  silver_bar:    { name: "Silver Bar",    icon: "🥈" },
  mithril_bar:   { name: "Mithril Bar",   icon: "🧊" },
  gold_bar:      { name: "Gold Bar",      icon: "🥇" },
  adamant_bar:   { name: "Adamant Bar",   icon: "🟩" },
  starsteel_bar: { name: "Starsteel Bar", icon: "⭐" },
};

export function getItem(id) {
  return ITEMS[id];
}
