import updateCardSrs from '../repo/updateCardSrs.js';
import deleteReview from '../repo/deleteReview.js';
import setSetting from '../settings/setSetting.js';
import clearSetting from '../settings/clearSetting.js';
import saveState from './saveState.js';
/** «↶»: возвращает последнюю оценку — расписание карточки, запись в истории, счётчик дня, очередь и позицию. */
export default async function undoGrade(session) {
  const u = session.undo;
  if (!u) return;
  Object.assign(session.map.get(u.id), u.srs);
  await updateCardSrs(u.id, u.srs);
  if (u.review) await deleteReview(u.review);
  await (u.today === null ? clearSetting('today') : setSetting('today', u.today));
  Object.assign(session, { order: u.order, pos: u.pos, undo: null });
  session.log.length = u.logLen;
  await saveState(session);
}
