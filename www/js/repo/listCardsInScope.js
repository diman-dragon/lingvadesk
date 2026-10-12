import dbQuery from '../native/dbQuery.js';
import scopeClause from './scopeClause.js';
/** Карточки области; tts — голос проекта, pname/dname — для подписей. Порядок: проект, колода, ord. */
export default function listCardsInScope(scope) {
  const { where, params } = scopeClause(scope);
  return dbQuery(
    'SELECT c.*,l.tts tts,l.name pname,d.name dname FROM cards c JOIN decks d ON d.id=c.deck_id ' +
    `JOIN languages l ON l.id=d.language_id WHERE ${where} ORDER BY l.name,d.id,c.ord,c.id`, params);
}
