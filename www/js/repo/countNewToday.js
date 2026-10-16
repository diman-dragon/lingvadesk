import dbFirst from '../native/dbFirst.js';
/** Сколько разных новых карточек уже начато с момента since (мс). */
export default function countNewToday(since) {
  return dbFirst('SELECT COUNT(DISTINCT card_id) n FROM reviews WHERE fresh=1 AND ts>=?', [since]).then(r => Number(r.n));
}
