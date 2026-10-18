# Sdravus

Fast village builder / crafting browser game: no XP, no levels, no timers. Clicking gathers, crafts or builds instantly. Plain static site, no build step. Deployed to GitHub Pages from `main`.

## Git
- Always commit and push directly to the `main` branch. Do not use feature branches or open pull requests unless asked.

## Code organization
This will grow into a big game, so keep things separated and `index.html` clean.

- `index.html` — page shell only: links to CSS files and the `js/main.js` module. No inline scripts or styles.
- `assets/` — images, icons, favicon.
- `css/` — one file per area: `base.css` (tokens, reset), `layout.css` (app shell, mobile), `sidebar.css`, `view.css`, `components.css` (shared bits: `.panel`, `.panel-row`, `.item-count`), `actions.css` (skill action cards), `areas.css` (Foraging area cards), `stash.css`, `gear.css`, `context-menu.css`. Add a new file per new area and link it in `index.html`.
- `js/` — ES modules (`import`/`export`), no globals.
  - `main.js` — entry point, wires everything together.
  - `config.js` — game-wide settings (`BACKPACK_SLOTS`, `TOOL_BELT_SLOTS`).
  - `router.js` — URL hash routing: `#page/tab?from=page` (e.g. `#crafting/workbench?from=village`). Views get the route; `from` shows a "← back" link.
  - `data/` — static game data: `pages.js` (menu), `items.js`, `areas.js` (Foraging areas), `trees.js` (Lumberjack), `miningSites.js` (Mining sites, each with its rocks and rare finds), `recipes.js` (each has a `skill` = the page it shows on, and a `station` or null = by hand), `stations.js` (Village stations), `buildings.js` (Village buildings that produce resources), `gear.js` (equipment slots).
  - `game/` — game rules, no DOM: `state.js` (player items, tool belt, built things, seen/viewed + `onChange`/`notify`), `save.js` (localStorage save/load; bump `SAVE_VERSION` if the save format changes; when renaming an item id, add it to `RENAMED_ITEMS` so saves carry over), `toolBelt.js` (equip/unequip tools; `bestTool`, `hasToolTier`), `village.js` (instant building of stations and buildings; `state.built` holds a count per id), `production.js` (buildings deliver resources on their own timer), `discovery.js` (recipes/stations appear once you've had one of their materials; "new" tracking for badges and menu dots), `gathering.js` (one click = one gather: Foraging areas roll a random find, trees/rocks give their item × the best tool's `yield`; rare finds per place), and `crafting.js` for every recipe page (Crafting, Cooking, Smithing; instant). Gather/craft return gains like `[{ item, amount }]`. `itemActions.js` lists right-click actions per item (add item-specific ones to `ITEM_ACTIONS`).
  - `ui/` — shared UI pieces: `sidebar.js`, `view.js` (page header + body), `pop.js` (floating "+2 🪵" text on a card after a click), `format.js` (numbers, `iconHtml` with tier tints), `costList.js` ("have/need" ingredient lists), `contextMenu.js` (the game's right-click menu), `browserDefaults.js` (no browser right-click menu, dragging or text selection; the game has its own right-click menus).
  - `views/` — one file per page's content (`recipePage.js` is shared by Crafting, Cooking and Smithing; `nodePage.js` by Lumberjack and Mining); register it in `views/index.js`. A view may return a cleanup function (stop listeners/animations) that runs when leaving the page. Pages without one show `placeholder.js`.

## Cache busting
The CSS and `js/main.js` links in `index.html` end in `?v=N`. Bump N (all of them together) in every commit that changes CSS or JS, so browsers fetch the new files instead of cached ones.

## Running locally
ES modules don't load from `file://`. Serve the folder: `python3 -m http.server` then open http://localhost:8000.

## Game design notes
- **Discovery:** stations and buildings appear once the player has had any of their materials; recipes appear once the player has had their main ingredient (first input) (`state.seen`). No long lists of locked things.
- **Stations vs buildings:** stations (Workbench, Campfire, Furnace) are built once in the Village and unlock a group of recipes. Buildings (Well, Chicken Coop, Cow Pen) produce resources over time on their own; the animal buildings need Oak Planks.
- **Stations belong to pages:** each station has a `skill` (the page id); its recipes show as a tab on that page (Crafting: [By hand] [Workbench]; Cooking: [Campfire]; Smithing: [Furnace] [Anvil]). One tab at a time, never one giant page. Clicking a built station in the Village opens its tab.
- **Mining:** 5 sites, each needing a pickaxe tier on the Tool Belt: Quarry (any pickaxe: stone, copper, tin, clay; quartz), Hillside (Bronze: iron, coal; sapphire), Old Mine (tier 3: silver, mithril; emerald), Deep Cave (tier 4: gold, adamant; ruby), Starfall Crater (tier 6: star ore; diamond). Pickaxes past Bronze don't exist yet, so those sites show "coming later". Metal tiers: Bronze, Iron, Steel (iron + coal), Mithril, Adamant, Starsteel; Silver and Gold for jewelry. Inside a site you pick the rock and always get its ore, plus small rare-find chances. Foraging stays the random one.
- **Tools:** items with `tool: { type, tier, yield }`. Trees/rocks need `toolType` of at least `toolTier` on the Tool Belt; the best equipped tool is used and its `yield` is how many items one click gives (Flint 1, Bronze 2, then planned Iron 3, Steel 4, Mithril 5, Adamant 6, Starsteel 8). Metal tools are made at the Anvil from bars + a Wooden Handle. Tiers tell apart by `tint` on the icon (`iconHtml` in ui/format.js).
- **Build costs:** stations and buildings are long-term goals that take a good number of clicks (Twine is the slow part: 3 fiber each).
- **Gates:** no levels. Progress is gated by tools (tier on the Tool Belt), stations (unlock new *kinds* of recipes) and discovery (having the materials).

## Scope
Only add what is asked for. Suggest extras instead of adding them.
