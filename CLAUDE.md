# Sdravus

Idle RPG village builder / crafting browser game. Plain static site, no build step. Deployed to GitHub Pages from `main`.

## Git
- Always commit and push directly to the `main` branch. Do not use feature branches or open pull requests unless asked.

## Code organization
This will grow into a big game, so keep things separated and `index.html` clean.

- `index.html` — page shell only: links to CSS files and the `js/main.js` module. No inline scripts or styles.
- `assets/` — images, icons, favicon.
- `css/` — one file per area: `base.css` (tokens, reset), `layout.css` (app shell, mobile), `sidebar.css`, `view.css`. Add a new file per new area and link it in `index.html`.
- `js/` — ES modules (`import`/`export`), no globals.
  - `main.js` — entry point, wires everything together.
  - `config.js` — game-wide settings (`MAX_LEVEL` is 100).
  - `router.js` — URL hash routing.
  - `data/` — static game data (`pages.js`: menu groups and pages).
  - `ui/` — shared UI pieces (`sidebar.js`, `view.js`).
  - `views/` — one file per page's content; register it in `views/index.js`. Pages without one show `placeholder.js`.

## Cache busting
The CSS and `js/main.js` links in `index.html` end in `?v=N`. Bump N (all of them together) in every commit that changes CSS or JS, so browsers fetch the new files instead of cached ones.

## Running locally
ES modules don't load from `file://`. Serve the folder: `python3 -m http.server` then open http://localhost:8000.

## Scope
Only add what is asked for. Suggest extras instead of adding them.
