// Places to forage. Each cycle finds one random item from `finds`;
// a higher weight means it turns up more often.

export const AREAS = [
  {
    id: "plains",
    name: "Plains",
    image: "assets/areas/plains.svg",
    level: 1,
    xp: 1,
    seconds: 5,
    finds: [
      { item: "fiber",   weight: 30 },
      { item: "branch",  weight: 28 },
      { item: "flint",   weight: 25 },
      { item: "berries", weight: 12 },
      { item: "flower",  weight: 5 },
    ],
  },
];

export function getArea(id) {
  return AREAS.find((area) => area.id === id);
}
