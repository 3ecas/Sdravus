# Sdravus

Idle RPG village builder / crafting browser game. Plain static site, no build step. Deployed to GitHub Pages from `main`.

## Git
- Always commit and push directly to the `main` branch. Do not use feature branches or open pull requests unless asked.

## Code organization
This will grow into a big game, so keep things separated and `index.html` clean.

- `index.html` — page shell only: links to CSS files and the `js/main.js` module. No inline scripts or styles.
- `assets/` — images, icons, favicon.
- `css/` — one file per area: `base.css` (tokens, reset), `layout.css` (app shell, mobile), `sidebar.css`, `view.css`, `activity-bar.css`, `components.css` (shared bits: `.panel`, `.panel-row`, `.item-count`), `actions.css` (skill action cards), `areas.css` (Foraging area cards), `stash.css`, `gear.css`, `context-menu.css`. Add a new file per new area and link it in `index.html`.
- `js/` — ES modules (`import`/`export`), no globals.
  - `main.js` — entry point, wires everything together.
  - `config.js` — game-wide settings (`MAX_LEVEL` is 100, `BACKPACK_SLOTS`, `TOOL_BELT_SLOTS`).
  - `router.js` — URL hash routing: `#page/tab?from=page` (e.g. `#crafting/workbench?from=village`). Views get the route; `from` shows a "← back" link.
  - `data/` — static game data: `pages.js` (menu), `items.js`, `areas.js` (Foraging areas), `trees.js` (Lumberjack), `rocks.js` (Mining), `recipes.js` (each has a `skill`, a `station` or null = by hand, and a `level` in that skill), `stations.js` (Village stations), `buildings.js` (Village buildings that produce resources), `gear.js` (equipment slots).
  - `game/` — game rules, no DOM: `state.js` (player XP/items + `onChange`/`notify`), `xp.js` (level curve), `actions.js` (the one repeating idle action), `save.js` (localStorage save/load; bump `SAVE_VERSION` if the save format changes; when renaming a skill or item id, add it to `RENAMED_SKILLS` / `RENAMED_ITEMS` so saves carry over), `toolBelt.js` (equip/unequip tools; skills check the belt for tools), `village.js` (building stations and buildings; `state.built`), `production.js` (buildings deliver resources on their own timer, alongside the current action), `discovery.js` (recipes/stations appear once you've had one of their materials; "new" tracking for badges and menu dots), `foraging.js` (areas with random finds), `gathering.js` (node skills: Lumberjack trees, Mining rocks; tools on the belt), and `crafting.js` for every recipe skill (Crafting, Cooking, Smithing: XP goes to `recipe.skill`). Action `onComplete` returns gains like `[{ item, amount }]`. `itemActions.js` lists right-click actions per item (add item-specific ones to `ITEM_ACTIONS`).
  - `ui/` — shared UI pieces: `sidebar.js`, `view.js` (listen to `onChange`), `actionCards.js` (progress bar + "+1" pops for any `[data-action]` card), `format.js`, `costList.js` ("have/need" ingredient lists), `contextMenu.js` (the game's right-click menu), `activityBar.js` (slim top bar showing the running action while you're on another page; actions pass `info` to `startAction`), `browserDefaults.js` (no browser right-click menu, dragging or text selection; the game will have its own right-click menus).
  - `views/` — one file per page's content (`recipePage.js` is shared by Crafting, Cooking and Smithing; `nodePage.js` by Lumberjack and Mining); register it in `views/index.js`. A view may return a cleanup function (stop listeners/animations) that runs when leaving the page. Pages without one show `placeholder.js`.

## Cache busting
The CSS and `js/main.js` links in `index.html` end in `?v=N`. Bump N (all of them together) in every commit that changes CSS or JS, so browsers fetch the new files instead of cached ones.

## Running locally
ES modules don't load from `file://`. Serve the folder: `python3 -m http.server` then open http://localhost:8000.

## Game design notes
- **Discovery:** recipes and stations are hidden until the player has had any of their materials (`state.seen`). No long lists of locked things.
- **Stations vs buildings:** stations (Workbench, Campfire, Furnace) are built once in the Village and unlock a group of recipes. Buildings (Well, later Cow Pen) produce resources over time on their own.
- **Stations belong to skills:** each station has a `skill`; its recipes show as a tab on that skill's page (Crafting: [By hand] [Workbench]; later Cooking: [Campfire], Smithing: [Furnace] [Anvil]). One tab at a time, never one giant page. Clicking a built station in the Village opens its tab.
- **Gates:** each recipe has one station (or none) plus one skill level. Stations unlock new *kinds* of things; levels unlock better tiers within them.

## Scope
Only add what is asked for. Suggest extras instead of adding them.
