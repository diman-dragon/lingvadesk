import { state } from '../state/appState.js';
import { RING } from '../constants/RING.js';
import go from './go.js';
/** Переход к соседнему верхнеуровневому экрану по кругу; назад — на последнюю страницу соседа. */
export default function switchRing(delta) {
  const i = RING.indexOf(state.nav.v);
  state.landing = delta < 0 ? 'last' : null;
  return go(RING[(i + delta + RING.length) % RING.length], {}, delta > 0 ? 'slide-next' : 'slide-prev');
}
