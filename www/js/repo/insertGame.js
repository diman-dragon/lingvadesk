import dbRun from '../native/dbRun.js';
/** Результат игры: очки, верные / ошибочные ответы, лучший комбо, длительность (с). Квест (g.kind === 'quest') пишется с префиксом «quest:» в области. */
export default function insertGame(g, ts = Date.now()) {
  const scope = g.kind === 'quest' ? `quest:${g.scope}` : g.scope;
  return dbRun('INSERT INTO games(ts,scope,score,correct,wrong,best_combo,seconds) VALUES(?,?,?,?,?,?,?)',
    [ts, scope, g.score, g.correct, g.wrong, g.bestCombo ?? 0, Math.round(g.seconds ?? 0)]);
}
