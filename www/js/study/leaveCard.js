import currentCard from './currentCard.js';
import isIntro from './isIntro.js';
import trackSignals from './trackSignals.js';
import inferGrade from '../srs/inferGrade.js';
import gradeCard from './gradeCard.js';
import cyclePos from './cyclePos.js';
/**
 * Уход с карточки. Вперёд (свайп влево / ›) — по поведению (или по ответу на вопрос) выводим оценку и обновляем расписание
 * (в «Случайной колоде» и знакомстве расписание не трогаем); назад — просто листаем.
 * В историю время на ответе пишем только для переворота: при выборе / вводе это чтение ответа, а не вспоминание.
 */
export default async function leaveCard(session, dir) {
  const card = currentCard(session);
  const sig = dir > 0 && card && session.mode !== 'review' && !isIntro(session) ? trackSignals() : null;
  const grade = sig ? inferGrade(sig, card, session.calib) : null;
  return grade ? gradeCard(session, grade, sig.kind ? { think: sig.think } : sig) : cyclePos(session, dir);
}
