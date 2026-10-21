import sumDecks from './sumDecks.js';
/** Колоды (study/planInfo) → проекты по порядку появления: [{ id, decks, ...сумма (sumDecks) }]. */
export default function groupProjects(decks) {
  const by = new Map();
  for (const d of decks) by.set(d.project_id, [...(by.get(d.project_id) ?? []), d]);
  return [...by].map(([id, list]) => ({ id, decks: list, ...sumDecks(list, list[0].pname) }));
}
