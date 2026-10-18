// Maps each page id to the function that draws its content.
// When a page gets real content, create js/views/<page>.js and register it here, e.g.
//   import { renderLumberjack } from "./lumberjack.js";
//   const VIEWS = { lumberjack: renderLumberjack };
// Pages without an entry show the placeholder.

import { renderPlaceholder } from "./placeholder.js";

const VIEWS = {};

export function getPageView(id) {
  return VIEWS[id] || renderPlaceholder;
}
