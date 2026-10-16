import dbFirst from '../native/dbFirst.js';
import scopeClause from './scopeClause.js';
/** total — всего, due — пора повторить (уже изучали), fresh — новых, mature — выученных (интервал ≥ 21 дня). */
export default function getScopeStats(scope) {
  const { where, params } = scopeClause(scope);
  return dbFirst(
    'SELECT COUNT(*) total,COALESCE(SUM(c.due>0 AND c.due<=?),0) due,COALESCE(SUM(c.interval>=21),0) mature,' +
    'COALESCE(SUM(c.reps=0 AND c.interval=0 AND c.due=0),0) fresh FROM cards c JOIN decks d ON d.id=c.deck_id ' +
    `WHERE ${where}`, [Date.now(), ...params]);
}
