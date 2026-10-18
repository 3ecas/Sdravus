// Builds the side menu, highlights the current page, and handles the mobile drawer.

import { MENU_GROUPS } from "../data/pages.js";
import { onChange, skillXp } from "../game/state.js";
import { levelFromXp } from "../game/xp.js";

const sidebarEl = document.getElementById("sidebar");
const menuEl = document.getElementById("menu");
const scrimEl = document.getElementById("scrim");
const toggleEl = document.getElementById("menuToggle");

export function renderSidebar() {
  menuEl.innerHTML = MENU_GROUPS.map(groupHtml).join("");

  toggleEl.addEventListener("click", openSidebar);
  scrimEl.addEventListener("click", closeSidebar);

  onChange(updateLevels);
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
      ${page.skill ? `<span class="menu-level" data-skill="${page.id}">Lv 1</span>` : ""}
    </a>
  `;
}
