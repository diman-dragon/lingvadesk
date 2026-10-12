import buildOrder from './buildOrder.js';
import saveState from './saveState.js';
/** Новая очередь: следующая пачка «Обучения», свежие просроченные (srs) или новое перемешивание. */
export default async function restartSession(session) {
  session.order = buildOrder(session.mode, [...session.map.values()], session.shuffle);
  session.phase = session.mode === 'learn' && session.order.length ? 'intro' : 'quiz';
  session.total = session.order.length;
  session.pos = 0;
  await saveState(session);
}
