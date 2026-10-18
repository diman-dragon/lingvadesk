import shuffle from '../util/shuffle.js';
/**
 * Вопрос с выбором или вводом (настройка «Проверка»); null — обычный переворот или нечего выбирать.
 * Варианты — ответы других карточек области. dir — какая сторона отвечает: 'fwd' — перевод, 'rev' — слово.
 */
export default function makeQuiz(session, card, dir, check) {
  if (check === 'flip') return null;
  const text = c => (dir === 'fwd' ? c.back : c.front);
  const answer = text(card), base = { id: card.id, answer, result: null, hint: 0, typed: '' };
  if (check === 'type') return { ...base, kind: 'type' };
  const pool = [...new Set([...session.map.values()].filter(c => c.id !== card.id).map(text))].filter(t => t !== answer);
  if (!pool.length) return null;
  return { ...base, kind: 'choice', options: shuffle([answer, ...shuffle(pool).slice(0, 3)]), picked: null };
}
