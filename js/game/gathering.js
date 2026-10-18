// Gathering: click a node to get its items instantly.
//   - Foraging areas (Plains): one random find from `finds` per click.
//   - Trees (Lumberjack) and rocks (Mining): the node's item, as many as your best tool's
//     yield (Flint 1, Bronze 2...), plus a chance at the place's rare finds.
// Trees and rocks need a tool of at least their tier on the Tool Belt.

import { addItem, notify } from "./state.js";
import { hasToolTier, bestTool } from "./toolBelt.js";

export function hasToolFor(node) {
  return !node.toolType || hasToolTier(node.toolType, node.toolTier);
}

// Items per click with your best tool (1 if the node needs no tool).
export function gatherYield(node) {
  if (!node.toolType) return 1;
  return bestTool(node.toolType)?.tool.yield || 1;
}

// One click on a node. rare: the place's [{ item, chance }]. Returns what was gained.
export function gather(node, rare = []) {
  if (!hasToolFor(node)) return [];

  const gains = node.finds
    ? [{ item: rollFind(node.finds), amount: 1 }]
    : [{ item: node.item, amount: gatherYield(node) }];
  rare.forEach(({ item, chance }) => {
    if (Math.random() < chance) gains.push({ item, amount: 1 });
  });

  gains.forEach(({ item, amount }) => addItem(item, amount));
  notify();
  return gains;
}

// Picks one item, where a higher weight is more likely.
function rollFind(finds) {
  const total = finds.reduce((sum, find) => sum + find.weight, 0);
  let roll = Math.random() * total;
  for (const find of finds) {
    roll -= find.weight;
    if (roll < 0) return find.item;
  }
  return finds[finds.length - 1].item;
}
