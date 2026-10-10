import dbFirst from '../native/dbFirst.js';
export default function getDeckState(deckId, mode) {
  return dbFirst('SELECT pos,order_json FROM deck_state WHERE deck_id=? AND mode=?', [deckId, mode]);
}
