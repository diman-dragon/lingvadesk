import { state } from '../state/appState.js';
import render from './render.js';
/** Переход на экран = шаг в истории (кнопка «Назад» возвращает на шаг). Повторный переход на тот же экран историю не растит. */
export default function go(view, params = {}, anim = 'view-in') {
  const next = { v: view, ...params };
  const same = JSON.stringify(next) === JSON.stringify(state.nav);
  state.nav = next;
  state.revealed = false;
  state.anim = anim;
  state.page = 0;
  const h = globalThis.history;
  if (h) (same ? h.replaceState : h.pushState).call(h, { nav: next }, '');
  return render();
}
