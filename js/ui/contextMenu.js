// The game's own right-click menu.
//
// openContextMenu(x, y, actions) shows a small list of actions at the mouse position.
//   actions: [{ label, onClick, danger?, disabled?, confirmLabel? }]
//            confirmLabel: the first click changes the button to this text, and a
//            second click is needed to run it (for things you can't undo).
// The menu closes on any click outside it, Esc, scrolling, resizing or changing page.

let menuEl = null;

export function openContextMenu(x, y, actions) {
  closeContextMenu();

  menuEl = document.createElement("div");
  menuEl.className = "context-menu";
  menuEl.innerHTML = `
    ${actions.map((action, i) => `
      <button class="context-menu-item${action.danger ? " danger" : ""}" data-index="${i}"${action.disabled ? " disabled" : ""}>${action.label}</button>
    `).join("")}
  `;

  menuEl.addEventListener("click", (event) => {
    const button = event.target.closest(".context-menu-item");
    if (!button || button.disabled) return;
    const action = actions[button.dataset.index];

    if (action.confirmLabel && !button.classList.contains("confirming")) {
      button.classList.add("confirming");
      button.textContent = action.confirmLabel;
      return;
    }
    closeContextMenu();
    action.onClick();
  });

  document.body.appendChild(menuEl);
  placeInsideScreen(menuEl, x, y);

  // The press that opened the menu has already happened, so it's safe to listen right away.
  document.addEventListener("pointerdown", closeOnOutside, true);
  document.addEventListener("keydown", closeOnEscape);
  window.addEventListener("scroll", closeContextMenu, true);
  window.addEventListener("resize", closeContextMenu);
  window.addEventListener("hashchange", closeContextMenu);
}

export function closeContextMenu() {
  if (!menuEl) return;
  menuEl.remove();
  menuEl = null;
  document.removeEventListener("pointerdown", closeOnOutside, true);
  document.removeEventListener("keydown", closeOnEscape);
  window.removeEventListener("scroll", closeContextMenu, true);
  window.removeEventListener("resize", closeContextMenu);
  window.removeEventListener("hashchange", closeContextMenu);
}

function closeOnOutside(event) {
  if (menuEl && !menuEl.contains(event.target)) closeContextMenu();
}

function closeOnEscape(event) {
  if (event.key === "Escape") closeContextMenu();
}

// Opens at the mouse, but flips left/up if it would go off the edge of the screen.
function placeInsideScreen(el, x, y) {
  const margin = 8;
  const { width, height } = el.getBoundingClientRect();
  const left = x + width + margin > window.innerWidth ? x - width : x;
  const top = y + height + margin > window.innerHeight ? y - height : y;
  el.style.left = `${Math.max(margin, left)}px`;
  el.style.top = `${Math.max(margin, top)}px`;
}
