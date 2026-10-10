import dbBatch from '../native/dbBatch.js';
export default function resetProgress() {
  return dbBatch([
    { sql: 'UPDATE cards SET due=0,interval=0,reps=0,ease=2.5', params: [] },
    { sql: 'DELETE FROM deck_state', params: [] }
  ]);
}
