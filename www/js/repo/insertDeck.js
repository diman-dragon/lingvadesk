import dbRun from '../native/dbRun.js';
/** kind: 'cards' (обычная колода) | 'dialog' (сцена диалога). */
export default function insertDeck(languageId, name, kind = 'cards') {
  return dbRun('INSERT INTO decks(language_id,name,created,kind) VALUES(?,?,?,?)', [languageId, name, Date.now(), kind]);
}
