import isNewCard from '../srs/isNewCard.js';
import { NO_LIMITS } from '../constants/NO_LIMITS.js';
/**
 * Очередь id.
 * srs — просроченные (самые давние первыми), затем новые: в каждой колоде не больше дневного лимита; всё не больше размера сессии.
 * listen / speak — карточки, которые тренировали давно (или ни разу) в этом режиме, первыми; не больше размера сессии.
 */
export default function buildOrder(mode, cards, limits = NO_LIMITS) {
  const ids = list => list.map(c => c.id);
  if (mode !== 'srs') return ids([...cards].sort((a, b) => a.ll - b.ll || a.ord - b.ord).slice(0, limits.max));
  const now = Date.now(), left = {};
  const due = cards.filter(c => c.due > 0 && c.due <= now).sort((a, b) => a.due - b.due || a.ord - b.ord);
  // left[колода] — сколько новых ещё можно взять; проверка с уменьшением
  const fresh = cards.filter(isNewCard).filter(c => (left[c.deck_id] ??= Math.max(0, limits.perDay - (limits.used[c.deck_id] ?? 0))) > 0 && left[c.deck_id]--);
  return ids([...due, ...fresh].slice(0, limits.max));
}
