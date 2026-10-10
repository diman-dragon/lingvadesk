import dbRun from '../native/dbRun.js';
/** Перенос карточки в другую колоду (в конец). */
export default function moveCard(id, deckId, ord) { return dbRun('UPDATE cards SET deck_id=?,ord=? WHERE id=?', [deckId, ord, id]); }
