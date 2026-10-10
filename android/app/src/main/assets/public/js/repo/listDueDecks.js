import dbQuery from '../native/dbQuery.js';
export default function listDueDecks() {
  return dbQuery(
    'SELECT d.id,d.name,l.name cname,COUNT(c.id) due FROM cards c JOIN decks d ON d.id=c.deck_id ' +
    'JOIN languages l ON l.id=d.language_id WHERE c.due<=? GROUP BY d.id ORDER BY due DESC', [Date.now()]);
}
