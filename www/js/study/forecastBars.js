import dayKey from '../util/dayKey.js';
/** Сколько карточек придёт на повторение в ближайшие days дней (просроченные — в «сегодня»): [{ label: 'ДД', n, today }]. dues — [{ due }]. */
export default function forecastBars(dues, days = 7, now = Date.now()) {
  const keys = Array.from({ length: days }, (_, i) => dayKey(i, now));
  const count = Object.fromEntries(keys.map(k => [k, 0]));
  for (const r of dues) { const k = dayKey(0, Number(r.due)); count[k < keys[0] ? keys[0] : k]++; }
  return keys.map((k, i) => ({ label: k.slice(8), n: count[k] ?? 0, today: i === 0 }));
}
