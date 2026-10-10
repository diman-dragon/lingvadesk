import { DAY_MS } from '../constants/DAY_MS.js';
import { AGAIN_MS } from '../constants/AGAIN_MS.js';
import nextInterval from './nextInterval.js';
import nextEase from './nextEase.js';
/** Упрощённый SM-2: again → через 10 минут, остальное — через N дней. due — мс. */
export default function nextSrs(card, grade, now = Date.now()) {
  const ease = nextEase(card.ease, grade);
  if (grade === 'again') return { ease, interval: 0, reps: 0, due: now + AGAIN_MS };
  const interval = nextInterval(card, grade);
  return { ease, interval, reps: card.reps + 1, due: now + interval * DAY_MS };
}
