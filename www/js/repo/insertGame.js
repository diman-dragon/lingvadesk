import dbRun from '../native/dbRun.js';
/** Результат игры: очки, верные / ошибочные ответы, лучший комбо, длительность (с). */
export default function insertGame(g, ts = Date.now()) {
  return dbRun('INSERT INTO games(ts,scope,score,correct,wrong,best_combo,seconds) VALUES(?,?,?,?,?,?,?)',
    [ts, g.scope, g.score, g.correct, g.wrong, g.bestCombo, Math.round(g.seconds ?? 0)]);
}
