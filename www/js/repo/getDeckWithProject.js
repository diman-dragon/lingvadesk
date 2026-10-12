import dbFirst from '../native/dbFirst.js';
/** Колода + pname (имя языка) + tts. */
export default function getDeckWithProject(id) {
  return dbFirst('SELECT d.*,l.name pname,l.tts FROM decks d JOIN languages l ON l.id=d.language_id WHERE d.id=?', [id]);
}
