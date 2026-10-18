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
  - `config.js` — game-wide settings (`MAX_LEVEL` is 100, `XP_CURVE`, `BACKPACK_SLOTS`, `TOOL_BELT_SLOTS`).
  - `router.js` — URL hash routing: `#page/tab?from=page` (e.g. `#crafting/workbench?from=village`). Views get the route; `from` shows a "← back" link.
  - `data/` — static game data: `pages.js` (menu), `items.js`, `areas.js` (Foraging areas), `trees.js` (Lumberjack), `miningSites.js` (Mining sites, each with its rocks and rare finds), `recipes.js` (each has a `skill`, a `station` or null = by hand, and a `level` in that skill), `stations.js` (Village stations), `buildings.js` (Village buildings that produce resources), `gear.js` (equipment slots).
  - `game/` — game rules, no DOM: `state.js` (player XP/items + `onChange`/`notify`), `xp.js` (level curve), `actions.js` (the one repeating idle action), `save.js` (localStorage save/load; bump `SAVE_VERSION` if the save format changes; when renaming a skill or item id, add it to `RENAMED_SKILLS` / `RENAMED_ITEMS` so saves carry over), `toolBelt.js` (equip/unequip tools; skills check the belt for tools), `village.js` (building stations and buildings; `state.built`), `production.js` (buildings deliver resources on their own timer, alongside the current action), `discovery.js` (recipes/stations appear once you've had one of their materials; "new" tracking for badges and menu dots), `foraging.js` (areas with random finds), `gathering.js` (node skills: Lumberjack trees, Mining rocks; tools on the belt; rare finds per place), and `crafting.js` for every recipe skill (Crafting, Cooking, Smithing: XP goes to `recipe.skill`). Action `onComplete` returns gains like `[{ item, amount }]`. `itemActions.js` lists right-click actions per item (add item-specific ones to `ITEM_ACTIONS`).
  - `ui/` — shared UI pieces: `sidebar.js`, `view.js` (listen to `onChange`), `actionCards.js` (progress bar + "+1" pops for any `[data-action]` card), `format.js` (numbers, `iconHtml` with tier tints, seconds), `costList.js` ("have/need" ingredient lists), `contextMenu.js` (the game's right-click menu), `activityBar.js` (slim top bar showing the running action while you're on another page; actions pass `info` to `startAction`), `browserDefaults.js` (no browser right-click menu, dragging or text selection; the game will have its own right-click menus).
  - `views/` — one file per page's content (`recipePage.js` is shared by Crafting, Cooking and Smithing; `nodePage.js` by Lumberjack and Mining); register it in `views/index.js`. A view may return a cleanup function (stop listeners/animations) that runs when leaving the page. Pages without one show `placeholder.js`.

## Cache busting
The CSS and `js/main.js` links in `index.html` end in `?v=N`. Bump N (all of them together) in every commit that changes CSS or JS, so browsers fetch the new files instead of cached ones.

## Running locally
ES modules don't load from `file://`. Serve the folder: `python3 -m http.server` then open http://localhost:8000.

## Game design notes
- **Discovery:** stations and buildings appear once the player has had any of their materials; recipes appear once the player has had their main ingredient (first input) (`state.seen`). No long lists of locked things.
- **Stations vs buildings:** stations (Workbench, Campfire, Furnace) are built once in the Village and unlock a group of recipes. Buildings (Well, Chicken Coop, Cow Pen) produce resources over time on their own; the animal buildings need Oak Planks.
- **Stations belong to skills:** each station has a `skill`; its recipes show as a tab on that skill's page (Crafting: [By hand] [Workbench]; later Cooking: [Campfire], Smithing: [Furnace] [Anvil]). One tab at a time, never one giant page. Clicking a built station in the Village opens its tab.
- **Mining:** 5 sites unlock with Mining level: Quarry 1 (stone, copper, tin, clay; quartz), Hillside 15 (iron, coal; sapphire), Old Mine 40 (silver, mithril; emerald), Deep Cave 55 (gold, adamant; ruby), Starfall Crater 80 (star ore; diamond). Metal tiers: Bronze, Iron, Steel (iron + coal), Mithril, Adamant, Starsteel; Silver and Gold for jewelry; inside a site you pick the rock and always get its ore, plus small rare-find chances. Foraging stays the random one.
- **Tools:** items with `tool: { type, tier, speed }`. Trees/rocks need `toolType` of at least `toolTier` on the Tool Belt; the best equipped tool is used and its `speed` shortens each cycle (Flint 0, Bronze 20%, then Iron 35%, Steel 45%, Mithril 55%, Adamant 62%, Starsteel 70% faster). Gathering base times are 5–8s so tool upgrades are clearly felt. Metal tools are made at the Anvil from bars + a Wooden Handle. Tiers tell apart by `tint` on the icon (`iconHtml` in ui/format.js).
- **Build costs:** stations and buildings are long-term investments: early stations ~5–10 min of gathering, animal buildings 15–30 min (Twine is the slow part: 3 fiber each).
- **Gates:** each recipe has one station (or none) plus one skill level. Stations unlock new *kinds* of things; levels unlock better tiers within them.

## XP and levels
- Level curve (`XP_CURVE` in config.js), same for all skills: Level 2 = 28 XP, each next level needs ×1.15. Lv 3 = 60, Lv 10 = 470, Lv 50 ≈ 176K, Lv 90 ≈ 47M, Lv 100 ≈ 191M total XP. Pace target: a few minutes per early level, ~20 min to Lv 10, ~14 h to Lv 50, ~600+ hours to Lv 100.
- Action XP guide: about `1.066^(level - 1)` for a node/recipe that needs that level, so each level still takes a bit longer than the last: Lv 1 = 1, Lv 10 ≈ 2, Lv 20 ≈ 3, Lv 30 ≈ 6, Lv 50 ≈ 23, Lv 75 ≈ 110, Lv 90 ≈ 300. Small integers early (+1 per new tier). Recipes with more ingredients give a bit more.
- When the XP scale changes, bump `SAVE_VERSION` and convert old XP in `save.js`.

## Scope
Only add what is asked for. Suggest extras instead of adding them.
