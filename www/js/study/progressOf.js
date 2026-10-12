import isIntro from './isIntro.js';
/** { pct, text } для полосы прогресса. */
export default function progressOf(s) {
  const n = s.order.length;
  if (isIntro(s)) return { pct: (s.pos + 1) / n * 100, text: `Знакомство · ${s.pos + 1} / ${n}` };
  if (s.mode === 'review') return { pct: (s.pos + 1) / n * 100, text: `${s.pos + 1} / ${n}` };
  return { pct: (s.total - n) / s.total * 100, text: `Осталось ${n} из ${s.total}` };
}
