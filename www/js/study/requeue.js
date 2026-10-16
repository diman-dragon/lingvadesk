import { BEHAVIOR } from '../constants/BEHAVIOR.js';
/** Оценённая карточка уходит из очереди; «Снова» вернётся через againGap карточек этой же сессии. */
export default function requeue(session, grade) {
  const [id] = session.order.splice(session.pos, 1);
  if (grade === 'again') session.order.splice(Math.min(session.order.length, session.pos + BEHAVIOR.againGap), 0, id);
  if (session.pos >= session.order.length) session.pos = 0;
}
