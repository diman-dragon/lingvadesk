import { state } from '../state/appState.js';
import render from '../nav/render.js';
/** Системная кнопка «Назад». Если экран ссылается на удалённый объект — возврат в библиотеку. */
export default async function handlePopState(e) {
  const nav = e.state?.nav ?? { v: 'today' };
  state.nav = nav.v === 'study' && !state.session ? { v: 'today' } : nav;
  state.revealed = false;
  state.anim = 'view-in';
  try { await render(); } catch { state.nav = { v: 'library' }; await render(); }
}
