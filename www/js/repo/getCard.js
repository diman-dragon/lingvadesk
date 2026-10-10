import dbFirst from '../native/dbFirst.js';
export default function getCard(id) { return dbFirst('SELECT * FROM cards WHERE id=?', [id]); }
