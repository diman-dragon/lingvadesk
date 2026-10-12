import currentCard from './currentCard.js';
import nextSrs from '../srs/nextSrs.js';
import updateCardSrs from '../repo/updateCardSrs.js';
import saveState from './saveState.js';
/** Оценённая карточка уходит из очереди; «Снова» — в конец очереди (вернётся позже в этой же сессии). */
export default async function gradeCard(session, grade) {
  const card = currentCard(session);
  if (!card) return;
  Object.assign(card, nextSrs(card, grade));
  await updateCardSrs(card.id, card);
  const [id] = session.order.splice(session.pos, 1);
  if (grade === 'again') session.order.push(id);
  if (session.pos >= session.order.length) session.pos = 0;
  await saveState(session);
}
