import shuffle from '../util/shuffle.js';
import isNewCard from '../srs/isNewCard.js';
import { LEARN_BATCH } from '../constants/LEARN_BATCH.js';
/** Порядок id для режима learn | seq | shuffle | srs. cards отсортированы по ord. */
export default function buildOrder(mode, cards) {
  if (mode === 'learn') {
    const ids = cards.filter(isNewCard).slice(0, LEARN_BATCH).map(c => c.id);
    return [...ids, ...ids];
  }
  if (mode === 'shuffle') return shuffle(cards.map(c => c.id));
  if (mode === 'srs') {
    const now = Date.now();
    return cards.filter(c => c.due <= now).sort((a, b) => a.due - b.due || a.ord - b.ord).map(c => c.id);
  }
  return cards.map(c => c.id);
}
