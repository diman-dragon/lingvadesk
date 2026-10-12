import { state } from '../state/appState.js';
import ttsStop from '../native/ttsStop.js';
import popBack from './popBack.js';
import render from './render.js';
/** Системная «Назад»: ровно один шаг назад; на первом экране (библиотека) остаёмся — приложение не закрывается. */
export default async function systemBack() {
  await ttsStop().catch(() => {});
  if (await popBack() || state.nav.v === 'library') return;
  state.nav = { v: 'library' };
  state.anim = 'view-in';
  state.page = 0;
  await render();
}
