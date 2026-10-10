import dbRun from '../native/dbRun.js';
export default function updateCardSrs(id, { interval, ease, reps, due }) {
  return dbRun('UPDATE cards SET interval=?,ease=?,reps=?,due=? WHERE id=?', [interval, ease, reps, due, id]);
}
