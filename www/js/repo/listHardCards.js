import dbQuery from '../native/dbQuery.js';
/** Самые трудные карточки: больше всего «снова» (n). */
export default function listHardCards(limit) {
  return dbQuery("SELECT c.front,c.back,d.name dname,COUNT(*) n FROM reviews r JOIN cards c ON c.id=r.card_id JOIN decks d ON d.id=c.deck_id WHERE r.grade='again' AND r.mode='srs' GROUP BY c.id ORDER BY n DESC,c.id LIMIT " + (Number(limit) | 0));
}
