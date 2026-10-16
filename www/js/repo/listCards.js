import dbQuery from '../native/dbQuery.js';
/** agains — сколько раз карточка получала «снова» (по истории): 5 и больше — «пиявка». */
export default function listCards(deckId) {
  return dbQuery("SELECT c.*,(SELECT COUNT(*) FROM reviews r WHERE r.card_id=c.id AND r.grade='again') agains FROM cards c WHERE c.deck_id=? ORDER BY c.ord,c.id", [deckId]);
}
