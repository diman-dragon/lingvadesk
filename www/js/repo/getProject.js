import dbFirst from '../native/dbFirst.js';
export default function getProject(id) { return dbFirst('SELECT * FROM languages WHERE id=?', [id]); }
