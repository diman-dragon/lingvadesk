import dbFirst from '../native/dbFirst.js';
export default function countAgain(cardId) {
  return dbFirst("SELECT COUNT(*) n FROM reviews WHERE card_id=? AND grade='again'", [cardId]).then(r => Number(r.n));
}
