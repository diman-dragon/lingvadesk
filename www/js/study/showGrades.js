import studyControls from '../views/studyControls.js';
/** Заменяет кнопки под карточкой на оценки (без перерисовки — не ломаем анимацию переворота). */
export default function showGrades(session) {
  document.getElementById('controls').innerHTML = studyControls(session, true);
}
