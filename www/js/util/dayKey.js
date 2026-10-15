/** Местная дата 'ГГГГ-ММ-ДД'; offset — сдвиг в днях (−1 — вчера). */
export default function dayKey(offset = 0, now = Date.now()) {
  const d = new Date(now);
  d.setDate(d.getDate() + offset);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n, i) => String(n).padStart(i ? 2 : 4, '0')).join('-');
}
