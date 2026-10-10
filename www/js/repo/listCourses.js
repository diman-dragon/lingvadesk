import dbQuery from '../native/dbQuery.js';
const DUE = 'SELECT COUNT(*) FROM cards c JOIN decks d ON d.id=c.deck_id WHERE d.language_id=l.id AND c.due<=?';
/** n — колод, due — карточек к повторению. */
export default function listCourses() {
  return dbQuery(`SELECT l.id,l.name,(SELECT COUNT(*) FROM decks d WHERE d.language_id=l.id) n,(${DUE}) due FROM languages l ORDER BY l.name`, [Date.now()]);
}
