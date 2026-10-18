// Crafting page: recipes grouped by where you make them: "By hand" first, then one
// section per Village station. Recipes appear once you've had any of their ingredients.
// Click a recipe to craft, click again to stop.

import { STATIONS } from "../data/stations.js";
import { getRecipe } from "../data/recipes.js";
import { getItem } from "../data/items.js";
import { onChange, skillXp } from "../game/state.js";
import { toggleCraft, craftActionId, canCraft } from "../game/crafting.js";
import { knownRecipes, visibleRecipes, isNew, markViewed } from "../game/discovery.js";
import { isBuilt } from "../game/village.js";
import { levelFromXp } from "../game/xp.js";
import { bindActionCards } from "../ui/actionCards.js";
import { costHtml, updateCost } from "../ui/costList.js";

const HAND = { id: null, name: "By hand", icon: "✋" };

export function renderCrafting(container) {
  const newThisVisit = new Set(); // recipes shown with a "New" badge during this visit
  let layoutKey = null; // what was last drawn; null so the first update always draws

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".action-card");
    if (card) toggleCraft(getRecipe(card.dataset.id));
  });

  // Rebuild the sections when what's visible changes; otherwise just refresh numbers.
  function update() {
    const visible = visibleRecipes();
    const key = visible.map((r) => r.id).join() + "|" + STATIONS.map((s) => isBuilt(s.id)).join();
    if (key !== layoutKey) {
      layoutKey = key;
      visible.filter((r) => isNew("recipe", r.id)).forEach((r) => newThisVisit.add(r.id));
      container.innerHTML = sectionsHtml(visible, newThisVisit);
      markViewed("recipe", visible);
    }
    refreshCards();
  }

  function refreshCards() {
    const level = levelFromXp(skillXp("crafting"));
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

function sectionsHtml(visible, newIds) {
  const known = knownRecipes();
  const sections = [HAND, ...STATIONS].map((station) => {
    const recipes = visible.filter((r) => r.station === station.id);
    const builtOrHand = !station.id || isBuilt(station.id);

    if (builtOrHand && recipes.length) {
      return `
        <section class="craft-section">
          <h2 class="panel-title">${station.icon} ${station.name}</h2>
          <div class="action-grid">${recipes.map((r) => recipeCardHtml(r, newIds.has(r.id))).join("")}</div>
        </section>
      `;
    }
    // A station you know recipes for but haven't built yet: point to the Village.
    if (!builtOrHand && known.some((r) => r.station === station.id)) {
      return `
        <section class="craft-section">
          <h2 class="panel-title">${station.icon} ${station.name}</h2>
          <p class="craft-hint">Build a ${station.name} in the Village to craft here.</p>
        </section>
      `;
    }
    return "";
  }).join("");

  return sections || `<p class="craft-hint">Nothing to craft yet. Go foraging to find materials.</p>`;
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
