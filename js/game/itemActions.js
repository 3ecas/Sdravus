// What you can do with an item from its right-click menu.
// Tools get "Equip to Tool Belt". Item-specific actions (e.g. "Add to fireplace" for logs)
// go in ITEM_ACTIONS. Every item also gets the drop actions at the end.

import { getItem } from "../data/items.js";
import { itemCount, removeItem, notify } from "./state.js";
import { equipTool, freeToolSlot, hasToolEquipped } from "./toolBelt.js";

// itemId -> [{ label, run(itemId) }]
const ITEM_ACTIONS = {};

export function getItemActions(itemId) {
  const count = itemCount(itemId);
  const item = getItem(itemId);
  const name = item.name;

  const equip = [];
  if (item.tool && !hasToolEquipped(itemId)) {
    equip.push(
      freeToolSlot() === -1
        ? { label: "Tool Belt is full", disabled: true }
        : { label: "Equip to Tool Belt", onClick: () => equipTool(itemId) }
    );
  }

  const specific = (ITEM_ACTIONS[itemId] || []).map((action) => ({
    label: action.label,
    onClick: () => action.run(itemId),
  }));

  const drop = [{ label: "Drop 1", danger: true, onClick: () => dropItem(itemId, 1) }];
  if (count > 1) {
    drop.push({
      label: "Drop all",
      confirmLabel: `Confirm: drop ${count.toLocaleString()} ${name}`,
      danger: true,
      onClick: () => dropItem(itemId, itemCount(itemId)),
    });
  }

  return [...equip, ...specific, ...drop];
}

function dropItem(itemId, amount) {
  removeItem(itemId, amount);
  notify();
}
