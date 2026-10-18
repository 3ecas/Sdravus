// Every item the player can own.
// tool: { type, tier, yield } means it goes on the Tool Belt. type: "axe" / "pickaxe";
//   tier: which trees/rocks it can work (a node needs a tool of at least its toolTier);
//   yield: items per gathering cycle.
// bucket: { capacity, fills } is an empty bucket: the Well fills it with `capacity` water and it
//   becomes the `fills` item. emptiesTo: a full bucket gives back its empty bucket when a recipe uses it.
//   Axes/pickaxes: Flint 1, Bronze 2, Iron 3, Steel 4 (planned: Mithril 5, Adamant 6, Starsteel 8).
// tint: optional colour tint for the icon, to tell tiers apart (see .tint-* in components.css).

export const ITEMS = {
  // Found while foraging
  branch:  { name: "Branch",      icon: "🥢" },
  flint:   { name: "Flint",       icon: "🔺" },
  fiber:   { name: "Plant Fiber", icon: "🌿" },
  berries: { name: "Berries",     icon: "🫐" },
  flower:  { name: "Flower",      icon: "🌼" },

  // Gathered with tools
  logs:     { name: "Logs",     icon: "🪵" },
  oak_logs: { name: "Oak Logs", icon: "🪵", tint: "oak" },

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
  water: { name: "Water", icon: "💧" }, // only shown as the water poured at the Well; kept in buckets
  egg:   { name: "Egg",   icon: "🥚" },
  milk:  { name: "Milk",  icon: "🥛" },

  // Crafted
  twine:       { name: "Twine",       icon: "🧶" },
  flint_axe:     { name: "Flint Axe",     icon: "🪓", tool: { type: "axe",     tier: 1, yield: 1 } },
  flint_pickaxe: { name: "Flint Pickaxe", icon: "⛏️", tool: { type: "pickaxe", tier: 1, yield: 1 } },
  planks:      { name: "Planks",      icon: "🟫" },
  oak_planks:  { name: "Oak Planks",  icon: "🟫", tint: "oak" },
  wooden_bowl: { name: "Wooden Bowl", icon: "🥣" },
  wooden_handle: { name: "Wooden Handle", icon: "🦯" },

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

  // Anvil (Smithing): metal tools
  nails:          { name: "Nails",          icon: "📌" },
  bronze_axe:     { name: "Bronze Axe",     icon: "🪓", tint: "bronze", tool: { type: "axe",     tier: 2, yield: 2 } },
  bronze_pickaxe: { name: "Bronze Pickaxe", icon: "⛏️", tint: "bronze", tool: { type: "pickaxe", tier: 2, yield: 2 } },
  iron_axe:       { name: "Iron Axe",       icon: "🪓", tint: "iron",   tool: { type: "axe",     tier: 3, yield: 3 } },
  iron_pickaxe:   { name: "Iron Pickaxe",   icon: "⛏️", tint: "iron",   tool: { type: "pickaxe", tier: 3, yield: 3 } },
  steel_axe:      { name: "Steel Axe",      icon: "🪓", tint: "steel",  tool: { type: "axe",     tier: 4, yield: 4 } },
  steel_pickaxe:  { name: "Steel Pickaxe",  icon: "⛏️", tint: "steel",  tool: { type: "pickaxe", tier: 4, yield: 4 } },

  // Buckets: filled at the Well. Planned tiers hold more.
  wooden_bucket:   { name: "Wooden Bucket",   icon: "🪣", tint: "oak", bucket: { capacity: 5, fills: "bucket_of_water" } },
  bucket_of_water: { name: "Bucket of Water", icon: "🪣", emptiesTo: "wooden_bucket" },
};

export function getItem(id) {
  return ITEMS[id];
}

// The weakest tool of a type that's at least this tier (for "you need this" badges).
export function toolForTier(type, tier) {
  return Object.values(ITEMS)
    .filter((item) => item.tool?.type === type && item.tool.tier >= tier)
    .sort((a, b) => a.tool.tier - b.tool.tier)[0];
}
