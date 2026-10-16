import currentCard from './currentCard.js';
import nextSrs from '../srs/nextSrs.js';
import isNewCard from '../srs/isNewCard.js';
import updateCardSrs from '../repo/updateCardSrs.js';
import insertReview from '../repo/insertReview.js';
import snapshotGrade from './snapshotGrade.js';
import requeue from './requeue.js';
import checkLeech from './checkLeech.js';
import countToday from './countToday.js';
import saveState from './saveState.js';
/**
 * Оценка карточки: расписание (SM-2), запись в историю, счётчик дня, итог сессии. sig — сигналы поведения (время до переворота / на ответе).
 * Перед изменениями запоминается снимок — «↶» (study/undoGrade) вернёт всё как было.
 */
export default async function gradeCard(session, grade, sig = {}) {
  const card = currentCard(session);
  if (!card) return;
  const fresh = isNewCard(card);
  session.undo = await snapshotGrade(session, card);
  Object.assign(card, nextSrs(card, grade));
  await updateCardSrs(card.id, card);
  session.undo.review = await insertReview(card.id, grade, sig, fresh);
  requeue(session, grade);
  session.log.push({ id: card.id, grade });
  await countToday();
  if (grade === 'again') await checkLeech(session, card);
  await saveState(session);
}
