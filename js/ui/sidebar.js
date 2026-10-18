// Builds the side menu, highlights the current page, and handles the mobile drawer.

import { MENU_GROUPS } from "../data/pages.js";
import { onChange, skillXp } from "../game/state.js";
import { levelFromXp } from "../game/xp.js";
import { pageHasNew } from "../game/discovery.js";

const sidebarEl = document.getElementById("sidebar");
const menuEl = document.getElementById("menu");
const scrimEl = document.getElementById("scrim");
const toggleEl = document.getElementById("menuToggle");

export function renderSidebar() {
  menuEl.innerHTML = MENU_GROUPS.map(groupHtml).join("");

  toggleEl.addEventListener("click", openSidebar);
  scrimEl.addEventListener("click", closeSidebar);

  updateLevels();
  updateNewDots();
  onChange(updateLevels);
  onChange(updateNewDots);
}

// A small dot on pages with something new to see (e.g. a newly discovered recipe).
function updateNewDots() {
  menuEl.querySelectorAll(".menu-new").forEach((dot) => {
    dot.hidden = !pageHasNew(dot.dataset.page);
  });
}

// Keep each skill's "Lv" in the menu up to date.
function updateLevels() {
  menuEl.querySelectorAll(".menu-level").forEach((el) => {
    el.textContent = `Lv ${levelFromXp(skillXp(el.dataset.skill))}`;
  });
}

export function setActivePage(id) {
  menuEl.querySelectorAll(".menu-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === id);
  });
}

export function openSidebar() {
  sidebarEl.classList.add("open");
  scrimEl.classList.add("show");
}

export function closeSidebar() {
  sidebarEl.classList.remove("open");
  scrimEl.classList.remove("show");
}

function groupHtml(group) {
  return `
    <div class="menu-group">
      ${group.title ? `<div class="menu-heading">${group.title}</div>` : ""}
      ${group.pages.map(itemHtml).join("")}
    </div>
  `;
}

function itemHtml(page) {
  return `
    <a class="menu-item" href="#${page.id}" data-id="${page.id}" style="--accent:${page.color}">
      <span class="menu-icon">${page.icon}</span>
      <span class="menu-label">${page.name}</span>
      <span class="menu-new" data-page="${page.id}" title="Something new" hidden></span>
      ${page.skill ? `<span class="menu-level" data-skill="${page.id}">Lv 1</span>` : ""}
    </a>
  `;
}
