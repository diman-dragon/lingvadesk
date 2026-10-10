import dbRun from '../native/dbRun.js';
export default function saveDeckState(deckId, mode, pos, orderJson) {
  return dbRun('INSERT OR REPLACE INTO deck_state(deck_id,mode,pos,order_json) VALUES(?,?,?,?)', [deckId, mode, pos, orderJson]);
}
