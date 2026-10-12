import shuffle from '../util/shuffle.js';
import isNewCard from '../srs/isNewCard.js';
import { LEARN_BATCH } from '../constants/LEARN_BATCH.js';
/** Очередь id: srs — просроченные, learn — пачка новых, review — все (по порядку или вперемешку). */
export default function buildOrder(mode, cards, shuffleOn = 'off') {
  const ids = list => list.map(c => c.id);
  if (mode === 'learn') return ids(cards.filter(isNewCard).slice(0, LEARN_BATCH));
  if (mode === 'srs') {
    const now = Date.now();
    return ids(cards.filter(c => c.due <= now).sort((a, b) => a.due - b.due || a.ord - b.ord));
  }
  return shuffleOn === 'on' ? shuffle(ids(cards)) : ids(cards);
}
