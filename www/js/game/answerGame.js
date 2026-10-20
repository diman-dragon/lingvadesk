import { state } from '../state/appState.js';
import { GAME } from '../constants/GAME.js';
import answerQuestion from './answerQuestion.js';
import nextQuestion from './nextQuestion.js';
import finishGame from './finishGame.js';
import insertReview from '../repo/insertReview.js';
import markStudied from '../study/markStudied.js';
import buzz from '../dom/buzz.js';
import render from '../nav/render.js';
/** Выбран вариант: подсветка верного / неверного, запись в историю (mode 'game'), короткая пауза, следующий вопрос или конец игры. */
export default async function answerGame(index) {
  const g = state.game;
  if (!g || g.over || g.q.picked !== null) return;
  const q = g.q, r = answerQuestion(g, index);
  markStudied();
  buzz(r.ok ? 12 : [30, 40, 30]);
  await insertReview(q.id, r.ok ? 'good' : 'again', { think: r.ms }, 0, 'game');
  await render();
  await new Promise(done => setTimeout(done, GAME.pause));
  if (state.game !== g || g.saved) return;
  if (g.lives <= 0 || Date.now() >= g.endsAt) await finishGame(); else nextQuestion(g);
  await render();
}
