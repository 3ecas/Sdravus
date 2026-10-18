// Page for a skill that makes things from recipes (Crafting, Cooking...). One tab per place
// you make them: "By hand" (if the skill has hand recipes), then each Village station that
// belongs to the skill (Crafting: Workbench, Cooking: Campfire). One tab's recipes at a time.
// Recipes appear once you've had any of their ingredients. Click a recipe to make it,
// click again to stop. The tab is part of the address: #crafting/workbench.
//
// recipePage("crafting", { verb: "craft", empty: "..." }) returns the page's render function.

import { STATIONS } from "../data/stations.js";
import { getRecipe } from "../data/recipes.js";
import { getPage } from "../data/pages.js";
import { getItem } from "../data/items.js";
import { onChange, skillXp } from "../game/state.js";
import { toggleCraft, craftActionId, canCraft } from "../game/crafting.js";
import { knownRecipes, isNew, markViewed } from "../game/discovery.js";
import { isBuilt } from "../game/village.js";
import { levelFromXp } from "../game/xp.js";
import { routeHref } from "../router.js";
import { bindActionCards } from "../ui/actionCards.js";
import { costHtml, updateCost } from "../ui/costList.js";
import { iconHtml } from "../ui/format.js";

const HAND = { id: "hand", name: "By hand", icon: "✋" };

export function recipePage(skill, { verb, empty }) {
  return (container, page, route) => renderRecipePage(container, route, { skill, verb, empty });
}

function renderRecipePage(container, route, { skill, verb, empty }) {
  const newThisVisit = new Set(); // recipes shown with a "New" badge during this visit
  let layoutKey = null; // what was last drawn; null so the first update always draws

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".action-card");
    if (card) toggleCraft(getRecipe(card.dataset.id));
  });

  function update() {
    const tabs = availableTabs(skill);
    const active = tabs.find((t) => t.id === route.tab) || tabs[0];
    const recipes = active ? tabRecipes(skill, active) : [];
    const key = [tabs.map((t) => `${t.id}:${isBuilt(t.id)}:${hasNewIn(skill, t)}`), active?.id, recipes.map((r) => r.id)].join("|");

    if (key !== layoutKey) {
      layoutKey = key;
      const shown = active && !isUnbuiltStation(active) ? recipes : [];
      shown.filter((r) => isNew("recipe", r.id)).forEach((r) => newThisVisit.add(r.id));
      container.innerHTML = tabs.length
        ? `${tabsHtml(skill, tabs, active, route.from)}${tabBodyHtml(active, recipes, newThisVisit, verb)}`
        : `<p class="craft-hint">${empty}</p>`;
      markViewed("recipe", shown);
    }
    refreshCards();
  }

  function refreshCards() {
    const level = levelFromXp(skillXp(skill));
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

// "By hand" plus each of the skill's stations you know a recipe for (built or not).
function availableTabs(skill) {
  const known = knownRecipes().filter((r) => r.skill === skill);
  const stations = STATIONS.filter((s) => s.skill === skill && known.some((r) => r.station === s.id));
  const hasHand = known.some((r) => !r.station);
  return [...(hasHand ? [HAND] : []), ...stations];
}

// Known recipes of this skill made at this tab's station (or by hand).
function tabRecipes(skill, tab) {
  const station = tab.id === HAND.id ? null : tab.id;
  return knownRecipes().filter((r) => r.skill === skill && r.station === station);
}

function isUnbuiltStation(tab) {
  return tab.id !== HAND.id && !isBuilt(tab.id);
}

function hasNewIn(skill, tab) {
  return !isUnbuiltStation(tab) && tabRecipes(skill, tab).some((r) => isNew("recipe", r.id));
}

function tabsHtml(skill, tabs, active, from) {
  return `
    <nav class="tabs">
      ${tabs.map((tab) => `
        <a class="tab${tab === active ? " active" : ""}${isUnbuiltStation(tab) ? " unbuilt" : ""}" href="${routeHref(skill, tab.id, from)}">
          <span>${tab.icon}</span>${tab.name}
          ${tab !== active && hasNewIn(skill, tab) ? `<span class="tab-dot" title="New recipes"></span>` : ""}
        </a>
      `).join("")}
    </nav>
  `;
}

function tabBodyHtml(tab, recipes, newIds, verb) {
  if (isUnbuiltStation(tab)) {
    return `<p class="craft-hint">Build a ${tab.name} in the <a href="#village">Village</a> to ${verb} here.</p>`;
  }
  return `<div class="action-grid">${recipes.map((r) => recipeCardHtml(r, newIds.has(r.id))).join("")}</div>`;
}

function recipeCardHtml(recipe, isNewRecipe) {
  const output = getItem(recipe.output.item);
  return `
    <button class="action-card" data-id="${recipe.id}" data-action="${craftActionId(recipe)}">
      ${isNewRecipe ? `<span class="new-tag">New</span>` : ""}
      <span class="needs-level" title="Needs ${getPage(recipe.skill).name} level ${recipe.level}" hidden>Lv ${recipe.level}</span>
      <span class="action-icon">${iconHtml(output)}</span>
      <span class="action-name">${recipe.name}${recipe.output.amount > 1 ? ` <small>×${recipe.output.amount}</small>` : ""}</span>
      ${costHtml(recipe.inputs)}
      <span class="action-meta">
        <span>${recipe.seconds}s</span>
        <span>+${recipe.xp} XP</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
    </button>
  `;
}
