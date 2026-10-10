import listCards from '../repo/listCards.js';
import loadSavedState from './loadSavedState.js';
import restoreOrder from './restoreOrder.js';
import introCount from './introCount.js';
import buildOrder from './buildOrder.js';
import saveState from './saveState.js';
/**
 * session = { deck, mode, map(id→card), order[], pos, intro }.
 * SRS-очередь собирается заново; завершённая пачка «Обучения» заменяется следующей.
 */
export default async function startSession(deck, mode) {
  const cards = await listCards(deck.id);
  const map = new Map(cards.map(c => [c.id, c]));
  const saved = mode === 'srs' ? null : await loadSavedState(deck.id, mode);
  const resume = saved && (mode !== 'learn' || saved.pos < saved.order.length);
  const order = resume ? restoreOrder(saved.order, map, mode) : buildOrder(mode, cards);
  const session = {
    deck, mode, map, order,
    intro: resume ? Math.min(saved.intro, order.length) : introCount(mode, order),
    pos: resume ? Math.min(saved.pos, order.length) : 0
  };
  await saveState(session);
  return session;
}
