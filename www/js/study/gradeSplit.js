/** Сколько оценок каждого вида: { again, hard, good, easy }. */
export default function gradeSplit(rows) {
  const out = { again: 0, hard: 0, good: 0, easy: 0 };
  for (const r of rows) if (r.grade in out) out[r.grade]++;
  return out;
}
