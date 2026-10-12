import dbRun from '../native/dbRun.js';
/** Переименование и/или перенос колоды в другой проект. */
export default function updateDeck(id, name, projectId) { return dbRun('UPDATE decks SET name=?,language_id=? WHERE id=?', [name, projectId, id]); }
