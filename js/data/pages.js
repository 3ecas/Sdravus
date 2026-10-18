// Every page in the game and how the sidebar groups them.
// To add a page: add an entry to a group below.
// `skill: true` gives the page a level and XP bar.

export const MENU_GROUPS = [
  {
    title: null,
    pages: [
      { id: "village", name: "Village", icon: "🏡", color: "#e8b04a", blurb: "Build and grow your village." },
      { id: "stash",   name: "Stash",   icon: "🎒", color: "#c98b5a", blurb: "Everything you have gathered and crafted." },
      { id: "gear",    name: "Gear",    icon: "🪖", color: "#8fa3b8", blurb: "Equip weapons, armour and tools." },
    ],
  },
  // Ordered the way a new player progresses: gather -> make things -> fight.
  {
    title: "Gathering",
    pages: [
      { id: "lumberjack", name: "Lumberjack", icon: "🪓", color: "#b98a52", blurb: "Chop trees for logs.", skill: true },
      { id: "fishing",    name: "Fishing",    icon: "🎣", color: "#4fb3c9", blurb: "Catch fish from rivers and seas.", skill: true },
      { id: "mining",     name: "Mining",     icon: "⛏️", color: "#9aa0a8", blurb: "Mine ores and gems.", skill: true },
      { id: "farming",    name: "Farming",    icon: "🌾", color: "#9cc35a", blurb: "Plant seeds and harvest crops.", skill: true },
    ],
  },
  {
    title: "Workshop",
    pages: [
      { id: "cooking",  name: "Cooking",  icon: "🍲", color: "#e5894a", blurb: "Turn raw food into meals.", skill: true },
      { id: "smithing", name: "Smithing", icon: "🔨", color: "#d0a24e", blurb: "Smelt bars and forge gear.", skill: true },
      { id: "crafting", name: "Crafting", icon: "🧵", color: "#d77fb0", blurb: "Make leather goods, jewellery and tools.", skill: true },
    ],
  },
  {
    title: "Combat",
    pages: [
      { id: "attack",     name: "Attack",     icon: "⚔️", color: "#e0675a", blurb: "Hit harder and more often in combat.", skill: true },
      { id: "defense",    name: "Defense",    icon: "🛡️", color: "#5f9bd6", blurb: "Take less damage from enemies.", skill: true },
      { id: "vitality",   name: "Vitality",   icon: "❤️", color: "#e45f7d", blurb: "Grow tougher to survive longer fights.", skill: true },
      { id: "archery",    name: "Archery",    icon: "🏹", color: "#7cb86a", blurb: "Strike from a distance with bows.", skill: true },
      { id: "witchcraft", name: "Witchcraft", icon: "🔮", color: "#a97ad8", blurb: "Cast spells and brew curses.", skill: true },
    ],
  },
];

export const PAGES = MENU_GROUPS.flatMap((group) => group.pages);

export function getPage(id) {
  return PAGES.find((page) => page.id === id);
}
