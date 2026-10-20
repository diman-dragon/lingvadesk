/** { pct, text } для полосы прогресса. «Карточки» — номер по кругу; иначе осталось и план дня (после него — «✓ план выполнен», учёба идёт дальше). */
export default function progressOf(s) {
  const n = s.order.length;
  if (s.mode === 'cards') return { pct: (s.pos + 1) / n * 100, text: `Карточка ${s.pos + 1} из ${n}` };
  const plan = !s.planTotal ? '' : s.plan.size ? ` · по плану ${s.plan.size}` : ' · ✓ план выполнен';
  return { pct: (s.total - n) / s.total * 100, text: `Осталось ${n} из ${s.total}${plan}` };
}
