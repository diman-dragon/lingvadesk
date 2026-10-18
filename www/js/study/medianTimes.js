import median from '../util/median.js';
/** Медианное время (секунды) на вспоминание и на ответ по повторениям с переворотом; null — данных нет. */
export default function medianTimes(rows) {
  const pick = f => rows.filter(r => r[f] !== null && r[f] !== undefined).map(r => Number(r[f]));
  const sec = list => (list.length ? Math.round(median(list) / 100) / 10 : null);
  return { think: sec(pick('think')), look: sec(pick('look')) };
}
