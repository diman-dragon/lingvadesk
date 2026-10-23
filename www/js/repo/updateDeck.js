import dbRun from '../native/dbRun.js';
/** Переименование, перенос колоды в другой проект и/или смена типа ('cards' | 'dialog'). */
export default function updateDeck(id, name, projectId, kind = 'cards') { return dbRun('UPDATE decks SET name=?,language_id=?,kind=? WHERE id=?', [name, projectId, kind, id]); }
