import dbFirst from '../native/dbFirst.js';
export default function getCourse(id) { return dbFirst('SELECT * FROM languages WHERE id=?', [id]); }
