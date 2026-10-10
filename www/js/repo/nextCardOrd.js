import dbFirst from '../native/dbFirst.js';
export default function nextCardOrd(deckId) {
  return dbFirst('SELECT COALESCE(MAX(ord),-1)+1 n FROM cards WHERE deck_id=?', [deckId]).then(r => r.n);
}
