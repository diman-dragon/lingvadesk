import dbQuery from '../native/dbQuery.js';
export default function listCards(deckId) { return dbQuery('SELECT * FROM cards WHERE deck_id=? ORDER BY ord,id', [deckId]); }
