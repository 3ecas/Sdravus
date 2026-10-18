// Maps each page id to the function that draws its content.
// A view function gets (container, page, route) and may return a cleanup function,
// which runs when the player leaves the page.
// Pages without an entry show the placeholder.

import { renderPlaceholder } from "./placeholder.js";
import { renderLumberjack } from "./lumberjack.js";
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
  lumberjack: renderLumberjack,
};

export function getPageView(id) {
  return VIEWS[id] || renderPlaceholder;
}
