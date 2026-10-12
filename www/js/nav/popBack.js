import { state } from '../state/appState.js';
import render from './render.js';
/** Шаг назад. Экраны, которых уже нет (удалили проект, колоду), пропускаются. false — вернуться некуда. */
export default async function popBack() {
  while (state.stack.length) {
    const prev = state.nav;
    state.nav = state.stack.pop();
    state.revealed = false;
    state.anim = 'view-in';
    state.page = 0;
    try { await render(); return true; } catch { state.nav = prev; }
  }
  return false;
}
