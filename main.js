// Menu layout: each group is a section in the sidebar.
// Add a new page by adding an item here.
const MENU = [
  {
    title: null,
    items: [
      { id: "village", name: "Village", icon: "🏡", color: "#e8b04a", blurb: "Build and grow your village." },
      { id: "stash",   name: "Stash",   icon: "🎒", color: "#c98b5a", blurb: "Everything you have gathered and crafted." },
      { id: "gear",    name: "Gear",    icon: "🪖", color: "#8fa3b8", blurb: "Equip weapons, armour and tools." },
    ],
  },
  {
    title: "Skills",
    items: [
      { id: "attack",     name: "Attack",     icon: "⚔️", color: "#e0675a", blurb: "Hit harder and more often in combat.", skill: true },
      { id: "defense",    name: "Defense",    icon: "🛡️", color: "#5f9bd6", blurb: "Take less damage from enemies.", skill: true },
      { id: "health",     name: "Health",     icon: "❤️", color: "#e45f7d", blurb: "More hitpoints to survive longer fights.", skill: true },
      { id: "archery",    name: "Archery",    icon: "🏹", color: "#7cb86a", blurb: "Strike from a distance with bows.", skill: true },
      { id: "witchcraft", name: "Witchcraft", icon: "🔮", color: "#a97ad8", blurb: "Cast spells and brew curses.", skill: true },
    ],
  },
  {
    title: "Natural Resources",
    items: [
      { id: "farming",    name: "Farming",    icon: "🌾", color: "#9cc35a", blurb: "Plant seeds and harvest crops.", skill: true },
      { id: "lumberjack", name: "Lumberjack", icon: "🪓", color: "#b98a52", blurb: "Chop trees for logs.", skill: true },
      { id: "mining",     name: "Mining",     icon: "⛏️", color: "#9aa0a8", blurb: "Mine ores and gems.", skill: true },
      { id: "fishing",    name: "Fishing",    icon: "🎣", color: "#4fb3c9", blurb: "Catch fish from rivers and seas.", skill: true },
      { id: "cooking",    name: "Cooking",    icon: "🍲", color: "#e5894a", blurb: "Turn raw food into meals.", skill: true },
      { id: "smithing",   name: "Smithing",   icon: "🔨", color: "#d0a24e", blurb: "Smelt bars and forge gear.", skill: true },
    ],
  },
];

const ITEMS = MENU.flatMap((g) => g.items);
const DEFAULT_VIEW = "village";

const menuEl = document.getElementById("menu");
const viewEl = document.getElementById("view");
const topbarTitle = document.getElementById("topbarTitle");
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");

function buildMenu() {
  menuEl.innerHTML = MENU.map((group) => `
    <div class="menu-group">
      ${group.title ? `<div class="menu-heading">${group.title}</div>` : ""}
      ${group.items.map((item) => `
        <a class="menu-item" href="#${item.id}" data-id="${item.id}" style="--accent:${item.color}">
          <span class="menu-icon">${item.icon}</span>
          <span class="menu-label">${item.name}</span>
          ${item.skill ? `<span class="menu-level">Lv 1</span>` : ""}
        </a>
      `).join("")}
    </div>
  `).join("");
}

function renderView(id) {
  const item = ITEMS.find((i) => i.id === id) || ITEMS.find((i) => i.id === DEFAULT_VIEW);

  menuEl.querySelectorAll(".menu-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === item.id);
  });

  topbarTitle.textContent = item.name;
  document.title = `${item.name} · Sdravus`;

  viewEl.style.setProperty("--accent", item.color);
  viewEl.innerHTML = `
    <div class="view-header">
      <div class="view-icon">${item.icon}</div>
      <div>
        <h1>${item.name}</h1>
        <p>${item.blurb}</p>
      </div>
      ${item.skill ? `
        <div class="view-level">
          <span class="lvl-text">Level 1 <small>/ 99</small></span>
          <div class="xp-bar"><div class="xp-fill" style="width:0%"></div></div>
          <span class="xp-text">0 / 83 XP</span>
        </div>` : ""}
    </div>
    <div class="view-body">
      <div class="placeholder">
        <span class="placeholder-icon">${item.icon}</span>
        <p>${item.name} content coming soon.</p>
      </div>
    </div>
  `;

  closeSidebar();
}

// Mobile menu
function openSidebar() { sidebar.classList.add("open"); scrim.classList.add("show"); }
function closeSidebar() { sidebar.classList.remove("open"); scrim.classList.remove("show"); }
document.getElementById("menuToggle").addEventListener("click", openSidebar);
scrim.addEventListener("click", closeSidebar);

// The URL hash holds the current view, so refresh keeps your place.
window.addEventListener("hashchange", () => renderView(location.hash.slice(1)));

buildMenu();
renderView(location.hash.slice(1) || DEFAULT_VIEW);
