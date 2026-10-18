// Floating "+2 🪵" over a card: after a click, or when a building or villagers deliver.

import { getItem } from "../data/items.js";

// gains: [{ item, amount }]. fromWorker: a quieter pop, for what villagers gathered.
export function showGains(card, gains, { fromWorker = false } = {}) {
  gains.forEach(({ item, amount }, i) => showPop(card, `+${amount} ${getItem(item).icon}`, i, fromWorker));
}

export function showPop(card, text, index = 0, fromWorker = false) {
  const pop = document.createElement("span");
  pop.className = fromWorker ? "pop from-worker" : "pop";
  pop.textContent = text;
  pop.style.animationDelay = `${index * 0.12}s`;
  card.appendChild(pop);
  pop.addEventListener("animationend", () => pop.remove());
}
