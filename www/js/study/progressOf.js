/** { pct, text } для полосы прогресса. */
export default function progressOf(s) {
  const n = s.order.length;
  return { pct: (s.total - n) / s.total * 100, text: `Осталось ${n} из ${s.total}` };
}
