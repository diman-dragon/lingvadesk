import isNewCard from '../srs/isNewCard.js';
import { NO_LIMITS } from '../constants/NO_LIMITS.js';
/**
 * { order, plan } — очередь id и «план дня» (его начало). Лимиты не обрезают очередь: когда план выполнен, учёба продолжается без лимита.
 * srs — план: просроченные (давние первыми), затем новые не больше дневного лимита на каждую колоду, всё не больше размера сессии;
 * дальше — остальные просроченные и новые. listen / speak — давно не тренированные первыми, план — первые sessionMax.
 * cards — все карточки по порядку, без плана.
 */
export default function buildOrder(mode, cards, limits = NO_LIMITS) {
  const ids = list => list.map(c => c.id);
  if (mode === 'cards') return { order: ids(cards), plan: [] };
  if (mode !== 'srs') {
    const sorted = [...cards].sort((a, b) => a.ll - b.ll || a.ord - b.ord);
    return { order: ids(sorted), plan: ids(sorted.slice(0, limits.max)) };
  }
  const now = Date.now(), left = {};
  const due = cards.filter(c => c.due > 0 && c.due <= now).sort((a, b) => a.due - b.due || a.ord - b.ord);
  const fresh = cards.filter(isNewCard);
  // left[колода] — сколько новых ещё можно взять по плану; проверка с уменьшением
  const quota = fresh.filter(c => (left[c.deck_id] ??= Math.max(0, limits.perDay - (limits.used[c.deck_id] ?? 0))) > 0 && left[c.deck_id]--);
  const plan = ids([...due, ...quota].slice(0, limits.max)), inPlan = new Set(plan);
  return { order: [...plan, ...ids([...due, ...fresh].filter(c => !inPlan.has(c.id)))], plan };
}
