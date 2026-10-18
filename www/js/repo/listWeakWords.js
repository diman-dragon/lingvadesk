import dbQuery from '../native/dbQuery.js';
/** Слова с самой низкой средней оценкой произношения с момента since: { front, s — средняя оценка, n — попыток }. */
export default function listWeakWords(since, limit) {
  return dbQuery('SELECT c.front,AVG(p.score) s,COUNT(*) n FROM pronunciations p JOIN cards c ON c.id=p.card_id WHERE p.ts>=? GROUP BY c.id ORDER BY s ASC,n DESC LIMIT ' + (Number(limit) | 0), [since]);
}
