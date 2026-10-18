// Crafting page: recipe cards showing what they need. Click to craft, click again to stop.

import { RECIPES, getRecipe } from "../data/recipes.js";
import { getItem } from "../data/items.js";
import { onChange, itemCount } from "../game/state.js";
import { toggleCraft, craftActionId, canCraft } from "../game/crafting.js";
import { bindActionCards } from "../ui/actionCards.js";

export function renderCrafting(container) {
  container.innerHTML = `<div class="action-grid">${RECIPES.map(recipeCardHtml).join("")}</div>`;

  const cards = [...container.querySelectorAll(".action-card")];
  cards.forEach((card) => {
    card.addEventListener("click", () => toggleCraft(getRecipe(card.dataset.id)));
  });

  // Keep "have / need" amounts and the greyed-out state up to date.
  function update() {
    cards.forEach((card) => {
      const recipe = getRecipe(card.dataset.id);
      card.classList.toggle("locked", !canCraft(recipe) && !card.classList.contains("active"));
      card.querySelectorAll("[data-input]").forEach((el) => {
        const { item, amount } = recipe.inputs[el.dataset.input];
        const have = itemCount(item);
        el.querySelector(".have").textContent = have;
        el.classList.toggle("short", have < amount);
      });
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

function recipeCardHtml(recipe) {
  const output = getItem(recipe.output.item);
  return `
    <button class="action-card" data-id="${recipe.id}" data-action="${craftActionId(recipe)}">
      <span class="action-icon">${output.icon}</span>
      <span class="action-name">${recipe.name}</span>
      <span class="recipe-inputs">${recipe.inputs.map(inputHtml).join("")}</span>
      <span class="action-meta">
        <span>${recipe.seconds}s</span>
        <span>+${recipe.xp} XP</span>
      </span>
      <span class="action-progress"><span class="action-progress-fill"></span></span>
    </button>
  `;
}

function inputHtml({ item, amount }, index) {
  const { icon, name } = getItem(item);
  return `
    <span class="recipe-input" data-input="${index}" title="${name}">
      ${icon} <span class="have">0</span>/${amount}
    </span>
  `;
}
