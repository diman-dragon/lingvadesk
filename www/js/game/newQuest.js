import { QUEST } from '../constants/QUEST.js';
import shuffle from '../util/shuffle.js';
/** Этап: выбор перевода из 4 (нечётные) или ввод перевода (чётные и последний — «босс»). */
const stage = (card, i, last, pool) => {
  const choice = i % 2 === 0 && i < last, others = shuffle(pool.filter(t => t !== card.back)).slice(0, QUEST.options - 1);
  return { id: card.id, prompt: card.front, answer: card.back, kind: choice && others.length ? 'choice' : 'type', options: choice ? shuffle([card.back, ...others]) : [] };
};
/**
 * Новый квест по карточкам области: маршрут из min(QUEST.stages, карточек) этапов без повторов; нужны минимум две карточки с разными переводами.
 * { kind:'quest', scope, stages[], i, lives, score, correct, wrong, marks[] ('ok'|'bad'), picked, typed, result, since, over, won, record }.
 */
export default function newQuest(cards, scope, now = Date.now()) {
  const pool = [...new Set(cards.map(c => c.back))];
  if (pool.length < 2) throw new Error('Для квеста нужно хотя бы две карточки с разными переводами');
  const picked = shuffle(cards).slice(0, QUEST.stages), last = picked.length - 1;
  return {
    kind: 'quest', scope, stages: picked.map((c, i) => stage(c, i, last, pool)), i: 0, lives: QUEST.lives, score: 0, correct: 0, wrong: 0, marks: [],
    picked: null, typed: '', result: null, since: now, startedAt: now, over: false, won: false, record: false
  };
}
