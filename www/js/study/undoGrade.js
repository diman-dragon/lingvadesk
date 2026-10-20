import updateCardSrs from '../repo/updateCardSrs.js';
import deleteReview from '../repo/deleteReview.js';
/** «↶»: возвращает последнюю оценку — расписание карточки, запись в истории (вместе с ней уходит из счётчиков), очередь и позицию. */
export default async function undoGrade(session) {
  const u = session.undo;
  if (!u) return;
  Object.assign(session.map.get(u.id), u.srs);
  await updateCardSrs(u.id, u.srs);
  if (u.review) await deleteReview(u.review);
  Object.assign(session, { order: u.order, plan: new Set(u.plan), pos: u.pos, undo: null });
  session.log.length = u.logLen;
}
