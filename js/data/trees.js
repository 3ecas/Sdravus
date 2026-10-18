// Trees the player can chop in Lumberjack.
// level: Lumberjack level needed. toolType / toolTier: needs an axe of at least this tier
// on the Tool Belt (better axes also give more logs per chop). xp: XP per chop.
// image: optional 16x16 pixel-art PNG in assets/icons (replaces the emoji icon).
// seconds: time per chop (5s for all gathering). item: what each chop gives. tint: optional icon tint (see components.css).

export const TREES = [
  { id: "tree", name: "Tree", icon: "🌳", image: "assets/icons/Tree.svg", level: 1,  toolType: "axe", toolTier: 1, xp: 1, seconds: 5, item: "logs" },
  { id: "oak",  name: "Oak",  icon: "🌳", tint: "oak", level: 15, toolType: "axe", toolTier: 2, xp: 3, seconds: 5, item: "oak_logs" },
];

