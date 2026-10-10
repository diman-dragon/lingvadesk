import mergeNewCards from './mergeNewCards.js';
/** Сохранённый порядок без удалённых карточек; в seq/shuffle новые дописываются в конец. */
export default function restoreOrder(order, map, mode) {
  const alive = order.filter(id => map.has(id));
  return mode === 'learn' ? alive : mergeNewCards(alive, [...map.keys()]);
}
