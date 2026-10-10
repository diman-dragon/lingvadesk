/** Дописывает в конец порядка id, которых там ещё нет. */
export default function mergeNewCards(order, allIds) {
  const seen = new Set(order);
  return [...order, ...allIds.filter(id => !seen.has(id))];
}
