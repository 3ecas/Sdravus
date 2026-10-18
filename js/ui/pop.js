// Floating "+2 🪵" over a card: after a click, or when a building delivers.

import { getItem } from "../data/items.js";

// gains: [{ item, amount }]
export function showGains(card, gains) {
  gains.forEach(({ item, amount }, i) => showPop(card, `+${amount} ${getItem(item).icon}`, i));
}

export function showPop(card, text, index = 0) {
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = text;
  pop.style.animationDelay = `${index * 0.12}s`;
  card.appendChild(pop);
  pop.addEventListener("animationend", () => pop.remove());
}
