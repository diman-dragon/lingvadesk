import { GAME } from '../constants/GAME.js';
/**
 * Ответ index на текущий вопрос. Верно: очки = base × комбо (до comboMax) + бонус за быстрый ответ, комбо растёт.
 * Неверно: минус жизнь, комбо сбрасывается (конец игры при lives ≤ 0 оформляет game/answerGame). → { ok, gained, ms }.
 */
export default function answerQuestion(game, index, now = Date.now()) {
  const q = game.q, ms = now - q.since, ok = q.options[index] === q.answer;
  q.picked = index;
  let gained = 0;
  if (ok) {
    game.combo++;
    gained = GAME.base * Math.min(game.combo, GAME.comboMax) + (ms < GAME.fastMs ? GAME.fastBonus : 0);
    Object.assign(game, { score: game.score + gained, correct: game.correct + 1, bestCombo: Math.max(game.bestCombo, game.combo) });
  } else {
    Object.assign(game, { combo: 0, lives: game.lives - 1, wrong: game.wrong + 1 });
  }
  return { ok, gained, ms };
}
