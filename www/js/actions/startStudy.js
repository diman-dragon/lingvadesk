import { state } from '../state/appState.js';
import openStudy from '../study/openStudy.js';
import openGame from '../game/openGame.js';
import openQuest from '../game/openQuest.js';
/** Из экрана колод режима: mode — режим ('blitz' / 'quest' — игры), scope — 'all' | 'd:<id>'. */
export default function startStudy(d) {
  state.sheet = null;
  if (d.mode === 'blitz') return openGame(d.scope);
  return d.mode === 'quest' ? openQuest(d.scope) : openStudy(d.mode, d.scope);
}
