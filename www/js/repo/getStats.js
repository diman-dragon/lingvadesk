import dbFirst from '../native/dbFirst.js';
/** total — всего, due — к повторению, mature — выученных (интервал ≥ 21 дня). */
export default function getStats() {
  return dbFirst('SELECT COUNT(*) total,COALESCE(SUM(due<=?),0) due,COALESCE(SUM(interval>=21),0) mature FROM cards', [Date.now()]);
}
