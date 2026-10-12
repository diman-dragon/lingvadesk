import { swipe } from './swipeState.js';
import isSwipe from './isSwipe.js';
import finishCardSwipe from './finishCardSwipe.js';
import finishAreaSwipe from './finishAreaSwipe.js';
export default async function onPointerUp(e) {
  const { el, moved, dx, kind, t0 } = swipe;
  if (!el || e.pointerId !== swipe.id) return;
  swipe.el = null;
  swipe.suppress = moved;
  if (!moved) return;
  const ok = isSwipe(dx, Date.now() - t0);
  return kind === 'card' ? finishCardSwipe(el, dx, ok) : finishAreaSwipe(dx, ok);
}
