/** Интервал (дни) для оценок hard | good | easy. */
export default function nextInterval({ interval, ease, reps }, grade) {
  if (reps === 0) return grade === 'easy' ? 4 : 1;
  if (reps === 1) return grade === 'hard' ? 3 : grade === 'easy' ? 8 : 6;
  const m = grade === 'hard' ? 1.2 : grade === 'good' ? ease : ease * 1.3;
  return Math.max(interval + 1, Math.round(interval * m));
}
