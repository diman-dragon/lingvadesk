import dbQuery from '../native/dbQuery.js';
/** n — карточек, due — к повторению. */
export default function listDecksOfProject(languageId) {
  return dbQuery(
    'SELECT d.id,d.name,(SELECT COUNT(*) FROM cards c WHERE c.deck_id=d.id) n,' +
    '(SELECT COUNT(*) FROM cards c WHERE c.deck_id=d.id AND c.due>0 AND c.due<=?) due FROM decks d WHERE d.language_id=? ORDER BY d.name',
    [Date.now(), languageId]);
}
