// Maps each page id to the function that draws its content.
// A view function gets (container, page, route) and may return a cleanup function,
// which runs when the player leaves the page.
// Pages without an entry show the placeholder.

import { renderPlaceholder } from "./placeholder.js";
import { nodePage } from "./nodePage.js";
import { TREES } from "../data/trees.js";
import { MINING_SITES } from "../data/miningSites.js";
import { renderStash } from "./stash.js";
import { renderGear } from "./gear.js";
import { renderForaging } from "./foraging.js";
import { recipePage } from "./recipePage.js";
import { renderVillage } from "./village.js";

const VIEWS = {
  village: renderVillage,
  stash: renderStash,
  gear: renderGear,
  foraging: renderForaging,
  crafting: recipePage("crafting", { verb: "craft", empty: "Nothing to craft yet. Go foraging to find materials." }),
  cooking: recipePage("cooking", { verb: "cook", empty: "Nothing to cook yet. Find some food first, like berries while foraging." }),
  smithing: recipePage("smithing", { verb: "smith", empty: "Nothing to smith yet. Get some logs or mine some stone first." }),
  lumberjack: nodePage("lumberjack", [{ id: "trees", level: 1, nodes: TREES }], { verb: "Chopping" }),
  mining: nodePage("mining", MINING_SITES, { verb: "Mining", tabs: true }),
};

export function getPageView(id) {
  return VIEWS[id] || renderPlaceholder;
}
