// Every item the player can own.

export const ITEMS = {
  logs: { name: "Logs", icon: "🪵" },
};

export function getItem(id) {
  return ITEMS[id];
}
