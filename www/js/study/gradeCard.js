import currentCard from './currentCard.js';
import nextSrs from '../srs/nextSrs.js';
import updateCardSrs from '../repo/updateCardSrs.js';
import countToday from './countToday.js';
import saveState from './saveState.js';
import { BEHAVIOR } from '../constants/BEHAVIOR.js';
/** Оценённая карточка уходит из очереди; «Снова» вернётся через несколько карточек этой же сессии. */
export default async function gradeCard(session, grade) {
  const card = currentCard(session);
  if (!card) return;
  Object.assign(card, nextSrs(card, grade));
  await updateCardSrs(card.id, card);
  const [id] = session.order.splice(session.pos, 1);
  if (grade === 'again') session.order.splice(Math.min(session.order.length, session.pos + BEHAVIOR.againGap), 0, id);
  if (session.pos >= session.order.length) session.pos = 0;
  await countToday();
  await saveState(session);
}
