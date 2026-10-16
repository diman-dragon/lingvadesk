/**
 * Интервал (дни) для оценок hard | good | easy.
 * reps = 0 и interval > 0 — «переучивание» после «Снова»: возвращаемся к сохранённой части прежнего интервала.
 */
export default function nextInterval({ interval, ease, reps }, grade) {
  if (reps === 0 && interval > 0) return grade === 'hard' ? Math.max(1, Math.round(interval * 0.6)) : grade === 'easy' ? Math.round(interval * 1.3) + 1 : interval;
  if (reps === 0) return grade === 'easy' ? 4 : 1;
  if (reps === 1) return Math.max(interval + 1, grade === 'hard' ? 3 : grade === 'easy' ? 8 : 6);
  const m = grade === 'hard' ? 1.2 : grade === 'good' ? ease : ease * 1.3;
  return Math.max(interval + 1, Math.round(interval * m));
}
