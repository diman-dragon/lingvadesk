import dbQuery from '../native/dbQuery.js';
/** Все колоды с именем курса — для выбора при переносе карточки. */
export default function listDecksFlat() {
  return dbQuery('SELECT d.id,d.name,l.name cname FROM decks d JOIN languages l ON l.id=d.language_id ORDER BY l.name,d.name');
}
