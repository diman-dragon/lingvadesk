import dbRun from '../native/dbRun.js';
export default function insertDeck(languageId, name) {
  return dbRun('INSERT INTO decks(language_id,name,created) VALUES(?,?,?)', [languageId, name, Date.now()]);
}
