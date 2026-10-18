// Crafting page: one tab per place you craft. "By hand" first, then each Village station
// that belongs to Crafting (e.g. the Workbench). Only one tab's recipes show at a time.
// Recipes appear once you've had any of their ingredients. Click a recipe to craft,
// click again to stop. The tab is part of the address: #crafting/workbench.

import { STATIONS } from "../data/stations.js";
import { getRecipe } from "../data/recipes.js";
import { getItem } from "../data/items.js";
import { onChange, skillXp } from "../game/state.js";
import { toggleCraft, craftActionId, canCraft } from "../game/crafting.js";
import { knownRecipes, isNew, markViewed } from "../game/discovery.js";
import { isBuilt } from "../game/village.js";
import { levelFromXp } from "../game/xp.js";
import { routeHref } from "../router.js";
import { bindActionCards } from "../ui/actionCards.js";
import { costHtml, updateCost } from "../ui/costList.js";

const SKILL = "crafting";
const HAND = { id: "hand", name: "By hand", icon: "✋" };

export function renderCrafting(container, page, route) {
  const newThisVisit = new Set(); // recipes shown with a "New" badge during this visit
  let layoutKey = null; // what was last drawn; null so the first update always draws

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".action-card");
    if (card) toggleCraft(getRecipe(card.dataset.id));
  });

  function update() {
    const tabs = availableTabs();
    const active = tabs.find((t) => t.id === route.tab) || tabs[0];
    const recipes = active ? tabRecipes(active) : [];
    const key = [tabs.map((t) => `${t.id}:${isBuilt(t.id)}:${hasNewIn(t)}`), active?.id, recipes.map((r) => r.id)].join("|");

    if (key !== layoutKey) {
      layoutKey = key;
      const shown = active && !isUnbuiltStation(active) ? recipes : [];
      shown.filter((r) => isNew("recipe", r.id)).forEach((r) => newThisVisit.add(r.id));
      container.innerHTML = tabs.length
        ? `${tabsHtml(tabs, active, route.from)}${tabBodyHtml(active, recipes, newThisVisit)}`
        : `<p class="craft-hint">Nothing to craft yet. Go foraging to find materials.</p>`;
      markViewed("recipe", shown);
    }
    refreshCards();
  }

  function refreshCards() {
    const level = levelFromXp(skillXp(SKILL));
    container.querySelectorAll(".action-card").forEach((card) => {
      const recipe = getRecipe(card.dataset.id);
      card.classList.toggle("locked", !canCraft(recipe) && !card.classList.contains("active"));
      card.querySelector(".needs-level").hidden = level >= recipe.level;
      updateCost(card, recipe.inputs);
    });
  }

  update();
  const stopListening = onChange(update);
  const unbindCards = bindActionCards(container);

  return () => {
    stopListening();
    unbindCards();
  };
}

// "By hand" plus each Crafting station you know a recipe for (built or not).
function availableTabs() {
  const known = knownRecipes();
  const stations = STATIONS.filter((s) => s.skill === SKILL && known.some((r) => r.station === s.id));
  const hasHand = known.some((r) => !r.station);
  return [...(hasHand ? [HAND] : []), ...stations];
}

// Known recipes made at this tab's station (or by hand).
function tabRecipes(tab) {
  const station = tab.id === HAND.id ? null : tab.id;
  return knownRecipes().filter((r) => r.station === station);
}

function isUnbuiltStation(tab) {
  return tab.id !== HAND.id && !isBuilt(tab.id);
}

function hasNewIn(tab) {
  return !isUnbuiltStation(tab) && tabRecipes(tab).some((r) => isNew("recipe", r.id));
}

function tabsHtml(tabs, active, from) {
  return `
    <nav class="tabs">
      ${tabs.map((tab) => `
        <a class="tab${tab === active ? " active" : ""}${isUnbuiltStation(tab) ? " unbuilt" : ""}" href="${routeHref(SKILL, tab.id, from)}">
          <span>${tab.icon}</span>${tab.name}
          ${tab !== active && hasNewIn(tab) ? `<span class="tab-dot" title="New recipes"></span>` : ""}
        </a>
      `).join("")}
    </nav>
  `;
}

function tabBodyHtml(tab, recipes, newIds) {
  if (isUnbuiltStation(tab)) {
    return `<p class="craft-hint">Build a ${tab.name} in the <a href="#village">Village</a> to craft here.</p>`;
  }
  return `<div class="action-grid">${recipes.map((r) => recipeCardHtml(r, newIds.has(r.id))).join("")}</div>`;
}

function recipeCardHtml(recipe, isNewRecipe) {
  const output = getItem(recipe.output.item);
  return `
    <button class="action-card" data-id="${recipe.id}" data-action="${craftActionId(recipe)}">
      ${isNewRecipe ? `<span class="new-tag">New</span>` : ""}
      <span class="needs-level" title="Needs Crafting level ${recipe.level}" hidden>Lv ${recipe.level}</span>
      <span class="action-icon">${output.icon}</span>
      <span class="action-name">${recipe.name}</span>
      ${costHtml(recipe.inputs)}
      <span class="action-meta">
        <span>${recipe.seconds}s</span>
        <span>+${recipe.xp} XP</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
    </button>
  `;
}
