import dbFirst from '../native/dbFirst.js';
/** Колода + cname (имя языка) + tts. */
export default function getDeckWithCourse(id) {
  return dbFirst('SELECT d.*,l.name cname,l.tts FROM decks d JOIN languages l ON l.id=d.language_id WHERE d.id=?', [id]);
}
