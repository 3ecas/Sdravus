# Sdravus

Idle RPG village builder / crafting browser game. Plain static site, no build step. Deployed to GitHub Pages from `main`.

## Git
- Always commit and push directly to the `main` branch. Do not use feature branches or open pull requests unless asked.

## Code organization
This will grow into a big game, so keep things separated and `index.html` clean.

- `index.html` — page shell only: links to CSS files and the `js/main.js` module. No inline scripts or styles.
- `assets/` — images, icons, favicon.
- `css/` — one file per area: `base.css` (tokens, reset), `layout.css` (app shell, mobile), `sidebar.css`, `view.css`, `components.css` (shared bits: `.panel`, `.panel-row`, `.item-count`), `actions.css` (skill action cards), `explore.css` (area cards), `stash.css`, `gear.css`, `context-menu.css`. Add a new file per new area and link it in `index.html`.
- `js/` — ES modules (`import`/`export`), no globals.
  - `main.js` — entry point, wires everything together.
  - `config.js` — game-wide settings (`MAX_LEVEL` is 100, `BACKPACK_SLOTS`, `TOOL_BELT_SLOTS`).
  - `router.js` — URL hash routing.
  - `data/` — static game data: `pages.js` (menu), `items.js`, `areas.js` (Exploring), `trees.js`, `recipes.js`, `gear.js` (equipment slots).
  - `game/` — game rules, no DOM: `state.js` (player XP/items + `onChange`/`notify`), `xp.js` (level curve), `actions.js` (the one repeating idle action), `save.js` (localStorage save/load; bump `SAVE_VERSION` if the save format changes), one file per skill (`exploring.js`, `lumberjack.js`, `crafting.js`). Action `onComplete` returns gains like `[{ item, amount }]`. `itemActions.js` lists right-click actions per item (add item-specific ones to `ITEM_ACTIONS`).
  - `ui/` — shared UI pieces: `sidebar.js`, `view.js` (listen to `onChange`), `actionCards.js` (progress bar + "+1" pops for any `[data-action]` card), `format.js`, `contextMenu.js` (the game's right-click menu), `browserDefaults.js` (no browser right-click menu, dragging or text selection; the game will have its own right-click menus).
  - `views/` — one file per page's content; register it in `views/index.js`. A view may return a cleanup function (stop listeners/animations) that runs when leaving the page. Pages without one show `placeholder.js`.

## Cache busting
The CSS and `js/main.js` links in `index.html` end in `?v=N`. Bump N (all of them together) in every commit that changes CSS or JS, so browsers fetch the new files instead of cached ones.

## Running locally
ES modules don't load from `file://`. Serve the folder: `python3 -m http.server` then open http://localhost:8000.

## Scope
Only add what is asked for. Suggest extras instead of adding them.
