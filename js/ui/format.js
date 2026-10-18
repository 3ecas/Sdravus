// Small text helpers shared by views.

// 950 -> "950", 12500 -> "12.5K", 3000000 -> "3M", so big numbers fit small boxes.
export function formatCount(count) {
  if (count < 10000) return String(count);
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count);
}

// Makes text safe to put inside HTML.
export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// An item's (or tree's, rock's...) icon as HTML: its pixel-art PNG if it has `image`
// (16x16, drawn with sharp pixels at the text size), otherwise its emoji.
// Tinted if it has a tint (e.g. bronze tools).
export function iconHtml(item) {
  const icon = item.image ? `<img class="pixel-icon" src="${item.image}" alt="">` : item.icon;
  return item.tint ? `<span class="tint tint-${item.tint}">${icon}</span>` : icon;
}

// 2.55 -> "2.6s", 3 -> "3s"
export function formatSeconds(seconds) {
  return `${Number.isInteger(seconds) ? seconds : seconds.toFixed(1)}s`;
}

// "a Bronze Axe", "an Iron Axe"
export function withArticle(name) {
  return `${/^[aeiou]/i.test(name) ? "an" : "a"} ${name}`;
}
