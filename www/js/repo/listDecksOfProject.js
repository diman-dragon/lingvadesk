import dbQuery from '../native/dbQuery.js';
/** n — карточек, due — пора повторить (уже изученные), fresh — новых. */
export default function listDecksOfProject(languageId) {
  return dbQuery(
    'SELECT d.id,d.name,d.kind,(SELECT COUNT(*) FROM cards c WHERE c.deck_id=d.id) n,' +
    '(SELECT COUNT(*) FROM cards c WHERE c.deck_id=d.id AND c.due>0 AND c.due<=?) due,' +
    '(SELECT COUNT(*) FROM cards c WHERE c.deck_id=d.id AND c.due=0) fresh FROM decks d WHERE d.language_id=? ORDER BY d.name',
    [Date.now(), languageId]);
}
