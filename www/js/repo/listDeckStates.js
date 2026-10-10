import dbQuery from '../native/dbQuery.js';
export default function listDeckStates(deckId) { return dbQuery('SELECT mode,pos FROM deck_state WHERE deck_id=?', [deckId]); }
