import dbQuery from '../native/dbQuery.js';
/** Все колоды с названием проекта (для выбора области учёбы и переноса карточек). */
export default function listAllDecks() {
  return dbQuery('SELECT d.id,d.name,d.kind,d.language_id project_id,l.name pname FROM decks d JOIN languages l ON l.id=d.language_id ORDER BY l.name,d.name');
}
