import shuffle from '../util/shuffle.js';
import isNewCard from '../srs/isNewCard.js';
import { LEARN_BATCH } from '../constants/LEARN_BATCH.js';
import { NO_LIMITS } from '../constants/NO_LIMITS.js';
/**
 * Очередь id: srs — просроченные (самые давние первыми), затем новые в пределах дневного лимита, всё не больше размера сессии;
 * learn — пачка новых; review — все (по порядку или вперемешку).
 */
export default function buildOrder(mode, cards, shuffleOn = 'off', limits = NO_LIMITS) {
  const ids = list => list.map(c => c.id);
  if (mode === 'learn') return ids(cards.filter(isNewCard).slice(0, LEARN_BATCH));
  if (mode === 'srs') {
    const now = Date.now();
    const due = cards.filter(c => c.due > 0 && c.due <= now).sort((a, b) => a.due - b.due || a.ord - b.ord);
    return ids([...due, ...cards.filter(isNewCard).slice(0, limits.newLeft)].slice(0, limits.max));
  }
  return shuffleOn === 'on' ? shuffle(ids(cards)) : ids(cards);
}
