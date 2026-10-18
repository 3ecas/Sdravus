// The URL hash holds where you are, so refresh and the browser's back/forward arrows work.
//   #crafting                       -> page "crafting"
//   #crafting/workbench             -> page "crafting", tab "workbench"
//   #crafting/workbench?from=village -> same, arrived from the Village (shows "← Village")

export function currentRoute() {
  return parseRoute(location.hash.slice(1));
}

export function parseRoute(hash) {
  const [path, query = ""] = hash.split("?");
  const [page = "", tab = null] = path.split("/");
  const from = new URLSearchParams(query).get("from");
  return { page, tab, from };
}

// Build a link like "#crafting/workbench?from=village".
export function routeHref(page, tab = null, from = null) {
  return `#${page}${tab ? `/${tab}` : ""}${from ? `?from=${from}` : ""}`;
}

export function onRouteChange(callback) {
  window.addEventListener("hashchange", () => callback(currentRoute()));
}
