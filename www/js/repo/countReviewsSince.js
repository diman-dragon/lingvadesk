import dbFirst from '../native/dbFirst.js';
/** Сколько повторений (всех режимов) с момента since (мс); 0 — за всё время. */
export default function countReviewsSince(since = 0) {
  return dbFirst('SELECT COUNT(*) n FROM reviews WHERE ts>=?', [since]).then(r => Number(r.n));
}
