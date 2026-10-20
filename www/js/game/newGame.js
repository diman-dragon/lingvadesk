import { GAME } from '../constants/GAME.js';
import shuffle from '../util/shuffle.js';
/**
 * Новая игра по карточкам: { scope, deck[] (перемешанные), i, q, score, lives, combo, bestCombo, correct, wrong, startedAt, endsAt, over, record }.
 * Нужно минимум две карточки с разными ответами.
 */
export default function newGame(cards, scope, now = Date.now()) {
  if (new Set(cards.map(c => c.back)).size < 2) throw new Error('Для игры нужно хотя бы две карточки с разными переводами');
  return {
    scope, deck: shuffle([...cards]), i: 0, q: null, score: 0, lives: GAME.lives, combo: 0, bestCombo: 0,
    correct: 0, wrong: 0, startedAt: now, endsAt: now + GAME.seconds * 1000, over: false, record: false
  };
}
