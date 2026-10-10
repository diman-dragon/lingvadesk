import currentCard from './currentCard.js';
import nextSrs from '../srs/nextSrs.js';
import updateCardSrs from '../repo/updateCardSrs.js';
import movePos from './movePos.js';
export default async function gradeCard(session, grade) {
  const card = currentCard(session);
  if (!card) return;
  Object.assign(card, nextSrs(card, grade));
  await updateCardSrs(card.id, card);
  const requeue = session.mode === 'srs' || session.mode === 'learn';
  if (requeue && grade === 'again') session.order.push(card.id); // вернётся в конце очереди
  await movePos(session, 1);
}
