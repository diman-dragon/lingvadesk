import dbFirst from '../native/dbFirst.js';
/** Лучший результат игры за всё время (0 — игр не было). kind: 'blitz' (по умолчанию) или 'quest' (в games.scope у квеста префикс «quest:»). */
export default function bestScore(kind = 'blitz') {
  const op = kind === 'quest' ? 'LIKE' : 'NOT LIKE';
  return dbFirst(`SELECT COALESCE(MAX(score),0) n FROM games WHERE scope ${op} 'quest:%'`).then(r => Number(r.n));
}
