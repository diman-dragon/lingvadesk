import dayKey from '../util/dayKey.js';
/** Повторения по дням за последние days дней (старые → новые): [{ label: 'ДД', n, today }]. rows — [{ ts }]. */
export default function dayBars(rows, days = 14, now = Date.now()) {
  const keys = Array.from({ length: days }, (_, i) => dayKey(i - days + 1, now));
  const count = Object.fromEntries(keys.map(k => [k, 0]));
  for (const r of rows) { const k = dayKey(0, Number(r.ts)); if (k in count) count[k]++; }
  return keys.map((k, i) => ({ label: k.slice(8), n: count[k], today: i === days - 1 }));
}
