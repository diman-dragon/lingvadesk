import shuffle from '../util/shuffle.js';
import isIntro from './isIntro.js';
/**
 * Вопрос с выбором или вводом (настройка «Проверка») для проверки в «Интервальном повторении» и «Обучении».
 * null — обычный переворот (случайная колода, знакомство, нечего выбирать). Варианты — ответы других карточек области.
 */
export default function makeQuiz(session, card, dir, check) {
  if (check === 'flip' || session.mode === 'review' || isIntro(session)) return null;
  const text = c => (dir === 'fwd' ? c.back : c.front);
  const answer = text(card), base = { id: card.id, answer, result: null, hint: 0, typed: '' };
  if (check === 'type') return { ...base, kind: 'type' };
  const pool = [...new Set([...session.map.values()].filter(c => c.id !== card.id).map(text))].filter(t => t !== answer);
  if (!pool.length) return null;
  return { ...base, kind: 'choice', options: shuffle([answer, ...shuffle(pool).slice(0, 3)]), picked: null };
}
