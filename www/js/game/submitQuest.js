import { state } from '../state/appState.js';
import answerQuest from './answerQuest.js';
import insertReview from '../repo/insertReview.js';
import markStudied from '../study/markStudied.js';
import buzz from '../dom/buzz.js';
import walkHero from '../dom/walkHero.js';
import render from '../nav/render.js';
/** Ответ в квесте (ok; extra — picked / typed): запись результата, история (mode 'game'), вибрация, перерисовка с верным ответом и «Дальше»; герой идёт к следующему узлу тропинки. */
export default async function submitQuest(ok, extra = {}) {
  const q = state.quest;
  if (!q || q.over || q.result) return;
  const r = answerQuest(q, ok);
  Object.assign(q, extra, { walking: true });
  markStudied();
  buzz(ok ? 12 : [30, 40, 30]);
  await insertReview(q.stages[q.i].id, ok ? 'good' : 'again', { think: r.ms }, 0, 'game');
  await render();
  walkHero();
}
