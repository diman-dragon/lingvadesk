import { state } from '../state/appState.js';
import openStudy from '../study/openStudy.js';
import openGame from '../game/openGame.js';
/** Из меню колод: data-mode — режим ('game' — игра), data-scope — 'all' | 'd:<id>'. */
export default function startStudy(d) {
  state.sheet = null;
  return d.mode === 'game' ? openGame(d.scope) : openStudy(d.mode, d.scope);
}
