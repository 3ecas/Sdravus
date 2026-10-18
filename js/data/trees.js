// Trees the player can chop in Lumberjack.
// level: Lumberjack level needed. xp: XP per chop. seconds: time per chop. item: what each chop gives.

export const TREES = [
  { id: "tree", name: "Tree", icon: "🌳", level: 1, xp: 10, seconds: 3, item: "logs" },
];

export function getTree(id) {
  return TREES.find((tree) => tree.id === id);
}
