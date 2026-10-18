// The "− 👤 2 +" control on Plains, tree and rock cards: send idle villagers to work there or
// call them back. A thin bar under it fills toward their next gather. Hidden until you have
// villagers (build a Hut).
//
// A card that has this control carries data-spot="lumberjack:tree" (see spotKey in villagers.js).

import { villagerCount, workersAt, canSendWorker, isWorking, moveWorker, workProgress, onWorked } from "../game/villagers.js";
import { showGains } from "./pop.js";

export function workersHtml() {
  return `
    <span class="workers" hidden>
      <button class="worker-btn" data-worker="-1" title="Call a villager back">−</button>
      <span class="worker-count" title="Villagers working here">👤 <span class="worker-n">0</span></span>
      <button class="worker-btn" data-worker="1" title="Send an idle villager here">+</button>
    </span>
    <span class="action-progress work-bar" hidden><span class="action-progress-fill"></span></span>
  `;
}

// Refresh the counts and buttons on every card inside container.
export function updateWorkers(container) {
  const hasVillagers = villagerCount() > 0;
  container.querySelectorAll("[data-spot]").forEach((card) => {
    const key = card.dataset.spot;
    card.querySelector(".workers").hidden = !hasVillagers;
    card.querySelector(".worker-n").textContent = workersAt(key);
    card.querySelector('[data-worker="-1"]').classList.toggle("disabled", !workersAt(key));
    card.querySelector('[data-worker="1"]').classList.toggle("disabled", !canSendWorker(key));
    card.querySelector(".work-bar").hidden = !isWorking(key);
  });
}

// For a card's click handler: true if the click was on the control (so the card doesn't gather).
export function handleWorkerClick(event) {
  const control = event.target.closest(".workers");
  if (!control) return false;
  const button = event.target.closest("[data-worker]");
  if (button) moveWorker(control.closest("[data-spot]").dataset.spot, Number(button.dataset.worker));
  return true;
}

// Fill the bars and show "+2 🪵" pops when villagers gather. Returns a cleanup function.
export function startWorkerVisuals(container) {
  let frame;
  function animate() {
    container.querySelectorAll("[data-spot]").forEach((card) => {
      card.querySelector(".work-bar .action-progress-fill").style.width = `${workProgress(card.dataset.spot) * 100}%`;
    });
    frame = requestAnimationFrame(animate);
  }
  animate();

  const stopWorked = onWorked((key, gains) => {
    const card = container.querySelector(`[data-spot="${key}"]`);
    if (card) showGains(card, gains, { fromWorker: true });
  });

  return () => {
    cancelAnimationFrame(frame);
    stopWorked();
  };
}
