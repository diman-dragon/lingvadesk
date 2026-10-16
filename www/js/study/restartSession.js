import buildOrder from './buildOrder.js';
import saveState from './saveState.js';
import pickDeck from './pickDeck.js';
import startSession from './startSession.js';
import loadLimits from './loadLimits.js';
/** Следующая пачка «Обучения», свежие просроченные (srs, с актуальным лимитом новых); в «Случайной колоде» — другая колода проекта. */
export default async function restartSession(session) {
  const next = session.mode === 'review' ? await pickDeck(session.origin, session.scope) : null;
  if (next) return Object.assign(session, await startSession(next, 'review', session.shuffle, session.origin));
  if (session.mode === 'srs') session.limits = await loadLimits();
  session.order = buildOrder(session.mode, [...session.map.values()], session.shuffle, session.limits);
  session.phase = session.mode === 'learn' && session.order.length ? 'intro' : 'quiz';
  session.total = session.order.length;
  session.log = [];
  session.undo = null;
  session.pos = 0;
  await saveState(session);
}
