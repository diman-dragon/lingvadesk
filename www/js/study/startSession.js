import listCardsInScope from '../repo/listCardsInScope.js';
import sessionKey from './sessionKey.js';
import loadSavedState from './loadSavedState.js';
import restoreOrder from './restoreOrder.js';
import buildOrder from './buildOrder.js';
import saveState from './saveState.js';
/**
 * session = { scope, origin, mode, shuffle, key, map(id→карточка), order[], pos, phase, total }.
 * origin — область, выбранная на вкладке «Учёба» (у случайной колоды scope — конкретная колода).
 * srs собирается заново; learn и review продолжаются с сохранённого места.
 */
export default async function startSession(scope, mode, shuffle, origin = scope) {
  const cards = await listCardsInScope(scope);
  const map = new Map(cards.map(c => [c.id, c]));
  const key = sessionKey(scope, mode, shuffle);
  const saved = mode === 'srs' ? null : await loadSavedState(key);
  const kept = saved ? restoreOrder(saved.order, map, mode) : [];
  const resume = kept.length > 0;
  const order = resume ? kept : buildOrder(mode, cards, shuffle);
  const session = {
    scope, origin, mode, shuffle, key, map, order,
    phase: resume ? saved.phase : (mode === 'learn' && order.length ? 'intro' : 'quiz'),
    total: resume ? Math.max(saved.total, order.length) : order.length,
    pos: resume ? Math.min(saved.pos, order.length - 1) : 0
  };
  await saveState(session);
  return session;
}
