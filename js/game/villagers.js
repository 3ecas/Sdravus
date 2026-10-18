// Villagers live in Huts (2 per Hut) and gather on their own at a spot you send them to:
// the Plains, a tree or a rock. Each villager gathers once every VILLAGER_WORK_SECONDS, just
// like one click with your best tool, as long as that tool is on the Tool Belt.
// state.workers holds how many work at each spot, e.g. { "lumberjack:tree": 2 }.

import { VILLAGER_WORK_SECONDS } from "../config.js";
import { AREAS } from "../data/areas.js";
import { TREES } from "../data/trees.js";
import { MINING_SITES } from "../data/miningSites.js";
import { BUILDINGS } from "../data/buildings.js";
import { state, notify } from "./state.js";
import { builtCount } from "./village.js";
import { collect, hasToolFor } from "./gathering.js";

const WORK_MS = VILLAGER_WORK_SECONDS * 1000;
const TICK_MS = 250;
const elapsed = {}; // spot key -> work done toward the next gather (ms; more villagers = faster)
const workedListeners = new Set();
let last = performance.now();

// "lumberjack" + "oak" -> "lumberjack:oak"
export function spotKey(page, nodeId) {
  return `${page}:${nodeId}`;
}

// Every spot a villager can work at: key -> { node, rare, page, tab }.
export const WORK_SPOTS = {};
AREAS.forEach((area) => (WORK_SPOTS[spotKey("foraging", area.id)] = { node: area, rare: [], page: "foraging" }));
TREES.forEach((tree) => (WORK_SPOTS[spotKey("lumberjack", tree.id)] = { node: tree, rare: [], page: "lumberjack" }));
MINING_SITES.forEach((site) => site.rocks.forEach((rock) => {
  WORK_SPOTS[spotKey("mining", rock.id)] = { node: rock, rare: site.rare || [], page: "mining", tab: site.id };
}));

export function villagerCount() {
  return BUILDINGS.reduce((sum, building) => sum + (building.houses || 0) * builtCount(building.id), 0);
}

export function workersAt(key) {
  return state.workers[key] || 0;
}

export function idleCount() {
  const busy = Object.values(state.workers).reduce((sum, count) => sum + count, 0);
  return Math.max(villagerCount() - busy, 0);
}

// Is the spot being worked right now? (Villagers wait if its tool isn't on the Tool Belt.)
export function isWorking(key) {
  return workersAt(key) > 0 && hasToolFor(WORK_SPOTS[key].node);
}

export function canSendWorker(key) {
  return idleCount() > 0 && hasToolFor(WORK_SPOTS[key].node);
}

// Send an idle villager to a spot (change 1) or call one back (change -1).
export function moveWorker(key, change) {
  if (!WORK_SPOTS[key]) return;
  if (change > 0 && !canSendWorker(key)) return;
  if (change < 0 && !workersAt(key)) return;
  state.workers[key] = workersAt(key) + change;
  if (!state.workers[key]) delete state.workers[key];
  notify();
}

// 0 to 1: how close a spot's villagers are to their next gather.
export function workProgress(key) {
  return Math.min((elapsed[key] || 0) / WORK_MS, 1);
}

// Call fn(spotKey, gains) whenever villagers gather. Returns a function that stops listening.
export function onWorked(fn) {
  workedListeners.add(fn);
  return () => workedListeners.delete(fn);
}

export function startVillagers() {
  setInterval(tick, TICK_MS);
}

function tick() {
  const now = performance.now();
  const dt = now - last;
  last = now;
  let changed = false;

  for (const [key, count] of Object.entries(state.workers)) {
    if (!isWorking(key)) continue;
    const { node, rare } = WORK_SPOTS[key];
    elapsed[key] = (elapsed[key] || 0) + dt * count;

    // A loop, so gathers missed while the tab was in the background still count.
    const gains = [];
    while (elapsed[key] >= WORK_MS) {
      elapsed[key] -= WORK_MS;
      gains.push(...collect(node, rare));
    }
    if (gains.length) {
      workedListeners.forEach((fn) => fn(key, mergeGains(gains)));
      changed = true;
    }
  }

  if (changed) notify();
}

// [{ logs 2 }, { logs 2 }] -> [{ logs 4 }]
function mergeGains(gains) {
  const totals = new Map();
  gains.forEach(({ item, amount }) => totals.set(item, (totals.get(item) || 0) + amount));
  return [...totals].map(([item, amount]) => ({ item, amount }));
}
