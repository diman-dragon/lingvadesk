import { state } from '../state/appState.js';
import bestScore from '../repo/bestScore.js';
import insertGame from '../repo/insertGame.js';
import stopGameTimer from './stopGameTimer.js';
/** Конец игры (время или жизни): результат пишется в базу; рекорд — если побит прежний. Повторный вызов ничего не делает. */
export default async function finishGame(now = Date.now()) {
  const g = state.game;
  if (!g || g.saved) return;
  g.saved = true;
  g.over = true;
  stopGameTimer();
  g.seconds = (Math.min(now, g.endsAt) - g.startedAt) / 1000;
  g.record = g.score > 0 && g.score > await bestScore();
  await insertGame(g);
}
