import { swipe } from './swipeState.js';
import finishCardSwipe from './finishCardSwipe.js';
import finishAreaSwipe from './finishAreaSwipe.js';
export default async function onPointerUp(e) {
  const { el, moved, dx, kind } = swipe;
  if (!el || e.pointerId !== swipe.id) return;
  swipe.el = null;
  swipe.suppress = moved;
  if (!moved) return;
  return kind === 'card' ? finishCardSwipe(el, dx) : finishAreaSwipe(dx);
}
