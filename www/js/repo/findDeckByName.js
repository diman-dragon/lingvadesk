import dbFirst from '../native/dbFirst.js';
export default function findDeckByName(projectId, name) {
  return dbFirst('SELECT id FROM decks WHERE language_id=? AND name=?', [projectId, name]);
}
