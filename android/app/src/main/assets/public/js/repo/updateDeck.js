import dbRun from '../native/dbRun.js';
/** Переименование и/или перенос колоды в другой курс. */
export default function updateDeck(id, name, courseId) { return dbRun('UPDATE decks SET name=?,language_id=? WHERE id=?', [name, courseId, id]); }
