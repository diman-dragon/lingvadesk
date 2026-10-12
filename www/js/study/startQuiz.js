import saveState from './saveState.js';
/** «Обучение»: конец знакомства → проверка тех же карточек. */
export default async function startQuiz(session) {
  session.phase = 'quiz';
  session.pos = 0;
  session.total = session.order.length;
  await saveState(session);
}
