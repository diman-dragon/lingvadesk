import currentCard from './currentCard.js';
import studyControls from '../views/studyControls.js';
/** Заменяет кнопки под карточкой на оценки (без перерисовки — не ломаем анимацию). */
export default function showGrades(session) {
  document.getElementById('controls').innerHTML = studyControls(true, currentCard(session));
}
