import { SWIPE } from '../constants/SWIPE.js';
import actions from '../actions/index.js';
import springBack from './springBack.js';
import flyOut from './flyOut.js';
/** Карточки листаются по кругу: влево — следующая, вправо — предыдущая. */
export default async function finishCardSwipe(el, dx) {
  if (Math.abs(dx) < SWIPE.distance) return springBack(el);
  const forward = dx < 0;
  await flyOut(el, forward);
  await (forward ? actions.skip() : actions.prev());
}
