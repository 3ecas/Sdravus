// The one thing the player is doing right now (foraging, chopping, crafting, cooking...).
// Like other idle games, only one action runs at a time and it repeats until stopped.
//
// info describes it for the activity bar: { verb, name, icon, page, tab? },
// e.g. { verb: "Chopping", name: "Tree", icon: "🌳", page: "lumberjack" }.
//
// onComplete runs at the end of each cycle and returns what was gained, e.g.
// [{ item: "logs", amount: 1 }], so the screen can show "+1 🪵". It may call
// stopAction() itself (e.g. out of materials).

import { notify } from "./state.js";

const TICK_MS = 100;

let active = null; // { id, duration, startedAt, onComplete, info }
let timer = null;
const completeListeners = new Set();

export function startAction(id, durationMs, onComplete, info = null) {
  clearInterval(timer);
  active = { id, duration: durationMs, startedAt: performance.now(), onComplete, info };
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

// What's running, for the activity bar: { verb, name, icon, page, tab }, or null.
export function activeActionInfo() {
  return active ? active.info : null;
}

// 0 to 1: how far the current action is through its cycle.
export function actionProgress() {
  if (!active) return 0;
  return Math.min((performance.now() - active.startedAt) / active.duration, 1);
}

// Call fn(actionId, gains) after each finished cycle. Returns a function that stops listening.
export function onActionComplete(fn) {
  completeListeners.add(fn);
  return () => completeListeners.delete(fn);
}

function tick() {
  const now = performance.now();
  let completed = false;

  // A loop, so cycles missed while the tab was in the background still count.
  while (active && now - active.startedAt >= active.duration) {
    const { id, onComplete } = active;
    active.startedAt += active.duration;
    const gains = onComplete() || [];
    completeListeners.forEach((fn) => fn(id, gains));
    completed = true;
  }

  if (completed) notify();
}
