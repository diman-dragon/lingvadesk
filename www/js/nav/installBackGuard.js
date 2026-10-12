import { state } from '../state/appState.js';
/** Страж истории: «Назад» идёт по шагам до библиотеки и дальше не выходит из приложения. */
export default function installBackGuard() {
  const h = globalThis.history;
  if (!h) return;
  h.replaceState({ guard: true }, '');
  h.pushState({ nav: state.nav }, '');
}
