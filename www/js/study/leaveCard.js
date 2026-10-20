import currentCard from './currentCard.js';
import trackSignals from './trackSignals.js';
import inferGrade from '../srs/inferGrade.js';
import gradeCard from './gradeCard.js';
import cyclePos from './cyclePos.js';
/**
 * Уход с карточки. В режиме «Карточки» просто листаем, ничего не оцениваем. Вперёд (свайп влево / ›) — по поведению (или по ответу на вопрос) выводим оценку и записываем её;
 * назад — просто листаем. В историю время на ответе пишем только для переворота: при выборе / вводе это чтение ответа, а не вспоминание.
 */
export default async function leaveCard(session, dir) {
  const card = currentCard(session);
  const sig = dir > 0 && card && session.mode !== 'cards' ? trackSignals() : null;
  const grade = sig ? inferGrade(sig, card, session.calib) : null;
  if (!grade) return cyclePos(session, dir);
  return gradeCard(session, grade, sig.kind ? { think: sig.think, hinted: sig.hinted, plays: sig.plays } : sig);
}
