import { GAME } from '../constants/GAME.js';
import shuffle from '../util/shuffle.js';
/**
 * Следующий вопрос: карточка по кругу колоды, направление случайное (слово → перевод или наоборот), 3 неверных варианта из других карточек.
 * game.q = { id, prompt, answer, options[], picked, since }.
 */
export default function nextQuestion(game, now = Date.now()) {
  const card = game.deck[game.i++ % game.deck.length], fwd = Math.random() < 0.5;
  const text = c => (fwd ? c.back : c.front), prompt = fwd ? card.front : card.back, answer = text(card);
  const pool = [...new Set(game.deck.map(text))].filter(t => t !== answer);
  game.q = { id: card.id, prompt, answer, options: shuffle([answer, ...shuffle(pool).slice(0, GAME.options - 1)]), picked: null, since: now };
  return game.q;
}
