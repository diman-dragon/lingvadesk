const count = (line, d) => { let n = 0, q = false; for (const ch of line) { if (ch === '"') q = !q; else if (ch === d && !q) n++; } return n; };
/** Разделитель (кавычки учитываются) таблицы по первым строкам: табуляция, «;», «|», «,» — тот, что даёт одинаковое число ≥ 2 столбцов; null — это не таблица. */
export default function detectDelimiter(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#')).slice(0, 20);
  if (!lines.length) return null;
  const score = d => {
    const counts = lines.map(l => count(l, d));
    const first = counts[0];
    return first >= 1 ? counts.filter(c => c === first).length / lines.length : 0;
  };
  const best = ['\t', ';', '|', ','].map(d => [d, score(d)]).sort((a, b) => b[1] - a[1])[0];
  return best[1] >= 0.8 ? best[0] : null;
}
