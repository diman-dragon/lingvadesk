import { state } from '../state/appState.js';
import render from './render.js';
import trackShow from '../study/trackShow.js';
/** Шаг назад. Экраны, которых уже нет (удалили проект, колоду), пропускаются. false — вернуться некуда. Вернувшись в сессию, отсчёт времени карточки идёт заново. */
export default async function popBack() {
  while (state.stack.length) {
    const prev = state.nav;
    state.nav = state.stack.pop();
    state.revealed = false;
    state.anim = 'view-in';
    state.page = 0;
    try { await render(); if (state.nav.v === 'session') trackShow(state.session); return true; } catch { state.nav = prev; }
  }
  return false;
}
