import { state } from '../state/appState.js';
import answerQuest from './answerQuest.js';
import insertReview from '../repo/insertReview.js';
import markStudied from '../study/markStudied.js';
import buzz from '../dom/buzz.js';
import render from '../nav/render.js';
/** Ответ в квесте (ok; extra — picked / typed): запись результата, история (mode 'game'), вибрация, перерисовка с верным ответом и «Дальше». */
export default async function submitQuest(ok, extra = {}) {
  const q = state.quest;
  if (!q || q.over || q.result) return;
  const r = answerQuest(q, ok);
  Object.assign(q, extra);
  markStudied();
  buzz(ok ? 12 : [30, 40, 30]);
  await insertReview(q.stages[q.i].id, ok ? 'good' : 'again', { think: r.ms }, 0, 'game');
  await render();
}
