import { state } from '../state/appState.js';
import render from '../nav/render.js';
/** Системная «Назад»: шаг назад; у стража — остаёмся в библиотеке. Битая ссылка → библиотека. */
export default async function handlePopState(e) {
  if (e.state?.guard) {
    globalThis.history.pushState({ nav: { v: 'library' } }, '');
    state.nav = { v: 'library' };
  } else {
    const nav = e.state?.nav ?? { v: 'library' };
    state.nav = nav.v === 'session' && !state.session ? { v: 'study' } : nav;
  }
  state.revealed = false;
  state.anim = 'view-in';
  state.page = 0;
  try { await render(); } catch { state.nav = { v: 'library' }; await render(); }
}
