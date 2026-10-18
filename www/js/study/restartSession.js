import listCardsInScope from '../repo/listCardsInScope.js';
import buildOrder from './buildOrder.js';
import loadLimits from './loadLimits.js';
/** Новая очередь из базы: свежие просроченные и актуальный остаток лимита новых (интервальное повторение) или следующие давно не слушанные («На слух»). */
export default async function restartSession(session) {
  const cards = await listCardsInScope(session.scope, session.mode);
  session.map = new Map(cards.map(c => [c.id, c]));
  session.limits = await loadLimits();
  session.order = buildOrder(session.mode, cards, session.limits);
  Object.assign(session, { total: session.order.length, pos: 0, log: [], undo: null });
}
