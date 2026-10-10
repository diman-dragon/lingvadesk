import { state } from '../state/appState.js';
import render from './render.js';
/** Переход на экран; добавляет запись в историю, чтобы работала кнопка «Назад». */
export default function go(view, params = {}) {
  state.nav = { v: view, ...params };
  state.revealed = false;
  state.anim = 'view-in';
  globalThis.history?.pushState({ nav: state.nav }, '');
  globalThis.scrollTo?.(0, 0);
  return render();
}
