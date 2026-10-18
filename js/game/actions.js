// The one thing the player is doing right now (chopping, mining, ...).
// Like other idle games, only one action runs at a time and it repeats until stopped.

import { notify } from "./state.js";

const TICK_MS = 100;

let active = null; // { id, duration, startedAt, onComplete }
let timer = null;

export function startAction(id, durationMs, onComplete) {
  clearInterval(timer);
  active = { id, duration: durationMs, startedAt: performance.now(), onComplete };
  timer = setInterval(tick, TICK_MS);
  notify();
}

export function stopAction() {
  clearInterval(timer);
  timer = null;
  active = null;
  notify();
}

export function activeActionId() {
  return active ? active.id : null;
}

// 0 to 1: how far the current action is through its cycle.
export function actionProgress() {
  if (!active) return 0;
  return Math.min((performance.now() - active.startedAt) / active.duration, 1);
}

function tick() {
  const now = performance.now();
  let completed = false;

  // A loop, so cycles missed while the tab was in the background still count.
  while (active && now - active.startedAt >= active.duration) {
    active.startedAt += active.duration;
    active.onComplete();
    completed = true;
  }

  if (completed) notify();
}
