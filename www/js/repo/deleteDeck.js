import dbRun from '../native/dbRun.js';
export default function deleteDeck(id) { return dbRun('DELETE FROM decks WHERE id=?', [id]); }
