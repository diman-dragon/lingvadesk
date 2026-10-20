import { state } from '../state/appState.js';
import { GAME } from '../constants/GAME.js';
import finishGame from './finishGame.js';
import stopGameTimer from './stopGameTimer.js';
import render from '../nav/render.js';
/** Шаг таймера (каждые 100 мс): полоса и секунды в DOM без перерисовки; время вышло — конец игры. Ушли с экрана игры — таймер останавливается. */
export default async function tickGame() {
  const g = state.game, bar = document.getElementById('gtime');
  if (!g || g.over || state.nav.v !== 'game' || !bar) return stopGameTimer();
  const left = Math.max(0, g.endsAt - Date.now());
  bar.style.width = `${left / (GAME.seconds * 10)}%`;
  document.getElementById('gsec').textContent = Math.ceil(left / 1000);
  if (left > 0 || g.q.picked !== null) return;
  await finishGame();
  await render();
}
