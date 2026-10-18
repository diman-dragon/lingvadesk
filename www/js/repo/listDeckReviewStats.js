import dbQuery from '../native/dbQuery.js';
/** Повторения (интервальные) с момента since по колодам: { n — всего, ok — без «снова» }. */
export default function listDeckReviewStats(since) {
  return dbQuery("SELECT c.deck_id id,COUNT(*) n,SUM(r.grade<>'again') ok FROM reviews r JOIN cards c ON c.id=r.card_id WHERE r.mode='srs' AND r.ts>=? GROUP BY c.deck_id", [since]);
}
