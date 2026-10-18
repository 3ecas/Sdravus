// "have / need" ingredient list used on recipe and station cards, e.g. "🪵 4/6",
// shown in red when you don't have enough.

import { getItem } from "../data/items.js";
import { itemCount } from "../game/state.js";
import { iconHtml } from "./format.js";

export function costHtml(list) {
  return `
    <span class="recipe-inputs">
      ${list.map(({ item, amount }, index) => `
        <span class="recipe-input" data-input="${index}" title="${getItem(item).name}">
          ${iconHtml(getItem(item))} <span class="have">0</span>/${amount}
        </span>
      `).join("")}
    </span>
  `;
}

// Refresh the "have" numbers inside a card built with costHtml.
export function updateCost(card, list) {
  card.querySelectorAll("[data-input]").forEach((el) => {
    const { item, amount } = list[el.dataset.input];
    const have = itemCount(item);
    el.querySelector(".have").textContent = have;
    el.classList.toggle("short", have < amount);
  });
}
