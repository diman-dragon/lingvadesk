import { state } from '../state/appState.js';
import { NAV_STACK_MAX } from '../constants/NAV_STACK_MAX.js';
import render from './render.js';
/** Переход на экран = шаг в стеке («Назад» вернёт на него). Повторный переход на тот же экран стек не растит. */
export default function go(view, params = {}, anim = 'view-in') {
  const next = { v: view, ...params };
  if (JSON.stringify(next) !== JSON.stringify(state.nav)) {
    state.stack.push(state.nav);
    if (state.stack.length > NAV_STACK_MAX) state.stack.shift();
  }
  state.nav = next;
  state.revealed = false;
  state.sheet = null;
  state.anim = anim;
  state.page = 0;
  return render();
}
