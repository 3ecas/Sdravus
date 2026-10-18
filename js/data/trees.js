// Trees you can chop in Lumberjack. Click a tree to chop it instantly.
// toolType / toolTier: needs an axe of at least this tier on the Tool Belt
// (better axes give more logs per click). item: what you get. tint: optional icon tint.

export const TREES = [
  { id: "tree", name: "Tree", icon: "🌳",              toolType: "axe", toolTier: 1, item: "logs" },
  { id: "oak",  name: "Oak",  icon: "🌳", tint: "oak", toolType: "axe", toolTier: 2, item: "oak_logs" },
];
