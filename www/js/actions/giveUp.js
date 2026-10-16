import { state } from '../state/appState.js';
import finishQuiz from '../study/finishQuiz.js';
/** «Не знаю»: показываем ответ, карточка вернётся («снова»). */
export default function giveUp() {
  const q = state.quiz;
  if (!q || q.result) return;
  return finishQuiz(false);
}
