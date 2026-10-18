// Trees the player can chop in Lumberjack.
// level: Lumberjack level needed. tool: item you must own. xp: XP per chop.
// seconds: time per chop. item: what each chop gives.

export const TREES = [
  { id: "tree", name: "Tree", icon: "🌳", level: 1, tool: "stone_axe", xp: 10, seconds: 3, item: "logs" },
];

export function getTree(id) {
  return TREES.find((tree) => tree.id === id);
}
