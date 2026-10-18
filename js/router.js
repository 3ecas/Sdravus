// The URL hash (#fishing) holds the current page, so refresh keeps your place.

export function currentRoute() {
  return location.hash.slice(1);
}

export function onRouteChange(callback) {
  window.addEventListener("hashchange", () => callback(currentRoute()));
}
