import mergeNewCards from './mergeNewCards.js';
/** Сохранённая очередь без удалённых карточек; в «Повторении» новые карточки дописываются в конец. */
export default function restoreOrder(order, map, mode) {
  const alive = order.filter(id => map.has(id));
  return mode === 'review' ? mergeNewCards(alive, [...map.keys()]) : alive;
}
