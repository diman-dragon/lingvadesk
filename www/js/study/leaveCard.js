import currentCard from './currentCard.js';
import isIntro from './isIntro.js';
import trackSignals from './trackSignals.js';
import inferGrade from '../srs/inferGrade.js';
import gradeCard from './gradeCard.js';
import cyclePos from './cyclePos.js';
/**
 * Уход с карточки. Вперёд (свайп влево / ›) — по поведению выводим оценку и обновляем расписание (в «Случайной колоде»
 * и знакомстве расписание не трогаем); назад — просто листаем.
 */
export default async function leaveCard(session, dir) {
  const card = currentCard(session);
  const graded = dir > 0 && card && session.mode !== 'review' && !isIntro(session);
  const grade = graded ? inferGrade(trackSignals(), card) : null;
  return grade ? gradeCard(session, grade) : cyclePos(session, dir);
}
