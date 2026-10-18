// Every page in the game and how the sidebar groups them.
// To add a page: add an entry to a group below.

export const MENU_GROUPS = [
  {
    title: null,
    pages: [
      { id: "village", name: "Village", icon: "🏡", color: "#e8b04a" },
      { id: "stash",   name: "Stash",   icon: "🎒", color: "#c98b5a" },
      { id: "gear",    name: "Gear",    icon: "🪖", color: "#8fa3b8" },
    ],
  },
  // Ordered the way a new player progresses: gather -> make things -> fight.
  {
    title: "Gathering",
    pages: [
      { id: "foraging",   name: "Foraging",   icon: "🧺", color: "#5bb5a2" },
      { id: "lumberjack", name: "Lumberjack", icon: "🪓", color: "#b98a52" },
      { id: "fishing",    name: "Fishing",    icon: "🎣", color: "#4fb3c9" },
      { id: "mining",     name: "Mining",     icon: "⛏️", color: "#9aa0a8" },
      { id: "farming",    name: "Farming",    icon: "🌾", color: "#9cc35a" },
    ],
  },
  {
    title: "Workshop",
    pages: [
      { id: "cooking",  name: "Cooking",  icon: "🍲", color: "#e5894a" },
      { id: "smithing", name: "Smithing", icon: "🔨", color: "#d0a24e" },
      { id: "crafting", name: "Crafting", icon: "🧵", color: "#d77fb0" },
    ],
  },
  {
    title: "Combat",
    pages: [
      { id: "attack",     name: "Attack",     icon: "⚔️", color: "#e0675a" },
      { id: "defense",    name: "Defense",    icon: "🛡️", color: "#5f9bd6" },
      { id: "vitality",   name: "Vitality",   icon: "❤️", color: "#e45f7d" },
      { id: "archery",    name: "Archery",    icon: "🏹", color: "#7cb86a" },
      { id: "witchcraft", name: "Witchcraft", icon: "🔮", color: "#a97ad8" },
    ],
  },
];

export const PAGES = MENU_GROUPS.flatMap((group) => group.pages);

export function getPage(id) {
  return PAGES.find((page) => page.id === id);
}
