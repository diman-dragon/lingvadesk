import actions from '../actions/index.js';
import springBack from './springBack.js';
import flyOut from './flyOut.js';
/** Карточки листаются по кругу: влево — следующая, вправо — предыдущая. ok — жест засчитан. */
export default async function finishCardSwipe(el, dx, ok) {
  if (!ok) return springBack(el);
  const forward = dx < 0;
  await flyOut(el, forward);
  await (forward ? actions.skip() : actions.prev());
}
