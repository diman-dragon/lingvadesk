import dayKey from '../util/dayKey.js';
import { DAY_MS } from '../constants/DAY_MS.js';
const num = k => { const [y, m, d] = k.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / DAY_MS); };
/**
 * Серии дней с повторениями. quarters — номера 15-минутных отрезков (ts / 900000) из истории.
 * current — идёт сейчас (последний день — сегодня или вчера), best — лучшая за всё время.
 */
export default function streaks(quarters, now = Date.now()) {
  const days = [...new Set(quarters.map(q => num(dayKey(0, q * 900000))))].sort((a, b) => a - b);
  const set = new Set(days), today = num(dayKey(0, now));
  let current = 0, best = 0, run = 0;
  for (let d = set.has(today) ? today : today - 1; set.has(d); d--) current++;
  days.forEach((d, i) => { run = i && d === days[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); });
  return { current, best };
}
