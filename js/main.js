// Entry point: loads the save, builds the menu and shows the page from the URL.

import { DEFAULT_PAGE } from "./config.js";
import { getPage } from "./data/pages.js";
import { loadGame, startAutoSave } from "./game/save.js";
import { disableBrowserDefaults } from "./ui/browserDefaults.js";
import { currentRoute, onRouteChange } from "./router.js";
import { renderSidebar, setActivePage, closeSidebar } from "./ui/sidebar.js";
import { renderPage } from "./ui/view.js";

function showPage(id) {
  const page = getPage(id) || getPage(DEFAULT_PAGE);
  setActivePage(page.id);
  renderPage(page);
  closeSidebar();
}

disableBrowserDefaults();
loadGame();
startAutoSave();

renderSidebar();
onRouteChange(showPage);
showPage(currentRoute());
