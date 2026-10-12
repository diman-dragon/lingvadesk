import listCards from '../repo/listCards.js';
import nextCardOrd from '../repo/nextCardOrd.js';
import insertCards from '../repo/insertCards.js';
/** Добавляет только те карточки, которых в колоде ещё нет (слово + перевод) — повторный импорт ничего не дублирует. */
export default async function addMissingCards(deckId, cards) {
  const have = new Set((await listCards(deckId)).map(c => `${c.front}\u0000${c.back}`));
  const fresh = cards.filter(c => !have.has(`${c.front}\u0000${c.back}`));
  if (fresh.length) await insertCards(deckId, fresh, await nextCardOrd(deckId));
  return fresh.length;
}
