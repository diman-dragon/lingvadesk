import { swipe } from './swipeState.js';
import springBack from './springBack.js';
import cancelHold from './cancelHold.js';
export default function onPointerCancel() {
  cancelHold();
  const { el, moved, kind } = swipe;
  swipe.el = null;
  if (el && moved && kind === 'card') springBack(el);
}
