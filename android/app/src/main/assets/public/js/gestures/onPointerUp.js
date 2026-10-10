import { state } from '../state/appState.js';
import { SWIPE } from '../constants/SWIPE.js';
import actions from '../actions/index.js';
import { swipe } from './swipeState.js';
import springBack from './springBack.js';
import flyOut from './flyOut.js';
/** Свайп влево — следующая карточка, вправо — предыдущая. На первой карточке «назад» некуда. */
export default async function onPointerUp(e) {
  const { el, moved, dx } = swipe;
  if (!el || e.pointerId !== swipe.id) return;
  swipe.el = null;
  swipe.suppress = moved;
  if (!moved) return;
  const forward = dx < 0;
  if (Math.abs(dx) < SWIPE.distance || (!forward && state.session?.pos === 0)) return springBack(el);
  await flyOut(el, forward);
  await (forward ? actions.skip() : actions.prev());
}
