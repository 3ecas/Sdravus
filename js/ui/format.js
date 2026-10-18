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
