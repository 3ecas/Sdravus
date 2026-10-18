// Turns off browser behaviours that get in the way of a game:
// the right-click menu, dragging images/text, and text selection (see base.css).
// Text boxes (like the stash search) keep working normally.
// The game will add its own right-click menus (e.g. on stash items) later.

export function disableBrowserDefaults() {
  document.addEventListener("contextmenu", (event) => {
    if (!isTextField(event.target)) event.preventDefault();
  });

  document.addEventListener("dragstart", (event) => {
    if (!isTextField(event.target)) event.preventDefault();
  });
}

function isTextField(el) {
  return el.closest("input, textarea, [contenteditable='true']") !== null;
}
