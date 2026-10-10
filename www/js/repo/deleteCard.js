import dbRun from '../native/dbRun.js';
export default function deleteCard(id) { return dbRun('DELETE FROM cards WHERE id=?', [id]); }
