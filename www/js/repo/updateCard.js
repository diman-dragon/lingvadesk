import dbRun from '../native/dbRun.js';
export default function updateCard(id, { front, back, example, exampleTr, speaker = 0 }) {
  return dbRun('UPDATE cards SET front=?,back=?,example=?,example_tr=?,speaker=? WHERE id=?', [front, back, example || null, exampleTr || null, speaker, id]);
}
