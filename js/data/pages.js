// Every page in the game and how the sidebar groups them.
// To add a page: add an entry to a group below.
// `skill: true` gives the page a level and XP bar.

export const MENU_GROUPS = [
  {
    title: null,
    pages: [
      { id: "village", name: "Village", icon: "🏡", color: "#e8b04a" },
      { id: "stash",   name: "Stash",   icon: "🎒", color: "#c98b5a" },
    ],
  },
  // Ordered the way a new player progresses: gather -> make things -> fight.
  {
    title: "Gathering",
    pages: [
      { id: "lumberjack", name: "Lumberjack", icon: "🪓", color: "#b98a52", skill: true },
      { id: "fishing",    name: "Fishing",    icon: "🎣", color: "#4fb3c9", skill: true },
      { id: "mining",     name: "Mining",     icon: "⛏️", color: "#9aa0a8", skill: true },
      { id: "farming",    name: "Farming",    icon: "🌾", color: "#9cc35a", skill: true },
    ],
  },
  {
    title: "Workshop",
    pages: [
      { id: "cooking",  name: "Cooking",  icon: "🍲", color: "#e5894a", skill: true },
      { id: "smithing", name: "Smithing", icon: "🔨", color: "#d0a24e", skill: true },
      { id: "crafting", name: "Crafting", icon: "🧵", color: "#d77fb0", skill: true },
    ],
  },
  {
    title: "Combat",
    pages: [
      { id: "attack",     name: "Attack",     icon: "⚔️", color: "#e0675a", skill: true },
      { id: "defense",    name: "Defense",    icon: "🛡️", color: "#5f9bd6", skill: true },
      { id: "vitality",   name: "Vitality",   icon: "❤️", color: "#e45f7d", skill: true },
      { id: "archery",    name: "Archery",    icon: "🏹", color: "#7cb86a", skill: true },
      { id: "witchcraft", name: "Witchcraft", icon: "🔮", color: "#a97ad8", skill: true },
    ],
  },
];

export const PAGES = MENU_GROUPS.flatMap((group) => group.pages);

export function getPage(id) {
  return PAGES.find((page) => page.id === id);
}
