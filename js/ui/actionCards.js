// Shared behaviour for clickable action cards (trees, areas, recipes).
// Any element with data-action="<action id>" gets:
//   - the "active" class while its action runs
//   - its .action-progress-fill bar filled smoothly
//   - a floating "+1 🪵" for each item gained when a cycle finishes

import { getItem } from "../data/items.js";
import { activeActionId, actionProgress, onActionComplete } from "../game/actions.js";

export function bindActionCards(container) {
  const cards = [...container.querySelectorAll("[data-action]")];

  let frame;
  function animate() {
    const activeId = activeActionId();
    cards.forEach((card) => {
      const active = card.dataset.action === activeId;
      card.classList.toggle("active", active);
      const fill = card.querySelector(".action-progress-fill");
      if (fill) fill.style.width = `${active ? actionProgress() * 100 : 0}%`;
    });
    frame = requestAnimationFrame(animate);
  }

  const stopListening = onActionComplete((actionId, gains) => {
    const card = cards.find((c) => c.dataset.action === actionId);
    if (!card) return;
    gains.forEach(({ item, amount }, i) => showPop(card, `+${amount} ${getItem(item).icon}`, i));
  });

  animate();

  // Call when leaving the page.
  return () => {
    cancelAnimationFrame(frame);
    stopListening();
  };
}

function showPop(card, text, index) {
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = text;
  pop.style.animationDelay = `${index * 0.15}s`;
  card.appendChild(pop);
  pop.addEventListener("animationend", () => pop.remove());
}
