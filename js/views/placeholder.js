// Shown for pages that don't have content yet.

export function renderPlaceholder(container, page) {
  container.innerHTML = `
    <div class="placeholder">
      <span class="placeholder-icon">${page.icon}</span>
      <p>${page.name} content coming soon.</p>
    </div>
  `;
}
