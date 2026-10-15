import { BEHAVIOR } from '../constants/BEHAVIOR.js';
const B = BEHAVIOR;
const level = (v, [a, b]) => +(v >= a) + +(v >= b);
/**
 * Оценка по поведению. null — карточку просто пролистали или отвлеклись: расписание не трогаем.
 * Без переворота: ушёл быстро — знает (good, у зрелых easy), долго мялся — hard.
 * С переворотом «трудность» набирается из: долго вспоминал, долго читал ответ, метался туда-обратно,
 * возвращался свайпом назад, перевернул не вспоминая и читал ответ. 0 — лёгкая, 1 — хорошо, 2 — трудно, 3+ — снова.
 */
export default function inferGrade({ think, look, dwell, flips, revisit, away }, card) {
  if (away || dwell < B.noise) return null;
  if (think === null) return dwell >= B.think[1] ? 'hard' : dwell < B.known && card.reps >= 2 ? 'easy' : 'good';
  const d = level(think, B.think) + level(look, B.look) + +(flips >= B.flips) + +revisit + +(think < B.reflex && look >= B.readAnswer);
  if (d >= 3) return 'again';
  if (d === 2) return 'hard';
  return d === 0 && think >= B.reflex && think < B.easyMax && look < B.easyMax ? 'easy' : 'good';
}
