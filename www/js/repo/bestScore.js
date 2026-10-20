import dbFirst from '../native/dbFirst.js';
/** Лучший результат игры за всё время (0 — игр не было). */
export default function bestScore() {
  return dbFirst('SELECT COALESCE(MAX(score),0) n FROM games').then(r => Number(r.n));
}
