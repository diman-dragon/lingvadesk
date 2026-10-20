import dbQuery from '../native/dbQuery.js';
const CARDS = 'SELECT COUNT(*) FROM cards c JOIN decks d ON d.id=c.deck_id WHERE d.language_id=l.id';
/** n — колод, cards — карточек, due — пора повторить (уже изученные), fresh — новых. */
export default function listProjects() {
  return dbQuery(
    `SELECT l.id,l.name,l.tts,(SELECT COUNT(*) FROM decks d WHERE d.language_id=l.id) n,(${CARDS}) cards,` +
    `(${CARDS} AND c.due>0 AND c.due<=?) due,(${CARDS} AND c.due=0) fresh FROM languages l ORDER BY l.name`, [Date.now()]);
}
