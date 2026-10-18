import dbQuery from '../native/dbQuery.js';
/** Сколько разных новых карточек начато с момента since (мс) — по каждой колоде: { id колоды: число }. Дневной лимит новых считается на колоду. */
export default async function countNewByDeck(since) {
  const rows = await dbQuery("SELECT c.deck_id d, COUNT(DISTINCT r.card_id) n FROM reviews r JOIN cards c ON c.id=r.card_id WHERE r.fresh=1 AND r.mode='srs' AND r.ts>=? GROUP BY c.deck_id", [since]);
  return Object.fromEntries(rows.map(r => [r.d, Number(r.n)]));
}
