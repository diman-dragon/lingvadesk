import { state } from '../state/appState.js';
import finishQuest from '../game/finishQuest.js';
import render from '../nav/render.js';
/** «Дальше» после ответа: следующий этап или (маршрут пройден / нет жизней) итог квеста. */
export default async function questNext() {
  const q = state.quest;
  if (!q || q.over || !q.result) return;
  if (q.lives <= 0 || q.i + 1 >= q.stages.length) await finishQuest();
  else Object.assign(q, { i: q.i + 1, picked: null, typed: '', result: null, since: Date.now() });
  await render();
}
